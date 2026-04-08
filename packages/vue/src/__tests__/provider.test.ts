import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent, inject } from 'vue'
import { GhostlyProvider } from '../provider'
import { ghostlyKey, DEFAULTS } from '../context'

const ContextReader = defineComponent({
  name: 'ContextReader',
  setup() {
    const ctx = inject(ghostlyKey, DEFAULTS)
    return () =>
      h('div', {
        'data-animation': ctx.animation,
        'data-radius': ctx.radius,
        'data-speed': ctx.speed,
      })
  },
})

describe('GhostlyProvider (Vue)', () => {
  it('provides default values', () => {
    const wrapper = mount(ContextReader)
    const el = wrapper.find('div')
    expect(el.attributes('data-animation')).toBe('shimmer')
    expect(el.attributes('data-radius')).toBe('sm')
    expect(el.attributes('data-speed')).toBe('normal')
  })

  it('provides custom animation', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { animation: 'wave' }, () => h(ContextReader))
      },
    })
    const wrapper = mount(App)
    expect(wrapper.find('div').attributes('data-animation')).toBe('wave')
  })

  it('provides custom radius', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { radius: 'lg' }, () => h(ContextReader))
      },
    })
    const wrapper = mount(App)
    expect(wrapper.find('div').attributes('data-radius')).toBe('lg')
  })

  it('provides custom speed', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { speed: 'fast' }, () => h(ContextReader))
      },
    })
    const wrapper = mount(App)
    expect(wrapper.find('div').attributes('data-speed')).toBe('fast')
  })

  it('nested provider overrides parent values', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { animation: 'wave', radius: 'lg' }, () =>
            h(GhostlyProvider, { animation: 'pulse' }, () =>
              h(ContextReader),
            ),
          )
      },
    })
    const wrapper = mount(App)
    const el = wrapper.find('div')
    // animation overridden, radius inherited
    expect(el.attributes('data-animation')).toBe('pulse')
    expect(el.attributes('data-radius')).toBe('lg')
  })

  it('nested provider inherits unspecified values', () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(GhostlyProvider, { animation: 'wave', speed: 'slow' }, () =>
            h(GhostlyProvider, { radius: 'full' }, () =>
              h(ContextReader),
            ),
          )
      },
    })
    const wrapper = mount(App)
    const el = wrapper.find('div')
    expect(el.attributes('data-animation')).toBe('wave')
    expect(el.attributes('data-radius')).toBe('full')
    expect(el.attributes('data-speed')).toBe('slow')
  })
})
