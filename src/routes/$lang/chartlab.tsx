import { createFileRoute } from '@tanstack/react-router'
import { alternateLinks } from '@/i18n/alternates'
import { getContent } from '@/content'
import { isLang } from '@/i18n/lang'
import { ChartLabEmbed } from '@/components/chartlab/chartlab-embed'

export const Route = createFileRoute('/$lang/chartlab')({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : 'id'
    const { chartlabPage: p } = getContent(lang)
    return {
      meta: [
        { title: p.title },
        { name: 'description', content: p.description },
        { property: 'og:title', content: p.title },
        { property: 'og:description', content: p.description },
        { property: 'og:locale', content: lang === 'id' ? 'id_ID' : 'en_US' },
      ],
      links: alternateLinks('/chartlab'),
    }
  },
  component: ChartLabEmbed,
})
