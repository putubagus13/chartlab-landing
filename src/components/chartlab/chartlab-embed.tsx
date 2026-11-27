import { useEffect, useRef, useState } from 'react'
import { useContent, useLang } from '@/i18n/use-content'
import { useTheme } from '@/theme/theme-provider'
import { CHARTLAB_BASE, CHARTLAB_TIMEOUT_MS, READY_TYPE, chartlabEmbedUrl, chartlabOpenUrl, isFromChartLab, type ChartLabSet } from '@/lib/chartlab-embed'

type State = 'loading' | 'ready' | 'failed'

/**
 * The ChartLab app (a separate deployment, see lib/chartlab-embed.ts) inside the landing page.
 * It boots with the current theme and language in its URL, reports `chartlab:ready` when its shell
 * is up, and afterwards follows the page's theme and language over `postMessage`.
 */
export function ChartLabEmbed() {
  const lang = useLang()
  const { chartlabPage: t } = useContent()
  const { resolved, mounted } = useTheme()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const openUrl = chartlabOpenUrl(CHARTLAB_BASE, { theme: resolved, lang })
  const [state, setState] = useState<State>('loading')

  // Full screen takes the whole section, header included: the way out and the Vela credit stay on screen. The button
  // only exists where the browser can do it, and that is only known after mount, so the first render matches the server's.
  const [canFullscreen, setCanFullscreen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  useEffect(() => {
    setCanFullscreen(document.fullscreenEnabled === true && typeof sectionRef.current?.requestFullscreen === 'function')
    const sync = () => setFullscreen(document.fullscreenElement !== null && document.fullscreenElement === sectionRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])
  const toggleFullscreen = () => {
    if (fullscreen) void document.exitFullscreen?.()
    else void sectionRef.current?.requestFullscreen?.()
  }

  // The theme is only known after mount (it lives in storage), so the iframe is created then, with the right
  // theme in its URL from the first request. Later changes travel as messages: the src never changes.
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    if (mounted && src === null) setSrc(chartlabEmbedUrl(CHARTLAB_BASE, { theme: resolved, lang }))
  }, [mounted, src, resolved, lang])

  // "ready" is accepted from the app's origin and from our own iframe's window, nothing else.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isFromChartLab(event, CHARTLAB_BASE, frameRef.current?.contentWindow ?? null)) return
      if ((event.data as { type?: unknown } | null)?.type === READY_TYPE) setState('ready')
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // If the app never reports in (framing refused, blocked, offline), offer it in its own tab.
  useEffect(() => {
    if (src === null) return
    const timer = window.setTimeout(() => setState((s) => (s === 'loading' ? 'failed' : s)), CHARTLAB_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [src])

  // Keep the app in step with the page. Sent once it is ready, and again on every change; addressed to its
  // origin only, so nothing else can read it.
  useEffect(() => {
    if (state !== 'ready') return
    const msg: ChartLabSet = { type: 'chartlab:set', theme: resolved, lang }
    frameRef.current?.contentWindow?.postMessage(msg, new URL(CHARTLAB_BASE).origin)
  }, [state, resolved, lang])

  return (
    <section ref={sectionRef} aria-label={t.title} className="bg-bg [&:fullscreen]:flex [&:fullscreen]:flex-col">
      <div className="mx-auto flex h-12 max-w-[120rem] items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
        <h1 className="text-sm font-semibold tracking-tight">{t.title}</h1>
        <div className="flex items-center gap-4 text-xs">
          <a href="https://velacharts.dev" target="_blank" rel="noopener noreferrer" className="text-muted underline-offset-4 hover:text-fg hover:underline">
            {t.credit}
          </a>
          {canFullscreen && (
            <button type="button" onClick={toggleFullscreen} className="font-semibold text-accent underline-offset-4 hover:underline">
              {fullscreen ? t.exitFullscreen : t.fullscreen}
            </button>
          )}
        </div>
      </div>

      <div className="relative h-[calc(100svh-4rem-3rem)] min-h-[560px] bg-surface [section:fullscreen_&]:h-auto [section:fullscreen_&]:min-h-0 [section:fullscreen_&]:flex-1">
        {src !== null && (
          <iframe ref={frameRef} src={src} title={t.title} allow="fullscreen" className="absolute inset-0 h-full w-full border-0" />
        )}
        <div
          data-chartlab-overlay
          data-state={state}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface px-6 text-center data-[state=ready]:hidden"
        >
          {state === 'failed' ? (
            <>
              <p className="max-w-md text-muted">{t.fallback}</p>
              <a href={openUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline-offset-4 hover:underline">
                {t.openNewTab}
              </a>
            </>
          ) : (
            <p role="status" className="text-sm text-muted">
              {t.loading}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
