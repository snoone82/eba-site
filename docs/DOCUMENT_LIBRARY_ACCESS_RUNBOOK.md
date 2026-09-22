# Wiring Document Library access — the Kajabi dashboard steps

Written 22 Sep 2026. This is the one manual step left for the new members'
Document Library (`/documents-library`) to actually reach buyers. Everything
else — the gated page, the 380 real documents, the download links, the access
database — is already built and deployed. Until this is done, someone can pay
and never receive their access link.

Same mechanism as the RAMS/COSHH tools (`docs/TOOL_SUBSCRIPTION_WIRING_RUNBOOK.md`)
and the original Toolbox Talk grant (`scripts/TOOLBOX_TALK_GRANT_RUNBOOK.md`):
one endpoint, already deployed, secret already in Vercel env —

    https://teb-academy.com/api/toolbox-talk-grant?secret=<KAJABI_WEBHOOK_SECRET>

It reads the offer title from the payload and now grants the right thing per
offer (see the comment above `toolsForOffer` in `api/toolbox-talk-grant.ts`):

| Offer | Grants |
|---|---|
| The Engineering Business Academy - Full Academy Access (£999) | Toolbox Talk Generator |
| The Engineering Business Academy + Documents - Full Access (£1,299) | Toolbox Talk Generator **and** Document Library |
| The Engineering Business Academy — Complete Document Library (£399) | Document Library |

## Per offer — check/wire all three

Offer IDs (site 2148787052): Academy `2151280639` · Academy + Documents
`2151280640` · Document Library `2151348610`.

**Academy (£999) may already be wired** — it's the original offer this
endpoint was built for. Check first before assuming it needs redoing.
**Academy + Documents and Document Library are newer offers (created 20
Aug 2026) and most likely are NOT wired yet** — treat those as new setup.

For each offer that isn't already wired, in Kajabi Admin → Settings →
Automations (or the offer's own Automations tab):

### 1. Purchase → grant
- **When**: Offer is purchased → [the offer]
- **Then**: Send webhook ("Send a POST request" on some plans)
  - URL: the endpoint above, with `&event=purchase` appended
- Save and PUBLISH the automation.

If the Academy offer already has this wired for Toolbox Talk, you don't need
to add anything new — the same webhook now also handles the Document Library
grant automatically, because that logic lives in the endpoint, not in Kajabi.
Just confirm Academy + Documents and Document Library each have their own
copy of this same automation step.

### 2. Cancellation/refund → revoke
Digital downloads and the Academy are one-time purchases, not subscriptions,
so there's no "subscription cancelled" trigger — use whatever refund/access-
revoked trigger the offer's automations panel offers (same pattern as the
RAMS/COSHH runbook's step 2):
- **Then**: Send webhook
  - URL: the endpoint above, with `&event=revoke` appended
- Save and PUBLISH.

If refunds are rare enough that this isn't worth automating yet, it's a safe
thing to defer — a token can always be revoked manually by editing the
`academy_members` row in Postgres.

## Verify (per offer)

1. Health check first, writes nothing:
   ```
   curl "https://teb-academy.com/api/toolbox-talk-grant?secret=<the secret>"
   # {"ok":true,"checks":{"database":"configured","resend":"configured"}}
   ```
2. In Kajabi, use the automation's "test" action, or a 100%-off coupon
   purchase on each of the three offers.
3. Confirm the access email arrives. Academy-only → one Toolbox Talk link.
   Document Library → one Document Library link. Bundle → both links.
4. Open the Document Library link and confirm the page shows the library
   (not the "subscriber area" gate or an error) and a download actually
   works.
5. If testing the revoke step: cancel/refund the test purchase and confirm
   the link stops working (the page shows "that access link isn't valid any
   more").

## If something doesn't grant correctly

Health check first. If the webhook returns `no_email_in_payload`, the
response includes `received_keys` — check those against `EMAIL_PATHS` in
`api/toolbox-talk-grant.ts`.

If the email arrives but the Document Library page shows "wrong product"
for a Document Library or bundle buyer, the offer title reaching the webhook
doesn't contain "document" — check the exact offer title in the payload
against the table in `api/toolbox-talk-grant.ts`'s `toolsForOffer` comment
and update it if Kajabi is sending something different than expected.
