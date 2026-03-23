import { type NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url))
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.session) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  const { user } = data.session
  const { full_name, company_name } = (user.user_metadata ?? {}) as {
    full_name?: string
    company_name?: string
  }

  // Only create org + user records for new signups (metadata present, no existing record)
  if (full_name && company_name) {
    const admin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: existing } = await admin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existing) {
      const { data: org } = await admin
        .from('organizations')
        .insert({ name: company_name })
        .select('id')
        .single()

      if (org) {
        await admin.from('users').insert({
          id: user.id,
          organization_id: org.id,
          email: user.email!,
          full_name,
          role: 'owner',
        })
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
