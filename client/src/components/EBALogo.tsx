/**
 * EBA Logo — inline SVG component
 * Matches the chosen design: navy square with diagonal rust cuts top-left and bottom-right,
 * bold white EBA letterforms, horizontal lockup with wordmark.
 * Renders instantly with no network dependency.
 */

import { NAVY, RUST, WHITE, NAVY_RGB } from "@/lib/constants";

interface EBALogoProps {
  /** Height in px — width scales proportionally */
  height?: number;
  /** "horizontal" = icon + wordmark side by side (default, for nav/header)
   *  "icon" = icon mark only (for favicon, small contexts)
   */
  variant?: "horizontal" | "icon";
  /** Override the wordmark text color (default: inherits or navy) */
  wordmarkColor?: string;
  /** If true, renders wordmark in white (for dark backgrounds) */
  light?: boolean;
}

export function EBALogo({
  height = 44,
  variant = "horizontal",
  light = false,
}: EBALogoProps) {
  const wordColor = light ? WHITE : NAVY;

  // Icon mark dimensions
  const iconH = height;
  const iconW = iconH; // square

  if (variant === "icon") {
    return (
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Engineering Business Academy"
      >
        {/* Navy square base */}
        <rect width="100" height="100" fill={NAVY} />
        {/* Rust triangle — top-left diagonal cut */}
        <polygon points="0,0 32,0 0,32" fill={RUST} />
        {/* Rust triangle — bottom-right diagonal cut */}
        <polygon points="100,100 68,100 100,68" fill={RUST} />
        {/* White diagonal cut lines */}
        <line x1="32" y1="0" x2="0" y2="32" stroke={WHITE} strokeWidth="2.5" />
        <line x1="100" y1="68" x2="68" y2="100" stroke={WHITE} strokeWidth="2.5" />
        {/* EBA letterforms — bold condensed */}
        <text
          x="50"
          y="67"
          textAnchor="middle"
          fill={WHITE}
          fontFamily="'DM Sans', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="38"
          letterSpacing="-1"
        >
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
      {/* ── ICON MARK ── */}
      <rect width={iconW} height={iconH} fill={NAVY} />
      {/* Rust triangle top-left */}
      <polygon
        points={`0,0 ${iconW * 0.32},0 0,${iconH * 0.32}`}
        fill={RUST}
      />
      {/* Rust triangle bottom-right */}
      <polygon
        points={`${iconW},${iconH} ${iconW * 0.68},${iconH} ${iconW},${iconH * 0.68}`}
        fill={RUST}
      />
      {/* White cut lines */}
      <line
        x1={iconW * 0.32} y1="0"
        x2="0" y2={iconH * 0.32}
        stroke={WHITE} strokeWidth="2"
      />
      <line
        x1={iconW} y1={iconH * 0.68}
        x2={iconW * 0.68} y2={iconH}
        stroke={WHITE} strokeWidth="2"
      />
      {/* EBA text in icon */}
      <text
        x={iconW / 2}
        y={iconH * 0.67}
        textAnchor="middle"
        fill={WHITE}
        fontFamily="'DM Sans', 'Arial Black', sans-serif"
        fontWeight="900"
        fontSize={iconH * 0.38}
        letterSpacing="-0.5"
      >
        EBA
      </text>

      {/* ── WORDMARK ── */}
      {/* Vertical rule separator */}
      <line
        x1={iconW + 14}
        y1={iconH * 0.18}
        x2={iconW + 14}
        y2={iconH * 0.82}
        stroke={light ? "rgba(255,255,255,0.35)" : `rgba(${NAVY_RGB},0.2)`}
        strokeWidth="1"
      />
      {/* "THE ENGINEERING" */}
      <text
        x={iconW + 26}
        y={iconH * 0.44}
        fill={wordColor}
        fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif"
        fontWeight="300"
        fontSize={iconH * 0.22}
        letterSpacing="0.12em"
        textDecoration="none"
      >
        THE ENGINEERING
      </text>
      {/* "BUSINESS ACADEMY" */}
      <text
        x={iconW + 26}
        y={iconH * 0.72}
        fill={wordColor}
        fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif"
        fontWeight="600"
        fontSize={iconH * 0.22}
        letterSpacing="0.08em"
      >
        BUSINESS ACADEMY
      </text>
    </svg>
  );
}
