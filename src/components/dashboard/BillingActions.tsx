'use client'

import { useState } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { SubscriptionTier } from '@/lib/stripe/plans'

interface BillingActionsProps {
  currentTier: SubscriptionTier
  hasStripeCustomer: boolean
}

export function BillingActions({
  currentTier,
  hasStripeCustomer,
}: BillingActionsProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionTier | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (tier: SubscriptionTier): Promise<void> => {
    setIsLoading(true)
    setCheckoutTier(tier)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, billingPeriod }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
      setCheckoutTier(null)
    }
  }

  const handleManageBilling = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/billing-portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to create billing portal session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  if (currentTier === 'free') {
    return (
      <div className="mt-6 space-y-4">
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Billing period:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('yearly')}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly <span className="text-[#0D9488]">(Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleCheckout('starter')}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading && checkoutTier === 'starter' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Upgrade to Starter
                <ExternalLink className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
          <Button
            onClick={() => handleCheckout('business')}
            disabled={isLoading}
            className="bg-[#0D9488] hover:bg-[#14B8A6]"
          >
            {isLoading && checkoutTier === 'business' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Upgrade to Business
                <ExternalLink className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
          <Button
            onClick={() => handleCheckout('pro')}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading && checkoutTier === 'pro' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Upgrade to Pro
                <ExternalLink className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        {hasStripeCustomer && (
          <Button
            onClick={handleManageBilling}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Manage Subscription
                <ExternalLink className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}

        {currentTier !== 'pro' && (
          <Button
            onClick={() => handleCheckout('pro')}
            disabled={isLoading}
            className="bg-[#0D9488] hover:bg-[#14B8A6]"
          >
            {isLoading && checkoutTier === 'pro' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Upgrade to Pro
                <ExternalLink className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
