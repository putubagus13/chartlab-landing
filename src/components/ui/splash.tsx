import { useEffect, useRef, useState } from 'react'
import { DisatuLoader } from '@/components/brand/disatu-loader'
import { markSvg } from '@/components/brand/disatu-logo-paths'
import type { GlassIconReveal } from '@/components/brand/glass-reveal'
import { SPLASH_FADE_MS, SPLASH_MAX_MS, SPLASH_MIN_MS } from '@/lib/splash'

type Phase = 'showing' | 'done' | 'gone'
type Engine = { kind: 'pending' } | { kind: 'glass'; Reveal: typeof GlassIconReveal; dark: boolean } | { kind: 'css' }

/**
 * A once-per-session intro over the landing page: the Disatu mark lingers in a glass tile, the glass bends it into
 * colour, then lets go (WebGL, loaded as its own chunk). It is in the server HTML, so it covers the page from the very
 * first paint, and the page behind it is already real, readable content (nothing waits on it for SEO or screen readers).
 *
 * It leaves when the page has finished loading and the reveal has played to its end. Safety nets:
 *  - no WebGL2 (or the chunk fails): the CSS logo animation plays instead,
 *  - a hard cap ends it whatever happens,
 *  - a repeat visit never shows it (head script flags <html data-splash="seen">),
 *  - with no JavaScript it is hidden at once (<noscript>), and a CSS animation hides it anyway (.splash in styles.css),
 *  - visitors who ask for reduced motion never see it.
 */
export function Splash() {
  const [phase, setPhase] = useState<Phase>('showing')
  const [engine, setEngine] = useState<Engine>({ kind: 'pending' })
  const control = useRef({ complete: () => {}, fallback: () => {} })

  useEffect(() => {
    if (document.documentElement.dataset.splash === 'seen') {
      setPhase('gone')
      return
    }
    const timers: number[] = []
    const signals = { loaded: false, ready: false }
    let left = false
    const leave = () => {
      if (left) return
      left = true
      setPhase('done')
      timers.push(window.setTimeout(() => setPhase('gone'), SPLASH_FADE_MS))
    }
    const check = () => {
      if (signals.loaded && signals.ready) leave()
    }
    // performance.now() counts from navigation start, so slow hydration eats into the waits instead of adding to them
    const after = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, Math.max(0, ms - performance.now())))

    const useCss = () => {
      setEngine({ kind: 'css' })
      after(SPLASH_MIN_MS, () => {
        signals.ready = true
        check()
      })
    }
    control.current = {
      complete: () => {
        signals.ready = true
        check()
      },
      fallback: useCss,
    }

    after(SPLASH_MAX_MS, leave)
    const onLoad = () => {
      signals.loaded = true
      check()
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })

    // the site's theme class is already on <html> (head script), so the look is right from the first frame
    const dark = document.documentElement.classList.contains('dark')
    import('@/components/brand/glass-reveal').then(
      (m) => setEngine({ kind: 'glass', Reveal: m.GlassIconReveal, dark }),
      useCss,
    )

    return () => {
      window.removeEventListener('load', onLoad)
      timers.forEach(window.clearTimeout)
    }
  }, [])

  if (phase === 'gone') return null
  return (
    <div data-splash-overlay data-done={phase === 'done'} aria-hidden="true" className="splash bg-bg">
      <noscript>
        <style>{'.splash{display:none}'}</style>
      </noscript>
      {engine.kind === 'glass' && (
        <engine.Reveal
          logo={markSvg(engine.dark ? '#f5f5f5' : '#0a0a0a')}
          look={engine.dark ? 'dark' : 'light'}
          // the canvas paints the backdrop itself, so it must be exactly the site's background
          background={engine.dark ? '#0a0a0a' : '#ffffff'}
          plateColor={engine.dark ? '#141414' : undefined}
          originalColors
          loop={false}
          tileSize={320}
          logoScale={0.6}
          finalScale={0.8}
          tuning={{ startZoom: 2.3, present: 1.5, glide: 1.4 }}
          label="Disatu"
          style={{ position: 'absolute', inset: 0 }}
          onComplete={() => control.current.complete()}
          onFallback={() => control.current.fallback()}
        />
      )}
      {engine.kind === 'css' && (
        <div className="splash-stage">
          <DisatuLoader />
          <span className="splash-bar" />
        </div>
      )}
    </div>
  )
}
