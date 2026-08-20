# Toolbox Talk Generator — Academy-member access, runbook

Both thank-you messages and the FAQ promise "the full Toolbox Talk Generator,
included with every Academy enrolment — your access link is provided once
payment is complete." This is that: a second Kajabi webhook,
`/api/toolbox-talk-grant`, that grants an unlimited, no-email personal link on
purchase. It's a separate endpoint from `/api/kajabi-webhook` (the HubSpot
sync) — nothing here touches or risks that sync.

## What it does

On a Kajabi purchase event: generates a personal access token, stores it
against the buyer's email, and emails them
`https://teb-academy.com/toolbox-talk?access=<token>` — a personal link to the
same Toolbox Talk Generator page, with the email step skipped and no rate
limit. A repeat purchase for the same email issues a fresh token; the old link
stops working (this is intended, not a bug — one active link per member).

## Setup — two things, one-off

1. **Set three environment variables** in the Vercel project settings — never
   committed (the first two are new; the third already exists for
   `/api/kajabi-webhook` and is reused as-is):
   - `DATABASE_URL` — Postgres connection string (same one the free-tier
     generator uses; see `DEPLOY.md`)
   - `RESEND_API_KEY` + `RESEND_FROM_EMAIL` — same Resend account the
     free-tier generator uses
   - `KAJABI_WEBHOOK_SECRET` — the existing value, nothing to change

2. **Add a second "Send Webhook" step to the purchase automation.** Kajabi's
   automation editor lets you chain multiple actions off one trigger — find
   the automation that already fires `/api/kajabi-webhook` on a completed
   purchase (per `HUBSPOT_CRM_RUNBOOK.md` §5.2) and add a second "Send
   Webhook" action on the *same* trigger, pointing at:

   ```
   https://teb-academy.com/api/toolbox-talk-grant?secret=<the KAJABI_WEBHOOK_SECRET value>&event=purchase
   ```

   Both webhook steps fire on the same purchase — one syncs HubSpot, the other
   grants Toolbox Talk access. Neither depends on the other; if one fails, the
   other still runs.

   **This is admin-UI work.** The Kajabi MCP's automations tools are not enabled
   for this account yet (rollout-gated), so the purchase automation cannot be
   created programmatically. The secret to paste is the one already embedded in
   either Kajabi form's webhook URL — copy it from there rather than retyping.
   Step 1 is done: the health check returned `ok: true` with database and Resend
   both `configured` (verified 20 Aug 2026).

**Adding the variables is not enough — redeploy.** Same as every other env-var
change: Vercel injects them at build/deploy time, not live.

## Verify

Health check first (writes nothing):

```bash
curl "https://teb-academy.com/api/toolbox-talk-grant?secret=<the secret>"
# {"ok":true,"checks":{"database":"configured","resend":"configured"}, ...}
```

Then a real test purchase (or Kajabi's "send test webhook" if the automation
editor offers one) and confirm:

1. An email arrives at the test buyer's address with a `teb-academy.com/toolbox-talk?access=...` link.
2. Opening that link shows the "Academy member — unlimited generations" banner
   and no email field.
3. Generating a toolbox talk from that link works, with no rate-limit message.

If the webhook returns `no_email_in_payload`, the response includes
`received_keys` — check those against `EMAIL_PATHS` in
`api/toolbox-talk-grant.ts` and add the matching path, same fix as documented
for `/api/kajabi-webhook`.

## If a member needs their link resent

There's no admin UI for this yet — re-fire the same Kajabi webhook (Kajabi's
automation history usually has a "replay" option), or ask them to email
support and manually query `academy_members` in Postgres for their token.
