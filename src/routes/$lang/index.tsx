import { createFileRoute } from '@tanstack/react-router'
import { seoHead } from '@/seo/head'
import { chartlabGraph } from '@/seo/structured-data'
import { SITE_URL } from '@/seo/site-url'
import { DISATU_URL } from '@/lib/site-links'
import { getContent } from '@/content'
import { isLang } from '@/i18n/lang'
import { Hero } from '@/components/sections/hero'
import { WorkflowSection } from '@/components/sections/workflow-section'
import { EbookSection } from '@/components/sections/ebook-section'
import { ChartLabSection } from '@/components/sections/chartlab-section'
import { OfferCta } from '@/components/sections/offer-cta'
import { FEATURES } from '@/content/flags'

export const Route = createFileRoute('/$lang/')({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : 'id'
    const c = getContent(lang)
    return seoHead({ origin: SITE_URL, lang, sub: '', title: c.meta.homeTitle, description: c.meta.homeDescription, jsonLd: chartlabGraph(SITE_URL, lang, c, DISATU_URL) })
  },
  component: Home,
})

function Home() {
  return (
    <>
      <Hero />
      <WorkflowSection />
      {FEATURES.ebook && <EbookSection />}
      <ChartLabSection />
      <OfferCta />
    </>
  )
}
