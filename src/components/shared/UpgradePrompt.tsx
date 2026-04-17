'use client'

import { useState } from 'react'
import { Lock, ArrowRight, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { SubscriptionTier } from '@/lib/stripe/plans'

interface UpgradePromptProps {
  message: string
  recommendedTier: SubscriptionTier
  variant?: 'inline' | 'card'
}

export function UpgradePrompt({
  message,
  recommendedTier,
  variant = 'inline',
}: UpgradePromptProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false)

  const tierNames: Record<SubscriptionTier, string> = {
    free: 'Free',
    starter: 'Starter',
    business: 'Business',
    pro: 'Pro',
  }

  const handleUpgrade = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: recommendedTier, billingPeriod: 'monthly' }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setIsLoading(false)
    }
  }

  if (variant === 'card') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <Lock className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="mt-4 font-medium text-slate-900">Feature Locked</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="mt-4 bg-[#0D9488] hover:bg-[#14B8A6]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Upgrade to {tierNames[recommendedTier]}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <Lock className="h-4 w-4 flex-shrink-0 text-amber-600" />
      <p className="flex-1 text-sm text-amber-800">{message}</p>
      <Button
        onClick={handleUpgrade}
        disabled={isLoading}
        size="sm"
        className="bg-[#0D9488] hover:bg-[#14B8A6]"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            Upgrade
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </Button>
    </div>
  )
}
