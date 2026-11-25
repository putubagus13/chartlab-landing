import { createFileRoute } from '@tanstack/react-router'
import { alternateLinks } from '@/i18n/alternates'
import { getContent } from '@/content'
import { isLang } from '@/i18n/lang'
import { Hero } from '@/components/sections/hero'
import { WorkflowSection } from '@/components/sections/workflow-section'
import { EbookSection } from '@/components/sections/ebook-section'
import { BacktestSection } from '@/components/sections/backtest-section'
import { OfferCta } from '@/components/sections/offer-cta'

export const Route = createFileRoute('/$lang/')({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : 'id'
    const { meta } = getContent(lang)
    return {
      meta: [
        { title: meta.homeTitle },
        { name: 'description', content: meta.homeDescription },
        { property: 'og:title', content: meta.homeTitle },
        { property: 'og:description', content: meta.homeDescription },
        { property: 'og:locale', content: lang === 'id' ? 'id_ID' : 'en_US' },
      ],
      links: alternateLinks(''),
    }
  },
  component: Home,
})

function Home() {
  return (
    <>
      <Hero />
      <WorkflowSection />
      <EbookSection />
      <BacktestSection />
      <OfferCta />
    </>
  )
}
