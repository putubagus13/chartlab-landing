import { describe, it, expect } from 'vitest'
import { LANGS } from '@/i18n/lang'
import { getContent } from '@/content'

function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v)
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out))
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out))
  return out
}
function shape(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shape)
  if (v && typeof v === 'object')
    return Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, shape(x)]))
  return typeof v
}

describe.each(LANGS)('content %s', (lang) => {
  const c = getContent(lang)
  it('brand', () => expect(c.brand.name).toBe('Disatu'))
  it('packages', () => {
    expect(c.ebook.packages.length).toBeGreaterThanOrEqual(1)
    for (const p of c.ebook.packages) {
      expect(p.includesBacktestAccess).toBe(true)
      expect(p.price).toBeGreaterThan(0)
      if (p.originalPrice !== undefined) expect(p.originalPrice).toBeGreaterThan(p.price)
      expect(new URL(p.checkoutUrl).protocol).toBe('https:')
    }
    expect(c.ebook.packages.filter((p) => p.highlighted)).toHaveLength(1)
    const ids = c.ebook.packages.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('urls are https', () => {
    expect(new URL(c.backtest.appUrl).protocol).toBe('https:')
    for (const s of c.about.socials) expect(new URL(s.url).protocol).toBe('https:')
  })
  it('about has experiences', () => expect(c.about.experiences.length).toBeGreaterThanOrEqual(1))
  it('about facts', () => {
    expect(c.about.name).toBe('Putu Bagus Raditya')
    expect(c.about.contact).toEqual({ phone: '+6282184677520', email: 'ptbagusraditya@gmail.com' })
    expect(c.about.skills.flatMap((g) => g.items)).toHaveLength(22)
    expect(c.about.experiences[0].company).toBe('NoLimit Indonesia')
    expect(c.about.education).toHaveLength(1)
    expect(c.about.socials).toEqual([])
  })
  it('services and backtest video', () => {
    expect(c.services.items).toHaveLength(2)
    expect(c.backtest.videoSrc).toBe('/assets/tutorial_backtest_v2.mp4')
  })
  it('no empty strings', () => {
    for (const s of strings(c)) expect(s.trim()).not.toBe('')
  })
})

describe('locale parity', () => {
  const id = getContent('id')
  const en = getContent('en')
  it('same shape', () => expect(shape(en)).toEqual(shape(id)))
  it('same non-text data', () => {
    const pk = (c: typeof id) => c.ebook.packages.map((p) => [p.id, p.price, p.originalPrice, p.checkoutUrl, p.highlighted])
    expect(pk(en)).toEqual(pk(id))
    expect(en.backtest.appUrl).toBe(id.backtest.appUrl)
    expect(en.about.socials.map((s) => s.url)).toEqual(id.about.socials.map((s) => s.url))
    expect(en.about.contact).toEqual(id.about.contact)
    expect(en.about.skills.map((g) => g.items)).toEqual(id.about.skills.map((g) => g.items))
    expect(en.services.items.map((i) => i.icon)).toEqual(id.services.items.map((i) => i.icon))
    expect(en.backtest.videoSrc).toBe(id.backtest.videoSrc)
    expect(en.nav.map((x) => [x.page, x.hash])).toEqual(id.nav.map((x) => [x.page, x.hash]))
    expect(en.workflow.steps.map((s) => [s.id, s.points.length])).toEqual(id.workflow.steps.map((s) => [s.id, s.points.length]))
    expect(en.backtest.features.map((f) => f.icon)).toEqual(id.backtest.features.map((f) => f.icon))
  })
})
