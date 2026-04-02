import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Calendar, CheckCircle2, Clock, Plus } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getUserByAuthId, getAllRequirements, getAISystems } from '@/lib/supabase/queries'
import { EU_AI_ACT_DEADLINE } from '@/lib/constants'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { MarkCompleteButton } from '@/components/dashboard/MarkCompleteButton'

import type { RequirementWithSystem } from '@/lib/supabase/queries'
import type { RequirementStatus } from '@/types/database'

type UrgencyLevel = 'overdue' | 'thisMonth' | 'upcoming' | 'later' | 'noDueDate'

const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; color: string; icon: typeof AlertTriangle }> = {
  overdue: { label: 'Overdue', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertTriangle },
  thisMonth: { label: 'Due This Month', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  upcoming: { label: 'Due in 90 Days', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Calendar },
  later: { label: 'Later', color: 'text-slate-600 bg-slate-50 border-slate-200', icon: Calendar },
  noDueDate: { label: 'No Due Date', color: 'text-slate-500 bg-slate-50 border-slate-200', icon: Calendar },
}

const STATUS_STYLES: Record<RequirementStatus, string> = {
  pending: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700',
  not_applicable: 'bg-gray-100 text-gray-500',
}

function getUrgencyLevel(dueDate: string | null, now: Date): UrgencyLevel {
  if (!dueDate) return 'noDueDate'
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 30) return 'thisMonth'
  if (diffDays <= 90) return 'upcoming'
  return 'later'
}

function groupByUrgency(requirements: RequirementWithSystem[], now: Date): Record<UrgencyLevel, RequirementWithSystem[]> {
  const groups: Record<UrgencyLevel, RequirementWithSystem[]> = {
    overdue: [], thisMonth: [], upcoming: [], later: [], noDueDate: [],
  }
  for (const req of requirements) {
    if (req.status !== 'completed' && req.status !== 'not_applicable') {
      groups[getUrgencyLevel(req.due_date, now)].push(req)
    }
  }
  return groups
}

export default async function RoadmapPage(): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) redirect('/login?next=/dashboard/roadmap')

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)
  if (!dbUser?.organization_id) redirect('/dashboard')

  const [{ data: requirements }, { data: systems }] = await Promise.all([
    getAllRequirements(supabase, dbUser.organization_id),
    getAISystems(supabase, dbUser.organization_id),
  ])

  const allReqs = requirements ?? []
  const now = new Date()
  const deadline = EU_AI_ACT_DEADLINE
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const timelineProgress = Math.max(0, Math.min(100, 100 - (daysUntilDeadline / 730) * 100))

  const stats = {
    total: allReqs.length,
    completed: allReqs.filter(r => r.status === 'completed').length,
    pending: allReqs.filter(r => r.status === 'pending' || r.status === 'in_progress').length,
    overdue: allReqs.filter(r => r.status !== 'completed' && r.due_date && new Date(r.due_date) < now).length,
  }
  const completionPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  if (!systems?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <Calendar className="h-12 w-12 text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900">No AI systems yet</h2>
        <p className="mt-2 text-sm text-slate-500">Add your first AI system to see your compliance roadmap.</p>
        <Link href="/dashboard/inventory/new" className="mt-6 flex items-center gap-2 rounded-lg bg-[--brand-primary] px-4 py-2 text-sm font-medium text-white hover:bg-[--brand-primary-light]">
          <Plus className="h-4 w-4" />Add AI System
        </Link>
      </div>
    )
  }

  const grouped = groupByUrgency(allReqs, now)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Compliance Roadmap</h1>
        <p className="mt-1 text-sm text-slate-500">Track your progress toward the August 2, 2026 deadline</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-900' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-600' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
          { label: 'Overdue', value: stats.overdue, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Today</span>
          <span className="font-medium text-slate-700">Aug 2, 2026</span>
        </div>
        <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="absolute left-0 top-0 h-full rounded-full bg-[--brand-primary]" style={{ width: `${timelineProgress}%` }} />
          <div className="absolute top-0 h-full w-1 bg-amber-500" style={{ left: `${timelineProgress}%` }} title="Today" />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{completionPercent}% complete</span>
          <span className="font-medium text-amber-600">{daysUntilDeadline} days remaining</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Overall Compliance</span>
          <span className="text-sm font-semibold text-[--brand-primary]">{completionPercent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[--brand-secondary]" style={{ width: `${completionPercent}%` }} />
        </div>
      </div>

      {/* Grouped requirements */}
      {(['overdue', 'thisMonth', 'upcoming', 'later', 'noDueDate'] as UrgencyLevel[]).map(level => {
        const items = grouped[level]
        if (!items.length) return null
        const config = URGENCY_CONFIG[level]
        const Icon = config.icon
        return (
          <div key={level} className={`rounded-xl border ${config.color} p-4`}>
            <div className="mb-4 flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <h2 className="font-semibold">{config.label}</h2>
              <span className="rounded-full bg-white/50 px-2 py-0.5 text-xs font-medium">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.map(req => (
                <div key={req.id} className="flex items-center justify-between gap-4 rounded-lg border border-white/50 bg-white p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/inventory/${req.ai_systems.id}`} className="font-medium text-slate-900 hover:text-[--brand-primary]">{req.ai_systems.name}</Link>
                      {req.ai_systems.risk_level && <RiskBadge level={req.ai_systems.risk_level} />}
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{req.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{req.article_reference}</span>
                      <span className={`rounded px-1.5 py-0.5 ${STATUS_STYLES[req.status]}`}>{req.status.replace('_', ' ')}</span>
                      {req.due_date && <span className="text-slate-500">Due: {new Date(req.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    </div>
                  </div>
                  <MarkCompleteButton requirementId={req.id} isCompleted={req.status === 'completed'} />
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {stats.pending === 0 && stats.total > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-emerald-800">All requirements completed!</h3>
            <p className="text-sm text-emerald-700">Your AI systems are on track for compliance.</p>
          </div>
        </div>
      )}
    </div>
  )
}
