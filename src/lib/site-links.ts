// Where the other landing lives. The two sites (Disatu, ChartLab) find each other only through build-time env vars,
// never a hard-coded production URL. A production build without the var is stopped by vite-env-guard.ts.
import type { Lang } from '@/i18n/lang'
import { resolveSiteUrl } from './resolve-site-url'

export { resolveSiteUrl }

/** The Disatu company landing (VITE_DISATU_URL). Dev default: its local dev server on port 3001. */
export const DISATU_URL: string = resolveSiteUrl(
  import.meta.env.VITE_DISATU_URL as string | undefined,
  // only in dev builds, so the local URL never ends up in a production bundle
  import.meta.env.DEV ? 'http://localhost:3001' : '',
  import.meta.env.DEV,
  'VITE_DISATU_URL',
)

export function disatuHref(lang: Lang): string {
  return `${DISATU_URL}/${lang}`
}
