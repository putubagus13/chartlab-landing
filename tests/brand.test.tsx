import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Logo } from '@/components/ui/logo'

const files = [
  'brand/disatu-horizontal-white.svg',
  'brand/disatu-horizontal-black.svg',
  'brand/disatu-symbol-white.svg',
  'brand/disatu-symbol-black.svg',
  'favicon.ico',
  'favicon-32.png',
  'favicon-180.png',
  'favicon-192.png',
  'favicon-512.png',
]

describe('brand', () => {
  it.each(files)('has public/%s', (f) => {
    expect(fs.existsSync(path.join('public', f))).toBe(true)
  })

  it('styles.css has brand tokens and dark variant', () => {
    const css = fs.readFileSync('src/styles.css', 'utf8').toLowerCase()
    expect(css).toContain('#124232')
    expect(css).toContain('#ffd33f')
    expect(css).toContain('@custom-variant dark')
  })

  it('Logo renders black + white pair by default', () => {
    const { container } = render(<Logo />)
    const imgs = container.querySelectorAll('img')
    expect(imgs).toHaveLength(2)
    const black = container.querySelector('img[src="/brand/disatu-horizontal-black.svg"]')!
    const white = container.querySelector('img[src="/brand/disatu-horizontal-white.svg"]')!
    expect(black.className).toContain('dark:hidden')
    expect(white.className).toContain('dark:block')
  })

  it('Logo onDark renders only the white one', () => {
    const { container } = render(<Logo onDark />)
    const imgs = container.querySelectorAll('img')
    expect(imgs).toHaveLength(1)
    expect(imgs[0].getAttribute('src')).toBe('/brand/disatu-horizontal-white.svg')
  })
})
