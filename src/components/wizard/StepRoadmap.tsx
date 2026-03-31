'use client'

import { CheckCircle, Circle, FileText, Shield, Users, Database, Eye, ClipboardList } from 'lucide-react'

import { getRequirementDefinitions } from '@/lib/classification/requirements'

import type { WizardData } from './types'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  risk_management: <Shield className="h-4 w-4" />,
  data_governance: <Database className="h-4 w-4" />,
  documentation: <FileText className="h-4 w-4" />,
  transparency: <Eye className="h-4 w-4" />,
  human_oversight: <Users className="h-4 w-4" />,
  technical: <ClipboardList className="h-4 w-4" />,
  registration: <CheckCircle className="h-4 w-4" />,
}

interface StepRoadmapProps {
  data: WizardData
}

export function StepRoadmap({ data }: StepRoadmapProps): React.ReactElement {
  const highRiskSystems = data.classifiedSystems.filter((s) => s.classification.riskLevel === 'high')
  const limitedRiskSystems = data.classifiedSystems.filter((s) => s.classification.riskLevel === 'limited')

  const highRiskReqs = getRequirementDefinitions('high')
  const limitedRiskReqs = getRequirementDefinitions('limited')

  const totalActions = highRiskSystems.length * highRiskReqs.length + limitedRiskSystems.length * limitedRiskReqs.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Your compliance roadmap</h2>
        <p className="mt-1 text-slate-500">
          Here&apos;s what you need to do to comply with the EU AI Act.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm text-slate-600">
          You have <strong className="text-slate-900">{highRiskSystems.length} high-risk</strong> and{' '}
          <strong className="text-slate-900">{limitedRiskSystems.length} limited-risk</strong> systems requiring{' '}
          <strong className="text-slate-900">{totalActions} compliance actions</strong>.
        </div>
      </div>

      {highRiskSystems.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">High-Risk Systems Requirements</h3>
          {highRiskSystems.map((system) => (
            <div key={system.id} className="rounded-xl border border-orange-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-medium text-slate-900">{system.name}</h4>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                  {highRiskReqs.length} requirements
                </span>
              </div>
              <div className="space-y-3">
                {highRiskReqs.map((req) => (
                  <div key={req.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <div className="mt-0.5 text-slate-400">{TYPE_ICONS[req.type] || <Circle className="h-4 w-4" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 text-sm">{req.title}</span>
                        <span className="text-xs text-slate-500">{req.articleReference}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{req.description}</p>
                    </div>
                    <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {limitedRiskSystems.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Limited-Risk Systems Requirements</h3>
          {limitedRiskSystems.map((system) => (
            <div key={system.id} className="rounded-xl border border-blue-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-medium text-slate-900">{system.name}</h4>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {limitedRiskReqs.length} requirements
                </span>
              </div>
              <div className="space-y-3">
                {limitedRiskReqs.map((req) => (
                  <div key={req.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                    <div className="mt-0.5 text-slate-400">{TYPE_ICONS[req.type] || <Circle className="h-4 w-4" />}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 text-sm">{req.title}</span>
                        <span className="text-xs text-slate-500">{req.articleReference}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{req.description}</p>
                    </div>
                    <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {highRiskSystems.length === 0 && limitedRiskSystems.length === 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
          <p className="mt-2 font-medium text-green-800">All your AI systems are minimal risk!</p>
          <p className="mt-1 text-sm text-green-600">No mandatory compliance requirements apply.</p>
        </div>
      )}
    </div>
  )
}
