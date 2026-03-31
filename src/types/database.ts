// Database types for Supabase tables

export type RiskLevel = 'minimal' | 'limited' | 'high' | 'unacceptable'

export type ComplianceStatus = 'not_started' | 'in_progress' | 'compliant' | 'non_compliant'

export type RequirementStatus = 'pending' | 'in_progress' | 'completed' | 'not_applicable'

export type RequirementType =
  | 'risk_management'
  | 'data_governance'
  | 'documentation'
  | 'transparency'
  | 'human_oversight'
  | 'registration'

export type AnnexIIIDomain =
  | 'biometrics'
  | 'critical_infrastructure'
  | 'education'
  | 'employment'
  | 'essential_services'
  | 'law_enforcement'
  | 'migration'
  | 'justice'

export type DataType =
  | 'personal_data'
  | 'biometric'
  | 'financial'
  | 'health'
  | 'location'
  | 'behavioral'

// AI System types
export interface AISystem {
  id: string
  organization_id: string
  name: string
  description: string | null
  vendor: string | null
  category: string
  risk_level: RiskLevel | null
  annex_iii_domain: AnnexIIIDomain | null
  is_provider: boolean
  classification_rationale: string | null
  compliance_status: ComplianceStatus
  compliance_score: number
  data_types_processed: DataType[]
  created_at: string
  updated_at: string
}

export interface AISystemInsert {
  organization_id: string
  name: string
  description?: string | null
  vendor?: string | null
  category: string
  risk_level?: RiskLevel | null
  annex_iii_domain?: AnnexIIIDomain | null
  is_provider?: boolean
  classification_rationale?: string | null
  compliance_status?: ComplianceStatus
  compliance_score?: number
  data_types_processed?: DataType[]
}

export interface AISystemUpdate {
  name?: string
  description?: string | null
  vendor?: string | null
  category?: string
  risk_level?: RiskLevel | null
  annex_iii_domain?: AnnexIIIDomain | null
  is_provider?: boolean
  classification_rationale?: string | null
  compliance_status?: ComplianceStatus
  compliance_score?: number
  data_types_processed?: DataType[]
}

// Compliance Requirement types
export interface ComplianceRequirement {
  id: string
  ai_system_id: string
  article_reference: string
  requirement_type: RequirementType
  title: string
  description: string
  status: RequirementStatus
  due_date: string | null
  completed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ComplianceRequirementInsert {
  ai_system_id: string
  article_reference: string
  requirement_type: RequirementType
  title: string
  description: string
  status?: RequirementStatus
  due_date?: string | null
  notes?: string | null
}

export interface ComplianceRequirementUpdate {
  article_reference?: string
  requirement_type?: RequirementType
  title?: string
  description?: string
  status?: RequirementStatus
  due_date?: string | null
  completed_at?: string | null
  notes?: string | null
}

// AI System with requirements (for detail views)
export interface AISystemWithRequirements extends AISystem {
  compliance_requirements: ComplianceRequirement[]
}

// Organization types
export interface Organization {
  id: string
  name: string
  sector: string | null
  employee_count: number | null
  country: string
  stripe_customer_id: string | null
  subscription_tier: string
  created_at: string
  updated_at: string
}

// User types
export interface User {
  id: string
  organization_id: string | null
  email: string
  full_name: string | null
  role: 'owner' | 'admin' | 'member'
  created_at: string
}
