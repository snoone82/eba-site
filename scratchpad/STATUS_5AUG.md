# TEBA — where we are, 5 August 2026

Launch: **17 August** (12 days). All statuses below checked live, not from memory.

---

## ✅ DONE — working now

**Website / domain**
- teb-academy.com live, SSL valid, `www` 301s to the bare domain
- **Holding page live on the root** — launch date, waitlist signup, social links.
  No prices, no purchase buttons, nothing half-finished reachable.
- Turning the full site back on at launch is one line (`COMING_SOON = false`)
- Vercel connected to GitHub, deploying from `claude/new-session-60ynut`

**HubSpot**
- Account connected; `HUBSPOT_PRIVATE_APP_TOKEN` set in Vercel
- `/api/lead` endpoint live and validating — waitlist signups flow straight into HubSpot
- ⚠️ The CRM *structure* (pipelines, properties, companies) is **not built yet** — spec written

**Kajabi**
- Site connected. Course exists: 10 modules, 101 lessons, matching the website exactly
- CRM layer built: 13 tags (6 pipeline stages, 4 source, 3 interest) + 5 saved views
- `KAJABI_WEBHOOK_SECRET` set in Vercel; webhook endpoint exists
- **Nothing is on sale** — all offers unpublished, deliberately

**Social**
- Facebook, Instagram, YouTube live on @engineeringbusinessacademy
- LinkedIn company page created, logo + cover applied
- 4 of 8 launch tiles designed and approved

**Brand**
- Palette, logo lockup, and asset set finalised and consistent across site + social

---

## 🔴 STILL TO DO — blockers

**1. The course is empty.** All 10 modules and all 101 lessons are still in DRAFT.
   Only 6 of 101 lessons have video — **95 still to record/attach.**
   There's also an empty module called "Paywall Wrapper" that buyers would see.
   *Nothing else matters until this is done.*

**2. No business email.** hello@teb-academy.com doesn't exist. DNS records go in
   the 123 Reg panel — runbook is written, verification ready to run.

**3. Kajabi sender authentication (SPF/DKIM).** Without it, every course email lands
   in spam. **This has lead time — start it now**, it's the one item that doesn't
   depend on the videos.

**4. Toolbox Talk Generator link.** Promised on the site and in purchase
   confirmations. Doesn't exist yet.

**5. Documents pack fulfilment.** The £1,299 tier has no documents product attached
   in Kajabi — currently a manual email within 24 hours.

**6. Nobody has tested a real purchase** end to end. Do this once offers reopen.

---

## 🟠 STILL TO DO — site

- **Prerendering is off** — Google currently sees an empty shell. Fine for a holding
  page, must be fixed before launch. Should move to GitHub Actions.
- **Sub-routes 404** (`/pricing`, `/academy`) — fix pushed, not yet confirmed live
- **About Ste page** — drafted, needs 7 interview answers + a photo
- **Testimonials** from Group Directors — must be labelled as KEYIS internal users
- Mark's new photography and video
- Social tiles 1, 2, 6, 8 — need images generating

---

## 🔵 STILL TO DO — CRM

- Build the HubSpot CRM: 2 pipelines (Academy / Enterprise), custom properties,
  company records. Spec is written and ready to execute.
- Zapier: account connected, **no Zaps built yet.** Needs Kajabi → HubSpot sync.

---

## ❓ DECISIONS NEEDED

| Decision | Notes |
|---|---|
| Drip or all-at-once? | All 101 lessons on day one, or scheduled |
| Issue a certificate? | Configured but unused. This audience values credentials |
| Member area domain | `members.teb-academy.com` vs a generic kajabi.com URL |
| Ste: co-founder or technical authority? | Changes how his name appears sitewide |
| Documents: build product or stay manual? | Affects £1,299 tier fulfilment |

---

## The honest one-liner for the meeting

*Infrastructure is done and safe. The website, domain, CRM plumbing and social presence
are all in place, and nothing can be bought by mistake. The whole launch now hangs on
one thing: **the course content isn't finished** — 95 videos and publishing the modules.*
