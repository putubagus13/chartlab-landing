import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { LANGS, swapLangInPath } from '@/i18n/lang'
import { useLang, useContent } from '@/i18n/use-content'
import { AppLink } from './app-link'

export function LangSwitch() {
  const lang = useLang()
  const { ui } = useContent()
  const { pathname, hash: routerHash } = useRouterState({ select: (s) => s.location })
  // hash is client-only state: the server never sees it, so read it after mount to keep hydration clean
  const [hash, setHash] = useState('')
  useEffect(() => setHash(routerHash), [routerHash])
  return (
    <div role="group" aria-label={ui.switchLanguage} className="inline-flex items-center rounded-full border border-border p-1 text-xs font-semibold">
      {LANGS.map((l) => {
        const current = l === lang
        const href = swapLangInPath(pathname, l) + (hash ? `#${hash}` : '')
        return (
          <AppLink
            key={l}
            href={href}
            className={`flex min-h-9 min-w-9 items-center justify-center rounded-full px-2 transition-colors ${current ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}
          >
            {l.toUpperCase()}
          </AppLink>
        )
      })}
    </div>
  )
}
