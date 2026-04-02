'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface MarkCompleteButtonProps {
  requirementId: string
  isCompleted: boolean
}

export function MarkCompleteButton({
  requirementId,
  isCompleted,
}: MarkCompleteButtonProps): React.ReactElement {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick(): Promise<void> {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/requirements/${requirementId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: isCompleted ? 'pending' : 'completed' }),
      })

      if (!response.ok) throw new Error('Failed to update')

      toast.success(isCompleted ? 'Marked as pending' : 'Marked as complete')
      router.refresh()
    } catch {
      toast.error('Failed to update requirement')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCompleted) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Completed
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-1.5 rounded-lg bg-[--brand-secondary] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[--brand-secondary-light] disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      Mark complete
    </button>
  )
}
