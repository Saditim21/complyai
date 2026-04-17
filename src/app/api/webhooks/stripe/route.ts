import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import type { SubscriptionTier } from '@/lib/stripe/plans'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

interface WebhookResult {
  success: boolean
  message: string
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<WebhookResult> {
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const orgId = session.metadata?.organization_id

  if (!orgId) {
    return { success: false, message: 'No organization_id in session metadata' }
  }

  const supabase = await createClient()

  // Get the subscription to determine the tier
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0]?.price.id
  const tier = getTierFromPriceId(priceId)

  const { error } = await supabase
    .from('organizations')
    .update({
      stripe_customer_id: customerId,
      subscription_tier: tier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orgId)

  if (error) {
    return { success: false, message: `Database update failed: ${error.message}` }
  }

  return { success: true, message: `Subscription activated for org ${orgId}` }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0]?.price.id
  const tier = getTierFromPriceId(priceId)

  const supabase = await createClient()

  // Find organization by stripe_customer_id
  const { data: org, error: fetchError } = await supabase
    .from('organizations')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (fetchError || !org) {
    return { success: false, message: `Organization not found for customer ${customerId}` }
  }

  const { error } = await supabase
    .from('organizations')
    .update({
      subscription_tier: tier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', org.id)

  if (error) {
    return { success: false, message: `Database update failed: ${error.message}` }
  }

  return { success: true, message: `Subscription updated to ${tier} for org ${org.id}` }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<WebhookResult> {
  const customerId = subscription.customer as string

  const supabase = await createClient()

  // Find organization by stripe_customer_id
  const { data: org, error: fetchError } = await supabase
    .from('organizations')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (fetchError || !org) {
    return { success: false, message: `Organization not found for customer ${customerId}` }
  }

  // Downgrade to free tier
  const { error } = await supabase
    .from('organizations')
    .update({
      subscription_tier: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('id', org.id)

  if (error) {
    return { success: false, message: `Database update failed: ${error.message}` }
  }

  return { success: true, message: `Subscription cancelled for org ${org.id}, downgraded to free` }
}

function getTierFromPriceId(priceId: string): SubscriptionTier {
  const starterMonthly = process.env.STRIPE_PRICE_STARTER_MONTHLY
  const starterYearly = process.env.STRIPE_PRICE_STARTER_YEARLY
  const businessMonthly = process.env.STRIPE_PRICE_BUSINESS_MONTHLY
  const businessYearly = process.env.STRIPE_PRICE_BUSINESS_YEARLY
  const proMonthly = process.env.STRIPE_PRICE_PRO_MONTHLY
  const proYearly = process.env.STRIPE_PRICE_PRO_YEARLY

  if (priceId === starterMonthly || priceId === starterYearly) {
    return 'starter'
  }
  if (priceId === businessMonthly || priceId === businessYearly) {
    return 'business'
  }
  if (priceId === proMonthly || priceId === proYearly) {
    return 'pro'
  }

  return 'free'
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed: ${message}`)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  let result: WebhookResult

  switch (event.type) {
    case 'checkout.session.completed':
      result = await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break
    case 'customer.subscription.updated':
      result = await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      break
    case 'customer.subscription.deleted':
      result = await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break
    default:
      result = { success: true, message: `Unhandled event type: ${event.type}` }
  }

  if (!result.success) {
    console.error(`Webhook handler failed: ${result.message}`)
  }

  return NextResponse.json({ received: true, message: result.message })
}
