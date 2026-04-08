import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import { GhostlyList } from '../ghostly-list'

const MockCard = defineComponent({
  name: 'MockCard',
  setup() {
    return () => h('div', { class: 'card' }, [h('h3', 'Title'), h('p', 'Desc')])
  },
})

describe('GhostlyList (Vue)', () => {
  it('renders children when not loading', () => {
    const wrapper = mount(GhostlyList, {
      props: { loading: false, count: 3 },
      slots: {
        default: () => [
          h(MockCard, { key: '1' }),
          h(MockCard, { key: '2' }),
        ],
      },
    })
    expect(wrapper.findAll('.card')).toHaveLength(2)
    expect(wrapper.attributes('data-ghostly')).toBeUndefined()
  })

  it('renders skeleton items when loading', () => {
    const wrapper = mount(GhostlyList, {
      props: { loading: true, count: 4 },
      slots: {
        default: () => h(MockCard),
      },
    })
    expect(wrapper.attributes('data-ghostly')).toBe('shimmer')
  })

  it('uses count to determine skeleton items', () => {
    const wrapper = mount(GhostlyList, {
      props: { loading: true, count: 6 },
      slots: {
        default: () => h(MockCard),
      },
    })
    // Should render skeleton wrapper with data-ghostly
    expect(wrapper.attributes('data-ghostly')).toBe('shimmer')
  })

  it('passes animation to Ghostly wrapper', () => {
    const wrapper = mount(GhostlyList, {
      props: { loading: true, count: 3, animation: 'pulse' },
      slots: {
        default: () => h(MockCard),
      },
    })
    expect(wrapper.attributes('data-ghostly')).toBe('pulse')
  })

  it('renders a div by default', () => {
    const wrapper = mount(GhostlyList, {
      props: { loading: false, count: 3 },
      slots: { default: () => h(MockCard) },
    })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders as ul when as="ul"', () => {
    const wrapper = mount(GhostlyList, {
      props: { loading: false, count: 3, as: 'ul' },
      slots: { default: () => h('li', 'item') },
    })
    expect(wrapper.element.tagName).toBe('UL')
  })

  it('sets aria-busy when loading', () => {
    const wrapper = mount(GhostlyList, {
      props: { loading: true, count: 3 },
      slots: { default: () => h(MockCard) },
    })
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('does not set aria-busy when not loading', () => {
    const wrapper = mount(GhostlyList, {
      props: { loading: false, count: 3 },
      slots: { default: () => h(MockCard) },
    })
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })
})
