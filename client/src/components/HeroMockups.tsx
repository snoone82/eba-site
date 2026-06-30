/**
 * HeroMockups — stylized, asset-free product mockups for the hero.
 * A laptop showing the Academy module player + a phone showing the compliance
 * chatbot, built entirely from CSS/SVG so they stay crisp and theme-aware.
 * Rendered only on the modern light themes (desktop), where the hero is white.
 */
import { NAVY, WHITE, RUST, RUST_RGB, NAVY_RGB, CTA_PRIMARY_BG } from "@/lib/constants";

const MODULES = [
  "The Business You Own",
  "Cash Flow & Visibility",
  "Pricing & Margins",
  "Tendering & Winning",
  "Contracts & Risk",
];

export function HeroMockups() {
  const border = `rgba(${NAVY_RGB},0.10)`;
  const track = `rgba(${NAVY_RGB},0.08)`;
  const sub = `rgba(${NAVY_RGB},0.55)`;
  const accentSoft = `rgba(${RUST_RGB},0.12)`;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ── Laptop ── */}
      <div className="eba-float" style={{ position: "absolute", top: "8px", right: "0", width: "470px", maxWidth: "100%" }}>
        <div style={{
          background: WHITE, borderRadius: "14px", border: `1px solid ${border}`,
          boxShadow: "0 34px 70px -24px rgba(0,0,0,0.28), 0 12px 24px -16px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}>
          {/* window chrome */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "11px 14px", borderBottom: `1px solid ${border}` }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
              <span key={c} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c, opacity: 0.85 }} />
            ))}
            <div style={{ marginLeft: "12px", flex: 1, maxWidth: "200px", height: "16px", borderRadius: "8px", background: track }} />
          </div>
          {/* app body */}
          <div style={{ display: "flex", minHeight: "276px" }}>
            {/* sidebar */}
            <div style={{ width: "168px", borderRight: `1px solid ${border}`, padding: "16px 12px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: RUST, marginBottom: "14px" }}>
                THE ACADEMY
              </div>
              {MODULES.map((m, i) => (
                <div key={m} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 9px", marginBottom: "4px", borderRadius: "7px",
                  background: i === 2 ? accentSoft : "transparent",
                }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: i < 2 ? RUST : i === 2 ? RUST : track, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", fontWeight: i === 2 ? 700 : 500, color: i === 2 ? NAVY : sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {m}
                  </span>
                </div>
              ))}
            </div>
            {/* lesson */}
            <div style={{ flex: 1, padding: "18px 18px 20px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: sub, marginBottom: "8px" }}>
                LESSON 4 OF 12
              </div>
              <div style={{ fontFamily: "var(--eba-heading)", fontSize: "20px", fontWeight: 800, color: NAVY, lineHeight: 1.15, marginBottom: "14px" }}>
                Pricing, Margins &amp; Estimating
              </div>
              {/* video area */}
              <div style={{
                position: "relative", height: "120px", borderRadius: "10px",
                background: `linear-gradient(135deg, ${accentSoft}, rgba(${NAVY_RGB},0.04))`,
                border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "14px",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%", background: CTA_PRIMARY_BG,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 20px -6px rgba(0,0,0,0.3)",
                }}>
                  <span style={{ width: 0, height: 0, borderLeft: "12px solid #fff", borderTop: "8px solid transparent", borderBottom: "8px solid transparent", marginLeft: "3px" }} />
                </div>
              </div>
              {/* progress */}
              <div style={{ height: "6px", borderRadius: "3px", background: track, overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ width: "62%", height: "100%", background: CTA_PRIMARY_BG }} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: sub }}>62% complete · 7 lessons left</div>
            </div>
          </div>
        </div>
        {/* laptop base */}
        <div style={{ height: "10px", margin: "0 -26px", borderRadius: "0 0 14px 14px", background: "linear-gradient(180deg, #DCDCE2 0%, #BFBFC8 100%)" }} />
        <div style={{ height: "3px", width: "70px", margin: "0 auto", borderRadius: "0 0 6px 6px", background: "#AEAEB8" }} />
      </div>

      {/* ── Phone: compliance chatbot ── */}
      <div className="eba-float-slow" style={{ position: "absolute", bottom: "-18px", left: "0", width: "168px" }}>
        <div style={{
          background: WHITE, borderRadius: "26px", border: `1px solid ${border}`, padding: "10px 9px 14px",
          boxShadow: "0 30px 60px -22px rgba(0,0,0,0.32), 0 10px 18px -12px rgba(0,0,0,0.2)",
        }}>
          {/* notch */}
          <div style={{ width: "46px", height: "5px", borderRadius: "3px", background: track, margin: "1px auto 10px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "0 4px 10px", borderBottom: `1px solid ${border}`, marginBottom: "10px" }}>
            <span style={{ width: "20px", height: "20px", borderRadius: "6px", background: CTA_PRIMARY_BG, flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: NAVY }}>Compliance Assistant</span>
          </div>
          {/* user bubble */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
            <div style={{ maxWidth: "84%", background: accentSoft, color: NAVY, fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", lineHeight: 1.4, padding: "7px 9px", borderRadius: "10px 10px 2px 10px" }}>
              What RAMS do I need for hot works on an MOD site?
            </div>
          </div>
          {/* answer bubble */}
          <div style={{ display: "flex", marginBottom: "4px" }}>
            <div style={{ maxWidth: "90%", background: `rgba(${NAVY_RGB},0.05)`, color: sub, fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", lineHeight: 1.4, padding: "7px 9px", borderRadius: "10px 10px 10px 2px" }}>
              You'll need a hot-works permit, a fire-watch RAMS and…
              <span className="eba-caret" style={{ display: "inline-block", width: "5px", height: "11px", background: RUST, marginLeft: "2px", verticalAlign: "-2px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating "automation" chip ── */}
      <div className="eba-float-slow" style={{ position: "absolute", top: "-14px", left: "70px", background: WHITE, border: `1px solid ${border}`, borderRadius: "12px", padding: "10px 14px", boxShadow: "0 18px 36px -16px rgba(0,0,0,0.26)", display: "flex", alignItems: "center", gap: "9px" }}>
        <span style={{ width: "26px", height: "26px", borderRadius: "8px", background: CTA_PRIMARY_BG, flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: NAVY, lineHeight: 1.1 }}>O&amp;M manual generated</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "8.5px", color: sub }}>in 2 min · 48 pages</div>
        </div>
      </div>
    </div>
  );
}
