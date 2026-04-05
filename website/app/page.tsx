'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Ghostly, GhostlyList } from '@ghostly-ui/react'
import { ProductCard } from '@/components/examples/product-card'
import { UserProfile } from '@/components/examples/user-profile'
import { StatsCard } from '@/components/examples/stats-card'

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function HeroDemo() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => setLoading((p) => !p), 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <Ghostly loading={loading} animation="shimmer" smooth>
      <UserProfile user={loading ? undefined : MOCK_USER} />
    </Ghostly>
  )
}

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
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <button
          onClick={reload}
          className="group relative overflow-hidden rounded-full bg-fd-foreground px-5 py-2.5 text-sm font-semibold text-fd-background transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="relative z-10">Reload</span>
        </button>
        <div className="flex rounded-full border border-fd-border bg-fd-card p-1">
          {(['shimmer', 'pulse', 'wave'] as const).map((anim) => (
            <button
              key={anim}
              onClick={() => { setAnimation(anim); setLoading(true); setTimeout(() => setLoading(false), 2500) }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                animation === anim
                  ? 'bg-fd-foreground text-fd-background shadow-sm'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {anim}
            </button>
          ))}
        </div>
        <div className={`ml-auto flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase ${
          loading ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
        }`}>
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
          {loading ? 'Loading' : 'Loaded'}
        </div>
      </div>

      <GhostlyList
        loading={loading}
        count={3}
        item={<ProductCard />}
        animation={animation}
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {MOCK_PRODUCTS.map((p) => (
          <ProductCard key={p.title} product={p} />
        ))}
      </GhostlyList>

      <div className="mt-5 grid grid-cols-3 gap-5">
        {(loading ? [undefined, undefined, undefined] : MOCK_STATS).map((stat, i) => (
          <Ghostly key={i} loading={loading} animation={animation} smooth>
            <StatsCard stat={stat} />
          </Ghostly>
        ))}
      </div>
    </div>
  )
}

function InstallCommand({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const cmd = 'npm i @ghostly-ui/core @ghostly-ui/react'

  return (
    <button
      onClick={() => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className={`group flex w-full items-center gap-3 rounded-2xl border border-fd-border bg-fd-card/60 px-5 py-4 text-left font-[family-name:var(--font-mono)] text-sm backdrop-blur-md transition-all hover:border-fd-primary/40 hover:bg-fd-card/80 hover:shadow-lg hover:shadow-fd-primary/5 ${className}`}
    >
      <span className="text-fd-primary/60">$</span>
      <span className="flex-1 text-fd-foreground/90">{cmd}</span>
      <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
        copied
          ? 'bg-emerald-500/10 text-emerald-600'
          : 'bg-fd-muted text-fd-muted-foreground group-hover:bg-fd-primary/10 group-hover:text-fd-primary'
      }`}>
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  )
}

function useInView() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function FadeSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView()
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </section>
  )
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">

      {/* ────── HERO ────── */}
      <section className="noise-bg relative flex min-h-[calc(100vh-4rem)] items-center px-6 py-20">
        {/* Background layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--color-fd-primary),transparent_60%)] opacity-[0.07]" />
          <div className="grid-bg grid-fade absolute inset-0 opacity-30" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
            {/* Left */}
            <div>
              <div className="animate-hero-1 mb-8 inline-flex items-center gap-2.5 rounded-full border border-fd-border/60 bg-fd-card/60 px-4 py-2 text-sm text-fd-muted-foreground backdrop-blur-md">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px] shadow-emerald-400/40" />
                <span className="font-medium">v0.2.2</span>
                <span className="h-3 w-px bg-fd-border" />
                <span>Production Ready</span>
              </div>

              <h1 className="animate-hero-2 mb-7 text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-fd-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                Your component
                <br />
                <span className="shimmer-text">is the skeleton.</span>
              </h1>

              <p className="animate-hero-3 mb-10 max-w-lg text-lg leading-relaxed text-fd-muted-foreground md:text-xl">
                Zero-config skeleton loaders for React.{' '}
                <span className="text-fd-foreground/80">Wrap your component, import the CSS. Done.</span>
              </p>

              <div className="animate-hero-4 mb-10 max-w-lg">
                <InstallCommand />
              </div>

              <div className="animate-hero-6 flex flex-wrap gap-3">
                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center rounded-full bg-fd-foreground px-7 text-sm font-semibold text-fd-background shadow-lg shadow-fd-foreground/10 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                >
                  Get Started
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex h-12 items-center rounded-full border border-fd-border bg-fd-card/60 px-7 text-sm font-semibold text-fd-foreground backdrop-blur-sm transition-all hover:border-fd-primary/40 hover:bg-fd-card hover:shadow-md"
                >
                  Live Demo
                </Link>
                <Link
                  href="https://github.com/AdanSerrano/ghostly"
                  className="inline-flex h-12 items-center rounded-full border border-fd-border bg-fd-card/60 px-7 text-sm font-semibold text-fd-foreground backdrop-blur-sm transition-all hover:border-fd-primary/40 hover:bg-fd-card hover:shadow-md"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58 0-.28-.01-1.02-.02-2.01-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.42.36.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.18.7.8.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </Link>
              </div>
            </div>

            {/* Right: Browser mockup with live demo */}
            <div className="animate-hero-5 relative animate-float">
              {/* Glow */}
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-fd-primary/15 via-transparent to-fd-primary/10 blur-2xl" />
              <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-br from-fd-primary/20 via-fd-border/40 to-fd-primary/10" />

              {/* Browser frame */}
              <div className="relative overflow-hidden rounded-[20px] bg-fd-card shadow-2xl shadow-black/20">
                {/* Title bar */}
                <div className="flex items-center gap-2 border-b border-fd-border/60 bg-fd-muted/40 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="mx-auto flex items-center gap-2 rounded-md bg-fd-background/60 px-3 py-1">
                    <svg className="h-3 w-3 text-fd-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className="text-[11px] text-fd-muted-foreground/60">your-app.com</span>
                  </div>
                  <div className="w-[52px]" />
                </div>
                {/* Content */}
                <div className="p-5">
                  <HeroDemo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── HOW IT WORKS ────── */}
      <FadeSection className="relative px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-fd-primary">
            How it works
          </p>
          <h2 className="mb-5 text-center text-3xl font-bold text-fd-foreground md:text-4xl">
            Three lines. That&apos;s it.
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-fd-muted-foreground">
            No CLI tools, no config files, no generated code. Your components stay exactly as they are.
          </p>

          <div className="relative grid gap-6 md:grid-cols-3">
            {/* Connector line */}
            <div className="pointer-events-none absolute top-12 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-fd-border to-transparent md:block" />

            {[
              { step: '1', title: 'Install', code: 'npm i @ghostly-ui/core\n       @ghostly-ui/react' },
              { step: '2', title: 'Import CSS', code: "@import '@ghostly-ui/core/css';" },
              { step: '3', title: 'Wrap', code: '<Ghostly loading={isLoading}>\n  <YourComponent />\n</Ghostly>' },
            ].map((item, idx) => (
              <div key={item.step} className="glow-card group relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card p-7 transition-all hover:border-fd-primary/30 hover:shadow-lg hover:shadow-fd-primary/5" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative z-10">
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-fd-primary/10 text-sm font-bold text-fd-primary transition-colors group-hover:bg-fd-primary group-hover:text-fd-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-4 text-lg font-semibold text-fd-foreground">{item.title}</h3>
                  <pre className="overflow-x-auto rounded-xl border border-fd-border/50 bg-fd-muted/30 p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-fd-muted-foreground">
                    <code>{item.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ────── BEFORE / AFTER ────── */}
      <FadeSection className="relative border-t border-fd-border/50 px-6 py-28">
        <div className="pointer-events-none absolute inset-0 bg-fd-muted/20" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-fd-primary">
            Comparison
          </p>
          <h2 className="mb-5 text-center text-3xl font-bold text-fd-foreground md:text-4xl">
            Stop rewriting components.
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-fd-muted-foreground">
            Other libraries make you build separate skeleton components. Ghostly wraps what you already have.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Before */}
            <div className="group relative overflow-hidden rounded-2xl border border-red-500/10 bg-fd-card p-1 transition-all hover:border-red-500/20">
              <div className="rounded-xl bg-fd-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-fd-muted-foreground">Other libraries</span>
                </div>
                <pre className="overflow-x-auto rounded-xl border border-fd-border/50 bg-fd-muted/30 p-5 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-fd-muted-foreground">
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
                <p className="mt-4 flex items-center gap-2 text-xs text-red-500/70">
                  <span className="font-mono">19 lines</span>
                  <span className="h-1 w-1 rounded-full bg-red-500/40" />
                  <span>Duplicate maintenance forever</span>
                </p>
              </div>
            </div>

            {/* After */}
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-fd-card p-1 transition-all hover:border-emerald-500/20">
              <div className="rounded-xl bg-fd-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-fd-muted-foreground">Ghostly</span>
                </div>
                <pre className="overflow-x-auto rounded-xl border border-fd-border/50 bg-fd-muted/30 p-5 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-fd-muted-foreground">
                  <code>{`// Your component stays the same
// Zero skeleton code to write

<Ghostly loading={isLoading}>
  <ProductCard product={data} />
</Ghostly>

// That's it. CSS handles everything.`}</code>
                </pre>
                <p className="mt-4 flex items-center gap-2 text-xs text-emerald-500/70">
                  <span className="font-mono">3 lines</span>
                  <span className="h-1 w-1 rounded-full bg-emerald-500/40" />
                  <span>Zero maintenance, zero duplication</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ────── INTERACTIVE DEMO ────── */}
      <FadeSection className="relative px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-fd-primary">
            Interactive
          </p>
          <h2 className="mb-5 text-center text-3xl font-bold text-fd-foreground md:text-4xl">
            Try it right now.
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-fd-muted-foreground">
            Switch animations, trigger loading states. These are real components.
          </p>
          <div className="rounded-3xl border border-fd-border bg-fd-card/50 p-6 shadow-xl shadow-black/5 backdrop-blur-md md:p-10">
            <InteractiveDemo />
          </div>
        </div>
      </FadeSection>

      {/* ────── FEATURES ────── */}
      <FadeSection className="relative border-t border-fd-border/50 px-6 py-28">
        <div className="pointer-events-none absolute inset-0 bg-fd-muted/20" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-fd-primary">
            Features
          </p>
          <h2 className="mb-16 text-center text-3xl font-bold text-fd-foreground md:text-4xl">
            Everything you need. Nothing you don&apos;t.
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {([
              { icon: '0', title: 'Zero Config', desc: 'No CLI, no build step, no generated files. Install, import, wrap.' },
              { icon: '~3KB', title: 'Tiny Bundle', desc: 'CSS-first engine. Zero runtime JS. Tree-shakeable. Instant.' },
              { icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, title: 'React Suspense', desc: 'GhostlySuspense auto-wraps Suspense boundaries. Zero state management.' },
              { icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>, title: 'Dark Mode', desc: 'Auto-detects via .dark, data-theme, or system preference.' },
              { icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>, title: 'Accessible', desc: 'ARIA attributes, reduced motion, screen reader friendly.' },
              { icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>, title: 'Tailwind Plugin', desc: 'Utility classes for radius, speed, and color. Plus ghostly: variant.' },
              { icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, title: 'Smooth Transitions', desc: 'Graceful fade-out when loading ends. No jarring pops.' },
              { icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.25" /></svg>, title: 'Color Props', desc: 'Per-instance color and shine. No CSS overrides needed.' },
              { icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>, title: 'MCP Server', desc: 'AI assistants get real docs. Claude, Cursor, Copilot.' },
            ] as const).map((feature) => (
              <div key={feature.title} className="glow-card group rounded-2xl border border-fd-border bg-fd-card p-6 transition-all hover:border-fd-primary/20 hover:shadow-lg hover:shadow-fd-primary/5">
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-fd-primary/10 text-sm font-bold text-fd-primary transition-colors group-hover:bg-fd-primary/15">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-semibold text-fd-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-fd-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ────── CODE EXAMPLES ────── */}
      <FadeSection className="relative px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-fd-primary">
            Integrations
          </p>
          <h2 className="mb-5 text-center text-3xl font-bold text-fd-foreground md:text-4xl">
            Works with everything.
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-fd-muted-foreground">
            TanStack Query, SWR, Suspense, Server Components, Next.js — just wrap and go.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { title: 'TanStack Query', code: `const { data, isLoading } = useQuery({\n  queryKey: ['user'],\n  queryFn: fetchUser,\n})\n\n<Ghostly loading={isLoading} smooth>\n  <UserProfile user={data} />\n</Ghostly>` },
              { title: 'React Suspense', code: `import { GhostlySuspense }\n  from '@ghostly-ui/react'\n\n<GhostlySuspense\n  fallback={<ProductCard />}\n  smooth\n>\n  <AsyncProductCard id={123} />\n</GhostlySuspense>` },
            ].map((ex) => (
              <div key={ex.title} className="group overflow-hidden rounded-2xl border border-fd-border bg-fd-card transition-all hover:border-fd-primary/20 hover:shadow-lg hover:shadow-fd-primary/5">
                <div className="flex items-center gap-2 border-b border-fd-border/60 bg-fd-muted/30 px-5 py-3">
                  <div className="h-2 w-2 rounded-full bg-fd-primary/40" />
                  <span className="text-xs font-semibold tracking-wide text-fd-muted-foreground">{ex.title}</span>
                </div>
                <pre className="overflow-x-auto p-5 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-fd-muted-foreground">
                  <code>{ex.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ────── CTA ────── */}
      <section className="noise-bg relative border-t border-fd-border/50 px-6 py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,var(--color-fd-primary),transparent_60%)] opacity-[0.05]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-fd-foreground md:text-5xl">
            Start loading
            <br />
            <span className="shimmer-text">beautifully.</span>
          </h2>
          <p className="mb-14 text-lg text-fd-muted-foreground md:text-xl">
            ~3KB total. Zero runtime JS. Ready in 30 seconds.
          </p>

          <div className="mb-14 flex justify-center">
            <InstallCommand className="max-w-xl" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs"
              className="inline-flex h-14 items-center rounded-full bg-fd-foreground px-10 text-base font-semibold text-fd-background shadow-lg shadow-fd-foreground/10 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              Read the docs
            </Link>
            <Link
              href="/playground"
              className="inline-flex h-14 items-center rounded-full border border-fd-border bg-fd-card/60 px-10 text-base font-semibold text-fd-foreground backdrop-blur-sm transition-all hover:border-fd-primary/40 hover:bg-fd-card hover:shadow-md"
            >
              Try the playground
            </Link>
          </div>

          <p className="mt-20 text-sm text-fd-muted-foreground/60">
            MIT Licensed — Built by{' '}
            <Link href="https://github.com/AdanSerrano" className="text-fd-muted-foreground transition-colors hover:text-fd-foreground">
              Adan Serrano
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
