import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { INDEXABLE_PAGES } from '@/seo/pages'
import { buildSitemap } from '@/seo/sitemap'
import { buildRobots } from '@/seo/robots'
import { seoHead, jsonLdScript } from '@/seo/head'
import { chartlabGraph } from '@/seo/structured-data'
import { getContent } from '@/content'
import { LANGS } from '@/i18n/lang'

const ORIGIN = 'https://www.example.com'

describe('buildSitemap', () => {
  const xml = buildSitemap(ORIGIN, ['', '/chartlab'], LANGS)
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]!)

  it('is a urlset with the hreflang namespace', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">')
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true)
  })

  it('lists every page in every language, as absolute URLs', () => {
    const locs = urls.map((u) => /<loc>(.*?)<\/loc>/.exec(u)![1])
    expect(locs).toEqual([`${ORIGIN}/id`, `${ORIGIN}/en`, `${ORIGIN}/id/chartlab`, `${ORIGIN}/en/chartlab`])
  })

  it('gives each URL the full set of language alternates, itself included, plus x-default', () => {
    for (const u of urls) {
      const links = [...u.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)].map((m) => `${m[1]}=${m[2]}`)
      expect(links).toHaveLength(3)
      expect(links.some((l) => l.startsWith('x-default='))).toBe(true)
    }
    expect(urls[0]).toContain(`hreflang="en" href="${ORIGIN}/en"`)
    expect(urls[0]).toContain(`hreflang="x-default" href="${ORIGIN}/id"`)
    expect(urls[3]).toContain(`hreflang="id" href="${ORIGIN}/id/chartlab"`)
  })

  it('carries no lastmod: a date nobody maintains would only mislead crawlers', () => {
    expect(xml).not.toContain('<lastmod>')
  })

  it('escapes characters that are special in XML', () => {
    const out = buildSitemap('https://x.test', ['/a&b'], ['id'])
    expect(out).toContain('/id/a&amp;b')
    expect(out).not.toContain('/id/a&b<')
  })
})

describe('buildRobots', () => {
  it('lets every crawler in and points at the sitemap on the site origin', () => {
    expect(buildRobots(ORIGIN)).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`)
  })
})

describe('seoHead', () => {
  const head = seoHead({ origin: ORIGIN, lang: 'en', sub: '/chartlab', title: 'About', description: 'About us' })
  const meta = (key: string, attr: 'name' | 'property' = 'property') => head.meta.filter((m) => (m as Record<string, string>)[attr] === key).map((m) => (m as Record<string, string>).content)

  it('has one self-referencing absolute canonical', () => {
    const canon = head.links.filter((l) => l.rel === 'canonical')
    expect(canon).toEqual([{ rel: 'canonical', href: `${ORIGIN}/en/chartlab` }])
  })

  it('has absolute hreflang alternates for both languages and x-default', () => {
    const alt = head.links.filter((l) => l.rel === 'alternate').map((l) => `${l.hrefLang}=${l.href}`)
    expect(alt).toEqual([`id=${ORIGIN}/id/chartlab`, `en=${ORIGIN}/en/chartlab`, `x-default=${ORIGIN}/id/chartlab`])
  })

  it('sets title and description for search, and the same for sharing', () => {
    expect(head.meta).toContainEqual({ title: 'About' })
    expect(meta('description', 'name')).toEqual(['About us'])
    expect(meta('og:title')).toEqual(['About'])
    expect(meta('og:description')).toEqual(['About us'])
    expect(meta('twitter:title', 'name')).toEqual(['About'])
  })

  it('describes the page for link previews with absolute URLs and a large image card', () => {
    expect(meta('og:url')).toEqual([`${ORIGIN}/en/chartlab`])
    expect(meta('og:type')).toEqual(['website'])
    expect(meta('og:image')).toEqual([`${ORIGIN}/og-image.png`])
    expect(meta('og:image:width')).toEqual(['1200'])
    expect(meta('og:image:height')).toEqual(['630'])
    expect(meta('twitter:card', 'name')).toEqual(['summary_large_image'])
    expect(meta('twitter:image', 'name')).toEqual([`${ORIGIN}/og-image.png`])
  })

  it('names the locale and the other one', () => {
    expect(meta('og:locale')).toEqual(['en_US'])
    expect(meta('og:locale:alternate')).toEqual(['id_ID'])
    const id = seoHead({ origin: ORIGIN, lang: 'id', sub: '', title: 't', description: 'd' })
    expect(id.meta.filter((m) => (m as Record<string, string>).property === 'og:locale').map((m) => (m as Record<string, string>).content)).toEqual(['id_ID'])
  })

  it('adds structured data only when given', () => {
    expect(head.scripts ?? []).toEqual([])
    const withLd = seoHead({ origin: ORIGIN, lang: 'en', sub: '', title: 't', description: 'd', jsonLd: { '@context': 'https://schema.org', '@type': 'Thing' } })
    expect(withLd.scripts).toHaveLength(1)
    expect(withLd.scripts![0]).toMatchObject({ type: 'application/ld+json' })
  })
})

describe('jsonLdScript', () => {
  it('cannot be closed early by text inside the data', () => {
    const s = jsonLdScript({ name: '</script><script>alert(1)</script>' })
    expect(s.children).not.toContain('</script>')
    expect(JSON.parse(s.children as string).name).toBe('</script><script>alert(1)</script>')
  })
})

describe.each(LANGS)('chartlabGraph %s', (lang) => {
  const c = getContent(lang)
  const DISATU = 'https://www.disatu.test'
  const graph = chartlabGraph(ORIGIN, lang, c, DISATU)
  const nodes = graph['@graph'] as Array<Record<string, unknown>>
  const app = nodes.find((n) => n['@type'] === 'SoftwareApplication')!
  const site = nodes.find((n) => n['@type'] === 'WebSite')!
  const org = nodes.find((n) => n['@type'] === 'Organization')!

  it('describes ChartLab as a free web application made by Disatu', () => {
    expect(graph['@context']).toBe('https://schema.org')
    expect(app.name).toBe('ChartLab')
    expect(app.url).toBe(`${ORIGIN}/${lang}`)
    expect(app.operatingSystem).toBe('Web')
    expect(app.isAccessibleForFree).toBe(true)
    expect(app.offers).toMatchObject({ price: '0' })
    expect(app.description).toBe(c.meta.homeDescription)
    expect(app.creator).toEqual({ '@id': `${DISATU}/#organization` })
    expect(site.publisher).toEqual({ '@id': `${DISATU}/#organization` })
  })

  it('uses the id the Disatu site gives itself, so the two sites describe one company', () => {
    expect(org['@id']).toBe(`${DISATU}/#organization`)
    expect(org.url).toBe(`${DISATU}/`)
  })

  it('invents nothing: no ratings, reviews or social profiles', () => {
    const text = JSON.stringify(graph)
    for (const key of ['aggregateRating', 'review', 'sameAs']) expect(text).not.toContain(`"${key}"`)
  })
})

describe('what search engines are pointed at', () => {
  it('lists the home page and the app page', () => {
    expect([...INDEXABLE_PAGES]).toEqual(['', '/chartlab'])
  })

  it('ships a 1200x630 share image that the head tags promise', () => {
    const png = readFileSync('public/og-image.png')
    expect(png.subarray(1, 4).toString()).toBe('PNG')
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630])
  })

  it('keeps titles and descriptions short enough not to be cut off in results', () => {
    for (const lang of LANGS) {
      const c = getContent(lang)
      for (const d of [c.meta.homeDescription, c.chartlabPage.description]) expect(d.length).toBeLessThanOrEqual(160)
      for (const t of [c.meta.homeTitle, c.chartlabPage.title]) expect(t.length).toBeLessThanOrEqual(60)
    }
  })
})
