import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { act } from 'react'

// @ts-expect-error React act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// framer returns null on the server and the real preference on the client.
let reducedValue: boolean | null = null
vi.mock('framer-motion', async (orig) => ({
  ...((await orig()) as object),
  useReducedMotion: () => reducedValue,
}))

import { Reveal } from '@/components/motion/reveal'

afterEach(() => {
  vi.restoreAllMocks()
  reducedValue = null
})

describe('Reveal SSR + hydration', () => {
  it('server HTML is visible without JS (no inline opacity:0)', () => {
    reducedValue = null
    const html = renderToString(<Reveal>Halo</Reveal>)
    expect(html).toContain('Halo')
    expect(html).not.toMatch(/opacity:\s*0/)
  })

  it('reduced-motion visitor: hydrates cleanly and content stays visible', async () => {
    reducedValue = null
    const html = renderToString(<Reveal>Halo</Reveal>)
    reducedValue = true
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const el = document.createElement('div')
    el.innerHTML = html
    document.body.appendChild(el)
    await act(async () => {
      hydrateRoot(el, <Reveal>Halo</Reveal>)
    })
    expect(err).not.toHaveBeenCalled()
    expect(el.innerHTML).not.toMatch(/opacity:\s*0/)
    expect(el.textContent).toBe('Halo')
  })

  it('motion-allowed visitor: hydrates cleanly, then animates in after mount', async () => {
    reducedValue = null
    const html = renderToString(<Reveal>Halo</Reveal>)
    reducedValue = false
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const el = document.createElement('div')
    el.innerHTML = html
    document.body.appendChild(el)
    await act(async () => {
      hydrateRoot(el, <Reveal>Halo</Reveal>)
    })
    expect(err).not.toHaveBeenCalled()
    expect(el.textContent).toBe('Halo')
  })
})
