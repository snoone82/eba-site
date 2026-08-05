# TEBA — what the CRM actually captures, and how attribution works

Updated 5 Aug 2026. Every statement here was checked against the running code
and a live test POST to `teb-academy.com/api/lead`.

---

## The short version

Every form on the site posts to `/api/lead`, which creates or updates a contact
in HubSpot. **It never duplicates** — a repeat submission updates the same
contact, matched on email.

Attribution was broken until today: the browser was collecting UTM values and
the server was throwing them away, so every lead was written as "website" and
Facebook, LinkedIn and Instagram were indistinguishable. That's now fixed.

---

## What gets captured

| Field | Where from | HubSpot property |
|---|---|---|
| Email | form (required) | `email` |
| First / last name | form `name`, split | `firstname` / `lastname` |
| Phone | form | `phone` |
| Company | form | `company` |
| Message / enquiry text | form | `message` |
| What they're interested in | contact form dropdown | `product_interest` |
| Which form they used | set per form | `teba_form` |
| **Where they came from** | UTM tag, else referrer | `teba_source` |
| **Which platform exactly** | UTM tag, else referrer | `teba_source_detail` |
| Campaign / medium / content | UTM tags | `utm_campaign` etc. |
| Free toolbox-talk user | set by that form | `toolbox_talk_user` |
| Lifecycle stage | set to "lead" on first sight only | `lifecyclestage` |

Lifecycle is only set on **creation** — otherwise an existing customer filling
in a form would be dragged back down to "lead".

---

## How we know if someone came from Facebook, LinkedIn or Instagram

Two mechanisms, in order of reliability.

### 1. Tagged links (deliberate — use these everywhere)

Add UTM parameters to every link you post. The site captures them on the first
page view and holds them for the whole visit, so they survive someone browsing
around before signing up.

```
https://teb-academy.com/?utm_source=instagram&utm_medium=social&utm_campaign=launch
https://teb-academy.com/?utm_source=linkedin&utm_medium=social&utm_campaign=launch
https://teb-academy.com/?utm_source=facebook&utm_medium=social&utm_campaign=launch
https://teb-academy.com/?utm_source=youtube&utm_medium=social&utm_campaign=launch
```

**Use these in:** every social bio link, every post that links to the site, email
footers, and anything the marketing teams publish. Change `utm_campaign` per
campaign (`launch`, `founding-cohort`, `toolbox-talk`) and you can compare them
in HubSpot.

### 2. Referrer fallback (automatic — the safety net)

If a link **wasn't** tagged, the browser still reports which site it came from,
and that gets used instead. Verified working:

| Visitor arrives from | Recorded as | Detail |
|---|---|---|
| instagram.com (tagged or not) | `social_media` | instagram |
| linkedin.com | `social_media` | linkedin |
| facebook.com / m.facebook.com | `social_media` | facebook |
| youtube.com | `social_media` | youtube |
| google.com | `website` | search:google.com |
| another site linking to you | `referral` | that domain |
| typed the URL / no referrer | `website` | direct |

So untagged links still attribute correctly. Tagging is better because it also
tells you *which post* — the fallback only tells you which platform.

**One real limitation, stated honestly:** Instagram opens links in its in-app
browser, which sometimes strips the referrer. Tagged links are unaffected. This
is the single best reason to tag your Instagram bio link rather than rely on
the fallback.

---

## Before this works: create the custom properties in HubSpot

HubSpot rejects a write if it contains a property name it doesn't recognise.
These need creating (Settings → Properties → Create property, object = Contact):

| Property (internal name) | Type |
|---|---|
| `teba_source` | Dropdown: website, social_media, warm_network, referral, event |
| `teba_source_detail` | Single-line text |
| `teba_form` | Single-line text |
| `utm_campaign` | Single-line text |
| `utm_medium` | Single-line text |
| `utm_content` | Single-line text |
| `product_interest` | Dropdown: academy, rams, coshh, o_m, co_pilot, mentorship, enterprise |
| `toolbox_talk_user` | Single checkbox |

**Until they exist, leads are still saved.** The endpoint now detects a rejection,
strips the custom fields and retries with standard ones only — so you get the
contact with name, email and phone, just without attribution. A partly-tagged
contact beats a lost one. The build warning appears in the Vercel function logs.

---

## Which forms feed it

| Form | Sends | `teba_form` value |
|---|---|---|
| Holding page waitlist | email + attribution | `waitlist:pre-launch` |
| Business health check | name, email + attribution | `lead-magnet:business-health-check` |
| Toolbox talk generator | email + attribution | `lead-magnet:toolbox-talk-generator` |
| Contact enquiry | name, email, company, enquiry, message | `contact-enquiry` |

Only the waitlist is live right now — the rest return when `COMING_SOON` is off.

**Phone numbers:** the backend accepts and validates `phone`, but **no current
form asks for one.** If you want phone capture, it needs adding to the contact
form — a deliberate choice, since asking for a phone number on a waitlist
reduces signups noticeably.

---

## Verified working

- `POST /api/lead` with a real payload → contact created in HubSpot (`{"ok":true,"created":true}`)
- Empty body → 422, bad method → 405, honeypot field → silently accepted and dropped
- Attribution logic unit-tested against 10 real arrival scenarios

⚠️ A test contact `claude-test-delete-me@example.com` was created while verifying
this. **Delete it in HubSpot.**
