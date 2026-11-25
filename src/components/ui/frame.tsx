import type { CSSProperties, ReactNode } from 'react'

/** The shared "blueprint" look: hatched page, square bordered panels, corner brackets. */
const HATCH: CSSProperties = {
  backgroundImage: 'repeating-linear-gradient(135deg, color-mix(in srgb, var(--fg) 5%, transparent) 0 1px, transparent 1px 10px)',
}

type Tone = 'default' | 'accent'

export function Brackets({ tone = 'default' }: { tone?: Tone }) {
  const c = `pointer-events-none absolute h-3 w-3 ${tone === 'accent' ? 'border-accent' : 'border-fg/40'}`
  return (
    <>
      <span aria-hidden="true" className={`${c} -left-1.5 -top-1.5 border-l-[1.5px] border-t-[1.5px]`} />
      <span aria-hidden="true" className={`${c} -right-1.5 -top-1.5 border-r-[1.5px] border-t-[1.5px]`} />
      <span aria-hidden="true" className={`${c} -bottom-1.5 -left-1.5 border-b-[1.5px] border-l-[1.5px]`} />
      <span aria-hidden="true" className={`${c} -bottom-1.5 -right-1.5 border-b-[1.5px] border-r-[1.5px]`} />
    </>
  )
}

const EDGE = { y: 'border-y', b: 'border-b', none: '' } as const

/** A full-width hatched section. `edge` says which hairlines it draws, so neighbours never double up. */
export function SectionShell({ id, edge = 'b', children }: { id: string; edge?: keyof typeof EDGE; children: ReactNode }) {
  return (
    <section id={id} className={`${EDGE[edge]} border-border bg-surface/40 py-20 sm:py-28`} style={HATCH}>
      {children}
    </section>
  )
}

/** The big bordered board a section's content sits on. */
export function Frame({ children, tone = 'default', className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <div className={`relative border border-border bg-bg p-4 sm:p-8 ${className}`}>
      <Brackets tone={tone} />
      {children}
    </div>
  )
}

/** Small pill label above a section title. */
export function Tag({ children }: { children: ReactNode }) {
  return <p className="mb-3 inline-flex rounded-full border border-border bg-bg px-3 py-1 text-xs font-semibold text-muted">{children}</p>
}
