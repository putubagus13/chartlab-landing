import { describe, it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithRouter } from './utils'
import { LANGS } from '@/i18n/lang'
import { FEATURES } from '@/content/flags'

describe('e-book is hidden while the free web app is the focus', () => {
  it('flag is off', () => expect(FEATURES.ebook).toBe(false))

  describe.each(LANGS)('%s', (lang) => {
    it.each([['home', ''], ['about', '/about']])('%s page has no e-book promotion', async (_n, sub) => {
      await renderWithRouter(`/${lang}${sub}`)
      await waitFor(() => expect(document.querySelector('main')).not.toBeNull())
      expect(document.getElementById('ebook')).toBeNull()
      expect(document.body.textContent ?? '').not.toMatch(/e-?book/i)
      const hrefs = Array.from(document.querySelectorAll('a')).map((a) => a.getAttribute('href') ?? '')
      expect(hrefs.filter((h) => h.includes('#ebook'))).toEqual([])
      expect(hrefs.filter((h) => h.includes('checkout'))).toEqual([])
    })
  })
})
