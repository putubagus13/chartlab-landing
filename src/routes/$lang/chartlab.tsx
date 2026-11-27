import { createFileRoute } from '@tanstack/react-router'
import { seoHead } from '@/seo/head'
import { SITE_URL } from '@/seo/site-url'
import { getContent } from '@/content'
import { isLang } from '@/i18n/lang'
import { ChartLabEmbed } from '@/components/chartlab/chartlab-embed'

export const Route = createFileRoute('/$lang/chartlab')({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : 'id'
    const { chartlabPage: p } = getContent(lang)
    return seoHead({ origin: SITE_URL, lang, sub: '/chartlab', title: p.title, description: p.description })
  },
  component: ChartLabEmbed,
})
