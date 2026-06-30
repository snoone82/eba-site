/**
 * EBA — The Engineering Business Academy
 * Single source of truth for brand colours, business facts and integrations.
 *
 * The six brand colours below are the ONLY brand colours. They are mirrored as
 * `--eba-*` CSS custom properties in index.css so inline-style usage (these
 * exports) and CSS usage reference identical values.
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
 * Same roles as the default so every component themes automatically:
 *  - navy  → neutral charcoal: dark sections AND near-black text (never pure black)
 *  - cream → off-white: light sections AND slate-white text on dark (never pure white)
 *  - rust  → deep oxblood: the single accent, used sparingly
 *  - oat   → secondary light surface / alternating cards
 *  - white → cards + form surfaces on light
 *  - amber → cooled highlight that sits with the oxblood accent
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
 * Theme selection — read once, at module load, from the `?theme=noir` URL param.
 * Because the named exports below are ES-module live bindings resolved at load
 * time, the entire page renders in a single consistent theme. Client-side
 * navigation (wouter) keeps the chosen theme for the life of the page; a fresh
 * load without `?theme=noir` falls back to the default. Nothing is persisted, so
 * `/` and `/?theme=noir` always render their respective themes for side-by-side
 * comparison.
 */
function detectTheme(): "default" | "noir" {
  if (typeof window === "undefined") return "default";
  try {
    return new URLSearchParams(window.location.search).get("theme") === "noir"
      ? "noir"
      : "default";
  } catch {
    return "default";
  }
}

export const THEME: "default" | "noir" = detectTheme();
export const IS_NOIR = THEME === "noir";

export const COLORS = IS_NOIR ? COLORS_NOIR : COLORS_DEFAULT;

// Convenience named exports — used directly in the pages' inline styles.
export const NAVY = COLORS.navy;
export const CREAM = COLORS.cream;
export const RUST = COLORS.rust;
export const OAT = COLORS.oat;
export const WHITE = COLORS.white;
export const AMBER = COLORS.amber;

/**
 * RGB triplets (for inline `rgba(...)` literals) that track the active theme.
 * These let the many low-opacity tints/borders/overlays switch with the palette
 * instead of staying hard-coded to the default hues.
 */
export const NAVY_RGB = IS_NOIR ? "26,26,28" : "27,38,50";
export const RUST_RGB = IS_NOIR ? "142,59,59" : "163,81,57";
export const CREAM_RGB = IS_NOIR ? "244,242,238" : "238,233,223";

/**
 * Background for large dark sections (hero / founder / CTA). In the default
 * theme this is the flat navy used previously (visually identical). In noir it
 * becomes a subtle vertical charcoal gradient — never a flat black.
 */
export const DARK_GRADIENT = IS_NOIR
  ? "linear-gradient(180deg, #1A1A1C 0%, #242428 100%)"
  : NAVY;

/**
 * Keep the CSS custom properties (used by index.css for body/selection/scrollbar)
 * in sync with the active theme. Runs once at load; no-op during SSR/prerender.
 */
if (IS_NOIR && typeof document !== "undefined") {
  const s = document.documentElement.style;
  s.setProperty("--eba-navy", COLORS_NOIR.navy);
  s.setProperty("--eba-rust", COLORS_NOIR.rust);
  s.setProperty("--eba-cream", COLORS_NOIR.cream);
  s.setProperty("--eba-oat", COLORS_NOIR.oat);
  s.setProperty("--eba-white", COLORS_NOIR.white);
  s.setProperty("--eba-amber", COLORS_NOIR.amber);
}

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

// ── Business facts (do NOT invent — confirm with Mark post-meeting) ──────────

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
  { label: "August 2026", status: "full" },
  { label: "September 2026", status: "full" },
  { label: "October 2026", status: "open" }, // the real next intake
  { label: "November 2026", status: "soon" },
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
