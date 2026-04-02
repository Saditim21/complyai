'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'

import type { DocumentStatus, DocumentType } from '@/types/database'

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'technical_documentation', label: 'Technical Documentation' },
  { value: 'risk_management_plan', label: 'Risk Management Plan' },
  { value: 'transparency_notice', label: 'Transparency Notice' },
]

const STATUSES: { value: DocumentStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
]

export function DocumentsFilter(): React.ReactElement {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentType = searchParams.get('type') as DocumentType | null
  const currentStatus = searchParams.get('status') as DocumentStatus | null

  function updateFilter(key: string, value: string | null): void {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/dashboard/documents?${params.toString()}`)
  }

  function clearFilters(): void {
    router.push('/dashboard/documents')
  }

  const hasFilters = currentType || currentStatus

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Filter className="h-4 w-4" />
        <span>Filter:</span>
      </div>

      {/* Type filter */}
      <select
        value={currentType ?? ''}
        onChange={(e) => updateFilter('type', e.target.value || null)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20"
      >
        <option value="">All Types</option>
        {DOCUMENT_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={currentStatus ?? ''}
        onChange={(e) => updateFilter('status', e.target.value || null)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  )
}
