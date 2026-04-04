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
  // --- Default values ---

  it('returns default values outside of any provider', () => {
    render(<ContextReader />)
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('animation').textContent).toBe('shimmer')
    expect(screen.getByTestId('radius').textContent).toBe('sm')
    expect(screen.getByTestId('speed').textContent).toBe('normal')
  })

  // --- GhostlyProvider ---

  it('returns provider animation value', () => {
    render(
      <GhostlyProvider animation="wave">
        <ContextReader />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('animation').textContent).toBe('wave')
  })

  it('returns provider radius value', () => {
    render(
      <GhostlyProvider radius="lg">
        <ContextReader />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('radius').textContent).toBe('lg')
  })

  it('returns provider speed value', () => {
    render(
      <GhostlyProvider speed="slow">
        <ContextReader />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('speed').textContent).toBe('slow')
  })

  it('returns all provider values together', () => {
    render(
      <GhostlyProvider animation="pulse" radius="full" speed="fast">
        <ContextReader />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('animation').textContent).toBe('pulse')
    expect(screen.getByTestId('radius').textContent).toBe('full')
    expect(screen.getByTestId('speed').textContent).toBe('fast')
  })

  it('provider always reports loading=false', () => {
    render(
      <GhostlyProvider>
        <ContextReader />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('loading').textContent).toBe('false')
  })

  // --- Ghostly context ---

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

  it('returns animation from Ghostly instance', () => {
    render(
      <Ghostly loading={true} animation="wave">
        <ContextReader />
      </Ghostly>,
    )
    expect(screen.getByTestId('animation').textContent).toBe('wave')
  })

  it('returns radius from Ghostly instance', () => {
    render(
      <Ghostly loading={true} radius="lg">
        <ContextReader />
      </Ghostly>,
    )
    expect(screen.getByTestId('radius').textContent).toBe('lg')
  })

  it('returns speed from Ghostly instance', () => {
    render(
      <Ghostly loading={true} speed="fast">
        <ContextReader />
      </Ghostly>,
    )
    expect(screen.getByTestId('speed').textContent).toBe('fast')
  })

  // --- Context priority ---

  it('Ghostly overrides GhostlyProvider animation', () => {
    render(
      <GhostlyProvider animation="wave">
        <Ghostly loading={true} animation="pulse">
          <ContextReader />
        </Ghostly>
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('animation').textContent).toBe('pulse')
  })

  it('Ghostly inherits from provider when no prop is set', () => {
    render(
      <GhostlyProvider animation="wave" radius="lg" speed="slow">
        <Ghostly loading={true}>
          <ContextReader />
        </Ghostly>
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('animation').textContent).toBe('wave')
    expect(screen.getByTestId('radius').textContent).toBe('lg')
    expect(screen.getByTestId('speed').textContent).toBe('slow')
  })

  // --- Nested Ghostly ---

  it('inner Ghostly overrides outer Ghostly context', () => {
    render(
      <Ghostly loading={true} animation="shimmer">
        <Ghostly loading={false} animation="pulse">
          <ContextReader />
        </Ghostly>
      </Ghostly>,
    )
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('animation').textContent).toBe('pulse')
  })

  it('deeply nested contexts resolve correctly', () => {
    render(
      <GhostlyProvider animation="wave" speed="slow">
        <Ghostly loading={true} animation="shimmer">
          <Ghostly loading={false} speed="fast">
            <ContextReader />
          </Ghostly>
        </Ghostly>
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('animation').textContent).toBe('shimmer') // inherits from parent Ghostly
    expect(screen.getByTestId('speed').textContent).toBe('fast') // own prop
  })
})

describe('useGhostly getGhostlyProps', () => {
  function PropsDisplay() {
    const { getGhostlyProps } = useGhostly()
    const props = getGhostlyProps()
    return (
      <div>
        <span data-testid="data-ghostly">{props['data-ghostly'] ?? 'undefined'}</span>
        <span data-testid="aria-busy">{String(props['aria-busy'] ?? 'undefined')}</span>
        <span data-testid="aria-live">{props['aria-live']}</span>
        <span data-testid="has-style">{Object.keys(props.style).length > 0 ? 'yes' : 'no'}</span>
      </div>
    )
  }

  it('returns skeleton props when loading', () => {
    render(
      <Ghostly loading={true} animation="pulse">
        <PropsDisplay />
      </Ghostly>,
    )
    expect(screen.getByTestId('data-ghostly').textContent).toBe('pulse')
    expect(screen.getByTestId('aria-busy').textContent).toBe('true')
    expect(screen.getByTestId('aria-live').textContent).toBe('polite')
    expect(screen.getByTestId('has-style').textContent).toBe('yes')
  })

  it('returns no skeleton attributes when not loading', () => {
    render(
      <Ghostly loading={false}>
        <PropsDisplay />
      </Ghostly>,
    )
    expect(screen.getByTestId('data-ghostly').textContent).toBe('undefined')
    expect(screen.getByTestId('aria-busy').textContent).toBe('undefined')
  })

  it('returns empty style object when not loading', () => {
    render(
      <PropsDisplay />,
    )
    expect(screen.getByTestId('has-style').textContent).toBe('no')
  })
})
