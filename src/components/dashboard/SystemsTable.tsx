import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import type { AISystem } from '@/types/database'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'

interface SystemsTableProps {
  systems: AISystem[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function SystemsTable({ systems }: SystemsTableProps): React.ReactElement {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                System
              </th>
              <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Risk Level
              </th>
              <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                Status
              </th>
              <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
                Added
              </th>
              <th className="px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {systems.map((system) => (
              <tr
                key={system.id}
                className="group transition-colors hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/inventory/${system.id}`}
                    className="block"
                  >
                    <span className="font-medium text-slate-900 group-hover:text-[--brand-primary]">
                      {system.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-500 sm:hidden">
                      {system.vendor || 'No vendor'}
                    </span>
                  </Link>
                </td>
                <td className="hidden px-6 py-4 sm:table-cell">
                  <span className="text-sm text-slate-600">
                    {system.vendor || '—'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <RiskBadge level={system.risk_level} size="sm" />
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  <StatusBadge status={system.compliance_status} size="sm" />
                </td>
                <td className="hidden px-6 py-4 lg:table-cell">
                  <span className="text-sm text-slate-500">
                    {formatDate(system.created_at)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/dashboard/inventory/${system.id}`}
                    className="inline-flex items-center text-sm font-medium text-[--brand-primary] opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    View
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
