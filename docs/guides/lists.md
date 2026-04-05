# Working with Lists

Lists, grids, and tables need special handling because the data array starts empty during loading — there's nothing to skeletonize.

---

## The Problem

```tsx
// This shows an empty grid during loading!
<Ghostly loading={isLoading}>
  <div className="grid grid-cols-3 gap-4">
    {products.map(p => <ProductCard key={p.id} product={p} />)}
  </div>
</Ghostly>
// products is [] when loading → grid has 0 children → nothing to show
```

---

## Solution: GhostlyList

`<GhostlyList>` renders N copies of a template component while loading:

```tsx
import { GhostlyList } from '@ghostly-ui/react'

<GhostlyList
  loading={isLoading}
  count={6}
  item={<ProductCard />}
  className="grid grid-cols-3 gap-4"
>
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>
```

When `loading={true}`: renders 6 `<ProductCard />` clones inside a `<Ghostly>` wrapper.
When `loading={false}`: renders your actual product list.

---

## Grid Layouts

```tsx
// 4-column responsive grid
<GhostlyList
  loading={isLoading}
  count={8}
  item={<ProductCard />}
  className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
>
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>
```

The `className` applies to both the skeleton and loaded states, so your grid layout is consistent.

---

## Vertical Lists

```tsx
// Stacked list with dividers
<GhostlyList
  loading={isLoading}
  count={5}
  item={<OrderRow />}
  className="divide-y divide-gray-200"
>
  {orders.map(o => <OrderRow key={o.id} order={o} />)}
</GhostlyList>
```

---

## Tables

For tables, wrap the `<tbody>` content:

```tsx
<table className="w-full">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <GhostlyList
      loading={isLoading}
      count={10}
      item={
        <tr>
          <td>Name placeholder</td>
          <td>email@placeholder.com</td>
          <td>Role</td>
        </tr>
      }
      as="tbody"  {/* Note: GhostlyList renders a div by default */}
    >
      {users.map(u => (
        <tr key={u.id}>
          <td>{u.name}</td>
          <td>{u.email}</td>
          <td>{u.role}</td>
        </tr>
      ))}
    </GhostlyList>
  </tbody>
</table>
```

> Note: For tables, you may need to use `<Ghostly>` directly and handle the row count manually, since `<GhostlyList>` renders a `<div>` wrapper which is invalid inside `<table>`.

---

## Matching Skeleton Count to Grid Columns

Ensure your `count` fills the grid completely:

```tsx
// 3-column grid: use count that's a multiple of 3
<GhostlyList count={6} ...>   {/* 2 full rows */}
<GhostlyList count={9} ...>   {/* 3 full rows */}

// 4-column grid: use count that's a multiple of 4
<GhostlyList count={8} ...>   {/* 2 full rows */}
<GhostlyList count={12} ...>  {/* 3 full rows */}
```

---

## Without `item` Prop

If you don't provide `item`, `<GhostlyList>` uses the first child element as the template:

```tsx
// The first NotificationItem is cloned as the skeleton template
<GhostlyList loading={isLoading} count={5} className="space-y-2">
  {notifications.map(n => (
    <NotificationItem key={n.id} data={n} />
  ))}
</GhostlyList>
```

This works when:
- The first child is a valid React element
- The component renders meaningfully without props (optional chaining on data)

---

## Mixed Content: List with Header

```tsx
<div>
  {/* Header is always visible or has its own skeleton */}
  <Ghostly loading={isLoading}>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">{data?.title ?? ''}</h2>
      <span className="text-sm text-gray-500">{data?.count ?? ''} items</span>
    </div>
  </Ghostly>

  {/* List has its own skeleton */}
  <GhostlyList
    loading={isLoading}
    count={4}
    item={<ProductCard />}
    className="grid grid-cols-2 gap-4"
  >
    {data?.products.map(p => <ProductCard key={p.id} product={p} />)}
  </GhostlyList>
</div>
```
