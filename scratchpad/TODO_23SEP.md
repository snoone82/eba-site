# Ste's TEBA to-do — captured 23 Sep 2026, updated 24 Sep 2026

- [x] **Fix Kajabi's payment provider** — resolved via Kajabi Support 23 Sep.
      Verified live: RAMS + COSHH checkouts both load cleanly, no "payments
      paused" message, real payment form.
- [x] **Wire the Kajabi webhook on all 3 offers** (Academy, Academy +
      Documents, Document Library) — done 24 Sep via the single combined
      `/api/kajabi-purchase` endpoint (Kajabi's real UI only has one
      "Purchase Webhook URL" field per offer, not the two-webhook setup
      originally assumed). Verified live: all 3 offers returned a clean
      200 on Kajabi's own test-send.
- [ ] **Create hello@teb-academy.com mailbox** — blocked on **Manchester IT**,
      not Ste. Ste to raise the request with them. Once live: send a test
      email from an outside account to confirm it arrives; if it doesn't
      land, check MX/SPF records at 123-Reg.
- [ ] **Stripe — separate direct website integration** (not the Kajabi fix,
      which is done). Only relevant if Ste wants a checkout path that
      bypasses Kajabi entirely for AI tools (`STRIPE.omManual` /
      `complianceChatbot` / `toolsSingle` / `toolsBundle` in constants.ts —
      still unused TODO placeholders). Needs the Stripe connector authorised
      in claude.ai connector settings first. Not started — deprioritised
      behind the Kajabi fix, which was done first per Ste's choice.
- [x] **Free ($0) offer confirmed intentional** — "The Engineering Business
      Academy - limited access" (2151374092) is deliberately live, for staff
      testing. Leave as is, nothing to do.
- [x] **10 orphaned Kajabi Digital Download "collections"** — checked 24 Sep,
      they're already gone. Kajabi's product list shows only 3 products
      total (Course, free staff-testing tier, the one real Document
      Library) — nothing left to delete.
