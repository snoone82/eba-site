# TEBA CRM — Recommendation & Build Plan

Date: 30 July 2026 · Launch: 3 August 2026

---

## The short answer

**Don't buy HubSpot yet.** Use the Kajabi CRM layer (now built — see below) for the founding
cohort, and revisit a dedicated CRM at roughly **50 paying customers or the first real
enterprise deal**, whichever comes first.

Reason: a CRM's value is proportional to the number of relationships you can't hold in your
head. Right now that number is small enough to hold. What you actually need before 3 August
is *not* more CRM — it's the ability to answer three questions:

1. Who came in, and from where?
2. Who have I not followed up with?
3. Who bought, and what did they buy?

All three are answerable in Kajabi today, for £0 and zero extra maintenance.

---

## What a CRM must do for TEBA specifically

A CRM is not an address book. For this business it has exactly four jobs:

| # | Job | Why it matters for TEBA |
|---|-----|--------------------------|
| 1 | **Pipeline visibility** — who is at which stage | Founding cohort is limited; you need to know who's close to enrolling |
| 2 | **Follow-up discipline** — who's gone cold | The £999 course sells on conversation, not on checkout buttons |
| 3 | **Source attribution** — what actually works | Tells you whether social, warm network or the site is producing |
| 4 | **Customer record** — what they bought, what they own | Needed for renewals, tool upsells, and enterprise expansion |

Note what is *not* on that list: email marketing (Kajabi does it), invoicing (Kajabi/Stripe
does it), course delivery (Kajabi does it). This is why HubSpot would mostly duplicate what
you already pay for.

---

## The three options, honestly compared

### Option A — Kajabi-native CRM layer ✅ RECOMMENDED NOW

Tags as pipeline stages, segments as saved views, Kajabi's built-in email and automations.

- **Cost:** £0 (already paying for Kajabi)
- **Setup:** Done — built today
- **Good for:** 0–50 customers
- **Limits:** No deal values, no task reminders, no call logging, manual stage moves

### Option B — HubSpot Free / Starter

HubSpot's free CRM is genuinely good and genuinely free (unlimited contacts, real deal
pipeline, task reminders, email tracking). Starter is **$20/seat/month**, with a promotional
rate around **$7/month** seen in July 2026 — worth confirming at checkout since promos shift.

- **Cost:** £0 free tier, ~£16–20/seat/mo Starter
- **Good for:** When you're juggling 30+ live conversations, or selling enterprise deals with
  multiple stakeholders and a real close date
- **Watch out:** Professional is a cliff — **$100/user/mo for Sales Pro, $890/mo for Marketing
  Pro, plus a mandatory $1,500 onboarding fee**. Never let a rep talk you up to Pro at your stage.
- **The catch:** HubSpot + Kajabi need syncing. Without it you get two contact databases that
  disagree — which is worse than one imperfect one.

### Option C — Custom-built CRM ❌ NOT RECOMMENDED

- **Cost:** Weeks of build time, then permanent maintenance, hosting, auth, backups, GDPR duty
- **Verdict:** You'd be building a worse HubSpot to save £16/month, four days before launch.
  This is the wrong fight. Build the business; buy the tooling.

---

## What I built today (live in Kajabi now)

### Pipeline stages (tags)

| Stage | Tag ID | Meaning |
|-------|--------|---------|
| Stage 1 · New Lead | 2150283879 | Came in, not yet contacted |
| Stage 2 · Contacted | 2150283880 | You've reached out, no reply yet |
| Stage 3 · In Conversation | 2150283881 | Two-way dialogue — the hot list |
| Stage 4 · Applied / Checkout Started | 2150283882 | Intent shown, not yet paid |
| Stage 5 · Enrolled | 2150283883 | Paying customer |
| Stage 6 · Not Now / Lost | 2150283884 | Keep for later nurture — never delete |

**Rule: a contact carries exactly one stage tag.** Moving stage = remove old, add new.

### Source tags

`Source · Website` (2150283885) · `Source · Social Media` (2150283886) ·
`Source · Warm Network` (2150283887) · `Source · Referral` (2150283888)

Set once, never changed. This is your attribution data.

### Interest tags

`Interest · Academy` (2150283889) · `Interest · AI Tools` (2150283890) ·
`Interest · Enterprise / In-House Training` (2150283891)

Can hold more than one. Drives which emails they should get.

### Saved views (segments)

| View | What it answers |
|------|-----------------|
| Pipeline · New Leads (untouched) | "Who haven't I contacted?" — work this daily |
| Pipeline · Hot (In Conversation) | "Who's close?" — the list that matters most |
| Pipeline · Applied / Checkout Started | "Who nearly bought?" — highest-value follow-up |
| Pipeline · Enrolled (Customers) | "Who's in?" — cohort roster |
| Interest · Enterprise Enquiries | "Who wants team training?" — biggest deal sizes |

---

## The daily routine (this is the actual system)

The tags are worthless without the habit. Ten minutes, once a day:

1. Open **New Leads (untouched)** → contact each one → move to Stage 2.
2. Open **Hot (In Conversation)** → anyone you haven't spoken to in 5+ days gets a nudge.
3. Open **Applied / Checkout Started** → anyone sitting there over 48 hours gets a personal
   message. This is the single highest-return list in the business.
4. Anyone clearly not proceeding → Stage 6. Keep the list clean or you'll stop trusting it.

A CRM you don't open every day is a spreadsheet with a subscription fee.

---

## Migration trigger — when to move to HubSpot

Move when **two or more** of these are true:

- More than ~50 active contacts in Stages 2–4 at once
- You're forgetting follow-ups (the real signal)
- More than one person is doing sales
- Enterprise deals with several stakeholders and negotiated pricing
- You need revenue forecasting, not just a customer list

At that point: HubSpot Free tier first, sync Kajabi → HubSpot, keep Kajabi as the system of
record for *purchases* and HubSpot for *conversations*. Do not run two databases without a sync.

---

## Recommended next steps

1. **Now → launch:** use the Kajabi layer. No new tools before 3 August.
2. **Tag every lead on arrival** — source tag + Stage 1. Non-negotiable habit.
3. **Post-launch (~4 weeks):** review. Count Stage 2–4 contacts. If over 50, open HubSpot Free.
4. **Backlog:** auto-tagging via Kajabi form/offer automations so leads self-file by source —
   worth doing once real volume shows which sources actually produce.

---

## Sources

- [HubSpot Pricing 2026 — TinyCommand](https://tinycommand.com/blogs/hubspot-pricing-explained)
- [HubSpot CRM Pricing 2026 — Costbench](https://costbench.com/software/crm/hubspot/)
- [2026 HubSpot Pricing Guide — Cargas](https://cargas.com/software/hubspot/pricing/)

Pricing verified July 2026. Promotional rates change — confirm in HubSpot checkout before committing.
