# Examples

## Basic: Single component

```tsx
import { Ghostly } from '@ghostly/react'

function UserPage() {
  const { data, isLoading } = useQuery('user')

  return (
    <Ghostly loading={isLoading}>
      <UserProfile user={data} />
    </Ghostly>
  )
}
```

## List: Product grid

```tsx
import { GhostlyList } from '@ghostly/react'

function ShopPage() {
  const { data: products, isLoading } = useQuery('products')

  return (
    <GhostlyList
      loading={isLoading}
      count={8}
      item={<ProductCard />}
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      {products?.map(p => <ProductCard key={p.id} product={p} />)}
    </GhostlyList>
  )
}
```

## Suspense integration

```tsx
import { Suspense } from 'react'
import { Ghostly } from '@ghostly/react'

function Page() {
  return (
    <Suspense fallback={
      <Ghostly loading={true}>
        <ProductCard />
      </Ghostly>
    }>
      <AsyncProductCard />
    </Suspense>
  )
}

async function AsyncProductCard() {
  const product = await fetchProduct()
  return <ProductCard product={product} />
}
```

## Exclude elements

Use `data-ghostly-ignore` on elements that should remain visible during loading:

```tsx
<Ghostly loading={isLoading}>
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div>
      <h3>{data?.title ?? ''}</h3>
      <p>{data?.description ?? ''}</p>
    </div>
    <button data-ghostly-ignore className="btn-primary">
      Share
    </button>
  </div>
</Ghostly>
```

## Multiple sections with different states

```tsx
function DashboardPage() {
  const stats = useQuery('stats')
  const orders = useQuery('orders')
  const chart = useQuery('chart')

  return (
    <div className="space-y-8">
      {/* Stats load fast */}
      <Ghostly loading={stats.isLoading} animation="pulse">
        <StatsRow stats={stats.data} />
      </Ghostly>

      {/* Chart takes longer */}
      <Ghostly loading={chart.isLoading} animation="shimmer">
        <RevenueChart data={chart.data} />
      </Ghostly>

      {/* Orders list */}
      <GhostlyList
        loading={orders.isLoading}
        count={5}
        item={<OrderRow />}
        animation="wave"
        className="flex flex-col divide-y"
      >
        {orders.data?.map(o => <OrderRow key={o.id} order={o} />)}
      </GhostlyList>
    </div>
  )
}
```

## Global configuration

Set defaults once in your app root:

```tsx
// layout.tsx
import { GhostlyProvider } from '@ghostly/react'
import 'ghostly/css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GhostlyProvider animation="shimmer" radius="md" speed="normal">
          {children}
        </GhostlyProvider>
      </body>
    </html>
  )
}
```

## With TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query'
import { Ghostly } from '@ghostly/react'

function UserCard({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })

  return (
    <Ghostly loading={isLoading}>
      <div className="flex gap-4 p-4 rounded-xl border">
        <img
          src={data?.avatar ?? ''}
          className="h-12 w-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{data?.name ?? ''}</h3>
          <p className="text-sm text-gray-500">{data?.email ?? ''}</p>
        </div>
      </div>
    </Ghostly>
  )
}
```

## With SWR

```tsx
import useSWR from 'swr'
import { Ghostly } from '@ghostly/react'

function PostList() {
  const { data, isLoading } = useSWR('/api/posts', fetcher)

  return (
    <GhostlyList
      loading={isLoading}
      count={3}
      item={<PostPreview />}
      className="space-y-4"
    >
      {data?.map(post => <PostPreview key={post.id} post={post} />)}
    </GhostlyList>
  )
}
```

## Custom skeleton colors per section

```tsx
<Ghostly
  loading={true}
  style={{
    '--ghostly-color': 'hsl(260 30% 88%)',
    '--ghostly-shine': 'hsl(260 30% 94%)',
  } as React.CSSProperties}
>
  <SpecialSection />
</Ghostly>
```
