# Deploying the EBA site to Vercel

The site is a **static Vite + React (TypeScript) SPA**. No backend, no env vars
required — every integration falls back to a safe placeholder until you wire it.

## Quick deploy (recommended for the demo)

1. Push this repo to GitHub (already on branch `claude/new-session-60ynut`).
2. In Vercel: **Add New… → Project** and import the repo.
3. Vercel auto-detects Vite. Confirm these settings:

   | Setting            | Value                    |
   | ------------------ | ------------------------ |
   | Framework Preset   | **Vite**                 |
   | Build Command      | set in `vercel.json` — leave the dashboard field EMPTY |
   | Output Directory   | set in `vercel.json` (`dist`) |
   | Install Command    | `npm install`            |
   | Node.js Version    | **22.x** — required by `@sparticuz/chromium` / `puppeteer-core` (the Toolbox Talk Generator's PDF renderer, see below). 18.x/20.x will fail to install these. |

   > ⚠️ **The build command lives in `vercel.json` (`buildCommand: npm run build:vercel`),
   > NOT in the Vercel dashboard.**
   >
   > This regressed once and cost the site its entire search visibility. Between
   > 13 Jul and 2 Aug 2026 the dashboard build command was never set to
   > `build:static`, so Vercel ran its default `npm run build`. react-snap never
   > ran in deployment. The live site served a 1.9 KB shell — a title tag, a
   > viewport meta, no body — and **every sub-route returned HTTP 404**.
   > Google saw nothing. Nobody noticed for three weeks.
   >
   > Keeping it in `vercel.json` means it is version-controlled and reviewable.
   > A dashboard setting is invisible in the repo and silently forgettable.
   >
   > `build:vercel` runs the Vite build, then attempts react-snap. **A prerender
   > failure is tolerated** — it prints `PRERENDER FAILED` to the build log and
   > deploys the SPA shell rather than failing the deploy and taking production
   > down. Check the build log for that warning after any dependency change.

   **Building locally:** react-snap's bundled Chromium is from 2019 and will not
   launch in most modern containers (`libXss.so.1` missing). Pass a working
   browser explicitly:

   ```bash
   PUPPETEER_EXECUTABLE_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
     npm run build:static
   ```

   Do NOT hardcode that path back into `package.json` — it only exists in the dev
   container and breaks the Vercel build.

   **After any deploy, verify prerendering actually happened:**

   ```bash
   curl -s https://teb-academy.com/academy | wc -c     # expect ~70000, not ~1900
   curl -so /dev/null -w '%{http_code}' https://teb-academy.com/pricing   # expect 200
   ```

4. Deploy. `vercel.json` adds an SPA rewrite so deep links (`/academy`,
   `/ai-tools/om-manual`, …) resolve to `index.html` instead of 404-ing, and
   serves any prerendered static file first (see below).

## Custom domain: teb-academy.com — ALREADY CONNECTED

Verified live 13 Jul 2026: `teb-academy.com` serves the site from Vercel
(A `@` → `216.198.79.1`, CNAME `www` → `cname.vercel-dns.com`) with valid
HTTPS. The domain is registered at **123 Reg** and DNS is edited in the
123 Reg panel (Manage DNS). Note: the nameservers show as
`ns6x.domaincontrol.com` — that IS 123 Reg's DNS platform (123 Reg is a
GoDaddy company; domaincontrol.com is their shared infrastructure). The
unused `eba.academy` domain is a different registration and is not the
site's domain. All canonical URLs, sitemap, robots and the Plausible
`data-domain` in this repo use `https://teb-academy.com`.

Remaining domain to-dos:
- Submit `https://teb-academy.com/sitemap.xml` in Google Search Console
  (verify ownership with a TXT record in the GoDaddy DNS panel).
- Plausible: make sure the site in plausible.io is registered as
  `teb-academy.com` so the analytics tag matches.

## Email on teb-academy.com (none exists yet)

Verified 13 Jul 2026: the domain has **no MX records** — no email exists.
The site's legal pages promise `hello@teb-academy.com`; that mailbox must be
real and monitored before launch. Recommended: **Google Workspace Business
Starter** (≈ £5.75 + VAT per user/month) from
[workspace.google.com](https://workspace.google.com) — best deliverability and
the DKIM/SPF foundation Klaviyo/Kajabi sending will later build on. (Zoho
Mail's free tier works if budget is zero, same DNS pattern.)

All DNS records below go in the **123 Reg panel** (Domain names →
teb-academy.com → Manage DNS):

1. Sign up at workspace.google.com with domain `teb-academy.com`; create users
   (e.g. `mark@`, `ste@`) and the shared `hello@` (a user or a free alias).
2. **Verify the domain**: Google gives a `google-site-verification=…` TXT —
   add it at 123 Reg.
3. **MX**: as the wizard shows — modern setups use a single record:
   host `@` · `smtp.google.com` · priority `1`.
4. **SPF**: add TXT · host `@` · `v=spf1 include:_spf.google.com ~all`
   (only one SPF TXT record may exist on the domain).
5. **DKIM**: Google Admin → Apps → Google Workspace → Gmail → *Authenticate
   email* → generate → add the `google._domainkey` TXT at 123 Reg → *Start
   authentication*.
6. **DMARC**: add TXT · host `_dmarc` · value
   `v=DMARC1; p=none; rua=mailto:hello@teb-academy.com` — monitor for a couple
   of weeks, then tighten `p=none` → `p=quarantine`.
7. Free aliases as needed: `support@`, `enquiries@` → `hello@`.

Later (separate DNS entries, do not reuse the Google ones): Klaviyo's dedicated
sending domain and Kajabi's custom email domain each add their own CNAME/DKIM
records when those senders go live.

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

## Toolbox Talk Generator — free tier + the Academy-member "full version"

`/toolbox-talk` is a real, working generator (not the email-capture stub the
`ToolboxLeadMagnet` section used to be): visitor types a topic, the backend
calls Claude for a structured UK toolbox talk, renders it as a branded A4 PDF
(headless Chromium), shows it on screen instantly, and emails a copy. Two
modes, one page — see `client/src/pages/ToolboxTalkPage.tsx` and
`api/generate-toolbox-talk.ts` + `api/lib/`:

- **Public** (no `?access=` param) — email-gated, rate-limited (5/email/day,
  15/IP/day). This is "the free basic version" promised on `/ai-tools`.
- **Academy member** (`?access=<token>`, delivered by email after a Kajabi
  purchase — see below) — no email step, effectively unlimited. This is "the
  full Toolbox Talk Generator... included with every Academy enrolment"
  promised on the FAQ and pricing pages.

**Required to go live** (all server-side secrets — Vercel → Settings →
Environment Variables, never committed):

1. **`ANTHROPIC_API_KEY`** (see above) — without it, both modes return 501 and
   the page shows "Opening shortly." Uses `claude-sonnet-5`, structured JSON
   output.
2. **`DATABASE_URL`** — a Postgres connection string (Neon serverless driver;
   works with Neon, Supabase, or any standard Postgres). One table for the
   free-tier lead log + rate limit (`toolbox_generations`), one for Academy
   member entitlements (`academy_members`) — both created automatically on
   first request. **Without this, rate limiting is skipped (fail-open) and
   member access links can't be granted** — set it before launch.
3. **`RESEND_API_KEY`** + **`RESEND_FROM_EMAIL`** — a [Resend](https://resend.com)
   account with a verified sending domain (`teb-academy.com`), for emailing
   the free-tier PDF copy and the member's access link. If unset, the free
   tier still fully works (PDF renders/downloads, just isn't emailed); member
   access links simply can't be sent until this is set.
4. **`KAJABI_WEBHOOK_SECRET`** (already set for `/api/kajabi-webhook`) is
   reused as-is by the new `/api/toolbox-talk-grant` endpoint — one secret,
   two Kajabi automation steps on the same purchase trigger. See
   `docs/TOOLBOX_TALK_GRANT_RUNBOOK.md` for the exact Kajabi dashboard steps
   Ste/Mark need to add.

**PDF rendering** uses `puppeteer-core` + `@sparticuz/chromium` (a
Lambda-compatible headless Chromium build) — this is why
`api/generate-toolbox-talk.ts` runs on Vercel's **Node.js** runtime, not Edge
(Edge can't launch a browser). `vercel.json`'s `functions` block gives this
one route extra `memory` (2048 MB) and `maxDuration` (60s) for the Chromium
launch + Claude call + email send. `/api/toolbox-talk-grant` stays on Edge,
same as `/api/kajabi-webhook` — it only talks to Postgres and Resend, no
browser needed.

Fonts (Inter) are embedded as base64 in the generated HTML so the PDF renders
identically regardless of network access at request time — see
`api/lib/pdf/brand.ts`.
