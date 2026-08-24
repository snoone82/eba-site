# TEBA — full handover brief

Paste this into a new Claude session to bring it fully up to speed.
Last verified: 5 August 2026. Every status below was checked live, not recalled.

---

## The business

**The Engineering Business Academy (TEBA)** — teb-academy.com
Business growth training and AI compliance tools for M&E and building services contractors.

- **Mark Poulton** — founder, front of the Academy. 25 years running M&E contracting.
- **Ste** — Head of Automation at KEYIS Group, built the AI tools. Technical authority
  behind the product (not positioned as a co-founder).
- **KEYIS Group** — the operating engineering group. Tools were built there first, on live
  projects, then productised for TEBA.
- **Launch target: Monday 17 August 2026** (moved from 3 Aug). NOTE: the public
  holding page no longer states a date — `LAUNCH_DATE_LABEL` was changed to
  "Coming soon" by another session, so no public commitment has been made.

**What's sold:** Academy course (£999 founding / £1,499 standard; £1,299 / £1,999 with the
380-document library), AI tools (RAMS £39/mo, COSHH £29/mo, both £49/mo — standard tiers
£49/£39/£69), Compliance Co-Pilot (£499 setup + £149/mo founding; £1,999 + £199/mo standard),
O&M compiler (£299/manual, compiled-for-you service), mentorship.

---

## Current state — verified live

**Website — teb-academy.com**
- Holding page live on EVERY route. Launch date, waitlist, social links. No prices,
  no purchase paths, nothing half-finished reachable.
- `/`, `/pricing`, `/academy` all 200. `www` 301s to bare domain. `/api/lead` healthy (422 on empty).
- Controlled by ONE flag: `COMING_SOON = true` in `client/src/lib/constants.ts`.
  Set false to restore the entire site untouched underneath.
- Stack: Vite 5 + React 18 + TypeScript, wouter routing, deployed on Vercel.
- Production branch: `claude/new-session-60ynut` (there is no `main`).

**⚠️ Prerendering is OFF and this is a launch blocker.** react-snap cannot run on Vercel's
build image (its bundled Chromium is from 2019, missing libXss). Confirmed by testing, not
assumed. Google currently sees a 1.9KB shell. Fine for a holding page; fatal at launch.
**Needs rebuilding in GitHub Actions with a modern Chromium.** Locally it works via
`PUPPETEER_EXECUTABLE_PATH=/path/to/chrome npm run build:static`.

**Kajabi** (site 2148787052)
- Course exists: 10 modules, 101 lessons, matching the website exactly.
- ⚠️ **ALL 10 modules and ALL 101 lessons are `publishing_state: draft`.** Only 6 of 101
  lessons have video attached — **95 still to record.** A buyer would get an empty course.
- An empty module called "Paywall Wrapper" is buyer-visible. Delete it.
- **ZERO published offers** — deliberately unpublished 5 Aug ("we don't want anything
  available for sale at the moment"). Offer IDs: 2151280639 (£999), 2151280640 (£1,299),
  2151280641 (£1,499 draft), 2151280642 (£1,999 draft).
- Checkout tokens (Kajabi-generated, NOT derivable from offer IDs, preserved in a comment
  in constants.ts): xWR6J4tA (£999), HYFbPnn9 (£1,299).
- CRM tag layer built: 6 pipeline stage tags, 4 source, 3 interest, 5 saved segments.
  **Keep these** — they drive Kajabi email automations even now HubSpot is the CRM.

**HubSpot** — the CRM (Mark's decision, 5 Aug)
- Two deal pipelines live: **Academy** (New Lead → Contacted → In Conversation →
  Application/Checkout Started → Closed Won/Lost) and **Tools & Enterprise**
  (Enquiry → Discovery → Demo/Trial → Proposal → Negotiation → Closed Won/Lost).
- 12 contact properties + 3 company properties provisioned.
- `/api/lead` (Vercel edge function) writes leads straight in. Verified end to end.
- Provisioner: `scripts/hubspot_crm_setup.mjs` — idempotent, supports `--dry-run` / `--verify`.
- Still to do by hand (no API): saved deal views, lifecycle stage automation.
  See `scripts/HUBSPOT_CRM_RUNBOOK.md §4`.

**Lead capture & attribution — working**
- Captures email, name, phone, company, message, product interest, which form, and
  **full source attribution**: Facebook / LinkedIn / Instagram / YouTube / search / direct.
- Works via UTM tags AND automatically via referrer for untagged links.
- Never duplicates (matched on email). Lifecycle set to "lead" only on first sight.
- If a HubSpot property is missing it strips custom fields and retries — a lead is never lost.
- **Tag social links like this:**
  `https://teb-academy.com/?utm_source=instagram&utm_medium=social&utm_campaign=launch`
- Full detail: `scratchpad/TEBA_LEAD_CAPTURE.md`

**Social**
- Facebook, Instagram, YouTube — all live on **@engineeringbusinessacademy**
- LinkedIn company page created (logo + cover + full profile).
  URL: linkedin.com/company/engineeringbusinessacademy
- ⚠️ LinkedIn is NOT yet in `SOCIAL_LINKS` in constants.ts — add once the slug is confirmed.
- 4 of 8 launch social tiles designed and approved; tiles 1, 2, 6, 8 need images.

**Brand — "Drawing Office II" palette (locked)**
- ink #0A0A0A, paper #F6F5F3, BRASS #C9982E (Academy accent + the ONLY CTA colour),
  VERDIGRIS #2BC7B5 (tools accent).
- Text-safe variants: brass on light = #7F611B, verdigris on light = #0C6B5F.
- **White text on bright verdigris FAILS contrast (2.11:1) — never pair.**
- Six-stop gradient is HAIRLINE RULES ONLY (logo underline, kicker rules). Never fills.
- Tagline (locked): "Engineer Your Business. Design Your Freedom."
- Logo lockup metrics live in `client/src/components/EBALogo.tsx` — source of truth.

---

## Blockers before 17 August

1. **THE COURSE IS EMPTY** — 95 videos to record, then publish all 10 modules.
   *Nothing else matters until this is done.*
2. **No business email** — hello@teb-academy.com doesn't exist. DNS at 123 Reg
   (runbook in DEPLOY.md).
3. **Kajabi sender authentication (SPF/DKIM)** — without it every course email lands in
   spam. **Has lead time — start now**, it's the only item not blocked by the videos.
4. ~~**Toolbox Talk Generator link**~~ — RESOLVED. Another session built `/toolbox-talk`
   (live, 200) with `api/generate-toolbox-talk.ts`. Verify the Kajabi thank-you messages
   now point at it.
5. **Documents pack fulfilment** — the £1,299 tier has no documents product in Kajabi.
   Currently a manual email within 24 hours.
6. **Prerendering** — see above. Site launches invisible to Google without it.
7. **Nobody has tested a real end-to-end purchase.**

---

## Decisions outstanding

| Decision | Notes |
|---|---|
| Drip or all-at-once? | All 101 lessons day one, or scheduled |
| Issue a certificate? | Configured but unused. This audience values credentials |
| Member area domain | members.teb-academy.com vs a generic kajabi.com URL |
| Documents: product or manual? | Affects £1,299 fulfilment |
| Ste: co-founder or technical authority? | Currently written as the latter |

---

## Working rules — important

- **Never invent facts.** No fake testimonials, stats, prices, company numbers or URLs.
  Use `TODO(eba):` markers and say what's missing.
- **Verify against the DEPLOYED site, never a local build.** A local build passing proved
  nothing for three weeks while production served an empty shell.
- **KEYIS Group director testimonials must be labelled as internal users** — never
  presented as independent customers.
- **No AI-generated people** in brand media. Environments and product UI are fine.
- **Prices come from `client/src/lib/constants.ts`**, never from memory.
- **KEYIS client names** (e.g. Nutricia) need consent before publishing.
- API keys never in chat, repo or CSVs. KEYIS-derived warm data never committed.

---

## Where things live

| File | What |
|---|---|
| `client/src/lib/constants.ts` | Colours, pricing, flags, social links — single source of truth |
| `client/src/pages/ComingSoonPage.tsx` | The live holding page |
| `client/src/pages/AboutStePage.tsx` | Ste's page — DRAFT, noIndex, needs 1 fact + vision sign-off |
| `api/lead.ts`, `api/_hubspot.mjs` | Lead capture + attribution |
| `scripts/hubspot_crm_setup.mjs` | HubSpot provisioner (idempotent) |
| `scratchpad/STATUS_5AUG.md` | Status snapshot |
| `scratchpad/TEBA_LEAD_CAPTURE.md` | What the CRM captures, UTM guide |
| `scratchpad/TEBA_HUBSPOT_CRM_SPEC.md` | CRM design spec |
| `scratchpad/LAUNCH_CHECKLIST.md` | Blockers with owners |
| `DEPLOY.md` | Vercel + DNS + email runbook |
| `.claude/agents/teba-*.md` | 4 custom agents (honesty-guard, launch-check, content, crm) |

---

## Outstanding from Ste personally

- One detail for the About page: **what actually happened on the £18m Nutricia job** —
  the deadline, the evening, the moment it became unbearable. One sentence.
- Sign-off on 3 drafted "vision" paragraphs on that page (written on his behalf, marked,
  not yet his words).
- A photo of himself for the page.
- Generate 4 replacement social tile images (prompts already supplied).
