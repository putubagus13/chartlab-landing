// Where the other landing lives. The two sites (Disatu, ChartLab) find each other only through build-time env vars,
// never a hard-coded production URL. A production build without the var is stopped by vite-env-guard.ts.
import type { Lang } from '@/i18n/lang'

/**
 * Normalises a site URL from an env var: trimmed, no trailing slash, absolute http(s) only.
 * Unset or blank: the dev default in development, an error anywhere else.
 */
export function resolveSiteUrl(value: string | undefined, devDefault: string, isDev: boolean): string {
  const raw = (value ?? '').trim()
  if (!raw) {
    if (isDev) return devDefault
    throw new Error('Site URL is not set (see README: environment variables)')
  }
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error(`Site URL "${raw}" must be an absolute http(s) URL`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`Site URL "${raw}" must be an absolute http(s) URL`)
  }
  return (url.origin + url.pathname).replace(/\/+$/, '')
}

/** The Disatu company landing (VITE_DISATU_URL). Dev default: its local dev server on port 3001. */
export const DISATU_URL: string = resolveSiteUrl(
  import.meta.env.VITE_DISATU_URL as string | undefined,
  // only in dev builds, so the local URL never ends up in a production bundle
  import.meta.env.DEV ? 'http://localhost:3001' : '',
  import.meta.env.DEV,
)

export function disatuHref(lang: Lang): string {
  return `${DISATU_URL}/${lang}`
}
