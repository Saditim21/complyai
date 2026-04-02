import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { getAISystem, getUserByAuthId, createDocument } from '@/lib/supabase/queries'
import { generateComplianceDocument } from '@/lib/documents/generator'

import type { Organization, DocumentInsert } from '@/types/database'
import type { DocumentType } from '@/types/documents'

const requestSchema = z.object({
  aiSystemId: z.string().uuid(),
  documentType: z.enum(['technical_documentation', 'risk_management_plan', 'transparency_notice']),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { aiSystemId, documentType } = parsed.data

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)
  if (!dbUser?.organization_id) {
    return NextResponse.json({ error: 'User has no organization' }, { status: 400 })
  }

  const { data: aiSystem, error: systemError } = await getAISystem(supabase, aiSystemId)
  if (systemError || !aiSystem) {
    return NextResponse.json({ error: 'AI system not found' }, { status: 404 })
  }

  if (aiSystem.organization_id !== dbUser.organization_id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  const { data: orgData } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', dbUser.organization_id)
    .single()

  if (!orgData) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }

  const organization: Organization = orgData as Organization

  const result = await generateComplianceDocument(
    documentType as DocumentType,
    aiSystem,
    organization
  )

  if (!result.success && !result.document) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  if (!result.document) {
    return NextResponse.json({ error: 'Document generation failed' }, { status: 500 })
  }

  // Save document to database
  const documentInsert: DocumentInsert = {
    organization_id: dbUser.organization_id,
    ai_system_id: aiSystemId,
    document_type: documentType,
    title: result.document.title,
    content: {
      aiSystemName: result.document.aiSystemName,
      organizationName: result.document.organizationName,
      sections: result.document.sections,
    },
    version: result.document.version,
    status: result.document.status,
  }

  const { data: savedDocument, error: saveError } = await createDocument(supabase, documentInsert)

  if (saveError || !savedDocument) {
    return NextResponse.json(
      {
        error: 'Document generated but failed to save',
        document: result.document,
        warning: saveError?.message,
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: result.success,
    documentId: savedDocument.id,
    warning: result.error,
  })
}
