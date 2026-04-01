import Link from 'next/link'
import { Building2, ChevronRight } from 'lucide-react'

import type { AISystem } from '@/types/database'
import { RiskBadge } from '@/components/shared/RiskBadge'

interface SystemCardProps {
  system: AISystem
}

export function SystemCard({ system }: SystemCardProps): React.ReactElement {
  const progressPercent = system.compliance_score

  return (
    <Link
      href={`/dashboard/inventory/${system.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-[--brand-primary]">
            {system.name}
          </h3>
          {system.vendor && (
            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate">{system.vendor}</span>
            </div>
          )}
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <RiskBadge level={system.risk_level} size="sm" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Compliance</span>
          <span className="font-medium text-slate-700">{progressPercent}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[--brand-secondary] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
