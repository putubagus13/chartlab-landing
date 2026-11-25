// Non-text data shared by both locales. Replace placeholders (example.com, prices) with real values.
export const shared = {
  appUrl: 'https://example.com/app',
  packages: [
    { id: 'starter', price: 149000, originalPrice: undefined, checkoutUrl: 'https://example.com/checkout/starter' },
    { id: 'pro', price: 299000, originalPrice: 399000, checkoutUrl: 'https://example.com/checkout/pro', highlighted: true },
    { id: 'mentor', price: 599000, originalPrice: undefined, checkoutUrl: 'https://example.com/checkout/mentor' },
  ],
  socials: [
    { label: 'X', url: 'https://example.com/x' },
    { label: 'LinkedIn', url: 'https://example.com/linkedin' },
    { label: 'GitHub', url: 'https://example.com/github' },
  ],
  icons: ['chart', 'bolt', 'layers', 'shield', 'clock', 'target'] as const,
}
