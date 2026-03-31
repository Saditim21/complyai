'use client'

import { Users, MessageCircle, PenTool, CreditCard, Settings, Sparkles, Check } from 'lucide-react'

import { DISCOVERY_GROUPS } from './discoveryOptions'
import type { WizardData } from './types'

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="h-5 w-5" />,
  MessageCircle: <MessageCircle className="h-5 w-5" />,
  PenTool: <PenTool className="h-5 w-5" />,
  CreditCard: <CreditCard className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
}

interface StepAIDiscoveryProps {
  data: WizardData
  onUpdate: (updates: Partial<WizardData>) => void
}

export function StepAIDiscovery({ data, onUpdate }: StepAIDiscoveryProps): React.ReactElement {
  const toggleOption = (optionId: string): void => {
    const newSelected = data.selectedOptions.includes(optionId)
      ? data.selectedOptions.filter((id) => id !== optionId)
      : [...data.selectedOptions, optionId]
    onUpdate({ selectedOptions: newSelected })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Let&apos;s find your AI systems</h2>
        <p className="mt-1 text-slate-500">
          Select all AI tools and systems your organization uses.
        </p>
      </div>

      <div className="space-y-6">
        {DISCOVERY_GROUPS.map((group) => (
          <div key={group.id} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">{ICON_MAP[group.icon]}</div>
              <h3 className="font-semibold text-slate-900">{group.name}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.options.map((option) => {
                const isSelected = data.selectedOptions.includes(option.id)
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleOption(option.id)}
                    className={`relative flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-[--brand-primary] bg-blue-50/50 ring-1 ring-[--brand-primary]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        isSelected ? 'border-[--brand-primary] bg-[--brand-primary] text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{option.label}</div>
                      <div className="mt-0.5 text-sm text-slate-500">{option.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <label htmlFor="other-systems" className="block font-medium text-slate-900">
          Any other AI tools not listed above?
        </label>
        <textarea
          id="other-systems"
          value={data.otherSystems}
          onChange={(e) => onUpdate({ otherSystems: e.target.value })}
          placeholder="e.g., Custom ML model for inventory forecasting..."
          className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-[--brand-primary] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/20"
          rows={3}
        />
      </div>

      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        <strong>{data.selectedOptions.length}</strong> system{data.selectedOptions.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  )
}
