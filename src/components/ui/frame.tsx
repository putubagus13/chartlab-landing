import type { ReactNode } from 'react'

type Tone = 'default' | 'accent'

/** Corner brackets for a card. The accent tone alternates the two brand colours around the card. */
export function Brackets({ tone = 'default' }: { tone?: Tone }) {
  const accent = tone === 'accent'
  const base = 'pointer-events-none absolute h-3 w-3'
  const green = accent ? 'border-[color:var(--grad-from)]' : 'border-fg/40'
  const yellow = accent ? 'border-[color:var(--grad-to)]' : 'border-fg/40'
  const w = accent ? 2 : 1.5
  return (
    <>
      <span aria-hidden="true" className={`${base} ${green} -left-1.5 -top-1.5`} style={{ borderLeftWidth: w, borderTopWidth: w }} />
      <span aria-hidden="true" className={`${base} ${yellow} -right-1.5 -top-1.5`} style={{ borderRightWidth: w, borderTopWidth: w }} />
      <span aria-hidden="true" className={`${base} ${yellow} -bottom-1.5 -left-1.5`} style={{ borderBottomWidth: w, borderLeftWidth: w }} />
      <span aria-hidden="true" className={`${base} ${green} -bottom-1.5 -right-1.5`} style={{ borderBottomWidth: w, borderRightWidth: w }} />
    </>
  )
}

const EDGE = { y: 'border-y', b: 'border-b', none: '' } as const
const BG = {
  hatch: 'bg-bg bg-hatch',
  dots: 'bg-bg bg-dots',
  warm: 'bg-surface bg-glow-warm',
  center: 'bg-bg bg-glow-center',
} as const

/** A full-width section. `bg` picks its backdrop, `edge` which hairlines it draws, so neighbours never double up. */
export function SectionShell({ id, bg, edge = 'b', className = '', children }: { id: string; bg: keyof typeof BG; edge?: keyof typeof EDGE; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`${EDGE[edge]} border-border ${BG[bg]} py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  )
}

/** Small pill label above a section title. */
export function Tag({ children }: { children: ReactNode }) {
  return <p className="mb-3 inline-flex rounded-full border border-border bg-bg px-3 py-1 text-xs font-semibold text-muted">{children}</p>
}
