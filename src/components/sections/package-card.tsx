import { useContent, useLang } from '@/i18n/use-content'
import type { EbookPackage } from '@/content/types'
import { formatIDR } from '@/lib/format'
import { LinkButton } from '@/components/ui/button'
import { Brackets } from '@/components/ui/frame'

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-accent" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

export function PackageCard({ pkg }: { pkg: EbookPackage }) {
  const lang = useLang()
  const { ui } = useContent()
  return (
    <article className={`relative flex h-full flex-col border bg-surface p-6 ${pkg.highlighted ? 'border-accent' : 'border-border'}`}>
      {pkg.highlighted && <Brackets tone="accent" />}
      {pkg.highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">{ui.mostPopular}</span>
      )}
      <h3 className="text-xl font-bold">{pkg.name}</h3>
      <p className="mt-1 text-sm text-muted">{pkg.tagline}</p>
      <p className="mt-5 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold">{formatIDR(pkg.price, lang)}</span>
        {pkg.originalPrice !== undefined && <s className="text-sm text-muted">{formatIDR(pkg.originalPrice, lang)}</s>}
      </p>
      <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
        {ui.freeBacktestBadge}
      </p>
      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <LinkButton href={pkg.checkoutUrl} external variant={pkg.highlighted ? 'primary' : 'ghost'} className="w-full">
          {ui.buyPackage}
        </LinkButton>
      </div>
    </article>
  )
}
