import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  full_name: z.string().min(1).max(200),
  company_name: z.string().min(1).max(200),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { full_name, company_name } = parsed.data

  const admin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check if profile already exists (idempotent)
  const { data: existing } = await admin
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ success: true }, { status: 200 })
  }

  const { data: org, error: orgError } = await admin
    .from('organizations')
    .insert({ name: company_name })
    .select('id')
    .single()

  if (orgError || !org) {
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
  }

  const { error: userError } = await admin.from('users').insert({
    id: user.id,
    organization_id: org.id,
    email: user.email!,
    full_name,
    role: 'owner',
  })

  if (userError) {
    await admin.from('organizations').delete().eq('id', org.id)
    return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
