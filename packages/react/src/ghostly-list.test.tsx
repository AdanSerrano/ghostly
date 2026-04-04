import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GhostlyList } from './ghostly-list'

function MockCard({ title }: { title?: string }) {
  return (
    <div data-testid="card">
      <h3>{title ?? ''}</h3>
    </div>
  )
}

describe('GhostlyList', () => {
  it('renders children when not loading', () => {
    render(
      <GhostlyList loading={false} count={3} item={<MockCard />}>
        <MockCard title="Item 1" />
        <MockCard title="Item 2" />
      </GhostlyList>,
    )

    expect(screen.getByText('Item 1')).toBeDefined()
    expect(screen.getByText('Item 2')).toBeDefined()
  })

  it('renders skeleton items when loading', () => {
    const { container } = render(
      <GhostlyList loading={true} count={4} item={<MockCard />}>
        <MockCard title="Real item" />
      </GhostlyList>,
    )

    const cards = container.querySelectorAll('[data-testid="card"]')
    expect(cards.length).toBe(4)
  })

  it('sets data-ghostly on wrapper when loading', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />}>
        <MockCard title="Real" />
      </GhostlyList>,
    )

    const wrapper = container.querySelector('[data-ghostly]')
    expect(wrapper).not.toBeNull()
  })

  it('does not set data-ghostly when not loading', () => {
    const { container } = render(
      <GhostlyList loading={false} count={2} item={<MockCard />}>
        <MockCard title="Real" />
      </GhostlyList>,
    )

    const wrapper = container.querySelector('[data-ghostly]')
    expect(wrapper).toBeNull()
  })

  it('passes className to container', () => {
    const { container } = render(
      <GhostlyList loading={false} count={2} item={<MockCard />} className="grid gap-4">
        <MockCard title="Real" />
      </GhostlyList>,
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.classList.contains('grid')).toBe(true)
    expect(wrapper.classList.contains('gap-4')).toBe(true)
  })

  it('uses specified animation when loading', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />} animation="pulse">
        <MockCard title="Real" />
      </GhostlyList>,
    )

    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('pulse')
  })

  it('uses first child as template when item prop is omitted', () => {
    const { container } = render(
      <GhostlyList loading={true} count={3}>
        <MockCard title="Template child" />
        <MockCard title="Second child" />
      </GhostlyList>,
    )

    const cards = container.querySelectorAll('[data-testid="card"]')
    expect(cards.length).toBe(3)
  })
})
