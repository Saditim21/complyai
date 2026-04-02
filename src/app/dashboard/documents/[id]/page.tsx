import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getDocument, getUserByAuthId } from '@/lib/supabase/queries'
import { DocumentEditor } from '@/components/dashboard/DocumentEditor'

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>
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

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link
          href="/dashboard/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <DocumentEditor
        documentId={document.id}
        title={document.title}
        documentType={document.document_type}
        status={document.status}
        version={document.version}
        aiSystemId={document.ai_system_id}
        aiSystemName={document.content.aiSystemName}
        aiSystemRiskLevel={document.ai_systems?.risk_level ?? null}
        organizationName={document.content.organizationName}
        sections={document.content.sections}
        createdAt={document.created_at}
      />
    </div>
  )
}
