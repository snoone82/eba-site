# Ste's TEBA to-do — 23 Sep 2026

Captured verbatim from chat, owner-tagged as we work through it.

- [ ] **Wire the 3 Kajabi webhooks** (Academy, Academy + Documents, Document Library)
      — native Kajabi webhook screen, not the blocked Automations API. **[STE]**
      URL: `https://teb-academy.com/api/toolbox-talk-grant?secret=<KAJABI_WEBHOOK_SECRET>&event=purchase`
- [ ] **Create enquiries@teb-academy.com** mailbox **[STE]** — need to know the mail
      provider (Google Workspace / Microsoft 365 / other) before Claude can help
      with DNS/verification.
- [ ] **Connect Stripe** — two different things tangled together, need to pick which:
      (a) fix Kajabi's own broken payment provider (the original RAMS/COSHH
      "payments paused" issue from the start of this engagement — never confirmed
      fixed) — Kajabi admin only, no API for this.
      (b) a separate direct Stripe integration on the website for AI-tool
      checkouts (`STRIPE.omManual` / `complianceChatbot` / `toolsSingle` /
      `toolsBundle` in constants.ts — still TODO placeholders, currently unused;
      everything live today actually checks out via Kajabi-hosted checkout URLs).
      Needs the Stripe connector authorised in claude.ai connector settings before
      Claude can do anything here.
- [ ] **Checkout for AI tools / subscriptions** — already exists via Kajabi checkout
      links (RAMS/COSHH/O&M), contingent on (a) above actually being fixed.
- [ ] Answered in chat: how documents land with a buyer, what the access email
      says, where data is stored, whether website purchases reach HubSpot.
- [ ] Found while answering: a free ($0) offer — "The Engineering Business
      Academy - limited access" (2151374092) — is live and grants product access.
      Confirm this is intentional (a genuine free tier) or close it if it's a
      leftover test/backdoor.
- [ ] Still open from earlier in this engagement, never confirmed resolved:
      RAMS/COSHH subscription billing "paused" on Kajabi's connected payment
      provider (the very first ask of this session).
- [ ] Still open: delete the 10 orphaned Kajabi Digital Download "collections"
      created before we discovered `create_download` makes standalone products,
      not sub-folders (no delete tool available — Kajabi admin only).
