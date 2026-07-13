/**
 * EBA — The Engineering Business Academy
 * Single source of truth for brand colours, business facts and integrations.
 *
 * APPROVED PALETTE (Mark, from the brand asset pack / mockup A):
 * black/near-black wrapper + white content sections, coral Academy accent,
 * sky Tools accent, six-stop brand gradient as HAIRLINE RULES ONLY.
 *
 * WAYFINDING RULE: Academy/cohort/Mark/mentorship/story sections take the
 * CORAL accent; AI-tools/product/pricing/enterprise sections take the SKY
 * accent. Never both accents on one element.
 */

export const COLORS = {
  ink:    "#0A0A0A",  // jet black — nav, footer, hero, the two dark sections; text on light
  inkDeep:"#101010",  // bottom stop of the dark-section gradient
  white:  "#FFFFFF",  // content sections, cards
  paper:  "#F6F5F3",  // alternating light sections
  coral:  "#FF5B6E",  // ACADEMY accent — fills/chips/graphics + text on black only
  sky:    "#3AA0FF",  // TOOLS accent — fills/frames/graphics + text on black only
  sunset: "#FF9F1C",  // USAGE CAP: max ONE element per page (highlight stat / live badge)
  lime:   "#D4FF00",  // USAGE CAP: gradient stop ONLY — never standalone
  mint:   "#2ECC71",  // USAGE CAP: "live" markers only
  teal:   "#18C1D6",  // separator dots / small graphic accents
} as const;

/**
 * BRAND GRADIENT — the six-stop line from the brand asset pack.
 * HAIRLINE RULES ONLY — never backgrounds, buttons, fills, or text.
 * Allowed: logo underline · kicker underlines · one full-width rule before
 * the final CTA. (#E9425C and the old KEYIS four-stop remain banned.)
 */
export const BRAND_GRAD =
  "linear-gradient(90deg, #FF5B6E 0%, #FF9F1C 20%, #D4FF00 40%, #2ECC71 60%, #18C1D6 80%, #3AA0FF 100%)";

// Convenience named exports. NAVY/CREAM/RUST/OAT/COBALT are the historical
// token names used across the pages — kept to avoid a thousand-line rename;
// their VALUES are the approved palette.
export const NAVY = COLORS.ink;          // was navy — now jet black
export const CREAM = COLORS.paper;       // was cream — now paper #F6F5F3
export const WHITE = COLORS.white;
export const OAT = "#ECEBE8";            // secondary neutral surface (derived from paper)
export const AMBER = COLORS.sunset;      // USAGE CAP: max one element per page

/**
 * Academy accent. AA rule (enforced site-wide): pure CORAL is NEVER text on
 * white/paper (3.0:1 ✗). As text on light use RUST (#C92B42, 5.4:1 ✓); as
 * text on black use RUST_ON_DARK (#FF5B6E, 6.6:1 ✓). White text on RUST
 * fills passes (5.4:1 ✓); black text on CORAL fills passes (6.6:1 ✓).
 */
export const CORAL = COLORS.coral;
export const RUST = "#C92B42";           // coral, text-safe on white/paper
export const RUST_ON_DARK = COLORS.coral;

/**
 * Tools accent. Same AA rule: pure SKY is NEVER text on white/paper
 * (2.7:1 ✗). As text on light use COBALT (#176BC4, 5.3:1 ✓); as text on
 * black use COBALT_ON_DARK (#3AA0FF, 7.2:1 ✓). White on COBALT fills ✓;
 * black on SKY fills ✓.
 */
export const SKY = COLORS.sky;
export const COBALT = "#176BC4";         // sky, text-safe on white/paper
export const COBALT_ON_DARK = COLORS.sky;

// RGB triplets for inline rgba(...) tints (translucent fills/borders only —
// tints come from the BRIGHT accents so washes stay on-brand).
export const NAVY_RGB = "10,10,10";
export const CREAM_RGB = "246,245,243";
export const RUST_RGB = "255,91,110";    // coral tint base
export const COBALT_RGB = "58,160,255";  // sky tint base

/** Accent aliases. ACCENT_GRAD is the brand gradient — HAIRLINE RULES ONLY
 *  (it is consumed exclusively by kicker-underline rules). */
export const ACCENT_HEX = RUST;
export const ACCENT_RGB = RUST_RGB;
export const ACCENT_GRAD = BRAND_GRAD;

/** Layout flags kept for the pages' shared components (single light theme). */
export const IS_LIGHT = true;
export const IS_VIVID = true;

/** Background for the ink-dark sections (hero, founder band, dark page heroes). */
export const DARK_GRADIENT = "linear-gradient(180deg, #0A0A0A 0%, #101010 100%)";

/** Primary / muted text on those dark sections. */
export const ON_DARK = "#FFFFFF";
export const ON_DARK_RGB = "255,255,255";

/** Genuinely dark CTA buttons (distinct from sections). */
export const CTA_DARK_BG = "#0A0A0A";

/** Primary action buttons — coral fill with near-black text (6.6:1 ✓),
 *  exactly as approved in mockup A. */
export const CTA_PRIMARY_BG = CORAL;
export const CTA_PRIMARY_TEXT = "#0A0A0A";

/** Navigation — jet black bar per the brand header asset. */
export const NAV_ON_LIGHT = false;
export const NAV_BAR_BG = "rgba(10,10,10,0.96)";
export const NAV_LINK = "rgba(255,255,255,0.72)";
export const NAV_LINK_ACTIVE = "#FFFFFF";
export const NAV_BORDER = "rgba(255,255,255,0.10)";
export const NAV_CTA_BG = CORAL;         // coral pill, black text (6.6:1 ✓)
export const NAV_CTA_TEXT = "#0A0A0A";

/** Footer background — jet black. */
export const FOOTER_BG = "#0A0A0A";

/** Full-bleed CTA bands (soft neutral wash). */
export const CTA_BAND_BG = "linear-gradient(120deg, #EFEEEB 0%, #F6F5F3 100%)";

/** Translucent nav-bar scrim base. */
export const NAV_RGB = "10,10,10";

/** Soft hero glow — quiet coral/sky washes on black (no gradient element). */
export const HERO_GLOW =
  "radial-gradient(55% 80% at 84% 6%, rgba(255,91,110,0.10) 0%, transparent 60%), radial-gradient(45% 70% at 98% 40%, rgba(58,160,255,0.07) 0%, transparent 60%)";

/** Band surface for the trust strip / marquee. */
export const BAND_GRADIENT = "linear-gradient(90deg, #EFEEEB 0%, #F6F5F3 100%)";

/** Faint depth wash behind key sections. */
export const SECTION_GLOW =
  "radial-gradient(60% 55% at 50% -8%, rgba(255,91,110,0.05) 0%, transparent 62%)";

/** Alternating band tint. */
export const SECTION_TINT = "#EFEEEB";

/** Soft ambient orbs for empty areas. */
export const ORB_ACCENT = "radial-gradient(circle, rgba(255,91,110,0.12) 0%, transparent 70%)";
export const ORB_WARM = "radial-gradient(circle, rgba(58,160,255,0.09) 0%, transparent 70%)";

/**
 * Founder photography — every Mark image placement reads one of these
 * constants so the real-photography swap is a constants-only change.
 * TODO(eba): replace with real photography (shoot in progress) — current
 * files are stock placeholders in client/public/.
 */
export const MARK_PHOTO_HERO = "/mark-teaching.jpg";      // homepage hero background
export const MARK_PHOTO_FOUNDER = "/mark-1on1.jpg";       // homepage founder section
export const MARK_PHOTO_STORY = "/mark-conversation.jpg"; // /our-story hero portrait
export const MARK_PHOTO_MENTORSHIP = "/mark-mentoring.jpg"; // /mentorship hero + founder-sessions card

/** The locked brand tagline — the ONLY approved tagline. All components read
 *  this constant; never hard-code a tagline in a component. */
export const TAGLINE = "Engineer Your Business. Design Your Freedom.";

/** O&M ROI band — LOCKED figures. Do not change without sign-off. */
export const OM_TURNAROUND_STAT = "3 days → same day";
export const OM_TURNAROUND_MECH = "O&M manuals returned in 24 hours, not compiled by hand";
export const OM_SAVING_RANGE = "£600–£1,200 saved per manual";
export const OM_SAVING_MECH = "the engineer time each manual replaces";
export const TOOLS_SPEED_STAT = "Minutes, not afternoons";
export const TOOLS_SPEED_MECH = "RAMS, COSHH and toolbox talks on demand";

/**
 * The named methodology. The curriculum is presented everywhere as this System
 * so a future rename is a one-line edit.
 * TODO(eba): trademark status unconfirmed — do NOT add ™ anywhere until cleared.
 */
export const METHOD_NAME = "The Engineering Operating System";

// ── Integrations ───────────────────────────────────────────────────────────

/**
 * Live Kajabi checkout URLs — the published founding-cohort offers on
 * teba.mykajabi.com (created 13 Jul 2026, £999 / £1,299 GBP one-time).
 * The standard-price offers (£1,499 / £1,999) exist as drafts in Kajabi
 * admin, ready to swap in here when the founding cohort closes.
 */
export const KAJABI_CHECKOUT_URL =
  import.meta.env.VITE_KAJABI_CHECKOUT_URL ||
  "https://teba.mykajabi.com/offers/xWR6J4tA/checkout";

/** Kajabi checkout for the Academy + Documents tier. */
export const KAJABI_CHECKOUT_URL_DOCS =
  import.meta.env.VITE_KAJABI_CHECKOUT_URL_DOCS ||
  "https://teba.mykajabi.com/offers/HYFbPnn9/checkout";

/** Kajabi-hosted O&M manual upload/enquiry flow. While unset, the O&M CTA
 *  fails safe to the Stripe link (if set) or the internal tool page. */
export const OM_SERVICE_URL =
  import.meta.env.VITE_KAJABI_OM_SERVICE || "TODO(eba): Kajabi O&M service flow URL";

/**
 * Lead-magnet / enquiry form POST endpoint (Kajabi form action or webhook).
 * Empty string = form disabled ("Form coming soon"); never fakes success.
 */
export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || "";

/** Stripe Payment Links for the standalone AI-tool purchases. */
export const STRIPE = {
  omManual:
    import.meta.env.VITE_STRIPE_OM_MANUAL || "TODO(eba): Stripe Payment Link — O&M per-manual",
  complianceChatbot:
    import.meta.env.VITE_STRIPE_COMPLIANCE_CHATBOT ||
    "TODO(eba): Stripe Payment Link — Compliance Chatbot subscription",
  toolsSingle:
    import.meta.env.VITE_STRIPE_TOOLS_SINGLE ||
    "TODO(eba): Stripe Payment Link — single AI tool subscription",
  toolsBundle:
    import.meta.env.VITE_STRIPE_TOOLS_BUNDLE ||
    "TODO(eba): Stripe Payment Link — all-tools bundle subscription",
} as const;

/**
 * TODO(eba): Mark is reviewing whether the "EBA" abbreviation should be used
 * at all. It currently appears in SEO title suffixes ("| EBA"), the assistant
 * greeting and some body copy. If the decision is to drop it, sweep those and
 * regenerate the favicon (currently the brand-pack "THE EBA" tile).
 */

/**
 * Mentor team profiles — the mentorship page renders "The mentor team" ONLY
 * when this array is non-empty. Never invent people; populate with real
 * names, roles and photos once the wider leadership team is confirmed.
 * TODO(eba): add mentor profiles (name, role, one-line background, photo).
 */
export interface Mentor { name: string; role: string; bio: string; photo?: string }
export const LEADERSHIP_TEAM: Mentor[] = [];

/**
 * Accreditation & membership badges (CPD, sector bodies). Rendered ONLY when
 * this array is non-empty — we never show a badge we don't hold.
 * TODO(eba): populate when CPD accreditation is granted, e.g.
 *   { name: "CPD Member", logo: "/accreditations/cpd.png", url: "https://..." }
 */
export interface Accreditation { name: string; logo: string; url?: string }
export const ACCREDITATIONS: Accreditation[] = [];

/**
 * Testimonials are hidden until we have real founding-member quotes.
 * Pre-launch we have none — an empty-but-honest site beats fake proof.
 * Flip to true once real, attributable quotes are in Testimonials.tsx.
 */
export const SHOW_TESTIMONIALS = false;

/**
 * Case studies — architecture ready, content EMPTY until real founding-member
 * results exist. Never populate with invented examples.
 * TODO(eba): add real case studies (name, company, before/after, quote, photo)
 * once founding members have measurable results, then flip the flag.
 */
export const SHOW_CASE_STUDIES = false;
export interface CaseStudy {
  name: string;
  company: string;
  before: string;   // e.g. "Pricing to win — 4% net margin"
  after: string;    // e.g. "Pricing to profit — 11% net margin"
  quote: string;
  photo?: string;   // /public path — optional until supplied
}
export const CASE_STUDIES: CaseStudy[] = [];

// ── Business facts (do NOT invent — confirm with Mark post-meeting) ──────────

/**
 * Launch pricing — single fill-in point. CONFIRMED by Ste (13 Jul 2026):
 * Academy £999 → £1,499 · +Documents £1,299 → £1,999 · O&M £299/manual
 * (a compiled-FOR-you service, NOT part of any tool subscription).
 *
 * RAMS/COSHH subscriptions and Co-Pilot deployment pricing CONFIRMED by Ste
 * (13 Jul 2026, from market research): founder prices below; each "Standard"
 * value is what the price rises to after the founding window. The Co-Pilot
 * is a BUILT-FOR-you deployment (trained on each customer's documents,
 * hosted monthly) — setup fee + monthly, never a self-serve tool price.
 * A Toolbox Talk Generator is INCLUDED with Academy enrolment (both tiers).
 * Enterprise remains unconfirmed (gated).
 */
export const PRICING = {
  academyFounding: "£999",
  academyStandard: "£1,499",
  academyDocsFounding: "£1,299",
  academyDocsStandard: "£1,999",
  omPerManual: "£299",
  ramsMonthly: "£39/mo",
  ramsMonthlyStandard: "£49/mo",
  coshhMonthly: "£29/mo",
  coshhMonthlyStandard: "£39/mo",
  toolsBothMonthly: "£49/mo",
  toolsBothMonthlyStandard: "£69/mo",
  coPilotSetup: "£499",
  coPilotSetupStandard: "£1,999",
  coPilotMonthly: "£149/mo",
  coPilotMonthlyStandard: "£199/mo",
  enterpriseSetup: "TODO(eba): enterprise setup fee",
  enterpriseMonthly: "TODO(eba): enterprise monthly retainer",
} as const;

/**
 * Enterprise / white-label pricing.
 * TODO(eba): awaiting Mark's confirmation — do not publish a number until
 * confirmed. The old TESA-era catalogue figures were never approved for EBA
 * and must not return. While null, enterprise sections render
 * "Priced per deployment — enquire for a quote."
 */
export const ENTERPRISE_PRICING: { setup: string; monthly: string } | null = null;

/**
 * Per-document and per-pack prices on /documents came from the original site
 * export and are NOT on the confirmed price list.
 * TODO(eba): confirm per-document/bundle pricing with Mark, then flip to true.
 * While false, the page shows the documents without price tags and the pack
 * CTA reads "Enquire about this pack".
 */
export const SHOW_DOC_PRICES = false;

/**
 * Sector-insight sections (decarbonisation / fire market commentary) on the
 * homepage. Market commentary ONLY — there is no decarbonisation module in
 * the course, so these sections must never claim or imply the content is
 * taught in the Academy. Flip to false to remove both sections entirely.
 */
export const SHOW_SECTOR_INSIGHTS = true;

/**
 * Per-tool price notes — CONFIRMED founder prices (13 Jul 2026).
 * O&M £299/manual is a compiled-for-you service. The Co-Pilot note shows
 * the deployment price (setup + monthly), never a self-serve tool price.
 */
export const TOOL_PRICE_NOTES = {
  omManual: "£299 per manual · compiled for you",
  rams: "£39/mo · with COSHH £49/mo",
  coPilot: "Built for you · £499 setup + £149/mo founder price",
  coshh: "£29/mo · with RAMS £49/mo",
} as const;

/** Cohort / mentorship dates — TODO(eba): confirm real dates post-meeting
 *  (mentorship months live in MENTOR_INTAKES below). */
export const COHORT_START_DATE = "TODO(eba): founding cohort start date";

/** Company registration number. Placeholder hides the footer reg line entirely. */
export const COMPANY_REG = "TODO(eba): company reg";

/** Academy founding-cohort pricing — CONFIRMED. Setting these un-gates every
 *  price display sitewide (PRICING_ANNOUNCED reads FOUNDING_PRICE). */
export const FOUNDING_PRICE = "£999";
export const STANDARD_PRICE = "£1,499";

/**
 * Founding-cohort counter — set in ONE place and reused everywhere.
 * Current site copy used "27 of 30"; values preserved here verbatim.
 */
export const PLACES_REMAINING = 27; // TODO(eba): confirm real count
export const COHORT_SIZE = 30; // TODO(eba): confirm real count

// ── Mentor availability ──────────────────────────────────────────────────────

export type MentorIntakeStatus = "full" | "open" | "soon";
export interface MentorIntake {
  label: string;
  status: MentorIntakeStatus;
}

/**
 * Mark's mentorship intakes — REAL scarcity, not fabricated history.
 * Rendered in one place (the /mentorship availability panel) from this array.
 * TODO(eba): confirm these months + which are genuinely full vs open before launch.
 * Do NOT mark a month "full" unless it is actually full — honesty is the point.
 */
export const MENTOR_INTAKES: MentorIntake[] = [
  { label: "July 2026", status: "full" },
  { label: "August 2026", status: "full" },
  { label: "September 2026", status: "full" },
  { label: "October 2026", status: "soon" }, // dates released soon
];

/** Cohort capacity, shown in the scarcity line. */
export const MENTOR_CAPACITY = "TODO(eba): e.g. '12 members per cohort'";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** True when a value is unset or still a TODO placeholder (so CTAs can fail safe). */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.trim() === "" || value.startsWith("TODO(eba)");
}

/** True once a live Kajabi checkout URL is configured. */
export const ENROL_READY = !isPlaceholder(KAJABI_CHECKOUT_URL);

/** Safe href for enrolment CTAs — the live URL, or undefined when not yet configured. */
export const ENROL_HREF: string | undefined = ENROL_READY ? KAJABI_CHECKOUT_URL : undefined;

/** Label shown by enrolment CTAs while no live checkout URL is configured. */
export const ENROL_PENDING_LABEL = "Enrolment opens soon";

/** +Documents tier: true once its own checkout URL (or the main one) is live. */
export const ENROL_DOCS_READY = !isPlaceholder(KAJABI_CHECKOUT_URL_DOCS) || ENROL_READY;
export const ENROL_DOCS_HREF: string | undefined = !isPlaceholder(KAJABI_CHECKOUT_URL_DOCS)
  ? KAJABI_CHECKOUT_URL_DOCS
  : ENROL_HREF;
