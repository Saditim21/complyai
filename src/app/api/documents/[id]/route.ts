import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { getDocument, updateDocument, getUserByAuthId } from '@/lib/supabase/queries'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.object({
    aiSystemName: z.string(),
    organizationName: z.string(),
    sections: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      content: z.string(),
      isRequired: z.boolean(),
      articleReference: z.string(),
    })),
  }).optional(),
  status: z.enum(['draft', 'review', 'approved']).optional(),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)
  if (!dbUser?.organization_id) {
    return NextResponse.json({ error: 'User has no organization' }, { status: 400 })
  }

  const { data: document, error } = await getDocument(supabase, id)

  if (error || !document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  if (document.organization_id !== dbUser.organization_id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  return NextResponse.json({ document })
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params
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

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)
  if (!dbUser?.organization_id) {
    return NextResponse.json({ error: 'User has no organization' }, { status: 400 })
  }

  const { data: existingDoc, error: fetchError } = await getDocument(supabase, id)

  if (fetchError || !existingDoc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  if (existingDoc.organization_id !== dbUser.organization_id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  const { data: updatedDoc, error: updateError } = await updateDocument(
    supabase,
    id,
    parsed.data
  )

  if (updateError || !updatedDoc) {
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }

  return NextResponse.json({ document: updatedDoc })
}
