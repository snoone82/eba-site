# HubSpot CRM — build runbook

Executes `scratchpad/TEBA_HUBSPOT_CRM_SPEC.md` §7 steps 1–5 against portal **149002234**
(`sn@teb-academy.com`, EU-hosted, `app-eu1.hubspot.com`).

Steps 1–3 are automated by `scripts/hubspot_crm_setup.mjs`. Steps 4–5 are manual because
HubSpot exposes no public API for them. Both halves are below.

---

## 0. Current state

The script has been run against the live portal. What exists now:

Spec §7 steps 1–3 are **complete**. `--verify` reports 12 of 12 present, 0 failures.

| | State |
|---|---|
| `Academy` pipeline | **created** — id `4018643182`, 6 stages |
| `Tools & Enterprise` pipeline | **created** — id `4018302178`, 7 stages |
| `Sales Pipeline` (HubSpot default) | **deleted**, freeing the second of two slots (§3.1) |
| 7 contact properties + `TEBA CRM` group | **created** |
| 3 company properties + `TEBA CRM` group | **created** |
| Account currency / time zone | GBP / Europe/London — correct, see §4.3 |
| Contacts without a company | 0 of 2 |
| §4 manual steps (saved views, lifecycle) | **not started** |
| §5 Zapier sync | **not started** — the last substantial piece of work |
| Kajabi readiness | **ready** — offers priced in GBP, tags aligned (§5.1) |

The pipeline cap in §3.1 is resolved but the section is kept: the portal is now at 2 of 2
again, so any future third pipeline hits the same wall.

Kajabi needs no changes before the Zaps are built. The currency mismatch flagged in an
earlier revision was not real (§5.1), and the one tag-name mismatch that was real is fixed.
Two `Interest ·` tags need explicit mapping inside the Zap rather than a rename, for the
reason given in §5.1.

`node scripts/hubspot_crm_setup.mjs --verify` reprints this from the live portal at any
time, and is the source of truth if this table goes stale.

---

## 1. Why this is a script and not already done

The HubSpot connector wired into this workspace only reads and writes **records** —
contacts, companies, deals. It has no tool for creating **schema**: pipelines, custom
properties, property groups. Those live behind `POST /crm/v3/pipelines/deals` and
`POST /crm/v3/properties/{objectType}`, which need a private app token that this
environment does not hold.

So the build is packaged as a script you run once with a token. It is idempotent —
running it twice does nothing the second time.

---

## 2. Create the token

Settings → Integrations → **Private Apps** → Create private app.

Name it `TEBA CRM provisioner`. Under **Scopes**, tick:

| Scope | Why |
|---|---|
| `crm.schemas.deals.write` | Create the two pipelines and their stages |
| `crm.objects.deals.read` | Read existing pipelines first, so a re-run is idempotent |
| `crm.schemas.contacts.write` | Create the seven contact properties |
| `crm.objects.contacts.read` | Count contacts not yet linked to a company |
| `crm.schemas.companies.write` | Create the three company properties |
| `crm.objects.companies.read` | Read existing company properties before creating |

All six are required. Ticking only the three `schemas.*.write` scopes is not enough, and
the failure is confusing when it happens: HubSpot auto-selects the matching
`crm.schemas.*.read` scope but **not** `crm.objects.*.read`, and the script's first call
against each object type is a read. You get a 403 on `GET /crm/v3/pipelines/deals` before
anything is created, with a generic "hasn't been granted all required scopes" message that
does not name the missing scope. The companies equivalent is more helpful and gives the
game away — `requires one of [companies-read]`.

Copy the token — it is shown once.

**Private app, not a public app.** Public apps exist to distribute one integration across
many portals; they require a developer account, an OAuth redirect flow and refresh-token
handling, and cannot be authenticated with a static bearer token at all. This script sends
`Authorization: Bearer pat-…` against a single portal you own, which is the private-app
model exactly.

If you change the scopes on an existing app, the token does **not** rotate — the same
token picks up the new permissions as soon as you click **Commit changes**. Ticking the
boxes without committing leaves the token unchanged, which looks identical to not having
edited it at all.

**The token is a secret.** Do not commit it, do not put it in `.env.example`, do not paste
it into a chat. Export it in your shell for the length of the run and let it go.

---

## 3. Run it

```bash
# 1. See exactly what would change. Writes nothing.
HUBSPOT_PRIVATE_APP_TOKEN=pat-xxxx node scripts/hubspot_crm_setup.mjs --dry-run

# 2. Apply.
HUBSPOT_PRIVATE_APP_TOKEN=pat-xxxx node scripts/hubspot_crm_setup.mjs

# 3. Audit later, any time, read-only.
HUBSPOT_PRIVATE_APP_TOKEN=pat-xxxx node scripts/hubspot_crm_setup.mjs --verify
```

Needs Node 18+ (for built-in `fetch`). No dependencies, no install step.

### What it creates

**Two deal pipelines** (spec §1), stages in order with probabilities set, and the closed
stages flagged `isClosed` so HubSpot's native win-rate reporting works untouched:

- **Academy** — New Lead 5% · Contacted 10% · In Conversation 30% ·
  Application / Checkout Started 65% · Closed Won — Enrolled 100% · Closed Lost — Not Now 0%
- **Tools & Enterprise** — Enquiry 5% · Discovery 20% · Demo / Trial 40% · Proposal 60% ·
  Negotiation 80% · Closed Won 100% · Closed Lost 0%

The default "Sales Pipeline" is left in place — the script never touches a pipeline it did
not create. **On this portal's tier that is a blocker, not a cosmetic choice.** See §3.1.

**Seven contact properties** (spec §2), all in a new "TEBA CRM" property group:
`kajabi_contact_id` (unique-valued text), `trade_discipline`, `company_turnover_band`,
`team_size`, `teba_source`, `product_interest` (multi-checkbox), `toolbox_talk_user`.

**Three company properties** (spec §3): `company_turnover_band`, `trade_discipline`,
`teba_region`.

Contact and company deliberately share internal names where the field means the same
thing. HubSpot namespaces properties per object type, so this is legal — and it makes the
Zapier field mapping in spec §6 a straight copy rather than a translation table.

Employee count is deliberately **not** created: HubSpot's native `numberofemployees`
already covers it, and a second field would split the data and break reporting.

### 3.1 The two-pipeline cap

This portal is on a tier that allows **2 deal pipelines**. HubSpot ships every portal with
a default pipeline called "Sales Pipeline", so one of the two slots is already spent before
the script runs. The arithmetic:

| | Pipelines |
|---|---|
| Out of the box | `Sales Pipeline` (default) |
| Spec wants | `Academy` + `Tools & Enterprise` |
| Cap | 2 |

So the run creates `Academy`, fills the cap, and fails on the second with:

```
POST /crm/v3/pipelines/deals → 400: You have reached your limit of 2 deal pipelines.
```

This is not a script fault and re-running will not fix it. Nothing is half-created — the
pipeline either exists or it doesn't, and everything else in the run is unaffected. Pick
one:

1. **Delete the default pipeline, then re-run.** Settings → Objects → Deals → Pipelines →
   select `Sales Pipeline` → Actions → Delete. HubSpot blocks the delete if any deal sits
   in it, so check first — `Sales Pipeline` held 0 deals as of the first run. Re-running
   the script then creates `Tools & Enterprise` and skips everything already present.
2. **Upgrade to Sales Hub Professional**, which raises the cap to 15, and keep all three.
   Out of scope per spec §8, which rules out Starter/Pro pricing.
3. **Run both motions in one pipeline.** Not recommended: the two sales motions have
   genuinely different stages, and merging them makes every stage-conversion report
   meaningless. Only worth it if the spend is unjustifiable.

Until this is resolved the `Enterprise pipeline` saved view (§4.1) and the
`Tools & Enterprise` half of spec §1 cannot be built.

### What it will not do

If a pipeline already exists with stages that differ from the spec, the script reports the
difference and stops there. Renaming or reordering a live stage moves real deals between
stages — that is not something to automate. Fix those by hand in
Settings → Objects → Deals → Pipelines.

Option-set drift on an existing property *can* be repaired with `--update`, which patches
labels and options in place.

---

## 4. Manual steps — no API exists for these

### 4.1 Saved views (spec §7 step 5)

HubSpot's saved CRM object views have no public API. Build these four in the UI at
Sales → Deals → *Add view*, and Contacts → *Add view*:

| View | Object | Filters |
|---|---|---|
| **Hot deals** | Deals | Deal stage is any of `In Conversation`, `Application / Checkout Started`, `Demo / Trial`, `Proposal`, `Negotiation` · Close date is in the next 30 days |
| **Abandoned checkout** | Deals | Pipeline is `Academy` · Deal stage is `Application / Checkout Started` · Last activity date is more than 3 days ago |
| **Enterprise pipeline** | Deals | Pipeline is `Tools & Enterprise` · Deal stage is not any of `Closed Won`, `Closed Lost` |
| **ICP-fit leads** | Contacts | Company Turnover Band is any of `£1m–£2m`, `£2m–£5m` · Trade Discipline is known · Lifecycle stage is any of `Lead`, `Marketing Qualified Lead`, `Sales Qualified Lead` |

Set each to **Shared** so they survive a second user being added later.

### 4.2 Lifecycle stage automation (spec §7 step 4)

Free-tier HubSpot has no workflow engine, so this is a settings toggle plus a habit, not
automation:

1. Settings → Objects → Contacts → **Lifecycle Stage** → enable
   *"Set lifecycle stage to Customer when a deal is won"*. That covers the
   Opportunity → Customer transition, which is the one that matters for reporting.
2. The rest of the ladder in spec §4 (Subscriber → Lead → MQL → SQL) is set by hand or by
   the Kajabi Zap. Do not build workflows for it — Starter/Pro pricing is explicitly out of
   scope per spec §8.

### 4.3 Account settings — checked, nothing to do

An earlier draft of this runbook claimed the portal currency was USD and the time zone
US/Eastern, and made fixing them a prerequisite. Both were wrong. Read back from
`GET /account-info/v3/details` on the day of the first run:

| Setting | Actual | Wanted | Status |
|---|---|---|---|
| Company currency | GBP | GBP | correct |
| Time zone | Europe/London | Europe/London | correct |

No action needed. The underlying point still stands and is worth keeping in mind: the spec
prices in £999–£1,999 and £39/mo, and HubSpot does not retroactively reinterpret deal
amounts if the currency is changed later. If the currency is ever switched, do it before
the next deal is created, not after.

To re-check at any time:

```bash
curl -s -H "Authorization: Bearer $HUBSPOT_PRIVATE_APP_TOKEN" \
  https://api.hubapi.com/account-info/v3/details
```

### 4.4 Company associations (spec §3)

The contact↔company association is native to every portal; nothing needs creating. What
needs doing is *using* it. The script's final section reports how many contacts have no
company record attached. Keep that number at zero — a director and a contracts manager at
the same firm are one opportunity, not two leads, and the Enterprise pipeline double-counts
without it.

---

## 5. After the script

Spec §7 steps 6–7 are still open and need Zapier:

- **Step 6** — the two Zaps (Kajabi contact → HubSpot contact; Kajabi purchase → HubSpot
  Closed Won). One-way only, Kajabi → HubSpot. Never the reverse, per spec §6.
- **Step 7** — end-to-end test with a dummy contact, then delete it.

Re-run `--verify` after any HubSpot UI work to confirm the structure still matches the spec.

Click-by-click instructions for both Zaps and the four saved views, with the live pipeline
and stage IDs already filled in, are in `scripts/ZAPIER_SETUP.md`.

### 5.1 Kajabi-side readiness — checked, ready

Read from Kajabi site `2148787052` (`teba.mykajabi.com`). Nothing needs changing in Kajabi
before the Zaps are built; this section records what was checked and why two earlier
"blockers" were withdrawn.

**Currency: no action needed.** An earlier version of this section called the Kajabi/HubSpot
currency mismatch a blocker. That was wrong, and the correction matters because the Kajabi
UI will not let you change it anyway — the dropdown greys out once a gateway is connected
and priced offers are published.

Kajabi's site `default_currency` is `USD`, but that only sets the default for **newly
created** offers. It does not restate the price of an offer that already has one. Every
offer that can take money is already GBP:

| Offer | Price | Status |
|---|---|---|
| The Engineering Business Academy — Founding Cohort | £999.00 GBP | published |
| … + Documents — Founding Cohort | £1,299.00 GBP | published |
| The Engineering Business Academy | £1,499.00 GBP | draft |
| … + Documents | £1,999.00 GBP | draft |
| KEYIS Academy / … limited access | $0.00 USD | draft, free, legacy |

The purchase Zap reads the currency off the purchase record, not off the site, so synced
deal amounts arrive in GBP. The only USD offers are two free `$0.00` drafts left from the
old KEYIS branding — no money passes through them. Worth deleting for tidiness, not for
correctness.

**Tag mapping.** Spec §5 says the 30 July tag layer "maps cleanly across". It does for the
six `Stage ·` tags. The rest:

| Kajabi tag | HubSpot option | State |
|---|---|---|
| `Source · Website` / `Warm Network` / `Referral` | `teba_source` | matches |
| `Source · Social Media` | `teba_source` → "Social Media" | **fixed** — the option was "Social", realigned via `--update` |
| `Interest · Academy` | `product_interest` → "Academy" | matches |
| `Interest · AI Tools` | — | needs explicit Zap mapping, see below |
| `Interest · Enterprise / In-House Training` | `product_interest` → "Enterprise" | needs explicit Zap mapping |

The two `Interest ·` rows are deliberately **not** realigned. HubSpot's `product_interest`
carries seven options (Academy, RAMS, COSHH, O&M, Co-Pilot, Mentorship, Enterprise) against
Kajabi's three tags, so there is no 1:1 to align to — renaming HubSpot's options to match
would mean collapsing RAMS / COSHH / O&M / Co-Pilot into a single "AI Tools" bucket and
losing the ability to see *which* tool a lead wants. Keep the finer taxonomy and translate
in the Zap:

- `Interest · AI Tools` → set `product_interest` to the specific tools if known, else leave
  empty and let the sales conversation fill it in. Do not invent a value.
- `Interest · Enterprise / In-House Training` → `Enterprise`.

`teba_source` also has an "Event" option with no Kajabi tag; it is set by hand.

The failure mode to design against: Zapier does **not** error on an unmatched enumeration
value, it writes nothing. A mapping that looks fine in the Zap editor can silently leave
the property empty on every synced contact.

**Contact counts don't match.** Kajabi has 1 contact, HubSpot has 2. Neither is a
migration in progress — Kajabi's is a test/admin record and both are pre-launch noise —
but confirm which records are real before running the step 7 end-to-end test, so the test
contact is distinguishable from live data.

### 5.2 The sync is code, not Zaps — `/api/kajabi-webhook`

Spec §6 assumes Zapier. It is built as a Vercel serverless function instead, in
`api/kajabi-webhook.ts`, following the same pattern as the existing
`api/assistant.ts`. It replaces **both** Zaps.

Why: Zapier is not reachable from this tooling (§5.3), and the endpoint is better on the
merits. Zapier does not error when a value fails to match a HubSpot enumeration — it writes
nothing and reports success. The endpoint validates every enum against an allowlist before
sending and returns what it wrote, so a mapping failure is visible rather than silent. It
also costs nothing, runs on the Vercel project already deployed, and is version controlled.

**Setup — three things, all one-off:**

1. **Add two scopes to the private app.** Record writes are separate from schema writes, so
   the provisioner's six are not enough. Add `crm.objects.contacts.write` and
   `crm.objects.deals.write`, then **Commit changes**. The token does not rotate.
2. **Set two environment variables** in the Vercel project settings — never committed:
   - `HUBSPOT_PRIVATE_APP_TOKEN` — the same `pat-eu1-…` token
   - `KAJABI_WEBHOOK_SECRET` — any long random string you invent
3. **Point Kajabi at it.** In each form's settings, set the webhook URL to
   `https://<your-domain>/api/kajabi-webhook?secret=<the-secret>`. For purchases, append
   `&event=purchase`.

**Adding the variables is not enough — redeploy.** Vercel injects environment variables at
build time, so a deployment that already exists never picks up a variable added afterwards.
The endpoint keeps answering `501 not_configured` listing both names, which reads exactly
like the variables were never set. Push any commit, or hit Redeploy on the deployment in
the Vercel dashboard. Also make sure both variables are ticked for **Preview** as well as
Production if you are testing on a branch URL — the two environments have separate values.

**Check it before relying on it.** A `GET` on the same URL runs a read-only health check:

```bash
curl "https://<your-domain>/api/kajabi-webhook?secret=<the-secret>"
```

It reports whether the token can read contacts, deals and the Academy pipeline. It cannot
prove *write* access without writing, and says so — send one real test event to confirm.

**What it does.** A contact event upserts the HubSpot contact by email (never duplicates),
writes `kajabi_contact_id`, maps known `Source ·` and `Interest ·` tags, and sets lifecycle
`lead` on first sight only — so an existing Customer is never dragged back down the ladder.
A purchase event additionally creates a deal in the Academy pipeline at
`Closed Won — Enrolled`, associates it to the contact, and sets lifecycle `customer`.

`Interest · AI Tools` is deliberately unmapped, for the reason in §5.1.

**Tests:** `node scripts/kajabi_webhook_test.mjs` — 19 cases, stubs fetch, touches nothing
live, needs no token.

### 5.3 `/api/lead` — the website's own forms

`/api/kajabi-webhook` only fires for forms hosted **on Kajabi**. The teb-academy.com forms
— homepage health check, toolbox talk generator, contact enquiry — POST straight to
`FORM_ENDPOINT` from the browser and never touch Kajabi, so none of them reached the CRM.
`api/lead.ts` closes that gap. `FORM_ENDPOINT` now defaults to `/api/lead`, so there is
nothing to configure; same-origin, so no CORS.

**It is unauthenticated on purpose, and it has to be.** `VITE_*` values are inlined into
the public JavaScript bundle at build time, so a shared secret placed there would be
readable from source — worse than no secret, because it would look protected. Any
browser-submitted endpoint is public by nature. The defence is strict validation, field
length caps, and a honeypot (`website_url` / `fax`: a bot filling every field it finds gets
a `200` and is silently discarded).

Do not "harden" it by moving the webhook secret into `VITE_FORM_ENDPOINT`. That publishes
the secret and lets anyone write to the CRM through the server-to-server route as well.

What it writes:

| Site input | HubSpot |
|---|---|
| any submission | `teba_source: website` — the route is only reachable from the site |
| `source` contains `toolbox-talk` | `toolbox_talk_user: true`, the spec §2 warm-lead signal |
| `enquiry: academy` | `product_interest: academy` |
| `enquiry: om-manual` | `o_m` |
| `enquiry: chatbot` | `co_pilot` |
| `enquiry: mentorship` | `mentorship` |
| `enquiry: white-label` | `enterprise` |
| `enquiry: documents` / `other` | left empty — no HubSpot option exists, and a guess would become a number in a report someone believes |
| `company`, `message`, `name` | native `company`, `message`, `firstname`/`lastname` |

Lifecycle `lead` is set on first sight only, so someone who is already a Customer is not
dragged back down the ladder by filling in a form.

**Tests:** `node scripts/lead_endpoint_test.mjs` — 27 cases, stubbed fetch, no token.

**Note on the shared module.** `api/_hubspot.mjs` is plain JavaScript rather than
TypeScript, and must stay that way. Vercel's edge bundler rejects a `./_hubspot.ts`
specifier and wants the extensionless form; Node's native type-stripping, which the test
scripts use to import the endpoints without a build step, requires the explicit extension.
No `.ts` spelling satisfies both — a `.mjs` file does. Nothing is lost: tsconfig's
`include` is `["client/src"]`, so `api/` was never typechecked.

### 5.3a OPEN — nothing triggers the purchase half yet

**This must be closed before the first sale.** A purchase that happens with no trigger
connected does not become a deal, and there is no retrospective fix short of typing it in.

The receiving end is built and tested: POST a purchase payload to
`/api/kajabi-webhook?...&event=purchase` and it creates a deal in the Academy pipeline at
`Closed Won — Enrolled`, associates it to the contact, and sets lifecycle `customer`.
Verified on production with a `£1,299.00 GBP` event.

What is missing is anything in Kajabi that *sends* that request:

- **Kajabi form webhooks fire on form submissions only.** A checkout is not a form
  submission, so the webhooks set on `Default Form` and `KEYIS Academy Waitlist` cover
  opt-ins and nothing else.
- **Kajabi Automations offers no webhook / HTTP-request action.** Confirmed by inspection
  of the action list.
- **Offer thank-you pages cannot redirect off-site.** `thank_you_preference` accepts only
  `disabled`, `custom_message`, or a Kajabi-hosted `landing_page`.

Two workable routes:

1. **One Zap.** Trigger: Kajabi new purchase. Action: Webhooks by Zapier → POST to the
   purchase URL. No field mapping — this endpoint parses the payload itself, so the
   silent-enum-mismatch failure mode that motivated moving off Zapier does not apply to a
   raw POST. Two steps, which fits Zapier's free tier.
2. **Manual reconciliation.** At founding-cohort volume this is genuinely viable: read
   Kajabi purchases, create any missing HubSpot deals. There is no script for it because
   the repo holds no Kajabi API credentials — the Kajabi connection used during this build
   was an assistant-side connector, not something the site can authenticate as. It is an
   ask-and-run job, not an automated one.

Route 1 is the only one that survives you being on holiday.

### 5.4 Zapier is not reachable from this repo's tooling

The spec says Zapier "is already connected to this workspace". That is not true of the
tooling this runbook is executed from — there is no Zapier tool available here, so the
two Zaps in step 6 cannot be built or inspected programmatically. They are a manual job
in the Zapier UI, the same as §4. Budget for that; it is the single largest remaining
piece of work and it is the one that stops the two databases drifting apart.

---

## 6. EU data residency

The portal is EU-hosted (`app-eu1.hubspot.com`). `api.hubapi.com` serves EU portals
correctly and is the default. If HubSpot ever returns a region error, override the host
without editing the script:

```bash
HUBSPOT_API_BASE_URL=https://api.hubapi.eu HUBSPOT_PRIVATE_APP_TOKEN=pat-xxxx \
  node scripts/hubspot_crm_setup.mjs --dry-run
```
