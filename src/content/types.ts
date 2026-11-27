export type Section = 'hero' | 'workflow' | 'ebook' | 'chartlab'
export type NavItem = { label: string; hash: Section }
export type EbookPackage = {
  id: string
  name: string
  tagline: string
  price: number
  originalPrice?: number
  features: string[]
  includesBacktestAccess: true
  highlighted?: boolean
  checkoutUrl: string
}
export type ChartLabFeature = {
  title: string
  description: string
  icon: 'chart' | 'bolt' | 'layers' | 'shield' | 'clock' | 'target'
}
export type WorkflowStepId = 'learn' | 'system' | 'backtest' | 'live' | 'profit'
export type WorkflowStep = {
  id: WorkflowStepId
  label: string
  title: string
  description: string
  points: { label: string; text: string }[]
}
export type SiteContent = {
  meta: { homeTitle: string; homeDescription: string }
  ui: {
    buyEbook: string
    buyPackage: string
    mostPopular: string
    freeBacktestBadge: string
    openApp: string
    tryFree: string
    freeBadge: string
    seeApp: string
    menuOpen: string
    menuClose: string
    skipToContent: string
    themeLight: string
    themeDark: string
    themeSystem: string
    switchLanguage: string
    visualLabel: string
    whatYouLearn: string
    howToGetAccess: string
    sampleData: string
  }
  brand: { name: 'ChartLab'; tagline: string }
  nav: NavItem[]
  hero: { eyebrow: string; title: string; subtitle: string; bundleNote: string }
  ebook: { title: string; subtitle: string; chapters: string[]; packages: EbookPackage[] }
  chartlab: {
    title: string
    subtitle: string
    videoSrc: string
    videoPoster: string
    videoLabel: string
    videoNote: string
    features: ChartLabFeature[]
    steps: { title: string; description: string }[]
  }
  workflow: {
    tag: string
    title: string
    subtitle: string
    stepWord: string
    hubLabel: string
    next: string
    cta: string
    note: string
    steps: WorkflowStep[]
  }
  offer: { title: string; subtitle: string }
  chartlabPage: { title: string; description: string; loading: string; fallback: string; openNewTab: string; credit: string }
  footer: { note: string }
}
