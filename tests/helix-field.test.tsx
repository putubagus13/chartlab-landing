import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, waitFor, within } from '@testing-library/react'

// framer returns null on the server and the real preference on the client.
let reduced: boolean | null = false
vi.mock('framer-motion', async (orig) => ({
  ...((await orig()) as object),
  useReducedMotion: () => reduced,
}))

import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

afterEach(() => vi.useRealTimers())

async function visual() {
  const hero = await waitFor(() => {
    const el = document.getElementById('hero')
    if (!el) throw new Error('no hero')
    return el
  })
  const field = hero.querySelector('[data-mode]') as HTMLElement
  expect(field).not.toBeNull()
  return { hero, field }
}

describe.each(LANGS)('hero animation %s', (lang) => {
  const c = getContent(lang)

  it('has no controls and no "strata" wording', async () => {
    reduced = false
    await renderWithRouter(`/${lang}`)
    const { hero } = await visual()
    // the only buttons left in the hero are none at all: its CTAs are links
    expect(within(hero).queryAllByRole('button')).toHaveLength(0)
    expect(within(hero).getByRole('img')).toHaveAttribute('aria-label', c.ui.visualLabel)
    expect(hero.textContent ?? '').not.toMatch(/strata/i)
  })

  it('changes shape on its own every few seconds, looping helix -> neural -> ribbons', async () => {
    reduced = false
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    await renderWithRouter(`/${lang}`)
    const { field } = await visual()
    expect(field.dataset.mode).toBe('helix')
    const next = async () => {
      await act(async () => {
        vi.advanceTimersByTime(6000)
      })
    }
    await next()
    expect(field.dataset.mode).toBe('neural')
    await next()
    expect(field.dataset.mode).toBe('ribbons')
    await next()
    expect(field.dataset.mode).toBe('helix')
  })

  it('stays on one still shape for visitors who ask for reduced motion', async () => {
    reduced = true
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    await renderWithRouter(`/${lang}`)
    const { field } = await visual()
    await act(async () => {
      vi.advanceTimersByTime(30000)
    })
    expect(field.dataset.mode).toBe('helix')
  })
})
