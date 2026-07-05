/**
 * RoiStatBand — the tools-side ROI band (numbers first, mechanism second).
 * Figures render in the TOOLS accent (cobalt in the engineer theme); labels are
 * small-caps; each stat carries a one-line mechanism explaining where the
 * saving comes from. Used full-size on the AI Tools page and compact on the
 * homepage tools block.
 */

import { COBALT, NAVY_RGB, WHITE } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useMobile";

const ROI_STATS = [
  { figure: "3 days → same day", mechanism: "O&M manuals returned in 24 hours, not compiled by hand" },
  { figure: "£600–£1,200 saved per manual", mechanism: "the engineer time each manual replaces" },
  { figure: "Minutes, not afternoons", mechanism: "RAMS, COSHH and toolbox talks on demand" },
];

export function RoiStatBand({ compact = false }: { compact?: boolean }) {
  const isMobile = useIsMobile();
  const stacked = isMobile;
  return (
    <div style={{
      background: WHITE,
      border: `1px solid rgba(${NAVY_RGB},0.10)`,
      borderTop: `3px solid ${COBALT}`,
      borderRadius: "12px",
      padding: compact ? (stacked ? "22px 20px" : "26px 28px") : (stacked ? "28px 22px" : "38px 40px"),
      display: "grid",
      gridTemplateColumns: stacked ? "1fr" : "repeat(3, 1fr)",
      gap: stacked ? "22px" : compact ? "24px" : "36px",
    }}>
      {ROI_STATS.map(({ figure, mechanism }) => (
        <div key={figure}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
            fontSize: compact ? "15px" : "clamp(16px, 1.6vw, 20px)",
            letterSpacing: "0.06em", textTransform: "uppercase",
            color: COBALT, margin: "0 0 6px", lineHeight: 1.3,
          }}>
            {figure}
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: compact ? "13px" : "14px",
            lineHeight: 1.55, color: `rgba(${NAVY_RGB},0.7)`, margin: 0,
          }}>
            {mechanism}
          </p>
        </div>
      ))}
    </div>
  );
}
