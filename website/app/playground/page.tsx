'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Ghostly, GhostlyList } from '@ghostly-ui/react'
import { ProductCard } from '@/components/examples/product-card'
import { UserProfile } from '@/components/examples/user-profile'
import { StatsCard } from '@/components/examples/stats-card'

const MOCK_PRODUCTS = [
  { title: 'Pulp Fiction Poster', price: '€24.99', image: 'https://picsum.photos/seed/1/400/300', category: 'Movies' },
  { title: 'Abbey Road Print', price: '€19.99', image: 'https://picsum.photos/seed/2/400/300', category: 'Music' },
  { title: 'Jordan 23 Art', price: '€29.99', image: 'https://picsum.photos/seed/3/400/300', category: 'Sports' },
  { title: 'Starry Night Repro', price: '€34.99', image: 'https://picsum.photos/seed/4/400/300', category: 'Art' },
  { title: 'Blade Runner 2049', price: '€22.99', image: 'https://picsum.photos/seed/5/400/300', category: 'Movies' },
  { title: 'Dark Side of Moon', price: '€27.99', image: 'https://picsum.photos/seed/6/400/300', category: 'Music' },
]

const MOCK_USER = {
  name: 'Adan Ulises',
  email: 'adan@postershouse.es',
  role: 'Admin',
  avatar: 'https://picsum.photos/seed/avatar/200/200',
  bio: 'Founder of Posters House. Movie lover and poster collector since 1998. Based in Barcelona.',
}

const MOCK_STATS = [
  { label: 'Total Revenue', value: '€12,450', change: '+12.5% from last month' },
  { label: 'Orders', value: '342', change: '+8.2% from last month' },
  { label: 'Customers', value: '1,205', change: '+23.1% from last month' },
]

type Animation = 'shimmer' | 'pulse' | 'wave'

export default function PlaygroundPage() {
  const [loading, setLoading] = useState(true)
  const [animation, setAnimation] = useState<Animation>('shimmer')

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <Link href="/" className="mb-4 inline-block text-sm text-fd-muted-foreground hover:text-fd-foreground">
          &larr; Back to home
        </Link>
        <h1 className="text-4xl font-bold text-fd-foreground">
          Ghostly Playground
        </h1>
        <p className="mt-2 text-lg text-fd-muted-foreground">
          Interactive demo. Try the animations, see the code.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => setLoading(true)}
          className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90"
        >
          Reload (3s delay)
        </button>

        <div className="flex gap-2">
          {(['shimmer', 'pulse', 'wave'] as const).map((anim) => (
            <button
              key={anim}
              onClick={() => { setAnimation(anim); setLoading(true) }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                animation === anim
                  ? 'bg-fd-foreground text-fd-background'
                  : 'bg-fd-secondary text-fd-muted-foreground hover:bg-fd-accent'
              }`}
            >
              {anim}
            </button>
          ))}
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          loading
            ? 'bg-amber-500/10 text-amber-600'
            : 'bg-green-500/10 text-green-600'
        }`}>
          {loading ? 'Loading...' : 'Loaded'}
        </span>
      </div>

      {/* Section: Single component */}
      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-fd-foreground">
          Single component (smooth transition)
        </h2>
        <code className="mb-4 block rounded-lg border border-fd-border bg-fd-muted/50 p-3 text-sm text-fd-muted-foreground">
          {'<Ghostly loading={isLoading} smooth><UserProfile /></Ghostly>'}
        </code>
        <Ghostly loading={loading} animation={animation} smooth>
          <UserProfile user={loading ? undefined : MOCK_USER} />
        </Ghostly>
      </section>

      {/* Section: Grid list */}
      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-fd-foreground">
          List with GhostlyList
        </h2>
        <code className="mb-4 block rounded-lg border border-fd-border bg-fd-muted/50 p-3 text-sm text-fd-muted-foreground">
          {'<GhostlyList loading={isLoading} count={6} item={<ProductCard />}>'}
        </code>
        <GhostlyList
          loading={loading}
          count={6}
          item={<ProductCard />}
          animation={animation}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MOCK_PRODUCTS.map((p) => (
            <ProductCard key={p.title} product={p} />
          ))}
        </GhostlyList>
      </section>

      {/* Section: Custom colors */}
      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-fd-foreground">
          Custom colors via props
        </h2>
        <code className="mb-4 block rounded-lg border border-fd-border bg-fd-muted/50 p-3 text-sm text-fd-muted-foreground">
          {'<Ghostly loading color="hsl(260 60% 88%)" shine="hsl(260 60% 94%)">'}
        </code>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {(loading ? [undefined, undefined, undefined] : MOCK_STATS).map((stat, i) => (
            <Ghostly
              key={i}
              loading={loading}
              animation={animation}
              color="hsl(260 60% 88%)"
              shine="hsl(260 60% 94%)"
              smooth
            >
              <StatsCard stat={stat} />
            </Ghostly>
          ))}
        </div>
      </section>

      {/* Section: data-ghostly-lines */}
      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-fd-foreground">
          Line count control (data-ghostly-lines)
        </h2>
        <code className="mb-4 block rounded-lg border border-fd-border bg-fd-muted/50 p-3 text-sm text-fd-muted-foreground">
          {'<p data-ghostly-lines="1"> / <p data-ghostly-lines="5">'}
        </code>
        <Ghostly loading={loading} animation={animation}>
          <div className="space-y-4 rounded-xl border border-fd-border bg-fd-card p-6">
            <h3 data-ghostly-lines="1">{loading ? '' : 'Article Title'}</h3>
            <p data-ghostly-lines="1">{loading ? '' : 'Short subtitle for the article'}</p>
            <p data-ghostly-lines="5">{loading ? '' : 'This is a long paragraph that would take up multiple lines in the actual rendered content. It demonstrates how data-ghostly-lines="5" creates a taller skeleton block to simulate more text content.'}</p>
          </div>
        </Ghostly>
      </section>

      {/* Section: data-ghostly-ignore */}
      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-fd-foreground">
          Exclude elements with data-ghostly-ignore
        </h2>
        <code className="mb-4 block rounded-lg border border-fd-border bg-fd-muted/50 p-3 text-sm text-fd-muted-foreground">
          {'<button data-ghostly-ignore>Always visible</button>'}
        </code>
        <Ghostly loading={loading} animation={animation}>
          <div className="flex items-center gap-4 rounded-xl border border-fd-border bg-fd-card p-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-fd-foreground">{loading ? '' : 'Product Title'}</h3>
              <p className="text-sm text-fd-muted-foreground">{loading ? '' : 'Description of the product'}</p>
            </div>
            <button
              data-ghostly-ignore
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Always visible
            </button>
          </div>
        </Ghostly>
      </section>
    </div>
  )
}
