import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { getUserByAuthId, updateRequirement } from '@/lib/supabase/queries'

const updateSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'not_applicable']),
})

interface RouteContext {
  params: Promise<{ id: string }>
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
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)
  if (!dbUser?.organization_id) {
    return NextResponse.json({ error: 'User has no organization' }, { status: 400 })
  }

  const completedAt = parsed.data.status === 'completed' ? new Date().toISOString() : null

  const { data, error } = await updateRequirement(supabase, id, {
    status: parsed.data.status,
    completed_at: completedAt,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ requirement: data })
}
