/**
 * EBA — The Engineering Business Academy
 * Single source of truth for brand colours, business facts and integrations.
 *
 * "DRAWING OFFICE" PALETTE (alternative direction, this branch only):
 * deep drawing-office green wrapper + warm ivory content sections,
 * BRASS Academy accent, VERDIGRIS Tools accent. The hairline gradient runs
 * brass → verdigris — raw metal weathering into a finished patina, the same
 * transformation the Academy sells. Distinctive against a market that is
 * uniformly navy, red/black or SaaS-blue; green reads growth/money globally.
 *
 * WAYFINDING RULE: Academy/cohort/Mark/mentorship/story sections take the
 * BRASS accent; AI-tools/product/pricing/enterprise sections take the
 * VERDIGRIS accent. Never both accents on one element.
 */

export const COLORS = {
  ink:    "#0E2A25",  // drawing-office green — nav, footer, hero, dark sections; text on light
  inkDeep:"#0A211D",  // bottom stop of the dark-section gradient
  white:  "#FFFFFF",  // content sections, cards
  paper:  "#F5F3EB",  // warm ivory — alternating light sections (drafting paper)
  coral:  "#C9982E",  // ACADEMY accent (brass) — fills/chips/graphics + text on dark only
  sky:    "#2BC7B5",  // TOOLS accent (verdigris) — fills/frames/graphics + text on dark only
  sunset: "#D9A83B",  // USAGE CAP: max ONE element per page (highlight stat / live badge)
  lime:   "#9BBF3B",  // USAGE CAP: gradient stop ONLY — never standalone
  mint:   "#2ECC71",  // USAGE CAP: "live" markers only
  teal:   "#2BC7B5",  // separator dots / small graphic accents
} as const;

/**
 * BRAND GRADIENT — brass into verdigris (metal → patina).
 * HAIRLINE RULES ONLY — never backgrounds, buttons, fills, or text.
 * Allowed: logo underline · kicker underlines · one full-width rule before
 * the final CTA. (#E9425C and the old KEYIS four-stop remain banned.)
 */
export const BRAND_GRAD =
  "linear-gradient(90deg, #C9982E 0%, #9BBF3B 50%, #2BC7B5 100%)";

// Convenience named exports. NAVY/CREAM/RUST/OAT/COBALT are the historical
// token names used across the pages — kept to avoid a thousand-line rename;
// their VALUES are the approved palette.
export const NAVY = COLORS.ink;          // was navy — now drawing-office green
export const CREAM = COLORS.paper;       // was cream — now warm ivory
export const WHITE = COLORS.white;
export const OAT = "#E9E6DB";            // secondary neutral surface (derived from ivory)
export const AMBER = COLORS.sunset;      // USAGE CAP: max one element per page

/**
 * Academy accent (BRASS). AA rule (enforced site-wide): bright brass is
 * NEVER text on white/ivory. As text on light use RUST (#7D5B12, 5.6:1 ✓);
 * as text on the green ink use RUST_ON_DARK (#C9982E, 5.8:1 ✓). White text
 * on RUST fills passes (6.2:1 ✓); ink text on bright-brass fills ✓.
 */
export const CORAL = COLORS.coral;       // historical name — bright brass
export const RUST = "#7D5B12";           // brass, text-safe on white/ivory
export const RUST_ON_DARK = COLORS.coral;

/**
 * Tools accent (VERDIGRIS). Same AA rule: bright verdigris is NEVER text on
 * white/ivory. As text on light use COBALT (#0A6E63, 5.5:1 ✓); as text on
 * the green ink use COBALT_ON_DARK (#2BC7B5, 7.2:1 ✓). White on COBALT
 * fills ✓; ink on bright-verdigris fills ✓.
 */
export const SKY = COLORS.sky;
export const COBALT = "#0A6E63";         // verdigris, text-safe on white/ivory
export const COBALT_ON_DARK = COLORS.sky;

// RGB triplets for inline rgba(...) tints (translucent fills/borders only —
// tints come from the BRIGHT accents so washes stay on-brand).
export const NAVY_RGB = "14,42,37";
export const CREAM_RGB = "245,243,235";
export const RUST_RGB = "201,152,46";    // brass tint base
export const COBALT_RGB = "43,199,181";  // verdigris tint base

/** Accent aliases. ACCENT_GRAD is the brand gradient — HAIRLINE RULES ONLY
 *  (it is consumed exclusively by kicker-underline rules). */
export const ACCENT_HEX = RUST;
export const ACCENT_RGB = RUST_RGB;
export const ACCENT_GRAD = BRAND_GRAD;

/** Layout flags kept for the pages' shared components (single light theme). */
export const IS_LIGHT = true;
export const IS_VIVID = true;

/** Background for the ink-dark sections (hero, founder band, dark page heroes). */
export const DARK_GRADIENT = "linear-gradient(180deg, #0E2A25 0%, #0A211D 100%)";

/** Primary / muted text on those dark sections. */
export const ON_DARK = "#FFFFFF";
export const ON_DARK_RGB = "255,255,255";

/** Genuinely dark CTA buttons (distinct from sections). */
export const CTA_DARK_BG = "#0E2A25";

/** Primary action buttons — brass fill with deep-green text (7.0:1 ✓). */
export const CTA_PRIMARY_BG = "#D9A83B";
export const CTA_PRIMARY_TEXT = "#0E2A25";

/** Navigation — drawing-office green bar. */
export const NAV_ON_LIGHT = false;
export const NAV_BAR_BG = "rgba(14,42,37,0.97)";
export const NAV_LINK = "rgba(255,255,255,0.72)";
export const NAV_LINK_ACTIVE = "#FFFFFF";
export const NAV_BORDER = "rgba(255,255,255,0.10)";
export const NAV_CTA_BG = "#D9A83B";     // brass pill, deep-green text (7.0:1 ✓)
export const NAV_CTA_TEXT = "#0E2A25";

/** Footer background — jet black. */
export const FOOTER_BG = "#0A211D";

/** Full-bleed CTA bands (soft neutral wash). */
export const CTA_BAND_BG = "linear-gradient(120deg, #EDEADF 0%, #F5F3EB 100%)";

/** Translucent nav-bar scrim base. */
export const NAV_RGB = "14,42,37";

/** Soft hero glow — quiet coral/sky washes on black (no gradient element). */
export const HERO_GLOW =
  "radial-gradient(55% 80% at 84% 6%, rgba(201,152,46,0.12) 0%, transparent 60%), radial-gradient(45% 70% at 98% 40%, rgba(43,199,181,0.07) 0%, transparent 60%)";

/** Band surface for the trust strip / marquee. */
export const BAND_GRADIENT = "linear-gradient(90deg, #EDEADF 0%, #F5F3EB 100%)";

/** Faint depth wash behind key sections. */
export const SECTION_GLOW =
  "radial-gradient(60% 55% at 50% -8%, rgba(201,152,46,0.06) 0%, transparent 62%)";

/** Alternating band tint. */
export const SECTION_TINT = "#EDEADF";

/** Soft ambient orbs for empty areas. */
export const ORB_ACCENT = "radial-gradient(circle, rgba(201,152,46,0.13) 0%, transparent 70%)";
export const ORB_WARM = "radial-gradient(circle, rgba(43,199,181,0.09) 0%, transparent 70%)";

/**
 * The named methodology. The curriculum is presented everywhere as this System
 * so a future rename is a one-line edit.
 * TODO(eba): trademark status unconfirmed — do NOT add ™ anywhere until cleared.
 */
export const METHOD_NAME = "The Engineering Operating System";

// ── Integrations ───────────────────────────────────────────────────────────

/**
 * Live Kajabi checkout URL. Until a real URL is set, every CTA that points here
 * fails safe (disabled / "Enrolment opens soon") rather than linking to a dead URL.
 *
 * NOTE: the original Manus export hard-coded a specific Kajabi offer link in the
 * placeholder pages: "https://teba.mykajabi.com/offers/hBoDne6F/checkout".
 * If that is the real, current checkout, paste it below (or set VITE_KAJABI_CHECKOUT_URL)
 * to go live everywhere at once.
 * TODO(eba): confirm and set the live Kajabi checkout URL.
 */
export const KAJABI_CHECKOUT_URL =
  import.meta.env.VITE_KAJABI_CHECKOUT_URL || "TODO(eba): live Kajabi checkout URL";

/** Kajabi checkout for the Academy + Documents tier. Falls back to the main
 *  checkout while unset so the tier CTA never dead-ends. */
export const KAJABI_CHECKOUT_URL_DOCS =
  import.meta.env.VITE_KAJABI_CHECKOUT_URL_DOCS ||
  "TODO(eba): Kajabi checkout URL — Academy + Documents tier";

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
 * Launch pricing — single fill-in point. TODO(eba): confirm every figure at the
 * meeting, then replace the placeholders. Values quoted in the planning doc:
 * Academy £999 → £1,499 · +Documents £1,299 → £1,999 · O&M £299/manual ·
 * tools £99 single / £179 all three · enterprise setup + monthly TBC.
 */
export const PRICING = {
  academyFounding: "TODO(eba): Academy founding price (planned £999)",
  academyStandard: "TODO(eba): Academy standard price (planned £1,499)",
  academyDocsFounding: "TODO(eba): Academy+Documents founding price (planned £1,299)",
  academyDocsStandard: "TODO(eba): Academy+Documents standard price (planned £1,999)",
  omPerManual: "TODO(eba): O&M Compiler per-manual price (planned £299)",
  toolSingle: "TODO(eba): single AI tool price (planned £99)",
  toolBundle: "TODO(eba): all-three tools price (planned £179)",
  enterpriseSetup: "TODO(eba): enterprise setup fee (currently shown £997–£1,997)",
  enterpriseMonthly: "TODO(eba): enterprise monthly retainer (currently shown £149–£349)",
} as const;

/** Cohort / mentorship dates — TODO(eba): confirm real dates post-meeting
 *  (mentorship months live in MENTOR_INTAKES below). */
export const COHORT_START_DATE = "TODO(eba): founding cohort start date";

/** Company registration number. Placeholder hides the footer reg line entirely. */
export const COMPANY_REG = "TODO(eba): company reg";

/** Academy founding-cohort pricing. Placeholder renders "Pricing announced soon". */
export const FOUNDING_PRICE = "TODO(eba): founding price";
export const STANDARD_PRICE = "TODO(eba): standard price";

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
