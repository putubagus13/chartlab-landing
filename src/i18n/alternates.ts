import { LANGS } from './lang'

// hreflang alternates for a page path below the lang segment ('' or '/about').
export function alternateLinks(subPath: '' | '/about') {
  return [
    ...LANGS.map((l) => ({ rel: 'alternate', hreflang: l, href: `/${l}${subPath}` })),
    { rel: 'alternate', hreflang: 'x-default', href: `/id${subPath}` },
  ]
}
