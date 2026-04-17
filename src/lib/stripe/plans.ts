export type SubscriptionTier = 'free' | 'starter' | 'business' | 'pro'

export interface PlanFeatures {
  maxAISystems: number
  documentExport: boolean
  fullDocs: boolean
  teamMembers: boolean
  whiteLabel: boolean
  prioritySupport: boolean
}

export interface Plan {
  tier: SubscriptionTier
  name: string
  description: string
  priceMonthly: number
  priceYearly: number
  stripePriceIdMonthly: string | null
  stripePriceIdYearly: string | null
  features: PlanFeatures
  highlighted: boolean
}

// Stripe Price IDs - replace these with actual IDs from your Stripe dashboard
// For now, using placeholder IDs that should be replaced after creating products in Stripe
export const STRIPE_PRICE_IDS = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY ?? '',
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY ?? '',
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? '',
  },
} as const

export const PLANS: Plan[] = [
  {
    tier: 'free',
    name: 'Free',
    description: 'Try ClarionAI with limited features',
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    features: {
      maxAISystems: 1,
      documentExport: false,
      fullDocs: false,
      teamMembers: false,
      whiteLabel: false,
      prioritySupport: false,
    },
    highlighted: false,
  },
  {
    tier: 'starter',
    name: 'Starter',
    description: 'For small businesses getting started with AI compliance',
    priceMonthly: 49,
    priceYearly: 468,
    stripePriceIdMonthly: STRIPE_PRICE_IDS.starter.monthly,
    stripePriceIdYearly: STRIPE_PRICE_IDS.starter.yearly,
    features: {
      maxAISystems: 5,
      documentExport: true,
      fullDocs: false,
      teamMembers: false,
      whiteLabel: false,
      prioritySupport: false,
    },
    highlighted: false,
  },
  {
    tier: 'business',
    name: 'Business',
    description: 'Full compliance toolkit for growing businesses',
    priceMonthly: 149,
    priceYearly: 1428,
    stripePriceIdMonthly: STRIPE_PRICE_IDS.business.monthly,
    stripePriceIdYearly: STRIPE_PRICE_IDS.business.yearly,
    features: {
      maxAISystems: 25,
      documentExport: true,
      fullDocs: true,
      teamMembers: true,
      whiteLabel: false,
      prioritySupport: false,
    },
    highlighted: true,
  },
  {
    tier: 'pro',
    name: 'Pro',
    description: 'Enterprise-grade compliance for large organizations',
    priceMonthly: 299,
    priceYearly: 2868,
    stripePriceIdMonthly: STRIPE_PRICE_IDS.pro.monthly,
    stripePriceIdYearly: STRIPE_PRICE_IDS.pro.yearly,
    features: {
      maxAISystems: -1, // unlimited
      documentExport: true,
      fullDocs: true,
      teamMembers: true,
      whiteLabel: true,
      prioritySupport: true,
    },
    highlighted: false,
  },
]

export function getPlanByTier(tier: SubscriptionTier): Plan | undefined {
  return PLANS.find((plan) => plan.tier === tier)
}

export function getPlanFeatures(tier: SubscriptionTier): PlanFeatures {
  const plan = getPlanByTier(tier)
  return plan?.features ?? PLANS[0].features
}

export function canAddMoreSystems(tier: SubscriptionTier, currentCount: number): boolean {
  const features = getPlanFeatures(tier)
  if (features.maxAISystems === -1) return true
  return currentCount < features.maxAISystems
}

export function canExportDocuments(tier: SubscriptionTier): boolean {
  return getPlanFeatures(tier).documentExport
}

export function hasFullDocs(tier: SubscriptionTier): boolean {
  return getPlanFeatures(tier).fullDocs
}

export function calculateYearlySavings(tier: SubscriptionTier): number {
  const plan = getPlanByTier(tier)
  if (!plan || plan.priceMonthly === 0) return 0
  return (plan.priceMonthly * 12) - plan.priceYearly
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
