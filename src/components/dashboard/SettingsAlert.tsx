'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface SettingsAlertProps {
  success: boolean
  canceled: boolean
}

export function SettingsAlert({ success, canceled }: SettingsAlertProps): React.ReactElement | null {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (success || canceled) {
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setDismissed(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [success, canceled])

  if (dismissed || (!success && !canceled)) {
    return null
  }

  if (success) {
    return (
      <div className="relative flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" />
        <div>
          <p className="font-medium text-emerald-900">Subscription activated</p>
          <p className="text-sm text-emerald-700">
            Your payment was successful. Thank you for upgrading.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-3 rounded p-1 text-emerald-600 hover:bg-emerald-100"
          type="button"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (canceled) {
    return (
      <div className="relative flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <XCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
          <p className="font-medium text-amber-900">Checkout canceled</p>
          <p className="text-sm text-amber-700">
            Your checkout was canceled. No charges were made.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-3 rounded p-1 text-amber-600 hover:bg-amber-100"
          type="button"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return null
}
