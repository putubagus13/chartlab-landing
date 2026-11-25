import { motion } from 'framer-motion'
import { useMotionEnabled } from '@/components/motion/use-motion-enabled'
import type { Experience } from '@/content/types'
import { Reveal } from '@/components/motion/reveal'

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  const enabled = useMotionEnabled()
  return (
    <div className="relative">
      <motion.span
        key={enabled ? 'motion' : 'static'}
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-border"
        initial={enabled ? { scaleY: 0 } : false}
        whileInView={enabled ? { scaleY: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <ol className="space-y-10">
        {items.map((e, i) => (
          <Reveal as="li" key={`${e.company}-${e.period}-${i}`} delay={i * 0.08} className="relative pl-10">
            <span aria-hidden="true" className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-bg" />
            <p className="font-mono text-xs text-muted">{e.period}</p>
            <h3 className="mt-1 text-lg font-semibold">{e.role}</h3>
            <p className="text-sm font-medium text-accent">{e.company}</p>
            <p className="mt-2 text-muted">{e.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
