/**
 * EBA Logo — inline SVG component.
 * A solid rounded-square tile carrying bold "EBA" letterforms, a double-rule
 * divider and an uppercase two-line wordmark. The tile is always a filled
 * contrasting block (never an outline):
 *   • on dark / cobalt backgrounds → white tile, blue letters, white wordmark
 *   • on light backgrounds        → blue tile, white letters, blue wordmark
 * Renders instantly, no network.
 */

import { WHITE } from "@/lib/constants";

const BLUE = "#2563EB";          // brand blue — matches the cobalt gradient's mid-tone
const WORD_FONT = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";

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
  const tileFill = onDark ? WHITE : BLUE;   // solid tile
  const ebaColor = onDark ? BLUE : WHITE;   // letters inside the tile
  const wordColor = onDark ? WHITE : BLUE;  // wordmark
  const ruleColor = wordColor;

  const S = height;               // square tile side
  const r = S * 0.16;             // rounded-corner radius

  const Icon = (
    <>
      <rect x={0} y={0} width={S} height={S} rx={r} ry={r} fill={tileFill} />
      <text
        x={S / 2}
        y={S * 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fill={ebaColor}
        fontFamily="'DM Sans', 'Arial Black', sans-serif"
        fontWeight="800"
        fontSize={S * 0.34}
        letterSpacing="-0.5"
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
