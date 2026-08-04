# HubSpot CRM — build runbook

Executes `scratchpad/TEBA_HUBSPOT_CRM_SPEC.md` §7 steps 1–5 against portal **149002234**
(`sn@teb-academy.com`, EU-hosted, `app-eu1.hubspot.com`).

Steps 1–3 are automated by `scripts/hubspot_crm_setup.mjs`. Steps 4–5 are manual because
HubSpot exposes no public API for them. Both halves are below.

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
| `crm.schemas.contacts.write` | Create the seven contact properties |
| `crm.schemas.companies.write` | Create the three company properties |
| `crm.objects.contacts.read` | Count contacts not yet linked to a company |

HubSpot auto-selects the matching `.read` scopes. Copy the token — it is shown once.

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

The default "Sales Pipeline" is left in place. Deleting it is a one-click job in the UI
once you're satisfied nothing is using it.

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

### 4.3 Account settings that are currently wrong

Two defaults do not match the business and will quietly corrupt reporting:

| Setting | Now | Should be | Where |
|---|---|---|---|
| Company currency | **USD** | **GBP** | Settings → Account Defaults → Currency |
| Time zone | **US/Eastern** | **Europe/London** | Settings → Account Defaults → Date and time |

The spec prices everything in £999–£1,999 and £39/mo. With the portal on USD, every deal
amount you type is recorded as dollars and every forecast is wrong by the exchange rate.
Change the currency **before** the first deal is created — HubSpot does not retroactively
reinterpret amounts already entered.

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

---

## 6. EU data residency

The portal is EU-hosted (`app-eu1.hubspot.com`). `api.hubapi.com` serves EU portals
correctly and is the default. If HubSpot ever returns a region error, override the host
without editing the script:

```bash
HUBSPOT_API_BASE_URL=https://api.hubapi.eu HUBSPOT_PRIVATE_APP_TOKEN=pat-xxxx \
  node scripts/hubspot_crm_setup.mjs --dry-run
```
