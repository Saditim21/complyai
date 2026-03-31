// Risk classification types

export type RiskLevel = 'minimal' | 'limited' | 'high' | 'unacceptable'

export type AutonomyLevel = 'full' | 'assisted' | 'none'

export type AnnexIIIDomainId =
  | 'biometrics'
  | 'critical_infrastructure'
  | 'education'
  | 'employment'
  | 'essential_services'
  | 'law_enforcement'
  | 'migration'
  | 'justice'

export interface AISystemInput {
  name: string
  description: string
  purpose: string
  category: string
  sector: string
  dataTypes: string[]
  affectsDecisions: boolean
  profilesPersons: boolean
  autonomyLevel: AutonomyLevel
  isProvider: boolean
  interactsWithPublic: boolean
  generatesContent: boolean
  usesRealTimeIdentification: boolean
}

export interface SubCategory {
  id: string
  name: string
  description: string
  examples: string[]
  keywords: string[]
}

export interface AnnexIIIDomain {
  id: AnnexIIIDomainId
  name: string
  description: string
  articleReferences: string[]
  subCategories: SubCategory[]
}

export interface ClassificationResult {
  riskLevel: RiskLevel
  annexDomain: AnnexIIIDomainId | null
  subCategory: string | null
  articleReferences: string[]
  rationale: string
  requirements: string[]
  confidence: 'high' | 'medium' | 'low'
  exceptions: string[]
}

export interface ProhibitedPractice {
  id: string
  name: string
  description: string
  articleReference: string
  keywords: string[]
}

export interface TransparencyObligation {
  id: string
  name: string
  description: string
  articleReference: string
  triggers: string[]
}

export interface Article6Exception {
  id: string
  name: string
  description: string
  articleReference: string
}
