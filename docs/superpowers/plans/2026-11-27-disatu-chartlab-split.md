# Disatu / ChartLab Landing Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `disatu-landing` into a Disatu company landing (services, process, products, about, contact) and move today's ChartLab homepage and app page into a new `chartlab-landing` repo branded as ChartLab.

**Architecture:**
- `chartlab-landing` is a git clone of this repo, then trimmed and rebranded. Part 1 builds it, and it ships first.
- `disatu-landing` drops all trading content and gains new sections. Its old `/{lang}/chartlab` route becomes a redirect to the ChartLab landing. Part 2 builds it.
- The two sites find each other only through build-time env vars, `VITE_CHARTLAB_LANDING_URL` and `VITE_DISATU_URL`. They are guarded so a production build fails without them.

**Tech Stack:** TanStack Start (React 19, Vite 7), TypeScript, Tailwind v4, framer-motion, Vitest + Testing Library (jsdom), Nitro `vercel` preset, Node 22.

**Spec:** `docs/superpowers/specs/2026-11-27-disatu-chartlab-split-design.md` (this plan and the spec are committed on `feature/disatu-company-landing` before Task 1, so the clone carries both)

## Global Constraints

- Every shell command starts with `source ~/.nvm/nvm.sh && nvm use 22 >/dev/null &&`.
- Repo paths:
  - `DL=/Users/ekanovanl/Documents/Private_Project/disatu/disatu-landing`
  - `CL=/Users/ekanovanl/Documents/Private_Project/disatu/chartlab-landing`
  - `KIT=/Users/ekanovanl/Documents/Private_Project/disatu/chartlab-brand-kit`
- Every user-visible string lives in `src/content/site.id.ts` and `site.en.ts` with identical shape. The `locale parity` and `no empty strings` tests in `tests/content.test.ts` must stay.
- Disatu copy states only owner-given facts:
  - founded 2024, founder Putu Bagus Raditya;
  - the four services;
  - the principle "kebutuhan klien nomor satu" / "client needs come first";
  - ChartLab as a product Disatu built.
  - No clients, projects, testimonials, counts or prices.
- Brand colours: green `#124232`, yellow `#FFD33F`, dark UI `#0E1512`, white. The dark background stays near-black and green is an accent only.
- ChartLab brand-kit rules:
  - at most one Disatu endorsement per screen;
  - never re-typeset "a product of", use the kit SVGs;
  - horizontal logo at least 110 px wide, symbol at least 20 px.
- Contact comes from `shared.contact` (`+6282184677520`, `ptbagusraditya@gmail.com`) through `contactLinks()` in `src/lib/contact.ts`.
- The "Chart by Vela (LuxAlgo)" credit and link stay on the ChartLab app page (Apache-2.0 NOTICE).
- Ports: `chartlab-landing` dev stays `3000` (market-chart only allows framing from `localhost:3000`), and `disatu-landing` dev moves to `3001`.
- Do not push, create GitHub repos, or deploy. The owner does those.

## Review Focus

1. **Production build with an env var unset.** The build must stop with an error naming the variable, never ship a site whose cross-links point at `undefined` or `localhost`. Test: `tests/env-guard.test.ts` (Tasks 1 and 6).
2. **Env var with a trailing slash, surrounding spaces, or no scheme** (e.g. `chartlab.vercel.app/`). Links must come out as `https://…/id` with no `//id`, and a scheme-less value must fail loudly instead of making a relative link. Test: `tests/site-links.test.ts` (Tasks 1 and 6).
3. **Old shared links `/id/chartlab` and `/en/chartlab` on Disatu.** They must land on the ChartLab app page in the same language, and `/id/chartlab/` with a trailing slash must too. Test: `tests/chartlab-redirect.test.ts` (Task 6), plus the trailing-slash case in Task 10's browser check.
4. **Language carried across sites.** An English visitor clicking "Visit ChartLab" must get `/en`, and the ChartLab badge must send them to Disatu `/en`. Tests in Tasks 3 and 9.
5. **Logos and badge in the wrong theme.** The ChartLab logo, the endorsement badge and the product-card logo must each render a light/dark pair (`dark:hidden` / `hidden dark:block`), so no white logo shows on white. Tests in Tasks 3 and 9.

---

# Part 1 — `chartlab-landing` (ships first)

### Task 1: Create the repo and the env-var plumbing

**Files:**
- Create: `$CL/` (git clone of `$DL`), `$CL/vite-env-guard.ts`, `$CL/src/lib/site-links.ts`
- Modify: `$CL/package.json` (`name`), `$CL/vite.config.ts`
- Test: `$CL/tests/env-guard.test.ts`, `$CL/tests/site-links.test.ts`

**Interfaces:**
- Produces:
  - `resolveSiteUrl(value: string | undefined, devDefault: string, isDev: boolean): string` in `src/lib/site-links.ts`.
  - `DISATU_URL: string` and `disatuHref(lang: Lang): string` in the same file.
  - `requireEnv(names: string[]): Plugin` (a Vite plugin) in `vite-env-guard.ts`.

- [ ] **Step 1: Clone and set up**

The plan and spec are committed on `feature/disatu-company-landing` before this runs, so the copy carries them.

```bash
git clone --branch feature/disatu-company-landing $DL $CL && cd $CL && git switch -c main && git branch -D feature/disatu-company-landing && git remote remove origin && git switch -c feature/chartlab-landing && npm ci
```

Set `"name": "chartlab-landing"` in `package.json`.

Expected: `git -C $CL remote` prints nothing, `npx vitest run` passes (the same suite as `$DL`).

- [ ] **Step 2: Write the failing tests**

`tests/site-links.test.ts`:

```ts
expect(resolveSiteUrl('https://disatu-landing.vercel.app/', 'http://localhost:3001', false)).toBe('https://disatu-landing.vercel.app')
expect(resolveSiteUrl('  https://a.vercel.app  ', 'x', false)).toBe('https://a.vercel.app')
expect(resolveSiteUrl(undefined, 'http://localhost:3001', true)).toBe('http://localhost:3001')
expect(resolveSiteUrl('', 'http://localhost:3001', true)).toBe('http://localhost:3001')
expect(() => resolveSiteUrl('disatu.vercel.app', 'x', false)).toThrow(/absolute http/)
expect(() => resolveSiteUrl('javascript:alert(1)', 'x', false)).toThrow(/absolute http/)
expect(() => resolveSiteUrl(undefined, 'x', false)).toThrow(/not set/)
// vitest runs with DEV=true and no var set, so:
expect(disatuHref('en')).toBe('http://localhost:3001/en')
```

`tests/env-guard.test.ts` calls the plugin's `config` hook directly:
- `requireEnv(['VITE_DISATU_URL'])`, called as `config({}, { command: 'build', mode: 'production' })`, throws `/VITE_DISATU_URL/` when neither `process.env` nor a `.env` file sets it.
- The same call does not throw once `process.env.VITE_DISATU_URL` is set to `https://x.vercel.app`. Restore the env afterwards.
- It does not throw for `{ command: 'serve', mode: 'development' }`.

- [ ] **Step 3: Run, verify they fail**

Run: `npx vitest run tests/site-links.test.ts tests/env-guard.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 4: Implement**

`resolveSiteUrl`:
- trims the value;
- an empty value returns `devDefault` when `isDev`, otherwise throws `Error('… is not set')`;
- anything that `new URL()` rejects, or whose protocol is not `http:`/`https:`, throws `Error('… must be an absolute http(s) URL')`;
- otherwise returns `url.origin + pathname`, with trailing slashes stripped.

Wire it up:
- `DISATU_URL = resolveSiteUrl(import.meta.env.VITE_DISATU_URL, 'http://localhost:3001', import.meta.env.DEV)`
- `disatuHref = (lang) => \`${DISATU_URL}/${lang}\``

`requireEnv`:
- In `config(_, { command, mode })`, only when `command === 'build'`, it merges `loadEnv(mode, process.cwd(), 'VITE_')` with `process.env`.
- For each missing or blank name it throws `Error(\`${name} is not set. Set it in the Vercel project's environment variables (see README).\`)`.

Add `requireEnv(['VITE_DISATU_URL'])` first in `vite.config.ts` plugins.

- [ ] **Step 5: Run, verify pass; check that a build without the var fails**

Run: `npx vitest run tests/site-links.test.ts tests/env-guard.test.ts && (npm run build 2>&1 | grep -q 'VITE_DISATU_URL is not set' && echo GUARD-OK)`
Expected: tests PASS, then `GUARD-OK`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "build: chartlab-landing from the Disatu landing; VITE_DISATU_URL with a production build guard"
```

### Task 2: Trim to ChartLab only (content, routes, nav)

**Files:**
- Delete:
  - `src/routes/$lang/about.tsx`
  - `src/components/about/*`
  - `src/components/brand/brand-silhouette.tsx`
  - `src/components/sections/services-section.tsx`
  - `tests/about-route.test.tsx`
  - `tests/services-section.test.tsx`
  - `public/assets/profile-picture.JPG`
- Modify:
  - `src/content/types.ts`, `site.id.ts`, `site.en.ts`, `shared.ts`
  - `src/i18n/alternates.ts` (drop `/about` if listed)
  - `src/components/layout/site-header.tsx` (`navHref`)
  - `src/routeTree.gen.ts` (regenerated by `vite build`/dev)
- Test: `tests/content.test.ts`, `tests/chartlab-brand.test.tsx`, `tests/site-header.test.tsx`, `tests/home-route.test.tsx`

**Interfaces:**
- Produces:
  - `SiteContent` without `services`, `about` and `meta.aboutTitle/aboutDescription`;
  - `brand: { name: 'ChartLab'; tagline: string }`;
  - `NavItem = { label: string; hash: Section }`, with every nav item a hash on home;
  - `navHref(lang, item) = \`/${lang}#${item.hash}\``.

- [ ] **Step 1: Update the tests first**

`tests/content.test.ts`:
- `brand` expects `'ChartLab'`.
- Delete `founder has experiences`, `about facts`, and the services half of `services and backtest video`.
- Add `expect(c).not.toHaveProperty('about')`, `expect(c).not.toHaveProperty('services')`, and `expect(c.meta.homeTitle).not.toMatch(/Disatu/)`.

`tests/chartlab-brand.test.tsx`:
- Add: `nav` labels contain no "Disatu".

`tests/home-route.test.tsx`:
- Keep the section order `['hero','workflow','chartlab','offer']`.
- Drop the `#services` comment line.
- Add: rendering `/${lang}/about` hits the not-found component.

`tests/site-header.test.tsx`:
- Nav has exactly the items from `c.nav`, none linking to `/about`.

- [ ] **Step 2: Run, verify failure**

Run: `npx vitest run tests/content.test.ts tests/home-route.test.tsx tests/site-header.test.tsx tests/chartlab-brand.test.tsx`
Expected: FAIL on brand name, about property and the about route.

- [ ] **Step 3: Implement**

Types and content:
- Remove the `about`, `services` and about-only `ui` keys (`experienceTitle`, `skillsTitle`, `educationTitle`, `aboutCta`, `whatsapp`, `email`) from types and both locales.
- Remove `shared.contact`, `skills`, `serviceIcons`, `founderPhoto` and `foundedYear` if nothing else reads them.

Nav:
- id: `Alur Trading`→`workflow`, `ChartLab`→`chartlab`
- en: same hashes

Meta titles drop the `| Disatu` suffix:
- id: `ChartLab — Platform Trading Crypto Gratis dengan Backtesting`
- en: the existing English title without the suffix

Footer note keeps "not financial advice".

Delete the files listed above, then regenerate routes (`npx vite build` with `VITE_DISATU_URL=https://x.vercel.app`, or the dev server).

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: tsc clean, all tests PASS.

- [ ] **Step 5: Commit** — `git commit -am "feat: chartlab-landing carries ChartLab only (no About, no services)"` (plus `git add -A` for deletions).

### Task 3: ChartLab branding (logo, favicons, OG, footer badge)

**Files:**
- Create:
  - `public/brand/` with the files copied from `$KIT`: `logo/horizontal/chartlab-horizontal-color.svg`, `chartlab-horizontal-reverse-transparent.svg`, `endorsement/badge-a-product-of-disatu-light.svg`, `badge-a-product-of-disatu-dark.svg`.
  - `public/`: `$KIT/favicon/{favicon.ico,chartlab-favicon.svg,chartlab-favicon-{16,32,48,180,192,512}.png}`, `public/og-image.png` (from `$KIT/social/chartlab-og-image-1200x630.png`).
  - `src/components/ui/disatu-badge.tsx`
- Delete: `public/brand/disatu-*.svg`, `public/favicon-*.png` (Disatu ones)
- Modify: `src/components/ui/logo.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`, `src/routes/__root.tsx`
- Test: `tests/brand.test.tsx`

**Interfaces:**
- Consumes: `disatuHref(lang)` (Task 1).
- Produces:
  - `Logo({ className?, alt? = 'ChartLab' })`, rendering a light `chartlab-horizontal-color.svg` plus a dark `chartlab-horizontal-reverse-transparent.svg` pair, `w-32` (128 px, at least the 110 px minimum);
  - `DisatuBadge({ lang: Lang })`.

- [ ] **Step 1: Rewrite `tests/brand.test.tsx`**

- `Logo` renders two `img[alt="ChartLab"]`: `src` `/brand/chartlab-horizontal-color.svg` with class `dark:hidden`, and `/brand/chartlab-horizontal-reverse-transparent.svg` with class `hidden dark:block`.
- `DisatuBadge lang="en"` renders one link with `href` `http://localhost:3001/en` containing the light badge (`dark:hidden`) and the dark badge (`hidden dark:block`), both with alt `a product of disatu`, and a `height` ≥ 28 px class.
- Rendering `/id` with `renderWithRouter`:
  - exactly one `a[href^="http://localhost:3001"]` on the page;
  - no `img[src*="chartlab-endorsed"]`;
  - no `img[src*="disatu-horizontal"]`.
- The root head links `/favicon.ico` and `/chartlab-favicon-32.png`, with `og:site_name` = `ChartLab` and `og:image` = `/og-image.png`. Assert via `Route.options.head()` from `src/routes/__root.tsx`.
- Keep the existing `styles.css has brand tokens and dark variant` test.

- [ ] **Step 2: Run, verify failure** — `npx vitest run tests/brand.test.tsx` → FAIL.

- [ ] **Step 3: Implement**

- Copy the assets with `cp` from `$KIT` and delete the Disatu ones.
- `Logo` uses the theme pair. The header link `aria-label` becomes `ChartLab`.
- The footer shows `Logo`, `brand.tagline`, nav, `<DisatuBadge lang={lang} />` and `footer.note`. The badge is the only endorsement on the page.
- In `__root.tsx`:
  - the icon links point at the new favicon files (`apple-touch-icon` → `/chartlab-favicon-180.png`);
  - `og:site_name` becomes `ChartLab`;
  - `og:image` becomes `/og-image.png`.

- [ ] **Step 4: Verify** — `npx tsc --noEmit && npx vitest run` → all PASS.

- [ ] **Step 5: Commit** — `"feat: ChartLab branding from the brand kit; a-product-of-disatu badge in the footer"`.

### Task 4: Splash with the ChartLab loader

**Files:**
- Create: `src/components/brand/chartlab-loader.tsx` (copied verbatim from `$KIT/react/ChartLabLoader.tsx`, a named export `ChartLabLoader`)
- Delete: `src/components/brand/{glass-reveal.tsx,disatu-loader.tsx,disatu-logo-paths.ts}`, plus `src/types/threejs-components.d.ts` and the WebGL dependency in `package.json` if only the glass reveal used them (check with `grep -r`).
- Modify: `src/components/ui/splash.tsx`, `src/styles.css` (splash rules only, if they reference Disatu-loader classes)
- Test: `tests/splash.test.tsx`

**Interfaces:**
- Consumes: `SPLASH_MIN_MS`, `SPLASH_MAX_MS`, `SPLASH_FADE_MS` and `splashInitScript` from `src/lib/splash.ts` (unchanged).
- Produces: `Splash()`. It keeps its current outer element, class `splash`, phase logic and `<noscript>` handling.

- [ ] **Step 1: Rewrite `tests/splash.test.tsx`**

Delete the `GlassIconReveal wrapper` block and the glass/WebGL cases. Keep:
- `is part of the app and covers the page on a first visit`;
- `does not show again in the same browser session`;
- `shows nothing … with JavaScript off`;
- the whole `splashInitScript` block;
- `splash stylesheet … hides itself without JavaScript, and respects "seen" and reduced motion`.

Add:
- `shows the ChartLab loader with its wordmark`: a `[role="status"].cll-root[data-variant="breakout"]` is inside `.splash`, and `svg` count ≥ 1.
- `loader tone follows the theme`: `data-tone` is `color` when the resolved theme is light and `reverse` when dark (set via the same theme setup the old light/dark case used).
- `leaves after the page has loaded and SPLASH_MIN_MS has passed, then is removed` (fake timers, as the old "stays until …" test).
- `never stays past SPLASH_MAX_MS` even if `load` never fires.

- [ ] **Step 2: Run, verify failure** — `npx vitest run tests/splash.test.tsx` → FAIL.

- [ ] **Step 3: Implement**

- `Splash` drops the engine state.
- Ready = `SPLASH_MIN_MS` elapsed (counted from `performance.now()` as today), and it leaves when ready and loaded, or at `SPLASH_MAX_MS`.
- It renders `<ChartLabLoader size={56} withWordmark variant="breakout" tone={dark ? 'reverse' : 'color'} delay={0} />` centred in the existing splash container, with background from the theme (`bg-bg`). Do not use `fullscreen`, because the `.splash` container already covers the page.
- Delete the unused files listed above.

- [ ] **Step 4: Verify** — `npx tsc --noEmit && npx vitest run` → all PASS.

- [ ] **Step 5: Commit** — `"feat: splash plays the ChartLab loader"`.

### Task 5: README and end-to-end check (chartlab-landing)

**Files:**
- Modify: `README.md`
- Test: browser check (no new unit tests)

- [ ] **Step 1: Rewrite README for ChartLab**

Cover:
- what the site is;
- `npm run dev` (port 3000);
- the env vars table:
  - `VITE_DISATU_URL` is required for production builds, dev default `http://localhost:3001`;
  - `VITE_CHARTLAB_URL` is optional, default `https://chartlab-disatu.vercel.app`;
- deploy on Vercel, with "set `VITE_DISATU_URL` before the first deploy";
- the brand-kit rules in one short list.

Keep the existing "ChartLab (the embedded app)" section.

- [ ] **Step 2: Full gate**

Run: `npx tsc --noEmit && npx vitest run && VITE_DISATU_URL=https://disatu-landing.vercel.app npm run build`
Expected: all clean, the build writes `.output/`.

- [ ] **Step 3: Browser check**

Run `npm run dev`, then use puppeteer-core with the SwiftShader flags used earlier in this project. Check:
- `/id` and `/en` show the ChartLab logo, the hero, the workflow, ChartLab and the offer;
- the footer has the single badge, linking to `http://localhost:3001/{lang}`;
- `/id/chartlab` loads the app iframe and shows the Vela credit;
- light and dark screenshots;
- at 375 px wide, `document.documentElement.scrollWidth <= 375`.

- [ ] **Step 4: Commit** — `"docs: README for chartlab-landing"`.

---

# Part 2 — `disatu-landing` (merges after the ChartLab landing is live)

All tasks run in `$DL` on `feature/disatu-company-landing`.

### Task 6: Env plumbing, dev port, and the `/{lang}/chartlab` redirect

**Files:**
- Create: `vite-env-guard.ts` (same as Task 1), `src/lib/site-links.ts`
- Delete:
  - `src/components/chartlab/chartlab-embed.tsx`
  - `src/lib/chartlab-embed.ts`
  - `tests/chartlab-embed-lib.test.ts`
  - `tests/chartlab-page.test.tsx`
- Modify:
  - `src/routes/$lang/chartlab.tsx`, `vite.config.ts`, `package.json` (`dev` → `vite dev --port 3001`)
  - every importer of `chartlabPath` (header, hero, offer-cta, chartlab-section, founder-section) switches to `chartlabLandingHref(lang)`. These callers are interim; Task 7 removes most of them.
  - `src/components/ui/cursor-tubes.tsx`: drop the `/chartlab` route check.
  - `src/content/shared.ts`: drop `chartlabUrl`.
- Test: `tests/site-links.test.ts`, `tests/env-guard.test.ts`, `tests/chartlab-redirect.test.ts`

**Interfaces:**
- Produces:
  - `resolveSiteUrl` (same contract as Task 1);
  - `CHARTLAB_LANDING_URL: string` (dev default `http://localhost:3000`);
  - `chartlabLandingHref(lang: Lang, path: '' | '/chartlab' = ''): string`, which returns `${CHARTLAB_LANDING_URL}/${lang}${path}`.

- [ ] **Step 1: Write the failing tests**

- `site-links.test.ts`: the Task 1 `resolveSiteUrl` cases, plus `chartlabLandingHref('en')` = `http://localhost:3000/en` and `chartlabLandingHref('id','/chartlab')` = `http://localhost:3000/id/chartlab`.
- `env-guard.test.ts`: the Task 1 cases with `VITE_CHARTLAB_LANDING_URL`.
- `chartlab-redirect.test.ts`: for each lang, call `Route.options.beforeLoad({ params: { lang } } as never)` from `src/routes/$lang/chartlab.tsx` and expect it to throw a redirect whose `options.href` is `http://localhost:3000/${lang}/chartlab`. Inspect it with `isRedirect()` from `@tanstack/react-router`.

- [ ] **Step 2: Run, verify failure** — FAIL (modules missing; the route still renders the embed).

- [ ] **Step 3: Implement**

- The route becomes `createFileRoute('/$lang/chartlab')({ beforeLoad: ({ params }) => { throw redirect({ href: chartlabLandingHref(isLang(params.lang) ? params.lang : 'id', '/chartlab'), statusCode: 301 }) } })`.
- Add `requireEnv(['VITE_CHARTLAB_LANDING_URL'])` to `vite.config.ts`.
- Delete the embed files and their tests.

- [ ] **Step 4: Verify** — `npx tsc --noEmit && npx vitest run` → all PASS; `npm run build 2>&1 | grep -q 'VITE_CHARTLAB_LANDING_URL is not set' && echo GUARD-OK`.

- [ ] **Step 5: Commit** — `"feat: /{lang}/chartlab redirects to the ChartLab landing (VITE_CHARTLAB_LANDING_URL, guarded); dev on port 3001"`.

### Task 7: Disatu content model, homepage skeleton, header, footer, About

**Files:**
- Delete:
  - `src/components/sections/{workflow-section,workflow-visuals,chartlab-section,chartlab-video,ebook-section,package-card,offer-cta}.tsx`
  - `src/content/flags.ts`
  - `public/assets/tutorial_backtest_v2.mp4`, `public/assets/tutorial_backtest_poster.jpg`
  - `tests/{workflow-section,chartlab-section,chartlab-video,ebook-section,free-app-focus,chartlab-brand}.test.tsx`
- Create: `src/components/sections/contact-cta.tsx`
- Modify:
  - `src/content/{types,shared,site.id,site.en}.ts`
  - `src/components/sections/hero.tsx`
  - `src/components/layout/{site-header,site-footer}.tsx`
  - `src/components/about/founder-section.tsx`
  - `src/routes/$lang/index.tsx`, `src/routes/$lang/about.tsx`
- Test: `tests/content.test.ts`, `tests/hero.test.tsx`, `tests/home-route.test.tsx`, `tests/site-header.test.tsx`, `tests/about-route.test.tsx`, `tests/contact-cta.test.tsx`, `tests/disatu-copy.test.ts`

**Interfaces:**
- Consumes: `chartlabLandingHref` (Task 6), `contactLinks` (existing).
- Produces, in `SiteContent` (both locales):
  - `meta`: `homeTitle`, `homeDescription`, `aboutTitle`, `aboutDescription`.
  - `brand: { name: 'Disatu'; tagline: string }`.
  - `nav: NavItem[]`, with `NavItem = { label: string; page: 'home' | 'about'; hash?: 'services' | 'process' | 'products' }`.
  - `hero: { eyebrow: string; title: string; subtitle: string }`.
  - `services` (unchanged shape).
  - `process: { tag: string; title: string; subtitle: string; stepWord: string; next: string; cta: string; steps: ProcessStep[] }`, where `ProcessStep = { id: 'discovery' | 'proposal' | 'build' | 'launch' | 'support'; label: string; title: string; description: string; points: { label: string; text: string }[] }`.
  - `products: { tag: string; title: string; subtitle: string; items: Product[] }`, where `Product = { id: 'chartlab'; name: string; badge: string; description: string; features: string[]; cta: string }`.
  - `aboutTeaser: { tag: string; title: string; text: string; cta: string }`.
  - `contactCta: { title: string; subtitle: string }`.
  - `about` (unchanged shape).
  - `footer: { note: string }`.
  - `ui` keys kept from today: `menuOpen`, `menuClose`, `skipToContent`, `themeLight`, `themeDark`, `themeSystem`, `switchLanguage`, `visualLabel`, `experienceTitle`, `skillsTitle`, `educationTitle`, `whatsapp`, `email`.
  - New `ui` keys: `consult`, `seeServices`.
  - `aboutCta` now reads as a consult CTA.

**Fixed copy** (from the spec):
- `meta.homeTitle`: id `Disatu — Jasa Pembuatan Website & Aplikasi`, en `Disatu — Website & App Development`.
- Process step labels: id `Konsultasi kebutuhan`, `Rancangan & penawaran`, `Desain & pengembangan`, `Uji & rilis`, `Dukungan setelah rilis`; en `Discovery call`, `Scope & proposal`, `Design & build`, `Test & launch`, `Post-launch support`.
- `products.items[0].badge`: id `Dibangun oleh Disatu`, en `Built by Disatu`.
- `products.items[0].features`, id: `Backtesting gratis dengan Bar Replay`, `Statistik hasil backtest`, `Rekomendasi R:R terbaik`. Write the English equivalents.
- `footer.note`: `© Disatu`.

Everything else is new copy in the existing voice, under the Global Constraints rule.

- [ ] **Step 1: Write the failing tests**

`content.test.ts`:
- Keep the brand, about facts, no-empty-strings, socials and parity tests.
- Drop the ebook, chartlab and video tests.
- Add:
  - `process.steps` ids equal `['discovery','proposal','build','launch','support']`, and the labels equal the fixed list per lang;
  - each step has 2–3 points;
  - `products.items` has length 1 with the fixed badge and features;
  - `meta.homeTitle` equals the fixed title;
  - `footer.note` is `© Disatu`.

`disatu-copy.test.ts`:
- No string outside `products` and `about` matches `/trading|trader|backtest|R:R|saran keuangan|financial advice/i`. ChartLab is described in `products`, the company intro mentions ChartLab, and the founder is a trader.
- No string anywhere matches `/testimoni|testimonial|klien kami|our clients|\d+\+ (klien|clients|proyek|projects)/i`.

`hero.test.tsx`:
- The hero shows the `hero.title` heading.
- Its primary link is the WhatsApp URL from `contactLinks(shared.contact)` (`https://wa.me/6282184677520`) with text `ui.consult`.
- Its secondary link is `/${lang}#services` with text `ui.seeServices`.
- No link contains `chartlab`.

`home-route.test.tsx`:
- The section ids in order are `['hero','services','contact']` for now. Tasks 8 and 9 extend this.
- The title is `meta.homeTitle`.
- The hreflang test is kept.

`site-header.test.tsx`:
- Nav hrefs equal `['/id#services','/id#process','/id#products','/id/about']` for `id`.
- The header CTA has text `ui.consult` and href `https://wa.me/6282184677520`.
- Keep the theme, mobile-menu and language tests.

`about-route.test.tsx`:
- `#services` is absent.
- The company intro and founder tests are kept.
- `ends by sending people to ChartLab` becomes `ends with a consult call to action`, linking to the WhatsApp URL.
- The company intro's ChartLab mention links to `chartlabLandingHref(lang)`.

`contact-cta.test.tsx`:
- `#contact` shows `contactCta.title`, a WhatsApp link and a `mailto:ptbagusraditya@gmail.com` link.

- [ ] **Step 2: Run, verify failure** — `npx vitest run` → the listed tests FAIL.

- [ ] **Step 3: Implement**

- Rewrite types and both locales (all blocks above, including `process` and `products` content, so Tasks 8 and 9 only add components).
- Delete the files listed above.
- `Hero` keeps its layout and `HelixField`, with the new copy and buttons.
- `ContactCta` reuses the old `OfferCta` card layout (`SectionShell id="contact" bg="center"`, `card-grad`, `Brackets`) with WhatsApp (primary) and email (secondary) buttons.
- Home route: `Hero`, `ServicesSection`, `ContactCta`.
- About route: `CompanyIntro`, `FounderSection`.
- `FounderSection` CTA: WhatsApp with `ui.aboutCta`.
- `CompanyIntro`: wrap the word "ChartLab" in its intro sentence with a link to `chartlabLandingHref(lang)`. Implement by splitting the intro string on `ChartLab`.
- Header: nav plus the consult `LinkButton`.
- Footer: `© Disatu` note plus nav (as today).

- [ ] **Step 4: Verify** — `npx tsc --noEmit && npx vitest run` → all PASS.

- [ ] **Step 5: Commit** — `"feat: Disatu company landing: new content model, hero, services on home, contact CTA; trading content removed"`.

### Task 8: Process section (five steps, new illustrations)

**Files:**
- Create: `src/components/sections/process-section.tsx`, `src/components/sections/process-visuals.tsx`
- Modify: `src/routes/$lang/index.tsx`
- Test: `tests/process-section.test.tsx`, `tests/home-route.test.tsx`

**Interfaces:**
- Consumes: `content.process` (Task 7).
- Produces:
  - `ProcessSection()`, rendering `<SectionShell id="process">`;
  - `ProcessVisual({ step: ProcessStep; enabled: boolean })`.

Start from the old `WorkflowSection` (`$CL/src/components/sections/workflow-section.tsx`, unchanged there) and keep:
- the stepper;
- `aria-current="step"`;
- the `aria-live` panel;
- the "next" button;
- the reduced-motion handling via `useMotionEnabled`.

Change these:
- the visual is `ProcessVisual`;
- the last step's CTA is `process.cta`, linking to the WhatsApp URL;
- there is no "sample data" note and no hub label.

Visuals: five small SVG line illustrations in the style of the old workflow visuals (`INK`/`MUTED` strokes, brand gradient accents, `DrawLine` when enabled):
- discovery: a chat bubble with a checklist;
- proposal: a document with a timeline;
- build: a browser window with code brackets;
- launch: a rocket or upward path with a check;
- support: a loop or shield with a heartbeat.

Each one is `role="img"` with `aria-label` = `step.title`.

- [ ] **Step 1: Write `tests/process-section.test.tsx`**

- Renders five step buttons labelled with the fixed labels.
- The first has `aria-current="step"`.
- Clicking "next" four times reaches step 5, whose panel shows `steps[4].title` and a link to `https://wa.me/6282184677520` with text `process.cta`.
- Clicking step 3 directly shows `steps[2].title`.
- Each step's panel has a `[role="img"][aria-label="<step.title>"]`.
- Run for `id` and `en`.

Extend `home-route.test.tsx`: the section order is `['hero','services','process','contact']`.

- [ ] **Step 2: Run, verify failure** — FAIL.

- [ ] **Step 3: Implement**, as described above.

- [ ] **Step 4: Verify** — `npx tsc --noEmit && npx vitest run` → all PASS.

- [ ] **Step 5: Commit** — `"feat: five-step work process section with its own illustrations"`.

### Task 9: Products section (ChartLab card) and About teaser

**Files:**
- Create:
  - `public/brand/chartlab-horizontal-color.svg`, `public/brand/chartlab-horizontal-reverse-transparent.svg` (copied from `$KIT/logo/horizontal/`)
  - `src/components/sections/products-section.tsx`
  - `src/components/sections/about-teaser.tsx`
- Modify: `src/routes/$lang/index.tsx`
- Test: `tests/products-section.test.tsx`, `tests/about-teaser.test.tsx`, `tests/home-route.test.tsx`

**Interfaces:**
- Consumes: `content.products`, `content.aboutTeaser`, `about.company` (Task 7), `chartlabLandingHref` (Task 6).
- Produces: `ProductsSection()` with `id="products"`, and `AboutTeaser()` with `id="about"`.

Product logos map by `id` inside the component:

```ts
{ chartlab: { light: '/brand/chartlab-horizontal-color.svg', dark: '/brand/chartlab-horizontal-reverse-transparent.svg' } }
```

Hrefs map by `id` too (`chartlab` → `chartlabLandingHref(lang)`), so content stays free of URLs.

- [ ] **Step 1: Write the failing tests**

`products-section.test.tsx`, for each lang:
- the heading is `products.title`;
- one card shows two `img[alt="ChartLab"]`, `color.svg` with `dark:hidden` and `reverse-transparent.svg` with `hidden dark:block`, each at least `w-28`;
- the card shows the badge text, the description and three features;
- the CTA link text is `items[0].cta` and its href is `http://localhost:3000/${lang}`;
- no `img[src*="endorsed"]` and no `img[src*="badge-"]`, because on Disatu's own site there is no endorsement.

`about-teaser.test.tsx`:
- shows `aboutTeaser.title`, the `2024` fact and `about.company.principle`;
- links to `/${lang}/about` with text `aboutTeaser.cta`.

`home-route.test.tsx`: the final order is `['hero','services','process','products','about','contact']`.

- [ ] **Step 2: Run, verify failure** — FAIL.

- [ ] **Step 3: Implement**

- Card layout follows the services cards: `SectionShell`, `Reveal`, bordered surface card, `Brackets`.
- A product with the CTA uses `LinkButton`.
- `AboutTeaser` is a two-column block: facts on the left, principle and link on the right.
- Copy the two SVGs from `$KIT`.

- [ ] **Step 4: Verify** — `npx tsc --noEmit && npx vitest run` → all PASS.

- [ ] **Step 5: Commit** — `"feat: Disatu products section (ChartLab) and about teaser on the homepage"`.

### Task 10: README and end-to-end check (disatu-landing)

**Files:**
- Modify: `README.md`, `.gitignore` (none expected)

- [ ] **Step 1: README**

- Disatu is a company landing.
- `npm run dev` runs on port 3001.
- Env var: `VITE_CHARTLAB_LANDING_URL` is required for production builds, dev default `http://localhost:3000`.
- Replace the "ChartLab (the embedded app)" section with "ChartLab lives in `chartlab-landing`; `/{lang}/chartlab` here redirects there".
- Deploy order: ChartLab landing first, then set the var, then merge this.

- [ ] **Step 2: Full gate**

Run: `npx tsc --noEmit && npx vitest run && VITE_CHARTLAB_LANDING_URL=https://chartlab-test.vercel.app npm run build && ! grep -rq "localhost:3000" .output/ && grep -rq "chartlab-test.vercel.app" .output/ && echo URLS-OK`
Expected: all clean, then `URLS-OK` (the build output has the real URL and no dev URL).

- [ ] **Step 3: Browser check**

Run both dev servers: `$CL` on 3000, `$DL` on 3001. Check:
- `/id` and `/en` show the sections in order;
- the nav anchors scroll;
- the process stepper works;
- "Kunjungi ChartLab" opens `http://localhost:3000/id`, and the ChartLab badge comes back to `http://localhost:3001/id`;
- `http://localhost:3001/en/chartlab` lands on `http://localhost:3000/en/chartlab`;
- light and dark screenshots;
- 375 px wide with no horizontal scroll;
- no console errors.

- [ ] **Step 4: Commit** — `"docs: README for the Disatu company landing"`.
