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
/**
 * Theme selection — read once, at module load, from the `?theme=` URL param.
 * Themes: `noir` (dark editorial) plus a family of modern white-site themes
 * (`vivid`, `emerald`, `plum`, `graphite`) that share one layout and differ only
 * by accent colour. Anything else falls back to the original default. Because the
 * named exports below are ES-module live bindings resolved at load time, the
 * whole page renders one consistent theme; nothing is persisted, so each
 * `?theme=` URL always renders its own theme for side-by-side comparison.
 */
export type ThemeName = "default" | "noir" | "vivid" | "emerald" | "plum" | "graphite" | "cobalt" | "azure" | "keyis" | "keyisdark" | "windsor" | "ciob";

type LightThemeName = "vivid" | "emerald" | "plum" | "graphite" | "cobalt" | "azure" | "keyis" | "keyisdark" | "windsor" | "ciob";
const LIGHT_THEMES: LightThemeName[] = ["vivid", "emerald", "plum", "graphite", "cobalt", "azure", "keyis", "keyisdark", "windsor", "ciob"];

function detectTheme(): ThemeName {
  // The site currently ships on the "keyis" theme — the KEYIS Group brand
  // palette (black + slate-white grounded, vibrant blue→red→yellow→green
  // gradient accent) for evaluation. The cobalt indigo→cyan scheme stays
  // available at ?theme=cobalt, the indigo→magenta scheme at ?theme=vivid,
  // and the original editorial navy/rust theme at ?theme=classic.
  if (typeof window === "undefined") return "ciob";
  try {
    const t = new URLSearchParams(window.location.search).get("theme");
    if (t === "noir") return "noir";
    if (t === "classic") return "default";
    if (t && (LIGHT_THEMES as string[]).includes(t)) return t as ThemeName;
    return "ciob";
  } catch {
    return "ciob";
  }
}

export const THEME: ThemeName = detectTheme();
export const IS_NOIR = THEME === "noir";
export const IS_LIGHT = (LIGHT_THEMES as string[]).includes(THEME);
/** KEYIS Group brand theme — black/slate-white grounded, rainbow gradient accent. */
export const IS_KEYIS = THEME === "keyis";
/** KEYIS dark skin — reversed: near-black surfaces, light text, same red + gradient. */
export const IS_DARK = THEME === "keyisdark";
/** Windsor — bright modern-SaaS skin: white nav, blue→violet accent, navy footer. */
export const IS_WINDSOR = THEME === "windsor";
/** CIOB — institutional academy skin: white nav, navy bands + rust accent, photo-led. */
export const IS_CIOB = THEME === "ciob";
/** Back-compat flag: every modern light theme uses the white-site layout. */
export const IS_VIVID = IS_LIGHT;

/**
 * Per-theme accent definitions for the modern light family. Each accent hex is
 * tuned to clear WCAG AA both as text on white AND as a white-text button fill;
 * the gradients keep white button text readable across every stop. None use the
 * original blue or rust.
 */
type Accent = {
  hex: string; rgb: string; grad: string; band: string; glow: string;
  oat: string; ctaBand: string;
};
// Shared KEYIS accent (used by both the light `keyis` and dark `keyisdark` skins).
const KEYIS_ACCENT: Accent = {
  hex: "#E9425C", rgb: "233,66,92",
  grad: "linear-gradient(95deg, #73CAEB 0%, #E9425C 35%, #FFCF47 65%, #75B94E 100%)",
  band: "radial-gradient(70% 140% at 16% 22%, rgba(115,202,235,0.50) 0%, transparent 60%), radial-gradient(65% 130% at 84% 78%, rgba(117,185,78,0.44) 0%, transparent 60%), radial-gradient(55% 120% at 50% 50%, rgba(255,207,71,0.42) 0%, transparent 65%), linear-gradient(90deg, #73CAEB 0%, #E9425C 35%, #FFCF47 65%, #75B94E 100%)",
  glow: "radial-gradient(55% 80% at 82% 8%, rgba(233,66,92,0.20) 0%, transparent 60%), radial-gradient(45% 70% at 98% 42%, rgba(115,202,235,0.18) 0%, transparent 60%), radial-gradient(40% 60% at 70% 0%, rgba(255,207,71,0.18) 0%, transparent 55%)",
  oat: "#E4DFD3",
  ctaBand: "linear-gradient(120deg, #EAF6FB 0%, #FDEEF0 50%, #EFF7E9 100%)",
};
const ACCENTS: Record<LightThemeName, Accent> = {
  // Electric indigo → fuchsia. AI-native, energetic.
  vivid: {
    hex: "#6E4BF6", rgb: "110,75,246",
    grad: "linear-gradient(95deg, #5A2BE0 0%, #A12BC4 50%, #E0407A 100%)",
    band: "radial-gradient(70% 140% at 16% 22%, rgba(90,43,224,0.40) 0%, transparent 60%), radial-gradient(65% 130% at 84% 78%, rgba(224,64,122,0.36) 0%, transparent 60%), radial-gradient(50% 120% at 50% 50%, rgba(255,210,120,0.30) 0%, transparent 65%), linear-gradient(90deg, #8FE3FF 0%, #B7A6FF 28%, #E59CE8 50%, #FF9DB0 72%, #FFC98A 100%)",
    glow: "radial-gradient(55% 80% at 82% 8%, rgba(110,75,246,0.20) 0%, transparent 60%), radial-gradient(45% 70% at 98% 42%, rgba(224,64,122,0.16) 0%, transparent 60%), radial-gradient(40% 60% at 70% 0%, rgba(63,196,255,0.14) 0%, transparent 55%)",
    oat: "#F3F0FF",
    ctaBand: "linear-gradient(120deg, #EFF0FF 0%, #FBEEFF 50%, #FFF1E8 100%)",
  },
  // Emerald → teal. Fresh, clean-energy / growth, trustworthy.
  emerald: {
    hex: "#0B7A52", rgb: "11,122,82",
    grad: "linear-gradient(95deg, #064E36 0%, #0A7351 52%, #0C8466 100%)",
    band: "radial-gradient(70% 140% at 16% 22%, rgba(13,148,108,0.42) 0%, transparent 60%), radial-gradient(65% 130% at 84% 78%, rgba(45,212,191,0.34) 0%, transparent 60%), radial-gradient(50% 120% at 50% 50%, rgba(190,242,160,0.34) 0%, transparent 65%), linear-gradient(90deg, #A7F3D0 0%, #86EFC7 28%, #6EE7C8 50%, #9CEFB8 72%, #D6F5A8 100%)",
    glow: "radial-gradient(55% 80% at 82% 8%, rgba(13,148,108,0.20) 0%, transparent 60%), radial-gradient(45% 70% at 98% 42%, rgba(45,212,191,0.16) 0%, transparent 60%), radial-gradient(40% 60% at 70% 0%, rgba(190,242,160,0.16) 0%, transparent 55%)",
    oat: "#ECFBF3",
    ctaBand: "linear-gradient(120deg, #EAFBF1 0%, #EFFBF6 50%, #FAFEEE 100%)",
  },
  // Deep plum → magenta. Bold, premium, creative.
  plum: {
    hex: "#A21CAF", rgb: "162,28,175",
    grad: "linear-gradient(95deg, #7A1FD0 0%, #A81C9E 50%, #C81E6E 100%)",
    band: "radial-gradient(70% 140% at 16% 22%, rgba(124,40,224,0.40) 0%, transparent 60%), radial-gradient(65% 130% at 84% 78%, rgba(224,30,130,0.34) 0%, transparent 60%), radial-gradient(50% 120% at 50% 50%, rgba(255,170,210,0.32) 0%, transparent 65%), linear-gradient(90deg, #E9D5FF 0%, #F0C2FF 30%, #FBC2EC 55%, #FBD0E0 78%, #FFD9C7 100%)",
    glow: "radial-gradient(55% 80% at 82% 8%, rgba(162,28,175,0.20) 0%, transparent 60%), radial-gradient(45% 70% at 98% 42%, rgba(224,30,130,0.16) 0%, transparent 60%), radial-gradient(40% 60% at 70% 0%, rgba(150,80,255,0.14) 0%, transparent 55%)",
    oat: "#FBF0FF",
    ctaBand: "linear-gradient(120deg, #F7EEFF 0%, #FCEEFA 50%, #FFF0F4 100%)",
  },
  // Cobalt — indigo → electric blue → cyan. Cool, AI-native, engineering-tech.
  // Deliberately dodges the warm pink/orange prism used by Citation & iHasco.
  cobalt: {
    hex: "#3D5AF1", rgb: "61,90,241",
    grad: "linear-gradient(95deg, #2B2F9E 0%, #2563EB 52%, #06B6D4 100%)",
    band: "radial-gradient(70% 140% at 16% 22%, rgba(43,47,158,0.42) 0%, transparent 60%), radial-gradient(65% 130% at 84% 78%, rgba(6,182,212,0.34) 0%, transparent 60%), radial-gradient(50% 120% at 50% 50%, rgba(125,211,252,0.30) 0%, transparent 65%), linear-gradient(90deg, #C7D2FE 0%, #A5C8FF 28%, #93D7F0 50%, #A7E8F0 72%, #CDEFF7 100%)",
    glow: "radial-gradient(55% 80% at 82% 8%, rgba(61,90,241,0.20) 0%, transparent 60%), radial-gradient(45% 70% at 98% 42%, rgba(6,182,212,0.16) 0%, transparent 60%), radial-gradient(40% 60% at 70% 0%, rgba(125,211,252,0.14) 0%, transparent 55%)",
    oat: "#EEF1FF",
    ctaBand: "linear-gradient(120deg, #EEF2FF 0%, #ECF6FF 50%, #EAFBFF 100%)",
  },
  // Azure — deep navy → royal blue → sky. Cooler, more corporate / premium.
  azure: {
    hex: "#1D6FE0", rgb: "29,111,224",
    grad: "linear-gradient(95deg, #10265E 0%, #1D4ED8 55%, #0EA5E9 100%)",
    band: "radial-gradient(70% 140% at 16% 22%, rgba(16,38,94,0.44) 0%, transparent 60%), radial-gradient(65% 130% at 84% 78%, rgba(14,165,233,0.34) 0%, transparent 60%), radial-gradient(50% 120% at 50% 50%, rgba(147,197,253,0.30) 0%, transparent 65%), linear-gradient(90deg, #BFDBFE 0%, #A5C8FF 30%, #93C5FD 55%, #A9D9FB 78%, #CDEBFB 100%)",
    glow: "radial-gradient(55% 80% at 82% 8%, rgba(29,111,224,0.20) 0%, transparent 60%), radial-gradient(45% 70% at 98% 42%, rgba(14,165,233,0.16) 0%, transparent 60%), radial-gradient(40% 60% at 70% 0%, rgba(147,197,253,0.14) 0%, transparent 55%)",
    oat: "#EBF2FF",
    ctaBand: "linear-gradient(120deg, #ECF2FF 0%, #EAF4FF 50%, #E8F8FF 100%)",
  },
  // KEYIS Group — grounded in black + slate white, with the brand's vibrant
  // "sustainable transition" gradient (blue → red → yellow → green) as the
  // decorative accent. Shared by the light `keyis` and dark `keyisdark` skins.
  keyis: KEYIS_ACCENT,
  keyisdark: KEYIS_ACCENT,
  // Windsor — bright modern-SaaS: indigo→violet accent on a white canvas, colourful
  // product tiles, navy footer. Clean, current, AI-native (à la Windsor.ai).
  windsor: {
    hex: "#4B5AE6", rgb: "75,90,230",
    grad: "linear-gradient(95deg, #4B5AE6 0%, #8B5CF6 100%)",
    band: "radial-gradient(60% 120% at 18% 20%, rgba(75,90,230,0.14) 0%, transparent 60%), radial-gradient(55% 110% at 84% 30%, rgba(139,92,246,0.14) 0%, transparent 60%), linear-gradient(90deg, #EEF0FF 0%, #F4EEFF 50%, #EAF6FF 100%)",
    glow: "radial-gradient(55% 80% at 84% 6%, rgba(75,90,230,0.16) 0%, transparent 60%), radial-gradient(45% 70% at 98% 40%, rgba(139,92,246,0.14) 0%, transparent 60%), radial-gradient(45% 65% at 66% 0%, rgba(6,182,212,0.10) 0%, transparent 55%)",
    oat: "#F3F4FC",
    ctaBand: "linear-gradient(120deg, #EEF0FF 0%, #F3EEFF 50%, #EAF6FF 100%)",
  },
  // CIOB — institutional academy: the original navy + rust editorial identity on a
  // clean white canvas with genuinely dark navy bands (à la CIOB Academy).
  ciob: {
    hex: "#A35139", rgb: "163,81,57",
    grad: "linear-gradient(95deg, #8E4630 0%, #A35139 60%, #B4664C 100%)",
    band: "linear-gradient(90deg, #F3EFE7 0%, #EFEAE0 100%)",
    glow: "radial-gradient(55% 80% at 84% 6%, rgba(163,81,57,0.10) 0%, transparent 60%), radial-gradient(45% 70% at 98% 40%, rgba(27,38,50,0.08) 0%, transparent 60%)",
    oat: "#F1F2F5",
    ctaBand: "linear-gradient(120deg, #F3EFE7 0%, #EEE9DF 100%)",
  },
  // Graphite — refined near-monochrome. Restrained, "expensive" B2B.
  graphite: {
    hex: "#27272A", rgb: "39,39,42",
    grad: "linear-gradient(95deg, #18181B 0%, #2B2B30 55%, #161618 100%)",
    band: "radial-gradient(70% 140% at 16% 22%, rgba(120,120,130,0.18) 0%, transparent 60%), radial-gradient(65% 130% at 84% 78%, rgba(80,80,90,0.16) 0%, transparent 60%), linear-gradient(90deg, #ECECEF 0%, #F3F1F4 35%, #EDEDF0 65%, #F2EFEA 100%)",
    glow: "radial-gradient(55% 80% at 82% 8%, rgba(40,40,46,0.10) 0%, transparent 60%), radial-gradient(45% 70% at 98% 42%, rgba(40,40,46,0.07) 0%, transparent 60%)",
    oat: "#F4F4F5",
    ctaBand: "linear-gradient(120deg, #F4F4F5 0%, #FAFAFA 50%, #F4F4F5 100%)",
  },
};
const ACCENT: Accent = ACCENTS[(IS_LIGHT ? (THEME as LightThemeName) : "cobalt")];

/** The active accent's base hex + rgb, for components that need the accent colour
 *  directly (e.g. dark sections) regardless of the light/dark surface tokens. */
export const ACCENT_HEX = ACCENT.hex;
export const ACCENT_RGB = ACCENT.rgb;
/** The active theme's signature gradient — used sparingly as a hairline / accent. */
export const ACCENT_GRAD = ACCENT.grad;

type Palette = {
  readonly navy: string; readonly cream: string; readonly rust: string;
  readonly oat: string; readonly white: string; readonly amber: string;
};

/** Shared base for every light theme: white surfaces, true-black text, per-theme accent.
 *  KEYIS grounds the page in its warm slate-white; the dark skin reverses to near-black
 *  surfaces with slate-white text (cards/alt-surfaces become dark panels). */
const LIGHT_PALETTE: Palette = IS_DARK
  ? {
      navy: "#F4F2EE", cream: "#0C0C0E", rust: ACCENT.hex,
      oat: "#111116", white: "#1A1A1F", amber: "#FFCF47",
    }
  : {
      // CIOB keeps the editorial navy as its ink instead of true black.
      navy: IS_CIOB ? "#1B2632" : "#000000",
      cream: IS_KEYIS ? "#EDEBE6" : "#FFFFFF", rust: ACCENT.hex,
      oat: ACCENT.oat, white: "#FFFFFF", amber: IS_KEYIS ? "#FFCF47" : "#FF7A3D",
    };

/** KEYIS grounds nav / footer / primary buttons in near-black (light skin). */
const KEYIS_INK = "#141414";
/** Dark-skin surfaces. */
const DARK_INK = "#0A0A0C";

/** Pick a value for the active theme group: (default, noir, light-family). */
function pick<T>(d: T, noir: T, light: T): T {
  return IS_NOIR ? noir : IS_LIGHT ? light : d;
}

export const COLORS: Palette = IS_NOIR
  ? COLORS_NOIR
  : IS_LIGHT
    ? LIGHT_PALETTE
    : COLORS_DEFAULT;

// Convenience named exports — used directly in the pages' inline styles.
export const NAVY = COLORS.navy;
export const CREAM = COLORS.cream;
export const RUST = COLORS.rust;
export const OAT = COLORS.oat;
export const WHITE = COLORS.white;
export const AMBER = COLORS.amber;

/**
 * RGB triplets (for inline `rgba(...)` literals) that track the active theme.
 * In the light family, light-on-dark text/borders flip to TRUE BLACK on white,
 * and rust tints become the theme accent.
 */
export const NAVY_RGB = pick("27,38,50", "26,26,28", IS_DARK ? "244,242,238" : IS_CIOB ? "27,38,50" : "0,0,0");
export const RUST_RGB = pick("163,81,57", "142,59,59", ACCENT.rgb);
// CIOB's dark sections are genuinely navy, so light-on-dark text stays cream there.
export const CREAM_RGB = pick("238,233,223", "244,242,238", IS_DARK || IS_CIOB ? "238,233,223" : "0,0,0");

/**
 * Background for large sections that were dark (hero / founder / CTA / footers).
 * Default keeps flat navy (identical to before). Noir = charcoal gradient.
 * Light family = WHITE (full white site; text on them flips to true black).
 */
export const DARK_GRADIENT = pick(
  NAVY,
  "linear-gradient(180deg, #1A1A1C 0%, #242428 100%)",
  IS_DARK
    ? "linear-gradient(180deg, #0C0C0E 0%, #141419 100%)"
    : IS_CIOB
      ? "linear-gradient(180deg, #1B2632 0%, #16202B 100%)"
      : "#FFFFFF",
);

/**
 * Primary / muted text that previously sat on dark sections. Light in
 * default + noir (unchanged); TRUE BLACK in the light family so it reads on white.
 */
export const ON_DARK = pick("#FFFFFF", "#FFFFFF", IS_DARK || IS_CIOB ? "#FFFFFF" : "#000000");
export const ON_DARK_RGB = pick("255,255,255", "255,255,255", IS_DARK || IS_CIOB ? "255,255,255" : "0,0,0");

/**
 * Genuinely dark CTA buttons (the navy "solid" buttons, distinct from sections).
 * Dark in default/noir; the theme's gradient fill in the light family.
 */
export const CTA_DARK_BG = IS_CIOB ? "#1B2632" : IS_DARK ? DARK_INK : IS_KEYIS ? KEYIS_INK : IS_LIGHT ? ACCENT.grad : DARK_GRADIENT;

/**
 * Primary action buttons (hero / nav / form CTAs) that use the rust accent fill
 * in the editorial themes. In the light family they take the gradient fill so the
 * main calls-to-action carry the brand colour.
 */
export const CTA_PRIMARY_BG = IS_CIOB ? "#A35139" : IS_DARK ? "#D6304A" : IS_KEYIS ? KEYIS_INK : IS_LIGHT ? ACCENT.grad : RUST;

/**
 * Navigation bar — a filled cobalt (brand-gradient) header with light content on
 * every theme. Centralised so all page navs stay consistent.
 */
/** Windsor + CIOB use a clean WHITE nav with dark content (rest keep the filled bar). */
export const NAV_ON_LIGHT = IS_WINDSOR || IS_CIOB;
export const NAV_BAR_BG = NAV_ON_LIGHT ? "rgba(255,255,255,0.94)" : IS_DARK ? "#0E0E12" : IS_KEYIS ? KEYIS_INK : IS_LIGHT ? ACCENT.grad : DARK_GRADIENT;
export const NAV_LINK = NAV_ON_LIGHT ? "rgba(27,38,50,0.72)" : "rgba(255,255,255,0.82)";
export const NAV_LINK_ACTIVE = NAV_ON_LIGHT ? (IS_CIOB ? "#1B2632" : "#14151A") : "#FFFFFF";
export const NAV_BORDER = NAV_ON_LIGHT ? "rgba(27,38,50,0.10)" : "rgba(255,255,255,0.16)";
export const NAV_CTA_BG = IS_CIOB ? "#A35139" : IS_WINDSOR ? "#14151A" : "#FFFFFF";
export const NAV_CTA_TEXT = NAV_ON_LIGHT ? "#FFFFFF" : ACCENT.hex;

/** Footer background — the white-nav skins keep a deep dark footer. */
export const FOOTER_BG = IS_CIOB ? "#141C25" : IS_WINDSOR ? "#0E1330" : NAV_BAR_BG;

/**
 * Full-bleed CTA bands that use the rust accent as their background in the
 * editorial themes. In the light family they become a soft pastel wash with dark
 * text + a gradient button on top.
 */
export const CTA_BAND_BG = IS_DARK
  ? "linear-gradient(120deg, #141419 0%, #0E0E12 100%)"
  : IS_LIGHT ? ACCENT.ctaBand : RUST;

/** Translucent nav-bar scrim. Dark in default/noir + dark skin; white in the light family. */
export const NAV_RGB = pick("27,38,50", "26,26,28", IS_DARK ? "12,12,18" : "255,255,255");

/**
 * Soft coloured glow layered over the white hero (light family only) — an
 * "aurora" feel without hurting the left-aligned text contrast. Empty in
 * default/noir (the hero keeps its image + dark overlay).
 */
export const HERO_GLOW = IS_LIGHT ? ACCENT.glow : "";

/**
 * Signature gradient band. Default and noir keep the solid oat surface
 * (identical to before); the light family gets the enlarged, layered prism band
 * for its accent — dark text/logos sit on it, so contrast holds.
 */
export const BAND_GRADIENT = pick(OAT, OAT, ACCENT.band);

/**
 * A faint accent glow layered behind key light-theme sections so they read with
 * gentle depth instead of flat white. `"none"` in default/noir (unchanged).
 * Applied as `backgroundImage` over a solid `backgroundColor`.
 */
export const SECTION_GLOW = IS_LIGHT
  ? `radial-gradient(60% 55% at 50% -8%, rgba(${ACCENT.rgb},0.07) 0%, transparent 62%)`
  : "none";

/**
 * A soft, solid-feeling tint used to alternate section backgrounds so pages read
 * as bands of gentle colour instead of walls of white (the iHasco / Citation
 * rhythm). Light family gets a faint accent wash; default/noir keep OAT/cream.
 */
export const SECTION_TINT = pick(OAT, COLORS.cream, `rgba(${ACCENT.rgb},0.055)`);

/**
 * Two soft ambient "orb" gradients (accent + a warm counter-tone) for decorating
 * otherwise-empty areas of light-theme sections. Empty string in default/noir.
 */
export const ORB_ACCENT = IS_LIGHT ? `radial-gradient(circle, rgba(${ACCENT.rgb},0.16) 0%, transparent 70%)` : "";
export const ORB_WARM = IS_LIGHT ? `radial-gradient(circle, rgba(${RUST_RGB},0.12) 0%, transparent 70%)` : "";

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
  s.setProperty("--eba-accent-grad", ACCENT.grad);
  s.setProperty("--eba-accent-rgb", ACCENT.rgb);
}

/**
 * Heading typeface A/B — `?font=modern` swaps the Playfair serif for a modern
 * grotesk (Space Grotesk) by overriding the --eba-heading CSS variable. Works on
 * any theme and is independent of the colour selection.
 */
export const IS_SERIF_FONT =
  typeof window !== "undefined" &&
  (() => { try { return new URLSearchParams(window.location.search).get("font") === "serif"; } catch { return false; } })();

// Headings ship in Space Grotesk (set in index.css :root). ?font=serif reverts
// to the original Playfair Display for comparison.
if (IS_SERIF_FONT && typeof document !== "undefined") {
  document.documentElement.style.setProperty("--eba-heading", "'Playfair Display', serif");
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

/**
 * Testimonials are hidden until we have real founding-member quotes.
 * Pre-launch we have none — an empty-but-honest site beats fake proof.
 * Flip to true once real, attributable quotes are in Testimonials.tsx.
 */
export const SHOW_TESTIMONIALS = false;

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
