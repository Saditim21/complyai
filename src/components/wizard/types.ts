import type { AISystemInput, ClassificationResult } from '@/types/classification'

export interface DiscoveryOption {
  id: string
  category: string
  label: string
  description: string
  defaultName: string
  keywords: string[]
}

export interface DiscoveryGroup {
  id: string
  name: string
  icon: string
  options: DiscoveryOption[]
}

export interface SystemDetails {
  id: string
  name: string
  vendor: string
  description: string
  affectedParties: string[]
  dataTypes: string[]
  affectsDecisions: boolean
  isProvider: boolean
  sourceOptionId: string
}

export interface SystemWithClassification extends SystemDetails {
  classification: ClassificationResult
  aiSystemInput: AISystemInput
}

export interface WizardData {
  selectedOptions: string[]
  otherSystems: string
  systems: SystemDetails[]
  classifiedSystems: SystemWithClassification[]
}

export const INITIAL_WIZARD_DATA: WizardData = {
  selectedOptions: [],
  otherSystems: '',
  systems: [],
  classifiedSystems: [],
}

export const AFFECTED_PARTIES_OPTIONS = [
  { value: 'employees', label: 'Employees' },
  { value: 'customers', label: 'Customers' },
  { value: 'job_candidates', label: 'Job candidates' },
  { value: 'public', label: 'General public' },
] as const

export const DATA_TYPES_OPTIONS = [
  { value: 'personal_data', label: 'Personal data (names, emails, etc.)' },
  { value: 'biometric', label: 'Biometric data (face, fingerprint, voice)' },
  { value: 'financial', label: 'Financial data' },
  { value: 'health', label: 'Health data' },
  { value: 'employment', label: 'Employment data (CV, performance)' },
  { value: 'none', label: 'None of these' },
] as const
