# How we sell each thing — and who needs a login

Written 25 Aug 2026, after checking what is already built.

## The key insight: nobody needs a login

There is already a working pattern in this repo, built for the Toolbox Talk
Generator, and it answers the whole question:

- **Free tier** — email address only, rate-limited per email + IP. No account.
- **Paid tier** — on a Kajabi purchase, `/api/toolbox-talk-grant` fires, mints an
  access token, stores it in the `academy_members` Postgres table, and emails the
  buyer a personal link: `teb-academy.com/toolbox-talk?access=<token>`
- That link is their key. **No username, no password, no login screen.** They
  bookmark it and use the tool whenever they want.

This is the right model for a contractor on site with muddy hands and a phone.
Every extra login is a support ticket waiting to happen.

**Extend this exact pattern to RAMS and COSHH.** The plumbing exists; each new
tool needs a route, a grant hook and a prompt — not a new auth system.

---

## Product by product

### Self-serve software — token link, no login

| Tool | Price | How it sells | How they get in |
|---|---|---|---|
| Toolbox Talk | Free / included | Email capture, or Academy enrolment | Personal link, emailed ✅ built |
| RAMS Generator | £39–49/mo | Kajabi subscription offer | Same pattern — to build |
| COSHH Generator | £29–39/mo | Kajabi subscription offer | Same pattern — to build |
| Both-tools bundle | £49–69/mo | Kajabi subscription offer | Same pattern — to build |

Kajabi handles the recurring billing, card updates, failed payments and
cancellations. We never touch any of that. On purchase Kajabi fires a webhook,
we mint a token and email the link. On cancellation Kajabi fires again and we
revoke it.

**Why Kajabi and not standalone Stripe:** Kajabi is already connected, already
handles subscription lifecycle, and already fires the webhooks we rely on. A
separate Stripe account means a second place customers exist, a second set of
failed-payment emails, and reconciliation between the two. Only reason to go
direct to Stripe is if Kajabi's transaction fee becomes material at volume —
worth revisiting after the first hundred subscribers, not before.

### Done-for-you services — enquiry, then invoice

| Service | Price | How it sells |
|---|---|---|
| O&M Compiler | £299/manual | Buy → upload the project files → we compile → deliver in 24h |
| Compliance Co-Pilot | £499 setup + £149/mo | **Enquiry only.** Scope it, then invoice. |
| Enterprise deployment | £1,999 + £199/mo | Enquiry only |

**Do not take money up front for the Co-Pilot.** It is a custom build against
someone else's document set. You cannot price or promise it before you have seen
what they have. Selling it as a one-click purchase means either refunding people
or building something at a loss.

The correct flow:

1. Button says **"Request a build"** — not "Buy now"
2. Goes to the enquiry form → `/api/lead` with `product_interest: co_pilot`
3. Automatic email: *"We've got it. We'll be in touch within one working day to
   scope it."*
4. HubSpot deal created in the **Tools & Enterprise** pipeline at Enquiry
5. You scope it on a call
6. **Then** take the setup fee — a Stripe payment link or a one-off Kajabi offer
   built for that customer
7. Monthly subscription starts when it goes live, not when they enquire

O&M is different — it is a defined deliverable at a fixed price, so it can be
bought directly. The buyer then needs somewhere to send the files: a simple
upload form, or just an email address in the confirmation.

---

## What still needs building

- [ ] RAMS generator — route, grant hook, prompt (pattern exists)
- [ ] COSHH generator — same
- [ ] Kajabi subscription offers for RAMS / COSHH / bundle
- [ ] Revoke-on-cancellation hook (Kajabi fires it; we do not listen yet)
- [ ] O&M file-upload step after purchase
- [ ] "Request a build" enquiry flow for Co-Pilot + Enterprise
- [ ] Brand the £399 Document Library checkout (the two Academy ones are done)

## Kajabi checkout branding — done, with a limit

The two Academy checkouts now use the brand: brass button `#C9982E`, 8px button
radius, 12px card radius, soft brand border. They were Kajabi's default dark grey
`#343332` with a fully-rounded pill.

**It will never be pixel-identical to the site.** Kajabi's Encore theme lets us
control colours, radius, logo, header and footer — not layout or type scale. The
realistic goal is "obviously the same company", not "indistinguishable". The
things that actually carry that: logo, button colour, and the same words.
