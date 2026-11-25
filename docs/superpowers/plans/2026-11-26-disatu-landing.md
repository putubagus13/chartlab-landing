# Disatu Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new bilingual (Indonesian/English), dark/light-themed landing site for Disatu. It sells paid e-book packages, and every package includes free access to the Disatu crypto backtest web app. It has a hero/greeting section, an e-book section, a backtest web app section, and a separate personal info page (profile and experience).

**Architecture:** A new TanStack Start (React, SSR) app in `disatu/disatu-landing/`. Locale lives in the URL (`/id`, `/en`, `/id/about`, `/en/about`), handled by a `$lang` layout route, and `/` redirects to `/id`. All copy, UI labels, prices and URLs live in two typed content modules (`site.id.ts`, `site.en.ts`) that share one `SiteContent` type, so sections are presentational and get content via `useContent()`. Theme is a `dark` class on `<html>`. It is set before paint by an inline script, defaults to the OS setting, and is saved in `localStorage`. The hero uses a port of the stipple orb canvas from `stipple-orb-landing`. framer-motion handles reveals and micro-interactions. Purchases go to an external checkout URL. There is no payment backend.

**Tech Stack:** TanStack Start + TanStack Router (React 19, Vite), TypeScript, Tailwind CSS v4, framer-motion, Vitest + @testing-library/react + jsdom, ui-ux-pro-max skill (Claude Code).

**Spec:** No separate spec doc. The requirements are the owner's request (26 Nov 2026), restated here:
1. Company name **Disatu**. New folder. React with **TanStack Start**.
2. Landing sections: **greeting (hero)**, **e-book (paid)**, **introduction to the crypto backtest web app**.
3. A separate **personal info page**: personal details and experience.
4. Business model: **buy an e-book package and get free access to the backtest web app**.
5. Use the **ui-ux-pro-max skill** (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), **framer-motion**, the hero from `disatu/stipple-orb-landing/` (21st.dev), and the brand assets in `disatu/disatu-logo-kit/`.
6. (Revision) Use the **white logo** version. Make the site **bilingual: English and Indonesian**. Support a **dark and light theme**.
7. (Revision 2) The dark theme background is **near-black, not green**. **Green is used only as an accent**, in both themes.

## Global Constraints

- Project folder: `/Users/ekanovanl/Documents/Private_Project/disatu/disatu-landing`, with **its own git repo** (`git init` inside it). The enclosing repo is the home directory (`/Users/ekanovanl`) and must not receive these commits.
- Node **22 LTS** (machine has 20.11.1, and Vite 7 / TanStack Start need ≥ 20.19). Pin it with `.nvmrc` = `22`.
- Animation package: `framer-motion`, imported from `"framer-motion"`.
- Brand colors (from `disatu-logo-kit/README.txt`): green `#124232`, yellow `#FFD33F`, white `#FFFFFF`, black `#000000`.
- **Logo:** use the **white** variant (`disatu-horizontal-white.svg`, `disatu-symbol-white.svg`) in dark theme and on any fixed near-black surface. In light theme on light surfaces, the white logo is invisible, so use the same monochrome design in **black** (`disatu-horizontal-black.svg`, `disatu-symbol-black.svg`). Do not use fullcolor or reverse variants. Swap the logo with CSS (`dark:hidden` / `hidden dark:block`) so server and client HTML match.
- Logo minimums: horizontal logo ≥ 100px wide, symbol ≥ 24px.
- **Languages:** `type Lang = "id" | "en"`, default `"id"`. Every piece of user-visible text, including button labels, aria-labels, the orb hint and page titles, comes from the content module for the current lang. Components contain no hardcoded copy.
- **URLs:** `/` → 307 redirect to `/id`. Pages are `/$lang` and `/$lang/about`, and an unknown `$lang` gives 404. `<html lang>` equals the current lang. Each page emits `<link rel="alternate" hreflang="id|en|x-default">`.
- **Currency:** IDR in both languages. `formatIDR(amount, lang)` uses `Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })`.
- **Theme:** `type Theme = "light" | "dark" | "system"`, default `"system"`, saved in `localStorage["disatu-theme"]`. Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *));`. Colors come from semantic tokens (`--color-bg`, `--color-surface`, `--color-fg`, `--color-muted`, `--color-border`, `--color-accent`), defined for `:root` (light) and `.dark`. Starting values:
  - light: bg `#FFFFFF`, surface `#F5F6F5`, fg `#0A0A0A`, muted `#5B5F5D`, border `#E4E6E5`, accent `#124232`.
  - dark: bg `#0A0A0A`, surface `#141414`, fg `#F5F5F5`, muted `#A1A1A1`, border `#262626`, accent `#3FA37F`. The accent is a lighter tint of brand green, because `#124232` on black is too dark for text and icons. Brand `#124232` may still be used in dark for fills behind white text and for glows.
  - Dark neutrals are **neutral grey/black with no green tint**. ui-ux-pro-max may adjust neutrals only.
- **Green is accent only (both themes):** buttons, links, borders, badges, icons, chart lines, focus rings, small glows and the avatar circle. **No section, card, header or footer gets a green background.** Large surfaces are `bg-bg` / `bg-surface` only.
- **Contrast:** yellow `#FFD33F` is never used as text on light backgrounds. In light theme, accent text uses brand green. Yellow is for buttons with green text, badges and highlights.
- Every e-book package has `includesBacktestAccess: true`. Prices, ids and URLs are identical in both languages.
- External links (checkout, web app, socials) use `target="_blank" rel="noopener noreferrer"`.
- Path alias `@/` → `src/`.
- Stipple orb port keeps the MIT credit comment: `Based on stipple-orb-landing by Kedhareswer Naidu (MIT) https://kedhar.pages.dev`.
- Real copy, prices and URLs are unknown. Use placeholder strings that start with `[ISI]` (id) or `[FILL]` (en), and use `https://example.com/...` for URLs, all in the content modules only.

## Review Focus

1. **Theme flash and hydration.** On a first visit with OS dark mode, and on a reload with a saved `light`, the first paint must already have the right theme, and there must be no React hydration warning. The theme script sets the class before hydration, and the toggle UI reads the theme only after mount. Tests go in Task 4.
2. **Locale parity.** An English visitor must never see a missing label or an Indonesian fallback, and switching language must keep the same page and section (`/id/about` ↔ `/en/about`, keeping `#ebook`). Tests go in Task 3 (both locales have the same shape: every string is non-empty, and ids, prices and URLs are equal) and Task 5 (the switcher href).
3. **Reduced motion.** With `prefers-reduced-motion: reduce`, all content must be visible right away (no element stuck at `opacity: 0`), and the orb draws one still frame. The test goes in Task 5 (`Reveal`).
4. **SSR safety.** Pages render on the server. Orb, `window`, `localStorage` and `matchMedia` are touched only in effects or in the inline script. The test goes in Task 6 (`renderToString(<Hero />)` does not throw).
5. **Mobile nav and broken links.** The phone menu closes on link tap and on `Escape`. Every checkout and app URL is a valid `https:` URL, and package CTAs point to the package's own `checkoutUrl`. Tests go in Task 3 (data), Task 5 (menu) and Task 7 (rendered href).

---

## File Structure

```
disatu-landing/
  .nvmrc
  .claude/skills/ui-ux-pro-max/        # installed by Task 2
  design-system/                        # generated by Task 2 (--persist)
  public/
    favicon.ico, favicon-32.png, favicon-180.png, favicon-192.png, favicon-512.png
    brand/  disatu-horizontal-white.svg, disatu-horizontal-black.svg,
            disatu-symbol-white.svg, disatu-symbol-black.svg
  src/
    styles.css                          # Tailwind v4, dark variant, semantic tokens (light/.dark)
    i18n/lang.ts                        # Lang, LANGS, isLang, swapLangInPath
    i18n/use-content.ts                 # useLang(), useContent()
    content/types.ts                    # SiteContent and friends
    content/site.id.ts                  # Indonesian content
    content/site.en.ts                  # English content
    content/index.ts                    # getContent(lang)
    theme/theme.ts                      # Theme, THEME_KEY, themeInitScript, applyTheme
    theme/theme-provider.tsx            # ThemeProvider, useTheme
    lib/format.ts                       # formatIDR
    routes/__root.tsx                   # html shell, theme script, favicons, ThemeProvider
    routes/index.tsx                    # redirect / -> /id
    routes/$lang.tsx                    # validates lang, header/footer, hreflang, <Outlet/>
    routes/$lang/index.tsx              # landing
    routes/$lang/about.tsx              # personal info
    components/ui/stipple-orb.tsx
    components/ui/logo.tsx
    components/ui/button.tsx
    components/ui/theme-toggle.tsx
    components/ui/lang-switch.tsx
    components/motion/reveal.tsx
    components/layout/site-header.tsx
    components/layout/site-footer.tsx
    components/sections/{hero,ebook-section,package-card,backtest-section,offer-cta}.tsx
    components/about/{profile-card,experience-timeline}.tsx
  tests/  (*.test.ts[x], utils.tsx with renderWithRouter(path))
  vitest.config.ts, tests/setup.ts
```

---

### Task 1: Scaffold the TanStack Start project

**Files:**
- Create: `disatu-landing/` (scaffold), `.nvmrc`, `vitest.config.ts`, `tests/setup.ts`, `tests/smoke.test.tsx`

**Interfaces:**
- Produces: a running app at `http://localhost:3000`, the `@/` alias, `npm test` (Vitest, jsdom, Testing Library with jest-dom matchers).

- [ ] **Step 1: Switch Node.** `nvm install 22 && nvm use 22 && node -v` → `v22.x`.
- [ ] **Step 2: Scaffold.** In `/Users/ekanovanl/Documents/Private_Project/disatu`, run `npm create @tanstack/start@latest disatu-landing`. At the prompts, choose React, TypeScript, Tailwind **yes**, no add-ons/examples (or delete demo routes after), and npm. Then `cd disatu-landing && echo 22 > .nvmrc`.
- [ ] **Step 3: Init its own repo.** `git init && git branch -M main`. Check: `git rev-parse --show-toplevel` prints `.../disatu/disatu-landing`.
- [ ] **Step 4: Install deps.** `npm i framer-motion` and `npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react vite-tsconfig-paths`. Add the `"test": "vitest run"` script. In `vitest.config.ts`, set `environment: "jsdom"`, `setupFiles: ["tests/setup.ts"]` and the tsconfig-paths plugin. `tests/setup.ts` imports `@testing-library/jest-dom/vitest`, stubs `window.matchMedia` (returns `matches:false`), and stubs `HTMLCanvasElement.prototype.getContext` to return `null`. Make sure tsconfig has `"paths": { "@/*": ["./src/*"] }`.
- [ ] **Step 5: Write the smoke test** `tests/smoke.test.tsx`: render `<h1>Disatu</h1>` and assert the heading text is `Disatu`.
- [ ] **Step 6: Run.** `npm test` → 1 passed. `npm run dev` → loads at localhost:3000. Stop the server.
- [ ] **Step 7: Commit.** `git add -A && git commit -m "chore: scaffold TanStack Start app with Tailwind, Vitest, framer-motion"`

### Task 2: ui-ux-pro-max skill, design tokens, brand assets

**Files:**
- Create: `.claude/skills/ui-ux-pro-max/` (installer), `design-system/` (generated), `public/brand/*`, `public/favicon*`, `src/components/ui/logo.tsx`
- Modify: `src/styles.css`
- Test: `tests/brand.test.tsx`

**Interfaces:**
- Produces: the semantic Tailwind utilities `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `border-border`, `bg-accent`, plus fixed `bg-brand-green`, `bg-brand-yellow`, `text-brand-green`, `text-brand-yellow`, `--font-sans` / `--font-display`, and the `dark:` variant on the `.dark` class.
- `Logo(props: { variant?: "horizontal" | "symbol"; onDark?: boolean; className?: string; alt?: string }): JSX.Element`. By default it renders a black `<img>` with `dark:hidden` and a white `<img>` with `hidden dark:block`. With `onDark` it renders only the white one, for fixed near-black surfaces such as the app preview. The default `alt` is `"Disatu"`.

- [ ] **Step 1: Install the skill.** In `disatu-landing/`, run `npx ui-ux-pro-max-cli init --ai claude` (not the stale `uipro-cli`). Check: `.claude/skills/ui-ux-pro-max/scripts/search.py` exists and `python3 --version` is 3.x.
- [ ] **Step 2: Generate the design system.** `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech crypto trading education ebook landing" --design-system --persist -p "Disatu"`, then `... "landing page" --stack react` and `... "dark mode" --domain ux`. Take **typography, spacing, radius, shadow, neutral tones and UX rules** from the output. Brand colors and the theme tokens in Global Constraints override any palette it suggests. Write the fonts into `@theme` (they are loaded in Task 4 via `<link>` with `display=swap`).
- [ ] **Step 3: Write the failing test** `tests/brand.test.tsx`. The 4 brand SVGs and 5 favicons exist under `public/`. `styles.css` contains `#124232`, `#FFD33F` and `@custom-variant dark`. `render(<Logo />)` gives two imgs with srcs `/brand/disatu-horizontal-black.svg` (class contains `dark:hidden`) and `/brand/disatu-horizontal-white.svg` (class contains `dark:block`). `render(<Logo onDark />)` gives exactly one img, the white one.
- [ ] **Step 4: Run** → FAIL.
- [ ] **Step 5: Copy assets.** From `../disatu-logo-kit/`, copy `horizontal/disatu-horizontal-white.svg`, `horizontal/disatu-horizontal-black.svg`, `symbol/disatu-symbol-white.svg` and `symbol/disatu-symbol-black.svg` → `public/brand/`. Copy `favicon/favicon.ico`, `disatu-favicon-32.png`, `-180.png`, `-192.png`, `-512.png` → `public/favicon.ico`, `favicon-32.png`, `favicon-180.png`, `favicon-192.png`, `favicon-512.png`. Delete the scaffold's default favicon/logos. Write the tokens in `styles.css` and implement `Logo`.
- [ ] **Step 6: Run** `npm test` → PASS.
- [ ] **Step 7: Commit.** `git add -A && git commit -m "feat: brand tokens, white/black logo, favicons, ui-ux-pro-max design system"`

### Task 3: Bilingual content model and IDR formatter

**Files:**
- Create: `src/i18n/lang.ts`, `src/content/types.ts`, `src/content/site.id.ts`, `src/content/site.en.ts`, `src/content/index.ts`, `src/lib/format.ts`
- Test: `tests/lang.test.ts`, `tests/content.test.ts`, `tests/format.test.ts`

**Interfaces:**
- Produces:
```ts
// src/i18n/lang.ts
export type Lang = "id" | "en"
export const LANGS: readonly Lang[]            // ["id", "en"]
export const DEFAULT_LANG: Lang                // "id"
export function isLang(v: unknown): v is Lang
export function swapLangInPath(pathname: string, to: Lang): string  // "/id/about" -> "/en/about", "/id" -> "/en"

// src/lib/format.ts
export function formatIDR(amount: number, lang: Lang): string

// src/content/types.ts
export type Section = "hero" | "ebook" | "backtest"
export type NavItem = { label: string; page: "home" | "about"; hash?: Section }
export type EbookPackage = { id: string; name: string; tagline: string; price: number; originalPrice?: number
  features: string[]; includesBacktestAccess: true; highlighted?: boolean; checkoutUrl: string }
export type BacktestFeature = { title: string; description: string; icon: "chart" | "bolt" | "layers" | "shield" | "clock" | "target" }
export type Experience = { role: string; company: string; period: string; description: string; highlights: string[] }
export type SiteContent = {
  meta: { homeTitle: string; homeDescription: string; aboutTitle: string; aboutDescription: string }
  ui: { buyEbook: string; buyPackage: string; mostPopular: string; freeBacktestBadge: string; openApp: string
        freeForBuyers: string; seeApp: string; menuOpen: string; menuClose: string; skipToContent: string
        themeLight: string; themeDark: string; themeSystem: string; switchLanguage: string
        orbLabel: string; orbHint: string; whatYouLearn: string; howToGetAccess: string; sampleData: string
        experienceTitle: string; skillsTitle: string; aboutCta: string }
  brand: { name: "Disatu"; tagline: string }
  nav: NavItem[]
  hero: { eyebrow: string; title: string; subtitle: string; bundleNote: string }
  ebook: { title: string; subtitle: string; chapters: string[]; packages: EbookPackage[] }
  backtest: { title: string; subtitle: string; appUrl: string; features: BacktestFeature[]; steps: { title: string; description: string }[] }
  offer: { title: string; subtitle: string }
  about: { name: string; headline: string; bio: string; photo?: string; location: string
           socials: { label: string; url: string }[]; skills: string[]; experiences: Experience[] }
  footer: { note: string }
}
// src/content/index.ts
export function getContent(lang: Lang): SiteContent
```
- Placeholder content: 3 packages (`starter`, `pro` highlighted, `mentor`), 4–6 backtest features, 3 steps (buy e-book → receive access by email → start backtesting), and 2+ experiences. Nav is E-Book (`home#ebook`), Backtest Web App (`home#backtest`), About Me / Tentang Saya (`about`).

- [ ] **Step 1: Write failing tests.**
  - `format.test.ts`, with whitespace normalized via `.replace(/\s/g, " ")`: `formatIDR(149000, "id")` → `"Rp 149.000"`, and `formatIDR(149000, "en")` → `"IDR 149,000"`.
  - `lang.test.ts`: `isLang("en")` is true, while `isLang("fr")` and `isLang(undefined)` are false. `swapLangInPath("/id/about","en")` → `"/en/about"`, `swapLangInPath("/id","en")` → `"/en"`, and `swapLangInPath("/en/","id")` → `"/id/"`.
  - `content.test.ts`, with `describe.each(LANGS)`: brand name is `"Disatu"`. Every package has `includesBacktestAccess === true` and `price > 0`. `originalPrice > price` when set. Exactly one package is highlighted. Every `checkoutUrl`, `appUrl` and social url has the `https:` protocol. No string anywhere is empty (recursive walk). Parity: `getContent("id")` and `getContent("en")` have the same key structure (recursive key/array-length comparison), and the same package `id`/`price`/`originalPrice`/`checkoutUrl`, `appUrl`, social urls, `nav` page/hash, and count of experiences/features/steps/chapters.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** per Interfaces. Shared non-text data (package ids/prices/urls, appUrl, socials) lives in a `const shared` in `content/index.ts` or a `content/shared.ts`. Both locale files spread it in, so parity holds by construction.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: bilingual typed content and IDR formatter"`

### Task 4: Theme system and locale routing

**Files:**
- Create: `src/theme/theme.ts`, `src/theme/theme-provider.tsx`, `src/i18n/use-content.ts`, `src/routes/$lang.tsx`
- Modify: `src/routes/__root.tsx`, `src/routes/index.tsx` (becomes a redirect)
- Test: `tests/theme.test.ts`, `tests/routing.test.tsx`, `tests/utils.tsx`

**Interfaces:**
- Consumes: `Lang`, `isLang`, `DEFAULT_LANG`, `getContent`.
- Produces:
```ts
// src/theme/theme.ts
export type Theme = "light" | "dark" | "system"
export const THEME_KEY = "disatu-theme"
export const themeInitScript: string            // IIFE string: reads localStorage, falls back to matchMedia, toggles "dark" on documentElement; wrapped in try/catch
export function resolveTheme(t: Theme, prefersDark: boolean): "light" | "dark"
export function applyTheme(t: Theme): void      // saves + sets class

// src/theme/theme-provider.tsx
export function ThemeProvider(props: { children: React.ReactNode }): JSX.Element
export function useTheme(): { theme: Theme; resolved: "light" | "dark"; setTheme(t: Theme): void; mounted: boolean }
// follows OS changes while theme === "system"

// src/i18n/use-content.ts
export function useLang(): Lang               // from useParams({ strict: false }).lang, else DEFAULT_LANG
export function useContent(): SiteContent

// tests/utils.tsx
export function renderWithRouter(path: string): Promise<RenderResult>  // real routeTree + createMemoryHistory
```
- `__root.tsx`: `<html lang={useLang()} suppressHydrationWarning>`. `<head>` has `<script dangerouslySetInnerHTML={{__html: themeInitScript}} />` **before** stylesheets, `theme-color` meta (`#FFFFFF` with media `(prefers-color-scheme: light)`, `#0A0A0A` with media `dark`), favicon links and font links. Wrap the body in `ThemeProvider`.
- `routes/index.tsx`: `beforeLoad: () => { throw redirect({ to: "/$lang", params: { lang: "id" }, statusCode: 307 }) }`.
- `routes/$lang.tsx`: `beforeLoad: ({ params }) => { if (!isLang(params.lang)) throw notFound() }`. `head()` returns the hreflang alternates for `id`, `en` and `x-default` (→ `/id`). It renders the header, `<main id="main">`, the `<Outlet/>` and the footer. Header and footer come from Task 5, so leave a placeholder until then.

- [ ] **Step 1: Write failing tests.**
  - `theme.test.ts`: `resolveTheme("system", true)` → `"dark"`, `resolveTheme("light", true)` → `"light"`. With `localStorage[THEME_KEY]="dark"`, `new Function(themeInitScript)()` adds the `dark` class to `document.documentElement`. With `"light"` and matchMedia dark → no `dark` class. With `localStorage.getItem` throwing → no exception. `applyTheme("light")` removes the class and stores `"light"`.
  - `routing.test.tsx`: `renderWithRouter("/")` ends at pathname `/id`. `renderWithRouter("/fr")` renders the not-found component. `renderWithRouter("/en")` sets `document.documentElement.lang === "en"`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** per Interfaces, and move the landing route stub to `routes/$lang/index.tsx`.
- [ ] **Step 4: Run** `npm test` → PASS. Then `npm run dev` with the OS in dark mode: open `/` and confirm it lands on `/id`, is dark on the first paint (no white flash on hard reload), and shows no hydration warning in the console.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: theme system without flash and /id /en locale routing"`

### Task 5: Motion primitive, button, theme toggle, language switch, header, footer

**Files:**
- Create: `src/components/motion/reveal.tsx`, `src/components/ui/button.tsx`, `src/components/ui/theme-toggle.tsx`, `src/components/ui/lang-switch.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`
- Modify: `src/routes/$lang.tsx` (render header and footer, plus the skip link `ui.skipToContent` → `#main`)
- Test: `tests/reveal.test.tsx`, `tests/site-header.test.tsx`

**Interfaces:**
- Consumes: `useContent`, `useLang`, `useTheme`, `swapLangInPath`, `Logo`.
- Produces:
```ts
export function Reveal(props: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "section" | "li" }): JSX.Element
export function LinkButton(props: { href: string; variant?: "primary" | "secondary" | "ghost"; external?: boolean; children: React.ReactNode; className?: string }): JSX.Element
export function ThemeToggle(): JSX.Element      // cycles light -> dark -> system; aria-label from ui.theme*; renders a neutral icon until mounted
export function LangSwitch(): JSX.Element       // "ID | EN"; current one aria-current="true"; href = swapLangInPath(pathname, other) + location.hash
export function SiteHeader(): JSX.Element
export function SiteFooter(): JSX.Element
```
- `Reveal`: `motion.div` with `initial={{opacity:0,y}}`, `whileInView={{opacity:1,y:0}}`, `viewport={{once:true, margin:"-80px"}}`. With `useReducedMotion()` true it renders a plain element. Defaults are `y=24` and `delay=0`.
- `LinkButton`: `primary` = `bg-accent` with white text in light, and `bg-accent` with `#0A0A0A` text in dark (green accent button), `secondary` = `bg-fg text-bg`, `ghost` = `border-border text-fg`. `external` adds `target="_blank" rel="noopener noreferrer"`. `motion.a` with `whileHover={{scale:1.03}}` and `whileTap={{scale:0.97}}`.
- Nav links are built from `NavItem`: `page:"home"` → `/${lang}` plus `#hash`, and `page:"about"` → `/${lang}/about`.
- `SiteHeader`: sticky, and it frosts after scrolling more than 8px (`bg-bg/80 backdrop-blur`). It has `<Logo />` linking to `/${lang}`, the nav, `LangSwitch`, `ThemeToggle`, and a primary CTA `ui.buyEbook` → `/${lang}#ebook`. Below `md` there is a menu button (`aria-expanded`, `aria-controls="mobile-menu"`, label `ui.menuOpen`/`ui.menuClose`), and the menu uses `AnimatePresence` and contains the nav, switch and toggle.

- [ ] **Step 1: Write failing tests.**
  - `reveal.test.tsx`: mock `framer-motion` with `useReducedMotion: () => true`. Render `<Reveal>Halo</Reveal>` and assert that neither the text node's element nor its parent has inline `opacity: 0`.
  - `site-header.test.tsx`, run for both `"/id/about"` and `"/en/about"` via `renderWithRouter`: there are links with `nav` labels and hrefs `/${lang}#ebook` and `/${lang}/about`. The LangSwitch link for the other lang has href `/${other}/about`, and the current one has `aria-current="true"`. Clicking ThemeToggle cycles `document.documentElement.classList.contains("dark")` and `localStorage["disatu-theme"]`. For the mobile menu: click open → `aria-expanded="true"` and `#mobile-menu` visible. `Escape` → `"false"`. Reopen, click a nav link, and confirm it is closed.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**, and wire it into `$lang.tsx`.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: header with language switch and theme toggle, footer, reveal"`

### Task 6: Stipple orb port and Hero section

**Files:**
- Create: `src/components/ui/stipple-orb.tsx`, `src/components/sections/hero.tsx`
- Test: `tests/hero.test.tsx`

**Interfaces:**
- Consumes: `useContent`, `useLang`, `useTheme().resolved`, `LinkButton`, `Reveal`.
- Produces:
```ts
export function StippleOrb(props: { accent?: string /* "#FFD33F" */; dark: boolean; label: string; hint: string; className?: string }): JSX.Element
export function Hero(): JSX.Element   // <section id="hero">
```

- [ ] **Step 1: Port the orb.** From `../stipple-orb-landing/components/stipple-orb-landing/stipple-orb-landing.tsx`, copy `Orb` (lines 1052–1342) and only what it uses: `mulberry32`, `fibSphere`, `rotate`, `LIGHT`, `shade`, `hexToRgb`, `ramp`, the `Rgb` type, `makeBuckets`, `sizeCanvas`, `useOnScreen`. Replace `reduced` with framer-motion's `useReducedMotion()`. Take the `label`/`hint` text from props (from `ui.orbLabel`/`ui.orbHint`). Replace the `sol-orb*` CSS (source lines 571–577, 814) with Tailwind: wrapper `relative aspect-square w-full max-w-[600px] cursor-grab active:cursor-grabbing touch-pan-y rounded-full focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-accent`, and canvas `absolute inset-0`. The `dark` prop already switches the grey ramp base. For light theme, the lit cap uses yellow `#FFD33F` blended toward green `#124232` for the hottest dots so it reads on white (tune visually). Keep the MIT credit comment. Drop the rest of the 2,847-line file.
- [ ] **Step 2: Write failing tests** `hero.test.tsx`:
  - `renderToString` of the `/id` route's Hero (inside the router/theme providers) does not throw, and the output contains `getContent("id").hero.title`.
  - For both langs in jsdom: exactly one `h1` equal to `hero.title`. The primary CTA text is `ui.buyEbook` with href `/${lang}#ebook`. The secondary CTA is `ui.seeApp` → `/${lang}#backtest`. `role="img"` has an aria-label starting with `ui.orbLabel`. `hero.bundleNote` is visible.
- [ ] **Step 3: Run** → FAIL.
- [ ] **Step 4: Implement `Hero`.** `min-h-[100svh]`, `bg-bg` (white or near-black), with a subtle radial glow behind the orb (brand green at low opacity, blurred). The glow is the only green there, and it is not a background fill. Two-column grid on `lg` (text left, orb right), orb above the text on mobile. Eyebrow chip, `h1`, subtitle, two CTAs, and the bundle note. The text staggers in with framer-motion variants (0.08s). Pass `dark={resolved === "dark"}` to the orb.
- [ ] **Step 5: Run** `npm test` → PASS. In `npm run dev`, check `/id` in both themes: the orb spins, can be dragged, and is clearly visible on both the white and the dark background.
- [ ] **Step 6: Commit.** `git add -A && git commit -m "feat: hero with ported stipple orb"`

### Task 7: E-book section and package cards

**Files:**
- Create: `src/components/sections/package-card.tsx`, `src/components/sections/ebook-section.tsx`
- Test: `tests/ebook-section.test.tsx`

**Interfaces:**
- Consumes: `useContent`, `useLang`, `EbookPackage`, `formatIDR`, `LinkButton`, `Reveal`, `Logo`.
- Produces: `PackageCard(props: { pkg: EbookPackage }): JSX.Element` and `EbookSection(): JSX.Element` (`<section id="ebook">`).

- [ ] **Step 1: Write failing tests**, with `describe.each(LANGS)` rendering under `/${lang}`. For each package: its name is visible, and `formatIDR(price, lang)` is visible (normalized-whitespace matcher). A struck-through `formatIDR(originalPrice, lang)` is visible when set. `within(card)` has `ui.freeBacktestBadge`. The card CTA `ui.buyPackage` has `href === pkg.checkoutUrl`, `target="_blank"` and `rel` containing `noopener`. The highlighted card shows `ui.mostPopular`. `ui.whatYouLearn` and every chapter are listed.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** `bg-surface` section. An e-book mockup: a near-black cover (`#0A0A0A` in both themes) with `<Logo variant="symbol" onDark />`, a green accent spine/stripe and a framer-motion hover tilt, next to the chapter list (green check icons). Package grid (1 col mobile, 3 col `lg`). All cards are `bg-bg border-border`. The highlighted card gets a 2px `border-accent`, a soft green glow shadow, a scale-up, the `ui.mostPopular` badge in `bg-accent`, and the primary CTA. The others use the ghost CTA. Staggered `Reveal`.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: e-book section with package pricing"`

### Task 8: Backtest web app section

**Files:**
- Create: `src/components/sections/backtest-section.tsx`
- Test: `tests/backtest-section.test.tsx`

**Interfaces:**
- Consumes: `useContent`, `useLang`, `LinkButton`, `Reveal`.
- Produces: `BacktestSection(): JSX.Element` (`<section id="backtest">`).

- [ ] **Step 1: Write failing tests** (both langs). Every `features[].title` and `steps[].title` is visible. The steps are an `ol` with `steps.length` items under the heading `ui.howToGetAccess`. The link `ui.openApp` has `href === backtest.appUrl` and is external. `ui.freeForBuyers` is present, plus a link to `/${lang}#ebook`. The stat chips are labelled `ui.sampleData`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** `bg-bg` section. On the left, a stylized app preview: a browser frame with a fixed near-black inner canvas (`#0A0A0A`, grid lines `#262626`), so it looks like the app in both themes. Inside it, an inline SVG equity curve in green accent `#3FA37F` with a faint green area fill draws in with framer-motion `pathLength` 0→1 when in view (static when reduced motion), plus 3 stat chips (Win rate, Max DD, Profit factor) tagged `ui.sampleData`. On the right, the feature grid with inline-SVG icons for each `icon` name (no icon library). Below, the 3-step ordered list.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: backtest web app section"`

### Task 9: Landing route assembly and offer CTA

**Files:**
- Create: `src/components/sections/offer-cta.tsx`
- Modify: `src/routes/$lang/index.tsx`
- Test: `tests/home-route.test.tsx`

**Interfaces:**
- Consumes: `Hero`, `EbookSection`, `BacktestSection`, `getContent`.
- Produces: `OfferCta(): JSX.Element`, and route `/$lang/` rendering `Hero → EbookSection → BacktestSection → OfferCta`, with `head()` giving `meta.homeTitle` / `meta.homeDescription` from `getContent(params.lang)` plus og tags (`og:image` `/favicon-512.png`, `og:locale` `id_ID`/`en_US`).

- [ ] **Step 1: Write failing test** (both langs). The section ids appear in DOM order `hero`, `ebook`, `backtest`. `offer.title` is present. `document.title === meta.homeTitle`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** `OfferCta` is a `bg-surface` rounded panel with a `border-accent` outline and a soft green glow (no green fill), `offer.title`/`offer.subtitle`, and a primary CTA `ui.buyEbook` → `/${lang}#ebook`. In `styles.css`, add `scroll-behavior: smooth` on `html` only inside `@media (prefers-reduced-motion: no-preference)`, and `scroll-margin-top` on `section[id]` equal to the header height.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: assemble landing page with offer CTA"`

### Task 10: Personal info page (`/$lang/about`)

**Files:**
- Create: `src/routes/$lang/about.tsx`, `src/components/about/profile-card.tsx`, `src/components/about/experience-timeline.tsx`
- Test: `tests/about-route.test.tsx`

**Interfaces:**
- Consumes: `useContent`, `useLang`, `Experience`, `Reveal`, `LinkButton`.
- Produces: `ProfileCard(): JSX.Element`, `ExperienceTimeline(props: { items: Experience[] }): JSX.Element`, and the route with `head()` giving `meta.aboutTitle` / `meta.aboutDescription`.

- [ ] **Step 1: Write failing tests** (both langs). One `h1` equal to `about.name`. Headline, location, `ui.skillsTitle` and every skill are visible. Every social is an external link with its url. `ExperienceTimeline` renders an `ol` with `items.length` `li`s, each with role, company and period, under `ui.experienceTitle`. With `photo` undefined, an initials avatar (first letters of the name's words, max 2) renders and there is no `img`. The CTA `ui.aboutCta` → `/${lang}#ebook`. `document.title === meta.aboutTitle`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** `bg-surface` header band with the profile card (photo or initials on a green circle, name, headline, bio, location, socials). A skills chip cloud. A vertical timeline whose line draws in (`scaleY` 0→1, origin top) and whose items `Reveal` one by one. A closing CTA.
- [ ] **Step 4: Run** `npm test` → PASS.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: personal info page with experience timeline"`

### Task 11: Final verification

**Files:** none new (fixes only).

- [ ] **Step 1:** `npm test` → all pass. `npx tsc --noEmit` → 0 errors. `npm run build` → succeeds.
- [ ] **Step 2:** Run the production build. Use the `run` skill (or a browser) to screenshot `/id`, `/en`, `/id/about` and `/en/about` at 375px and 1440px, **in both light and dark**. Check: no horizontal scroll; the white logo shows in dark theme and the black one in light; the dark theme background is near-black (no green tint) and no section, card, header or footer has a green fill; the logo is ≥ 100px wide; there is no Indonesian text on `/en` pages and no English on `/id` (apart from product terms); LangSwitch keeps the page and hash; the mobile menu works.
- [ ] **Step 3:** Hard-reload in each theme and confirm there is no flash of the wrong theme and no hydration warning. Confirm `curl -sI localhost:3000/` gives 307 → `/id`, and `curl -s localhost:3000/en | grep 'lang="en"'` matches.
- [ ] **Step 4:** Emulate `prefers-reduced-motion: reduce` and confirm everything is visible and still.
- [ ] **Step 5:** Run the ui-ux-pro-max pre-delivery checklist (`.claude/skills/ui-ux-pro-max/SKILL.md`) in both themes: contrast (no yellow text on white), focus states, touch targets ≥ 44px, `cursor-pointer`. Fix any misses.
- [ ] **Step 6: Commit.** `git add -A && git commit -m "chore: verification fixes"`
