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
   | Build Command      | **`npm run build:static`** — REQUIRED for SEO (see below) |
   | Output Directory   | `dist`                   |
   | Install Command    | `npm install`            |
   | Node.js Version    | 18.x or 20.x             |

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
