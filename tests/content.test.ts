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
  it('brand', () => expect(c.brand.name).toBe('ChartLab'))
  it('carries ChartLab only: no About, no services, no Disatu in the title', () => {
    expect(c).not.toHaveProperty('about')
    expect(c).not.toHaveProperty('services')
    expect(c.meta).not.toHaveProperty('aboutTitle')
    expect(c.meta.homeTitle).not.toMatch(/Disatu/)
  })
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
    expect(c.chartlab).not.toHaveProperty('appUrl') // the call to action is the embedded page now, not an external URL
    for (const s of strings(c.chartlab)) expect(s).not.toMatch(/example\.com/)
  })
  it('backtest video', () => {
    expect(c.chartlab.videoSrc).toBe('/assets/tutorial_backtest_v2.mp4')
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
    expect(en.chartlab.videoSrc).toBe(id.chartlab.videoSrc)
    expect(en.nav.map((x) => x.hash)).toEqual(id.nav.map((x) => x.hash))
    expect(en.workflow.steps.map((s) => [s.id, s.points.length])).toEqual(id.workflow.steps.map((s) => [s.id, s.points.length]))
    expect(en.chartlab.features.map((f) => f.icon)).toEqual(id.chartlab.features.map((f) => f.icon))
  })
})
