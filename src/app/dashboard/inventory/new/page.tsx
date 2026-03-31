'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { classifyRisk } from '@/lib/classification/engine'
import type { AISystemInput } from '@/types/classification'

import { WizardProgress } from '@/components/wizard/WizardProgress'
import { StepAIDiscovery } from '@/components/wizard/StepAIDiscovery'
import { StepSystemDetails } from '@/components/wizard/StepSystemDetails'
import { StepClassification } from '@/components/wizard/StepClassification'
import { StepRoadmap } from '@/components/wizard/StepRoadmap'
import { StepSummary } from '@/components/wizard/StepSummary'
import { getOptionById } from '@/components/wizard/discoveryOptions'
import type { WizardData, SystemDetails, SystemWithClassification } from '@/components/wizard/types'
import { INITIAL_WIZARD_DATA } from '@/components/wizard/types'

const STEP_LABELS = ['Discover', 'Details', 'Classification', 'Roadmap', 'Save']

export default function NewSystemWizardPage(): React.ReactElement {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<WizardData>(INITIAL_WIZARD_DATA)
  const [organizationId, setOrganizationId] = useState<string>('')

  useEffect(() => {
    const fetchOrg = async (): Promise<void> => {
      const supabase = createClient()
      const { data: userData } = await supabase.from('users').select('organization_id').single()
      if (userData?.organization_id) setOrganizationId(userData.organization_id)
    }
    fetchOrg()
  }, [])

  const updateData = (updates: Partial<WizardData>): void => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const initializeSystems = (): void => {
    const systems: SystemDetails[] = data.selectedOptions.map((optionId, index) => {
      const option = getOptionById(optionId)
      return {
        id: `system-${index}`,
        name: option?.defaultName || '',
        vendor: '',
        description: '',
        affectedParties: [],
        dataTypes: [],
        affectsDecisions: false,
        isProvider: false,
        sourceOptionId: optionId,
      }
    })
    updateData({ systems })
  }

  const runClassification = (): void => {
    const classified: SystemWithClassification[] = data.systems.map((system) => {
      const option = getOptionById(system.sourceOptionId)
      const aiInput: AISystemInput = {
        name: system.name,
        description: system.description,
        purpose: system.description,
        category: option?.category || 'general',
        sector: option?.category || 'general',
        dataTypes: system.dataTypes,
        affectsDecisions: system.affectsDecisions,
        profilesPersons: system.affectedParties.length > 0,
        autonomyLevel: system.affectsDecisions ? 'assisted' : 'none',
        isProvider: system.isProvider,
        interactsWithPublic: system.affectedParties.includes('public') || system.affectedParties.includes('customers'),
        generatesContent: option?.category === 'content_generation',
        usesRealTimeIdentification: false,
      }
      return {
        ...system,
        classification: classifyRisk(aiInput),
        aiSystemInput: aiInput,
      }
    })
    updateData({ classifiedSystems: classified })
  }

  const canProceed = (): boolean => {
    if (currentStep === 1) return data.selectedOptions.length > 0
    if (currentStep === 2) return data.systems.every((s) => s.name.trim() !== '')
    return true
  }

  const handleNext = (): void => {
    if (currentStep === 1) initializeSystems()
    if (currentStep === 2) runClassification()
    setCurrentStep((s) => Math.min(s + 1, 5))
  }

  const handleBack = (): void => {
    if (currentStep === 1) {
      router.push('/dashboard')
    } else {
      setCurrentStep((s) => s - 1)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <WizardProgress currentStep={currentStep} totalSteps={5} stepLabels={STEP_LABELS} />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {currentStep === 1 && <StepAIDiscovery data={data} onUpdate={updateData} />}
        {currentStep === 2 && <StepSystemDetails data={data} onUpdate={updateData} />}
        {currentStep === 3 && <StepClassification data={data} />}
        {currentStep === 4 && <StepRoadmap data={data} />}
        {currentStep === 5 && <StepSummary data={data} organizationId={organizationId} />}
      </div>

      {currentStep < 5 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 rounded-lg bg-[--brand-primary] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[--brand-primary-light] disabled:opacity-50"
          >
            {currentStep === 4 ? 'Review & Save' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
