import { describe, it, expect, beforeEach } from 'vitest'
import { ghostly } from '../ghostly-action'

describe('ghostly action (Svelte)', () => {
  let node: HTMLDivElement

  beforeEach(() => {
    node = document.createElement('div')
  })

  // --- Basic behavior ---

  it('sets data-ghostly when loading=true', () => {
    ghostly(node, { loading: true })
    expect(node.getAttribute('data-ghostly')).toBe('shimmer')
  })

  it('does not set data-ghostly when loading=false', () => {
    ghostly(node, { loading: false })
    expect(node.getAttribute('data-ghostly')).toBeNull()
  })

  it('always sets aria-live="polite"', () => {
    ghostly(node, { loading: false })
    expect(node.getAttribute('aria-live')).toBe('polite')
  })

  it('sets aria-busy when loading', () => {
    ghostly(node, { loading: true })
    expect(node.getAttribute('aria-busy')).toBe('true')
  })

  it('removes aria-busy when not loading', () => {
    ghostly(node, { loading: false })
    expect(node.getAttribute('aria-busy')).toBeNull()
  })

  // --- Animations ---

  it('sets data-ghostly to shimmer by default', () => {
    ghostly(node, { loading: true })
    expect(node.getAttribute('data-ghostly')).toBe('shimmer')
  })

  it('sets data-ghostly to pulse', () => {
    ghostly(node, { loading: true, animation: 'pulse' })
    expect(node.getAttribute('data-ghostly')).toBe('pulse')
  })

  it('sets data-ghostly to wave', () => {
    ghostly(node, { loading: true, animation: 'wave' })
    expect(node.getAttribute('data-ghostly')).toBe('wave')
  })

  it('sets data-ghostly to none', () => {
    ghostly(node, { loading: true, animation: 'none' })
    expect(node.getAttribute('data-ghostly')).toBe('none')
  })

  // --- CSS custom properties ---

  it('sets --ghostly-radius when loading', () => {
    ghostly(node, { loading: true, radius: 'lg' })
    expect(node.style.getPropertyValue('--ghostly-radius')).toBe('12px')
  })

  it('sets --ghostly-speed when loading', () => {
    ghostly(node, { loading: true, speed: 'fast' })
    expect(node.style.getPropertyValue('--ghostly-speed')).toBe('0.8s')
  })

  it('sets --ghostly-color when color prop provided', () => {
    ghostly(node, { loading: true, color: '#e0d4f5' })
    expect(node.style.getPropertyValue('--ghostly-color')).toBe('#e0d4f5')
  })

  it('sets --ghostly-shine when shine prop provided', () => {
    ghostly(node, { loading: true, shine: '#f0e8ff' })
    expect(node.style.getPropertyValue('--ghostly-shine')).toBe('#f0e8ff')
  })

  it('removes CSS vars when not loading', () => {
    const action = ghostly(node, { loading: true, radius: 'lg' })
    expect(node.style.getPropertyValue('--ghostly-radius')).toBe('12px')

    action.update({ loading: false })
    expect(node.style.getPropertyValue('--ghostly-radius')).toBe('')
  })

  // --- Smooth ---

  it('sets data-ghostly-smooth when smooth is true', () => {
    ghostly(node, { loading: true, smooth: true })
    expect(node.hasAttribute('data-ghostly-smooth')).toBe(true)
  })

  it('does not set data-ghostly-smooth when smooth is false', () => {
    ghostly(node, { loading: true, smooth: false })
    expect(node.hasAttribute('data-ghostly-smooth')).toBe(false)
  })

  // --- Update ---

  it('updates data-ghostly on update', () => {
    const action = ghostly(node, { loading: true, animation: 'shimmer' })
    expect(node.getAttribute('data-ghostly')).toBe('shimmer')

    action.update({ loading: true, animation: 'pulse' })
    expect(node.getAttribute('data-ghostly')).toBe('pulse')
  })

  it('removes data-ghostly on update to loading=false', () => {
    const action = ghostly(node, { loading: true })
    expect(node.getAttribute('data-ghostly')).toBe('shimmer')

    action.update({ loading: false })
    expect(node.getAttribute('data-ghostly')).toBeNull()
  })

  // --- Destroy ---

  it('cleans up all attributes on destroy', () => {
    const action = ghostly(node, { loading: true, smooth: true })
    expect(node.getAttribute('data-ghostly')).toBe('shimmer')
    expect(node.hasAttribute('data-ghostly-smooth')).toBe(true)

    action.destroy()
    expect(node.getAttribute('data-ghostly')).toBeNull()
    expect(node.hasAttribute('data-ghostly-smooth')).toBe(false)
    expect(node.getAttribute('aria-busy')).toBeNull()
    expect(node.getAttribute('aria-live')).toBeNull()
    expect(node.style.getPropertyValue('--ghostly-radius')).toBe('')
    expect(node.style.getPropertyValue('--ghostly-speed')).toBe('')
  })

  // --- Default values ---

  it('uses sm radius by default', () => {
    ghostly(node, { loading: true })
    expect(node.style.getPropertyValue('--ghostly-radius')).toBe('4px')
  })

  it('uses normal speed by default', () => {
    ghostly(node, { loading: true })
    expect(node.style.getPropertyValue('--ghostly-speed')).toBe('1.5s')
  })
})
