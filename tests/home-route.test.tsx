import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'
import { SITE_URL } from '@/seo/site-url'

describe.each(LANGS)('home route %s', (lang) => {
  const c = getContent(lang)
  it('renders sections in order with offer and title', async () => {
    await renderWithRouter(`/${lang}`)
    await waitFor(() => expect(document.getElementById('chartlab')).not.toBeNull())
    const ids = Array.from(document.querySelectorAll('main section[id]')).map((s) => s.id)
    expect(ids).toEqual(['hero', 'workflow', 'chartlab', 'offer'])
    expect(screen.getByRole('heading', { name: c.offer.title })).toBeInTheDocument()
    await waitFor(() => expect(document.title).toBe(c.meta.homeTitle))
  })
  it('has no About page (that lives on the Disatu landing)', async () => {
    await renderWithRouter(`/${lang}/about`)
    await waitFor(() => expect(screen.getByRole('heading', { name: /404/ })).toBeInTheDocument())
  })
  it('emits absolute hreflang alternates and a self-referencing canonical', async () => {
    await renderWithRouter(`/${lang}`)
    await waitFor(() => {
      const hrefs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((l) => `${l.getAttribute('hreflang')}=${l.getAttribute('href')}`)
      expect(hrefs).toEqual(expect.arrayContaining([`id=${SITE_URL}/id`, `en=${SITE_URL}/en`, `x-default=${SITE_URL}/id`]))
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${SITE_URL}/${lang}`)
    })
  })
  it('describes the app in structured data', async () => {
    await renderWithRouter(`/${lang}`)
    await waitFor(() => {
      const ld = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => JSON.parse(s.textContent ?? '{}'))
      expect(ld).toHaveLength(1)
      expect(JSON.stringify(ld[0])).toContain('"SoftwareApplication"')
    })
  })
})
