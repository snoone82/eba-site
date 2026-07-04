/**
 * DarkShowcase — the site's high-contrast "moment": a near-black band with a
 * glowing cobalt gradient, oversized type and the four AI tools presented
 * dramatically. Deliberately breaks the light rhythm to add drama. Theme-aware
 * accent via ACCENT; the surface stays dark on every theme for impact.
 */
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/useMobile";
import { ACCENT_HEX, ACCENT_RGB, CTA_PRIMARY_BG } from "@/lib/constants";
import { FileText, ShieldCheck, MessageSquareText, FlaskConical } from "lucide-react";

const TOOLS = [
  { icon: FileText, name: "O&M Manual Compiler", line: "Project data in. CDM-structured manual out — in minutes.", price: "Pay per manual · from £99" },
  { icon: ShieldCheck, name: "RAMS Generator", line: "Method statements and risk assessments, site-ready.", price: "Subscription · from £49/mo" },
  { icon: MessageSquareText, name: "Compliance Co-Pilot", line: "Your HSEQ knowledge, answered instantly in your voice.", price: "Subscription · from £99/mo" },
  { icon: FlaskConical, name: "COSHH Generator", line: "Substance assessments drafted and ready to review.", price: "Pay per use · pricing soon" },
];

export function DarkShowcase() {
  const isMobile = useIsMobile();
  const glow = `radial-gradient(60% 90% at 18% 0%, rgba(${ACCENT_RGB},0.45) 0%, transparent 55%), radial-gradient(55% 80% at 92% 100%, rgba(${ACCENT_RGB},0.30) 0%, transparent 55%)`;

  return (
    <section style={{ position: "relative", overflow: "hidden", background: "#07070B", padding: isMobile ? "72px 20px" : "120px 40px" }}>
      {/* glow layers */}
      <div aria-hidden className="eba-aurora" style={{ position: "absolute", inset: 0, background: glow, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 50% -10%, transparent 60%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1160px", margin: "0 auto" }}>
        <div style={{ maxWidth: "780px", marginBottom: isMobile ? "40px" : "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "'Roboto', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT_HEX, marginBottom: "20px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: ACCENT_HEX, boxShadow: `0 0 12px ${ACCENT_HEX}` }} /> AI tools · ready now
          </div>
          <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2.3rem" : "clamp(2.6rem, 5vw, 4rem)", lineHeight: 1.04, letterSpacing: "-0.025em", color: "#fff", margin: 0 }}>
            The compliance paperwork,{" "}
            <span style={{ background: CTA_PRIMARY_BG, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>done in minutes.</span>
          </h2>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: isMobile ? "15px" : "18px", lineHeight: 1.6, color: "rgba(255,255,255,0.72)", margin: "20px 0 0", maxWidth: "620px" }}>
            Four tools built for M&amp;E contractors — trained on real practice, priced pay-per-use or subscription. You review every output before it goes out.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? "14px" : "18px" }}>
          {TOOLS.map(({ icon: Icon, name, line, price }) => (
            <div key={name} className="eba-glass-card" style={{
              position: "relative",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid rgba(${ACCENT_RGB},0.28)`,
              borderRadius: "18px", padding: isMobile ? "24px 22px" : "28px 28px",
              display: "flex", gap: "18px", alignItems: "flex-start",
            }}>
              <span style={{ width: "48px", height: "48px", borderRadius: "13px", background: CTA_PRIMARY_BG, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 12px 30px -10px rgba(${ACCENT_RGB},0.7)` }}>
                <Icon size={23} color="#fff" strokeWidth={1.9} />
              </span>
              <div>
                <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.25rem", color: "#fff", margin: "0 0 6px" }}>{name}</h3>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14px", lineHeight: 1.55, color: "rgba(255,255,255,0.72)", margin: "0 0 10px" }}>{line}</p>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.02em", color: ACCENT_HEX }}>{price}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: isMobile ? "36px" : "48px" }}>
          <Link href="/ai-tools" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: CTA_PRIMARY_BG, color: "#fff", textDecoration: "none",
            fontFamily: "'Roboto', sans-serif", fontWeight: 800, fontSize: "15px",
            padding: "15px 30px", borderRadius: "12px",
            boxShadow: `0 20px 44px -16px rgba(${ACCENT_RGB},0.7)`,
          }}>
            Explore the AI tools <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
