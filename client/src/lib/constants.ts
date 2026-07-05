/**
 * EBA — The Engineering Business Academy
 * Single source of truth for brand colours, business facts and integrations.
 *
 * ONE theme. The palette is light-dominant paper/ink with a DUAL accent that
 * tells visitors which half of the business a section belongs to:
 *   RUST   → Academy / cohort / Mark / mentorship / story (human, education)
 *   COBALT → AI tools / product / pricing / enterprise (software, product)
 * Never both accents on the same element.
 *
 * (The old ?theme= comparison system — default/noir/etc — was retired when the
 * rebuild shipped a single theme. Restore from git history if ever needed.)
 */

export const COLORS = {
  ink:    "#16202B", // text; background of the two dark sections only
  paper:  "#EEE9DF", // DEFAULT page background
  rust:   "#A35139", // ACADEMY accent
  cobalt: "#2454C9", // TOOLS accent
  oat:    "#DDD6C8", // secondary surface / alternating cards
  white:  "#FFFFFF", // cards and form surfaces
  amber:  "#FFB162", // sparing highlight — "live" markers, one stat per page max
} as const;

// Convenience named exports — used directly in the pages' inline styles.
// (NAVY/CREAM are the historical names for ink/paper; kept to avoid a
// thousand-line rename across the pages.)
export const NAVY = COLORS.ink;
export const CREAM = COLORS.paper;
export const RUST = COLORS.rust;
export const OAT = COLORS.oat;
export const WHITE = COLORS.white;
export const AMBER = COLORS.amber;

/**
 * COBALT — the TOOLS accent.
 * AA notes (checked): #2454C9 on paper #EEE9DF ≈ 5.5:1 ✓, on white ≈ 6.6:1 ✓.
 * On ink it fails for text — use COBALT_ON_DARK (#7FA5FF ≈ 6.8:1 on ink) there.
 */
export const COBALT = COLORS.cobalt;
export const COBALT_RGB = "36,84,201";
/** Accent variants that pass AA as TEXT on ink/dark bands. */
export const COBALT_ON_DARK = "#7FA5FF";
export const RUST_ON_DARK = "#D98B6F"; // rust as TEXT on ink ≈ 6.2:1 ✓

// RGB triplets for inline rgba(...) literals.
export const NAVY_RGB = "22,32,43";
export const RUST_RGB = "163,81,57";
export const CREAM_RGB = "238,233,223";

/** Accent aliases (rust is the primary/Academy accent). ACCENT_GRAD is a
 *  historical token name — it has been a SOLID colour since the KEYIS
 *  four-stop gradient was removed from the brand. */
export const ACCENT_HEX = RUST;
export const ACCENT_RGB = RUST_RGB;
export const ACCENT_GRAD = RUST;

/** Layout flags kept for the pages' shared components (single light theme). */
export const IS_LIGHT = true;
export const IS_VIVID = true;

/** Background for the ink-dark sections (founder band, dark page heroes). */
export const DARK_GRADIENT = "linear-gradient(180deg, #16202B 0%, #121A23 100%)";

/** Primary / muted text on those dark sections. */
export const ON_DARK = "#FFFFFF";
export const ON_DARK_RGB = "255,255,255";

/** Genuinely dark CTA buttons (distinct from sections). */
export const CTA_DARK_BG = "#16202B";

/** Primary action buttons — rust (Academy accent). */
export const CTA_PRIMARY_BG = RUST;

/** Navigation — clean white bar, distinct from the paper page. */
export const NAV_ON_LIGHT = true;
export const NAV_BAR_BG = "rgba(255,255,255,0.94)";
export const NAV_LINK = "rgba(22,32,43,0.72)";
export const NAV_LINK_ACTIVE = "#16202B";
export const NAV_BORDER = "rgba(22,32,43,0.10)";
export const NAV_CTA_BG = RUST;
export const NAV_CTA_TEXT = "#FFFFFF";

/** Footer background — deep ink. */
export const FOOTER_BG = "#121A23";

/** Full-bleed CTA bands (soft paper wash). */
export const CTA_BAND_BG = "linear-gradient(120deg, #E7E1D4 0%, #EEE9DF 100%)";

/** Translucent nav-bar scrim. */
export const NAV_RGB = "255,255,255";

/** Soft hero glow — quiet rust/ink wash, no brand gradients. */
export const HERO_GLOW =
  "radial-gradient(55% 80% at 84% 6%, rgba(163,81,57,0.10) 0%, transparent 60%), radial-gradient(45% 70% at 98% 40%, rgba(22,32,43,0.08) 0%, transparent 60%)";

/** Band surface for the trust strip / marquee. */
export const BAND_GRADIENT = "linear-gradient(90deg, #E7E1D4 0%, #DDD6C8 100%)";

/** Faint depth wash behind key sections. */
export const SECTION_GLOW =
  "radial-gradient(60% 55% at 50% -8%, rgba(163,81,57,0.06) 0%, transparent 62%)";

/** Alternating band tint. */
export const SECTION_TINT = "#E7E1D4";

/** Soft ambient orbs for empty areas. */
export const ORB_ACCENT = "radial-gradient(circle, rgba(163,81,57,0.14) 0%, transparent 70%)";
export const ORB_WARM = "radial-gradient(circle, rgba(36,84,201,0.10) 0%, transparent 70%)";

/**
 * Heading typeface — Playfair Display for editorial headlines; DM Sans for
 * body/UI. ?font=modern flips headings to DM Sans for comparison.
 * (To flip permanently, change --eba-heading in index.css.)
 */
export const IS_MODERN_FONT =
  typeof window !== "undefined" &&
  (() => { try { return new URLSearchParams(window.location.search).get("font") === "modern"; } catch { return false; } })();

if (IS_MODERN_FONT && typeof document !== "undefined") {
  document.documentElement.style.setProperty("--eba-heading", "'DM Sans', system-ui, sans-serif");
}

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
} as const;

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
