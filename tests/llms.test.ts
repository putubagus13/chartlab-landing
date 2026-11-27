import { describe, it, expect } from 'vitest'
import { buildLlmsTxt } from '@/seo/llms'
import { INDEXABLE_PAGES } from '@/seo/pages'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

const ORIGIN = 'https://chartlab.example.com'
const DISATU = 'https://www.disatu.example.com'
const content = { id: getContent('id'), en: getContent('en') }
const txt = buildLlmsTxt(ORIGIN, content, DISATU)
const lines = txt.split('\n')
const links = [...txt.matchAll(/^- \[([^\]]+)\]\(([^)]+)\)(?:: (.+))?$/gm)].map((m) => ({ text: m[1]!, url: m[2]!, desc: m[3] }))

describe('llms.txt', () => {
  it('opens with the product name, a quoted summary in both languages, and who makes it', () => {
    expect(lines[0]).toBe('# ChartLab')
    expect(lines[2]).toBe(`> ${content.id.meta.homeDescription}`)
    expect(lines[3]).toBe(`> ${content.en.meta.homeDescription}`)
    expect(txt).toContain('made by Disatu')
    expect(txt).toContain(content.en.footer.note) // the educational, not-financial-advice note travels with it
    expect(txt.endsWith('\n')).toBe(true)
  })

  it('has its file lists under H2 headings, with the optional links last', () => {
    const h2 = lines.filter((l) => l.startsWith('## '))
    expect(h2).toEqual(['## Pages', '## Optional'])
  })

  it('lists every indexable page in both languages with the words the site uses', () => {
    for (const lang of LANGS) {
      const c = content[lang]
      expect(links.find((l) => l.url === `${ORIGIN}/${lang}`)).toMatchObject({ text: c.meta.homeTitle, desc: c.meta.homeDescription })
      expect(links.find((l) => l.url === `${ORIGIN}/${lang}/chartlab`)).toMatchObject({ text: c.chartlabPage.title, desc: c.chartlabPage.description })
    }
  })

  it('links only to absolute pages that exist: this site, its sitemap, and the Disatu site', () => {
    const allowedPaths = new Set(['/sitemap.xml', ...LANGS.flatMap((l) => INDEXABLE_PAGES.map((p) => `/${l}${p}`))])
    for (const { url } of links) {
      const u = new URL(url) // throws on a relative URL
      if (u.origin === new URL(DISATU).origin) continue
      expect(u.origin, url).toBe(ORIGIN)
      expect(allowedPaths.has(u.pathname), url).toBe(true)
    }
  })

  it('never links the same address twice (each link is one resource)', () => {
    const urls = links.map((l) => l.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('keeps local addresses and placeholders out', () => {
    for (const bad of ['localhost', 'undefined', '[object']) expect(txt).not.toContain(bad)
  })
})
