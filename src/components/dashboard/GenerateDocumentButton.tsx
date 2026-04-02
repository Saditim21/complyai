'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import type { DocumentType } from '@/types/database'

interface GenerateDocumentButtonProps {
  aiSystemId: string
  documentType: DocumentType
  title: string
  description: string
  articleRef: string
}

export function GenerateDocumentButton({
  aiSystemId,
  documentType,
  title,
  description,
  articleRef,
}: GenerateDocumentButtonProps): React.ReactElement {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerate(): Promise<void> {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiSystemId,
          documentType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate document')
      }

      if (data.warning) {
        toast.warning('Document generated with warnings', {
          description: data.warning,
        })
      } else {
        toast.success('Document generated successfully')
      }

      router.push(`/dashboard/documents/${data.documentId}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate document'
      toast.error('Generation failed', {
        description: message,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={isGenerating}
      className="flex w-full items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-[--brand-secondary] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-slate-200 disabled:hover:bg-white"
    >
      <div className="rounded-lg bg-[--brand-secondary]/10 p-2 text-[--brand-secondary]">
        {isGenerating ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <FileText className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900">{title}</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
            {articleRef}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {isGenerating ? 'Generating document...' : description}
        </p>
      </div>
    </button>
  )
}
