# TEBA — HubSpot CRM build spec

Decision: HubSpot is the CRM (Mark's call, Ste's decision, 2 Aug 2026).
This document is the build plan. Execute once HubSpot tools are enabled in-session.

---

## Division of responsibility — decide this once, never blur it

Two systems holding people is only dangerous if it's unclear which one is right.

| | **Kajabi** | **HubSpot** |
|---|---|---|
| System of record for | Purchases, course access, membership | Conversations, pipeline, companies |
| Owns | What someone bought, what they can log into | Who they are, where the deal is, what was said |
| Never used for | Sales pipeline | Granting product access |

**Rule: if it's about money already taken, Kajabi is right. If it's about money not yet taken,
HubSpot is right.**

The link between them is the Kajabi contact ID stored on the HubSpot contact record
(`kajabi_contact_id`). Without that field the two databases drift within weeks.

---

## 1. Two deal pipelines, not one

The Academy sale and the Enterprise sale are different motions. Forcing them into one
pipeline produces meaningless forecasts.

### Pipeline A — Academy
Course sales. Short cycle, single decision-maker, £999–£1,999.

| Stage | Enters when | Probability |
|---|---|---|
| New Lead | Enquiry received, not yet contacted | 5% |
| Contacted | Outreach sent, no reply yet | 10% |
| In Conversation | Two-way dialogue established | 30% |
| Application / Checkout Started | Intent shown, payment not completed | 65% |
| Closed Won — Enrolled | Payment confirmed in Kajabi | 100% |
| Closed Lost — Not Now | Explicit no, or 60 days silent | 0% |

### Pipeline B — Tools & Enterprise
Subscriptions and Co-Pilot deployments. Longer cycle, multiple stakeholders,
£39/mo through to £1,999 setup + £199/mo.

| Stage | Enters when | Probability |
|---|---|---|
| Enquiry | Interest registered | 5% |
| Discovery | Requirements conversation held | 20% |
| Demo / Trial | Tool shown or trialled | 40% |
| Proposal | Written quote issued | 60% |
| Negotiation | Terms under discussion | 80% |
| Closed Won | Contract signed | 100% |
| Closed Lost | Declined or gone cold | 0% |

---

## 2. Custom contact properties

Beyond HubSpot defaults. These exist to qualify against the actual ICP.

| Property | Type | Values / notes |
|---|---|---|
| `kajabi_contact_id` | Single-line text | **Critical** — the join key between systems |
| `trade_discipline` | Dropdown | Mechanical · Electrical · M&E · Fire · HVAC · Other |
| `company_turnover_band` | Dropdown | Under £500k · £500k–£1m · £1m–£2m · £2m–£5m · £5m+ |
| `team_size` | Dropdown | 1–5 · 6–15 · 16–50 · 50+ |
| `teba_source` | Dropdown | Website · Social · Warm Network · Referral · Event |
| `product_interest` | Multi-checkbox | Academy · RAMS · COSHH · O&M · Co-Pilot · Mentorship · Enterprise |
| `toolbox_talk_user` | Single checkbox | Took the free generator — a warm-lead signal |

**Why turnover band matters:** the Academy's core message targets the £1m–£2m growth ceiling.
This property makes that segment addressable instead of theoretical.

---

## 3. Companies, not just contacts

The biggest reason HubSpot beats the Kajabi tag system: **B2B sales happen to companies.**

- Create a Company record for every contact's firm.
- Associate contacts to companies — a director and a contracts manager at the same firm
  are one opportunity, not two leads.
- Company properties worth filling: turnover band, employee count, region, trade.

Enterprise deals in particular involve several people. Without companies you will double-count.

---

## 4. Lifecycle stage mapping

Use HubSpot's native lifecycle stages so reporting works out of the box:

| HubSpot lifecycle | TEBA meaning |
|---|---|
| Subscriber | On the list, no buying signal |
| Lead | Enquiry made |
| Marketing Qualified Lead | Engaged — opened, clicked, downloaded, used the free tool |
| Sales Qualified Lead | Fits ICP and has had a real conversation |
| Opportunity | Open deal in either pipeline |
| Customer | Paid, in Kajabi |
| Evangelist | Referred someone |

---

## 5. Migration from the Kajabi tag system

The Kajabi CRM layer built on 30 July maps cleanly across. Nothing is wasted.

| Kajabi tag | HubSpot destination |
|---|---|
| Stage 1 · New Lead | Deal stage: New Lead |
| Stage 2 · Contacted | Deal stage: Contacted |
| Stage 3 · In Conversation | Deal stage: In Conversation |
| Stage 4 · Applied / Checkout Started | Deal stage: Application / Checkout Started |
| Stage 5 · Enrolled | Deal: Closed Won + lifecycle Customer |
| Stage 6 · Not Now / Lost | Deal: Closed Lost |
| Source · * | `teba_source` |
| Interest · * | `product_interest` |

**Contacts currently in Kajabi: 0 enrolled, no pipeline data.** Migration is therefore
trivial — there is nothing to move. This is the ideal moment to switch.

**Keep the Kajabi tags in place.** They still drive Kajabi email automations and offer logic.
They stop being the pipeline; they don't stop being useful.

---

## 6. Sync — Kajabi to HubSpot

Zapier is already connected to this workspace, which makes it the pragmatic route.

**Minimum viable sync — two Zaps:**

1. **New Kajabi contact → HubSpot contact.** Creates or updates. Writes `kajabi_contact_id`
   and `teba_source`.
2. **Kajabi purchase → HubSpot.** Sets lifecycle to Customer, moves the associated deal to
   Closed Won, writes the amount.

**Do not sync HubSpot → Kajabi.** One-way only. Two-way sync between systems with different
data models is how you get duplicate contacts and phantom customers.

---

## 7. Build order

1. Create both deal pipelines with stages and probabilities
2. Create the custom contact properties
3. Set up company associations
4. Configure lifecycle stage automation
5. Create saved views: Hot deals · Abandoned checkout · Enterprise pipeline · ICP-fit leads
6. Build the two Zaps
7. Test with a dummy contact end to end, then delete it

Steps 1–5 are mine once tools are enabled. Step 6 needs Zapier enabled too. Step 7 is joint.

---

## 8. What NOT to do

- **Don't buy Professional.** Sales Hub Pro is $100/user/mo, Marketing Pro $890/mo, plus a
  mandatory $1,500 onboarding fee. Free tier covers everything in this spec. Starter (~$20/seat)
  only if you need sequences and more automation.
- **Don't import a purchased contact list.** UK GDPR — consent must be traceable.
- **Don't let HubSpot send marketing email yet.** Kajabi owns email until there's a reason to
  move it, and running both is how people get emailed twice.
- **Don't create deals for every subscriber.** A deal means a real opportunity. Inflated
  pipelines are worse than empty ones.
