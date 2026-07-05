/**
 * EBALogo — the brand lockup from the approved asset pack, as inline SVG:
 *
 *   THE
 *   ENGINEERING
 *   BUSINESS ACADEMY
 *   ───────────────── (six-stop brand gradient underline)
 *
 * The gradient underline is one of the three allowed gradient hairline uses.
 * Renders instantly with no network: the wordmark uses Poppins with
 * WEB-SAFE FALLBACKS ('Helvetica Neue', Arial) so the logo is legible before
 * webfonts load — this fix has regressed before, keep the fallback stack.
 *
 * On dark surfaces (black nav/footer, dark heroes) the wordmark is white; on
 * light surfaces it is jet black. Props preserved from the previous logo so
 * call sites don't change (`navOnCobalt` historically meant "on the nav bar").
 */

const WORD_FONT = "'Poppins', 'Helvetica Neue', Arial, sans-serif";

interface EBALogoProps {
  /** Height in px — width scales proportionally */
  height?: number;
  /** "horizontal" (default) and "icon" both render the stacked brand lockup */
  variant?: "horizontal" | "icon";
  /** White wordmark for dark backgrounds */
  light?: boolean;
  /** Historical prop: rendered inside the (black) nav bar → white wordmark */
  navOnCobalt?: boolean;
}

let gradientIdCounter = 0;

export function EBALogo({
  height = 44,
  variant = "horizontal",
  light = false,
  navOnCobalt = false,
}: EBALogoProps) {
  const onDark = light || navOnCobalt;
  const ink = onDark ? "#FFFFFF" : "#0A0A0A";

  // Unique gradient id per instance so multiple logos on a page don't collide.
  const gid = `eba-lg-${gradientIdCounter++}`;

  // Lockup metrics (viewBox units; scaled by `height`).
  const W = 168;
  const H = 64;

  return (
    <svg
      width={(height / H) * W}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The Engineering Business Academy"
      style={{ display: "block", maxWidth: "100%", height: "auto" }}
    >
      <defs>
        {/* Brand gradient — HAIRLINE RULES ONLY; here: the logo underline. */}
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF5B6E" />
          <stop offset="20%" stopColor="#FF9F1C" />
          <stop offset="40%" stopColor="#D4FF00" />
          <stop offset="60%" stopColor="#2ECC71" />
          <stop offset="80%" stopColor="#18C1D6" />
          <stop offset="100%" stopColor="#3AA0FF" />
        </linearGradient>
      </defs>

      <text x="1" y="12" fill={ink} fontFamily={WORD_FONT} fontWeight="500" fontSize="9" letterSpacing="5.5">
        THE
      </text>
      <text x="0" y="36" fill={ink} fontFamily={WORD_FONT} fontWeight="700" fontSize="21.5" letterSpacing="0.4">
        ENGINEERING
      </text>
      <text x="1" y="50" fill={ink} fontFamily={WORD_FONT} fontWeight="400" fontSize="8" letterSpacing="3.55">
        BUSINESS ACADEMY
      </text>
      <rect x="1" y="57" width={W - 2} height="2.5" fill={`url(#${gid})`} />
    </svg>
  );
}
