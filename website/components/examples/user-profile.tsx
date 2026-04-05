interface UserProfileProps {
  user?: {
    name: string
    email: string
    role: string
    avatar: string
    bio: string
  }
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-fd-border bg-fd-card p-6">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <div className="h-16 w-16 rounded-full bg-fd-muted" />
      )}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-fd-foreground">{user?.name ?? ''}</h2>
        <span className="text-sm text-fd-muted-foreground">{user?.email ?? ''}</span>
        <span className="w-fit rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400">
          {user?.role ?? ''}
        </span>
        <p className="mt-2 text-sm text-fd-muted-foreground">{user?.bio ?? ''}</p>
      </div>
    </div>
  )
}
