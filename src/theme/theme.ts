export type Theme = 'light' | 'dark' | 'system'
export const THEME_KEY = 'disatu-theme'

export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t==='dark'||((t!=='light')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`

export function resolveTheme(t: Theme, prefersDark: boolean): 'light' | 'dark' {
  if (t === 'system') return prefersDark ? 'dark' : 'light'
  return t
}

export function applyTheme(t: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, t)
  } catch {
    /* storage blocked */
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', resolveTheme(t, prefersDark) === 'dark')
}
