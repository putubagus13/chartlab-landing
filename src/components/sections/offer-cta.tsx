import { useContent, useLang } from '@/i18n/use-content'
import { LinkButton } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'

export function OfferCta() {
  const lang = useLang()
  const { offer, ui } = useContent()
  return (
    <section id="offer" className="bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="rounded-3xl border-2 border-accent bg-surface p-8 text-center shadow-[0_0_64px_-16px_var(--accent)] sm:p-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{offer.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{offer.subtitle}</p>
          <div className="mt-8">
            <LinkButton href={`/${lang}#ebook`}>{ui.buyEbook}</LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
