export type Section = 'hero' | 'workflow' | 'ebook' | 'backtest' | 'services'
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
export type WorkflowStepId = 'learn' | 'system' | 'backtest' | 'live' | 'profit'
export type WorkflowStep = {
  id: WorkflowStepId
  label: string
  title: string
  description: string
  points: { label: string; text: string }[]
}
export type ServiceItem = { title: string; description: string; icon: 'web' | 'app' }
export type Education = { degree: string; school: string }
export type SkillGroup = { group: string; items: string[] }
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
    visualModesLabel: string
    visualModes: { helix: string; neural: string; ribbons: string }
    visualPause: string
    visualPlay: string
    whatYouLearn: string
    howToGetAccess: string
    sampleData: string
    experienceTitle: string
    skillsTitle: string
    aboutCta: string
    educationTitle: string
    whatsapp: string
    email: string
  }
  brand: { name: 'Disatu'; tagline: string }
  nav: NavItem[]
  hero: { eyebrow: string; title: string; subtitle: string; bundleNote: string }
  ebook: { title: string; subtitle: string; chapters: string[]; packages: EbookPackage[] }
  backtest: {
    title: string
    subtitle: string
    appUrl: string
    videoSrc: string
    videoPoster: string
    videoLabel: string
    videoNote: string
    features: BacktestFeature[]
    steps: { title: string; description: string }[]
  }
  services: { title: string; subtitle: string; contactLead: string; items: ServiceItem[] }
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
  about: {
    name: string
    headline: string
    bio: string
    photo?: string
    location: string
    contact: { phone: string; email: string }
    socials: { label: string; url: string }[]
    education: Education[]
    skills: SkillGroup[]
    experiences: Experience[]
  }
  footer: { note: string }
}
