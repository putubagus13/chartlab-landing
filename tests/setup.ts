import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

HTMLCanvasElement.prototype.getContext = (() => null) as never

// jsdom does not implement media playback.
HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve())
HTMLMediaElement.prototype.pause = vi.fn()

// jsdom has no IntersectionObserver; report everything as visible so whileInView resolves.
class IO {
  constructor(private cb: IntersectionObserverCallback) {}
  observe(el: Element) {
    this.cb([{ isIntersecting: true, target: el, intersectionRatio: 1 } as IntersectionObserverEntry], this as never)
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO
