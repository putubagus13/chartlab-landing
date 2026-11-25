export type Lang = 'id' | 'en'
export const LANGS: readonly Lang[] = ['id', 'en']
export const DEFAULT_LANG: Lang = 'id'

export function isLang(v: unknown): v is Lang {
  return v === 'id' || v === 'en'
}

export function swapLangInPath(pathname: string, to: Lang): string {
  return pathname.replace(/^\/(id|en)(?=\/|$)/, `/${to}`)
}
