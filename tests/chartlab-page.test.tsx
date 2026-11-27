import { SITE_URL } from '@/seo/site-url'
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
  removeFakeFullscreen()
})

/** jsdom has no Fullscreen API: stand one in, and let a test say which element is full screen. */
function fakeFullscreen(supported = true) {
  let current: Element | null = null
  const request = vi.fn(function (this: Element) {
    current = this
    document.dispatchEvent(new Event('fullscreenchange'))
    return Promise.resolve()
  })
  const exit = vi.fn(() => {
    current = null
    document.dispatchEvent(new Event('fullscreenchange'))
    return Promise.resolve()
  })
  Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, get: () => supported })
  Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => current })
  Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: exit })
  Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { configurable: true, value: request })
  return { request, exit }
}
function removeFakeFullscreen() {
  for (const k of ['fullscreenEnabled', 'fullscreenElement', 'exitFullscreen']) Reflect.deleteProperty(document, k)
  Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen')
}

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

  it('credits Vela, and offers no "new tab" link while the app is running: two copies would overwrite each other\'s saved data', async () => {
    fakeFullscreen()
    await openPage(`/${lang}/chartlab`)
    const main = screen.getByRole('main')
    expect(within(main).queryByRole('link', { name: c.openNewTab })).toBeNull()
    const credit = within(main).getByRole('link', { name: new RegExp(c.credit.replace(/[()]/g, '\\$&')) })
    expect(credit).toHaveAttribute('href', 'https://velacharts.dev')
    expect(c.credit).toMatch(/Vela/)
  })

  it('emits absolute hreflang alternates and a self-referencing canonical', async () => {
    await openPage(`/${lang}/chartlab`)
    await waitFor(() => {
      const hrefs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((l) => `${l.getAttribute('hreflang')}=${l.getAttribute('href')}`)
      expect(hrefs).toEqual(expect.arrayContaining([`id=${SITE_URL}/id/chartlab`, `en=${SITE_URL}/en/chartlab`, `x-default=${SITE_URL}/id/chartlab`]))
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE_URL}/${lang}/chartlab`)
    })
  })
})

describe('full screen', () => {
  it('puts the whole page section, header included, in full screen, so the way out and the Vela credit stay on screen', async () => {
    const { request, exit } = fakeFullscreen()
    const { frame } = await openPage('/en/chartlab')
    const c = getContent('en').chartlabPage
    const section = frame.closest('section')!
    fireEvent.click(await screen.findByRole('button', { name: c.fullscreen }))
    expect(request).toHaveBeenCalledTimes(1)
    expect(request.mock.contexts[0]).toBe(section)
    expect(section.contains(screen.getByRole('button', { name: c.exitFullscreen }))).toBe(true)
    expect(within(section).getByRole('link', { name: new RegExp(c.credit.replace(/[()]/g, '\\$&')) })).toBeInTheDocument()
    // the same button now leaves full screen
    fireEvent.click(await screen.findByRole('button', { name: c.exitFullscreen }))
    expect(exit).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('button', { name: c.fullscreen })).toBeInTheDocument()
  })

  it('follows the browser: leaving with Esc puts the label back', async () => {
    const { request } = fakeFullscreen()
    const { frame } = await openPage('/id/chartlab')
    const c = getContent('id').chartlabPage
    fireEvent.click(await screen.findByRole('button', { name: c.fullscreen }))
    expect(request).toHaveBeenCalled()
    await screen.findByRole('button', { name: c.exitFullscreen })
    act(() => {
      Reflect.deleteProperty(document, 'fullscreenElement') // the browser left full screen by itself
      Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => null })
      document.dispatchEvent(new Event('fullscreenchange'))
    })
    expect(await screen.findByRole('button', { name: c.fullscreen })).toBeInTheDocument()
    expect(frame).toBeInTheDocument()
  })

  it('shows no button where the browser cannot do it (some phones), rather than one that does nothing', async () => {
    fakeFullscreen(false)
    await openPage('/en/chartlab')
    const c = getContent('en').chartlabPage
    expect(screen.queryByRole('button', { name: c.fullscreen })).toBeNull()
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
    const fallbackHref = new URL(within(overlay()).getByRole('link', { name: c.openNewTab }).getAttribute('href')!)
    expect(fallbackHref.origin).toBe(APP_ORIGIN)
    expect(fallbackHref.searchParams.get('lang')).toBe('en')
    expect(fallbackHref.searchParams.has('embed')).toBe(false)
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

  it('keeps the fallback "open in a new tab" link in step with the theme as it changes', async () => {
    timeoutMs = 30
    const { overlay } = await openPage('/id/chartlab')
    await waitFor(() => expect(overlay().dataset.state).toBe('failed'))
    const link = () => new URL(within(overlay()).getByRole('link', { name: getContent('id').chartlabPage.openNewTab }).getAttribute('href')!)
    expect(link().searchParams.get('theme')).toBe('light')
    const toggle = Array.from(document.querySelectorAll('header button')).find((b) => /theme|tema/i.test(b.getAttribute('aria-label') ?? '')) as HTMLButtonElement
    fireEvent.click(toggle)
    fireEvent.click(toggle) // -> dark
    await waitFor(() => expect(link().searchParams.get('theme')).toBe('dark'))
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
