import { useEffect, useState } from 'react'
import { DisatuLoader } from '@/components/brand/disatu-loader'
import { SPLASH_FADE_MS, SPLASH_MIN_MS } from '@/lib/splash'

type Phase = 'showing' | 'done' | 'gone'

/**
 * A once-per-session intro over the landing page. It is in the server HTML, so it covers the page from the very
 * first paint, and the page behind it is already real, readable content (nothing waits on it for SEO or screen readers).
 *
 * It leaves when the page has finished loading and the logo animation has had time to play. Safety nets:
 *  - a repeat visit never shows it (head script flags <html data-splash="seen">),
 *  - with no JavaScript, a CSS animation hides it anyway (.splash in styles.css),
 *  - visitors who ask for reduced motion never see it.
 */
export function Splash() {
  const [phase, setPhase] = useState<Phase>('showing')

  useEffect(() => {
    if (document.documentElement.dataset.splash === 'seen') {
      setPhase('gone')
      return
    }
    const timers: number[] = []
    let finished = false
    const leave = () => {
      if (finished) return
      finished = true
      // performance.now() counts from navigation start, so slow hydration eats into the wait instead of adding to it
      const wait = Math.max(0, SPLASH_MIN_MS - performance.now())
      timers.push(
        window.setTimeout(() => {
          setPhase('done')
          timers.push(window.setTimeout(() => setPhase('gone'), SPLASH_FADE_MS))
        }, wait),
      )
    }
    if (document.readyState === 'complete') leave()
    else window.addEventListener('load', leave, { once: true })
    return () => {
      window.removeEventListener('load', leave)
      timers.forEach(window.clearTimeout)
    }
  }, [])

  if (phase === 'gone') return null
  return (
    <div data-splash-overlay data-done={phase === 'done'} aria-hidden="true" className="splash bg-bg bg-hatch">
      <div className="splash-stage">
        <DisatuLoader />
        <span className="splash-bar" />
      </div>
    </div>
  )
}
