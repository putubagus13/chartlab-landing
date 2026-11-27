import { describe, it, expect, afterEach } from 'vitest'
import { requireEnv } from '../vite-env-guard'

type Hook = (cfg: object, env: { command: 'build' | 'serve'; mode: string }) => unknown
const run = (env: { command: 'build' | 'serve'; mode: string }) => {
  const plugin = requireEnv(['VITE_DISATU_URL'])
  return (plugin.config as unknown as Hook)({}, env)
}

describe('requireEnv (production build guard)', () => {
  const saved = process.env.VITE_DISATU_URL
  afterEach(() => {
    if (saved === undefined) delete process.env.VITE_DISATU_URL
    else process.env.VITE_DISATU_URL = saved
  })

  it('stops a production build when the variable is missing, naming it', () => {
    delete process.env.VITE_DISATU_URL
    expect(() => run({ command: 'build', mode: 'production' })).toThrow(/VITE_DISATU_URL/)
  })
  it('stops a production build when the variable is blank', () => {
    process.env.VITE_DISATU_URL = '   '
    expect(() => run({ command: 'build', mode: 'production' })).toThrow(/VITE_DISATU_URL/)
  })
  it('stops a production build when the value is not an absolute http(s) URL (e.g. a bare Vercel domain)', () => {
    process.env.VITE_DISATU_URL = 'chartlab.vercel.app/'
    expect(() => run({ command: 'build', mode: 'production' })).toThrow(/VITE_DISATU_URL.*absolute http/)
    process.env.VITE_DISATU_URL = 'javascript:alert(1)'
    expect(() => run({ command: 'build', mode: 'production' })).toThrow(/VITE_DISATU_URL.*absolute http/)
  })
  it('lets the build through once it is set', () => {
    process.env.VITE_DISATU_URL = 'https://x.vercel.app'
    expect(() => run({ command: 'build', mode: 'production' })).not.toThrow()
  })
  it('never blocks the dev server', () => {
    delete process.env.VITE_DISATU_URL
    expect(() => run({ command: 'serve', mode: 'development' })).not.toThrow()
  })
})
