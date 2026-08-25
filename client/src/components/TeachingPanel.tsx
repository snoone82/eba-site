/**
 * TeachingPanel — replaces the founder portrait slots.
 *
 * The site previously used stock photography of a model, captioned as Mark. That
 * is misleading regardless of how it looks, and a suited stranger in a boardroom
 * was also the single most corporate thing on the page.
 *
 * Rather than leave a hole, the slot now does a job the photo never did: it states
 * what the reader is actually buying — who teaches it, how much of it there is, and
 * what it is built from. Facts, set typographically.
 *
 * Every figure here is already stated elsewhere on the site and in Kajabi. Do not
 * add a number to this component that is not true somewhere else.
 */

import { NAVY, NAVY_RGB, CREAM_RGB, RUST, RUST_ON_DARK, ON_DARK, ACCENT_GRAD } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useMobile";

interface Row { figure: string; label: string }

export function TeachingPanel({
  rows,
  kicker = "Who teaches it",
  heading,
  attribution,
  onDark = true,
}: {
  rows: Row[];
  kicker?: string;
  heading: string;
  /** Optional name line, e.g. "Mark Poulton — CEO, KEYIS Group". */
  attribution?: string;
  onDark?: boolean;
}) {
  const isMobile = useIsMobile();
  const fg = onDark ? ON_DARK : NAVY;
  const muted = onDark ? `rgba(${CREAM_RGB},0.7)` : `rgba(${NAVY_RGB},0.68)`;
  const accent = onDark ? RUST_ON_DARK : RUST;
  const line = onDark ? "rgba(255,255,255,0.14)" : `rgba(${NAVY_RGB},0.12)`;

  return (
    <div style={{
      background: onDark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
      border: `1px solid ${line}`,
      borderRadius: "14px",
      padding: isMobile ? "26px 22px" : "34px 30px",
    }}>
      <p style={{
        fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase", color: accent, margin: "0 0 14px",
      }}>
        {kicker}
      </p>

      <p style={{
        fontFamily: "var(--eba-heading)", fontWeight: 800,
        fontSize: isMobile ? "1.35rem" : "1.6rem", letterSpacing: "-0.02em",
        color: fg, margin: "0 0 22px", lineHeight: 1.2,
      }}>
        {heading}
      </p>

      {/* Brand gradient hairline — a sanctioned use. */}
      <div style={{ height: "2px", width: "56px", background: ACCENT_GRAD, borderRadius: "2px", marginBottom: "24px" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
            <span style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: isMobile ? "1.5rem" : "1.8rem", letterSpacing: "-0.03em",
              color: accent, minWidth: isMobile ? "68px" : "84px",
              fontVariantNumeric: "tabular-nums", lineHeight: 1,
            }}>
              {r.figure}
            </span>
            <span style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "14.5px",
              color: muted, lineHeight: 1.5,
            }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>

      {attribution && (
        <p style={{
          fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase", color: muted,
          margin: "26px 0 0", paddingTop: "18px", borderTop: `1px solid ${line}`,
        }}>
          {attribution}
        </p>
      )}
    </div>
  );
}
