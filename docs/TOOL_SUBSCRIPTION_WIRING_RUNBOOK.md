# Wiring the tool subscriptions — the Kajabi dashboard steps

Written 25 Aug 2026. Kajabi's automations API is not enabled for this account
("still being rolled out"), so these are MANUAL dashboard steps. ~15 minutes.
Until they are done, a buyer would be charged and receive no access link.

Our endpoint (already deployed, secret already in Vercel env):

    https://teb-academy.com/api/toolbox-talk-grant?secret=<KAJABI_WEBHOOK_SECRET>

It reads the offer title from the payload and emails the right link(s):
title contains "RAMS" → RAMS link · "COSHH" → COSHH link · both → both ·
anything else (Academy offers) → Toolbox Talk link, as today.

## Per offer — THREE offers, so three times over

Offers: RAMS (2151356807) · COSHH (2151356808) · Bundle (2151356809)

### 1. Purchase → grant
Kajabi Admin → Settings → Automations (or the offer's own Automations tab):
- **When**: Offer is purchased → [the offer]
- **Then**: Send webhook (labelled "Send a POST request" on some plans)
  - URL: the endpoint above, with `&event=purchase` appended
- Save and PUBLISH the automation.

### 2. Cancellation → revoke
- **When**: Subscription payment fails final time / Offer access revoked /
  Subscription cancelled — use whichever cancellation trigger the plan offers;
  if several exist, wire "access revoked" (it fires for refunds too).
- **Then**: Send webhook
  - URL: the endpoint above, with `&event=revoke` appended
- Save and PUBLISH.

If the plan has no webhook action on automations: each offer's own settings
page has a "Webhooks"/"Advanced" section that can fire on purchase — use that
for step 1 and raise step 2 with Kajabi support.

## Verify (before publishing the offers)

1. Health: GET the endpoint URL in a browser → `{"ok":true,...}` means DB and
   email are configured.
2. In Kajabi, use the automation's "test" (or make a 100%-off coupon purchase).
3. Confirm the access email arrives and the link opens the right generator.
4. Cancel the test purchase → confirm the link stops working (revoke).

## Then, to go on sale

1. Publish the three offers (they are drafts; pricing verified recurring/month).
2. Tell Claude to wire the checkout URLs into the site and flip OFFERS_LIVE.
3. One real end-to-end purchase test before announcing anything.
