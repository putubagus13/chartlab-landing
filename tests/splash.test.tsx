import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { render, waitFor } from '@testing-library/react'

// Keep the real timings out of the test: a 40 ms intro, a 20 ms fade and a 300 ms hard cap.
vi.mock('@/lib/splash', async (orig) => ({ ...((await orig()) as object), SPLASH_MIN_MS: 40, SPLASH_FADE_MS: 20, SPLASH_MAX_MS: 300 }))

import { renderWithRouter } from './utils'
import { SPLASH_KEY, splashInitScript } from '@/lib/splash'
import { Splash } from '@/components/ui/splash'

const css = readFileSync('src/styles.css', 'utf8')
const splashCss = css.slice(css.indexOf('/* ---- Splash screen'))
const loaderSrc = readFileSync('src/components/brand/chartlab-loader.tsx', 'utf8')
// not `[data-splash]`: the head script puts that attribute on <html> itself
const overlay = () => document.querySelector('[data-splash-overlay]') as HTMLElement | null

beforeEach(() => {
  delete document.documentElement.dataset.splash
  document.documentElement.classList.remove('dark')
  sessionStorage.clear()
})

describe('splash screen', () => {
  it('is part of the app and covers the page on a first visit', async () => {
    await renderWithRouter('/id')
    const el = overlay()!
    expect(el).not.toBeNull()
    expect(el.getAttribute('aria-hidden')).toBe('true') // decorative: the page behind it is readable at once
  })

  it('shows the ChartLab loader (breakout, with its wordmark)', () => {
    render(<Splash />)
    const loaders = overlay()!.querySelectorAll('.cll-root[data-variant="breakout"]')
    expect(loaders.length).toBe(2)
    for (const l of loaders) {
      expect(l.querySelectorAll('svg').length).toBeGreaterThanOrEqual(1)
      expect(l.querySelector('.cll-w')).not.toBeNull() // the "chartlab" wordmark
    }
  })

  it('loader tone follows the theme from the first paint: colour on light, reverse on dark', () => {
    render(<Splash />)
    const light = overlay()!.querySelector('.cll-root[data-tone="color"]')!
    const dark = overlay()!.querySelector('.cll-root[data-tone="reverse"]')!
    // the theme switch lives on wrappers: the loader's own display rule would beat a class on .cll-root itself
    expect(light.parentElement!.className).toContain('dark:hidden')
    expect(dark.parentElement!.className).toContain('hidden')
    expect(dark.parentElement!.className).toContain('dark:block')
  })

  it('leaves once the page has loaded and SPLASH_MIN_MS has passed, then is removed', async () => {
    render(<Splash />)
    expect(overlay()?.getAttribute('data-done')).toBe('false')
    await waitFor(() => expect(overlay()?.getAttribute('data-done')).toBe('true'))
    await waitFor(() => expect(overlay()).toBeNull())
  })

  it('never stays past SPLASH_MAX_MS, even if the page never finishes loading', async () => {
    const state = vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
    const now = vi.spyOn(performance, 'now').mockReturnValue(0) // as if the page had only just started loading
    render(<Splash />)
    await new Promise((r) => setTimeout(r, 120)) // past the minimum, but no load event
    expect(overlay()?.getAttribute('data-done')).toBe('false')
    await waitFor(() => expect(overlay()?.getAttribute('data-done')).toBe('true'), { timeout: 1000 })
    state.mockRestore()
    now.mockRestore()
  })

  it('does not show again in the same browser session (head script flagged <html data-splash="seen">)', () => {
    document.documentElement.dataset.splash = 'seen'
    render(<Splash />)
    expect(overlay()).toBeNull() // at once, not after the intro's timers
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
    expect(splashCss.length).toBeGreaterThan(300)
    expect(splashCss).toMatch(/\.splash\s*\{[^}]*animation:[^}]*splash-failsafe/) // CSS-only exit if scripts never run
    expect(splashCss).toMatch(/html\[data-splash="seen"\]\s*\.splash\s*\{[^}]*display:\s*none/)
    expect(splashCss).toMatch(/prefers-reduced-motion:\s*reduce\)[\s\S]*\.splash\s*\{[^}]*display:\s*none/)
  })
  it('the Disatu loader styles are gone', () => expect(css).not.toMatch(/\.dsl-/))
  it('the loader is the brand kit one, in brand colours', () => {
    expect(loaderSrc).toContain('#124232')
    expect(loaderSrc).toContain('#FFD33F')
  })
})
