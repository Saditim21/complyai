import { NextResponse } from 'next/server'
import { z } from 'zod'

import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/stripe/plans'

const checkoutSchema = z.object({
  tier: z.enum(['starter', 'business', 'pro']),
  billingPeriod: z.enum(['monthly', 'yearly']),
})

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's organization
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (userError || !userData?.organization_id) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Get organization details
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, stripe_customer_id')
      .eq('id', userData.organization_id)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { tier, billingPeriod } = parsed.data

    // Get the plan
    const plan = PLANS.find((p) => p.tier === tier)
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Get the correct price ID
    const priceId = billingPeriod === 'monthly'
      ? plan.stripePriceIdMonthly
      : plan.stripePriceIdYearly

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price not configured for this plan' },
        { status: 500 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    // Create or retrieve Stripe customer
    let customerId = org.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: org.name,
        metadata: {
          organization_id: org.id,
        },
      })
      customerId = customer.id

      // Save customer ID to organization
      await supabase
        .from('organizations')
        .update({ stripe_customer_id: customerId })
        .eq('id', org.id)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/settings?success=true`,
      cancel_url: `${appUrl}/dashboard/settings?canceled=true`,
      metadata: {
        organization_id: org.id,
      },
      subscription_data: {
        metadata: {
          organization_id: org.id,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Checkout failed: ${message}` },
      { status: 500 }
    )
  }
}
