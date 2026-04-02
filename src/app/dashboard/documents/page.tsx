import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getDocuments, getUserByAuthId } from '@/lib/supabase/queries'
import { RiskBadge } from '@/components/shared/RiskBadge'

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

export default async function DocumentsPage(): Promise<React.ReactElement> {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login?next=/dashboard/documents')
  }

  const { data: dbUser } = await getUserByAuthId(supabase, authUser.id)

  if (!dbUser?.organization_id) {
    redirect('/dashboard')
  }

  const { data: documents } = await getDocuments(supabase, dbUser.organization_id)
  const documentList = documents ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
          <p className="mt-1 text-sm text-slate-500">
            AI-generated compliance documents for your AI systems
          </p>
        </div>
        <Link
          href="/dashboard/inventory"
          className="flex items-center gap-2 rounded-lg bg-[--brand-primary] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light]"
        >
          <Plus className="h-4 w-4" />
          Generate New
        </Link>
      </div>

      {documentList.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FileText className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">No documents yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Generate your first compliance document from an AI system detail page.
          </p>
          <Link
            href="/dashboard/inventory"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[--brand-primary] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light]"
          >
            View AI Systems
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  AI System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documentList.map((doc) => {
                const statusConfig = STATUS_LABELS[doc.status] ?? STATUS_LABELS.draft
                const formattedDate = new Date(doc.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })

                return (
                  <tr key={doc.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/documents/${doc.id}`}
                        className="group flex items-center gap-3"
                      >
                        <div className="rounded-lg bg-[--brand-secondary]/10 p-2 text-[--brand-secondary]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-[--brand-primary]">
                            {doc.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-700">
                          {doc.ai_systems?.name ?? 'Unknown'}
                        </span>
                        {doc.ai_systems?.risk_level && (
                          <RiskBadge level={doc.ai_systems.risk_level} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formattedDate}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
