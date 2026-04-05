'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Ghostly, GhostlyList } from '@ghostly-ui/react'
import { ProductCard } from '@/components/examples/product-card'
import { UserProfile } from '@/components/examples/user-profile'
import { StatsCard } from '@/components/examples/stats-card'

const MOCK_USER = {
  name: 'Sarah Chen',
  email: 'sarah@company.com',
  role: 'Designer',
  avatar: 'https://picsum.photos/seed/sarah/200/200',
  bio: 'Product designer crafting beautiful experiences. Previously at Stripe and Figma.',
}

const MOCK_PRODUCTS = [
  { title: 'Wireless Headphones', price: '$129', image: 'https://picsum.photos/seed/hp/400/300', category: 'Audio' },
  { title: 'Mechanical Keyboard', price: '$89', image: 'https://picsum.photos/seed/kb/400/300', category: 'Peripherals' },
  { title: 'USB-C Hub Pro', price: '$49', image: 'https://picsum.photos/seed/hub/400/300', category: 'Accessories' },
]

const MOCK_STATS = [
  { label: 'Revenue', value: '$48.2K', change: '+12.5%' },
  { label: 'Orders', value: '1,429', change: '+8.2%' },
  { label: 'Customers', value: '3,842', change: '+23.1%' },
]

// --- Hero demo: auto-cycling skeleton ---
function HeroDemo() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading((prev) => !prev)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <Ghostly loading={loading} animation="shimmer" smooth>
      <UserProfile user={loading ? undefined : MOCK_USER} />
    </Ghostly>
  )
}

// --- Interactive demo section ---
function InteractiveDemo() {
  const [loading, setLoading] = useState(true)
  const [animation, setAnimation] = useState<'shimmer' | 'pulse' | 'wave'>('shimmer')

  const reload = useCallback(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2500)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={reload}
          className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
        >
          Reload
        </button>
        <div className="flex gap-1.5">
          {(['shimmer', 'pulse', 'wave'] as const).map((anim) => (
            <button
              key={anim}
              onClick={() => { setAnimation(anim); setLoading(true); setTimeout(() => setLoading(false), 2500) }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                animation === anim
                  ? 'bg-fd-foreground text-fd-background'
                  : 'bg-fd-muted text-fd-muted-foreground hover:bg-fd-accent'
              }`}
            >
              {anim}
            </button>
          ))}
        </div>
        <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${
          loading ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'
        }`}>
          {loading ? 'Loading...' : 'Loaded'}
        </span>
      </div>

      {/* Grid demo */}
      <GhostlyList
        loading={loading}
        count={3}
        item={<ProductCard />}
        animation={animation}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {MOCK_PRODUCTS.map((p) => (
          <ProductCard key={p.title} product={p} />
        ))}
      </GhostlyList>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {(loading ? [undefined, undefined, undefined] : MOCK_STATS).map((stat, i) => (
          <Ghostly key={i} loading={loading} animation={animation} smooth>
            <StatsCard stat={stat} />
          </Ghostly>
        ))}
      </div>
    </div>
  )
}

// --- Install command with copy ---
function InstallCommand() {
  const [copied, setCopied] = useState(false)
  const cmd = 'npm install @ghostly-ui/core @ghostly-ui/react'

  return (
    <button
      onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="group flex w-full max-w-lg items-center gap-3 rounded-xl border border-fd-border bg-fd-card px-5 py-3.5 text-left font-mono text-sm transition-colors hover:border-fd-primary/50 hover:bg-fd-accent/50"
    >
      <span className="text-fd-muted-foreground">$</span>
      <span className="flex-1 text-fd-foreground">{cmd}</span>
      <span className="rounded-md bg-fd-muted px-2 py-1 text-xs text-fd-muted-foreground transition-colors group-hover:bg-fd-primary/10 group-hover:text-fd-primary">
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24 md:pt-32">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)_0%,transparent_50%)] opacity-[0.08]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-4 py-1.5 text-sm text-fd-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                v0.2.1 — Production Ready
              </div>

              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-fd-foreground sm:text-5xl md:text-6xl">
                Your component{' '}
                <span className="bg-gradient-to-r from-fd-primary to-fd-primary/60 bg-clip-text text-transparent">
                  is the skeleton
                </span>
              </h1>

              <p className="mb-8 max-w-lg text-lg text-fd-muted-foreground md:text-xl">
                Zero-config skeleton loaders for React. Wrap your component, import the CSS.
                No CLI, no build step, no code changes.
              </p>

              <div className="mb-8">
                <InstallCommand />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/docs"
                  className="inline-flex h-11 items-center rounded-lg bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground shadow-sm transition-colors hover:bg-fd-primary/90"
                >
                  Get Started
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex h-11 items-center rounded-lg border border-fd-border bg-fd-card px-6 text-sm font-medium text-fd-foreground shadow-sm transition-colors hover:bg-fd-accent"
                >
                  Live Demo
                </Link>
                <Link
                  href="https://github.com/AdanSerrano/ghostly"
                  className="inline-flex h-11 items-center rounded-lg border border-fd-border bg-fd-card px-6 text-sm font-medium text-fd-foreground shadow-sm transition-colors hover:bg-fd-accent"
                >
                  GitHub
                </Link>
              </div>
            </div>

            {/* Right: Live skeleton demo */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-fd-primary/10 via-transparent to-fd-primary/5 blur-xl" />
              <div className="relative rounded-2xl border border-fd-border bg-fd-card/80 p-6 shadow-2xl backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/60" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <div className="h-3 w-3 rounded-full bg-green-400/60" />
                  <span className="ml-2 text-xs text-fd-muted-foreground">Live Preview</span>
                </div>
                <HeroDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS — 3 steps ====== */}
      <section className="border-t border-fd-border bg-fd-muted/30 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-fd-foreground">
            Three lines. That's it.
          </h2>
          <p className="mb-12 text-center text-fd-muted-foreground">
            No CLI tools, no config files, no generated code. Your components stay exactly as they are.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Install',
                code: 'npm install @ghostly-ui/core\n@ghostly-ui/react',
              },
              {
                step: '2',
                title: 'Import CSS',
                code: "@import '@ghostly-ui/core/css';",
              },
              {
                step: '3',
                title: 'Wrap',
                code: '<Ghostly loading={isLoading}>\n  <YourComponent />\n</Ghostly>',
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl border border-fd-border bg-fd-card p-6">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-fd-primary text-sm font-bold text-fd-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-fd-foreground">{item.title}</h3>
                <pre className="overflow-x-auto rounded-lg bg-fd-muted/50 p-3 text-xs text-fd-muted-foreground">
                  <code>{item.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BEFORE / AFTER ====== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-fd-foreground">
            Before vs After
          </h2>
          <p className="mb-12 text-center text-fd-muted-foreground">
            Other libraries make you rewrite your components. Ghostly doesn't.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Before */}
            <div className="rounded-xl border border-red-500/20 bg-fd-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                  Other libraries
                </span>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-fd-muted/50 p-4 text-xs leading-relaxed text-fd-muted-foreground">
                <code>{`// Rewrite your component as skeleton
function ProductCardSkeleton() {
  return (
    <div className="card">
      <Skeleton height={192} />
      <div className="p-4">
        <Skeleton width={60} height={16} />
        <Skeleton height={20} />
        <Skeleton width={80} height={24} />
        <Skeleton height={40} radius={8} />
      </div>
    </div>
  )
}

// Maintain TWO components forever
{isLoading
  ? <ProductCardSkeleton />
  : <ProductCard product={data} />
}`}</code>
              </pre>
            </div>

            {/* After */}
            <div className="rounded-xl border border-green-500/20 bg-fd-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                  Ghostly
                </span>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-fd-muted/50 p-4 text-xs leading-relaxed text-fd-muted-foreground">
                <code>{`// Your component stays the same
// Zero skeleton code to maintain

<Ghostly loading={isLoading}>
  <ProductCard product={data} />
</Ghostly>

// That's it. Done.
// CSS handles everything.`}</code>
              </pre>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Zero maintenance. Zero duplication.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== INTERACTIVE DEMO ====== */}
      <section className="border-t border-fd-border bg-fd-muted/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-fd-foreground">
            Try it right now
          </h2>
          <p className="mb-12 text-center text-fd-muted-foreground">
            Click the buttons. Switch animations. See your components transform.
          </p>
          <InteractiveDemo />
        </div>
      </section>

      {/* ====== FEATURES GRID ====== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-fd-foreground">
            Everything you need
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '0',
                title: 'Zero Config',
                desc: 'No CLI, no build step, no generated files, no config. Install and use.',
              },
              {
                icon: '~3KB',
                title: 'Tiny Bundle',
                desc: 'CSS-first engine. Zero runtime JS for skeleton rendering. Tree-shakeable.',
              },
              {
                title: 'React Suspense',
                desc: 'GhostlySuspense wraps Suspense with automatic skeleton. Zero state management.',
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: 'Dark Mode',
                desc: 'Auto-detects via .dark class, data-theme, or prefers-color-scheme.',
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ),
              },
              {
                title: 'Accessible',
                desc: 'ARIA attributes, reduced motion support, screen reader friendly.',
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
              },
              {
                title: 'Tailwind Plugin',
                desc: 'ghostly-radius-*, ghostly-speed-*, ghostly-color-[...] utilities.',
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
              },
              {
                title: 'Smooth Transitions',
                desc: 'Fade-out when loading ends. No jarring content pops.',
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
              {
                title: 'Color Props',
                desc: 'Customize per-instance with color and shine props. No CSS needed.',
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.25" />
                  </svg>
                ),
              },
              {
                title: 'MCP Server',
                desc: 'AI assistants get real docs. No hallucination. Works with Claude, Cursor, Copilot.',
                icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div key={typeof feature.title === 'string' ? feature.title : ''} className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/30">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-fd-primary/10 text-sm font-bold text-fd-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold text-fd-foreground">{feature.title}</h3>
                <p className="text-sm text-fd-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CODE EXAMPLE ====== */}
      <section className="border-t border-fd-border bg-fd-muted/30 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-fd-foreground">
            Works with everything
          </h2>
          <p className="mb-12 text-center text-fd-muted-foreground">
            TanStack Query, SWR, Suspense, Server Components, Next.js — just wrap and go.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
              <div className="border-b border-fd-border bg-fd-muted/50 px-4 py-2.5">
                <span className="text-xs font-medium text-fd-muted-foreground">TanStack Query</span>
              </div>
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-fd-muted-foreground">
                <code>{`const { data, isLoading } = useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
})

<Ghostly loading={isLoading} smooth>
  <UserProfile user={data} />
</Ghostly>`}</code>
              </pre>
            </div>

            <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card">
              <div className="border-b border-fd-border bg-fd-muted/50 px-4 py-2.5">
                <span className="text-xs font-medium text-fd-muted-foreground">React Suspense</span>
              </div>
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-fd-muted-foreground">
                <code>{`import { GhostlySuspense } from
  '@ghostly-ui/react'

<GhostlySuspense
  fallback={<ProductCard />}
  smooth
>
  <AsyncProductCard id={123} />
</GhostlySuspense>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-fd-foreground">
            Start loading beautifully
          </h2>
          <p className="mb-8 text-fd-muted-foreground">
            ~3KB total. Zero runtime JS. Works in 30 seconds.
          </p>

          <div className="mb-8 flex justify-center">
            <InstallCommand />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-lg bg-fd-primary px-8 text-sm font-medium text-fd-primary-foreground shadow-sm transition-colors hover:bg-fd-primary/90"
            >
              Read the docs
            </Link>
            <Link
              href="/playground"
              className="inline-flex h-11 items-center rounded-lg border border-fd-border bg-fd-card px-8 text-sm font-medium text-fd-foreground shadow-sm transition-colors hover:bg-fd-accent"
            >
              Try the playground
            </Link>
          </div>

          <p className="mt-12 text-sm text-fd-muted-foreground">
            MIT Licensed — Built by{' '}
            <Link href="https://github.com/AdanSerrano" className="underline underline-offset-4 hover:text-fd-foreground">
              Adan Serrano
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
