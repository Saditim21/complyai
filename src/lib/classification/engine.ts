import type { AISystemInput, ClassificationResult, AnnexIIIDomainId } from '@/types/classification'

import {
  ANNEX_III_DOMAINS,
  PROHIBITED_PRACTICES,
  TRANSPARENCY_OBLIGATIONS,
  ARTICLE_6_EXCEPTIONS,
} from './categories'
import { getRequirementsForRiskLevel } from './requirements'

interface AnnexIIIMatch {
  domainId: AnnexIIIDomainId
  domainName: string
  subCategoryId: string
  subCategoryName: string
  articleReferences: string[]
  matchedKeywords: string[]
  confidence: 'high' | 'medium' | 'low'
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim()
}

function textContainsKeyword(text: string, keyword: string): boolean {
  const normalizedText = normalizeText(text)
  const normalizedKeyword = normalizeText(keyword)
  return normalizedText.includes(normalizedKeyword)
}

function checkProhibited(input: AISystemInput): { isProhibited: boolean; practice: string; article: string } | null {
  const combinedText = `${input.name} ${input.description} ${input.purpose}`.toLowerCase()

  for (const practice of PROHIBITED_PRACTICES) {
    const matchCount = practice.keywords.filter((kw) => textContainsKeyword(combinedText, kw)).length
    if (matchCount >= 2) {
      return { isProhibited: true, practice: practice.name, article: practice.articleReference }
    }
  }

  return null
}

function matchAnnexIII(input: AISystemInput): AnnexIIIMatch | null {
  const combinedText = `${input.name} ${input.description} ${input.purpose} ${input.category} ${input.sector}`.toLowerCase()
  let bestMatch: AnnexIIIMatch | null = null
  let bestScore = 0

  for (const domain of ANNEX_III_DOMAINS) {
    for (const subCategory of domain.subCategories) {
      const matchedKeywords = subCategory.keywords.filter((kw) => textContainsKeyword(combinedText, kw))
      const score = matchedKeywords.length

      if (score > bestScore) {
        bestScore = score
        const confidence = score >= 3 ? 'high' : score >= 2 ? 'medium' : 'low'
        bestMatch = {
          domainId: domain.id,
          domainName: domain.name,
          subCategoryId: subCategory.id,
          subCategoryName: subCategory.name,
          articleReferences: domain.articleReferences,
          matchedKeywords,
          confidence,
        }
      }
    }
  }

  return bestScore >= 1 ? bestMatch : null
}

function checkExceptions(input: AISystemInput, match: AnnexIIIMatch): { applies: boolean; exception: string } | null {
  const combinedText = `${input.description} ${input.purpose}`.toLowerCase()

  // Exception 1: Narrow procedural task
  const proceduralKeywords = ['convert', 'format', 'structure', 'organize', 'sort', 'filter basic', 'data entry']
  if (proceduralKeywords.some((kw) => combinedText.includes(kw)) && input.autonomyLevel === 'none') {
    return { applies: true, exception: ARTICLE_6_EXCEPTIONS[0].name }
  }

  // Exception 2: Improves human activity
  const improveKeywords = ['assist', 'support', 'help', 'aid', 'review after', 'quality check']
  if (improveKeywords.some((kw) => combinedText.includes(kw)) && !input.affectsDecisions) {
    return { applies: true, exception: ARTICLE_6_EXCEPTIONS[1].name }
  }

  // Exception 3: Pattern detection without replacement
  const patternKeywords = ['analyze pattern', 'identify trend', 'detect anomaly', 'statistical analysis']
  if (patternKeywords.some((kw) => combinedText.includes(kw)) && input.autonomyLevel !== 'full') {
    return { applies: true, exception: ARTICLE_6_EXCEPTIONS[2].name }
  }

  // Exception 4: Preparatory task
  const prepKeywords = ['prepare', 'preliminary', 'initial screening', 'first pass', 'pre-filter']
  if (prepKeywords.some((kw) => combinedText.includes(kw)) && input.autonomyLevel === 'assisted') {
    return { applies: true, exception: ARTICLE_6_EXCEPTIONS[3].name }
  }

  return null
}

function checkTransparency(input: AISystemInput): { required: boolean; obligations: string[]; articles: string[] } {
  const combinedText = `${input.name} ${input.description} ${input.purpose} ${input.category}`.toLowerCase()
  const obligations: string[] = []
  const articles: string[] = []

  for (const obligation of TRANSPARENCY_OBLIGATIONS) {
    if (obligation.triggers.some((trigger) => textContainsKeyword(combinedText, trigger))) {
      obligations.push(obligation.name)
      articles.push(obligation.articleReference)
    }
  }

  if (input.interactsWithPublic && combinedText.includes('chat')) {
    if (!obligations.includes(TRANSPARENCY_OBLIGATIONS[0].name)) {
      obligations.push(TRANSPARENCY_OBLIGATIONS[0].name)
      articles.push(TRANSPARENCY_OBLIGATIONS[0].articleReference)
    }
  }

  if (input.generatesContent) {
    if (!obligations.includes(TRANSPARENCY_OBLIGATIONS[1].name)) {
      obligations.push(TRANSPARENCY_OBLIGATIONS[1].name)
      articles.push(TRANSPARENCY_OBLIGATIONS[1].articleReference)
    }
  }

  return { required: obligations.length > 0, obligations, articles: [...new Set(articles)] }
}

function buildRationale(
  input: AISystemInput,
  result: Partial<ClassificationResult>,
  match: AnnexIIIMatch | null,
  exception: { applies: boolean; exception: string } | null,
  transparency: { required: boolean; obligations: string[] }
): string {
  const parts: string[] = []

  if (result.riskLevel === 'unacceptable') {
    parts.push(`This AI system is classified as UNACCEPTABLE RISK because it appears to involve a prohibited practice under the EU AI Act.`)
  } else if (result.riskLevel === 'high') {
    parts.push(`This AI system is classified as HIGH RISK because it falls under Annex III domain "${match?.domainName}" (${match?.subCategoryName}).`)
    if (match?.matchedKeywords.length) {
      parts.push(`Matching indicators: ${match.matchedKeywords.join(', ')}.`)
    }
  } else if (result.riskLevel === 'limited') {
    if (exception?.applies) {
      parts.push(`This AI system would normally be high-risk under Annex III, but qualifies for an exception: "${exception.exception}" (Art. 6(3)).`)
    }
    if (transparency.required) {
      parts.push(`This AI system requires transparency obligations: ${transparency.obligations.join(', ')}.`)
    }
  } else {
    parts.push(`This AI system is classified as MINIMAL RISK. It does not fall under any high-risk category and has no specific transparency obligations.`)
  }

  if (input.affectsDecisions && result.riskLevel !== 'high') {
    parts.push(`Note: This system affects decisions about individuals, so careful monitoring is recommended.`)
  }

  return parts.join(' ')
}

export function classifyRisk(input: AISystemInput): ClassificationResult {
  // Step 1: Check for prohibited practices (Art. 5)
  const prohibited = checkProhibited(input)
  if (prohibited) {
    return {
      riskLevel: 'unacceptable',
      annexDomain: null,
      subCategory: null,
      articleReferences: [prohibited.article],
      rationale: `This AI system is classified as UNACCEPTABLE RISK because it involves "${prohibited.practice}", which is prohibited under ${prohibited.article} of the EU AI Act.`,
      requirements: ['Immediately cease use of this AI system. Prohibited AI practices cannot be deployed in the EU market.'],
      confidence: 'high',
      exceptions: [],
    }
  }

  // Step 2: Check Annex III high-risk domains
  const annexMatch = matchAnnexIII(input)
  if (annexMatch && annexMatch.confidence !== 'low') {
    // Step 3: Check for exceptions (Art. 6(3))
    const exception = checkExceptions(input, annexMatch)
    if (exception?.applies) {
      const transparency = checkTransparency(input)
      const result: Partial<ClassificationResult> = {
        riskLevel: 'limited',
        annexDomain: annexMatch.domainId,
        subCategory: annexMatch.subCategoryId,
        articleReferences: [...annexMatch.articleReferences, 'Art. 6(3)', ...transparency.articles],
        confidence: annexMatch.confidence,
        exceptions: [exception.exception],
      }
      return {
        ...result,
        rationale: buildRationale(input, result, annexMatch, exception, transparency),
        requirements: getRequirementsForRiskLevel('limited'),
      } as ClassificationResult
    }

    // High risk without exception
    const result: Partial<ClassificationResult> = {
      riskLevel: 'high',
      annexDomain: annexMatch.domainId,
      subCategory: annexMatch.subCategoryId,
      articleReferences: annexMatch.articleReferences,
      confidence: annexMatch.confidence,
      exceptions: [],
    }
    return {
      ...result,
      rationale: buildRationale(input, result, annexMatch, null, { required: false, obligations: [] }),
      requirements: getRequirementsForRiskLevel('high'),
    } as ClassificationResult
  }

  // Step 4: Check transparency obligations (Art. 50)
  const transparency = checkTransparency(input)
  if (transparency.required) {
    return {
      riskLevel: 'limited',
      annexDomain: null,
      subCategory: null,
      articleReferences: transparency.articles,
      rationale: buildRationale(input, { riskLevel: 'limited' }, null, null, transparency),
      requirements: getRequirementsForRiskLevel('limited'),
      confidence: 'medium',
      exceptions: [],
    }
  }

  // Step 5: Default to minimal risk
  return {
    riskLevel: 'minimal',
    annexDomain: null,
    subCategory: null,
    articleReferences: [],
    rationale: buildRationale(input, { riskLevel: 'minimal' }, null, null, { required: false, obligations: [] }),
    requirements: getRequirementsForRiskLevel('minimal'),
    confidence: 'high',
    exceptions: [],
  }
}

export function getClassificationSummary(result: ClassificationResult): string {
  const levelLabels = {
    unacceptable: 'Prohibited',
    high: 'High Risk',
    limited: 'Limited Risk',
    minimal: 'Minimal Risk',
  }
  return levelLabels[result.riskLevel]
}
