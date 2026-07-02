/**
 * EBA Logo — inline SVG component.
 * A square mark with a thin keyline border, its top-left and bottom-right
 * corners diagonally cut (revealing the background), and heavy bold "EBA"
 * letterforms filling it — beside a double-rule divider and an uppercase
 * two-line wordmark. Filled contrasting block, never a hollow outline:
 *   • on dark / cobalt backgrounds → white mark, blue letters, white wordmark
 *   • on light backgrounds        → blue mark, white letters, blue wordmark
 * Renders instantly, no network.
 */

import { WHITE, ACCENT_HEX } from "@/lib/constants";

const BRAND = ACCENT_HEX;        // active theme's accent (cobalt blue / KEYIS red / …)
const EBA_FONT = "'Arial Black', 'Roboto', sans-serif";
const WORD_FONT = "'Roboto', 'Helvetica Neue', Arial, sans-serif";

interface EBALogoProps {
  /** Height in px — width scales proportionally */
  height?: number;
  /** "horizontal" = tile + wordmark (default) · "icon" = tile only */
  variant?: "horizontal" | "icon";
  /** White content for dark backgrounds */
  light?: boolean;
  /** On the filled cobalt header/footer */
  navOnCobalt?: boolean;
}

export function EBALogo({
  height = 44,
  variant = "horizontal",
  light = false,
  navOnCobalt = false,
}: EBALogoProps) {
  const onDark = light || navOnCobalt;
  const markFill = onDark ? WHITE : BRAND;   // square fill
  const lineColor = markFill;                // keyline border
  const ebaColor = onDark ? BRAND : WHITE;   // letters inside the mark
  const wordColor = onDark ? WHITE : BRAND;  // wordmark
  const ruleColor = wordColor;

  const S = height;               // square side
  const sw = S * 0.05;            // keyline thickness
  const c = S * 0.3;              // corner cut (top-left + bottom-right)
  // Square fill with the top-left and bottom-right corners chamfered off.
  const cut = `${c},0 ${S},0 ${S},${S - c} ${S - c},${S} 0,${S} 0,${c}`;

  const Icon = (
    <>
      <polygon points={cut} fill={markFill} />
      {/* Full-square keyline drawn over the fill edges */}
      <rect x={sw / 2} y={sw / 2} width={S - sw} height={S - sw} fill="none" stroke={lineColor} strokeWidth={sw} />
      <text
        x={S / 2}
        y={S * 0.53}
        textAnchor="middle"
        dominantBaseline="central"
        fill={ebaColor}
        fontFamily={EBA_FONT}
        fontWeight="900"
        fontSize={S * 0.4}
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
  const ruleX = S + 16;
  const wordX = S + 34;
  const totalW = S + 34 + 272;
  const fs = S * 0.19;

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

      {/* Single-rule divider */}
      <line x1={ruleX} y1={S * 0.1} x2={ruleX} y2={S * 0.9} stroke={ruleColor} strokeWidth="1.2" />

      {/* Thin, wide-tracked uppercase wordmark */}
      <text x={wordX} y={S * 0.42} fill={wordColor} fontFamily={WORD_FONT} fontWeight="300" fontSize={fs} letterSpacing="0.2em">
        THE ENGINEERING
      </text>
      <text x={wordX} y={S * 0.74} fill={wordColor} fontFamily={WORD_FONT} fontWeight="300" fontSize={fs} letterSpacing="0.2em">
        BUSINESS ACADEMY
      </text>
    </svg>
  );
}
