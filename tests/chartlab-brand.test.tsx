import { describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

// The product is called ChartLab, a free trading platform whose standouts are: free, backtesting with
// statistics, and a best-R:R recommendation. These tests keep that message consistent across the site.

const OLD_NAME = /web app backtest|backtest web app|aplikasi backtest|backtest app/i
const GUARANTEES = /garansi|dijamin|pasti (?:profit|untung|cuan)|guarantee|risk-free|bebas risiko|tanpa risiko/i

function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v)
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out))
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out))
  return out
}

describe.each(LANGS)('ChartLab positioning %s', (lang) => {
  const c = getContent(lang)

  it('puts the name ChartLab on the title, the hero, the nav, the section and the closing offer', () => {
    expect(c.meta.homeTitle).toContain('ChartLab')
    expect(c.hero.eyebrow).toContain('ChartLab')
    expect(c.nav.some((n) => n.label === 'ChartLab' && n.hash === 'chartlab')).toBe(true)
    expect(c.chartlab.title + c.chartlab.subtitle).toContain('ChartLab')
    expect(c.offer.subtitle).toContain('ChartLab')
    expect(c.about.company.intro).toContain('ChartLab')
    expect(c.ui.openApp).toContain('ChartLab')
    expect(c.ui.tryFree).toContain('ChartLab')
  })

  it('leads with the two differentiators: it is free, and it has backtesting', () => {
    const hero = `${c.hero.title} ${c.hero.subtitle}`
    expect(hero).toMatch(/gratis|free/i)
    expect(hero).toMatch(/backtest/i)
    expect(c.hero.bundleNote).toMatch(/gratis|free/i)
    expect(c.ui.freeBadge).toMatch(/gratis|free/i)
    expect(c.meta.homeTitle).toMatch(/gratis|free/i)
    expect(c.meta.homeDescription).toMatch(/gratis|free/i)
  })

  it('lists the three standout features: backtesting, its statistics, and the best-R:R recommendation', () => {
    const titles = c.chartlab.features.map((f) => f.title)
    expect(titles.some((t) => /backtest/i.test(t))).toBe(true)
    expect(titles.some((t) => /statistik|statistic/i.test(t))).toBe(true)
    expect(titles.some((t) => /R:R/.test(t))).toBe(true)
    // and they come first
    expect(titles.slice(0, 3).join(' ')).toMatch(/backtest/i)
    expect(titles.slice(0, 3).join(' ')).toMatch(/R:R/)
  })

  it('never uses the old product name and never promises profit', () => {
    for (const s of strings(c)) {
      expect(s).not.toMatch(OLD_NAME)
      // a disclaimer ("past results are no guarantee") is the opposite of a promise, so it is allowed
      expect(s.replace(/\b(?:no|not a|bukan)\s+(?:guarantee|jaminan)/gi, '')).not.toMatch(GUARANTEES)
    }
  })

  it('every call to action that opens the platform names it', () => {
    expect(c.ui.openApp).toMatch(/ChartLab/)
    expect(c.ui.tryFree).toMatch(/ChartLab/)
    expect(c.ui.aboutCta).toMatch(/ChartLab/)
  })
})

describe.each(LANGS)('ChartLab on the page %s', (lang) => {
  it.each([['home', ''], ['about', '/about']])('%s page shows the name and never the old one', async (_n, sub) => {
    await renderWithRouter(`/${lang}${sub}`)
    await waitFor(() => expect(document.querySelector('main')).not.toBeNull())
    const text = document.body.textContent ?? ''
    expect(text).toContain('ChartLab')
    expect(text).not.toMatch(OLD_NAME)
  })
})
