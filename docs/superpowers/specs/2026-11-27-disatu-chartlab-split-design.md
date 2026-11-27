# Split the site: a Disatu company landing and a ChartLab product landing

**Date:** 27 Nov 2026 · **Status:** reviewed, awaiting the owner's approval

## Intent

Disatu is a company that builds websites and apps for clients. ChartLab (a free crypto trading
platform with backtesting) is one of Disatu's products. Today `disatu-landing` is, in practice,
the ChartLab landing: its title, hero, nav and every call to action sell ChartLab, and Disatu
itself only appears on the About page. A prospective client looking for a web or app builder
lands on a trading platform.

The owner wants two landings, each with its own identity:

- **Disatu landing**: who Disatu is, what it builds, how it works, and its products (ChartLab
  now), so a visitor who needs a website or app gets in touch.
- **ChartLab landing**: the current homepage, kept as it is, but branded as ChartLab ("a product
  of disatu"), so a trader learns what ChartLab does and opens the app.

## Goals

1. `disatu-landing` becomes a Disatu company profile: hero, services, work process, products,
   short about, contact CTA. The About page with the founder stays.
2. A new `chartlab-landing` repo carries the current homepage (hero, five-step trading
   workflow, ChartLab features and video, offer CTA) and the `/{lang}/chartlab` app page, with
   ChartLab branding from `disatu/chartlab-brand-kit/`.
3. Each landing links to the other: Disatu's product card goes to the ChartLab landing, and
   ChartLab's footer badge goes to Disatu.
4. Both keep everything the current site has: Indonesian and English with full content
   parity, dark/light/system theme, reduced-motion support, SSR, deploy on Vercel.

## Non-goals

- No portfolio, client logos, testimonials or pricing on the Disatu landing (there are none yet).
- No contact form or backend. Contact is WhatsApp and email, as today.
- No changes to `market-chart` (the ChartLab app). Its `ALLOWED_PARENTS`/`frame-ancestors`
  already accept any `https://*.vercel.app`, so the new ChartLab landing can frame it.
- No monorepo or shared component package (approach C, rejected below).
- No custom domains; both landings deploy on `*.vercel.app`.

## Anti-goals (failure even if it works)

- **Invented proof.** Any made-up client, project, testimonial, number of clients or price on the
  Disatu landing. Only facts the owner gave: founded 2024, founder Putu Bagus Raditya, the four
  services, the principle "client needs come first", ChartLab as a product Disatu built.
- **Disatu still reads as a trading site.** The Disatu homepage must not keep trading copy,
  the trading workflow, the e-book, or a ChartLab-first SEO title.
- **Broken brand rules** from `chartlab-brand-kit/README.txt`: more than one Disatu endorsement
  per screen on the ChartLab landing; the Disatu logo larger than 1/3 of the ChartLab symbol
  height (outside co-brand); "a product of" re-typeset in another font instead of the kit files;
  logos below minimum size (horizontal 110 px, symbol 20 px, endorsed lockup 200 px wide).
- **Losing the Vela/LuxAlgo attribution** on the ChartLab app page (Apache-2.0 NOTICE
  requirement): the "Chart by Vela (LuxAlgo)" credit stays on `/{lang}/chartlab` in the ChartLab landing.
- **Old links dying.** `https://<disatu>/id/chartlab` and `/en/chartlab` are already live and
  shared; they must keep reaching ChartLab.

## Constraints

- Stack stays as it is in both repos: TanStack Start (React 19, Vite), TypeScript, Tailwind v4,
  framer-motion, Vitest + Testing Library, Nitro `vercel` preset, Node `22.x`
  (`source ~/.nvm/nvm.sh && nvm use 22` before every command).
- Content lives in typed `site.id.ts` / `site.en.ts` modules sharing one `SiteContent` type;
  every string exists in both languages (the existing content-parity test pattern applies).
- Brand colours (shared by Disatu and ChartLab): green `#124232`, yellow `#FFD33F`, dark UI
  `#0E1512`, white. Dark theme background is near-black; green is an accent only.
- Contact details come from `shared.contact` (WhatsApp `+6282184677520`, email in `shared.ts`),
  via the existing `src/lib/contact.ts` helpers.
- The owner pushes, merges, creates GitHub repos and deploys to Vercel themselves.
  `market-chart`'s `AGENTS.md` asks for approval before commits there (not touched here anyway).

## Approaches

| | What | Trade-off |
|---|---|---|
| A | One repo, two landings by path (`/` Disatu, `/chartlab` ChartLab, `/chartlab/app` the app) | Cheapest, one copy of shared components; ChartLab has no domain of its own |
| **B (picked)** | **Separate repos: `disatu-landing` = Disatu, new `chartlab-landing` = ChartLab, `market-chart` = app** | Each landing fully independent (domain, SEO, release); shared components exist twice and fixes are made twice |
| C | Monorepo with two apps and a shared package | Cleanest at team scale; overkill setup and deploy config for one maintainer |

The owner picked **B**: ChartLab should have its own landing and its own address, separate
from Disatu.

## Decided

### Repo split

- **`disatu-landing` (this repo) becomes the Disatu landing.** Its name, history and Vercel
  project already belong to Disatu. Work happens on branch `feature/disatu-company-landing`
  (cut from `fix/chartlab-open-link`, so it includes the "open in new tab keeps lang/theme" fix).
- **`chartlab-landing` is created at `disatu/chartlab-landing/` as a copy of this repo at the
  current commit**, git history included (clone, then the owner points `origin` at a new
  GitHub repo). It is then trimmed and rebranded. Because it starts from the same commit, the
  ChartLab embed page, its tests and the open-link fix come along unchanged.
- **`market-chart` is unchanged.**

### Cross-links (environment variables, owner's decision)

- The two landings find each other only through build-time env vars, with no hard-coded
  production URL in either repo:
  - Disatu reads `VITE_CHARTLAB_LANDING_URL` (the ChartLab landing).
  - ChartLab reads `VITE_DISATU_URL` (the Disatu landing).
- The owner sets each one in the other project's Vercel settings once the URL is known.
- **A production build without the variable fails** with a message naming it, so a broken
  cross-link can never ship.
- **In development** each var defaults to the other landing's local dev server:
  - `chartlab-landing` keeps port 3000, because `market-chart` only allows framing from
    `localhost:3000`.
  - `disatu-landing` moves to port 3001.
- Disatu's product card CTA goes to `${VITE_CHARTLAB_LANDING_URL}/${lang}`, so the visitor keeps
  their language. ChartLab's footer badge goes to `${VITE_DISATU_URL}/${lang}`.
- Both are external links that open in the same tab.

### Disatu landing: homepage `/{lang}`

```
Header: Disatu logo · Services · Process · Products · About · [Consult]
HERO      "Website & app development" + subtitle
          [Consult on WhatsApp] (primary)  [See services] (scrolls to #services)
SERVICES  the 4 existing service cards (company profile, mobile app, backend, web app/e-commerce)
PROCESS   5-step interactive section (structure of the current WorkflowSection, new content)
PRODUCTS  "Disatu products" → ChartLab card: ChartLab logo, "Built by Disatu" label,
          1–2 sentences, 3 key features, [Visit ChartLab] → ChartLab landing
ABOUT     short: founded 2024, principle "client needs come first", link to /{lang}/about
CTA       "Have a project? Tell us about it" → WhatsApp / email
Footer
```

- **Services** reuse the current `ServicesSection` and the `services` content block already in
  `site.*.ts`. The section moves onto the homepage (anchor `#services`).
- **Process** steps (id / en), owner-approved:
  1. Konsultasi kebutuhan / Discovery call
  2. Rancangan & penawaran / Scope & proposal
  3. Desain & pengembangan / Design & build
  4. Uji & rilis / Test & launch
  5. Dukungan setelah rilis / Post-launch support

  Each step gets a title, a description and 2–3 points, like the trading steps today. The
  interactive layout of `WorkflowSection` is kept, but the step ids and visuals are new: the
  current `workflow-visuals.tsx` draws trading charts per step id, so the process needs its own
  five small illustrations in the same visual language (line art, brand accents). No "next
  step" CTA to ChartLab; the section's CTA is "Consult".
- **Products**: one card now, built so a second product is just another content entry
  (`products: Product[]`). On Disatu's own site the ChartLab logo is shown without the
  "a product of disatu" endorsement (the page is already Disatu's). The logo variant follows the
  theme: `chartlab-horizontal-color.svg` on light, `chartlab-horizontal-reverse-transparent.svg`
  on dark. Card features, drawn from current copy: free backtesting with Bar Replay, backtest
  statistics, best R:R recommendation.
- **About (short)** reuses `about.company` facts. The `/{lang}/about` page keeps the company
  intro and the founder (on demand) but drops `ServicesSection`, which now lives on the homepage
  only (builder's call, settled in review: avoids the same section and contact block twice). Its "Coba ChartLab gratis" CTA
  (`ui.aboutCta`) becomes a consult CTA; the sentence "Disatu also develops ChartLab" stays and
  links to the ChartLab landing.
- **CTA** reuses the current `OfferCta` layout with new copy, buttons to WhatsApp and email.
- **Header nav**: Services, Process, Products (hash links on home), About (page). Header button:
  "Consult" → WhatsApp. Theme toggle and language switch stay.
- **SEO**: `meta.homeTitle` id "Disatu — Jasa Pembuatan Website & Aplikasi", en "Disatu —
  Website & App Development"; descriptions about the services. Favicon/OG stay Disatu's.
- **Kept**: splash with the Disatu glass reveal, cursor tubes, helix field in the hero (abstract,
  not trading-specific), theme, i18n, reveal motion.
- **Removed from Disatu**: trading workflow content and visuals, `ChartLabSection` +
  `ChartLabVideo` + video/poster assets, e-book section/packages/flag, the `/{lang}/chartlab`
  embed page and `src/lib/chartlab-embed.ts`, `chartlabPage`/`chartlab`/`workflow`/`ebook`/`offer`
  content blocks and the `ui` keys only they use, and their tests. Tests that guard shared
  behaviour (theme, lang, routing, splash, header, hydration, reveal, helix, cursor) stay.
- **Old ChartLab links**: `/{lang}/chartlab` on Disatu becomes a redirect to
  `${VITE_CHARTLAB_LANDING_URL}/${lang}/chartlab` (the app page on the ChartLab landing), so shared links keep
  working.
- Footer note drops "educational content, not financial advice" (Disatu no longer publishes
  trading content); it becomes "© Disatu" plus contact.

### ChartLab landing: `chartlab-landing`

- **Pages**: `/{lang}` = the current homepage unchanged in content (hero, trading workflow,
  e-book behind `FEATURES.ebook = false`, ChartLab section with video, offer CTA);
  `/{lang}/chartlab` = the current embed page unchanged (including the Vela credit);
  `/` → `/id` as today.
- **Removed**: the `/{lang}/about` page and its components (founder, company intro,
  experience), `ServicesSection` and service content, and nav item "Tentang Disatu". Nav: Trading
  workflow, ChartLab (features), [Open ChartLab].
- **Branding** (all from `chartlab-brand-kit/`, copied into `public/brand/` and `public/`):
  - Header logo: `logo/horizontal/chartlab-horizontal-color.svg` (light) /
    `chartlab-horizontal-reverse-transparent.svg` (dark), at least 110 px wide.
  - Favicons: `favicon/` set (`favicon.ico`, 16–512 PNGs, SVG) replace Disatu's.
  - OG image: `social/chartlab-og-image-1200x630.png`.
  - Splash: the Disatu glass reveal is replaced with `react/ChartLabLoader.tsx` (variant
    `breakout`, `tone` by theme, with wordmark), keeping today's splash rules: once per session,
    skipped for reduced motion, no-JS failsafe, SSR-safe.
  - Endorsement: exactly one per screen, the `endorsement/badge-a-product-of-disatu-{light,dark}.svg`
    badge in the footer, linking to the Disatu landing. No endorsed lockup in the header.
- **SEO**: brand name in titles becomes ChartLab (e.g. "ChartLab — Platform Trading Crypto Gratis
  dengan Backtesting"), no "| Disatu" suffix (the badge carries the endorsement).
- `package.json` name → `chartlab-landing`; README rewritten for ChartLab (keeps the "ChartLab
  embedded app" section).
- Kept: theme, i18n, cursor tubes (still off on `/chartlab`), helix field, reveal motion.

### Shipping order

- The ChartLab landing ships first. The owner deploys `chartlab-landing`, then sets
  `VITE_CHARTLAB_LANDING_URL` in the Disatu Vercel project.
- The Disatu change (which removes the embed page and adds the redirect) merges only after that,
  so the shared `/id/chartlab` and `/en/chartlab` links never break.
- `VITE_DISATU_URL` in the ChartLab project is set to Disatu's current production URL.

## Left to the builder

- Exact Disatu copy beyond what is fixed above (hero subtitle, step descriptions and points,
  product card sentences), in the existing voice, both languages, no invented facts.
- The five process illustrations, in the style of the current workflow visuals.
- How to generalise or fork `WorkflowSection` (a shared stepper with injected visuals, or a
  separate `ProcessSection`).
- Whether the Disatu redirect is a route `beforeLoad` redirect or a Vercel rewrite.
- Test layout and which old tests are deleted versus rewritten, as long as shared behaviour
  stays covered and each new section has tests.
- Order of work across the two repos.
