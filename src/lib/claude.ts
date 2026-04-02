import Anthropic from '@anthropic-ai/sdk'

import type { AISystem, Organization } from '@/types/database'
import type { DocumentType, DocumentSection } from '@/types/documents'
import { getTemplateForType } from '@/lib/documents/templates'

let anthropicClient: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return anthropicClient
}

const DOCUMENT_SYSTEM_PROMPTS: Record<DocumentType, string> = {
  technical_documentation: `You are an EU AI Act compliance expert helping organizations create Technical Documentation as required by Annex IV of the EU AI Act (Regulation 2024/1689).

Your task is to generate professional, comprehensive documentation sections for AI systems. The documentation must:
- Be written in clear, professional English suitable for regulatory review
- Include specific, actionable details based on the AI system information provided
- Reference relevant EU AI Act articles where appropriate
- Be thorough but concise, avoiding unnecessary legal jargon
- Acknowledge limitations or areas requiring additional information from the organization

For each section, provide content that would satisfy regulatory requirements while being practical for SMB organizations to implement and maintain.`,

  risk_management_plan: `You are an EU AI Act compliance expert helping organizations create a Risk Management Plan as required by Article 9 of the EU AI Act (Regulation 2024/1689).

Your task is to generate comprehensive risk management documentation for AI systems. The documentation must:
- Identify realistic, foreseeable risks based on the AI system's purpose and data types
- Propose practical mitigation measures appropriate for SMB organizations
- Follow a systematic risk assessment methodology
- Be actionable and specific to the AI system being documented
- Consider risks to health, safety, and fundamental rights

Focus on generating content that helps organizations understand and manage real risks, not generic boilerplate.`,

  transparency_notice: `You are an EU AI Act compliance expert helping organizations create Transparency Notices as required by Article 13 of the EU AI Act (Regulation 2024/1689).

Your task is to generate clear, user-friendly transparency information for AI systems. The documentation must:
- Be written in plain language accessible to non-technical users
- Clearly explain what the AI system does and its limitations
- Inform users about data processing in an understandable way
- Explain human oversight measures and how users can seek redress
- Be honest about system capabilities without understating risks

The notice should help users make informed decisions about interacting with the AI system.`,
}

function buildUserPrompt(
  type: DocumentType,
  aiSystem: AISystem,
  organization: Organization,
  sectionId: string,
  sectionTitle: string,
  sectionDescription: string
): string {
  const dataTypesFormatted = aiSystem.data_types_processed.length > 0
    ? aiSystem.data_types_processed.join(', ')
    : 'Not specified'

  return `Generate content for the "${sectionTitle}" section of the ${type.replace(/_/g, ' ')}.

## AI System Information
- **System Name:** ${aiSystem.name}
- **Description:** ${aiSystem.description ?? 'No description provided'}
- **Vendor:** ${aiSystem.vendor ?? 'Internal/Unknown'}
- **Category:** ${aiSystem.category}
- **Risk Level:** ${aiSystem.risk_level ?? 'Not yet classified'}
- **Annex III Domain:** ${aiSystem.annex_iii_domain ?? 'Not applicable'}
- **Data Types Processed:** ${dataTypesFormatted}
- **Organization Role:** ${aiSystem.is_provider ? 'Provider (develops/trains the AI)' : 'Deployer (uses third-party AI)'}

## Organization Information
- **Organization Name:** ${organization.name}
- **Sector:** ${organization.sector ?? 'Not specified'}
- **Country:** ${organization.country}
- **Size:** ${organization.employee_count ? `${organization.employee_count} employees` : 'Not specified'}

## Section Requirements
${sectionDescription}

## Instructions
Generate professional, compliance-ready content for this section. The content should:
1. Be specific to this AI system and organization
2. Address all aspects mentioned in the section requirements
3. Be between 150-400 words
4. Use clear headings and bullet points where appropriate
5. Note any areas where additional information from the organization may be needed

Respond with ONLY the section content, no preamble or meta-commentary.`
}

export interface GenerateSectionResult {
  success: boolean
  content: string
  error: string | null
}

export async function generateDocumentSection(
  type: DocumentType,
  aiSystem: AISystem,
  organization: Organization,
  sectionId: string,
  sectionTitle: string,
  sectionDescription: string
): Promise<GenerateSectionResult> {
  try {
    const systemPrompt = DOCUMENT_SYSTEM_PROMPTS[type]
    const userPrompt = buildUserPrompt(
      type,
      aiSystem,
      organization,
      sectionId,
      sectionTitle,
      sectionDescription
    )

    const response = await getAnthropicClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return {
        success: false,
        content: '',
        error: 'No text content in response',
      }
    }

    return {
      success: true,
      content: textBlock.text,
      error: null,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      success: false,
      content: '',
      error: message,
    }
  }
}

export interface GenerateDocumentResult {
  success: boolean
  sections: DocumentSection[]
  error: string | null
}

export async function generateDocument(
  type: DocumentType,
  aiSystem: AISystem,
  organization: Organization
): Promise<GenerateDocumentResult> {
  const template = getTemplateForType(type)
  const sections: DocumentSection[] = []
  const errors: string[] = []

  for (const templateSection of template.sections) {
    const result = await generateDocumentSection(
      type,
      aiSystem,
      organization,
      templateSection.id,
      templateSection.title,
      templateSection.description
    )

    if (result.success) {
      sections.push({
        id: templateSection.id,
        title: templateSection.title,
        description: templateSection.description,
        content: result.content,
        isRequired: templateSection.isRequired,
        articleReference: templateSection.articleReference,
      })
    } else {
      errors.push(`Failed to generate ${templateSection.title}: ${result.error}`)
      sections.push({
        id: templateSection.id,
        title: templateSection.title,
        description: templateSection.description,
        content: `[Content generation failed. Please complete this section manually.]\n\nSection requirements: ${templateSection.description}`,
        isRequired: templateSection.isRequired,
        articleReference: templateSection.articleReference,
      })
    }
  }

  return {
    success: errors.length === 0,
    sections,
    error: errors.length > 0 ? errors.join('; ') : null,
  }
}
