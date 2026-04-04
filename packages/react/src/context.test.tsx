import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGhostly } from './context'
import { Ghostly } from './ghostly'
import { GhostlyProvider } from './provider'

function ContextReader() {
  const ctx = useGhostly()
  return (
    <div>
      <span data-testid="loading">{String(ctx.loading)}</span>
      <span data-testid="animation">{ctx.animation}</span>
      <span data-testid="radius">{ctx.radius}</span>
      <span data-testid="speed">{ctx.speed}</span>
    </div>
  )
}

describe('useGhostly', () => {
  it('returns default values outside of any provider', () => {
    render(<ContextReader />)

    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('animation').textContent).toBe('shimmer')
    expect(screen.getByTestId('radius').textContent).toBe('sm')
    expect(screen.getByTestId('speed').textContent).toBe('normal')
  })

  it('returns provider values', () => {
    render(
      <GhostlyProvider animation="wave" radius="lg" speed="slow">
        <ContextReader />
      </GhostlyProvider>,
    )

    expect(screen.getByTestId('animation').textContent).toBe('wave')
    expect(screen.getByTestId('radius').textContent).toBe('lg')
    expect(screen.getByTestId('speed').textContent).toBe('slow')
  })

  it('returns loading=true inside a loading Ghostly', () => {
    render(
      <Ghostly loading={true}>
        <ContextReader />
      </Ghostly>,
    )

    expect(screen.getByTestId('loading').textContent).toBe('true')
  })

  it('returns loading=false inside a non-loading Ghostly', () => {
    render(
      <Ghostly loading={false}>
        <ContextReader />
      </Ghostly>,
    )

    expect(screen.getByTestId('loading').textContent).toBe('false')
  })
})
