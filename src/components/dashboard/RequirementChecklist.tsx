'use client'

import { useState } from 'react'
import { Check, Circle, Clock, Minus, Loader2 } from 'lucide-react'

import type { ComplianceRequirement, RequirementStatus } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { updateRequirement } from '@/lib/supabase/queries'

const STATUS_CONFIG: Record<RequirementStatus, { icon: typeof Check; label: string; color: string }> = {
  pending: { icon: Circle, label: 'Pending', color: 'text-slate-400' },
  in_progress: { icon: Clock, label: 'In Progress', color: 'text-amber-500' },
  completed: { icon: Check, label: 'Completed', color: 'text-emerald-500' },
  not_applicable: { icon: Minus, label: 'N/A', color: 'text-slate-300' },
}

const REQUIREMENT_TYPE_LABELS: Record<string, string> = {
  risk_management: 'Risk Management',
  data_governance: 'Data Governance',
  documentation: 'Documentation',
  transparency: 'Transparency',
  human_oversight: 'Human Oversight',
  registration: 'Registration',
}

interface RequirementChecklistProps {
  requirements: ComplianceRequirement[]
  onStatusChange?: (requirementId: string, newStatus: RequirementStatus) => void
}

export function RequirementChecklist({
  requirements,
  onStatusChange,
}: RequirementChecklistProps): React.ReactElement {
  const [updating, setUpdating] = useState<string | null>(null)
  const [localRequirements, setLocalRequirements] = useState(requirements)

  const handleToggle = async (req: ComplianceRequirement): Promise<void> => {
    if (updating) return

    const newStatus: RequirementStatus = req.status === 'completed' ? 'pending' : 'completed'
    setUpdating(req.id)

    try {
      const supabase = createClient()
      const { error } = await updateRequirement(supabase, req.id, {
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
      })

      if (!error) {
        setLocalRequirements((prev) =>
          prev.map((r) =>
            r.id === req.id
              ? { ...r, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null }
              : r
          )
        )
        onStatusChange?.(req.id, newStatus)
      }
    } catch {
      // Silently fail — state remains unchanged
    } finally {
      setUpdating(null)
    }
  }

  const groupedRequirements = localRequirements.reduce<Record<string, ComplianceRequirement[]>>(
    (acc, req) => {
      const type = req.requirement_type
      if (!acc[type]) acc[type] = []
      acc[type].push(req)
      return acc
    },
    {}
  )

  const completedCount = localRequirements.filter((r) => r.status === 'completed').length
  const totalCount = localRequirements.filter((r) => r.status !== 'not_applicable').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Compliance Requirements</h3>
        <span className="text-sm text-slate-500">
          {completedCount} of {totalCount} complete
        </span>
      </div>

      {Object.entries(groupedRequirements).map(([type, reqs]) => (
        <div key={type} className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700">
            {REQUIREMENT_TYPE_LABELS[type] ?? type}
          </h4>
          <div className="space-y-2">
            {reqs.map((req) => {
              const config = STATUS_CONFIG[req.status]
              const Icon = config.icon
              const isUpdating = updating === req.id

              return (
                <button
                  key={req.id}
                  onClick={() => handleToggle(req)}
                  disabled={isUpdating || req.status === 'not_applicable'}
                  className="group flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="mt-0.5 shrink-0">
                    {isUpdating ? (
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                    ) : (
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          req.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'
                        }`}
                      >
                        {req.title}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                        {req.article_reference}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{req.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
