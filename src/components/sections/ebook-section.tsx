import { motion, useReducedMotion } from 'framer-motion'
import { useContent } from '@/i18n/use-content'
import { Logo } from '@/components/ui/logo'
import { Reveal } from '@/components/motion/reveal'
import { SectionShell } from '@/components/ui/frame'
import { PackageCard } from './package-card'

function Cover({ title }: { title: string }) {
  const reduced = useReducedMotion()
  return (
    <div style={{ perspective: 1000 }} className="mx-auto w-56 sm:w-64">
      <motion.div
        whileHover={reduced ? undefined : { rotateY: -14, rotateX: 4, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative aspect-[3/4] overflow-hidden rounded-r-xl rounded-l-sm bg-[#0a0a0a] p-6 shadow-2xl ring-1 ring-border"
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2 bg-[#3fa37f]" />
        <div className="flex h-full flex-col justify-between pl-3">
          <Logo variant="symbol" onDark alt="" className="!h-9 !w-9" />
          <p className="font-display text-2xl font-bold leading-tight text-white">{title}</p>
          <span aria-hidden="true" className="h-px w-12 bg-[#3fa37f]" />
        </div>
      </motion.div>
    </div>
  )
}

export function EbookSection() {
  const { ebook, ui } = useContent()
  return (
    <SectionShell id="ebook" bg="warm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{ebook.title}</h2>
          <p className="mt-4 text-lg text-muted">{ebook.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[auto_1fr]">
          <Reveal>
            <Cover title={ebook.title} />
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="text-lg font-semibold">{ui.whatYouLearn}</h3>
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {ebook.chapters.map((ch, i) => (
                <li key={ch} className="flex gap-3 border-b border-border py-4 text-sm">
                  <span className="font-mono text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <span>{ch}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {ebook.packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 0.08}>
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
