import Link from 'next/link'
import { ArrowRight, Cpu, Target, Calendar } from 'lucide-react'

import { EU_AI_ACT_DEADLINE } from '@/lib/constants'

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

export default function DashboardOverviewPage(): React.ReactElement {
  const daysRemaining = calculateDaysUntilDeadline()

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Welcome to ClarionAI</h2>
        <p className="mt-1 text-slate-500">
          Get started by adding your first AI system to begin compliance tracking.
        </p>
      </div>

      {/* CTA Card */}
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

      {/* Stats Grid */}
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
