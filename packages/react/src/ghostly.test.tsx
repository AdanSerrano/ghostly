import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Ghostly } from './ghostly'
import { GhostlyProvider } from './provider'

describe('Ghostly', () => {
  it('renders children normally when not loading', () => {
    render(
      <Ghostly loading={false}>
        <p>Hello world</p>
      </Ghostly>,
    )

    expect(screen.getByText('Hello world')).toBeDefined()
  })

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

  it('uses specified animation type', () => {
    const { container } = render(
      <Ghostly loading={true} animation="pulse">
        <p>Content</p>
      </Ghostly>,
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('data-ghostly')).toBe('pulse')
  })

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

  it('sets aria-live to polite', () => {
    const { container } = render(
      <Ghostly loading={true}>
        <p>Content</p>
      </Ghostly>,
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute('aria-live')).toBe('polite')
  })

  it('renders with custom tag via as prop', () => {
    const { container } = render(
      <Ghostly loading={false} as="section">
        <p>Content</p>
      </Ghostly>,
    )

    expect(container.firstElementChild?.tagName).toBe('SECTION')
  })

  it('passes className to wrapper', () => {
    const { container } = render(
      <Ghostly loading={false} className="my-class">
        <p>Content</p>
      </Ghostly>,
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.classList.contains('my-class')).toBe(true)
  })

  it('sets CSS custom properties when loading', () => {
    const { container } = render(
      <Ghostly loading={true} radius="lg" speed="fast">
        <p>Content</p>
      </Ghostly>,
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('12px')
    expect(wrapper.style.getPropertyValue('--ghostly-speed')).toBe('0.8s')
  })

  it('does not set CSS vars when not loading', () => {
    const { container } = render(
      <Ghostly loading={false} radius="lg" speed="fast">
        <p>Content</p>
      </Ghostly>,
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.getPropertyValue('--ghostly-radius')).toBe('')
  })

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

  it('overrides provider config with instance props', () => {
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
})
