import { motion } from 'framer-motion'
import { useMotionEnabled } from '@/components/motion/use-motion-enabled'
import { useContent, useLang } from '@/i18n/use-content'
import type { BacktestFeature } from '@/content/types'
import { LinkButton } from '@/components/ui/button'
import { AppLink } from '@/components/ui/app-link'
import { Reveal } from '@/components/motion/reveal'
import { Frame, SectionShell, Tag } from '@/components/ui/frame'

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

function AppPreview() {
  const enabled = useMotionEnabled()
  const { backtest, ui } = useContent()
  const line = 'M0 150 L40 140 L80 148 L120 120 L160 126 L200 96 L240 104 L280 70 L320 78 L360 40 L400 30'
  return (
    <div className="overflow-hidden border border-border bg-[#0a0a0a]">
      <div className="flex items-center gap-1.5 border-b border-[#262626] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#262626]" />
        <span className="ml-3 rounded bg-[#141414] px-3 py-0.5 font-mono text-[11px] text-[#a1a1a1]">BTC/USDT · 1D</span>
      </div>
      <div className="p-4">
        <svg viewBox="0 0 400 180" className="w-full" role="img" aria-label={ui.sampleData}>
          {[30, 70, 110, 150].map((y) => (
            <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#262626" strokeWidth="1" />
          ))}
          <path d={`${line} L400 180 L0 180 Z`} fill="#3fa37f" opacity="0.12" />
          <motion.path
            key={enabled ? 'motion' : 'static'}
            d={line}
            fill="none"
            stroke="#3fa37f"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={enabled ? { pathLength: 0 } : false}
            whileInView={enabled ? { pathLength: 1 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          />
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {backtest.stats.map((s) => (
            <div key={s.label} className="border border-[#262626] bg-[#141414] p-3">
              <p className="text-[11px] text-[#a1a1a1]">{s.label}</p>
              <p className="font-display text-lg font-bold text-[#f5f5f5]">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-right font-mono text-[10px] text-[#a1a1a1]">{ui.sampleData}</p>
      </div>
    </div>
  )
}

export function BacktestSection() {
  const lang = useLang()
  const { backtest, ui } = useContent()
  return (
    <SectionShell id="backtest">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <Frame>
            <div className="grid items-center gap-8 border border-border bg-surface p-5 sm:p-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <AppPreview />
              </div>
              <div>
                <Tag>{ui.freeForBuyers}</Tag>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{backtest.title}</h2>
                <p className="mt-4 text-lg text-muted">{backtest.subtitle}</p>
                <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                  {backtest.features.map((f) => (
                    <li key={f.title} className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-bg text-accent">
                        <FeatureIcon icon={f.icon} />
                      </span>
                      <div>
                        <p className="font-semibold">{f.title}</p>
                        <p className="text-sm text-muted">{f.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <LinkButton href={backtest.appUrl} external>
                    {ui.openApp}
                  </LinkButton>
                  <AppLink href={`/${lang}#ebook`} className="text-sm font-medium text-accent underline-offset-4 hover:underline">
                    {ui.buyEbook} →
                  </AppLink>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold">{ui.howToGetAccess}</h3>
              <ol className="mt-6 grid gap-4 md:grid-cols-3">
                {backtest.steps.map((s, i) => (
                  <Reveal as="li" key={s.title} delay={i * 0.08} className="border border-border bg-surface p-6">
                    <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <p className="mt-2 font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-muted">{s.description}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </Frame>
        </Reveal>
      </div>
    </SectionShell>
  )
}
