import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import { Ghostly } from '../ghostly'
import { GhostlyProvider } from '../provider'

describe('Ghostly (Vue)', () => {
  // --- Basic rendering ---

  it('renders children when not loading', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false },
      slots: { default: () => h('p', 'Hello') },
    })
    expect(wrapper.text()).toBe('Hello')
    expect(wrapper.attributes('data-ghostly')).toBeUndefined()
  })

  it('renders children when loading (CSS hides them)', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true },
      slots: { default: () => h('p', 'Hello') },
    })
    expect(wrapper.text()).toBe('Hello')
    expect(wrapper.attributes('data-ghostly')).toBe('shimmer')
  })

  // --- data-ghostly attribute ---

  it('sets data-ghostly to shimmer by default', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly')).toBe('shimmer')
  })

  it('sets data-ghostly to pulse', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, animation: 'pulse' },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly')).toBe('pulse')
  })

  it('sets data-ghostly to wave', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, animation: 'wave' },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly')).toBe('wave')
  })

  it('sets data-ghostly to none', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, animation: 'none' },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly')).toBe('none')
  })

  it('removes data-ghostly when not loading', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly')).toBeUndefined()
  })

  // --- Accessibility ---

  it('sets aria-busy when loading', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('does not set aria-busy when not loading', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('always sets aria-live="polite"', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  // --- Wrapper tag ---

  it('renders a div by default', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders as section when as="section"', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false, as: 'section' },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('renders as ul when as="ul"', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false, as: 'ul' },
      slots: { default: () => h('li', 'item') },
    })
    expect(wrapper.element.tagName).toBe('UL')
  })

  // --- CSS custom properties ---

  it('sets --ghostly-radius when loading', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, radius: 'lg' },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('style')).toContain('--ghostly-radius: 12px')
  })

  it('sets --ghostly-speed when loading', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, speed: 'fast' },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('style')).toContain('--ghostly-speed: 0.8s')
  })

  it('sets --ghostly-color when color prop provided', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, color: '#e0d4f5' },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('style')).toContain('--ghostly-color: #e0d4f5')
  })

  it('sets --ghostly-shine when shine prop provided', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, shine: '#f0e8ff' },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('style')).toContain('--ghostly-shine: #f0e8ff')
  })

  it('does not set CSS vars when not loading', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false, radius: 'lg' },
      slots: { default: () => h('span', 'text') },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).not.toContain('--ghostly-radius')
  })

  // --- Smooth ---

  it('sets data-ghostly-smooth when smooth is true', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, smooth: true },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly-smooth')).toBeDefined()
  })

  it('does not set data-ghostly-smooth when smooth is false', () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true, smooth: false },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly-smooth')).toBeUndefined()
  })

  // --- Provider inheritance ---

  it('inherits animation from GhostlyProvider', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { animation: 'wave' }, () =>
            h(Ghostly, { loading: true }, () => h('span', 'text')),
          )
      },
    })
    const wrapper = mount(App)
    const ghostly = wrapper.find('[data-ghostly]')
    expect(ghostly.attributes('data-ghostly')).toBe('wave')
  })

  it('overrides provider animation with own prop', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { animation: 'wave' }, () =>
            h(Ghostly, { loading: true, animation: 'pulse' }, () => h('span', 'text')),
          )
      },
    })
    const wrapper = mount(App)
    const ghostly = wrapper.find('[data-ghostly]')
    expect(ghostly.attributes('data-ghostly')).toBe('pulse')
  })

  it('inherits radius from GhostlyProvider', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { radius: 'full' }, () =>
            h(Ghostly, { loading: true }, () => h('span', 'text')),
          )
      },
    })
    const wrapper = mount(App)
    const ghostly = wrapper.find('[data-ghostly]')
    expect(ghostly.attributes('style')).toContain('--ghostly-radius: 9999px')
  })

  it('inherits speed from GhostlyProvider', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { speed: 'slow' }, () =>
            h(Ghostly, { loading: true }, () => h('span', 'text')),
          )
      },
    })
    const wrapper = mount(App)
    const ghostly = wrapper.find('[data-ghostly]')
    expect(ghostly.attributes('style')).toContain('--ghostly-speed: 2s')
  })

  // --- Reactivity ---

  it('removes data-ghostly when loading changes to false', async () => {
    const wrapper = mount(Ghostly, {
      props: { loading: true },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly')).toBe('shimmer')

    await wrapper.setProps({ loading: false })
    expect(wrapper.attributes('data-ghostly')).toBeUndefined()
  })

  it('adds data-ghostly when loading changes to true', async () => {
    const wrapper = mount(Ghostly, {
      props: { loading: false },
      slots: { default: () => h('span', 'text') },
    })
    expect(wrapper.attributes('data-ghostly')).toBeUndefined()

    await wrapper.setProps({ loading: true })
    expect(wrapper.attributes('data-ghostly')).toBe('shimmer')
  })
})
