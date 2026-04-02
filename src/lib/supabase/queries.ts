import { SupabaseClient } from '@supabase/supabase-js'

import type {
  AISystem,
  AISystemInsert,
  AISystemUpdate,
  AISystemWithRequirements,
  ComplianceRequirement,
  ComplianceRequirementInsert,
  ComplianceRequirementUpdate,
  Document,
  DocumentInsert,
  DocumentUpdate,
  DocumentWithSystem,
  User,
} from '@/types/database'

// Error type for query results
export interface QueryError {
  message: string
  code?: string
}

export interface QueryResult<T> {
  data: T | null
  error: QueryError | null
}

// User queries

export async function getUserByAuthId(
  supabase: SupabaseClient,
  authId: string
): Promise<QueryResult<User>> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authId)
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as User, error: null }
}

// AI Systems queries

export async function getAISystems(
  supabase: SupabaseClient,
  orgId: string
): Promise<QueryResult<AISystem[]>> {
  const { data, error } = await supabase
    .from('ai_systems')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as AISystem[], error: null }
}

export async function getAISystem(
  supabase: SupabaseClient,
  id: string
): Promise<QueryResult<AISystemWithRequirements>> {
  const { data, error } = await supabase
    .from('ai_systems')
    .select(`
      *,
      compliance_requirements (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as AISystemWithRequirements, error: null }
}

export async function createAISystem(
  supabase: SupabaseClient,
  data: AISystemInsert
): Promise<QueryResult<AISystem>> {
  const { data: insertedData, error } = await supabase
    .from('ai_systems')
    .insert(data)
    .select()
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: insertedData as AISystem, error: null }
}

export async function updateAISystem(
  supabase: SupabaseClient,
  id: string,
  data: AISystemUpdate
): Promise<QueryResult<AISystem>> {
  const { data: updatedData, error } = await supabase
    .from('ai_systems')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: updatedData as AISystem, error: null }
}

export async function deleteAISystem(
  supabase: SupabaseClient,
  id: string
): Promise<QueryResult<null>> {
  const { error } = await supabase
    .from('ai_systems')
    .delete()
    .eq('id', id)

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: null, error: null }
}

// Compliance Requirements queries

export async function getRequirements(
  supabase: SupabaseClient,
  aiSystemId: string
): Promise<QueryResult<ComplianceRequirement[]>> {
  const { data, error } = await supabase
    .from('compliance_requirements')
    .select('*')
    .eq('ai_system_id', aiSystemId)
    .order('created_at', { ascending: true })

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as ComplianceRequirement[], error: null }
}

export async function createRequirement(
  supabase: SupabaseClient,
  data: ComplianceRequirementInsert
): Promise<QueryResult<ComplianceRequirement>> {
  const { data: insertedData, error } = await supabase
    .from('compliance_requirements')
    .insert(data)
    .select()
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: insertedData as ComplianceRequirement, error: null }
}

export async function updateRequirement(
  supabase: SupabaseClient,
  id: string,
  data: ComplianceRequirementUpdate
): Promise<QueryResult<ComplianceRequirement>> {
  const { data: updatedData, error } = await supabase
    .from('compliance_requirements')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: updatedData as ComplianceRequirement, error: null }
}

export async function deleteRequirement(
  supabase: SupabaseClient,
  id: string
): Promise<QueryResult<null>> {
  const { error } = await supabase
    .from('compliance_requirements')
    .delete()
    .eq('id', id)

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: null, error: null }
}

// Bulk operations

export async function createRequirementsBulk(
  supabase: SupabaseClient,
  requirements: ComplianceRequirementInsert[]
): Promise<QueryResult<ComplianceRequirement[]>> {
  const { data, error } = await supabase
    .from('compliance_requirements')
    .insert(requirements)
    .select()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as ComplianceRequirement[], error: null }
}

// Stats queries

export interface AISystemStats {
  total: number
  byRiskLevel: Record<string, number>
  byStatus: Record<string, number>
  averageScore: number
}

export async function getAISystemStats(
  supabase: SupabaseClient,
  orgId: string
): Promise<QueryResult<AISystemStats>> {
  const { data, error } = await supabase
    .from('ai_systems')
    .select('risk_level, compliance_status, compliance_score')
    .eq('organization_id', orgId)

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  const systems = data as Pick<AISystem, 'risk_level' | 'compliance_status' | 'compliance_score'>[]

  const byRiskLevel: Record<string, number> = {}
  const byStatus: Record<string, number> = {}
  let totalScore = 0

  for (const system of systems) {
    const riskKey = system.risk_level ?? 'unclassified'
    byRiskLevel[riskKey] = (byRiskLevel[riskKey] ?? 0) + 1

    const statusKey = system.compliance_status
    byStatus[statusKey] = (byStatus[statusKey] ?? 0) + 1

    totalScore += system.compliance_score
  }

  const stats: AISystemStats = {
    total: systems.length,
    byRiskLevel,
    byStatus,
    averageScore: systems.length > 0 ? Math.round(totalScore / systems.length) : 0,
  }

  return { data: stats, error: null }
}

// Document queries

export async function getDocuments(
  supabase: SupabaseClient,
  orgId: string
): Promise<QueryResult<DocumentWithSystem[]>> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      ai_systems (name, risk_level)
    `)
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as DocumentWithSystem[], error: null }
}

export async function getDocumentsBySystem(
  supabase: SupabaseClient,
  aiSystemId: string
): Promise<QueryResult<Document[]>> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('ai_system_id', aiSystemId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as Document[], error: null }
}

export async function getDocument(
  supabase: SupabaseClient,
  id: string
): Promise<QueryResult<DocumentWithSystem>> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      ai_systems (name, risk_level)
    `)
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as DocumentWithSystem, error: null }
}

export async function createDocument(
  supabase: SupabaseClient,
  data: DocumentInsert
): Promise<QueryResult<Document>> {
  const { data: insertedData, error } = await supabase
    .from('documents')
    .insert(data)
    .select()
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: insertedData as Document, error: null }
}

export async function updateDocument(
  supabase: SupabaseClient,
  id: string,
  data: DocumentUpdate
): Promise<QueryResult<Document>> {
  const { data: updatedData, error } = await supabase
    .from('documents')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: updatedData as Document, error: null }
}

export async function deleteDocument(
  supabase: SupabaseClient,
  id: string
): Promise<QueryResult<null>> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: null, error: null }
}

// Roadmap queries

export interface RequirementWithSystem extends ComplianceRequirement {
  ai_systems: Pick<AISystem, 'id' | 'name' | 'risk_level'>
}

export async function getAllRequirements(
  supabase: SupabaseClient,
  orgId: string
): Promise<QueryResult<RequirementWithSystem[]>> {
  const { data, error } = await supabase
    .from('compliance_requirements')
    .select(`
      *,
      ai_systems!inner (id, name, risk_level, organization_id)
    `)
    .eq('ai_systems.organization_id', orgId)
    .order('due_date', { ascending: true, nullsFirst: false })

  if (error) {
    return { data: null, error: { message: error.message, code: error.code } }
  }

  return { data: data as RequirementWithSystem[], error: null }
}
