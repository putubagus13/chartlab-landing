import { useContent } from '@/i18n/use-content'
import type { BacktestFeature } from '@/content/types'
import { LinkButton } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { SectionShell, Tag } from '@/components/ui/frame'
import { BacktestVideo } from './backtest-video'

const ICONS: Record<BacktestFeature['icon'], React.ReactNode> = {
  chart: <path d="M4 19V5M4 19h16M8 15l3-4 3 3 5-7" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  layers: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" />
    </>
  ),
}

function FeatureIcon({ icon }: { icon: BacktestFeature['icon'] }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[icon]}
    </svg>
  )
}

export function BacktestSection() {
  const { backtest, ui } = useContent()
  return (
    <SectionShell id="backtest" bg="dots">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Tag>{ui.freeBadge}</Tag>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{backtest.title}</h2>
          <p className="mt-4 text-lg text-muted">{backtest.subtitle}</p>
        </Reveal>

        <Reveal className="mt-12" delay={0.1}>
          <BacktestVideo />
        </Reveal>

        <Reveal className="mt-16" delay={0.1}>
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {backtest.features.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <FeatureIcon icon={f.icon} />
                </span>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm text-muted">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <LinkButton href={backtest.appUrl} external>
              {ui.openApp}
            </LinkButton>
          </div>
        </Reveal>

        <div className="mt-20">
          <h3 className="text-xl font-bold">{ui.howToGetAccess}</h3>
          <ol className="mt-6 grid gap-8 md:grid-cols-3">
            {backtest.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08}>
                <span aria-hidden="true" className="block h-0.5 w-12 bg-grad" />
                <span className="mt-4 block font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  )
}
