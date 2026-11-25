import { useParams } from '@tanstack/react-router'
import { getContent } from '@/content'
import { DEFAULT_LANG, isLang, type Lang } from './lang'

export function useLang(): Lang {
  const { lang } = useParams({ strict: false }) as { lang?: string }
  return isLang(lang) ? lang : DEFAULT_LANG
}

export function useContent() {
  return getContent(useLang())
}
