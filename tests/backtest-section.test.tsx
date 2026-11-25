import { describe, it, expect } from 'vitest'
import { waitFor, within } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

describe.each(LANGS)('BacktestSection %s', (lang) => {
  const c = getContent(lang)
  async function section() {
    return waitFor(() => {
      const el = document.getElementById('backtest')
      if (!el) throw new Error('no backtest section')
      return el
    })
  }

  it('shows heading, free badge, features and ordered steps', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    expect(within(sec).getByRole('heading', { level: 2, name: c.backtest.title })).toBeInTheDocument()
    expect(within(sec).getByText(c.ui.freeBadge)).toBeInTheDocument()
    for (const f of c.backtest.features) expect(within(sec).getByText(f.title)).toBeInTheDocument()
    expect(within(sec).getByRole('heading', { name: c.ui.howToGetAccess })).toBeInTheDocument()
    const ol = sec.querySelector('ol')!
    expect(within(ol as HTMLElement).getAllByRole('listitem')).toHaveLength(c.backtest.steps.length)
    for (const s of c.backtest.steps) expect(within(ol as HTMLElement).getByText(s.title)).toBeInTheDocument()
  })

  it('embeds the tutorial video with controls and without preloading the whole file', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    const video = sec.querySelector('video') as HTMLVideoElement
    expect(video).not.toBeNull()
    expect(video.getAttribute('src')).toBe('/assets/tutorial_backtest_v2.mp4')
    expect(video.getAttribute('poster')).toBe('/assets/tutorial_backtest_poster.jpg')
    expect(video.hasAttribute('controls')).toBe(true)
    expect(video.getAttribute('preload')).toBe('metadata')
    expect(video.getAttribute('aria-label')).toBe(c.backtest.videoLabel)
    expect(within(sec).getByText(c.backtest.videoNote)).toBeInTheDocument()
  })

  it('opens the app externally', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    const open = within(sec).getByRole('link', { name: c.ui.openApp })
    expect(open).toHaveAttribute('href', c.backtest.appUrl)
    expect(open).toHaveAttribute('target', '_blank')
    expect(open.getAttribute('rel')).toContain('noopener')
  })
})
