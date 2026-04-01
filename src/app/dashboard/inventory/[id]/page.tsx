import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Info,
  Shield,
  Users,
  Database,
  Scale,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getAISystem, getUserByAuthId } from '@/lib/supabase/queries'
import { RiskBadge } from '@/components/shared/RiskBadge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ComplianceScore } from '@/components/dashboard/ComplianceScore'
import { RequirementChecklist } from '@/components/dashboard/RequirementChecklist'
import type { AnnexIIIDomain, DataType } from '@/types/database'

interface SystemDetailPageProps {
  params: Promise<{ id: string }>
}

const DOMAIN_LABELS: Record<AnnexIIIDomain, string> = {
  biometrics: 'Biometrics',
  critical_infrastructure: 'Critical Infrastructure',
  education: 'Education & Training',
  employment: 'Employment & Workers',
  essential_services: 'Essential Services',
  law_enforcement: 'Law Enforcement',
  migration: 'Migration & Border',
  justice: 'Justice & Democracy',
}

const DATA_TYPE_LABELS: Record<DataType, string> = {
  personal_data: 'Personal Data',
  biometric: 'Biometric Data',
  financial: 'Financial Data',
  health: 'Health Data',
  location: 'Location Data',
  behavioral: 'Behavioral Data',
}

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

function InfoRow({ icon, label, value }: InfoRowProps): React.ReactElement {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-0.5 text-sm text-slate-900">{value}</dd>
      </div>
    </div>
  )
}

interface DocumentButtonProps {
  title: string
  description: string
  articleRef: string
}

function DocumentButton({ title, description, articleRef }: DocumentButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      className="flex w-full items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-[--brand-secondary] hover:bg-slate-50"
    >
      <div className="rounded-lg bg-[--brand-secondary]/10 p-2 text-[--brand-secondary]">
        <FileText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900">{title}</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{articleRef}</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </button>
  )
}

export default async function SystemDetailPage({ params }: SystemDetailPageProps): Promise<React.ReactElement> {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?next=/dashboard/inventory/' + id)
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)

  if (!dbUser?.organization_id) {
    redirect('/dashboard')
  }

  const { data: system, error } = await getAISystem(supabase, id)

  if (error || !system) {
    notFound()
  }

  if (system.organization_id !== dbUser.organization_id) {
    notFound()
  }

  const formattedDate = new Date(system.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const requirements = system.compliance_requirements ?? []
  const completedCount = requirements.filter((r) => r.status === 'completed').length
  const totalApplicable = requirements.filter((r) => r.status !== 'not_applicable').length

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/inventory"
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold text-slate-900">{system.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            {system.vendor && (
              <>
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {system.vendor}
                </span>
                <span>·</span>
              </>
            )}
            <span>Added {formattedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={system.risk_level} />
          <StatusBadge status={system.compliance_status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">System Information</h2>
            <dl className="mt-4 divide-y divide-slate-100">
              {system.description && (
                <InfoRow
                  icon={<Info className="h-4 w-4" />}
                  label="Description"
                  value={system.description}
                />
              )}
              <InfoRow
                icon={<Scale className="h-4 w-4" />}
                label="Category"
                value={system.category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              />
              <InfoRow
                icon={<Users className="h-4 w-4" />}
                label="Role"
                value={system.is_provider ? 'Provider (develops or places on market)' : 'Deployer (uses in operations)'}
              />
              {system.annex_iii_domain && (
                <InfoRow
                  icon={<Shield className="h-4 w-4" />}
                  label="Annex III Domain"
                  value={DOMAIN_LABELS[system.annex_iii_domain]}
                />
              )}
              {system.data_types_processed.length > 0 && (
                <InfoRow
                  icon={<Database className="h-4 w-4" />}
                  label="Data Types Processed"
                  value={
                    <div className="flex flex-wrap gap-1.5">
                      {system.data_types_processed.map((dt) => (
                        <span
                          key={dt}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        >
                          {DATA_TYPE_LABELS[dt]}
                        </span>
                      ))}
                    </div>
                  }
                />
              )}
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Last Updated"
                value={new Date(system.updated_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Risk Classification</h2>
            <div className="mt-4 flex items-start gap-4">
              <div className="rounded-lg bg-slate-100 p-3">
                <Shield className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={system.risk_level} />
                  {system.annex_iii_domain && (
                    <span className="text-sm text-slate-500">
                      Annex III: {DOMAIN_LABELS[system.annex_iii_domain]}
                    </span>
                  )}
                </div>
                {system.classification_rationale && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {system.classification_rationale}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <RequirementChecklist requirements={requirements} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-medium text-slate-500">Compliance Progress</span>
              <div className="mt-4">
                <ComplianceScore score={system.compliance_score} size="lg" />
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {completedCount} of {totalApplicable} requirements complete
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Generate Documents</h3>
            <p className="mt-1 text-sm text-slate-500">
              AI-powered document generation for EU AI Act compliance
            </p>
            <div className="mt-4 space-y-3">
              <DocumentButton
                title="Technical Documentation"
                description="Detailed system specs and capabilities"
                articleRef="Art. 11"
              />
              <DocumentButton
                title="Risk Assessment"
                description="Risk management system documentation"
                articleRef="Art. 9"
              />
              <DocumentButton
                title="Transparency Notice"
                description="User-facing AI disclosure"
                articleRef="Art. 13"
              />
              {system.risk_level === 'high' && (
                <>
                  <DocumentButton
                    title="Conformity Assessment"
                    description="High-risk system declaration"
                    articleRef="Art. 43"
                  />
                  <DocumentButton
                    title="Human Oversight Plan"
                    description="Human-machine interaction procedures"
                    articleRef="Art. 14"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
