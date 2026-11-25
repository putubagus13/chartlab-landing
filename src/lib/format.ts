import type { Lang } from '@/i18n/lang'

export function formatIDR(amount: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}
