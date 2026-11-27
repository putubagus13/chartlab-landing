import { useContent, useLang } from '@/i18n/use-content'
import { Logo } from '@/components/ui/logo'
import { AppLink } from '@/components/ui/app-link'
import { navHref } from './site-header'
import { DisatuBadge } from '@/components/ui/disatu-badge'

export function SiteFooter() {
  const lang = useLang()
  const { nav, footer, brand } = useContent()
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted">{brand.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {nav.map((item) => (
            <AppLink key={item.label} href={navHref(lang, item)} className="text-muted hover:text-fg">
              {item.label}
            </AppLink>
          ))}
        </nav>
        <div className="flex flex-col gap-3 md:items-end">
          <DisatuBadge lang={lang} />
          <p className="text-xs text-muted">{footer.note}</p>
        </div>
      </div>
    </footer>
  )
}
