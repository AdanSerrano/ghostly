import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GhostlyProvider } from './provider'
import { useGhostly } from './context'

function ConfigDisplay() {
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

describe('GhostlyProvider', () => {
  it('renders children', () => {
    render(
      <GhostlyProvider>
        <p>Child content</p>
      </GhostlyProvider>,
    )
    expect(screen.getByText('Child content')).toBeDefined()
  })

  it('provides default values when no props given', () => {
    render(
      <GhostlyProvider>
        <ConfigDisplay />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('animation').textContent).toBe('shimmer')
    expect(screen.getByTestId('radius').textContent).toBe('sm')
    expect(screen.getByTestId('speed').textContent).toBe('normal')
  })

  it('provides custom animation', () => {
    render(
      <GhostlyProvider animation="pulse">
        <ConfigDisplay />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('animation').textContent).toBe('pulse')
  })

  it('provides custom radius', () => {
    render(
      <GhostlyProvider radius="full">
        <ConfigDisplay />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('radius').textContent).toBe('full')
  })

  it('provides custom speed', () => {
    render(
      <GhostlyProvider speed="fast">
        <ConfigDisplay />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('speed').textContent).toBe('fast')
  })

  it('provides all custom values', () => {
    render(
      <GhostlyProvider animation="wave" radius="lg" speed="slow">
        <ConfigDisplay />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('animation').textContent).toBe('wave')
    expect(screen.getByTestId('radius').textContent).toBe('lg')
    expect(screen.getByTestId('speed').textContent).toBe('slow')
  })

  it('always sets loading to false', () => {
    render(
      <GhostlyProvider>
        <ConfigDisplay />
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('loading').textContent).toBe('false')
  })

  it('renders multiple children', () => {
    render(
      <GhostlyProvider>
        <p>First</p>
        <p>Second</p>
      </GhostlyProvider>,
    )
    expect(screen.getByText('First')).toBeDefined()
    expect(screen.getByText('Second')).toBeDefined()
  })

  it('nested providers: inner overrides outer', () => {
    render(
      <GhostlyProvider animation="shimmer" radius="sm">
        <GhostlyProvider animation="pulse" radius="lg">
          <ConfigDisplay />
        </GhostlyProvider>
      </GhostlyProvider>,
    )
    expect(screen.getByTestId('animation').textContent).toBe('pulse')
    expect(screen.getByTestId('radius').textContent).toBe('lg')
  })

  it('nested providers: inner defaults do not inherit outer values', () => {
    render(
      <GhostlyProvider animation="wave" speed="slow">
        <GhostlyProvider animation="pulse">
          <ConfigDisplay />
        </GhostlyProvider>
      </GhostlyProvider>,
    )
    // Inner provider sets its own defaults, doesn't inherit outer
    expect(screen.getByTestId('animation').textContent).toBe('pulse')
    expect(screen.getByTestId('speed').textContent).toBe('normal') // inner default, not outer 'slow'
  })
})
