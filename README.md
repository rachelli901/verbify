# Verbify

**Turn Chinese resume verbs into English action verbs — free, browser-only, no AI, no account, no tracking.**

Verbify is a static web tool that helps Chinese-speaking job seekers write stronger English résumés. It parses a résumé and a job description, suggests English action verbs to replace vague Chinese-origin phrasing, flags sensitive / location-biased fields, and checks formatting — all **client-side in the browser**. There is no backend, no database, and no AI call; everything runs as static HTML shipped to the visitor.

---

## ✨ Features

- **Resume Reviewer** (`/tools/resume-reviewer`) — paste a résumé and a job description, get back:
  - Action-verb suggestions (replace weak/vague phrasing with strong English verbs)
  - Sensitive-field detection (e.g. photo, age, marital status, national ID) with **country-scoped rules** (`appliesTo`)
  - Format checks (length, bullet structure, contact lines)
  - A keyword-gap view comparing your résumé against the JD
- **Writing guides** (`/guides`) — 8 long-form, editor-reviewed guides on English-résumé writing for Chinese speakers.
- **Examples** (`/examples`) — before/after bullet rewrites.
- **Bilingual UI** — English / 中文, instant switch, no page reload. State persisted in `localStorage`.
- **SEO-ready** — `hreflang` alternates (`en` / `zh-CN` / `x-default`), canonical links, Open Graph / Twitter cards, auto-generated `sitemap.xml`.
- **AdSense-ready** — advertising slots and a GDPR-style cookie-consent gate are wired, but **dormant until you supply your own publisher ID** (see [Configuration](#configuration)). No ad code loads without explicit consent.
- **Privacy-first** — no analytics, no third-party calls, no personal data leaves the browser.

---

## 🧱 Tech stack

| Layer | Choice |
|---|---|
| Framework | [Astro 7](https://astro.build) (SSG, zero JS by default) |
| UI islands | [Vue 3](https://vuejs.org) (`@astrojs/vue`) |
| Styling | Scoped `<style>` + design tokens (no CSS framework) |
| i18n | Hand-rolled single-source dictionary (`data-i18n` + `localStorage`) |
| Sitemap | `@astrojs/sitemap` |
| Tests | [Vitest 5](https://vitest.dev) (pure logic + integration) |
| Output | Static HTML — deploy to any static host / CDN |

Runtime dependencies are intentionally minimal: `astro`, `vue`, `@astrojs/vue`, `@astrojs/sitemap`. Dev-only: `vitest`.

---

## 📂 Project structure

```
verbify/
├── astro.config.mjs          # site URL (placeholder) + vue/sitemap integrations
├── .env.example              # AdSense publisher/slot IDs (copy → .env)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro   # <head> SEO, hreflang, consent listener, ad slots
│   ├── pages/                # routes (19 pages built)
│   │   ├── index.astro
│   │   ├── tools/resume-reviewer.astro
│   │   ├── guides/  examples/  about/  contact/
│   │   └── privacy-policy/  terms/  disclaimer/  404.astro
│   ├── components/
│   │   ├── LanguageSwitcher.vue
│   │   ├── CookieConsent.astro
│   │   ├── ads/AdSlot.astro
│   │   ├── layout/{Header,Footer}.astro
│   │   └── tools/ResumeReviewer.vue
│   ├── lib/                 # pure logic (no DOM)
│   │   ├── i18n/           # strings.ts (single source) + init.ts
│   │   ├── rules/          # verbs.ts, sensitive.ts (rule data)
│   │   ├── resume-parser.ts  jd-parser.ts  verb-suggester.ts
│   │   ├── sensitive-checker.ts  format-checker.ts
│   │   ├── exporter.ts  print-export.ts  adsense.ts  types.ts
│   └── content/
│       ├── guides/   (8 markdown articles, Zod-validated frontmatter)
│       └── examples/ (before/after rewrites)
├── tests/                   # 25 Vitest cases (5 files)
└── docs/                    # verbify-technical-doc.md, adsense-*.md
```

**Rule engine flow:** `resume-parser` + `jd-parser` → `verb-suggester` / `sensitive-checker` (driven by `rules/`) → `format-checker` orchestrates → `exporter` / `print-export` produce the result.

---

## 🚀 Getting started

### Prerequisites

- **Node.js 22+** (developed on v22.22; v20+ should work for Astro 7)
- npm (or pnpm / yarn — swap the install command)

### Install & run

```bash
# 1. install dependencies
npm install

# 2. start the dev server (http://localhost:4321)
npm run dev

# 3. production build → ./dist
npm run build

# 4. preview the built site locally
npm run preview

# 5. run the test suite
npm test
```

> The site builds to pure static files in `dist/`. Deploy that folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, an S3 bucket + CDN, etc.).

---

## ⚙️ Configuration

### 1. Site URL (required before deploy)

`astro.config.mjs` ships with a **placeholder** `site`:

```js
export default defineConfig({
  site: 'https://verbify.example.com', // ← replace with your real domain
  integrations: [vue(), sitemap()],
});
```

The `site` value feeds the canonical URLs, `sitemap.xml`, and `hreflang` links. **Swap it for your real domain** or search engines will index the wrong URL.

### 2. AdSense (optional)

Advertising is fully wired but **off by default**. To enable:

```bash
cp .env.example .env
```

Then fill in your own IDs from the AdSense dashboard:

```env
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXX
PUBLIC_ADSENSE_SLOT_HEADER=
PUBLIC_ADSENSE_SLOT_FOOTER=
PUBLIC_ADSENSE_SLOT_CONTENT=
```

Rules:

- All `PUBLIC_*` vars are client-exposed by design (they're public ad-unit identifiers, not secrets). They are **never hardcoded** in source — missing values simply make the ad slots render nothing.
- Ads load **only after** the visitor accepts the cookie-consent banner (`BaseLayout` listens for `verbify:consent-granted`). No consent → no ad script.

---

## 🌐 Internationalization

- Single dictionary of truth: `src/lib/i18n/strings.ts` (`en` / `zh`).
- Every translatable string on a page carries a `data-i18n="namespace.key"` attribute; `applyI18nToDocument()` swaps text in place.
- Switching language updates `<html lang>` and re-renders instantly — **no full reload**.
- SEO: each page emits `hreflang` alternates for `en`, `zh-CN`, and `x-default`, all pointing at the same canonical URL (the site uses one URL for both languages; there are no separate `/zh/` routes).

---

## 🔍 SEO & AdSense readiness

| Item | Status |
|---|---|
| `sitemap.xml` (via `@astrojs/sitemap`) | ✅ generated on build |
| `robots.txt` | ✅ present in `public/` |
| Canonical + `hreflang` | ✅ on every page |
| Privacy / Terms / Disclaimer / Contact pages | ✅ all present |
| "Advertisement" label on ad slots | ✅ rendered by `AdSlot.astro` |
| Cookie consent gate before ads | ✅ `CookieConsent.astro` |
| Real, unique domain | ⚠️ **you must register & set `site`** (only hard blocker) |
| Sufficient original content | ✅ 8 guides + examples + tool |

> The technical write-up lives in [`docs/verbify-technical-doc.md`](docs/verbify-technical-doc.md); AdSense-specific notes in [`docs/adsense-readiness.md`](docs/adsense-readiness.md) and [`docs/adsense-policy-compliance.md`](docs/adsense-policy-compliance.md).

---

## 🧪 Testing

```bash
npm test        # vitest run — 25 cases across 5 files
```

Coverage spans the parsers (`resume-parser`, `jd-parser`), `verb-suggester`, `sensitive-checker`, `exporter`, and an end-to-end integration flow. Logic is kept DOM-free in `src/lib`, so it tests without a browser.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run the Vitest suite once |

---

## 📌 Notes & known limitations

- **One URL, two languages.** Crawlers receive `lang="en"` HTML; Chinese content appears after the client script runs. `hreflang` signals the Chinese variant. If you later need a natively `lang="zh-CN"` indexed page, split Chinese into `/zh/` routes (not yet implemented).
- **No backend by design.** All processing is in-browser; nothing is uploaded or stored.
- This is a personal / portfolio project. The rule data in `src/lib/rules` is curated, not exhaustive — extend it as needed.

---

## 📄 License

ISC. See `package.json`. (Content in `src/content/guides` is editor-reviewed and free to read; reuse per the license.)
