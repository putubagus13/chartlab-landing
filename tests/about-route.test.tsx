import { describe, it, expect } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

describe.each(LANGS)('about route %s', (lang) => {
  const c = getContent(lang)

  it('shows profile, skills, socials and title', async () => {
    await renderWithRouter(`/${lang}/about`)
    const h1 = await screen.findByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(c.about.name)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const main = screen.getByRole('main')
    expect(within(main).getByText(c.about.headline)).toBeInTheDocument()
    expect(within(main).getByText(c.about.location)).toBeInTheDocument()
    expect(within(main).getByRole('heading', { name: c.ui.skillsTitle })).toBeInTheDocument()
    for (const s of c.about.skills) expect(within(main).getByText(s)).toBeInTheDocument()
    for (const s of c.about.socials) {
      const a = within(main).getByRole('link', { name: s.label })
      expect(a).toHaveAttribute('href', s.url)
      expect(a).toHaveAttribute('target', '_blank')
      expect(a.getAttribute('rel')).toContain('noopener')
    }
    await waitFor(() => expect(document.title).toBe(c.meta.aboutTitle))
  })

  it('renders the experience timeline', async () => {
    await renderWithRouter(`/${lang}/about`)
    const main = await screen.findByRole('main')
    expect(within(main).getByRole('heading', { name: c.ui.experienceTitle })).toBeInTheDocument()
    const ol = main.querySelector('ol') as HTMLElement
    expect(ol).not.toBeNull()
    const items = within(ol).getAllByRole('listitem').filter((li) => li.parentElement === ol)
    expect(items).toHaveLength(c.about.experiences.length)
    c.about.experiences.forEach((e, i) => {
      expect(items[i]).toHaveTextContent(e.role)
      expect(items[i]).toHaveTextContent(e.company)
      expect(items[i]).toHaveTextContent(e.period)
    })
  })

  it('uses initials avatar when there is no photo, and links CTA to e-book', async () => {
    await renderWithRouter(`/${lang}/about`)
    const main = await screen.findByRole('main')
    expect(c.about.photo).toBeUndefined()
    expect(main.querySelector('img')).toBeNull()
    const initials = c.about.name.split(/\s+/).filter((w) => /^\p{L}/u.test(w)).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    expect(within(main).getByText(initials)).toBeInTheDocument()
    expect(within(main).getByRole('link', { name: c.ui.aboutCta })).toHaveAttribute('href', `/${lang}#ebook`)
  })
})
