import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { render, waitFor } from '@testing-library/react'

// Keep the real timings out of the test: a 40 ms intro and a 20 ms fade.
vi.mock('@/lib/splash', async (orig) => ({ ...((await orig()) as object), SPLASH_MIN_MS: 40, SPLASH_FADE_MS: 20 }))

import { renderWithRouter } from './utils'
import { SPLASH_KEY, splashInitScript } from '@/lib/splash'
import { Splash } from '@/components/ui/splash'

const css = readFileSync('src/styles.css', 'utf8')
const loaderCss = css.slice(css.indexOf('/* ---- Disatu loader'))
// not `[data-splash]`: the head script puts that attribute on <html> itself
const overlay = () => document.querySelector('[data-splash-overlay]') as HTMLElement | null

beforeEach(() => {
  delete document.documentElement.dataset.splash
  sessionStorage.clear()
})

describe('splash screen', () => {
  it('is part of the app and covers the page on a first visit with the animated logo (mark, accent, wordmark)', async () => {
    await renderWithRouter('/id')
    const el = overlay()!
    expect(el).not.toBeNull()
    expect(el.getAttribute('aria-hidden')).toBe('true') // decorative: the page behind it is readable at once
    expect(el.querySelector('.dsl-g')).not.toBeNull()
    expect(el.querySelector('.dsl-y')).not.toBeNull()
    expect(el.querySelector('.dsl-w')).not.toBeNull()
  })

  it('fades out after the intro and is then removed from the page', async () => {
    render(<Splash />)
    expect(overlay()?.getAttribute('data-done')).toBe('false')
    await waitFor(() => expect(overlay()?.getAttribute('data-done')).toBe('true'))
    await waitFor(() => expect(overlay()).toBeNull())
  })

  it('does not show again in the same browser session (head script flagged <html data-splash="seen">)', () => {
    document.documentElement.dataset.splash = 'seen'
    render(<Splash />)
    expect(overlay()).toBeNull() // at once, not after the intro's timers
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
