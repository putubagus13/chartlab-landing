// /llms.txt: a short map of the site's public pages for tools that choose to read it. Built from the same content files
// as the pages, so it cannot drift from them, and it lists only pages that exist (see pages.ts). It is a guide, not an
// access rule: what crawlers may fetch stays in robots.txt. No local or private addresses.
import type { Lang } from '@/i18n/lang'
import type { SiteContent } from '@/content/types'

export function buildLlmsTxt(origin: string, content: Record<Lang, SiteContent>, disatuUrl: string): string {
  const { id, en } = content
  const link = (text: string, url: string, desc?: string): string => `- [${text}](${url})${desc ? `: ${desc}` : ''}`
  const pages = (['id', 'en'] as const).flatMap((lang) => {
    const c = content[lang]
    return [link(c.meta.homeTitle, `${origin}/${lang}`, c.meta.homeDescription), link(c.chartlabPage.title, `${origin}/${lang}/chartlab`, c.chartlabPage.description)]
  })
  return (
    [
      '# ChartLab',
      '',
      `> ${id.meta.homeDescription}`,
      `> ${en.meta.homeDescription}`,
      '',
      `ChartLab is made by Disatu. Every page is available in Indonesian (the default) and English. ${en.footer.note}`,
      '',
      '## Pages',
      '',
      ...pages,
      '',
      '## Optional',
      '',
      link('Disatu', `${disatuUrl}/en`, 'The company that builds ChartLab.'),
      link('Sitemap', `${origin}/sitemap.xml`, 'Every page in both languages, with language alternates.'),
    ].join('\n') + '\n'
  )
}
