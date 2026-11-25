import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

describe.each(LANGS)('home route %s', (lang) => {
  const c = getContent(lang)
  it('renders sections in order with offer and title', async () => {
    await renderWithRouter(`/${lang}`)
    await waitFor(() => expect(document.getElementById('backtest')).not.toBeNull())
    const ids = Array.from(document.querySelectorAll('main section[id]')).map((s) => s.id)
    expect(ids).toEqual(['hero', 'workflow', 'ebook', 'backtest', 'offer'])
    expect(screen.getByRole('heading', { name: c.offer.title })).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe(c.meta.homeTitle))
  })
  it('emits hreflang alternates', async () => {
    await renderWithRouter(`/${lang}`)
    await waitFor(() => {
      const hrefs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((l) => `${l.getAttribute('hreflang')}=${l.getAttribute('href')}`)
      expect(hrefs).toEqual(expect.arrayContaining(['id=/id', 'en=/en', 'x-default=/id']))
    })
  })
})
