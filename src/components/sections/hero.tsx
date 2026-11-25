import { motion, useReducedMotion } from 'framer-motion'
import { useContent, useLang } from '@/i18n/use-content'
import { useTheme } from '@/theme/theme-provider'
import { LinkButton } from '@/components/ui/button'
import { StippleOrb } from '@/components/ui/stipple-orb'

export function Hero() {
  const lang = useLang()
  const { hero, ui } = useContent()
  const { resolved } = useTheme()
  const reduced = useReducedMotion()

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
  const item = reduced
    ? { hidden: {}, show: {} }
    : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-bg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/10 blur-3xl dark:bg-brand-green/25 lg:left-[72%]"
      />
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show" className="order-2 lg:order-1">
          <motion.p
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {hero.eyebrow}
          </motion.p>
          <motion.h1 variants={item} className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {hero.title}
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-muted">
            {hero.subtitle}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={`/${lang}#ebook`}>{ui.buyEbook}</LinkButton>
            <LinkButton href={`/${lang}#backtest`} variant="ghost">
              {ui.seeApp}
            </LinkButton>
          </motion.div>
          <motion.p variants={item} className="mt-6 flex items-center gap-2 text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true">
              <path d="M5 12l5 5L20 7" />
            </svg>
            {hero.bundleNote}
          </motion.p>
        </motion.div>

        <div className="order-1 flex justify-center lg:order-2">
          <StippleOrb dark={resolved === 'dark'} label={`${ui.orbLabel}. ${ui.orbHint}.`} hint={ui.orbHint} />
        </div>
      </div>
    </section>
  )
}
