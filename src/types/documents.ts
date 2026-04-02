// Document types for EU AI Act compliance documents

export type DocumentType =
  | 'technical_documentation'
  | 'risk_management_plan'
  | 'transparency_notice'

export interface DocumentSection {
  id: string
  title: string
  description: string
  content: string
  isRequired: boolean
  articleReference: string
}

export interface DocumentTemplate {
  type: DocumentType
  title: string
  description: string
  articleReference: string
  applicableRiskLevels: ('minimal' | 'limited' | 'high' | 'unacceptable')[]
  sections: Omit<DocumentSection, 'content'>[]
}

export interface GeneratedDocument {
  type: DocumentType
  title: string
  aiSystemId: string
  aiSystemName: string
  organizationName: string
  sections: DocumentSection[]
  generatedAt: string
  version: string
  status: 'draft' | 'review' | 'approved'
}

export interface DocumentGenerationRequest {
  type: DocumentType
  aiSystemId: string
}

export interface DocumentGenerationResult {
  success: boolean
  document: GeneratedDocument | null
  error: string | null
}
