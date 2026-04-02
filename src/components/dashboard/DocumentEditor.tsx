'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  ChevronDown,
  Download,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import type { DocumentSection, DocumentStatus, RiskLevel } from '@/types/database'

interface DocumentEditorProps {
  documentId: string
  title: string
  documentType: string
  status: DocumentStatus
  version: string
  aiSystemId: string
  aiSystemName: string
  aiSystemRiskLevel: RiskLevel | null
  organizationName: string
  sections: DocumentSection[]
  createdAt: string
}

const STATUS_CONFIG: Record<DocumentStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  review: { label: 'In Review', className: 'bg-amber-50 text-amber-700' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700' },
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  technical_documentation: 'Technical Documentation',
  risk_management_plan: 'Risk Management Plan',
  transparency_notice: 'Transparency Notice',
}

export function DocumentEditor({
  documentId,
  title,
  documentType,
  status: initialStatus,
  version,
  aiSystemId,
  aiSystemName,
  aiSystemRiskLevel,
  organizationName,
  sections: initialSections,
  createdAt,
}: DocumentEditorProps): React.ReactElement {
  const router = useRouter()

  const [sections, setSections] = useState<DocumentSection[]>(initialSections)
  const [status, setStatus] = useState<DocumentStatus>(initialStatus)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  async function handleExportPDF(): Promise<void> {
    setIsExporting(true)

    try {
      const response = await fetch(`/api/documents/${documentId}/export`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to export')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/\s+/g, '_')}_${version}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('PDF exported successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export PDF'
      toast.error('Export failed', { description: message })
    } finally {
      setIsExporting(false)
    }
  }

  function startEditing(sectionId: string, content: string): void {
    setEditingSection(sectionId)
    setEditContent(content)
  }

  function cancelEditing(): void {
    setEditingSection(null)
    setEditContent('')
  }

  function saveEditing(): void {
    if (!editingSection) return

    setSections(prev => prev.map(s =>
      s.id === editingSection ? { ...s, content: editContent } : s
    ))
    setEditingSection(null)
    setEditContent('')
    setHasChanges(true)
  }

  async function handleSave(): Promise<void> {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          content: {
            aiSystemName,
            organizationName,
            sections,
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save')
      }

      setHasChanges(false)
      toast.success('Document saved successfully')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save document'
      toast.error('Save failed', { description: message })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleStatusChange(newStatus: DocumentStatus): Promise<void> {
    setStatus(newStatus)
    setShowStatusMenu(false)
    setHasChanges(true)
  }

  async function handleRegenerate(sectionId: string): Promise<void> {
    setRegeneratingSection(sectionId)

    try {
      const response = await fetch(`/api/documents/${documentId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to regenerate')
      }

      setSections(prev => prev.map(s =>
        s.id === sectionId ? data.section : s
      ))
      toast.success('Section regenerated successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to regenerate section'
      toast.error('Regeneration failed', { description: message })
    } finally {
      setRegeneratingSection(null)
    }
  }

  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {DOCUMENT_TYPE_LABELS[documentType] ?? documentType} · Version {version} · {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${STATUS_CONFIG[status].className}`}
            >
              {STATUS_CONFIG[status].label}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {(Object.keys(STATUS_CONFIG) as DocumentStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(s)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                      s === status ? 'text-[--brand-primary]' : 'text-slate-700'
                    }`}
                  >
                    {s === status && <Check className="h-4 w-4" />}
                    <span className={s === status ? '' : 'ml-6'}>{STATUS_CONFIG[s].label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {hasChanges ? 'Save Changes' : 'Saved'}
          </button>

          {/* Export button */}
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-lg bg-[--brand-primary] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export PDF
          </button>
        </div>
      </div>

      {/* Document metadata */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-slate-500">AI System:</span>{' '}
            <a
              href={`/dashboard/inventory/${aiSystemId}`}
              className="font-medium text-[--brand-primary] hover:underline"
            >
              {aiSystemName}
            </a>
            {aiSystemRiskLevel && (
              <span className={`ml-2 rounded px-1.5 py-0.5 text-xs font-medium ${
                aiSystemRiskLevel === 'high' ? 'bg-orange-50 text-orange-700' :
                aiSystemRiskLevel === 'limited' ? 'bg-blue-50 text-blue-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {aiSystemRiskLevel}
              </span>
            )}
          </div>
          <div>
            <span className="text-slate-500">Organization:</span>{' '}
            <span className="font-medium text-slate-900">{organizationName}</span>
          </div>
        </div>
      </div>

      {/* Document content */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`p-6 ${index > 0 ? 'border-t border-slate-100' : ''}`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                <p className="mt-0.5 text-xs text-slate-500">{section.articleReference}</p>
              </div>
              <div className="flex items-center gap-1">
                {editingSection === section.id ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={saveEditing}
                      className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                      title="Save"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRegenerate(section.id)}
                      disabled={regeneratingSection === section.id}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Regenerate with AI"
                    >
                      {regeneratingSection === section.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditing(section.id, section.content)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {section.description && (
              <p className="mb-3 text-sm italic text-slate-500">{section.description}</p>
            )}

            {editingSection === section.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px] w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed text-slate-700 focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20"
                placeholder="Enter section content..."
              />
            ) : (
              <div className="prose prose-sm prose-slate max-w-none">
                {section.content.split('\n').map((paragraph, i) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={i} className="mt-4 text-base font-semibold text-slate-800">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith('- ') || paragraph.startsWith('• ')) {
                    return (
                      <li key={i} className="ml-4 text-slate-700">
                        {paragraph.replace(/^[-•]\s*/, '')}
                      </li>
                    )
                  }
                  if (paragraph.trim()) {
                    return (
                      <p key={i} className="text-slate-700">
                        {paragraph}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This document was generated by ClarionAI to assist with
          EU AI Act compliance. It should be reviewed and approved by appropriate personnel
          before being used for regulatory purposes. ClarionAI does not provide legal advice.
        </p>
      </div>
    </div>
  )
}
