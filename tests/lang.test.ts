import { describe, it, expect } from 'vitest'
import { isLang, swapLangInPath, LANGS, DEFAULT_LANG } from '@/i18n/lang'

describe('lang', () => {
  it('constants', () => {
    expect(LANGS).toEqual(['id', 'en'])
    expect(DEFAULT_LANG).toBe('id')
  })
  it('isLang', () => {
    expect(isLang('en')).toBe(true)
    expect(isLang('fr')).toBe(false)
    expect(isLang(undefined)).toBe(false)
  })
  it('swapLangInPath', () => {
    expect(swapLangInPath('/id/about', 'en')).toBe('/en/about')
    expect(swapLangInPath('/id', 'en')).toBe('/en')
    expect(swapLangInPath('/en/', 'id')).toBe('/id/')
  })
})
