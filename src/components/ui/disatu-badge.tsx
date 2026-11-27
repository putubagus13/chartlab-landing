import type { Lang } from '@/i18n/lang'
import { disatuHref } from '@/lib/site-links'

// The one Disatu endorsement on a ChartLab screen (brand kit: one marker per screen). The kit's badge files carry the
// "a product of disatu" lettering, so it is never re-typeset here. Light pill on light, green pill on dark.
export function DisatuBadge({ lang }: { lang: Lang }) {
  return (
    <a href={disatuHref(lang)} className="inline-flex shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2">
      <img src="/brand/badge-a-product-of-disatu-light.svg" alt="a product of disatu" className="h-8 w-auto dark:hidden" />
      <img src="/brand/badge-a-product-of-disatu-dark.svg" alt="a product of disatu" className="hidden h-8 w-auto dark:block" />
    </a>
  )
}
