import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Cpu, Target, Calendar, Plus, AlertTriangle } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getAISystems, getAISystemStats, getUserByAuthId } from '@/lib/supabase/queries'
import { EU_AI_ACT_DEADLINE } from '@/lib/constants'
import { SystemCard } from '@/components/dashboard/SystemCard'
import { ComplianceScore } from '@/components/dashboard/ComplianceScore'
import type { RiskLevel } from '@/types/database'

function calculateDaysUntilDeadline(): number {
  const now = new Date()
  const diff = EU_AI_ACT_DEADLINE.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  description: string
  urgent?: boolean
}

function StatCard({ icon, label, value, description, urgent = false }: StatCardProps): React.ReactElement {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${urgent ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <div className="mt-4">
        <span className={`text-3xl font-semibold ${urgent ? 'text-amber-600' : 'text-slate-900'}`}>
          {value}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  )
}

function formatRiskSummary(byRiskLevel: Record<string, number>): string {
  const order: RiskLevel[] = ['unacceptable', 'high', 'limited', 'minimal']
  const parts: string[] = []

  for (const level of order) {
    const count = byRiskLevel[level]
    if (count && count > 0) {
      parts.push(`${count} ${level}`)
    }
  }

  return parts.length > 0 ? parts.join(', ') : 'No systems classified'
}

export default async function DashboardOverviewPage(): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?next=/dashboard')
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)

  if (!dbUser?.organization_id) {
    redirect('/onboarding')
  }

  const organizationId = dbUser.organization_id
  const userName = dbUser.full_name ?? 'there'

  const [systemsResult, statsResult] = await Promise.all([
    getAISystems(supabase, organizationId),
    getAISystemStats(supabase, organizationId),
  ])

  const systems = systemsResult.data ?? []
  const stats = statsResult.data ?? { total: 0, byRiskLevel: {}, byStatus: {}, averageScore: 0 }
  const daysRemaining = calculateDaysUntilDeadline()

  const hasHighRisk = (stats.byRiskLevel['high'] ?? 0) > 0 || (stats.byRiskLevel['unacceptable'] ?? 0) > 0

  if (systems.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Welcome, {userName}</h2>
          <p className="mt-1 text-slate-500">
            Get started by adding your first AI system to begin compliance tracking.
          </p>
        </div>

        <Link
          href="/dashboard/inventory/new"
          className="group block rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Start your AI assessment</h3>
              <p className="mt-2 max-w-xl text-slate-500">
                Our guided wizard helps you identify and classify your AI systems in minutes.
                Get risk ratings and generate required compliance documents.
              </p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <span className="inline-flex items-center gap-2 rounded-lg bg-[--brand-primary] px-6 py-3 font-medium text-white transition-colors duration-150 group-hover:bg-[--brand-primary-light]">
                Get started
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
          <div className="mt-4 sm:hidden">
            <span className="inline-flex items-center gap-2 rounded-lg bg-[--brand-primary] px-6 py-3 font-medium text-white">
              Get started
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Cpu className="h-6 w-6" />}
            label="AI Systems"
            value="0"
            description="No systems added yet"
          />
          <StatCard
            icon={<Target className="h-6 w-6" />}
            label="Compliance Score"
            value="--"
            description="Add systems to calculate"
          />
          <StatCard
            icon={<Calendar className="h-6 w-6" />}
            label="Days until deadline"
            value={daysRemaining.toString()}
            description="August 2, 2026"
            urgent={daysRemaining < 180}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-slate-500">
            Track your AI systems and compliance progress
          </p>
        </div>
        <Link
          href="/dashboard/inventory/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[--brand-primary] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light]"
        >
          <Plus className="h-4 w-4" />
          Add AI system
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-medium text-slate-500">Overall Compliance</span>
            <div className="mt-4">
              <ComplianceScore score={stats.averageScore} size="lg" />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {stats.averageScore >= 80
                ? 'On track for compliance'
                : stats.averageScore >= 50
                  ? 'Making progress'
                  : 'Needs attention'}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 lg:col-span-3">
          <StatCard
            icon={<Cpu className="h-6 w-6" />}
            label="AI Systems"
            value={stats.total.toString()}
            description={formatRiskSummary(stats.byRiskLevel)}
          />
          <StatCard
            icon={<Calendar className="h-6 w-6" />}
            label="Days until deadline"
            value={daysRemaining.toString()}
            description="August 2, 2026"
            urgent={daysRemaining < 180}
          />
          {hasHighRisk ? (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-orange-700">High-Risk Systems</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-semibold text-orange-600">
                  {(stats.byRiskLevel['high'] ?? 0) + (stats.byRiskLevel['unacceptable'] ?? 0)}
                </span>
              </div>
              <p className="mt-1 text-sm text-orange-600/80">Require additional compliance steps</p>
            </div>
          ) : (
            <StatCard
              icon={<Target className="h-6 w-6" />}
              label="In Progress"
              value={(stats.byStatus['in_progress'] ?? 0).toString()}
              description="Systems being documented"
            />
          )}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Your AI Systems</h3>
          <Link
            href="/dashboard/inventory"
            className="text-sm font-medium text-[--brand-primary] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systems.slice(0, 6).map((system) => (
            <SystemCard key={system.id} system={system} />
          ))}
        </div>
        {systems.length > 6 && (
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/inventory"
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              +{systems.length - 6} more systems
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
