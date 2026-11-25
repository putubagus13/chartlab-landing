import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMotionEnabled } from '@/components/motion/use-motion-enabled'
import { useContent, useLang } from '@/i18n/use-content'
import { Reveal } from '@/components/motion/reveal'
import { AppLink } from '@/components/ui/app-link'
import { StepVisual } from './workflow-visuals'

function Brackets() {
  const c = 'pointer-events-none absolute h-3 w-3 border-fg/40'
  return (
    <>
      <span aria-hidden="true" className={`${c} -left-1.5 -top-1.5 border-l-[1.5px] border-t-[1.5px]`} />
      <span aria-hidden="true" className={`${c} -right-1.5 -top-1.5 border-r-[1.5px] border-t-[1.5px]`} />
      <span aria-hidden="true" className={`${c} -bottom-1.5 -left-1.5 border-b-[1.5px] border-l-[1.5px]`} />
      <span aria-hidden="true" className={`${c} -bottom-1.5 -right-1.5 border-b-[1.5px] border-r-[1.5px]`} />
    </>
  )
}

export function WorkflowSection() {
  const lang = useLang()
  const { workflow: w } = useContent()
  const { ui } = useContent()
  const enabled = useMotionEnabled()
  const [active, setActive] = useState(0)
  const step = w.steps[active]
  const last = active === w.steps.length - 1
  const progress = (active / (w.steps.length - 1)) * 100

  return (
    <section
      id="workflow"
      className="border-y border-border bg-surface/40 py-20 sm:py-28"
      style={{
        backgroundImage: 'repeating-linear-gradient(135deg, color-mix(in srgb, var(--fg) 5%, transparent) 0 1px, transparent 1px 10px)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 inline-flex rounded-full border border-border bg-bg px-3 py-1 text-xs font-semibold text-muted">{w.tag}</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{w.title}</h2>
          <p className="mt-4 text-lg text-muted">{w.subtitle}</p>
        </Reveal>

        <Reveal className="mt-12" delay={0.1}>
          <div className="relative border border-border bg-bg p-4 sm:p-8">
            <Brackets />

            <ol className="relative grid grid-cols-5">
              <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-5 h-px bg-border" />
              <span
                aria-hidden="true"
                className="absolute left-[10%] top-5 h-px bg-accent transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${progress * 0.8}%` }}
              />
              {w.steps.map((s, i) => {
                const isActive = i === active
                const done = i < active
                return (
                  <li key={s.id} className="relative flex justify-center">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={isActive ? 'step' : undefined}
                      aria-controls="workflow-panel"
                      className="group flex min-h-11 flex-col items-center gap-2 px-1 text-center"
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border font-mono text-sm font-semibold transition-colors motion-reduce:transition-none ${
                          isActive
                            ? 'border-accent bg-accent text-on-accent'
                            : done
                              ? 'border-accent bg-bg text-accent'
                              : 'border-border bg-bg text-muted group-hover:border-fg/40'
                        }`}
                      >
                        {done ? '✓' : i + 1}
                      </span>
                      <span className="sr-only md:not-sr-only">
                        <span className={`text-xs font-semibold sm:text-sm ${isActive ? 'text-fg' : 'text-muted'}`}>{s.label}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <motion.div
              key={`${active}-${enabled}`}
              id="workflow-panel"
              aria-live="polite"
              className="mt-8 grid items-center gap-8 border border-border bg-surface p-5 sm:p-8 lg:grid-cols-2"
              initial={enabled ? { opacity: 0, y: 10 } : false}
              animate={enabled ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  {w.stepWord} {active + 1} / {w.steps.length}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-muted">{step.description}</p>
                <ul className="mt-6 space-y-4">
                  {step.points.map((p) => (
                    <li key={p.label} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <div>
                        <p className="font-semibold">{p.label}</p>
                        <p className="text-sm text-muted">{p.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {last ? (
                    <AppLink href={`/${lang}#ebook`} className="text-sm font-semibold text-accent underline-offset-4 hover:underline">
                      {w.cta} →
                    </AppLink>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActive(active + 1)}
                      className="min-h-11 rounded-full border border-border bg-bg px-5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none"
                    >
                      {w.next}
                    </button>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-bg p-4">
                <StepVisual step={step} hubLabel={w.hubLabel} enabled={enabled} sampleNote={ui.sampleData} />
              </div>
            </motion.div>
            <p className="mt-4 text-center text-xs text-muted">{w.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
