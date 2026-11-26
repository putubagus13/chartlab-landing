import { describe, it, expect } from 'vitest'
import { CHARTLAB_BASE, READY_TYPE, chartlabEmbedUrl, chartlabPath, isFromChartLab } from '@/lib/chartlab-embed'

describe('chartlabEmbedUrl', () => {
  it('adds the embed flag, theme and language so the first paint is already right', () => {
    expect(chartlabEmbedUrl('https://chartlab.example.app', { theme: 'dark', lang: 'id' })).toBe(
      'https://chartlab.example.app/?embed=1&theme=dark&lang=id',
    )
  })

  it('keeps a path and any query the base already has', () => {
    const url = new URL(chartlabEmbedUrl('https://x.app/app/?a=1', { theme: 'light', lang: 'en' }))
    expect(url.pathname).toBe('/app/')
    expect(url.searchParams.get('a')).toBe('1')
    expect(url.searchParams.get('theme')).toBe('light')
    expect(url.searchParams.get('lang')).toBe('en')
    expect(url.searchParams.get('embed')).toBe('1')
  })
})

describe('isFromChartLab', () => {
  const frame = {} as Window
  const base = 'https://chartlab.example.app/'

  it('accepts a message from the app origin sent by our own iframe window', () => {
    expect(isFromChartLab({ origin: 'https://chartlab.example.app', source: frame }, base, frame)).toBe(true)
  })

  it('rejects another origin, even from our own iframe', () => {
    expect(isFromChartLab({ origin: 'https://evil.example', source: frame }, base, frame)).toBe(false)
    expect(isFromChartLab({ origin: 'https://chartlab.example.app.evil.com', source: frame }, base, frame)).toBe(false)
  })

  it('rejects the right origin when the message came from some other window', () => {
    expect(isFromChartLab({ origin: 'https://chartlab.example.app', source: {} as Window }, base, frame)).toBe(false)
  })

  it('rejects everything while there is no iframe', () => {
    expect(isFromChartLab({ origin: 'https://chartlab.example.app', source: frame }, base, null)).toBe(false)
  })
})

describe('chartlabPath and constants', () => {
  it('builds the page path for a language', () => {
    expect(chartlabPath('id')).toBe('/id/chartlab')
    expect(chartlabPath('en')).toBe('/en/chartlab')
  })

  it('uses the message names the app speaks', () => {
    expect(READY_TYPE).toBe('chartlab:ready')
  })

  it('points at the deployed ChartLab app when VITE_CHARTLAB_URL is not set', () => {
    expect(new URL(CHARTLAB_BASE).protocol).toBe('https:')
    expect(new URL(CHARTLAB_BASE).host).toBe('chartlab-disatu.vercel.app')
  })
})
