# Suspense Integration

Ghostly works seamlessly with React Suspense, React Server Components (RSC), and streaming SSR.

---

## Basic Suspense

Use `<Ghostly>` as a Suspense fallback:

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

// This component fetches its own data
async function AsyncProductCard() {
  const product = await fetchProduct()
  return <ProductCard product={product} />
}
```

The `<Ghostly loading={true}>` in the fallback shows a skeleton matching the shape of `<ProductCard>`.

---

## Suspense with Lists

```tsx
<Suspense fallback={
  <GhostlyList
    loading={true}
    count={6}
    item={<ProductCard />}
    className="grid grid-cols-3 gap-4"
  >
    {/* Empty children for fallback */}
    <></>
  </GhostlyList>
}>
  <AsyncProductGrid />
</Suspense>
```

---

## React Server Components (Next.js App Router)

In RSC, async components automatically trigger Suspense. Ghostly works with the `loading.tsx` convention:

```tsx
// app/products/page.tsx (Server Component)
export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}

// app/products/loading.tsx (Suspense fallback)
import { GhostlyList } from '@ghostly/react'
import { ProductCard } from '@/components/product-card'

export default function Loading() {
  return (
    <GhostlyList
      loading={true}
      count={6}
      item={<ProductCard />}
      className="grid grid-cols-3 gap-4"
    >
      <></>
    </GhostlyList>
  )
}
```

---

## Streaming SSR

Ghostly's CSS-first approach works perfectly with streaming:

1. The CSS is loaded once in `<head>` (or via `@import`)
2. Streamed Suspense boundaries arrive with `data-ghostly` attribute
3. When data resolves, the attribute is removed
4. No hydration mismatch because the attribute is set server-side

```tsx
// The skeleton renders in the initial HTML stream
// When the data resolves, React replaces it with real content
<Suspense fallback={
  <div data-ghostly="shimmer">
    <h1></h1>
    <p></p>
  </div>
}>
  <AsyncContent />
</Suspense>
```

---

## Multiple Suspense Boundaries

Different sections load independently:

```tsx
function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Stats load first */}
      <div className="col-span-12">
        <Suspense fallback={
          <Ghostly loading={true} animation="pulse">
            <StatsRow />
          </Ghostly>
        }>
          <AsyncStats />
        </Suspense>
      </div>

      {/* Chart takes longer */}
      <div className="col-span-8">
        <Suspense fallback={
          <Ghostly loading={true}>
            <Chart />
          </Ghostly>
        }>
          <AsyncChart />
        </Suspense>
      </div>

      {/* Sidebar loads independently */}
      <div className="col-span-4">
        <Suspense fallback={
          <Ghostly loading={true} animation="wave">
            <ActivityFeed />
          </Ghostly>
        }>
          <AsyncActivityFeed />
        </Suspense>
      </div>
    </div>
  )
}
```

---

## Nested Suspense

Ghostly contexts work correctly with nested Suspense boundaries:

```tsx
<Suspense fallback={<PageSkeleton />}>
  <PageLayout>
    <Suspense fallback={
      <Ghostly loading={true}>
        <Sidebar />
      </Ghostly>
    }>
      <AsyncSidebar />
    </Suspense>

    <Suspense fallback={
      <Ghostly loading={true}>
        <MainContent />
      </Ghostly>
    }>
      <AsyncMainContent />
    </Suspense>
  </PageLayout>
</Suspense>
```

Each `<Ghostly>` has its own context, so animations and configs don't leak between boundaries.
