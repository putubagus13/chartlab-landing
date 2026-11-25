export type Section = 'hero' | 'ebook' | 'backtest'
export type NavItem = { label: string; page: 'home' | 'about'; hash?: Section }
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
export type BacktestFeature = {
  title: string
  description: string
  icon: 'chart' | 'bolt' | 'layers' | 'shield' | 'clock' | 'target'
}
export type Experience = {
  role: string
  company: string
  period: string
  description: string
  highlights: string[]
}
export type SiteContent = {
  meta: { homeTitle: string; homeDescription: string; aboutTitle: string; aboutDescription: string }
  ui: {
    buyEbook: string
    buyPackage: string
    mostPopular: string
    freeBacktestBadge: string
    openApp: string
    freeForBuyers: string
    seeApp: string
    menuOpen: string
    menuClose: string
    skipToContent: string
    themeLight: string
    themeDark: string
    themeSystem: string
    switchLanguage: string
    orbLabel: string
    orbHint: string
    whatYouLearn: string
    howToGetAccess: string
    sampleData: string
    experienceTitle: string
    skillsTitle: string
    aboutCta: string
  }
  brand: { name: 'Disatu'; tagline: string }
  nav: NavItem[]
  hero: { eyebrow: string; title: string; subtitle: string; bundleNote: string }
  ebook: { title: string; subtitle: string; chapters: string[]; packages: EbookPackage[] }
  backtest: {
    title: string
    subtitle: string
    appUrl: string
    features: BacktestFeature[]
    stats: { label: string; value: string }[]
    steps: { title: string; description: string }[]
  }
  offer: { title: string; subtitle: string }
  about: {
    name: string
    headline: string
    bio: string
    photo?: string
    location: string
    socials: { label: string; url: string }[]
    skills: string[]
    experiences: Experience[]
  }
  footer: { note: string }
}
