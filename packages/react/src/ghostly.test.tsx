import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Ghostly } from './ghostly'
import { GhostlyProvider } from './provider'

describe('Ghostly', () => {
  // --- Basic rendering ---

  it('renders children normally when not loading', () => {
    render(
      <Ghostly loading={false}>
        <p>Hello world</p>
      </Ghostly>,
    )
    expect(screen.getByText('Hello world')).toBeDefined()
  })

  it('renders children when loading (CSS handles visibility)', () => {
    render(
      <Ghostly loading={true}>
        <p>Still in DOM</p>
      </Ghostly>,
    )
    expect(screen.getByText('Still in DOM')).toBeDefined()
  })

  it('renders multiple children', () => {
    render(
      <Ghostly loading={false}>
        <h1>Title</h1>
        <p>Paragraph</p>
        <button>Click</button>
      </Ghostly>,
    )
    expect(screen.getByText('Title')).toBeDefined()
    expect(screen.getByText('Paragraph')).toBeDefined()
    expect(screen.getByText('Click')).toBeDefined()
  })

  it('renders with empty children', () => {
    const { container } = render(
      <Ghostly loading={true}>{null}</Ghostly>,
    )
    expect(container.firstElementChild).toBeDefined()
  })

  it('renders with fragment children', () => {
    render(
      <Ghostly loading={false}>
        <>
          <span>Fragment child 1</span>
          <span>Fragment child 2</span>
        </>
      </Ghostly>,
    )
    expect(screen.getByText('Fragment child 1')).toBeDefined()
    expect(screen.getByText('Fragment child 2')).toBeDefined()
  })

  // --- data-ghostly attribute ---

  it('sets data-ghostly attribute when loading', () => {
    const { container } = render(
      <Ghostly loading={true}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('shimmer')
  })

  it('removes data-ghostly attribute when not loading', () => {
    const { container } = render(
      <Ghostly loading={false}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBeNull()
  })

  it('uses shimmer as default animation', () => {
    const { container } = render(
      <Ghostly loading={true}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('shimmer')
  })

  it('uses specified animation type: pulse', () => {
    const { container } = render(
      <Ghostly loading={true} animation="pulse">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('pulse')
  })

  it('uses specified animation type: wave', () => {
    const { container } = render(
      <Ghostly loading={true} animation="wave">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('wave')
  })

  it('uses specified animation type: none', () => {
    const { container } = render(
      <Ghostly loading={true} animation="none">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('none')
  })

  // --- Accessibility ---

  it('sets aria-busy when loading', () => {
    const { container } = render(
      <Ghostly loading={true}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('aria-busy')).toBe('true')
  })

  it('does not set aria-busy when not loading', () => {
    const { container } = render(
      <Ghostly loading={false}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('aria-busy')).toBeNull()
  })

  it('sets aria-live to polite always', () => {
    const { container } = render(
      <Ghostly loading={true}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('aria-live')).toBe('polite')
  })

  it('keeps aria-live when not loading', () => {
    const { container } = render(
      <Ghostly loading={false}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('aria-live')).toBe('polite')
  })

  // --- Wrapper element ---

  it('renders div by default', () => {
    const { container } = render(
      <Ghostly loading={false}>
        <p>Content</p>
      </Ghostly>,
    )
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders section with as="section"', () => {
    const { container } = render(
      <Ghostly loading={false} as="section">
        <p>Content</p>
      </Ghostly>,
    )
    expect(container.firstElementChild?.tagName).toBe('SECTION')
  })

  it('renders article with as="article"', () => {
    const { container } = render(
      <Ghostly loading={false} as="article">
        <p>Content</p>
      </Ghostly>,
    )
    expect(container.firstElementChild?.tagName).toBe('ARTICLE')
  })

  it('renders main with as="main"', () => {
    const { container } = render(
      <Ghostly loading={false} as="main">
        <p>Content</p>
      </Ghostly>,
    )
    expect(container.firstElementChild?.tagName).toBe('MAIN')
  })

  it('renders aside with as="aside"', () => {
    const { container } = render(
      <Ghostly loading={false} as="aside">
        <p>Content</p>
      </Ghostly>,
    )
    expect(container.firstElementChild?.tagName).toBe('ASIDE')
  })

  it('renders span with as="span"', () => {
    const { container } = render(
      <Ghostly loading={false} as="span">
        <p>Content</p>
      </Ghostly>,
    )
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })

  // --- Props forwarding ---

  it('passes className to wrapper', () => {
    const { container } = render(
      <Ghostly loading={false} className="my-class another-class">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.classList.contains('my-class')).toBe(true)
    expect(wrapper.classList.contains('another-class')).toBe(true)
  })

  it('passes id to wrapper', () => {
    const { container } = render(
      <Ghostly loading={false} id="my-skeleton">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.id).toBe('my-skeleton')
  })

  it('passes data attributes to wrapper', () => {
    render(
      <Ghostly loading={false} data-testid="skeleton-wrapper">
        <p>Content</p>
      </Ghostly>,
    )
    expect(screen.getByTestId('skeleton-wrapper')).toBeDefined()
  })

  it('passes style to wrapper when not loading', () => {
    const { container } = render(
      <Ghostly loading={false} style={{ marginTop: '20px' }}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.marginTop).toBe('20px')
  })

  // --- CSS custom properties ---

  it('sets --ghostly-radius when loading', () => {
    const { container } = render(
      <Ghostly loading={true} radius="lg">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('12px')
  })

  it('sets --ghostly-speed when loading', () => {
    const { container } = render(
      <Ghostly loading={true} speed="fast">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-speed')).toBe('0.8s')
  })

  it('sets both radius and speed CSS vars', () => {
    const { container } = render(
      <Ghostly loading={true} radius="md" speed="slow">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('8px')
    expect(wrapper.style.getPropertyValue('--ghostly-speed')).toBe('2s')
  })

  it('does not set CSS vars when not loading', () => {
    const { container } = render(
      <Ghostly loading={false} radius="lg" speed="fast">
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('')
    expect(wrapper.style.getPropertyValue('--ghostly-speed')).toBe('')
  })

  it('merges user style with CSS vars when loading', () => {
    const { container } = render(
      <Ghostly loading={true} radius="md" style={{ padding: '10px' }}>
        <p>Content</p>
      </Ghostly>,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('8px')
    expect(wrapper.style.padding).toBe('10px')
  })

  it('maps all radius values correctly', () => {
    const cases = [
      ['none', '0px'],
      ['xs', '2px'],
      ['sm', '4px'],
      ['md', '8px'],
      ['lg', '12px'],
      ['full', '9999px'],
    ] as const

    for (const [radius, expected] of cases) {
      const { container } = render(
        <Ghostly loading={true} radius={radius}>
          <p>Content</p>
        </Ghostly>,
      )
      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe(expected)
    }
  })

  it('maps all speed values correctly', () => {
    const cases = [
      ['slow', '2s'],
      ['normal', '1.5s'],
      ['fast', '0.8s'],
    ] as const

    for (const [speed, expected] of cases) {
      const { container } = render(
        <Ghostly loading={true} speed={speed}>
          <p>Content</p>
        </Ghostly>,
      )
      const wrapper = container.firstElementChild as HTMLElement
      expect(wrapper.style.getPropertyValue('--ghostly-speed')).toBe(expected)
    }
  })

  // --- Provider integration ---

  it('inherits animation from GhostlyProvider', () => {
    const { container } = render(
      <GhostlyProvider animation="wave">
        <Ghostly loading={true}>
          <p>Content</p>
        </Ghostly>
      </GhostlyProvider>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('wave')
  })

  it('inherits radius from GhostlyProvider', () => {
    const { container } = render(
      <GhostlyProvider radius="lg">
        <Ghostly loading={true}>
          <p>Content</p>
        </Ghostly>
      </GhostlyProvider>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('12px')
  })

  it('inherits speed from GhostlyProvider', () => {
    const { container } = render(
      <GhostlyProvider speed="slow">
        <Ghostly loading={true}>
          <p>Content</p>
        </Ghostly>
      </GhostlyProvider>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-speed')).toBe('2s')
  })

  it('overrides provider animation with instance prop', () => {
    const { container } = render(
      <GhostlyProvider animation="wave">
        <Ghostly loading={true} animation="pulse">
          <p>Content</p>
        </Ghostly>
      </GhostlyProvider>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('pulse')
  })

  it('overrides provider radius with instance prop', () => {
    const { container } = render(
      <GhostlyProvider radius="lg">
        <Ghostly loading={true} radius="xs">
          <p>Content</p>
        </Ghostly>
      </GhostlyProvider>,
    )
    const wrapper = container.querySelector('[data-ghostly]') as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('2px')
  })

  // --- Nesting ---

  it('supports nested Ghostly components with different states', () => {
    const { container } = render(
      <Ghostly loading={true} animation="shimmer">
        <div>
          <Ghostly loading={false} animation="pulse">
            <p>Inner content</p>
          </Ghostly>
        </div>
      </Ghostly>,
    )
    const outer = container.firstElementChild as HTMLElement
    const inner = container.querySelector('[aria-live]:not([data-ghostly="shimmer"])') as HTMLElement
    expect(outer.getAttribute('data-ghostly')).toBe('shimmer')
    expect(inner.getAttribute('data-ghostly')).toBeNull()
  })

  it('nested Ghostly overrides parent context', () => {
    const { container } = render(
      <Ghostly loading={true} animation="shimmer">
        <Ghostly loading={true} animation="pulse">
          <p>Content</p>
        </Ghostly>
      </Ghostly>,
    )
    const skeletons = container.querySelectorAll('[data-ghostly]')
    expect(skeletons[0].getAttribute('data-ghostly')).toBe('shimmer')
    expect(skeletons[1].getAttribute('data-ghostly')).toBe('pulse')
  })
})
