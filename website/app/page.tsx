import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-secondary/50 px-4 py-1.5 text-sm text-fd-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          v0.1.0 — Now available
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-fd-foreground md:text-7xl">
          Zero-config
          <br />
          <span className="bg-gradient-to-r from-fd-foreground to-fd-muted-foreground bg-clip-text text-transparent">
            skeleton loaders
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-fd-muted-foreground md:text-xl">
          Wrap your component. Import the CSS. Done.
          No CLI, no build step, no code changes to your components.
        </p>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-fd-primary px-8 text-base font-medium text-fd-primary-foreground shadow-sm transition-colors hover:bg-fd-primary/90"
          >
            Get Started
          </Link>
          <Link
            href="https://github.com/AdanSerrano/ghostly"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-fd-border bg-fd-background px-8 text-base font-medium text-fd-foreground shadow-sm transition-colors hover:bg-fd-accent"
          >
            GitHub
          </Link>
        </div>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-lg">
          <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/50 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <div className="h-3 w-3 rounded-full bg-green-400/80" />
            <span className="ml-2 text-xs text-fd-muted-foreground">your-component.tsx</span>
          </div>
          <pre className="overflow-x-auto p-6 text-left text-sm leading-relaxed">
            <code>
              <span className="text-fd-muted-foreground">{'// Your component stays exactly the same'}</span>
              {'\n'}
              <span className="text-blue-400">{'import'}</span>
              <span className="text-fd-foreground">{' { '}</span>
              <span className="text-yellow-300">{'Ghostly'}</span>
              <span className="text-fd-foreground">{' } '}</span>
              <span className="text-blue-400">{'from'}</span>
              <span className="text-green-400">{" '@ghostly/react'"}</span>
              {'\n\n'}
              <span className="text-blue-400">{'<'}</span>
              <span className="text-yellow-300">{'Ghostly'}</span>
              <span className="text-purple-400">{' loading'}</span>
              <span className="text-fd-foreground">{'={'}</span>
              <span className="text-orange-300">{'isLoading'}</span>
              <span className="text-fd-foreground">{'}'}</span>
              <span className="text-blue-400">{'>'}</span>
              {'\n'}
              <span className="text-fd-foreground">{'  '}</span>
              <span className="text-blue-400">{'<'}</span>
              <span className="text-yellow-300">{'ProductCard'}</span>
              <span className="text-purple-400">{' product'}</span>
              <span className="text-fd-foreground">{'={'}</span>
              <span className="text-orange-300">{'data'}</span>
              <span className="text-fd-foreground">{'}'}</span>
              <span className="text-blue-400">{' />'}</span>
              {'\n'}
              <span className="text-blue-400">{'</'}</span>
              <span className="text-yellow-300">{'Ghostly'}</span>
              <span className="text-blue-400">{'>'}</span>
            </code>
          </pre>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-fd-border bg-fd-card p-6">
            <div className="mb-3 text-2xl">0</div>
            <h3 className="mb-1 font-semibold text-fd-foreground">Zero Config</h3>
            <p className="text-sm text-fd-muted-foreground">
              No CLI, no build step, no generated files. Install and use.
            </p>
          </div>
          <div className="rounded-xl border border-fd-border bg-fd-card p-6">
            <div className="mb-3 text-2xl">0</div>
            <h3 className="mb-1 font-semibold text-fd-foreground">Zero Code Changes</h3>
            <p className="text-sm text-fd-muted-foreground">
              Your components stay exactly as they are. Just wrap them.
            </p>
          </div>
          <div className="rounded-xl border border-fd-border bg-fd-card p-6">
            <div className="mb-3 text-2xl">~3KB</div>
            <h3 className="mb-1 font-semibold text-fd-foreground">Tiny Bundle</h3>
            <p className="text-sm text-fd-muted-foreground">
              CSS-first engine. Zero runtime JavaScript for skeleton rendering.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-fd-border p-5">
            <h3 className="mb-1 text-sm font-semibold text-fd-foreground">3 Animations</h3>
            <p className="text-xs text-fd-muted-foreground">Shimmer, pulse, wave — all CSS</p>
          </div>
          <div className="rounded-xl border border-fd-border p-5">
            <h3 className="mb-1 text-sm font-semibold text-fd-foreground">Dark Mode</h3>
            <p className="text-xs text-fd-muted-foreground">Automatic via CSS custom properties</p>
          </div>
          <div className="rounded-xl border border-fd-border p-5">
            <h3 className="mb-1 text-sm font-semibold text-fd-foreground">Accessible</h3>
            <p className="text-xs text-fd-muted-foreground">ARIA, reduced motion, screen readers</p>
          </div>
          <div className="rounded-xl border border-fd-border p-5">
            <h3 className="mb-1 text-sm font-semibold text-fd-foreground">Suspense Ready</h3>
            <p className="text-xs text-fd-muted-foreground">Works with RSC, streaming, Suspense</p>
          </div>
        </div>

        <p className="mt-16 pb-8 text-sm text-fd-muted-foreground">
          MIT Licensed — Built with care
        </p>
      </div>
    </main>
  )
}
