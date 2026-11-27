# ChartLab landing

The marketing site for **ChartLab**, the free crypto trading platform with backtesting, statistics and a best-R:R
recommendation. ChartLab is a product of Disatu; the Disatu company site is a separate project (`disatu-landing`).

Bilingual (`/id`, `/en`), dark/light/system theme. Built with TanStack Start (React 19, Vite), Tailwind v4,
framer-motion, Vitest. Node 22.

| Page | What it is |
|---|---|
| `/{lang}` | Landing: hero, five-step trading workflow, ChartLab features and video, closing offer |
| `/{lang}/chartlab` | The ChartLab app itself, embedded (see below) |

## Run it

```bash
nvm use 22
npm install
npm run dev        # http://localhost:3000 (keep this port: the app only accepts being framed from it)
npm test
```

## Environment variables

| Variable | Needed | Default | What it is |
|---|---|---|---|
| `VITE_SITE_URL` | **required for production builds** | `http://localhost:3000` in dev | This site's own public address (e.g. `https://chartlab.disatu.xyz`). It is the base of every canonical link, hreflang alternate, share URL, `sitemap.xml` and `robots.txt`. |
| `VITE_DISATU_URL` | **required for production builds** | `http://localhost:3001` in dev | The Disatu landing. The footer badge "a product of disatu" links to `<url>/<lang>`. |
| `VITE_CHARTLAB_URL` | optional | `https://app.disatu.xyz` | The ChartLab app embedded on `/{lang}/chartlab`. |

Use the **full URL including `https://`** (e.g. `https://disatu-landing.vercel.app`), and set each for both the Production
and Preview environments. `npm run build` stops when the variable is missing or is not an absolute http(s) URL (a bare
`disatu-landing.vercel.app` is rejected), so a site whose links to Disatu would be broken never ships.

## SEO

`src/seo/` owns what search engines and link previews see: `head.ts` (canonical, hreflang, Open Graph and Twitter
cards, JSON-LD), `structured-data.ts` (ChartLab as a free web application made by Disatu), `sitemap.ts`, `robots.ts`
(served at `/sitemap.xml` and `/robots.txt`), and `pages.ts` (the indexable pages). A new public page goes into
`pages.ts` and uses `seoHead()` in its route. The share image is `public/og-image.png` (1200x630).

## Deploy (Vercel)

1. Import the repo as a new Vercel project with the same settings as `disatu-landing` (the Nitro `vercel` preset in
   `vite.config.ts` produces the Vercel output).
2. **Before the first deploy**, set `VITE_DISATU_URL` in the project's environment variables to the Disatu landing's
   production URL, with `https://` (a trailing slash is fine).
3. Deploy. Then give this project's production URL to the Disatu project as `VITE_CHARTLAB_LANDING_URL`.

## Brand rules (from `chartlab-brand-kit`)

- Logos, favicons, the OG image, the splash loader (`src/components/brand/chartlab-loader.tsx`) and the badge are
  kit files. Never re-typeset "a product of disatu".
- One Disatu endorsement per screen: the footer badge. No endorsed lockup elsewhere.
- Minimum sizes: horizontal logo 110 px, symbol 20 px.

# ChartLab (the embedded app)

The page `/{lang}/chartlab` embeds the ChartLab trading app in an `<iframe>`. The app is its own project
(the `market-chart` repo, deployed separately on Vercel); this site only frames it and keeps its theme and
language in step over `postMessage` (see `src/lib/chartlab-embed.ts`).

- **Default URL:** `https://app.disatu.xyz` (`src/content/shared.ts`).
- **Local development against a local copy of the app:** run `npm run dev:app` in `market-chart` (port 5192),
  then start this site with `VITE_CHARTLAB_URL=http://localhost:5192 npm run dev`. The app only accepts being
  framed from `http://localhost:3000` and `https://*.vercel.app`; a custom production domain for this site must be
  added to `ALLOWED_PARENTS` (`app/embed.ts`) and to `frame-ancestors` (`vercel.json`) in `market-chart`.
- **Vela attribution:** the chart carries a visible Vela watermark and the page links to velacharts.dev. Keep both
  (Apache-2.0 NOTICE).
