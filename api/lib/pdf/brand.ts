/**
 * Brand config for the shared branded-PDF renderer. One file, swappable —
 * every tool in the suite (toolbox talk now; O&M / RAMS / COSHH / Co-Pilot
 * later) reads its palette/fonts from here.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export interface BrandConfig {
  ink: string;
  paper: string;
  accent: string;
  hairline: string;
  stone: string;
  fontFamily: string;
  wordmark: string;
  tagline: string;
  /** Shown in the running footer — keep in sync with Seo.tsx's SITE_URL. */
  domain: string;
}

export const EBA_PDF_BRAND: BrandConfig = {
  ink: "#111214",
  paper: "#F4F1EA",
  accent: "#EF4A5C",
  hairline: "#E4DFD5",
  stone: "#6B6B70",
  fontFamily: "'Inter', sans-serif",
  wordmark: "THE ENGINEERING BUSINESS ACADEMY",
  tagline: "Engineer Your Business. Design Your Freedom.",
  domain: "teb-academy.com",
};

// Literal require.resolve() calls (not built from a variable) so Vercel's
// Node File Trace can statically discover and bundle these font files.
const FONT_FILES: Array<{ weight: number; path: string }> = [
  { weight: 400, path: require.resolve("@fontsource/inter/files/inter-latin-400-normal.woff2") },
  { weight: 600, path: require.resolve("@fontsource/inter/files/inter-latin-600-normal.woff2") },
  { weight: 700, path: require.resolve("@fontsource/inter/files/inter-latin-700-normal.woff2") },
  { weight: 800, path: require.resolve("@fontsource/inter/files/inter-latin-800-normal.woff2") },
];

let cachedFontFaceCss: string | null = null;

/** Inter, embedded as base64 woff2 so the PDF renders identically offline. */
export function getEmbeddedFontFaceCss(): string {
  if (cachedFontFaceCss) return cachedFontFaceCss;

  cachedFontFaceCss = FONT_FILES.map(({ weight, path }) => {
    const base64 = readFileSync(path).toString("base64");
    return `
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url(data:font/woff2;base64,${base64}) format('woff2');
}`;
  }).join("\n");

  return cachedFontFaceCss;
}
