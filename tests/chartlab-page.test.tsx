import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'

// The app times out after a configurable wait; each test sets how long.
let timeoutMs = 60_000
vi.mock('@/lib/chartlab-embed', async (orig) => ({
  ...((await orig()) as object),
  get CHARTLAB_TIMEOUT_MS() {
    return timeoutMs
  },
}))
// The cursor effect would pull in WebGL; its own tests cover it.
vi.mock('threejs-components/build/cursors/tubes1.min.js', () => ({
  default: () => ({ tubes: { setColors() {}, setLightsColors() {} }, dispose() {} }),
}))

import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'
import { CHARTLAB_BASE, READY_TYPE } from '@/lib/chartlab-embed'

const APP_ORIGIN = new URL(CHARTLAB_BASE).origin
const realMatchMedia = window.matchMedia

beforeEach(() => {
  timeoutMs = 60_000
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})
afterEach(() => {
  window.matchMedia = realMatchMedia
})

async function openPage(path: string) {
  const ctx = await renderWithRouter(path)
  const frame = (await waitFor(() => {
    const f = document.querySelector('iframe')
    if (!f) throw new Error('no iframe yet')
    return f
  })) as HTMLIFrameElement
  const overlay = () => document.querySelector('[data-chartlab-overlay]') as HTMLElement
  const sendReady = (origin = APP_ORIGIN, source: unknown = frame.contentWindow) =>
    act(() => {
      window.dispatchEvent(new MessageEvent('message', { data: { type: READY_TYPE }, origin, source: source as MessageEventSource }))
    })
  return { ...ctx, frame, overlay, sendReady }
}

describe.each(LANGS)('/%s/chartlab', (lang) => {
  const c = getContent(lang).chartlabPage

  it('embeds the app with the current theme and language already in the URL, under one h1', async () => {
    const { frame } = await openPage(`/${lang}/chartlab`)
    const src = new URL(frame.getAttribute('src')!)
    expect(src.origin).toBe(APP_ORIGIN)
    expect(src.searchParams.get('embed')).toBe('1')
    expect(src.searchParams.get('theme')).toBe('light')
    expect(src.searchParams.get('lang')).toBe(lang)
    expect(frame.getAttribute('title')).toBe(c.title)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    await waitFor(() => expect(document.title).toBe(c.title))
  })

  it('opens the app on the dark theme when the visitor is on dark', async () => {
    localStorage.setItem('disatu-theme', 'dark')
    const { frame } = await openPage(`/${lang}/chartlab`)
    expect(new URL(frame.getAttribute('src')!).searchParams.get('theme')).toBe('dark')
  })

  it('always offers the app in its own tab and credits Vela', async () => {
    await openPage(`/${lang}/chartlab`)
    const main = screen.getByRole('main')
    const tab = within(main).getByRole('link', { name: c.openNewTab })
    expect(tab.getAttribute('href')).toBe(CHARTLAB_BASE)
    expect(tab).toHaveAttribute('target', '_blank')
    expect(tab.getAttribute('rel')).toContain('noopener')
    const credit = within(main).getByRole('link', { name: new RegExp(c.credit.replace(/[()]/g, '\\$&')) })
    expect(credit).toHaveAttribute('href', 'https://velacharts.dev')
    expect(c.credit).toMatch(/Vela/)
  })

  it('emits hreflang alternates for both languages', async () => {
    await openPage(`/${lang}/chartlab`)
    await waitFor(() => {
      const hrefs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((l) => `${l.getAttribute('hreflang')}=${l.getAttribute('href')}`)
      expect(hrefs).toEqual(expect.arrayContaining(['id=/id/chartlab', 'en=/en/chartlab']))
    })
  })
})

describe('the loading overlay', () => {
  it('goes away when, and only when, the app itself says it is ready', async () => {
    const { overlay, frame, sendReady } = await openPage('/id/chartlab')
    expect(overlay().dataset.state).toBe('loading')
    await sendReady('https://evil.example') // right window, wrong origin
    expect(overlay().dataset.state).toBe('loading')
    await sendReady(APP_ORIGIN, window) // right origin, wrong window
    expect(overlay().dataset.state).toBe('loading')
    await sendReady()
    expect(overlay().dataset.state).toBe('ready')
    expect(frame.contentWindow).not.toBeNull()
  })

  it('falls back to a visible message and a link when the app never reports in', async () => {
    timeoutMs = 30
    const { overlay } = await openPage('/en/chartlab')
    await waitFor(() => expect(overlay().dataset.state).toBe('failed'))
    const c = getContent('en').chartlabPage
    expect(within(overlay()).getByText(c.fallback)).toBeInTheDocument()
    expect(within(overlay()).getByRole('link', { name: c.openNewTab }).getAttribute('href')).toBe(CHARTLAB_BASE)
  })
})

describe('keeping the app in step with the page', () => {
  it('tells the app when the theme changes, addressed to its origin only', async () => {
    const { frame, sendReady } = await openPage('/id/chartlab')
    const post = vi.spyOn(frame.contentWindow!, 'postMessage')
    await sendReady()
    post.mockClear()
    const toggle = Array.from(document.querySelectorAll('header button')).find((b) => /theme|tema/i.test(b.getAttribute('aria-label') ?? '')) as HTMLButtonElement
    fireEvent.click(toggle) // system -> light
    fireEvent.click(toggle) // light -> dark
    await waitFor(() => expect(post).toHaveBeenCalledWith(expect.objectContaining({ type: 'chartlab:set', theme: 'dark' }), APP_ORIGIN))
    for (const call of post.mock.calls) expect(call[1]).not.toBe('*')
  })

  it('tells the app when the language changes, without reloading it', async () => {
    const { frame, sendReady } = await openPage('/id/chartlab')
    const post = vi.spyOn(frame.contentWindow!, 'postMessage')
    await sendReady()
    post.mockClear()
    const header = screen.getByRole('banner')
    fireEvent.click(within(header).getByRole('link', { name: 'EN' }))
    await waitFor(() => expect(post).toHaveBeenCalledWith(expect.objectContaining({ type: 'chartlab:set', lang: 'en' }), APP_ORIGIN))
    expect(document.querySelector('iframe')).toBe(frame) // same element: no reload
  })
})

describe('the cursor effect', () => {
  function mouse() {
    window.matchMedia = ((q: string) => ({
      matches: q.includes('hover: hover'),
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
      onchange: null,
    })) as never
  }

  it('runs on the landing page but is off over the app', async () => {
    mouse()
    await renderWithRouter('/id')
    await waitFor(() => expect(document.querySelector('.cursor-tubes')).not.toBeNull())
    document.body.innerHTML = ''
    await renderWithRouter('/id/chartlab')
    await waitFor(() => expect(document.querySelector('iframe')).not.toBeNull())
    await new Promise((r) => setTimeout(r, 50))
    expect(document.querySelector('.cursor-tubes')).toBeNull()
  })
})
