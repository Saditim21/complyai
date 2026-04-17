'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps): React.ReactElement {
  useEffect(() => {
    // Log error to console in development
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-slate-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-slate-600">
          We encountered an error while loading this page. This has been logged and we&apos;ll look into it.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-slate-400">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} variant="outline">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
