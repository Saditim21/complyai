'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { getOptionById } from './discoveryOptions'
import type { WizardData, SystemDetails } from './types'
import { AFFECTED_PARTIES_OPTIONS, DATA_TYPES_OPTIONS } from './types'

interface StepSystemDetailsProps {
  data: WizardData
  onUpdate: (updates: Partial<WizardData>) => void
}

export function StepSystemDetails({ data, onUpdate }: StepSystemDetailsProps): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0)

  const updateSystem = (index: number, updates: Partial<SystemDetails>): void => {
    const newSystems = [...data.systems]
    newSystems[index] = { ...newSystems[index], ...updates }
    onUpdate({ systems: newSystems })
  }

  const toggleArrayValue = (index: number, field: 'affectedParties' | 'dataTypes', value: string): void => {
    const system = data.systems[index]
    const currentValues = system[field]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    updateSystem(index, { [field]: newValues })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Tell us about each system</h2>
        <p className="mt-1 text-slate-500">
          Provide details about each AI system so we can assess compliance requirements.
        </p>
      </div>

      <div className="space-y-4">
        {data.systems.map((system, index) => {
          const option = getOptionById(system.sourceOptionId)
          const isActive = activeIndex === index
          return (
            <div key={system.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveIndex(isActive ? -1 : index)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50"
              >
                <div>
                  <span className="font-medium text-slate-900">{system.name || option?.label}</span>
                  <span className="ml-2 text-sm text-slate-500">System {index + 1} of {data.systems.length}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
              </button>

              {isActive && (
                <div className="border-t border-slate-200 p-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">System name</label>
                      <input
                        type="text"
                        value={system.name}
                        onChange={(e) => updateSystem(index, { name: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Vendor/Provider</label>
                      <input
                        type="text"
                        value={system.vendor}
                        onChange={(e) => updateSystem(index, { vendor: e.target.value })}
                        placeholder="e.g., OpenAI, Microsoft, Internal"
                        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">How is this system used?</label>
                    <textarea
                      value={system.description}
                      onChange={(e) => updateSystem(index, { description: e.target.value })}
                      placeholder="Describe how your organization uses this AI system..."
                      rows={2}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Who is affected by this system?</label>
                    <div className="flex flex-wrap gap-2">
                      {AFFECTED_PARTIES_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleArrayValue(index, 'affectedParties', opt.value)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                            system.affectedParties.includes(opt.value)
                              ? 'bg-[--brand-primary] text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">What data does it process?</label>
                    <div className="flex flex-wrap gap-2">
                      {DATA_TYPES_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleArrayValue(index, 'dataTypes', opt.value)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                            system.dataTypes.includes(opt.value)
                              ? 'bg-[--brand-primary] text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Does it make decisions about people?</label>
                      <div className="flex gap-3">
                        {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map((opt) => (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => updateSystem(index, { affectsDecisions: opt.value })}
                            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                              system.affectsDecisions === opt.value
                                ? 'border-[--brand-primary] bg-blue-50 text-[--brand-primary]'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Your role</label>
                      <div className="flex gap-3">
                        {[{ value: true, label: 'We built it' }, { value: false, label: 'We use it' }].map((opt) => (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => updateSystem(index, { isProvider: opt.value })}
                            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                              system.isProvider === opt.value
                                ? 'border-[--brand-primary] bg-blue-50 text-[--brand-primary]'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
