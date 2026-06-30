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
 * VIVID palette — a bright, high-contrast variant inspired by the LlamaIndex
 * look: a clean white page, near-black blocks, a vivid magenta accent and a warm
 * orange highlight, plus a signature pastel-prism gradient band (BAND_GRADIENT).
 * Same role mapping as the others so the whole site themes automatically:
 *  - navy  → near-black: dark blocks AND body text (never pure black)
 *  - cream → white: page background AND text on dark blocks
 *  - rust  → vivid magenta: the single accent (CTAs, labels, rules)
 *  - oat   → near-white: subtle alternating surfaces (kept clean, mostly white)
 *  - white → pure white cards
 *  - amber → warm orange highlight
 * Tuned so the magenta accent and white-on-dark both clear WCAG AA for text.
 */
export const COLORS_VIVID = {
  navy: "#000000",  // true black: primary text (dark sections are now white)
  cream: "#FFFFFF", // white page + light surfaces
  rust: "#6E4BF6",  // electric indigo accent: badges / labels / rules / links
  oat: "#F3F0FF",   // faint lavender wash on alternating surfaces
  white: "#FFFFFF", // pure white cards
  amber: "#FF7A3D", // warm orange highlight
} as const;

/**
 * Theme selection — read once, at module load, from the `?theme=` URL param
 * (`noir` or `vivid`; anything else falls back to the default). Because the
 * named exports below are ES-module live bindings resolved at load time, the
 * entire page renders in a single consistent theme. Client-side navigation
 * (wouter) keeps the chosen theme for the life of the page. Nothing is
 * persisted, so `/`, `/?theme=noir` and `/?theme=vivid` always render their
 * respective themes for side-by-side comparison.
 */
export type ThemeName = "default" | "noir" | "vivid";

function detectTheme(): ThemeName {
  if (typeof window === "undefined") return "default";
  try {
    const t = new URLSearchParams(window.location.search).get("theme");
    return t === "noir" || t === "vivid" ? t : "default";
  } catch {
    return "default";
  }
}

export const THEME: ThemeName = detectTheme();
export const IS_NOIR = THEME === "noir";
export const IS_VIVID = THEME === "vivid";

type Palette = {
  readonly navy: string; readonly cream: string; readonly rust: string;
  readonly oat: string; readonly white: string; readonly amber: string;
};

/** Pick a value for the active theme: (default, noir, vivid). */
function pick<T>(d: T, noir: T, vivid: T): T {
  return THEME === "noir" ? noir : THEME === "vivid" ? vivid : d;
}

export const COLORS: Palette = pick<Palette>(COLORS_DEFAULT, COLORS_NOIR, COLORS_VIVID);

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
// In vivid, what used to be light text/borders on dark sections must become
// TRUE BLACK text/borders on the now-white surfaces.
export const NAVY_RGB = pick("27,38,50", "26,26,28", "0,0,0");
export const RUST_RGB = pick("163,81,57", "142,59,59", "110,75,246"); // indigo accent tints
export const CREAM_RGB = pick("238,233,223", "244,242,238", "0,0,0");

/**
 * Background for large sections that were dark (hero / founder / CTA / footers).
 * Default keeps the flat navy used previously (visually identical). Noir = subtle
 * vertical charcoal gradient. Vivid = WHITE — the site becomes a full white site
 * and the text on these sections flips to true black (see ON_DARK below).
 */
export const DARK_GRADIENT = pick(
  NAVY,
  "linear-gradient(180deg, #1A1A1C 0%, #242428 100%)",
  "#FFFFFF",
);

/**
 * Primary / muted text that previously sat on dark sections. Light in
 * default + noir (unchanged); TRUE BLACK in vivid so it reads on white.
 */
export const ON_DARK = pick("#FFFFFF", "#FFFFFF", "#000000");
export const ON_DARK_RGB = pick("255,255,255", "255,255,255", "0,0,0");

/**
 * Vivid CTA gradient — the "2028 AI" jewel-toned fill (indigo → fuchsia → rose)
 * used for primary buttons. Kept dark enough that white button text clears AA.
 */
const VIVID_CTA_GRADIENT =
  "linear-gradient(95deg, #5A2BE0 0%, #A12BC4 50%, #E0407A 100%)";

/**
 * Background for genuinely dark CTA buttons (the navy "outline/solid" buttons,
 * distinct from full-bleed sections). Dark in default/noir; in vivid they take
 * the gradient fill.
 */
export const CTA_DARK_BG = IS_VIVID ? VIVID_CTA_GRADIENT : DARK_GRADIENT;

/**
 * Primary action buttons that use the rust accent as their fill in the editorial
 * themes (hero / nav / form CTAs). In vivid they get the gradient fill so the
 * main calls-to-action carry the brand colour.
 */
export const CTA_PRIMARY_BG = IS_VIVID ? VIVID_CTA_GRADIENT : RUST;

/**
 * Full-bleed CTA bands that use the rust accent as their background in the
 * editorial themes. In vivid they become a soft pastel-prism wash with dark
 * text + a gradient button on top.
 */
export const CTA_BAND_BG = IS_VIVID
  ? "linear-gradient(120deg, #EFF0FF 0%, #FBEEFF 50%, #FFF1E8 100%)"
  : RUST;

/** Translucent nav-bar scrim. Dark in default/noir; white in vivid. */
export const NAV_RGB = pick("27,38,50", "26,26,28", "255,255,255");

/**
 * Soft coloured glow layered over the hero (vivid only) — gives the white hero
 * a 2028 "aurora" feel without hurting the left-aligned text contrast. Empty in
 * default/noir (the hero keeps its image + dark overlay).
 */
export const HERO_GLOW = IS_VIVID
  ? "radial-gradient(55% 80% at 82% 8%, rgba(110,75,246,0.20) 0%, transparent 60%), radial-gradient(45% 70% at 98% 42%, rgba(224,64,122,0.16) 0%, transparent 60%), radial-gradient(40% 60% at 70% 0%, rgba(63,196,255,0.14) 0%, transparent 55%)"
  : "";

/**
 * Signature gradient band. Default and noir keep the solid oat surface
 * (identical to before); vivid gets an enlarged, layered prism gradient with
 * radial light "blooms" for depth — dark text/logos sit on it, so contrast holds.
 */
export const BAND_GRADIENT = pick(
  OAT,
  OAT,
  "radial-gradient(70% 140% at 16% 22%, rgba(90,43,224,0.40) 0%, transparent 60%), radial-gradient(65% 130% at 84% 78%, rgba(224,64,122,0.36) 0%, transparent 60%), radial-gradient(50% 120% at 50% 50%, rgba(255,210,120,0.30) 0%, transparent 65%), linear-gradient(90deg, #8FE3FF 0%, #B7A6FF 28%, #E59CE8 50%, #FF9DB0 72%, #FFC98A 100%)",
);

/**
 * Keep the CSS custom properties (used by index.css for body/selection/scrollbar)
 * in sync with the active theme. Runs once at load; no-op during SSR/prerender.
 */
if (THEME !== "default" && typeof document !== "undefined") {
  const s = document.documentElement.style;
  s.setProperty("--eba-navy", COLORS.navy);
  s.setProperty("--eba-rust", COLORS.rust);
  s.setProperty("--eba-cream", COLORS.cream);
  s.setProperty("--eba-oat", COLORS.oat);
  s.setProperty("--eba-white", COLORS.white);
  s.setProperty("--eba-amber", COLORS.amber);
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
