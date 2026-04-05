# Data Fetching Integration

Ghostly works with any data fetching library. Here's how to integrate with the most popular ones.

---

## TanStack Query (React Query)

```tsx
import { useQuery } from '@tanstack/react-query'
import { Ghostly, GhostlyList } from '@ghostly-ui/react'

// Single item
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })

  return (
    <Ghostly loading={isLoading}>
      <ProfileCard user={data} />
    </Ghostly>
  )
}

// List
function ProductGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  return (
    <GhostlyList
      loading={isLoading}
      count={8}
      item={<ProductCard />}
      className="grid grid-cols-4 gap-4"
    >
      {data?.map(p => <ProductCard key={p.id} product={p} />)}
    </GhostlyList>
  )
}
```

### With `placeholderData`

TanStack Query's `placeholderData` can provide instant skeleton content:

```tsx
const { data, isPlaceholderData } = useQuery({
  queryKey: ['product', id],
  queryFn: () => fetchProduct(id),
  placeholderData: { title: '', price: '', image: '' },
})

// isPlaceholderData is true while showing placeholder
<Ghostly loading={isPlaceholderData}>
  <ProductCard product={data} />
</Ghostly>
```

---

## SWR

```tsx
import useSWR from 'swr'
import { Ghostly, GhostlyList } from '@ghostly-ui/react'

// Single item
function PostDetail({ slug }: { slug: string }) {
  const { data, isLoading } = useSWR(`/api/posts/${slug}`, fetcher)

  return (
    <Ghostly loading={isLoading}>
      <Article post={data} />
    </Ghostly>
  )
}

// List
function BlogIndex() {
  const { data, isLoading } = useSWR('/api/posts', fetcher)

  return (
    <GhostlyList
      loading={isLoading}
      count={5}
      item={<PostPreview />}
      className="space-y-6"
    >
      {data?.map(post => <PostPreview key={post.id} post={post} />)}
    </GhostlyList>
  )
}
```

---

## Native fetch with useTransition

```tsx
import { useState, useTransition, useEffect } from 'react'
import { Ghostly } from '@ghostly-ui/react'

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const data = await fetch(`/api/search?q=${query}`).then(r => r.json())
      setResults(data)
    })
  }, [query])

  return (
    <Ghostly loading={isPending}>
      <ResultsList results={results} />
    </Ghostly>
  )
}
```

---

## Server Actions (Next.js)

```tsx
'use client'

import { useTransition } from 'react'
import { Ghostly } from '@ghostly-ui/react'

function Dashboard() {
  const [data, setData] = useState(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const result = await getDashboardData()
      setData(result)
    })
  }, [])

  return (
    <Ghostly loading={isPending}>
      <DashboardContent data={data} />
    </Ghostly>
  )
}
```

---

## Apollo GraphQL

```tsx
import { useQuery, gql } from '@apollo/client'
import { Ghostly } from '@ghostly-ui/react'

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
      avatar
    }
  }
`

function UserCard({ userId }: { userId: string }) {
  const { data, loading } = useQuery(GET_USER, {
    variables: { id: userId },
  })

  return (
    <Ghostly loading={loading}>
      <Card user={data?.user} />
    </Ghostly>
  )
}
```

---

## tRPC

```tsx
import { trpc } from '@/utils/trpc'
import { Ghostly, GhostlyList } from '@ghostly-ui/react'

function ProductPage({ id }: { id: string }) {
  const { data, isLoading } = trpc.product.getById.useQuery({ id })

  return (
    <Ghostly loading={isLoading}>
      <ProductDetail product={data} />
    </Ghostly>
  )
}

function ProductList() {
  const { data, isLoading } = trpc.product.list.useQuery()

  return (
    <GhostlyList
      loading={isLoading}
      count={6}
      item={<ProductCard />}
      className="grid grid-cols-3 gap-4"
    >
      {data?.map(p => <ProductCard key={p.id} product={p} />)}
    </GhostlyList>
  )
}
```

---

## Pattern: Shared Loading Wrapper

For consistency, create a reusable wrapper:

```tsx
// components/with-skeleton.tsx
import { Ghostly, GhostlyList } from '@ghostly-ui/react'

interface WithSkeletonProps {
  loading: boolean
  children: React.ReactNode
  className?: string
}

export function WithSkeleton({ loading, children, className }: WithSkeletonProps) {
  return (
    <Ghostly loading={loading} className={className}>
      {children}
    </Ghostly>
  )
}

interface WithSkeletonListProps extends WithSkeletonProps {
  count: number
  item: React.ReactElement
}

export function WithSkeletonList({ loading, count, item, children, className }: WithSkeletonListProps) {
  return (
    <GhostlyList loading={loading} count={count} item={item} className={className}>
      {children}
    </GhostlyList>
  )
}
```
