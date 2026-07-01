/**
 * EBA Logo — inline SVG component.
 * Cobalt-era mark: a cobalt gradient tile with diagonal cut-corner detail and
 * bold white EBA letterforms, plus a horizontal lockup with wordmark. A
 * `navOnCobalt` variant flips to a white tile with cobalt letters for the filled
 * cobalt header/footer. Renders instantly with no network dependency.
 */

import { NAVY, WHITE, NAVY_RGB, ACCENT_HEX } from "@/lib/constants";

const GRAD_ID = "ebaLogoGrad";

/** Shared cobalt gradient (duplicate ids across instances are fine — identical
 *  defs, and url() resolves document-wide to the first match). */
function Grad() {
  return (
    <defs>
      <linearGradient id={GRAD_ID} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2B2F9E" />
        <stop offset="0.55" stopColor="#2563EB" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
  );
}

interface EBALogoProps {
  /** Height in px — width scales proportionally */
  height?: number;
  /** "horizontal" = icon + wordmark side by side (default, for nav/header)
   *  "icon" = icon mark only (for favicon, small contexts) */
  variant?: "horizontal" | "icon";
  /** If true, renders wordmark in white (for dark backgrounds) */
  light?: boolean;
  /** If true, renders the icon as a white tile with cobalt letters — for the
   *  filled cobalt nav bar / footer, where a gradient tile would blend in. */
  navOnCobalt?: boolean;
}

export function EBALogo({
  height = 44,
  variant = "horizontal",
  light = false,
  navOnCobalt = false,
}: EBALogoProps) {
  const wordColor = light ? WHITE : NAVY;
  const iconBg = navOnCobalt ? WHITE : `url(#${GRAD_ID})`;
  const iconText = navOnCobalt ? ACCENT_HEX : WHITE;
  // Cut-corner facets: subtle white on the gradient tile; hidden on the white tile.
  const facet = "rgba(255,255,255,0.18)";

  // Icon mark dimensions
  const iconH = height;
  const iconW = iconH; // square
  const rad = iconH * 0.2;

  if (variant === "icon") {
    return (
      <svg width={iconW} height={iconH} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Engineering Business Academy">
        {!navOnCobalt && <Grad />}
        <rect width="100" height="100" rx="20" fill={iconBg} />
        {!navOnCobalt && (
          <>
            <polygon points="0,0 32,0 0,32" fill={facet} />
            <polygon points="100,100 68,100 100,68" fill={facet} />
            <line x1="32" y1="0" x2="0" y2="32" stroke={WHITE} strokeWidth="2.5" />
            <line x1="100" y1="68" x2="68" y2="100" stroke={WHITE} strokeWidth="2.5" />
          </>
        )}
        <text x="50" y="67" textAnchor="middle" fill={iconText} fontFamily="'DM Sans', 'Arial Black', sans-serif" fontWeight="900" fontSize="38" letterSpacing="-1">
          EBA
        </text>
      </svg>
    );
  }

  // Horizontal lockup: icon + wordmark
  const wordmarkH = iconH;
  const totalW = iconW + 16 + 220; // icon + gap + wordmark area

  return (
    <svg
      width={totalW}
      height={wordmarkH}
      viewBox={`0 0 ${totalW} ${wordmarkH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="The Engineering Business Academy"
      style={{ display: "block", maxWidth: "100%", height: "auto" }}
    >
      {!navOnCobalt && <Grad />}

      {/* ── ICON MARK ── */}
      <rect width={iconW} height={iconH} rx={rad} fill={iconBg} />
      {!navOnCobalt && (
        <>
          <polygon points={`0,0 ${iconW * 0.32},0 0,${iconH * 0.32}`} fill={facet} />
          <polygon points={`${iconW},${iconH} ${iconW * 0.68},${iconH} ${iconW},${iconH * 0.68}`} fill={facet} />
          <line x1={iconW * 0.32} y1="0" x2="0" y2={iconH * 0.32} stroke={WHITE} strokeWidth="2" />
          <line x1={iconW} y1={iconH * 0.68} x2={iconW * 0.68} y2={iconH} stroke={WHITE} strokeWidth="2" />
        </>
      )}
      <text
        x={iconW / 2}
        y={iconH * 0.67}
        textAnchor="middle"
        fill={iconText}
        fontFamily="'DM Sans', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize={iconH * 0.38}
        letterSpacing="-0.5"
      >
        EBA
      </text>

      {/* ── WORDMARK ── */}
      <line
        x1={iconW + 14} y1={iconH * 0.18}
        x2={iconW + 14} y2={iconH * 0.82}
        stroke={light ? "rgba(255,255,255,0.35)" : `rgba(${NAVY_RGB},0.2)`}
        strokeWidth="1"
      />
      <text x={iconW + 26} y={iconH * 0.44} fill={wordColor} fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" fontWeight="300" fontSize={iconH * 0.22} letterSpacing="0.12em">
        THE ENGINEERING
      </text>
      <text x={iconW + 26} y={iconH * 0.72} fill={wordColor} fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" fontWeight="600" fontSize={iconH * 0.22} letterSpacing="0.08em">
        BUSINESS ACADEMY
      </text>
    </svg>
  );
}
