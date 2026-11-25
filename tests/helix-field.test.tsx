import { describe, it, expect, vi } from 'vitest'
import { fireEvent, waitFor, within } from '@testing-library/react'

// framer returns null on the server and the real preference on the client.
let reduced: boolean | null = false
vi.mock('framer-motion', async (orig) => ({
  ...((await orig()) as object),
  useReducedMotion: () => reduced,
}))

import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

async function hero() {
  return waitFor(() => {
    const el = document.getElementById('hero')
    if (!el) throw new Error('no hero')
    return el
  })
}

describe.each(LANGS)('hero animation controls %s', (lang) => {
  const ui = getContent(lang).ui

  it('offers three shapes (one pressed) and no "strata" wording', async () => {
    reduced = false
    await renderWithRouter(`/${lang}`)
    const h = await hero()
    const group = within(h).getByRole('group', { name: ui.visualModesLabel })
    const buttons = within(group).getAllByRole('button')
    expect(buttons.map((b) => b.textContent)).toEqual([ui.visualModes.helix, ui.visualModes.neural, ui.visualModes.ribbons])
    expect(buttons.filter((b) => b.getAttribute('aria-pressed') === 'true')).toHaveLength(1)
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(buttons[2])
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'true')
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false')
    expect(h.textContent ?? '').not.toMatch(/strata/i)
  })

  it('can be paused and resumed', async () => {
    reduced = false
    await renderWithRouter(`/${lang}`)
    const h = await hero()
    const pause = await within(h).findByRole('button', { name: ui.visualPause })
    fireEvent.click(pause)
    expect(within(h).getByRole('button', { name: ui.visualPlay })).toBeInTheDocument()
  })

  it('starts paused for visitors who ask for reduced motion', async () => {
    reduced = true
    await renderWithRouter(`/${lang}`)
    const h = await hero()
    expect(await within(h).findByRole('button', { name: ui.visualPlay })).toBeInTheDocument()
    expect(within(h).queryByRole('button', { name: ui.visualPause })).toBeNull()
  })
})
