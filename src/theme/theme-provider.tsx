import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { THEME_KEY, applyTheme, resolveTheme, type Theme } from './theme'

type Ctx = { theme: Theme; resolved: 'light' | 'dark'; setTheme: (t: Theme) => void; mounted: boolean }
const ThemeContext = createContext<Ctx>({ theme: 'system', resolved: 'light', setTheme: () => {}, mounted: false })

function readStored(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [prefersDark, setPrefersDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setThemeState(readStored())
    setPrefersDark(mq.matches)
    setMounted(true)
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', resolveTheme(theme, prefersDark) === 'dark')
  }, [theme, prefersDark, mounted])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    applyTheme(t)
  }, [])

  const value = useMemo<Ctx>(
    () => ({ theme, resolved: resolveTheme(theme, prefersDark), setTheme, mounted }),
    [theme, prefersDark, setTheme, mounted],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
