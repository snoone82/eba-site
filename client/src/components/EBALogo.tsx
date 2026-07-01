/**
 * EBA Logo — inline SVG component.
 * A royal-blue square mark with diagonal cut corners (top-left + bottom-right),
 * bold white EBA letterforms, a double-rule divider and an uppercase geometric
 * wordmark. Two modes: solid (blue tile, for light backgrounds) and outline
 * (white keyline on the cobalt header/footer). Renders instantly, no network.
 */

import { WHITE } from "@/lib/constants";

const BLUE = "#2563EB";          // brand blue — matches the cobalt gradient's mid-tone
const WORD_FONT = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";

interface EBALogoProps {
  /** Height in px — width scales proportionally */
  height?: number;
  /** "horizontal" = icon + wordmark (default) · "icon" = mark only */
  variant?: "horizontal" | "icon";
  /** Render wordmark in white (for dark backgrounds) */
  light?: boolean;
  /** Outline (white keyline) icon for the filled cobalt header/footer */
  navOnCobalt?: boolean;
}

export function EBALogo({
  height = 44,
  variant = "horizontal",
  light = false,
  navOnCobalt = false,
}: EBALogoProps) {
  const outline = navOnCobalt;
  const iconFill = outline ? "none" : BLUE;
  const iconStroke = outline ? WHITE : BLUE;
  const wordColor = light || outline ? WHITE : BLUE;
  const ruleColor = wordColor;

  const S = height;                 // square icon side
  const cut = S * 0.3;              // corner cut size
  // Square with top-left + bottom-right corners cut off.
  const hex = `${cut},0 ${S},0 ${S},${S - cut} ${S - cut},${S} 0,${S} 0,${cut}`;

  const Icon = (
    <>
      <polygon points={hex} fill={iconFill} stroke={iconStroke} strokeWidth={outline ? 2 : 1.5} strokeLinejoin="round" />
      <text
        x={S / 2}
        y={S * 0.62}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={WHITE}
        fontFamily="'DM Sans', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize={S * 0.34}
        letterSpacing="-1"
      >
        EBA
      </text>
    </>
  );

  if (variant === "icon") {
    return (
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="EBA">
        {Icon}
      </svg>
    );
  }

  // Horizontal lockup
  const ruleX = S + 14;
  const wordX = S + 30;
  const totalW = S + 30 + 258;
  const fs = S * 0.2;

  return (
    <svg
      width={totalW}
      height={S}
      viewBox={`0 0 ${totalW} ${S}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="The Engineering Business Academy"
      style={{ display: "block", maxWidth: "100%", height: "auto" }}
    >
      {Icon}

      {/* Double-rule divider */}
      <line x1={ruleX} y1={S * 0.12} x2={ruleX} y2={S * 0.88} stroke={ruleColor} strokeWidth="1.4" />
      <line x1={ruleX + 4} y1={S * 0.12} x2={ruleX + 4} y2={S * 0.88} stroke={ruleColor} strokeWidth="1.4" />

      {/* Uppercase geometric wordmark */}
      <text x={wordX} y={S * 0.42} fill={wordColor} fontFamily={WORD_FONT} fontWeight="700" fontSize={fs} letterSpacing="0.14em">
        THE ENGINEERING
      </text>
      <text x={wordX} y={S * 0.74} fill={wordColor} fontFamily={WORD_FONT} fontWeight="700" fontSize={fs} letterSpacing="0.14em">
        BUSINESS ACADEMY
      </text>
    </svg>
  );
}
