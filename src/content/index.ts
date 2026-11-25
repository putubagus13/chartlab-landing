import type { Lang } from '@/i18n/lang'
import type { SiteContent } from './types'
import { siteId } from './site.id'
import { siteEn } from './site.en'

export function getContent(lang: Lang): SiteContent {
  return lang === 'en' ? siteEn : siteId
}
export type { SiteContent } from './types'
