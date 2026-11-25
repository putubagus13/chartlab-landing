import { describe, it, expect, beforeEach, vi } from 'vitest'
import { resolveTheme, applyTheme, themeInitScript, THEME_KEY } from '@/theme/theme'

function mockDark(dark: boolean) {
  window.matchMedia = ((q: string) => ({ matches: dark && q.includes('dark'), media: q, addEventListener() {}, removeEventListener() {} })) as never
}

beforeEach(() => {
  document.documentElement.classList.remove('dark')
  localStorage.clear()
  mockDark(false)
})

describe('theme', () => {
  it('resolveTheme', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
  it('init script: saved dark', () => {
    localStorage.setItem(THEME_KEY, 'dark')
    new Function(themeInitScript)()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
  it('init script: saved light beats OS dark', () => {
    mockDark(true)
    localStorage.setItem(THEME_KEY, 'light')
    new Function(themeInitScript)()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
  it('init script: no saved value follows OS', () => {
    mockDark(true)
    new Function(themeInitScript)()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
  it('init script survives throwing localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => new Function(themeInitScript)()).not.toThrow()
    spy.mockRestore()
  })
  it('applyTheme saves and sets class', () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem(THEME_KEY)).toBe('light')
  })
})
