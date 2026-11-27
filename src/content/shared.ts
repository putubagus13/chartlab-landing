// Non-text data shared by both locales. Replace placeholders (example.com, prices) with real values.
export const shared = {
  // Where the standalone ChartLab app (the market-chart repo) is deployed on Vercel. The /{lang}/chartlab page
  // embeds it. For local work, point at a dev copy with VITE_CHARTLAB_URL (see README).
  chartlabUrl: 'https://app.disatu.xyz',
  videoSrc: '/assets/tutorial_backtest_v2.mp4',
  videoPoster: '/assets/tutorial_backtest_poster.jpg',
  packages: [
    { id: 'starter', price: 149000, originalPrice: undefined, checkoutUrl: 'https://example.com/checkout/starter' },
    { id: 'pro', price: 299000, originalPrice: 399000, checkoutUrl: 'https://example.com/checkout/pro', highlighted: true },
    { id: 'mentor', price: 599000, originalPrice: undefined, checkoutUrl: 'https://example.com/checkout/mentor' },
  ],
  icons: ['chart', 'bolt', 'layers', 'shield', 'clock', 'target'] as const,
}
