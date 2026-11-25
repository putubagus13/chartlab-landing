import { useContent, useLang } from '@/i18n/use-content'
import { LinkButton } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { Frame, SectionShell } from '@/components/ui/frame'

export function OfferCta() {
  const lang = useLang()
  const { offer, ui } = useContent()
  return (
    <SectionShell id="offer" edge="none">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <Frame tone="accent">
            <div className="border border-border bg-surface p-8 text-center sm:p-14">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{offer.title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{offer.subtitle}</p>
              <div className="mt-8">
                <LinkButton href={`/${lang}#ebook`}>{ui.buyEbook}</LinkButton>
              </div>
            </div>
          </Frame>
        </Reveal>
      </div>
    </SectionShell>
  )
}
