import { describe, it, expect } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

describe.each(LANGS)('about route %s', (lang) => {
  const c = getContent(lang)

  it('shows profile, location, grouped skills, education and title', async () => {
    await renderWithRouter(`/${lang}/about`)
    const h1 = await screen.findByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Putu Bagus Raditya')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const main = screen.getByRole('main')
    expect(within(main).getByText(c.about.headline)).toBeInTheDocument()
    expect(within(main).getByText(c.about.location)).toBeInTheDocument()
    expect(c.about.location).toContain('Bandung')
    expect(within(main).getByRole('heading', { name: c.ui.skillsTitle })).toBeInTheDocument()
    for (const g of c.about.skills) {
      expect(within(main).getByRole('heading', { level: 3, name: g.group })).toBeInTheDocument()
      for (const item of g.items) expect(within(main).getByText(item)).toBeInTheDocument()
    }
    expect(within(main).getByText('Smart Money Concept')).toBeInTheDocument()
    expect(within(main).getByRole('heading', { name: c.ui.educationTitle })).toBeInTheDocument()
    for (const e of c.about.education) {
      expect(within(main).getByText(e.degree)).toBeInTheDocument()
      expect(within(main).getByText(e.school)).toBeInTheDocument()
    }
    await waitFor(() => expect(document.title).toBe(c.meta.aboutTitle))
  })

  it('shows contact links and no social links', async () => {
    await renderWithRouter(`/${lang}/about`)
    const main = await screen.findByRole('main')
    const wa = within(main).getByRole('link', { name: c.ui.whatsapp })
    expect(wa).toHaveAttribute('href', 'https://wa.me/6282184677520')
    expect(wa).toHaveAttribute('target', '_blank')
    expect(within(main).getByRole('link', { name: c.ui.email })).toHaveAttribute('href', 'mailto:ptbagusraditya@gmail.com')
    expect(c.about.socials).toEqual([])
    for (const name of ['X', 'LinkedIn', 'GitHub']) expect(within(main).queryByRole('link', { name })).toBeNull()
  })

  it('renders the experience timeline with current job first', async () => {
    await renderWithRouter(`/${lang}/about`)
    const main = await screen.findByRole('main')
    expect(within(main).getByRole('heading', { name: c.ui.experienceTitle })).toBeInTheDocument()
    const ol = main.querySelector('ol') as HTMLElement
    const items = within(ol).getAllByRole('listitem').filter((li) => li.parentElement === ol)
    expect(items).toHaveLength(c.about.experiences.length)
    expect(items[0]).toHaveTextContent('NoLimit Indonesia')
    c.about.experiences.forEach((e, i) => {
      expect(items[i]).toHaveTextContent(e.role)
      expect(items[i]).toHaveTextContent(e.company)
      expect(items[i]).toHaveTextContent(e.period)
    })
  })

  it('uses initials avatar and the closing CTA opens the free web app', async () => {
    await renderWithRouter(`/${lang}/about`)
    const main = await screen.findByRole('main')
    expect(main.querySelector('img')).toBeNull()
    expect(within(main).getByText('PB')).toBeInTheDocument()
    const cta = within(main).getByRole('link', { name: c.ui.aboutCta })
    expect(cta).toHaveAttribute('href', c.backtest.appUrl)
    expect(cta).toHaveAttribute('target', '_blank')
  })
})
