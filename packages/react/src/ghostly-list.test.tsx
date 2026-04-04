import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GhostlyList } from './ghostly-list'
import { GhostlyProvider } from './provider'

function MockCard({ title }: { title?: string }) {
  return (
    <div data-testid="card">
      <h3>{title ?? ''}</h3>
    </div>
  )
}

function MockRow({ label }: { label?: string }) {
  return (
    <tr data-testid="row">
      <td>{label ?? ''}</td>
    </tr>
  )
}

describe('GhostlyList', () => {
  // --- Basic rendering ---

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

  it('does not render skeleton items when not loading', () => {
    const { container } = render(
      <GhostlyList loading={false} count={5} item={<MockCard />}>
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const cards = container.querySelectorAll('[data-testid="card"]')
    expect(cards.length).toBe(1) // only real item
  })

  it('renders skeleton items when loading', () => {
    const { container } = render(
      <GhostlyList loading={true} count={4} item={<MockCard />}>
        <MockCard title="Real item" />
      </GhostlyList>,
    )
    const cards = container.querySelectorAll('[data-testid="card"]')
    expect(cards.length).toBe(4) // 4 skeleton clones
  })

  it('renders exact count of skeleton items', () => {
    for (const count of [1, 3, 6, 10]) {
      const { container } = render(
        <GhostlyList loading={true} count={count} item={<MockCard />}>
          <MockCard title="Real" />
        </GhostlyList>,
      )
      const cards = container.querySelectorAll('[data-testid="card"]')
      expect(cards.length).toBe(count)
    }
  })

  // --- data-ghostly attribute ---

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

  // --- Animation ---

  it('uses shimmer animation by default', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />}>
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('shimmer')
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

  it('uses wave animation', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />} animation="wave">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('wave')
  })

  // --- className ---

  it('passes className to container when loading', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />} className="grid gap-4">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.classList.contains('grid')).toBe(true)
    expect(wrapper.classList.contains('gap-4')).toBe(true)
  })

  it('passes className to container when not loading', () => {
    const { container } = render(
      <GhostlyList loading={false} count={2} item={<MockCard />} className="grid gap-4">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.classList.contains('grid')).toBe(true)
    expect(wrapper.classList.contains('gap-4')).toBe(true)
  })

  // --- Template (item prop) ---

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

  it('uses explicit item prop over first child', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />}>
        <MockRow label="Should not be used as template" />
      </GhostlyList>,
    )
    const cards = container.querySelectorAll('[data-testid="card"]')
    const rows = container.querySelectorAll('[data-testid="row"]')
    expect(cards.length).toBe(2) // uses MockCard from item prop
    expect(rows.length).toBe(0) // MockRow ignored during loading
  })

  // --- Edge cases ---

  it('handles empty children array when loading', () => {
    const { container } = render(
      <GhostlyList loading={true} count={3} item={<MockCard />}>
        {[]}
      </GhostlyList>,
    )
    const cards = container.querySelectorAll('[data-testid="card"]')
    expect(cards.length).toBe(3)
  })

  it('handles text-only children (no valid React element for template)', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2}>
        just a string
      </GhostlyList>,
    )
    // No template found, skeletonItems is null, but Ghostly still renders
    const wrapper = container.querySelector('[data-ghostly]')
    expect(wrapper).not.toBeNull()
  })

  it('handles count of 0', () => {
    const { container } = render(
      <GhostlyList loading={true} count={0} item={<MockCard />}>
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const cards = container.querySelectorAll('[data-testid="card"]')
    expect(cards.length).toBe(0)
  })

  it('handles count of 1', () => {
    const { container } = render(
      <GhostlyList loading={true} count={1} item={<MockCard />}>
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const cards = container.querySelectorAll('[data-testid="card"]')
    expect(cards.length).toBe(1)
  })

  // --- Provider integration ---

  it('inherits animation from GhostlyProvider', () => {
    const { container } = render(
      <GhostlyProvider animation="wave">
        <GhostlyList loading={true} count={2} item={<MockCard />}>
          <MockCard title="Real" />
        </GhostlyList>
      </GhostlyProvider>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('wave')
  })

  it('overrides provider animation with own prop', () => {
    const { container } = render(
      <GhostlyProvider animation="wave">
        <GhostlyList loading={true} count={2} item={<MockCard />} animation="pulse">
          <MockCard title="Real" />
        </GhostlyList>
      </GhostlyProvider>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('pulse')
  })

  // --- Radius and speed ---

  it('passes radius to inner Ghostly', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />} radius="lg">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('12px')
  })

  it('passes speed to inner Ghostly', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />} speed="fast">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-speed')).toBe('0.8s')
  })

  // --- as prop ---

  it('renders as ul when as="ul" and loading', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />} as="ul">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    expect(container.querySelector('ul')).not.toBeNull()
  })

  it('renders as ul when as="ul" and not loading', () => {
    const { container } = render(
      <GhostlyList loading={false} count={2} item={<MockCard />} as="ul">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    expect(container.querySelector('ul')).not.toBeNull()
  })

  it('renders as ol when as="ol"', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />} as="ol">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    expect(container.querySelector('ol')).not.toBeNull()
  })

  it('renders as section when as="section"', () => {
    const { container } = render(
      <GhostlyList loading={false} count={2} item={<MockCard />} as="section">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    expect(container.querySelector('section')).not.toBeNull()
  })

  // --- color / shine props ---

  it('passes color and shine to inner Ghostly', () => {
    const { container } = render(
      <GhostlyList loading={true} count={2} item={<MockCard />} color="blue" shine="lightblue">
        <MockCard title="Real" />
      </GhostlyList>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-color')).toBe('blue')
    expect(wrapper.style.getPropertyValue('--ghostly-shine')).toBe('lightblue')
  })
})
