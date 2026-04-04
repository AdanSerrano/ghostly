interface StatsCardProps {
  stat?: {
    label: string
    value: string
    change: string
  }
}

export function StatsCard({ stat }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-500">{stat?.label ?? ''}</p>
      <h3 className="mt-1 text-3xl font-bold text-gray-900">{stat?.value ?? ''}</h3>
      <span className="mt-1 text-sm text-green-600">{stat?.change ?? ''}</span>
    </div>
  )
}
