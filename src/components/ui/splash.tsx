import { useEffect, useState } from 'react'
import { ChartLabLoader } from '@/components/brand/chartlab-loader'
import { SPLASH_FADE_MS, SPLASH_MAX_MS, SPLASH_MIN_MS } from '@/lib/splash'

type Phase = 'showing' | 'done' | 'gone'

/**
 * A once-per-session intro over the landing page: the ChartLab "breakout" loader from the brand kit. It is in the server
 * HTML, so it covers the page from the very first paint, and the page behind it is already real, readable content.
 *
 * It leaves when the page has finished loading and SPLASH_MIN_MS has passed. Safety nets:
 *  - a hard cap (SPLASH_MAX_MS) ends it whatever happens,
 *  - a repeat visit never shows it (head script flags <html data-splash="seen">),
 *  - with no JavaScript it is hidden at once (<noscript>), and a CSS animation hides it anyway (.splash in styles.css),
 *  - visitors who ask for reduced motion never see it.
 * Light and dark each get their loader tone, switched by CSS, so the first paint is already right.
 */
export function Splash() {
  const [phase, setPhase] = useState<Phase>('showing')

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

    after(SPLASH_MIN_MS, () => {
      signals.ready = true
      check()
    })
    after(SPLASH_MAX_MS, leave)
    const onLoad = () => {
      signals.loaded = true
      check()
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })

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
      <div className="splash-stage">
        {/* the theme switch sits on wrappers: the loader's own `display` rule would beat a class on its root */}
        <span className="dark:hidden">
          <ChartLabLoader size={56} variant="breakout" tone="color" withWordmark delay={0} label="ChartLab" />
        </span>
        <span className="hidden dark:block">
          <ChartLabLoader size={56} variant="breakout" tone="reverse" withWordmark delay={0} label="ChartLab" />
        </span>
        <span className="splash-bar" />
      </div>
    </div>
  )
}
