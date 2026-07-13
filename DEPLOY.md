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

## Pointing eba.academy at it (domain is at 123 Reg)

Pre-flight (found via live DNS, 13 Jul 2026): `eba.academy` + `www` currently
point at a holding page (`185.179.91.174`); nameservers `ns53.io`/`ns53.be`;
no MX records; a `v=spf1 -all` TXT says "this domain sends no email" — it must
be replaced during email setup (below) or all outbound mail will bounce.

1. **Vercel** ([vercel.com](https://vercel.com) → the eba-site project →
   **Settings → Domains**):
   - **Add** `eba.academy` — assign to Production.
   - **Add** `www.eba.academy` — choose **Redirect to eba.academy** (308).
   - Vercel will show the DNS records it needs (step 2) and verify them
     automatically once they exist.
2. **123 Reg** (Control Panel → **Domain names** → `eba.academy` → **Manage**
   → **Manage DNS** → *Advanced DNS*):
   - **Delete** the existing `A` record for `@` (points at the holding page).
   - **Delete** any `A`/`CNAME` record for `www` doing the same.
   - **Add** `A` · host `@` · value `76.76.21.21`.
   - **Add** `CNAME` · host `www` · value `cname.vercel-dns.com`.
   - Leave the nameservers alone — records-only is all Vercel needs.
3. **Check the Production Branch** (Vercel → Settings → Git → Production
   Branch): it must be the branch this site actually lives on, otherwise the
   domain will serve the wrong build.
4. Wait for DNS (123 Reg TTL is typically 1 hour; often minutes). Vercel
   provisions HTTPS automatically. The canonical domain everywhere in the code
   is already `https://eba.academy`, and the Plausible analytics tag already
   covers both `eba.academy` and `eba-site.vercel.app`, so stats survive the
   move.
5. Afterwards: submit `https://eba.academy/sitemap.xml` in Google Search
   Console (verify the domain there with a TXT record from the same 123 Reg
   DNS panel).

## Email on eba.academy (none exists yet)

The site's legal pages promise `hello@eba.academy` — that mailbox must be real
and monitored before launch. Recommended: **Google Workspace Business Starter**
(≈ £5.75 + VAT per user/month) bought direct from
[workspace.google.com](https://workspace.google.com) — best deliverability and
the DKIM/SPF story Klaviyo/Kajabi sending will later build on. (Zoho Mail's
free tier works if budget is zero, same DNS pattern.)

Setup, all DNS at the same 123 Reg panel:

1. Sign up at workspace.google.com with domain `eba.academy`; create users
   (e.g. `mark@`, `ste@`) and the shared `hello@` (a user or a free alias).
2. **Verify the domain**: Google gives a `google-site-verification=…` TXT —
   add it at 123 Reg.
3. **MX**: add what the wizard shows — modern setups use a single record:
   host `@` · `smtp.google.com` · priority `1`.
4. **SPF**: **delete** the `v=spf1 -all` TXT record, add
   `v=spf1 include:_spf.google.com ~all`. (Skipping the delete leaves two SPF
   records — an invalid state that hurts deliverability.)
5. **DKIM**: Google Admin → Apps → Google Workspace → Gmail → *Authenticate
   email* → generate → add the `google._domainkey` TXT at 123 Reg → *Start
   authentication*.
6. **DMARC**: add TXT · host `_dmarc` · value
   `v=DMARC1; p=none; rua=mailto:hello@eba.academy` — monitor for a couple of
   weeks, then tighten `p=none` → `p=quarantine`.
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
