'use client'

import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'

import type { WizardData } from './types'

const RISK_STYLES = {
  unacceptable: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' },
  limited: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
  minimal: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' },
} as const

const RISK_ICONS = {
  unacceptable: <AlertTriangle className="h-5 w-5" />,
  high: <AlertCircle className="h-5 w-5" />,
  limited: <Info className="h-5 w-5" />,
  minimal: <CheckCircle className="h-5 w-5" />,
}

const RISK_LABELS = {
  unacceptable: 'Prohibited',
  high: 'High Risk',
  limited: 'Limited Risk',
  minimal: 'Minimal Risk',
}

interface StepClassificationProps {
  data: WizardData
}

export function StepClassification({ data }: StepClassificationProps): React.ReactElement {
  const sortedSystems = [...data.classifiedSystems].sort((a, b) => {
    const order = { unacceptable: 0, high: 1, limited: 2, minimal: 3 }
    return order[a.classification.riskLevel] - order[b.classification.riskLevel]
  })

  const counts = {
    unacceptable: sortedSystems.filter((s) => s.classification.riskLevel === 'unacceptable').length,
    high: sortedSystems.filter((s) => s.classification.riskLevel === 'high').length,
    limited: sortedSystems.filter((s) => s.classification.riskLevel === 'limited').length,
    minimal: sortedSystems.filter((s) => s.classification.riskLevel === 'minimal').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Your risk classification</h2>
        <p className="mt-1 text-slate-500">
          Based on the EU AI Act, here&apos;s how your AI systems are classified.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {(['unacceptable', 'high', 'limited', 'minimal'] as const).map((level) => (
          <div key={level} className={`rounded-lg p-3 text-center ${RISK_STYLES[level].bg}`}>
            <div className={`text-2xl font-bold ${RISK_STYLES[level].text}`}>{counts[level]}</div>
            <div className={`text-xs font-medium ${RISK_STYLES[level].text}`}>{RISK_LABELS[level]}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {sortedSystems.map((system) => {
          const style = RISK_STYLES[system.classification.riskLevel]
          return (
            <div key={system.id} className={`rounded-xl border ${style.border} ${style.bg} p-5`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={style.text}>{RISK_ICONS[system.classification.riskLevel]}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{system.name}</h3>
                    <p className="mt-0.5 text-sm text-slate-600">{system.vendor}</p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>
                  {RISK_LABELS[system.classification.riskLevel]}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                {system.classification.annexDomain && (
                  <div>
                    <span className="font-medium text-slate-700">Annex III Domain: </span>
                    <span className="text-slate-600">{system.classification.annexDomain}</span>
                  </div>
                )}
                {system.classification.articleReferences.length > 0 && (
                  <div>
                    <span className="font-medium text-slate-700">Articles: </span>
                    <span className="text-slate-600">{system.classification.articleReferences.join(', ')}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-slate-700">Why: </span>
                  <span className="text-slate-600">{system.classification.rationale}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {counts.high > 0 && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-orange-600" />
            <div className="text-sm text-orange-800">
              <strong>Action required:</strong> You have {counts.high} high-risk AI system{counts.high > 1 ? 's' : ''} that require compliance documentation before August 2, 2026.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
