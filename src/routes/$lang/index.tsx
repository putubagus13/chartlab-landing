import { createFileRoute } from '@tanstack/react-router'
import { alternateLinks } from '@/i18n/alternates'
import { Hero } from '@/components/sections/hero'
import { EbookSection } from '@/components/sections/ebook-section'
import { BacktestSection } from '@/components/sections/backtest-section'

export const Route = createFileRoute('/$lang/')({
  head: () => ({ links: alternateLinks('') }),
  component: () => (
    <>
      <Hero />
      <EbookSection />
      <BacktestSection />
    </>
  ),
})
