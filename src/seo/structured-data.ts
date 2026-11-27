// Schema.org data for the home page, built only from what the site itself says: ChartLab is a free web trading
// platform made by Disatu. Nothing is added that the page does not show: no ratings, reviews or social profiles.
// Disatu's @id is the one the Disatu site uses for itself, so the two sites describe one entity.
import type { Lang } from '@/i18n/lang'
import { LANGS } from '@/i18n/lang'
import type { SiteContent } from '@/content/types'

export function chartlabGraph(origin: string, lang: Lang, c: SiteContent, disatuOrigin: string): Record<string, unknown> {
  const disatu = { '@id': `${disatuOrigin}/#organization` }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', ...disatu, name: 'Disatu', url: `${disatuOrigin}/` },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: 'ChartLab',
        inLanguage: [...LANGS],
        publisher: disatu,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}/#app`,
        name: 'ChartLab',
        url: `${origin}/${lang}`,
        description: c.meta.homeDescription,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        inLanguage: lang,
        isAccessibleForFree: true,
        // every feature is free, so the price is 0 (the currency is required by the format, not meaningful at 0)
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        creator: disatu,
      },
    ],
  }
}
