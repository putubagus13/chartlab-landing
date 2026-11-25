import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useContent } from '@/i18n/use-content'
import { Brackets } from '@/components/ui/frame'

/**
 * The tutorial clip: silent, looping, no control bar. It starts when scrolled into view and pauses
 * when it leaves, so the ~20 MB file is not fetched (preload="none") until someone actually gets here.
 * Visitors who ask for reduced motion get a still poster plus a control bar, so nothing moves on its own
 * and they can still choose to play it.
 */
export function BacktestVideo() {
  const { backtest } = useContent()
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const autoplay = mounted && !reduced

  useEffect(() => {
    const video = ref.current
    if (!video || !autoplay) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play()?.catch(() => {})
        else video.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [autoplay])

  return (
    <figure className="m-0">
      <div className="relative border border-border bg-[#0a0a0a]">
        <Brackets tone="accent" />
        <video
          ref={ref}
          src={backtest.videoSrc}
          poster={backtest.videoPoster}
          muted
          loop
          playsInline
          preload="none"
          controls={mounted && !!reduced}
          aria-label={backtest.videoLabel}
          className="block aspect-video w-full bg-[#0a0a0a]"
        />
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted">{backtest.videoNote}</figcaption>
    </figure>
  )
}
