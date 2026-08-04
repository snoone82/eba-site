# Zapier + saved views — click-by-click

Everything left after `hubspot_crm_setup.mjs` has run. All of it is browser work: Zapier
has no tooling in this repo, and HubSpot exposes no public API for saved views or the
lifecycle setting.

Portal **149002234** (`app-eu1.hubspot.com`) · Kajabi site **2148787052**
(`teba.mykajabi.com`).

**Read this first.** The HubSpot IDs and internal names below were read from the live
portal and are exact — paste them verbatim. The *Zapier* step names are not verified:
there is no Zapier tooling here, Zapier relabels things between app versions, and Kajabi's
trigger list in particular has changed over time. Where a name doesn't match what you see,
match on what the step *does*, described alongside each one. Nothing below depends on
Zapier's exact wording being right.

---

## 0. The one-minute job first

Do this before Zapier — it is a single toggle and it removes a step from Zap two.

Settings → Objects → Contacts → **Lifecycle Stage** → enable
*"Set lifecycle stage to Customer when a deal is won"*.

With that on, closing a deal moves the contact to Customer automatically, so Zap two only
has to create the deal.

---

## 1. Reference values

Paste these rather than retyping. HubSpot matches enumeration values **verbatim** and
Zapier does **not** error on a mismatch — it writes nothing and the Zap still shows green.
That silent no-write is the main thing to design against.

### Deal pipelines and stages

| Pipeline | Pipeline ID |
|---|---|
| Academy | `4018643182` |
| Tools & Enterprise | `4018302178` |

| Academy stage | Stage ID |
|---|---|
| New Lead | `5818433730` |
| Contacted | `5818433731` |
| In Conversation | `5818433732` |
| Application / Checkout Started | `5818433733` |
| **Closed Won — Enrolled** | `5818433734` |
| Closed Lost — Not Now | `5818433735` |

| Tools & Enterprise stage | Stage ID |
|---|---|
| Enquiry | `5818561756` |
| Discovery | `5818561757` |
| Demo / Trial | `5818561758` |
| Proposal | `5818561759` |
| Negotiation | `5818561760` |
| Closed Won | `5818561761` |
| Closed Lost | `5818561762` |

Zapier usually shows stages by label in a dropdown. If it asks for an ID, use the above.

### Contact property internal names

| Field | Internal name |
|---|---|
| Kajabi Contact ID | `kajabi_contact_id` |
| TEBA Source | `teba_source` |
| Product Interest | `product_interest` |
| Trade Discipline | `trade_discipline` |
| Company Turnover Band | `company_turnover_band` |
| Team Size | `team_size` |
| Toolbox Talk User | `toolbox_talk_user` |
| Lifecycle Stage | `lifecyclestage` |

### Values that must match exactly

`teba_source` — `website` · `social_media` · `warm_network` · `referral` · `event`

`product_interest` — `academy` · `rams` · `coshh` · `o_m` · `co_pilot` · `mentorship` ·
`enterprise`

`lifecyclestage` — `subscriber` · `lead` · `marketingqualifiedlead` · `salesqualifiedlead`
· `opportunity` · `customer` · `evangelist`

---

## 2. Zap one — new Kajabi contact → HubSpot contact

**The important one.** It writes `kajabi_contact_id`, the join key between the two systems.
Without it they drift apart within weeks and there is no way to reconcile them afterwards
short of matching on email, which breaks the moment someone changes address.

### 2.1 Trigger

New Zap → search **Kajabi** → pick the trigger that fires when a contact is created.

**Check the trigger list before committing.** Kajabi's Zapier app has historically offered
*New Form Submission*, *Tag Added to Contact*, *New Purchase* and similar. A plain "New
Contact" trigger may or may not be present in your version. In order of preference:

1. **New Contact** — if it exists, use it. Fires on every contact however they arrive.
2. **New Form Submission** — fires only for form opt-ins. Good coverage in practice, since
   that is how nearly everyone enters, but it will miss contacts you add by hand or import.
3. **Tag Added to Contact**, watching `Stage 1 · New Lead` — most explicit, but only fires
   when the tag is actually applied, so it depends on that habit.

Connect the Kajabi account, then **Test trigger**. You need a real sample record to map
fields against in the next step. If no contact is returned, create a throwaway one in
Kajabi first — you will delete it in §4.

### 2.2 Action

Add action → **HubSpot** → *Create or Update Contact*.

"Create **or update**" matters. A plain "Create Contact" produces a duplicate every time
someone re-submits a form.

Connect HubSpot — this is a separate OAuth connection from the private app token the
provisioner used. Zapier will ask you to authorise it in the browser. That's expected; the
private app token is not reusable here.

Map these fields:

| HubSpot field | Map from | Notes |
|---|---|---|
| **Email** | Kajabi contact email | Required. This is the dedupe key |
| **Kajabi Contact ID** (`kajabi_contact_id`) | Kajabi contact/member **ID** | The numeric ID, not the email. Field may be labelled `Id`, `Contact Id` or `Member Id` — pick whichever is a bare number |
| First name / Last name | Kajabi name fields | Kajabi may give one combined `Name` field. If so, map it to First name and leave Last name empty rather than splitting it wrongly |
| **TEBA Source** (`teba_source`) | see below | |
| Lifecycle Stage | `lead` | Optional. Set a constant so new contacts don't sit blank |

**`teba_source` needs a translation step**, because Kajabi carries the source as a *tag*
(`Source · Website` and so on) rather than a field. Two options:

- **Simplest:** set it to a constant matching the trigger. If the trigger is a website form,
  hardcode `website`. Accurate for the great majority of contacts and takes ten seconds.
- **Fuller:** add a *Formatter → Utilities → Lookup Table* step between trigger and action,
  mapping the Kajabi tag name to the HubSpot value:

  | Lookup key | Output |
  |---|---|
  | `Source · Website` | `website` |
  | `Source · Social Media` | `social_media` |
  | `Source · Warm Network` | `warm_network` |
  | `Source · Referral` | `referral` |

  Leave the fallback **empty**, not a guess. An empty `teba_source` is a known unknown; a
  wrong one is a lie you will later report on.

Do **not** try to map `Interest · AI Tools` to `product_interest`. There is no equivalent —
HubSpot deliberately splits tools into RAMS, COSHH, O&M and Co-Pilot so you can see which
one a lead wants. Leave `product_interest` unmapped and let the sales conversation set it.
`Interest · Enterprise / In-House Training` → `enterprise` is a safe lookup-table row if you
want one.

### 2.3 Test

**Test step**, then check HubSpot directly — do not trust Zapier's green tick, which only
means the API call returned 200. It returns 200 for a write that silently dropped an
unmatched enumeration value.

Contacts → find the contact → confirm `Kajabi Contact ID` is populated. If it is blank you
mapped the wrong Kajabi field; go back and pick the bare numeric one.

Publish.

---

## 3. Zap two — Kajabi purchase → HubSpot deal

Only fires when money moves. Nothing has sold yet, so this can wait behind Zap one without
costing you anything.

### 3.1 Trigger

New Zap → **Kajabi** → the purchase trigger (*New Purchase*, *Offer Purchased* or similar —
whatever fires on a completed transaction, not on checkout started).

### 3.2 Action — create the deal

Add action → **HubSpot** → *Create Deal*.

| Field | Value |
|---|---|
| **Deal name** | Offer title + contact name, e.g. `{{offer_title}} — {{contact_name}}` |
| **Pipeline** | `Academy` (`4018643182`) |
| **Deal stage** | `Closed Won — Enrolled` (`5818433734`) |
| **Amount** | Purchase amount from Kajabi |
| **Close date** | Purchase date |

**On the amount:** map the raw number only. If Kajabi hands you `£999.00 GBP` as a string,
add a *Formatter → Numbers → Spreadsheet-style Formula* step to strip it to `999`, or
HubSpot will reject the write or store zero.

Currency is not a problem here despite Kajabi's site default reading USD — every paid offer
is priced in GBP and the purchase record carries its own currency. See
`HUBSPOT_CRM_RUNBOOK.md` §5.1.

### 3.3 Associate the deal with the contact

A deal with no contact on it is invisible from the contact record and will not roll up to
the company, which defeats the point of spec §3.

Either set the association inside the *Create Deal* step if Zapier offers a Contact field,
or add a following **HubSpot → Associate** step linking the new deal to the contact matched
on email.

### 3.4 Lifecycle

If you enabled the §0 toggle, **skip this** — HubSpot moves the contact to Customer on its
own when the deal lands in a closed-won stage. Only add an explicit *Update Contact* step
setting `lifecyclestage` to `customer` if you left that toggle off.

### 3.5 Test

Zapier's replay uses your last real purchase. There are none, so either run a genuine £0
test purchase through a free offer, or wait and watch the first live sale closely.

Confirm on the contact record: deal attached, stage `Closed Won — Enrolled`, amount correct
and in pounds, lifecycle `Customer`.

---

## 4. Delete the test data

Both systems, before anything real arrives:

- Kajabi → Contacts → delete the throwaway contact
- HubSpot → Contacts → delete the same, and any test deal it created

Then `node scripts/hubspot_crm_setup.mjs --verify` — the association audit at the end
reports contact counts, which is a quick way to confirm you got them all.

---

## 5. The four saved views

HubSpot has no API for these. Build in the UI, and set every one to **Shared** — a Private
view disappears the day someone else joins the portal.

### 5.1 Hot deals

Sales → Deals → *Add view* → name it `Hot deals`.

Deal stage is any of: `In Conversation`, `Application / Checkout Started`, `Demo / Trial`,
`Proposal`, `Negotiation` — **and** Close date is in the next 30 days.

Those stages span both pipelines. HubSpot's stage picker groups by pipeline, so tick across
both groups rather than selecting a pipeline first.

### 5.2 Abandoned checkout

Sales → Deals → *Add view* → `Abandoned checkout`.

Pipeline is `Academy` · Deal stage is `Application / Checkout Started` · Last activity date
is more than 3 days ago.

The highest-intent list you have — someone who reached checkout and stopped. Work it daily.

### 5.3 Enterprise pipeline

Sales → Deals → *Add view* → `Enterprise pipeline`.

Pipeline is `Tools & Enterprise` · Deal stage is **not** any of `Closed Won`, `Closed Lost`.

### 5.4 ICP-fit leads

Contacts → *Add view* → `ICP-fit leads`.

Company Turnover Band is any of `£1m–£2m`, `£2m–£5m` · Trade Discipline is known ·
Lifecycle stage is any of `Lead`, `Marketing Qualified Lead`, `Sales Qualified Lead`.

This one stays empty until Zap one has been running a while and the qualification fields
are actually being filled in. Empty is expected, not broken.

---

## 6. Order of work

1. §0 lifecycle toggle — 30 seconds
2. §2 Zap one — the join key, and the only piece that changes what you can do day to day
3. §5 saved views — but see the note below
4. §3 Zap two — nothing has sold, so nothing is waiting on it

Views 5.1–5.3 filter on deals and 5.4 on qualification fields. You have neither yet. They
are quick to build but you cannot tell a working filter from a broken one against an empty
portal, so building them after some real data has flowed is the safer order.
