import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Pencil,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getDocument, getUserByAuthId } from '@/lib/supabase/queries'
import { RiskBadge } from '@/components/shared/RiskBadge'

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  review: { label: 'In Review', className: 'bg-amber-50 text-amber-700' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700' },
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  technical_documentation: 'Technical Documentation',
  risk_management_plan: 'Risk Management Plan',
  transparency_notice: 'Transparency Notice',
}

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps): Promise<React.ReactElement> {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?next=/dashboard/documents/' + id)
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)

  if (!dbUser?.organization_id) {
    redirect('/dashboard')
  }

  const { data: document, error } = await getDocument(supabase, id)

  if (error || !document) {
    notFound()
  }

  if (document.organization_id !== dbUser.organization_id) {
    notFound()
  }

  const statusConfig = STATUS_LABELS[document.status] ?? STATUS_LABELS.draft
  const formattedDate = new Date(document.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={`/dashboard/inventory/${document.ai_system_id}`}
            className="mt-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{document.title}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}>
                {statusConfig.label}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {DOCUMENT_TYPE_LABELS[document.document_type] ?? document.document_type}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span>Version {document.version}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-[--brand-primary] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light]"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-sm text-slate-500">AI System</p>
            <div className="mt-1 flex items-center gap-2">
              <Link
                href={`/dashboard/inventory/${document.ai_system_id}`}
                className="font-medium text-slate-900 hover:text-[--brand-primary]"
              >
                {document.content.aiSystemName}
              </Link>
              {document.ai_systems?.risk_level && (
                <RiskBadge level={document.ai_systems.risk_level} />
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Organization</p>
            <p className="mt-1 font-medium text-slate-900">{document.content.organizationName}</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          {document.content.sections.map((section, index) => (
            <div key={section.id} className={index > 0 ? 'mt-8 border-t border-slate-100 pt-8' : ''}>
              <div className="mb-4 flex items-start justify-between">
                <h2 className="m-0 text-lg font-semibold text-slate-900">{section.title}</h2>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {section.articleReference}
                </span>
              </div>
              {section.description && (
                <p className="mt-1 text-sm italic text-slate-500">{section.description}</p>
              )}
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This document was generated by ClarionAI to assist with EU AI Act compliance.
          It should be reviewed and approved by appropriate personnel before being used for regulatory purposes.
          ClarionAI does not provide legal advice.
        </p>
      </div>
    </div>
  )
}
