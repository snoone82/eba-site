# Deploying the EBA site to Vercel

The site is a **static Vite + React (TypeScript) SPA** with a couple of small
**Vercel serverless functions** under `api/` (the homepage assistant, and the
free Toolbox Talk Generator). No env vars are required to deploy — every
integration falls back to a safe placeholder or a "not configured" state until
you wire it.

## Quick deploy (recommended for the demo)

1. Push this repo to GitHub (already on branch `claude/new-session-60ynut`).
2. In Vercel: **Add New… → Project** and import the repo.
3. Vercel auto-detects Vite. Confirm these settings:

   | Setting            | Value                    |
   | ------------------ | ------------------------ |
   | Framework Preset   | **Vite**                 |
   | Build Command      | **`npm run build:static`** — REQUIRED for SEO (see below) |
   | Output Directory   | `dist`                   |
   | Install Command    | `npm install`            |
   | Node.js Version    | **22.x** (required by `@sparticuz/chromium` / `puppeteer-core` — the Toolbox Talk Generator's PDF renderer) |

   > ⚠️ **The Build Command MUST be `npm run build:static`, not `npm run build`.**
   > `build:static` runs the Vite build **and react-snap prerendering**, writing a
   > real HTML file per route (unique <title>, meta, JSON-LD and full content) so
   > crawlers and link previews see complete pages. Plain `npm run build` ships an
   > empty SPA shell and the SEO work stays dormant. If react-snap ever fails on
   > Vercel's build image, fall back to `npm run build` (the site still works as a
   > SPA) and investigate — do not ship a broken build.

4. Deploy. `vercel.json` adds an SPA rewrite so deep links (`/academy`,
   `/ai-tools/om-manual`, …) resolve to `index.html` instead of 404-ing, and
   serves any prerendered static file first (see below).

## Pointing eba.academy at it

1. Vercel project → **Settings → Domains → Add** → `eba.academy` (and
   `www.eba.academy`).
2. At your DNS provider, add the records Vercel shows — typically:
   - `A` record for the apex `eba.academy` → `76.76.21.21`, **or** a Vercel
     `CNAME`/`ALIAS` if your DNS supports apex CNAME.
   - `CNAME` for `www` → `cname.vercel-dns.com`.
3. Vercel provisions HTTPS automatically. The canonical domain everywhere in the
   code is already `https://eba.academy`.

## SEO prerendering (optional, recommended after the demo)

`npm run build` ships a single-page app. Per-route `<title>`, `<meta
description>`, canonical, Open Graph / Twitter tags and JSON-LD are applied
client-side via `react-helmet-async` — **Google renders JS, so it sees them**.
This is verified working for every route.

For crawlers that do **not** run JS (LinkedIn / X / Facebook link previews),
ship real static HTML per route with **react-snap** (already configured):

```bash
npm run build:static   # = vite build + react-snap prerender into dist/
```

To make Vercel do this, set the **Build Command** to `npm run build:static`.
react-snap downloads a compatible Chromium during `npm install` and writes a
static HTML file per route listed under `reactSnap.include` in `package.json`.
`vercel.json` already serves those files before falling back to the SPA.

Tradeoff / note: react-snap is the zero-routing-change option (the project uses
`wouter`, which `vite-react-ssg` does not support without a routing rewrite).
It could not be fully verified in the build sandbox here because external fonts/
images are network-blocked there; it runs cleanly in a normal build environment.
If `build:static` ever fails a deploy, revert the Build Command to `npm run build`
— the SPA is fully functional and SEO-complete for JS-capable crawlers.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production SPA → dist/
npm run preview    # serve dist/ locally
npm run typecheck  # tsc --noEmit
```

## Configuration

All integrations live in `client/src/lib/constants.ts` and can be set there or
via `VITE_*` env vars (see `.env.example`). Until set, CTAs and forms fail safe
("Enrolment opens soon" / "Form coming soon") instead of linking to dead URLs or
faking submissions. Search the code for `TODO(eba):` for the full list.

## EBA Assistant — turning on the live AI chat

The homepage assistant works out of the box using a built-in **knowledge base**
(accurate, curated EBA answers — no cost, no config). To upgrade it to a **live
Claude-powered** chatbot, add one server-side secret:

1. Get an API key from the [Anthropic Console](https://console.anthropic.com/)
   → **API Keys** (starts with `sk-ant-…`). Note the API is **paid/metered** —
   the assistant uses the fast, low-cost `claude-haiku-4-5` model (a fraction of
   a penny per conversation), billed to your Anthropic account.
2. In **Vercel → your project → Settings → Environment Variables**, add:

   | Name                | Value                | Environments            |
   | ------------------- | -------------------- | ----------------------- |
   | `ANTHROPIC_API_KEY` | `sk-ant-…` (your key)| Production (+ Preview)  |

   **Do not** prefix it with `VITE_` (that would expose it to the browser) and
   **never** commit it to the repo.
3. **Redeploy** (Deployments → ⋯ → Redeploy, or push a commit). Done.

How it behaves:
- **Key set** → `/api/assistant` (a Vercel Edge function) answers via the Claude
  API, grounded by an EBA system prompt so it stays accurate and on-brand.
- **Key missing or any error** → the widget silently falls back to the local
  knowledge base, so the chat always works. You can leave the key off until
  you're ready to go live.

To point the widget at a different backend instead, set `VITE_ASSISTANT_ENDPOINT`
to its URL (optional; defaults to `/api/assistant`).

## Toolbox Talk Generator — the free, public lead magnet

`/toolbox-talk` is a public, no-login tool: visitor types a topic (+ optional
trade/site) and an email, the backend calls Claude for a structured UK toolbox
talk, renders it as a branded A4 PDF (headless Chromium), shows it on screen
instantly, and emails a copy. It's the free demo that feeds the paid AI-tool
suite and the course — see `client/src/pages/ToolboxTalkPage.tsx` and
`api/generate-toolbox-talk.ts` + `api/lib/`.

**Required to go live:**

1. **`ANTHROPIC_API_KEY`** (see above) — without it the endpoint returns 501
   and the page shows "Opening shortly." The generation call uses
   `claude-sonnet-5` with structured JSON output (server-side only).
2. **`DATABASE_URL`** — a Postgres connection string (this project uses the
   [Neon](https://neon.tech) serverless driver, which works with Neon, the
   Vercel Postgres/Neon marketplace integration, Supabase, or any standard
   Postgres). Backs a single `toolbox_generations` table that doubles as the
   **lead log** (source-tagged, for CRM export) and the **rate-limit ledger**
   (5 generations/email/day, 15/IP/day — tune in `api/lib/db.ts`). The schema
   is created automatically on first request (`CREATE TABLE IF NOT EXISTS`).
   **Without this set, rate limiting is skipped entirely (fail-open)** — fine
   for local dev, but set it before a public launch so a single email/IP can't
   run up your Anthropic bill.
3. **`RESEND_API_KEY`** + **`RESEND_FROM_EMAIL`** — a [Resend](https://resend.com)
   account with a verified sending domain, for "email a copy of the PDF." If
   unset, the tool still fully works (PDF renders on screen + downloads) — it
   just skips the email step, and the page shows "Couldn't email a copy — use
   the download button" rather than failing the request.

**PDF rendering** uses `puppeteer-core` + `@sparticuz/chromium` (a
Lambda-compatible headless Chromium build) — this is why `api/generate-toolbox-talk.ts`
runs on Vercel's **Node.js** runtime, not Edge (Edge can't launch a browser).
`vercel.json` gives this one function extra `memory` (2048 MB) and
`maxDuration` (60s) headroom for the Chromium launch + Claude call + email
send; adjust for your Vercel plan's limits if needed. Locally, set
`PUPPETEER_EXECUTABLE_PATH` to a real Chromium/Chrome binary to test the
endpoint outside Vercel (`@sparticuz/chromium`'s binary is built for the
Lambda/Vercel runtime and won't run on an arbitrary dev machine).

Fonts (Inter) are embedded as base64 in the generated HTML so the PDF renders
identically regardless of network access at request time — see
`api/lib/pdf/brand.ts`.
