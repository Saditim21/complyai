import type { RiskLevel } from '@/types/database'

const RISK_STYLES: Record<RiskLevel, string> = {
  minimal: 'bg-gray-100 text-gray-700 border-gray-200',
  limited: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  unacceptable: 'bg-red-50 text-red-700 border-red-200',
}

const RISK_LABELS: Record<RiskLevel, string> = {
  minimal: 'Minimal Risk',
  limited: 'Limited Risk',
  high: 'High Risk',
  unacceptable: 'Unacceptable Risk',
}

interface RiskBadgeProps {
  level: RiskLevel | null
  size?: 'sm' | 'md'
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps): React.ReactElement {
  if (!level) {
    return (
      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500">
        Unclassified
      </span>
    )
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${RISK_STYLES[level]}`}
    >
      {RISK_LABELS[level]}
    </span>
  )
}
