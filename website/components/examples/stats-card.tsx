interface StatsCardProps {
  stat?: {
    label: string
    value: string
    change: string
  }
}

export function StatsCard({ stat }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card p-6">
      <p className="text-sm font-medium text-fd-muted-foreground">{stat?.label ?? ''}</p>
      <h3 className="mt-1 text-3xl font-bold text-fd-foreground">{stat?.value ?? ''}</h3>
      <span className="mt-1 text-sm text-green-600 dark:text-green-400">{stat?.change ?? ''}</span>
    </div>
  )
}
