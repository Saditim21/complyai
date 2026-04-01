interface ComplianceScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function ComplianceScore({ score, size = 'md' }: ComplianceScoreProps): React.ReactElement {
  const sizeConfig = {
    sm: { container: 'h-16 w-16', text: 'text-lg', stroke: 4 },
    md: { container: 'h-24 w-24', text: 'text-2xl', stroke: 6 },
    lg: { container: 'h-32 w-32', text: 'text-3xl', stroke: 8 },
  }

  const { container, text, stroke } = sizeConfig[size]
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = (value: number): string => {
    if (value >= 80) return 'text-emerald-600'
    if (value >= 50) return 'text-amber-600'
    return 'text-red-600'
  }

  const getStrokeColor = (value: number): string => {
    if (value >= 80) return 'stroke-emerald-500'
    if (value >= 50) return 'stroke-amber-500'
    return 'stroke-red-500'
  }

  return (
    <div className={`relative ${container}`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-500 ${getStrokeColor(score)}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-semibold ${text} ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
    </div>
  )
}
