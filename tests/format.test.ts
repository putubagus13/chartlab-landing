import { describe, it, expect } from 'vitest'
import { formatIDR } from '@/lib/format'

const n = (s: string) => s.replace(/\s/g, ' ')

describe('formatIDR', () => {
  it('formats id', () => expect(n(formatIDR(149000, 'id'))).toBe('Rp 149.000'))
  it('formats en', () => expect(n(formatIDR(149000, 'en'))).toBe('IDR 149,000'))
})
