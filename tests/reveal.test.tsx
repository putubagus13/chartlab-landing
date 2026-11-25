import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('framer-motion', async (orig) => ({
  ...((await orig()) as object),
  useReducedMotion: () => true,
}))

import { Reveal } from '@/components/motion/reveal'

describe('Reveal under reduced motion', () => {
  it('is never stuck at opacity 0', () => {
    render(<Reveal>Halo</Reveal>)
    const el = screen.getByText('Halo')
    expect(el.style.opacity).not.toBe('0')
    expect(el.parentElement!.style.opacity).not.toBe('0')
    expect(el).toBeVisible()
  })
})
