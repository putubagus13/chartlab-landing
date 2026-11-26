import { describe, it, expect, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'

// framer returns null on the server and the real preference on the client.
let reduced: boolean | null = false
vi.mock('framer-motion', async (orig) => ({
  ...((await orig()) as object),
  useReducedMotion: () => reduced,
}))

import { renderWithRouter } from './utils'

beforeEach(() => {
  vi.mocked(HTMLMediaElement.prototype.play).mockClear()
  vi.mocked(HTMLMediaElement.prototype.pause).mockClear()
})

describe('tutorial video playback', () => {
  it('autoplays once it is on screen, with no control bar', async () => {
    reduced = false
    await renderWithRouter('/id')
    const video = (await waitFor(() => {
      const v = document.querySelector('#chartlab video')
      if (!v) throw new Error('no video')
      return v
    })) as HTMLVideoElement
    await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled())
    expect(video.hasAttribute('controls')).toBe(false)
  })

  it('reduced-motion visitors get a still poster and a control bar, and nothing plays by itself', async () => {
    reduced = true
    await renderWithRouter('/id')
    const video = (await waitFor(() => {
      const v = document.querySelector('#chartlab video')
      if (!v) throw new Error('no video')
      return v
    })) as HTMLVideoElement
    await waitFor(() => expect(video.hasAttribute('controls')).toBe(true))
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
    expect(video.getAttribute('poster')).toBe('/assets/tutorial_backtest_poster.jpg')
  })
})
