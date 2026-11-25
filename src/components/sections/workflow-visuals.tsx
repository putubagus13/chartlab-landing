import { motion } from 'framer-motion'
import type { WorkflowStep } from '@/content/types'

type Props = { step: WorkflowStep; hubLabel: string; enabled: boolean; sampleNote: string }

const INK = 'var(--fg)'
const LINE = 'var(--border)'
const MUTED = 'var(--muted)'
const SURFACE = 'var(--surface)'

/** A line that draws itself once when motion is on, and is simply there when it is off. */
function DrawLine({ d, enabled, stroke = 'currentColor', width = 2.5, delay = 0 }: { d: string; enabled: boolean; stroke?: string; width?: number; delay?: number }) {
  return (
    <motion.path
      key={enabled ? 'motion' : 'static'}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={enabled ? { pathLength: 0 } : false}
      animate={enabled ? { pathLength: 1 } : undefined}
      transition={{ duration: 1.4, ease: 'easeInOut', delay }}
    />
  )
}

function Frame({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <figure className="m-0">
      <svg viewBox="0 0 320 190" className="w-full text-accent" role="img" aria-label={label}>
        {children}
      </svg>
      {note && <figcaption className="mt-1 text-right font-mono text-[10px] text-muted">{note}</figcaption>}
    </figure>
  )
}

/** Step 1: three lenses flow into one hub. */
function LearnVisual({ step, hubLabel }: Pick<Props, 'step' | 'hubLabel'>) {
  const ys = [34, 95, 156]
  return (
    <Frame label={step.title}>
      {step.points.map((p, i) => (
        <g key={p.label}>
          <path d={`M118,${ys[i]} C168,${ys[i]} 176,95 214,95`} className="wf-flow" fill="none" stroke={LINE} strokeWidth="1.5" style={{ stroke: 'var(--muted)' }} opacity="0.7" />
          <rect x="6" y={ys[i] - 18} width="112" height="36" rx="8" fill={SURFACE} stroke={LINE} />
          <text x="62" y={ys[i] + 4} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={INK}>
            {p.label}
          </text>
        </g>
      ))}
      <rect x="214" y="68" width="100" height="54" rx="10" fill="currentColor" opacity="0.12" />
      <rect x="214" y="68" width="100" height="54" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="264" y="100" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
        {hubLabel}
      </text>
    </Frame>
  )
}

/** Step 2: the written rule sheet, one check per rule. */
function SystemVisual({ step, enabled }: Pick<Props, 'step' | 'enabled'>) {
  return (
    <Frame label={step.title}>
      <rect x="20" y="10" width="280" height="170" rx="10" fill={SURFACE} stroke={LINE} />
      {step.points.map((p, i) => {
        const y = 42 + i * 48
        return (
          <g key={p.label}>
            <rect x="38" y={y - 12} width="24" height="24" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <motion.path
              key={enabled ? 'motion' : 'static'}
              d={`M44 ${y} l5 5 9 -10`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={enabled ? { pathLength: 0 } : false}
              animate={enabled ? { pathLength: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.3 }}
            />
            <text x="76" y={y - 1} fontSize="11.5" fontWeight="600" fill={INK}>
              {p.label}
            </text>
            <rect x="76" y={y + 7} width={150 - i * 18} height="4" rx="2" fill={LINE} />
          </g>
        )
      })}
    </Frame>
  )
}

/** Step 3: an equity curve with its worst dip marked. */
function BacktestVisual({ step, enabled, sampleNote }: Pick<Props, 'step' | 'enabled' | 'sampleNote'>) {
  const d = 'M10 150 L45 138 L80 146 L115 112 L150 120 L185 84 L220 94 L255 52 L290 40 L312 30'
  return (
    <Frame label={step.title} note={sampleNote}>
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="10" x2="312" y1={y} y2={y} stroke={LINE} />
      ))}
      <path d={`${d} L312 180 L10 180 Z`} fill="currentColor" opacity="0.1" />
      <DrawLine d={d} enabled={enabled} />
      <path d="M185 84 L220 94 L255 52" fill="none" stroke="none" />
      <rect x="196" y="76" width="42" height="34" rx="4" fill="none" stroke={MUTED} strokeDasharray="3 3" />
      <text x="217" y="124" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono, monospace)" fill={MUTED}>
        DD
      </text>
    </Frame>
  )
}

/** Step 4: small live position with a pulsing last price and a fixed stop. */
function LiveVisual({ step, enabled }: Pick<Props, 'step' | 'enabled'>) {
  const d = 'M10 120 L40 110 L70 122 L100 100 L130 108 L160 90 L190 98 L220 76 L250 84 L280 66'
  return (
    <Frame label={step.title}>
      <line x1="10" x2="312" y1="146" y2="146" stroke={MUTED} strokeDasharray="4 4" />
      <text x="312" y="160" textAnchor="end" fontSize="9" fontFamily="var(--font-mono, monospace)" fill={MUTED}>
        SL
      </text>
      <rect x="10" y="146" width="302" height="30" fill={MUTED} opacity="0.08" />
      <DrawLine d={d} enabled={enabled} />
      <circle cx="280" cy="66" r="9" fill="currentColor" opacity="0.25" className="wf-pulse" />
      <circle cx="280" cy="66" r="4.5" fill={SURFACE} stroke="currentColor" strokeWidth="2" />
      <g transform="translate(14,16)">
        <rect width="58" height="22" rx="5" fill={SURFACE} stroke={LINE} />
        <text x="29" y="15" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono, monospace)" fill={INK}>
          1% risk
        </text>
      </g>
    </Frame>
  )
}

/** Step 5: price climbing through three take-profit levels. */
function ProfitVisual({ step, enabled }: Pick<Props, 'step' | 'enabled'>) {
  const d = 'M10 160 L50 148 L90 154 L130 120 L170 128 L210 82 L250 90 L290 36'
  const tps = [
    { y: 118, label: 'TP1' },
    { y: 78, label: 'TP2' },
    { y: 38, label: 'TP3' },
  ]
  return (
    <Frame label={step.title}>
      {tps.map((t) => (
        <g key={t.label}>
          <line x1="10" x2="270" y1={t.y} y2={t.y} stroke="currentColor" strokeDasharray="4 4" opacity="0.5" />
          <text x="312" y={t.y + 3} textAnchor="end" fontSize="10" fontWeight="700" fontFamily="var(--font-mono, monospace)" fill="currentColor">
            {t.label}
          </text>
        </g>
      ))}
      <DrawLine d={d} enabled={enabled} stroke={INK} width={2.2} />
      {[{ x: 130, y: 120 }, { x: 210, y: 82 }, { x: 290, y: 36 }].map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r="4.5" fill="currentColor" stroke={SURFACE} strokeWidth="2" />
      ))}
    </Frame>
  )
}

export function StepVisual({ step, hubLabel, enabled, sampleNote }: Props) {
  switch (step.id) {
    case 'learn':
      return <LearnVisual step={step} hubLabel={hubLabel} />
    case 'system':
      return <SystemVisual step={step} enabled={enabled} />
    case 'backtest':
      return <BacktestVisual step={step} enabled={enabled} sampleNote={sampleNote} />
    case 'live':
      return <LiveVisual step={step} enabled={enabled} />
    case 'profit':
      return <ProfitVisual step={step} enabled={enabled} />
  }
}
