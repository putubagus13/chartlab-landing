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

  it('shows features and ordered steps', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    expect(within(sec).getByRole('heading', { level: 2, name: c.backtest.title })).toBeInTheDocument()
    for (const f of c.backtest.features) expect(within(sec).getByText(f.title)).toBeInTheDocument()
    expect(within(sec).getByRole('heading', { name: c.ui.howToGetAccess })).toBeInTheDocument()
    const ol = sec.querySelector('ol')!
    expect(ol).not.toBeNull()
    expect(within(ol as HTMLElement).getAllByRole('listitem')).toHaveLength(c.backtest.steps.length)
    for (const s of c.backtest.steps) expect(within(ol as HTMLElement).getByText(s.title)).toBeInTheDocument()
  })

  it('links to the app externally and back to the e-book', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    const open = within(sec).getByRole('link', { name: c.ui.openApp })
    expect(open).toHaveAttribute('href', c.backtest.appUrl)
    expect(open).toHaveAttribute('target', '_blank')
    expect(open.getAttribute('rel')).toContain('noopener')
    expect(within(sec).getByText(c.ui.freeForBuyers)).toBeInTheDocument()
    const back = within(sec).getAllByRole('link').find((a) => a.getAttribute('href') === `/${lang}#ebook`)
    expect(back).toBeTruthy()
    expect(within(sec).getAllByText(c.ui.sampleData).length).toBeGreaterThan(0)
  })
})
