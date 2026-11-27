import { describe, it, expect } from 'vitest'
import { resolveSiteUrl, disatuHref } from '@/lib/site-links'

describe('resolveSiteUrl', () => {
  it('strips a trailing slash', () => {
    expect(resolveSiteUrl('https://disatu-landing.vercel.app/', 'http://localhost:3001', false)).toBe('https://disatu-landing.vercel.app')
  })
  it('trims surrounding spaces', () => {
    expect(resolveSiteUrl('  https://a.vercel.app  ', 'x', false)).toBe('https://a.vercel.app')
  })
  it('falls back to the dev default in development when unset or blank', () => {
    expect(resolveSiteUrl(undefined, 'http://localhost:3001', true)).toBe('http://localhost:3001')
    expect(resolveSiteUrl('', 'http://localhost:3001', true)).toBe('http://localhost:3001')
  })
  it('rejects a value without a scheme, or a non-http scheme', () => {
    expect(() => resolveSiteUrl('disatu.vercel.app', 'x', false)).toThrow(/absolute http/)
    expect(() => resolveSiteUrl('javascript:alert(1)', 'x', false)).toThrow(/absolute http/)
  })
  it('refuses to guess outside development', () => {
    expect(() => resolveSiteUrl(undefined, 'x', false)).toThrow(/not set/)
  })
})

describe('disatuHref', () => {
  it('keeps the visitor language (dev default in tests)', () => {
    expect(disatuHref('en')).toBe('http://localhost:3001/en')
    expect(disatuHref('id')).toBe('http://localhost:3001/id')
  })
})
