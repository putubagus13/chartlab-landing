import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// False on the server and on the first client render, so SSR markup and hydration always agree
// and content is visible without JS. True only after mount, and only if motion is allowed.
export function useMotionEnabled(): boolean {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && !reduced
}
