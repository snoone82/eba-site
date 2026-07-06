# EBA Website — Copy, Pricing & Gating Corrections Master Prompt (v1)
(Committed verbatim as the working instruction for this pass — see session
history for the full text. Summary of directives:)
1. Tagline: remove "Empowering Engineers. Building Exceptional Businesses."
   everywhere; locked tagline is "Engineer Your Business. Design Your
   Freedom." — as TAGLINE constant.
2. Pricing: ROI band anchor locked at £600–£1,200 (+ companions);
   enterprise £997–£1,997 / £149–£349 removed and gated behind
   ENTERPRISE_PRICING=null ("Priced per deployment — enquire for a quote");
   agency £3k–£25k anti-anchor may stay as market context; sweep all other
   literal £ figures — confirmed list only (Academy £999/£1,499, +Docs
   £1,299, O&M £299, tools £99/£179), gate everything else.
3. Founder photography centralised to constants, TODO(eba) swap-ready.
4. Decarbonisation/fire insight sections: market commentary ONLY — no
   curriculum claims or links; CTAs → free Health Check / free Toolbox
   Talk; wrapped in SHOW_SECTOR_INSIGHTS flag.
5. Consistency: eba.academy only; accent discipline; no emoji-icons or
   banned superlatives.
Verification: build:static, greps clean, protected fixes untouched,
no dead links; commit as
`fix(site): tagline, pricing gates, curriculum claims, photo constants`.
