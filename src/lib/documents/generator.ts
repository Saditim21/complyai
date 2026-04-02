import { generateDocument } from '@/lib/claude'
import { getTemplateForType, getApplicableTemplates } from '@/lib/documents/templates'

import type { AISystem, Organization } from '@/types/database'
import type {
  DocumentType,
  GeneratedDocument,
  DocumentGenerationResult,
  DocumentTemplate,
} from '@/types/documents'

function generateDocumentVersion(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}-draft`
}

export async function generateComplianceDocument(
  type: DocumentType,
  aiSystem: AISystem,
  organization: Organization
): Promise<DocumentGenerationResult> {
  const template = getTemplateForType(type)

  if (!template.applicableRiskLevels.includes(aiSystem.risk_level ?? 'minimal')) {
    return {
      success: false,
      document: null,
      error: `${template.title} is not required for ${aiSystem.risk_level ?? 'minimal'} risk AI systems`,
    }
  }

  const result = await generateDocument(type, aiSystem, organization)

  if (!result.success && result.sections.length === 0) {
    return {
      success: false,
      document: null,
      error: result.error ?? 'Failed to generate document sections',
    }
  }

  const document: GeneratedDocument = {
    type,
    title: template.title,
    aiSystemId: aiSystem.id,
    aiSystemName: aiSystem.name,
    organizationName: organization.name,
    sections: result.sections,
    generatedAt: new Date().toISOString(),
    version: generateDocumentVersion(),
    status: 'draft',
  }

  return {
    success: result.success,
    document,
    error: result.error,
  }
}

export interface DocumentRequirement {
  type: DocumentType
  template: DocumentTemplate
  isRequired: boolean
  reason: string
}

export function getRequiredDocuments(aiSystem: AISystem): DocumentRequirement[] {
  const riskLevel = aiSystem.risk_level ?? 'minimal'
  const requirements: DocumentRequirement[] = []

  if (riskLevel === 'high') {
    requirements.push({
      type: 'technical_documentation',
      template: getTemplateForType('technical_documentation'),
      isRequired: true,
      reason: 'Required for all high-risk AI systems under Annex IV',
    })

    requirements.push({
      type: 'risk_management_plan',
      template: getTemplateForType('risk_management_plan'),
      isRequired: true,
      reason: 'Required for all high-risk AI systems under Article 9',
    })

    requirements.push({
      type: 'transparency_notice',
      template: getTemplateForType('transparency_notice'),
      isRequired: true,
      reason: 'Required for all high-risk AI systems under Article 13',
    })
  } else if (riskLevel === 'limited') {
    requirements.push({
      type: 'transparency_notice',
      template: getTemplateForType('transparency_notice'),
      isRequired: true,
      reason: 'Required for limited-risk AI systems with transparency obligations under Article 50',
    })
  }

  return requirements
}

export function getOptionalDocuments(aiSystem: AISystem): DocumentRequirement[] {
  const riskLevel = aiSystem.risk_level ?? 'minimal'
  const required = getRequiredDocuments(aiSystem)
  const requiredTypes = new Set(required.map((r) => r.type))

  const allTemplates = getApplicableTemplates(riskLevel)
  const optional: DocumentRequirement[] = []

  for (const template of allTemplates) {
    if (!requiredTypes.has(template.type)) {
      optional.push({
        type: template.type,
        template,
        isRequired: false,
        reason: 'Optional documentation for enhanced compliance posture',
      })
    }
  }

  if (riskLevel === 'minimal') {
    optional.push({
      type: 'transparency_notice',
      template: getTemplateForType('transparency_notice'),
      isRequired: false,
      reason: 'Recommended for transparency even though not legally required',
    })
  }

  return optional
}

export function estimateGenerationTime(type: DocumentType): number {
  const template = getTemplateForType(type)
  const sectionsCount = template.sections.length
  return sectionsCount * 15
}

export function formatDocumentForExport(document: GeneratedDocument): string {
  const lines: string[] = []

  lines.push(`# ${document.title}`)
  lines.push('')
  lines.push(`**AI System:** ${document.aiSystemName}`)
  lines.push(`**Organization:** ${document.organizationName}`)
  lines.push(`**Generated:** ${new Date(document.generatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`)
  lines.push(`**Version:** ${document.version}`)
  lines.push(`**Status:** ${document.status.charAt(0).toUpperCase() + document.status.slice(1)}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const section of document.sections) {
    lines.push(`## ${section.title}`)
    lines.push('')
    lines.push(`*${section.articleReference}*`)
    lines.push('')
    lines.push(section.content)
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push('*This document was generated by ClarionAI to assist with EU AI Act compliance. It should be reviewed and approved by appropriate personnel before being used for regulatory purposes. ClarionAI does not provide legal advice.*')

  return lines.join('\n')
}
