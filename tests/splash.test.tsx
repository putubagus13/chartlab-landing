import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { act, cleanup, render, waitFor } from '@testing-library/react'

// Keep the real timings out of the test: a 40 ms intro and a 20 ms fade.
vi.mock('@/lib/splash', async (orig) => ({ ...((await orig()) as object), SPLASH_MIN_MS: 40, SPLASH_FADE_MS: 20 }))

// A stand-in for the WebGL glass engine so the splash's own logic can be driven step by step.
type GlassProps = {
  look: string
  background: string
  plateColor?: string
  logo: string
  originalColors?: boolean
  loop?: boolean
  onComplete?: () => void
  onFallback?: () => void
}
let glass: GlassProps | null = null
let mockGlass = true
vi.mock('@/components/brand/glass-reveal', async (orig) => {
  const real = (await orig()) as { GlassIconReveal: unknown }
  return {
    ...real,
    GlassIconReveal: (props: GlassProps) => {
      if (!mockGlass) return (real.GlassIconReveal as (p: GlassProps) => unknown)(props)
      glass = props
      return <div data-testid="glass" />
    },
  }
})

import { renderWithRouter } from './utils'
import { SPLASH_KEY, splashInitScript } from '@/lib/splash'
import { Splash } from '@/components/ui/splash'

const css = readFileSync('src/styles.css', 'utf8')
const loaderCss = css.slice(css.indexOf('/* ---- Disatu loader'))
// not `[data-splash]`: the head script puts that attribute on <html> itself
const overlay = () => document.querySelector('[data-splash-overlay]') as HTMLElement | null

beforeEach(() => {
  delete document.documentElement.dataset.splash
  document.documentElement.classList.remove('dark')
  sessionStorage.clear()
  glass = null
  mockGlass = true
})

describe('splash screen', () => {
  it('is part of the app and covers the page on a first visit', async () => {
    await renderWithRouter('/id')
    const el = overlay()!
    expect(el).not.toBeNull()
    expect(el.getAttribute('aria-hidden')).toBe('true') // decorative: the page behind it is readable at once
  })

  it('plays the glass reveal with the Disatu mark in its own colours, in light and dark', async () => {
    render(<Splash />)
    await waitFor(() => expect(glass).not.toBeNull())
    expect(glass!.look).toBe('light')
    expect(glass!.background.toLowerCase()).toBe('#ffffff')
    expect(glass!.originalColors).toBe(true)
    expect(glass!.loop).toBe(false)
    expect(glass!.logo).toContain('#ffd33f') // the yellow accent
    expect(glass!.logo).toContain('#0a0a0a') // the D, dark on light
    cleanup()

    glass = null
    document.documentElement.classList.add('dark')
    render(<Splash />)
    await waitFor(() => expect(glass).not.toBeNull())
    expect(glass!.look).toBe('dark')
    expect(glass!.background.toLowerCase()).toBe('#0a0a0a') // the site's near-black, not pure black
    expect(glass!.logo).toContain('#f5f5f5') // the D, light on dark
  })

  it('stays until the reveal has finished, then fades out and is removed', async () => {
    render(<Splash />)
    await waitFor(() => expect(glass).not.toBeNull())
    await new Promise((r) => setTimeout(r, 120)) // well past the (mocked) minimum time
    expect(overlay()?.getAttribute('data-done')).toBe('false')
    act(() => glass!.onComplete!())
    await waitFor(() => expect(overlay()?.getAttribute('data-done')).toBe('true'))
    await waitFor(() => expect(overlay()).toBeNull())
  })

  it('falls back to the CSS logo animation when WebGL is unavailable, and still finishes by itself', async () => {
    render(<Splash />)
    await waitFor(() => expect(glass).not.toBeNull())
    act(() => glass!.onFallback!())
    expect(overlay()!.querySelector('.dsl-g')).not.toBeNull()
    expect(overlay()!.querySelector('.dsl-y')).not.toBeNull()
    await waitFor(() => expect(overlay()?.getAttribute('data-done')).toBe('true'))
    await waitFor(() => expect(overlay()).toBeNull())
  })

  it('uses the CSS animation when the real engine finds no WebGL2 (jsdom has none)', async () => {
    mockGlass = false
    render(<Splash />)
    await waitFor(() => expect(overlay()!.querySelector('.dsl-g')).not.toBeNull())
    await waitFor(() => expect(overlay()).toBeNull())
  })

  it('does not show again in the same browser session (head script flagged <html data-splash="seen">)', () => {
    document.documentElement.dataset.splash = 'seen'
    render(<Splash />)
    expect(overlay()).toBeNull() // at once, not after the intro's timers
    expect(glass).toBeNull() // and the heavy engine is never started
  })

  it('shows nothing, and no scripts need to run, for visitors with JavaScript off', () => {
    const { container } = render(<Splash />)
    expect(container.querySelector('noscript')).not.toBeNull()
  })
})

describe('splashInitScript (runs in <head>, before first paint)', () => {
  it('marks the first visit, then flags repeat visits as seen', () => {
    new Function(splashInitScript)()
    expect(sessionStorage.getItem(SPLASH_KEY)).toBe('1')
    expect(document.documentElement.dataset.splash).toBeUndefined()
    new Function(splashInitScript)()
    expect(document.documentElement.dataset.splash).toBe('seen')
  })
  it('never throws when storage is blocked', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => new Function(splashInitScript)()).not.toThrow()
    spy.mockRestore()
  })
})

describe('splash stylesheet', () => {
  it('exists, hides itself without JavaScript, and respects "seen" and reduced motion', () => {
    expect(loaderCss.length).toBeGreaterThan(300)
    expect(loaderCss).toMatch(/\.splash\s*\{[^}]*animation:[^}]*splash-failsafe/) // CSS-only exit if scripts never run
    expect(loaderCss).toMatch(/html\[data-splash="seen"\]\s*\.splash\s*\{[^}]*display:\s*none/)
    expect(loaderCss).toMatch(/prefers-reduced-motion:\s*reduce\)[\s\S]*\.splash\s*\{[^}]*display:\s*none/)
  })
  it('uses brand colours: logo yellow accent, theme foreground for the body', () => {
    expect(loaderCss).toMatch(/\.dsl-y\s*\{[^}]*#ffd33f/i)
    expect(loaderCss).toMatch(/\.dsl-g[\s\S]*?fill:\s*var\(--fg\)/)
  })
})
