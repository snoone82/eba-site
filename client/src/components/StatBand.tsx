/**
 * StatBand — a punchy full-bleed band of animated headline numbers on the
 * signature cobalt gradient. Numbers count up when scrolled into view (honest,
 * real figures). Adds a high-energy "proof" beat to break up the page.
 */
import { useIsMobile } from "@/hooks/useMobile";
import { CTA_DARK_BG, ACCENT_RGB } from "@/lib/constants";
import { CountUp } from "@/components/CountUp";

const STATS: { end: number; suffix?: string; label: string }[] = [
  { end: 25, label: "years of real M&E practice" },
  { end: 380, label: "operator-grade documents" },
  { end: 101, label: "structured lessons" },
  { end: 4, label: "AI tools, ready now" },
];

export function StatBand() {
  const isMobile = useIsMobile();

  return (
    <section style={{ position: "relative", overflow: "hidden", background: CTA_DARK_BG, padding: isMobile ? "48px 20px" : "64px 40px" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 120% at 50% 120%, rgba(${ACCENT_RGB},0.35) 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{
        position: "relative", zIndex: 1, maxWidth: "1120px", margin: "0 auto",
        display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: isMobile ? "32px 20px" : "24px",
      }}>
        {STATS.map(({ end, suffix, label }) => (
          <div key={label} style={{ textAlign: isMobile ? "center" : "left" }}>
            <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2.6rem" : "clamp(2.8rem, 4.5vw, 4rem)", lineHeight: 1, color: "#fff", letterSpacing: "-0.02em" }}>
              <CountUp end={end} suffix={suffix} />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? "12.5px" : "14px", color: "rgba(255,255,255,0.82)", marginTop: "10px", lineHeight: 1.4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
