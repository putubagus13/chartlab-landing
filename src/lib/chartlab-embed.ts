// How the landing talks to the ChartLab app it embeds in an <iframe> (the market-chart repo, deployed
// on its own). The protocol is two messages: this page sends `chartlab:set` (theme, language) and the
// app answers `chartlab:ready` once its shell is mounted. Origins are always checked, never trusted.
import { shared } from '@/content/shared'

export type EmbedTheme = 'dark' | 'light'
export type EmbedLang = 'id' | 'en'
export type ChartLabSet = { type: 'chartlab:set'; theme?: EmbedTheme; lang?: EmbedLang }

export const READY_TYPE = 'chartlab:ready'

/** Where the app lives. Override per environment, e.g. VITE_CHARTLAB_URL=http://localhost:5192 for local work. */
export const CHARTLAB_BASE: string = (import.meta.env.VITE_CHARTLAB_URL as string | undefined) || shared.chartlabUrl

/** The iframe URL: theme and language ride in the query so the very first paint is already right. */
export function chartlabEmbedUrl(base: string, p: { theme: EmbedTheme; lang: EmbedLang }): string {
  const url = new URL(base)
  url.searchParams.set('embed', '1')
  url.searchParams.set('theme', p.theme)
  url.searchParams.set('lang', p.lang)
  return url.toString()
}

/** True only for a message that came from the app's origin AND from our own iframe's window. */
export function isFromChartLab(event: { origin: string; source: unknown }, base: string, frame: Window | null): boolean {
  if (!frame || event.source !== frame) return false
  return event.origin === new URL(base).origin
}

export function chartlabPath(lang: EmbedLang): string {
  return `/${lang}/chartlab`
}
