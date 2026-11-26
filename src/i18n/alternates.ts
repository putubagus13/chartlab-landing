import { LANGS } from './lang'

// hreflang alternates for a page path below the lang segment ('', '/about', '/chartlab').
export function alternateLinks(subPath: '' | '/about' | '/chartlab') {
  return [
    ...LANGS.map((l) => ({ rel: 'alternate', hrefLang: l, href: `/${l}${subPath}` })),
    { rel: 'alternate', hrefLang: 'x-default', href: `/id${subPath}` },
  ]
}
