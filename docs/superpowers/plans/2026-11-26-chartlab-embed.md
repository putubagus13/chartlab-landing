# ChartLab Embed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the `market-chart` repo (a fork of LuxAlgo Vela with the user's trade simulator, statistics and best-R:R recommendation) on Vercel as a standalone "ChartLab" app, and embed it in `disatu-landing` as a new page `/{lang}/chartlab`.

**Architecture:** Two repos, two Vercel projects. `market-chart` gains a small purpose-built app (`app/`) that mounts `VelaWorkspace` straight from `src/` (no library build), plus a Vercel config that serves it as a static site with framing allowed only for the landing. `disatu-landing` gets a route that renders the app in an `iframe`, keeps its theme and language in step over a tiny `postMessage` protocol with strict origin checks, and every "Try ChartLab" call to action now points to that page.

**Tech Stack:** `market-chart`: TypeScript, Vite 8, Vitest, `VelaWorkspace` (`src/workspace`). `disatu-landing`: TanStack Start + React 19, Vitest. Hosting: Vercel (static for the app, Nitro preset for the landing, already deployed).

**Spec:** No separate spec. The requirements are the user's request ("check what `market-chart` needs to deploy on Vercel", then "embed it into `disatu-landing` as a new page") plus the findings below. Executors read both.

## Findings: what `market-chart` needs to deploy on Vercel

These were measured, not assumed.

| Question | Finding |
|---|---|
| What is the repo? | `@luxalgo/vela` 0.10.15, a charting **library**, not an app. The trade simulator, statistics, best-R:R recommendation and trade journal live in `src/widget/trading-sim` and were written by the user (git author `putubagus13`). Upstream `@luxalgo/vela` on npm (0.10.19) has none of them, so the landing cannot use the npm package. |
| What is deployable today? | Only the `playground/` Vite pages (a dev demo with a 4-chart grid and a demo scripting engine). `npm run build` is the **library** build (`tsup`), which is the wrong thing for Vercel. |
| Does an app build work? | Yes. A fresh clone with `npm ci --ignore-scripts` (no `dist/`, no library build) builds `playground/workspace.html` in about 0.3 s into one chunk of 1.9 MB (about 510 KB gzip). `npm ci` without the flag runs `prepare`, which runs the slow `tsup` library build for nothing. |
| Node | Vite 8 needs `^20.19 || >=22.12`. The repo's CI uses Node 24 (Vercel's default too). The local shell default is 20.11, which is too old: use nvm 22. |
| Native embed vs iframe | The package tarball is 5.5 MB (24 MB unpacked). Consuming it natively means committing a tarball or a private git dependency that fails on Vercel. An `iframe` avoids that, isolates CSS and global listeners, keeps the landing bundle light, and the app must be deployed standalone anyway. **Decision: iframe.** If the user later prefers a native mount, Tasks 5–6 are replaced; Tasks 1–4 stay. |
| Licence | Apache-2.0 with a `NOTICE` that requires a **visible "Vela" attribution** wherever a chart is shown. The built-in watermark satisfies it; it may only be disabled with an equivalent visible credit. The deployed app must also ship `LICENSE` and `NOTICE`. |
| Data | Browser talks straight to Binance (REST and `wss`), with a `binance.us` fallback in the provider. Nothing runs on Vercel. Some regions block Binance, so a second provider (Coinbase) is registered. |
| Gate | `market-chart/AGENTS.md`: `npm run typecheck`, `npm run lint`, `npm test` (CI runs them on Node 24), plus proving the change in a real browser. `tsconfig.json` includes only `src` and `test`, so new `app/` code must be added to `include` to be typechecked. |
| Repo etiquette | `market-chart/AGENTS.md`: keep changes inside that repo, use `.scratchpad/` (git-ignored) for throwaway work, and **present, then wait for the user's explicit approval before committing**. |

## Global Constraints

- Node for all commands: `source ~/.nvm/nvm.sh && nvm use 22` (Vite 8 needs `^20.19 || >=22.12`).
- `market-chart`: do not change library behaviour or the published `exports`/`files` of `package.json`. New code lives under `app/`, `test/`, root config files.
- `market-chart`: the renderer feature `attribution` must stay **enabled** (NOTICE). `LICENSE` and `NOTICE` must be served from the deployed app.
- `market-chart`: commit steps are **proposals**: present the diff and wait for approval (AGENTS.md "Present, don't commit"). Work on a branch `feature/chartlab-app` cut from `main`.
- `disatu-landing`: Node `22.x`; routes are `/$lang/...` with `lang` in `id | en`; all copy exists in both languages with the same shape (`tests/content.test.ts` enforces parity); commits end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Message protocol (both sides): `parent → app`: `{ type: 'chartlab:set', theme?: 'dark' | 'light', lang?: 'id' | 'en' }`; `app → parent`: `{ type: 'chartlab:ready' }`. Origins are always checked; never `'*'` as a receive filter.
- Landing route path: `/${lang}/chartlab`. The home-page section anchor `#chartlab` stays as is.
- No secrets in either repo. The only configuration is a public URL.

## Review Focus

1. **Framing blocked** (`X-Frame-Options` or a `frame-ancestors` that omits the landing): the page shows an empty box. Expected: the app is served with `frame-ancestors` for the landing and localhost and no `X-Frame-Options`; the landing shows a visible fallback link if the app never reports ready. Pinned in Task 3 and Task 6.
2. **Messages from the wrong origin**: a stray page could flip theme or language, or fake "ready". Expected: both sides ignore messages whose origin (and, on the landing, source window) does not match. Pinned in Tasks 1 and 5.
3. **Binance unreachable** (region block, network): an empty chart with no explanation. Expected: Coinbase registered as a second provider, and the landing's fallback link lets the user open the app on its own. Pinned in Task 2 and Task 6.
4. **Theme or language flash**: the app boots dark inside a light page and then corrects itself. Expected: the iframe URL carries `theme` and `lang`, so the first paint is right. Pinned in Tasks 1, 5, 6.
5. **Local dev without the app deployed**: `VITE_CHARTLAB_URL` unset gives a broken page. Expected: a documented default (the deployed URL) and an env override for `http://localhost:5192`. Pinned in Task 5.
6. **Cursor-tubes overlay on top of the iframe**: a full-screen WebGL layer over a chart app is wasteful and ugly. Expected: it is off on this route. Pinned in Task 6.

---

## Part A: `market-chart` (standalone ChartLab app on Vercel)

Repo: `/Users/ekanovanl/Documents/Private_Project/disatu/market-chart`. Create the branch first: `git switch -c feature/chartlab-app`.

### Task 1: Embed protocol module

**Files:**
- Create: `app/embed.ts`
- Create: `test/app-embed.test.ts`
- Modify: `tsconfig.json` (add `"app"` to `include`)

**Interfaces:**
- Produces:
  - `type ChartTheme = 'dark' | 'light'`, `type ChartLang = 'id' | 'en'`
  - `const SUPPORTED_LANGS: readonly ChartLang[] = ['id', 'en']`
  - `const ALLOWED_PARENTS: readonly string[] = ['http://localhost:3000', 'https://*.vercel.app']` (the landing's production domain is added in Task 4)
  - `interface EmbedParams { theme: ChartTheme; lang: ChartLang; embedded: boolean }`
  - `function readEmbedParams(search: string, prefersDark: boolean): EmbedParams`
  - `type ParentMessage = { type: 'chartlab:set'; theme?: ChartTheme; lang?: ChartLang }`
  - `function parseParentMessage(data: unknown): ParentMessage | null`
  - `function isAllowedParent(origin: string, allowed?: readonly string[]): boolean` (defaults to `ALLOWED_PARENTS`)

- [ ] **Step 1: Write the failing tests** in `test/app-embed.test.ts`:
  - `readEmbedParams('?theme=light&lang=id&embed=1', true)` equals `{ theme: 'light', lang: 'id', embedded: true }`.
  - `readEmbedParams('', true)` equals `{ theme: 'dark', lang: 'en', embedded: false }`; with `prefersDark=false` the theme is `'light'`.
  - invalid values fall back: `'?theme=blue&lang=fr'` with `prefersDark=true` gives `{ theme: 'dark', lang: 'en', embedded: false }`.
  - `parseParentMessage({ type: 'chartlab:set', theme: 'light' })` equals `{ type: 'chartlab:set', theme: 'light' }`; `{ type: 'x' }`, `null`, `'str'` give `null`; `{ type: 'chartlab:set', theme: 'neon' }` gives `null` (invalid fields are dropped and nothing valid remains); `{ type: 'chartlab:set', theme: 'dark', lang: 'zz' }` gives `{ type: 'chartlab:set', theme: 'dark' }`.
  - `isAllowedParent`: `'http://localhost:3000'` and `'https://disatu-landing.vercel.app'` true; `'https://evil.example'`, `'https://evilvercel.app'`, `'http://localhost:3000.evil.com'`, `'null'`, `''` false.
- [ ] **Step 2: Run** `npx vitest run test/app-embed.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `app/embed.ts` as specified. A leading `*.` in an allowed entry matches any host that ends in `.<rest>` (dot boundary), same scheme required.
- [ ] **Step 4: Run** the same command. Expected: PASS. Then `npm run typecheck`. Expected: no errors (proves `app` is now in the gate).
- [ ] **Step 5: Present the diff and ask for approval to commit** (`feat(app): embed protocol for the ChartLab app`).

### Task 2: ChartLab workspace config and entry

**Files:**
- Create: `app/config.ts`, `app/main.ts`, `app/index.html`
- Create: `test/app-config.test.ts`

**Interfaces:**
- Consumes: `EmbedParams`, `parseParentMessage`, `isAllowedParent` from `app/embed.ts`; `VelaWorkspace`, `type VelaWorkspaceOptions` from `src/workspace`; `BinanceProvider`, `CoinbaseProvider` from `src/data/providers/*`; `registerLocale` from `src/core/i18n`; `src/locales/id` (`LocalePack`).
- Produces: `function buildWorkspaceOptions(p: EmbedParams): VelaWorkspaceOptions`

- [ ] **Step 1: Write the failing tests** in `test/app-config.test.ts` for `buildWorkspaceOptions({ theme: 'light', lang: 'id', embedded: true })`:
  - `layout === false` (one chart), `theme === 'light'`, `locale === 'id'`, `live === true`.
  - `Object.keys(providers)` equals `['binance', 'coinbase']`.
  - `persist` is the string `'chartlab'` (its own storage key).
  - `autofocus === false` when `embedded` is true and `true` when false (never steal the host page's focus).
  - no key named `attribution` anywhere in the options object (`JSON.stringify` of the options with functions dropped does not contain `"attribution"`).
- [ ] **Step 2: Run** `npx vitest run test/app-config.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `app/config.ts` per the interface. `app/main.ts`: read params with `readEmbedParams(location.search, matchMedia('(prefers-color-scheme: dark)').matches)`; if `lang === 'id'` call `registerLocale(id)` first; construct `new VelaWorkspace('#chart', buildWorkspaceOptions(params))`; set `document.body.style.background` from the theme (and again on `theme:changed`); listen for `message`: ignore unless `isAllowedParent(event.origin)` and `event.source === window.parent`, then apply `parseParentMessage` (`ws.setTheme`, `ws.setLocale`); after the first cell's `chart.ready()`, if embedded, post `{ type: 'chartlab:ready' }` to `window.parent` with the target origin taken from `document.referrer` only when `isAllowedParent` accepts it. `app/index.html`: title `ChartLab`, viewport meta, full-height `#chart`, inline script that sets the body background from the same query params before first paint.
- [ ] **Step 4: Run** the tests, then `npm run typecheck`. Expected: PASS, no errors.
- [ ] **Step 5: Present the diff and ask for approval to commit** (`feat(app): ChartLab workspace entry`). The browser proof for this entry is Task 3 Step 6, because it needs the Vite config created there.

### Task 3: Build, notices and Vercel config

**Files:**
- Create: `vite.app.config.ts`, `vercel.json`
- Create: `test/app-deploy.test.ts`
- Modify: `package.json` (scripts only: `"dev:app": "vite --config vite.app.config.ts"`, `"build:app": "vite build --config vite.app.config.ts"`)

**Interfaces:**
- Produces: `npm run build:app` writes a static site to `app/dist`, containing `index.html`, `assets/*`, `LICENSE` and `NOTICE` (emitted by a small inline Vite plugin using `emitFile`, so the files are never duplicated in git). The dev server uses port `5192` with `strictPort`.

- [ ] **Step 1: Write the failing tests** in `test/app-deploy.test.ts`:
  - build through Vite's JS API with `configFile: 'vite.app.config.ts'` and `build.outDir` set to a temp directory: the output contains `index.html`, `LICENSE`, `NOTICE`; `index.html` contains `<title>ChartLab`; the largest `.js` asset is under 2.5 MB.
  - `vercel.json` (parsed): `installCommand` contains `--ignore-scripts`; `buildCommand === 'npm run build:app'`; `outputDirectory === 'app/dist'`; a `headers` entry for `/(.*)` has a `Content-Security-Policy` whose value includes `frame-ancestors`, `http://localhost:3000` and `https://*.vercel.app`; **no** header named `X-Frame-Options` anywhere; a header entry for `/assets/(.*)` sets `Cache-Control` containing `immutable`.
- [ ] **Step 2: Run** `npx vitest run test/app-deploy.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `vite.app.config.ts` (root `app`, `velaUiSource()` plugin as in `vite.config.ts`, the notices plugin, `build.outDir` `app/dist`, `emptyOutDir`), the two scripts, and `vercel.json` with `framework: "vite"`, `installCommand: "npm ci --ignore-scripts"`, the build command and output directory above, and the headers. Confirm `app/dist` is covered by `.gitignore` (`dist/` already matches).
- [ ] **Step 4: Run** the tests, then the full gate: `npm run typecheck && npm run lint && npm test`. Expected: all pass.
- [ ] **Step 5: Clean-clone proof.** `git clone . /tmp/mc-clean && cd /tmp/mc-clean && npm ci --ignore-scripts && npm run build:app`. Expected: succeeds with no `dist/` present; `ls app/dist` shows `index.html NOTICE LICENSE assets`. Remove `/tmp/mc-clean`.
- [ ] **Step 6: Prove the app in a real browser** (AGENTS.md). Run `npm run dev:app`; with a browser tool open `http://localhost:5192/?theme=light&lang=id`. Expected: the workspace renders in the light theme with Indonesian interface text, the Vela watermark is visible, a Binance chart loads, no console errors. Then load it inside a test page `<iframe src="http://localhost:5192/?embed=1">` served from `http://localhost:3000`: `chartlab:ready` arrives at the parent, a `chartlab:set` message from `http://localhost:3000` flips the theme and language, and the same message from another origin does nothing.
- [ ] **Step 7: Present the diff and ask for approval to commit** (`build(app): static ChartLab build and Vercel config`).

### Task 4: Deploy `market-chart` on Vercel

**Files:**
- Modify (after the URL is known): `app/embed.ts` (`ALLOWED_PARENTS`), `vercel.json` (`frame-ancestors`), `test/app-embed.test.ts`

This task needs the user's Vercel login and, for the allow-list, the landing's production domain.

- [ ] **Step 1: Push the branch and merge to `main`** after the user approves (Vercel deploys `main`).
- [ ] **Step 2: Create the Vercel project** from the GitHub repo `putubagus13/market-chart` (dashboard import, or `npx vercel login` then `npx vercel`). Expected: Vercel reads `vercel.json`; no environment variables; Node 24.
- [ ] **Step 3: Verify the deployment.** `curl -sI <url>/` shows `content-security-policy` with `frame-ancestors` and no `x-frame-options`; `curl -s <url>/NOTICE | head -3` prints `Vela`; open `<url>/?theme=dark&lang=en` in a browser: chart renders, watermark visible, no console errors.
- [ ] **Step 4: Add the landing's production domain** (ask the user for it if it is not a `*.vercel.app` URL) to `ALLOWED_PARENTS` and to the `frame-ancestors` list. First add a failing assertion in `test/app-embed.test.ts` (`isAllowedParent('https://<domain>')` is true), see it fail, implement, see it pass, then redeploy.
- [ ] **Step 5: Record the production URL** for Task 8.

---

## Part B: `disatu-landing` (the `/{lang}/chartlab` page)

Repo: `/Users/ekanovanl/Documents/Private_Project/disatu/disatu-landing`. Branch `main`; commit after each task.

### Task 5: Embed URL and message helpers

**Files:**
- Create: `src/lib/chartlab-embed.ts`, `tests/chartlab-embed-lib.test.ts`
- Modify: `src/content/shared.ts` (add `chartlabUrl`), `src/vite-env.d.ts` or the existing env typing file (add `VITE_CHARTLAB_URL`)

**Interfaces:**
- Produces (all exported from `src/lib/chartlab-embed.ts`):
  - `const CHARTLAB_BASE: string` = `import.meta.env.VITE_CHARTLAB_URL ?? shared.chartlabUrl`
  - `const READY_TYPE = 'chartlab:ready'`
  - `type EmbedTheme = 'dark' | 'light'`, `type EmbedLang = 'id' | 'en'`
  - `type ChartLabSet = { type: 'chartlab:set'; theme?: EmbedTheme; lang?: EmbedLang }`
  - `function chartlabEmbedUrl(base: string, p: { theme: EmbedTheme; lang: EmbedLang }): string`
  - `function isFromChartLab(event: { origin: string; source: unknown }, base: string, frame: Window | null): boolean`
  - `function chartlabPath(lang: EmbedLang): string` returning `/${lang}/chartlab`

- [ ] **Step 1: Write the failing tests:**
  - `chartlabEmbedUrl('https://chartlab.example.app', { theme: 'dark', lang: 'id' })` equals `'https://chartlab.example.app/?embed=1&theme=dark&lang=id'`; a base with an existing query (`'https://x.app/?a=1'`) keeps `a=1`.
  - `isFromChartLab({ origin: 'https://chartlab.example.app', source: frame }, 'https://chartlab.example.app/', frame)` is true; a different origin is false; the right origin with `source` not equal to `frame` is false; `frame === null` is false.
  - `chartlabPath('en') === '/en/chartlab'`.
  - `CHARTLAB_BASE` is a valid `https:` URL when `VITE_CHARTLAB_URL` is unset (guards Review Focus 5; the default is the deployed URL placeholder until Task 8).
- [ ] **Step 2: Run** `npx vitest run tests/chartlab-embed-lib.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** the module. `shared.chartlabUrl` starts as a `https://` placeholder (Task 8 sets the real value).
- [ ] **Step 4: Run** the test, `npx tsc --noEmit`. Expected: PASS, clean.
- [ ] **Step 5: Commit** (`feat: ChartLab embed URL and message helpers`).

### Task 6: The `/{lang}/chartlab` page

**Files:**
- Create: `src/routes/$lang/chartlab.tsx`, `src/components/chartlab/chartlab-embed.tsx`, `tests/chartlab-page.test.tsx`
- Modify: `src/content/types.ts` and both `src/content/site.*.ts` (new `chartlabPage` block), `src/components/ui/cursor-tubes.tsx` (off on this route), regenerate `src/routeTree.gen.ts` with `npm run generate-routes`

**Interfaces:**
- Consumes: Task 5 helpers; `useLang()`, `useTheme().resolved`, `useContent()`; `alternateLinks('/chartlab')`.
- Produces: content `chartlabPage: { title: string; description: string; loading: string; fallback: string; openNewTab: string; credit: string }` (id and en); component `ChartLabEmbed()`; route head with `title`, `description`, hreflang alternates.
- Mount: sr-only `<h1>` with `chartlabPage.title`; a slim bar above the frame with the title, a "open in a new tab" link (`target=_blank`, `rel=noopener noreferrer`) to `CHARTLAB_BASE`, and a credit link to `https://velacharts.dev` (text includes "Vela"); the `iframe` (`title` = `chartlabPage.title`, `allow="fullscreen"`, height `calc(100svh - 4rem - <bar>)`, minimum 560 px) with a loading overlay (`data-state="loading" | "ready" | "failed"`).

- [ ] **Step 1: Write the failing tests** in `tests/chartlab-page.test.tsx` (mock the timeout constant to 30 ms):
  - `/id/chartlab` renders one `iframe` whose `src` contains `embed=1`, `theme=` (the current resolved theme) and `lang=id`; `/en/chartlab` has `lang=en`. The page has exactly one `h1`; `document.title` equals `chartlabPage.title` of that language.
  - dispatching a `message` event `{ type: 'chartlab:ready' }` with the iframe origin and the iframe's `contentWindow` as source sets the overlay to `data-state="ready"`; the same message from another origin, or with another source, does not.
  - with no ready message after the timeout the overlay is `data-state="failed"` and the fallback text and a link to `CHARTLAB_BASE` are visible; the "open in a new tab" link and the credit link exist in every state.
  - toggling the theme posts `{ type: 'chartlab:set', theme }` to the iframe's `contentWindow.postMessage` (spy) with the target origin equal to the app's origin (never `'*'`); navigating `/id/chartlab` to `/en/chartlab` posts `{ type: 'chartlab:set', lang: 'en' }`.
  - `CursorTubes` renders nothing on `/id/chartlab` and still renders on `/id`.
  - hreflang alternates include `id` and `en` pointing at `/id/chartlab` and `/en/chartlab`.
- [ ] **Step 2: Run** `npx vitest run tests/chartlab-page.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** content (both languages, same shape; copy in the project's voice: benefit first, no profit promises; Indonesian title "ChartLab: platform trading crypto gratis"), the component and route, the `CursorTubes` guard (read the router location; no new dependency), then `npm run generate-routes`.
- [ ] **Step 4: Run** the new tests and then the whole suite (`npx vitest run`) and `npx tsc --noEmit`. Expected: all pass (existing route-order and header tests are unaffected because the page is a new route).
- [ ] **Step 5: Commit** (`feat: /{lang}/chartlab page embedding the ChartLab app`).

### Task 7: Point every "Try ChartLab" call to action at the page

**Files:**
- Modify: `src/components/layout/site-header.tsx`, `src/components/sections/hero.tsx`, `src/components/sections/offer-cta.tsx`, `src/components/sections/chartlab-section.tsx`, `src/components/about/founder-section.tsx`; `src/content/shared.ts` and `src/content/types.ts` (remove the placeholder `appUrl`); both `src/content/site.*.ts` (drop `chartlab.appUrl`)
- Modify tests: `tests/hero.test.tsx`, `tests/chartlab-section.test.tsx`, `tests/about-route.test.tsx`, `tests/button.test.tsx`, `tests/content.test.ts`, `tests/chartlab-brand.test.tsx` (anything asserting `chartlab.appUrl` or `target=_blank` for these links)

**Interfaces:**
- Consumes: `chartlabPath(lang)` from Task 5.
- Produces: all these `LinkButton`s are internal (no `external`), `href` is `chartlabPath(lang)`; the `.shiny-cta` style is unchanged.

- [ ] **Step 1: Update the tests first** so they expect the new behaviour: for each link named `c.ui.tryFree`, `c.ui.openApp`, `c.ui.aboutCta` the `href` equals `/${lang}/chartlab` and it has **no** `target="_blank"`; the content test no longer references `chartlab.appUrl`; add a content test that no string anywhere equals or contains `example.com` (this retires the long-standing placeholder).
- [ ] **Step 2: Run** `npx vitest run`. Expected: FAIL in the files above.
- [ ] **Step 3: Implement** the component and content changes.
- [ ] **Step 4: Run** `npx vitest run && npx tsc --noEmit`. Expected: all pass.
- [ ] **Step 5: Commit** (`feat: ChartLab calls to action open the embedded page`).

### Task 8: Connect the real app URL, ship and verify

**Files:**
- Modify: `src/content/shared.ts` (`chartlabUrl` = the production URL from Task 4), `README.md` (document `VITE_CHARTLAB_URL`, default `https://…` and the local override `http://localhost:5192`)

- [ ] **Step 1: Set** `shared.chartlabUrl` to the URL recorded in Task 4 and update the README section. Update the `tests/chartlab-embed-lib.test.ts` default-URL test to assert the real host.
- [ ] **Step 2: Run** `npx tsc --noEmit && npx vitest run && npm run build`. Expected: all pass.
- [ ] **Step 3: Commit and push** to `main` (Vercel deploys the landing automatically).
- [ ] **Step 4: Verify in production** with a real browser: `<landing>/id/chartlab` shows the app inside the page, no console errors (in particular no "refused to display in a frame" error); toggling the landing's theme changes the chart's theme; switching ID to EN changes the interface language; the home page "Coba ChartLab Gratis" button lands on the page; on a 375 px viewport the page does not scroll horizontally. If the frame is refused, the fix is in Task 4 step 4 (`frame-ancestors`), not here.
- [ ] **Step 5: Report** the two production URLs and anything that differed from this plan.
