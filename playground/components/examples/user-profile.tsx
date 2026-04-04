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
    <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <img
        src={user?.avatar ?? ''}
        alt={user?.name ?? ''}
        className="h-16 w-16 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900">{user?.name ?? ''}</h2>
        <span className="text-sm text-gray-500">{user?.email ?? ''}</span>
        <span className="w-fit rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
          {user?.role ?? ''}
        </span>
        <p className="mt-2 text-sm text-gray-600">{user?.bio ?? ''}</p>
      </div>
    </div>
  )
}
