'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Search, X } from 'lucide-react'

import type { RiskLevel } from '@/types/database'

const RISK_LEVELS: { value: RiskLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All risk levels' },
  { value: 'unacceptable', label: 'Unacceptable' },
  { value: 'high', label: 'High' },
  { value: 'limited', label: 'Limited' },
  { value: 'minimal', label: 'Minimal' },
]

interface InventoryFiltersProps {
  searchQuery: string
  riskFilter: string
}

export function InventoryFilters({ searchQuery, riskFilter }: InventoryFiltersProps): React.ReactElement {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      startTransition(() => {
        router.push(`/dashboard/inventory?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push('/dashboard/inventory')
    })
  }, [router])

  const hasFilters = searchQuery || (riskFilter && riskFilter !== 'all')

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search systems..."
          defaultValue={searchQuery}
          onChange={(e) => updateParams('q', e.target.value)}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20 ${isPending ? 'opacity-70' : ''}`}
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={riskFilter || 'all'}
          onChange={(e) => updateParams('risk', e.target.value)}
          className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20 ${isPending ? 'opacity-70' : ''}`}
        >
          {RISK_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
