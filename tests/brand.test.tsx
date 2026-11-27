import fs from 'node:fs'
import path from 'node:path'
import { render, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Logo } from '@/components/ui/logo'
import { DisatuBadge } from '@/components/ui/disatu-badge'
import { Route as RootRoute } from '@/routes/__root'
import { renderWithRouter } from './utils'

const files = [
  'brand/chartlab-horizontal-color.svg',
  'brand/chartlab-horizontal-reverse-transparent.svg',
  'brand/chartlab-symbol-white.svg',
  'brand/badge-a-product-of-disatu-light.svg',
  'brand/badge-a-product-of-disatu-dark.svg',
  'favicon.ico',
  'chartlab-favicon.svg',
  'chartlab-favicon-16.png',
  'chartlab-favicon-32.png',
  'chartlab-favicon-48.png',
  'chartlab-favicon-180.png',
  'chartlab-favicon-192.png',
  'chartlab-favicon-512.png',
  'og-image.png',
]

describe('ChartLab brand', () => {
  it.each(files)('has public/%s', (f) => {
    expect(fs.existsSync(path.join('public', f))).toBe(true)
  })

  it('carries no Disatu logo files any more', () => {
    expect(fs.readdirSync('public/brand').filter((f) => f.startsWith('disatu-'))).toEqual([])
    expect(fs.existsSync('public/favicon-32.png')).toBe(false)
  })

  it('styles.css has brand tokens and dark variant', () => {
    const css = fs.readFileSync('src/styles.css', 'utf8').toLowerCase()
    expect(css).toContain('#124232')
    expect(css).toContain('#ffd33f')
    expect(css).toContain('@custom-variant dark')
  })

  it('Logo renders the colour logo on light and the reverse logo on dark, at least 110 px wide', () => {
    const { container } = render(<Logo />)
    const imgs = container.querySelectorAll('img[alt="ChartLab"]')
    expect(imgs).toHaveLength(2)
    const light = container.querySelector('img[src="/brand/chartlab-horizontal-color.svg"]')!
    const dark = container.querySelector('img[src="/brand/chartlab-horizontal-reverse-transparent.svg"]')!
    expect(light.className).toContain('dark:hidden')
    expect(dark.className).toContain('hidden')
    expect(dark.className).toContain('dark:block')
    for (const img of [light, dark]) expect(img.className).toMatch(/\bw-(3[2-9]|[4-9]\d)\b/) // w-32 = 128 px
  })

  it('DisatuBadge links to the Disatu landing in the visitor language, with a badge per theme', () => {
    const { container } = render(<DisatuBadge lang="en" />)
    const links = container.querySelectorAll('a')
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('href')).toBe('http://localhost:3001/en')
    const light = container.querySelector('img[src="/brand/badge-a-product-of-disatu-light.svg"]')!
    const dark = container.querySelector('img[src="/brand/badge-a-product-of-disatu-dark.svg"]')!
    expect(light.getAttribute('alt')).toBe('a product of disatu')
    expect(dark.getAttribute('alt')).toBe('a product of disatu')
    expect(light.className).toContain('dark:hidden')
    expect(dark.className).toContain('dark:block')
    for (const img of [light, dark]) expect(img.className).toMatch(/\bh-(7|8|9|10)\b/) // >= 28 px
  })

  it.each(['id', 'en'] as const)('the %s page carries exactly one Disatu endorsement, and no Disatu logo', async (lang) => {
    await renderWithRouter(`/${lang}`)
    await waitFor(() => expect(document.querySelector('footer')).not.toBeNull())
    const toDisatu = document.querySelectorAll('a[href^="http://localhost:3001"]')
    expect(toDisatu).toHaveLength(1)
    expect(toDisatu[0].getAttribute('href')).toBe(`http://localhost:3001/${lang}`)
    expect(document.querySelector('img[src*="chartlab-endorsed"]')).toBeNull()
    expect(document.querySelector('img[src*="disatu-horizontal"]')).toBeNull()
  })

  it('head uses the ChartLab favicons, site name and OG image', () => {
    const head = (RootRoute.options.head as () => { meta: Record<string, string>[]; links: Record<string, string>[] })()
    const hrefs = head.links.map((l) => l.href)
    expect(hrefs).toEqual(expect.arrayContaining(['/favicon.ico', '/chartlab-favicon-32.png', '/chartlab-favicon-180.png']))
    const prop = (p: string) => head.meta.find((m) => m.property === p)?.content
    expect(prop('og:site_name')).toBe('ChartLab')
    expect(prop('og:image')).toBe('/og-image.png')
  })
})
