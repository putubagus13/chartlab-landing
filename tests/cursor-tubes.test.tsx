import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { waitFor } from '@testing-library/react'

const tubes = { setColors: vi.fn(), setLightsColors: vi.fn() }
const dispose = vi.fn()
const factory = vi.fn((_canvas: HTMLCanvasElement, _opts: unknown) => ({ tubes, dispose }))
vi.mock('threejs-components/build/cursors/tubes1.min.js', () => ({ default: (c: HTMLCanvasElement, o: unknown) => factory(c, o) }))

// framer returns null on the server and the real preference on the client.
let reduced: boolean | null = false
vi.mock('framer-motion', async (orig) => ({
  ...((await orig()) as object),
  useReducedMotion: () => reduced,
}))

import { renderWithRouter } from './utils'

const realMatchMedia = window.matchMedia
function pointer(kind: 'mouse' | 'touch') {
  window.matchMedia = ((q: string) => ({
    matches: q.includes('hover: hover') ? kind === 'mouse' : false,
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  })) as never
}

beforeEach(() => {
  factory.mockClear()
  dispose.mockClear()
  tubes.setColors.mockClear()
  tubes.setLightsColors.mockClear()
  localStorage.clear()
  reduced = false
})
afterEach(() => {
  window.matchMedia = realMatchMedia
})

describe('cursor tubes effect', () => {
  it('loads for a mouse user, in brand colours (green and the logo yellow), on a fixed non-interactive blended layer', async () => {
    pointer('mouse')
    localStorage.setItem('disatu-theme', 'dark')
    const { unmount } = await renderWithRouter('/id')
    await waitFor(() => expect(factory).toHaveBeenCalledTimes(1), { timeout: 4000 })
    const [canvas, opts] = factory.mock.calls[0] as [HTMLCanvasElement, { tubes: { colors: string[]; lights: { colors: string[] } } }]
    const layer = canvas.parentElement as HTMLElement
    expect(layer.className).toMatch(/pointer-events-none/)
    expect(layer.className).toContain('cursor-tubes') // dims over links and buttons (rule in styles.css)
    expect(layer.className).toMatch(/fixed/)
    expect(layer.getAttribute('aria-hidden')).toBe('true')
    // the library paints an opaque black canvas, so the layer must blend it into the page instead of covering it
    expect(layer.className).toMatch(/mix-blend-multiply/)
    expect(layer.className).toMatch(/dark:mix-blend-screen/)
    expect(opts.tubes.colors).toHaveLength(3)
    expect(opts.tubes.lights.colors).toHaveLength(4)
    const all = [...opts.tubes.colors, ...opts.tubes.lights.colors].map((c) => c.toLowerCase())
    expect(all).toContain('#3fa37f') // brand green
    expect(all).toContain('#ffd33f') // logo yellow
    unmount()
    expect(dispose).toHaveBeenCalled()
  })

  it('does not load on touch devices', async () => {
    pointer('touch')
    await renderWithRouter('/id')
    await new Promise((r) => setTimeout(r, 1800))
    expect(factory).not.toHaveBeenCalled()
    expect(document.querySelector('canvas[class*="h-full"]')?.closest('[aria-hidden="true"].fixed')).toBeFalsy()
  })

  it('does not load for visitors who ask for reduced motion', async () => {
    pointer('mouse')
    reduced = true
    await renderWithRouter('/id')
    await new Promise((r) => setTimeout(r, 1800))
    expect(factory).not.toHaveBeenCalled()
  })
})
