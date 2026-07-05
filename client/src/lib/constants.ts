/**
 * EBA — The Engineering Business Academy
 * Single source of truth for brand colours, business facts and integrations.
 *
 * THEMES — exactly three, switched via ?theme= (nothing persisted):
 *   engineer (DEFAULT) — ink/paper editorial base with a DUAL accent:
 *                        rust = Academy/human side · cobalt = AI-tools/product side
 *   default (?theme=default or ?theme=classic) — the original navy/cream/rust
 *                        editorial theme, exactly as locked
 *   noir    (?theme=noir) — the dark/charcoal variant for comparison
 */

/**
 * DEFAULT palette — the editorial navy / cream / rust identity. Unchanged.
 */
export const COLORS_DEFAULT = {
  navy: "#1B2632",  // primary text, dark sections
  cream: "#EEE9DF", // primary page background
  rust: "#A35139",  // single signature accent (CTAs, rules, labels)
  oat: "#DDD6C8",   // secondary surface / alternating cards
  white: "#FFFFFF", // cards and form surfaces only
  amber: "#FFB162", // sparing highlight / "live" indicator only
} as const;

/**
 * NOIR palette — a restrained, law-firm-professional dark variant.
 * Same roles as the default so every component themes automatically.
 * Tuned for WCAG AA against the surfaces it lands on.
 */
export const COLORS_NOIR = {
  navy: "#1A1A1C",
  cream: "#F4F2EE",
  rust: "#8E3B3B",
  oat: "#E9E5DD",
  white: "#FFFFFF",
  amber: "#C98A55",
} as const;

/**
 * ENGINEER palette — the shipped theme. Editorial ink/paper base with a dual
 * accent that tells visitors which half of the business a section belongs to:
 *   RUST   → Academy / cohort / Mark / mentorship / story (human, education)
 *   COBALT → AI tools / product / pricing / enterprise (software, product)
 * Never both accents on the same element.
 */
export const COLORS_ENGINEER = {
  ink:    "#16202B",  // base dark — replaces navy roles
  paper:  "#EEE9DF",  // primary background (unchanged cream)
  rust:   "#A35139",  // ACADEMY accent — human/education
  cobalt: "#2454C9",  // TOOLS accent — product/software
  oat:    "#DDD6C8",  // secondary surface
  white:  "#FFFFFF",
} as const;

export type ThemeName = "default" | "noir" | "engineer";

function detectTheme(): ThemeName {
  // Ships on "engineer". ?theme=default (or the older ?theme=classic) restores
  // the locked editorial theme; ?theme=noir the dark variant.
  if (typeof window === "undefined") return "engineer";
  try {
    const t = new URLSearchParams(window.location.search).get("theme");
    if (t === "noir") return "noir";
    if (t === "default" || t === "classic") return "default";
    return "engineer";
  } catch {
    return "engineer";
  }
}

export const THEME: ThemeName = detectTheme();
export const IS_NOIR = THEME === "noir";
export const IS_ENGINEER = THEME === "engineer";
/** Back-compat flags — the engineer theme is the sole "modern light" layout. */
export const IS_LIGHT = IS_ENGINEER;
export const IS_VIVID = IS_LIGHT;

/** Pick a value for the active theme: (default, noir, engineer). */
function pick<T>(d: T, noir: T, engineer: T): T {
  return IS_NOIR ? noir : IS_ENGINEER ? engineer : d;
}

type Palette = {
  readonly navy: string; readonly cream: string; readonly rust: string;
  readonly oat: string; readonly white: string; readonly amber: string;
};

export const COLORS: Palette = IS_NOIR
  ? COLORS_NOIR
  : IS_ENGINEER
    ? {
        navy: COLORS_ENGINEER.ink,
        cream: COLORS_ENGINEER.paper,
        rust: COLORS_ENGINEER.rust,
        oat: COLORS_ENGINEER.oat,
        white: COLORS_ENGINEER.white,
        amber: "#FFB162",
      }
    : COLORS_DEFAULT;

// Convenience named exports — used directly in the pages' inline styles.
export const NAVY = COLORS.navy;
export const CREAM = COLORS.cream;
export const RUST = COLORS.rust;
export const OAT = COLORS.oat;
export const WHITE = COLORS.white;
export const AMBER = COLORS.amber;

/**
 * COBALT — the TOOLS accent (engineer theme). In default/noir (single-accent
 * themes) it falls back to the theme accent so tools sections stay coherent.
 * AA notes (checked): #2454C9 on paper #EEE9DF ≈ 5.5:1 ✓, on white ≈ 6.6:1 ✓.
 * On ink it fails for text — use COBALT_ON_DARK (#7FA5FF ≈ 6.8:1 on ink) there.
 */
export const COBALT = IS_ENGINEER ? COLORS_ENGINEER.cobalt : RUST;
export const COBALT_RGB = IS_ENGINEER ? "36,84,201" : pick("163,81,57", "142,59,59", "163,81,57");
/** Accent variants that pass AA as TEXT on ink/dark bands. */
export const COBALT_ON_DARK = IS_ENGINEER ? "#7FA5FF" : "#FFFFFF";
export const RUST_ON_DARK = pick("#D98B6F", "#C98A55", "#D98B6F");

// RGB triplets for inline rgba(...) literals.
export const NAVY_RGB = pick("27,38,50", "26,26,28", "22,32,43");
export const RUST_RGB = pick("163,81,57", "142,59,59", "163,81,57");
export const CREAM_RGB = pick("238,233,223", "244,242,238", "238,233,223");

/** Back-compat accent aliases (rust is the primary/Academy accent). */
export const ACCENT_HEX = RUST;
export const ACCENT_RGB = RUST_RGB;
/** Former gradient token — now a SOLID accent. The KEYIS four-stop gradient has
 *  been removed from the brand; components that used it take flat rust. */
export const ACCENT_GRAD = RUST;

/**
 * Background for large dark sections (hero bands / pain points / CTA / footers).
 */
export const DARK_GRADIENT = pick(
  NAVY,
  "linear-gradient(180deg, #1A1A1C 0%, #242428 100%)",
  "linear-gradient(180deg, #16202B 0%, #121A23 100%)",
);

/** Primary / muted text on those dark sections. */
export const ON_DARK = "#FFFFFF";
export const ON_DARK_RGB = "255,255,255";

/** Genuinely dark CTA buttons (distinct from sections). */
export const CTA_DARK_BG = pick(NAVY, "linear-gradient(180deg, #1A1A1C 0%, #242428 100%)", "#16202B");

/** Primary action buttons — rust (Academy accent) in every theme. */
export const CTA_PRIMARY_BG = RUST;

/**
 * Navigation bar. Engineer keeps the clean WHITE nav (distinct from the paper
 * page); default/noir keep their filled dark bar.
 */
export const NAV_ON_LIGHT = IS_ENGINEER;
export const NAV_BAR_BG = pick(DARK_GRADIENT, DARK_GRADIENT, "rgba(255,255,255,0.94)");
export const NAV_LINK = NAV_ON_LIGHT ? "rgba(22,32,43,0.72)" : "rgba(255,255,255,0.82)";
export const NAV_LINK_ACTIVE = NAV_ON_LIGHT ? "#16202B" : "#FFFFFF";
export const NAV_BORDER = NAV_ON_LIGHT ? "rgba(22,32,43,0.10)" : "rgba(255,255,255,0.16)";
export const NAV_CTA_BG = NAV_ON_LIGHT ? RUST : "#FFFFFF";
export const NAV_CTA_TEXT = NAV_ON_LIGHT ? "#FFFFFF" : RUST;

/** Footer background — engineer keeps a deep ink footer. */
export const FOOTER_BG = pick(NAVY, "#161618", "#121A23");

/** Full-bleed CTA bands (soft wash in engineer; rust band in default). */
export const CTA_BAND_BG = pick(RUST, RUST, "linear-gradient(120deg, #E7E1D4 0%, #EEE9DF 100%)");

/** Translucent nav-bar scrim. */
export const NAV_RGB = pick("27,38,50", "26,26,28", "255,255,255");

/** Soft hero glow (engineer only) — quiet rust/ink wash, no gradients. */
export const HERO_GLOW = IS_ENGINEER
  ? "radial-gradient(55% 80% at 84% 6%, rgba(163,81,57,0.10) 0%, transparent 60%), radial-gradient(45% 70% at 98% 40%, rgba(22,32,43,0.08) 0%, transparent 60%)"
  : "";

/** Band surface for the trust strip / marquee. */
export const BAND_GRADIENT = pick(OAT, OAT, "linear-gradient(90deg, #E7E1D4 0%, #DDD6C8 100%)");

/** Faint depth wash behind key sections. */
export const SECTION_GLOW = IS_ENGINEER
  ? "radial-gradient(60% 55% at 50% -8%, rgba(163,81,57,0.06) 0%, transparent 62%)"
  : "none";

/** Alternating band tint. */
export const SECTION_TINT = pick(OAT, COLORS.cream, "#E7E1D4");

/** Soft ambient orbs for empty areas (engineer only). */
export const ORB_ACCENT = IS_ENGINEER ? "radial-gradient(circle, rgba(163,81,57,0.14) 0%, transparent 70%)" : "";
export const ORB_WARM = IS_ENGINEER ? "radial-gradient(circle, rgba(36,84,201,0.10) 0%, transparent 70%)" : "";

/**
 * Keep the CSS custom properties (used by index.css) in sync with the active
 * theme. Runs once at load; no-op during SSR/prerender.
 */
if (THEME !== "default" && typeof document !== "undefined") {
  const s = document.documentElement.style;
  s.setProperty("--eba-navy", COLORS.navy);
  s.setProperty("--eba-rust", COLORS.rust);
  s.setProperty("--eba-cream", COLORS.cream);
  s.setProperty("--eba-oat", COLORS.oat);
  s.setProperty("--eba-white", COLORS.white);
  s.setProperty("--eba-amber", COLORS.amber);
  s.setProperty("--eba-cobalt", COBALT);
}

/**
 * Heading typeface — Playfair Display is the DEFAULT for editorial headings
 * (hero H1s, section headings). ?font=modern flips to Roboto for comparison.
 * (Roboto headings were the KEYIS-alignment experiment; Playfair is the EBA
 * editorial default unless told otherwise.)
 */
export const IS_MODERN_FONT =
  typeof window !== "undefined" &&
  (() => { try { return new URLSearchParams(window.location.search).get("font") === "modern"; } catch { return false; } })();

if (IS_MODERN_FONT && typeof document !== "undefined") {
  document.documentElement.style.setProperty("--eba-heading", "'Roboto', system-ui, sans-serif");
}

/**
 * The named methodology. The curriculum is presented everywhere as this System
 * so a future rename is a one-line edit.
 * TODO(eba): trademark status unconfirmed — do NOT add ™ anywhere until cleared.
 */
export const METHOD_NAME = "The M&E Operating System";

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
