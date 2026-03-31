import { Check } from 'lucide-react'

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function WizardProgress({ currentStep, totalSteps, stepLabels }: WizardProgressProps): React.ReactElement {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    isCompleted
                      ? 'border-[--brand-secondary] bg-[--brand-secondary] text-white'
                      : isCurrent
                        ? 'border-[--brand-primary] bg-[--brand-primary] text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                <span
                  className={`mt-2 hidden text-xs font-medium sm:block ${
                    isCurrent ? 'text-[--brand-primary]' : isCompleted ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${
                    stepNum < currentStep ? 'bg-[--brand-secondary]' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
