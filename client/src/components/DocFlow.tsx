/**
 * DocFlow — an asset-free "documents → structured data" animation that
 * demonstrates the AI tools: messy M&E paperwork on the left is "scanned" and
 * resolves into a clean structured output on the right. CSS-only motion,
 * disabled under prefers-reduced-motion. Theme-aware via the colour tokens.
 */
import { NAVY, CREAM, WHITE, RUST, RUST_RGB, NAVY_RGB, CTA_PRIMARY_BG } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useMobile";

const DOCS = [
  { label: "O&M Manual.pdf", rot: "-6deg", top: "0px", left: "8px" },
  { label: "RAMS.docx", rot: "3deg", top: "26px", left: "34px" },
  { label: "Compliance Cert", rot: "-2deg", top: "54px", left: "16px" },
];

const ROWS = [
  { k: "Asset register", v: "142 assets" },
  { k: "O&M — structured", v: "9 sections" },
  { k: "Compliance status", v: "14 / 14 ✓" },
  { k: "Warranty dates", v: "extracted" },
];

export function DocFlow() {
  const isMobile = useIsMobile();
  const border = `rgba(${NAVY_RGB},0.10)`;
  const sub = `rgba(${NAVY_RGB},0.55)`;
  const track = `rgba(${NAVY_RGB},0.06)`;
  const accentSoft = `rgba(${RUST_RGB},0.10)`;

  return (
    <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "96px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* heading */}
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 56px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RUST, marginBottom: "16px" }}>
            · The AI Tools ·
          </div>
          <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2rem" : "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: NAVY, margin: "0 0 18px" }}>
            From site paperwork to structured intelligence.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? "15px" : "17px", lineHeight: 1.65, color: sub, margin: 0 }}>
            O&amp;M manuals, RAMS, certificates and CDM files — read, understood and turned
            into structured, searchable output your team can actually use.
          </p>
        </div>

        {/* flow */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "center", gap: isMobile ? "28px" : "8px" }}>
          {/* messy docs */}
          <div style={{ position: "relative", width: "240px", height: "180px", flexShrink: 0 }}>
            <div className="eba-scanwrap" style={{ position: "relative", width: "200px", height: "180px", margin: "0 auto" }}>
              {DOCS.map((d) => (
                <div key={d.label} style={{
                  position: "absolute", top: d.top, left: d.left, width: "150px", height: "108px",
                  background: WHITE, border: `1px solid ${border}`, borderRadius: "8px",
                  transform: `rotate(${d.rot})`, boxShadow: "0 12px 24px -14px rgba(0,0,0,0.25)",
                  padding: "12px 12px",
                }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "8.5px", fontWeight: 700, color: sub, marginBottom: "8px", whiteSpace: "nowrap" }}>{d.label}</div>
                  {[1, 0.8, 0.9, 0.6].map((w, j) => (
                    <div key={j} style={{ height: "5px", width: `${w * 100}%`, background: track, borderRadius: "3px", marginBottom: "5px" }} />
                  ))}
                </div>
              ))}
              {/* scan line */}
              <div className="eba-scanline" style={{ position: "absolute", left: "-6px", right: "-6px", height: "2px", background: RUST, boxShadow: `0 0 12px 2px rgba(${RUST_RGB},0.6)`, borderRadius: "2px" }} />
            </div>
          </div>

          {/* AI node */}
          <div style={{ position: "relative", width: isMobile ? "120px" : "150px", height: "120px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="eba-pulse" style={{ position: "absolute", width: "64px", height: "64px", borderRadius: "50%", border: `2px solid rgba(${RUST_RGB},0.5)` }} />
            <span className="eba-pulse eba-pulse-2" style={{ position: "absolute", width: "64px", height: "64px", borderRadius: "50%", border: `2px solid rgba(${RUST_RGB},0.5)` }} />
            <div style={{
              position: "relative", width: "60px", height: "60px", borderRadius: "50%", background: CTA_PRIMARY_BG,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 14px 30px -10px rgba(0,0,0,0.35)",
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 800, color: "#fff", letterSpacing: "0.02em",
            }}>
              AI
            </div>
          </div>

          {/* structured output */}
          <div style={{ width: isMobile ? "100%" : "320px", maxWidth: "340px", flexShrink: 0, background: WHITE, border: `1px solid ${border}`, borderRadius: "12px", boxShadow: "0 24px 50px -24px rgba(0,0,0,0.22)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid ${border}` }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: RUST }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY }}>Structured output</span>
            </div>
            {ROWS.map((r, i) => (
              <div key={r.k} className="eba-row" style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "13px 16px", borderBottom: i < ROWS.length - 1 ? `1px solid ${border}` : "none",
                animationDelay: `${i * 0.45}s`,
              }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: sub }}>{r.k}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 700, color: NAVY, background: accentSoft, padding: "3px 9px", borderRadius: "6px" }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
