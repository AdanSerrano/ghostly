import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { GhostlySuspense } from './ghostly-suspense'

function FallbackCard() {
  return (
    <div>
      <h2>Title</h2>
      <p>Description</p>
    </div>
  )
}

function ResolvedContent() {
  return <div data-testid="resolved">Loaded content</div>
}

describe('GhostlySuspense', () => {
  it('renders children when not suspended', () => {
    render(
      <GhostlySuspense fallback={<FallbackCard />}>
        <ResolvedContent />
      </GhostlySuspense>,
    )
    expect(screen.getByTestId('resolved')).toBeDefined()
    expect(screen.getByText('Loaded content')).toBeDefined()
  })

  it('renders fallback wrapped in Ghostly when suspended', () => {
    let resolve: () => void
    const promise = new Promise<void>((r) => { resolve = r })

    function Suspending() {
      if (!(promise as { _resolved?: boolean })._resolved) {
        throw promise
      }
      return <div data-testid="resolved">Done</div>
    }

    const { container } = render(
      <GhostlySuspense fallback={<FallbackCard />} animation="pulse">
        <Suspending />
      </GhostlySuspense>,
    )

    // Should show skeleton fallback
    const ghostlyEl = container.querySelector('[data-ghostly]')
    expect(ghostlyEl).not.toBeNull()
    expect(ghostlyEl?.getAttribute('data-ghostly')).toBe('pulse')
    expect(ghostlyEl?.getAttribute('aria-busy')).toBe('true')
  })

  it('uses shimmer animation by default', () => {
    function Suspending() {
      throw new Promise(() => {})
      return null
    }

    const { container } = render(
      <GhostlySuspense fallback={<FallbackCard />}>
        <Suspending />
      </GhostlySuspense>,
    )

    const ghostlyEl = container.querySelector('[data-ghostly]')
    expect(ghostlyEl?.getAttribute('data-ghostly')).toBe('shimmer')
  })

  it('passes className to the skeleton wrapper', () => {
    function Suspending() {
      throw new Promise(() => {})
      return null
    }

    const { container } = render(
      <GhostlySuspense fallback={<FallbackCard />} className="my-class">
        <Suspending />
      </GhostlySuspense>,
    )

    const ghostlyEl = container.querySelector('[data-ghostly]')
    expect(ghostlyEl?.classList.contains('my-class')).toBe(true)
  })

  it('passes smooth prop to skeleton wrapper', () => {
    function Suspending() {
      throw new Promise(() => {})
      return null
    }

    const { container } = render(
      <GhostlySuspense fallback={<FallbackCard />} smooth>
        <Suspending />
      </GhostlySuspense>,
    )

    const ghostlyEl = container.querySelector('[data-ghostly-smooth]')
    expect(ghostlyEl).not.toBeNull()
  })
})
