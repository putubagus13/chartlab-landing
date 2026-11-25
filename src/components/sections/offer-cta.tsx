import { useContent } from '@/i18n/use-content'
import { LinkButton } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { Brackets, SectionShell } from '@/components/ui/frame'

export function OfferCta() {
  const { offer, ui, backtest } = useContent()
  return (
    <SectionShell id="offer" bg="center" edge="none">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="card-grad relative p-8 text-center sm:p-14">
          <Brackets tone="accent" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{offer.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{offer.subtitle}</p>
          <div className="mt-8">
            <LinkButton href={backtest.appUrl} external>
              {ui.openApp}
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
