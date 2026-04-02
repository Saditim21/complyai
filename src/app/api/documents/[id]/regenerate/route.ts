import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { getDocument, getAISystem, updateDocument, getUserByAuthId } from '@/lib/supabase/queries'
import { generateSectionContent } from '@/lib/claude'

import type { Organization } from '@/types/database'

const regenerateSchema = z.object({
  sectionId: z.string(),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(
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

  const parsed = regenerateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { sectionId } = parsed.data

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)
  if (!dbUser?.organization_id) {
    return NextResponse.json({ error: 'User has no organization' }, { status: 400 })
  }

  const { data: document, error: docError } = await getDocument(supabase, id)

  if (docError || !document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  if (document.organization_id !== dbUser.organization_id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  const sectionIndex = document.content.sections.findIndex(s => s.id === sectionId)
  if (sectionIndex === -1) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 })
  }

  const section = document.content.sections[sectionIndex]

  const { data: aiSystem, error: systemError } = await getAISystem(supabase, document.ai_system_id)
  if (systemError || !aiSystem) {
    return NextResponse.json({ error: 'AI system not found' }, { status: 404 })
  }

  const { data: orgData } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', dbUser.organization_id)
    .single()

  if (!orgData) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }

  const organization = orgData as Organization

  const result = await generateSectionContent(
    section.title,
    section.description,
    section.articleReference,
    aiSystem,
    organization
  )

  if (!result.success || !result.content) {
    return NextResponse.json(
      { error: result.error ?? 'Failed to regenerate section' },
      { status: 500 }
    )
  }

  const updatedSections = [...document.content.sections]
  updatedSections[sectionIndex] = {
    ...section,
    content: result.content,
  }

  const { data: updatedDoc, error: updateError } = await updateDocument(supabase, id, {
    content: {
      ...document.content,
      sections: updatedSections,
    },
  })

  if (updateError || !updatedDoc) {
    return NextResponse.json(
      { error: 'Failed to save regenerated section' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    section: updatedSections[sectionIndex],
  })
}
