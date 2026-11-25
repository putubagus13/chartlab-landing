import { describe, it, expect, vi } from 'vitest'

// The e-book is hidden by default; turn it on to keep its section covered for when it returns.
vi.mock('@/content/flags', () => ({ FEATURES: { ebook: true } }))
import { screen, waitFor, within } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'
import { formatIDR } from '@/lib/format'

const norm = (s: string) => s.replace(/\s/g, ' ')

describe.each(LANGS)('EbookSection %s', (lang) => {
  const c = getContent(lang)

  async function section() {
    return waitFor(() => {
      const el = document.getElementById('ebook')
      if (!el) throw new Error('no ebook section')
      return el
    })
  }

  it.each(c.ebook.packages.map((p) => [p.id, p] as const))('package %s card', async (_id, pkg) => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    const card = within(sec).getByRole('heading', { name: pkg.name }).closest('article') as HTMLElement
    expect(card).toBeTruthy()
    const text = norm(card.textContent ?? '')
    expect(text).toContain(formatIDR(pkg.price, lang).replace(/\s/g, ' '))
    if (pkg.originalPrice) {
      const s = card.querySelector('s')
      expect(s).not.toBeNull()
      expect(norm(s!.textContent ?? '')).toBe(formatIDR(pkg.originalPrice, lang).replace(/\s/g, ' '))
    }
    expect(within(card).getByText(c.ui.freeBacktestBadge)).toBeInTheDocument()
    const cta = within(card).getByRole('link', { name: c.ui.buyPackage })
    expect(cta).toHaveAttribute('href', pkg.checkoutUrl)
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta.getAttribute('rel')).toContain('noopener')
    for (const f of pkg.features) expect(within(card).getByText(f)).toBeInTheDocument()
    if (pkg.highlighted) expect(within(card).getByText(c.ui.mostPopular)).toBeInTheDocument()
    else expect(within(card).queryByText(c.ui.mostPopular)).toBeNull()
  })

  it('lists chapters under the learn heading', async () => {
    await renderWithRouter(`/${lang}`)
    const sec = await section()
    expect(within(sec).getByRole('heading', { name: c.ui.whatYouLearn })).toBeInTheDocument()
    for (const ch of c.ebook.chapters) expect(within(sec).getByText(ch)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: c.ebook.title })).toBeInTheDocument()
  })
})
