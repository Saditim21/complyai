'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { createAISystem, createRequirementsBulk } from '@/lib/supabase/queries'
import { getRequirementDefinitions } from '@/lib/classification/requirements'
import type { AISystemInsert, ComplianceRequirementInsert } from '@/types/database'

import type { WizardData } from './types'

interface StepSummaryProps {
  data: WizardData
  organizationId: string
}

type SaveState = 'idle' | 'saving' | 'success' | 'error'

export function StepSummary({ data, organizationId }: StepSummaryProps): React.ReactElement {
  const router = useRouter()
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const counts = {
    total: data.classifiedSystems.length,
    high: data.classifiedSystems.filter((s) => s.classification.riskLevel === 'high').length,
    limited: data.classifiedSystems.filter((s) => s.classification.riskLevel === 'limited').length,
    minimal: data.classifiedSystems.filter((s) => s.classification.riskLevel === 'minimal').length,
  }

  const handleSave = async (): Promise<void> => {
    setSaveState('saving')
    setErrorMessage('')

    try {
      const supabase = createClient()

      for (const system of data.classifiedSystems) {
        const aiSystemData: AISystemInsert = {
          organization_id: organizationId,
          name: system.name,
          description: system.description,
          vendor: system.vendor || null,
          category: system.aiSystemInput.category,
          risk_level: system.classification.riskLevel === 'unacceptable' ? null : system.classification.riskLevel,
          annex_iii_domain: system.classification.annexDomain,
          is_provider: system.isProvider,
          classification_rationale: system.classification.rationale,
          compliance_status: 'not_started',
          compliance_score: 0,
          data_types_processed: system.dataTypes as AISystemInsert['data_types_processed'],
        }

        const { data: createdSystem, error: systemError } = await createAISystem(supabase, aiSystemData)
        if (systemError || !createdSystem) {
          throw new Error(systemError?.message || 'Failed to create AI system')
        }

        const requirements = getRequirementDefinitions(system.classification.riskLevel)
        if (requirements.length > 0) {
          const requirementsData: ComplianceRequirementInsert[] = requirements.map((req) => ({
            ai_system_id: createdSystem.id,
            article_reference: req.articleReference,
            requirement_type: req.type as ComplianceRequirementInsert['requirement_type'],
            title: req.title,
            description: req.description,
            status: 'pending',
          }))

          const { error: reqError } = await createRequirementsBulk(supabase, requirementsData)
          if (reqError) {
            throw new Error(reqError.message)
          }
        }
      }

      setSaveState('success')
      setTimeout(() => router.push('/dashboard/inventory'), 1500)
    } catch (err) {
      setSaveState('error')
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Save your assessment</h2>
        <p className="mt-1 text-slate-500">Review your AI inventory and save to start tracking compliance.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">Summary</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900">{counts.total}</div>
            <div className="text-sm text-slate-500">Total Systems</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{counts.high}</div>
            <div className="text-sm text-slate-500">High Risk</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{counts.limited}</div>
            <div className="text-sm text-slate-500">Limited Risk</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">{counts.minimal}</div>
            <div className="text-sm text-slate-500">Minimal Risk</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Systems to save</h3>
        <div className="space-y-2">
          {data.classifiedSystems.map((system) => (
            <div key={system.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2">
              <span className="font-medium text-slate-900">{system.name}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                system.classification.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                system.classification.riskLevel === 'limited' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {system.classification.riskLevel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {saveState === 'error' && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {errorMessage}
        </div>
      )}

      {saveState === 'success' ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle className="h-5 w-5 shrink-0" />
          Assessment saved! Redirecting to your inventory...
        </div>
      ) : (
        <button
          onClick={handleSave}
          disabled={saveState === 'saving'}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[--brand-primary] px-6 py-3 font-medium text-white transition-colors hover:bg-[--brand-primary-light] disabled:opacity-50"
        >
          {saveState === 'saving' ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</>
          ) : (
            <>Save assessment <ArrowRight className="h-5 w-5" /></>
          )}
        </button>
      )}
    </div>
  )
}
