import type { SiteContent } from './types'
import { shared } from './shared'

const [starter, pro, mentor] = shared.packages

export const siteEn: SiteContent = {
  meta: {
    homeTitle: 'Disatu — Crypto Trading E-Book & Backtest Web App',
    homeDescription:
      'Learn crypto trading with the Disatu e-book and get free access to the backtest web app to test your strategies.',
    aboutTitle: 'About Me — Disatu',
    aboutDescription: 'The profile and experience behind the Disatu e-book and backtest web app.',
  },
  ui: {
    buyEbook: 'Buy E-Book',
    buyPackage: 'Buy Package',
    mostPopular: 'Most Popular',
    freeBacktestBadge: 'Free Backtest Web App access',
    openApp: 'Open Web App',
    freeForBuyers: 'Free for e-book buyers',
    seeApp: 'See the Web App',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    skipToContent: 'Skip to content',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    themeSystem: 'System theme',
    switchLanguage: 'Switch language',
    orbLabel: 'A sphere of stippled dots',
    orbHint: 'Drag to spin',
    whatYouLearn: "What you'll learn",
    howToGetAccess: 'How to get access',
    sampleData: 'sample data',
    experienceTitle: 'Experience',
    skillsTitle: 'Skills',
    aboutCta: 'Learn my strategies in the e-book',
  },
  brand: { name: 'Disatu', tagline: 'Learn, test, and trust your data.' },
  nav: [
    { label: 'E-Book', page: 'home', hash: 'ebook' },
    { label: 'Backtest Web App', page: 'home', hash: 'backtest' },
    { label: 'About Me', page: 'about' },
  ],
  hero: {
    eyebrow: 'E-book + Backtest Web App',
    title: 'Test your crypto strategy before you risk your money.',
    subtitle:
      'Learn crypto trading step by step with the Disatu e-book, then prove every idea on historical data in our backtest web app.',
    bundleNote: 'Every e-book package = free Backtest Web App access.',
  },
  ebook: {
    title: 'Crypto Trading E-Book',
    subtitle: 'A practical guide from market basics to building and testing your own strategy.',
    chapters: [
      'Crypto market basics and how orders work',
      'Reading charts without relying on gut feeling',
      'Risk management and position sizing',
      'Designing strategy rules you can test',
      'Backtesting: reading results and avoiding traps',
      'Execution discipline and trading journals',
    ],
    packages: [
      {
        ...starter,
        name: 'Starter',
        tagline: 'Start from the right foundation.',
        features: ['Full e-book (PDF)', 'Backtest Web App access', 'E-book content updates'],
        includesBacktestAccess: true,
      },
      {
        ...pro,
        name: 'Pro',
        tagline: 'Most chosen by serious learners.',
        features: ['Full e-book (PDF)', 'Backtest Web App access', 'Ready-to-use strategy templates', 'E-book content updates'],
        includesBacktestAccess: true,
      },
      {
        ...mentor,
        name: 'Mentor',
        tagline: 'With hands-on guidance.',
        features: ['Everything in Pro', 'Backtest Web App access', 'One live Q&A session', 'Strategy review'],
        includesBacktestAccess: true,
      },
    ],
  },
  backtest: {
    title: 'Crypto Backtest Web App',
    subtitle: 'Test your trading ideas on historical data and see the results clearly, with no code.',
    appUrl: shared.appUrl,
    features: [
      { title: 'Historical market data', description: 'Test strategies across many crypto pairs and time ranges.', icon: shared.icons[0] },
      { title: 'Fast results', description: 'Get backtest results in seconds.', icon: shared.icons[1] },
      { title: 'Many indicators', description: 'Combine indicators to build entry and exit rules.', icon: shared.icons[2] },
      { title: 'Risk metrics', description: 'See win rate, max drawdown and profit factor.', icon: shared.icons[3] },
      { title: 'Compare versions', description: 'Change parameters and compare results side by side.', icon: shared.icons[4] },
      { title: 'Focus on evidence', description: 'Decide on data, not feelings.', icon: shared.icons[5] },
    ],
    stats: [
      { label: 'Win rate', value: '58%' },
      { label: 'Max drawdown', value: '-12%' },
      { label: 'Profit factor', value: '1.9' },
    ],
    steps: [
      { title: 'Buy the e-book', description: 'Pick a package and complete checkout.' },
      { title: 'Receive access by email', description: 'We email you the e-book and web app access.' },
      { title: 'Start backtesting', description: 'Open the web app and test your first strategy.' },
    ],
  },
  offer: {
    title: 'One e-book package, full Backtest Web App access.',
    subtitle: 'Learn the theory, then prove it yourself with data.',
  },
  about: {
    name: '[FILL] Full Name',
    headline: '[FILL] Trader & developer behind Disatu',
    bio: '[FILL] Write a short summary about yourself, your background, and why you built Disatu.',
    location: '[FILL] City, Indonesia',
    socials: shared.socials,
    skills: ['Crypto trading', 'Backtesting', 'Risk management', 'React', 'TypeScript'],
    experiences: [
      {
        role: '[FILL] Job title',
        company: '[FILL] Company',
        period: '[FILL] 2022 — Present',
        description: '[FILL] Short description of the role.',
        highlights: ['[FILL] First key achievement', '[FILL] Second key achievement'],
      },
      {
        role: '[FILL] Previous job title',
        company: '[FILL] Company',
        period: '[FILL] 2019 — 2022',
        description: '[FILL] Short description of the role.',
        highlights: ['[FILL] Key achievement'],
      },
    ],
  },
  footer: { note: '© Disatu. Educational content, not financial advice.' },
}
