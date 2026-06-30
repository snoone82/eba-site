/**
 * BentoGrid — a modern "bento" layout of the four EBA pillars (Academy, AI Tools,
 * Document Library, Mentorship) with rounded corners, soft shadows, hover-lift
 * and an animated count-up stat. Theme-aware via the colour tokens.
 */
import { Link } from "wouter";
import { GraduationCap, Sparkles, FileText, Users } from "lucide-react";
import { NAVY, WHITE, RUST, RUST_RGB, NAVY_RGB, CTA_PRIMARY_BG } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useMobile";
import { CountUp } from "@/components/CountUp";

export function BentoGrid() {
  const isMobile = useIsMobile();
  const border = `rgba(${NAVY_RGB},0.10)`;
  const sub = `rgba(${NAVY_RGB},0.62)`;
  const accentSoft = `rgba(${RUST_RGB},0.12)`;

  const Icon = ({ children, span }: { children: React.ReactNode; span?: boolean }) => (
    <span style={{
      width: span ? "52px" : "44px", height: span ? "52px" : "44px",
      borderRadius: "13px", background: span ? CTA_PRIMARY_BG : accentSoft,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{children}</span>
  );

  const Arrow = ({ label }: { label: string }) => (
    <span style={{ marginTop: "auto", paddingTop: "20px", display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: RUST }}>
      {label} <span aria-hidden>→</span>
    </span>
  );

  const card: React.CSSProperties = {
    background: WHITE, border: `1px solid ${border}`, borderRadius: "22px",
    padding: isMobile ? "26px 24px" : "30px 30px", display: "flex", flexDirection: "column",
    textDecoration: "none", color: NAVY,
    boxShadow: "0 18px 40px -28px rgba(0,0,0,0.25)",
  };
  const title: React.CSSProperties = {
    fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.4rem",
    margin: "18px 0 8px", lineHeight: 1.12, letterSpacing: "-0.01em",
  };
  const desc: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif", fontSize: "14.5px", lineHeight: 1.6, color: sub, margin: 0,
  };

  return (
    <section style={{ background: WHITE, padding: isMobile ? "64px 20px" : "104px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ maxWidth: "720px", marginBottom: "44px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RUST, marginBottom: "14px" }}>
            · The EBA System ·
          </div>
          <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2rem" : "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: NAVY, margin: 0 }}>
            Everything an M&amp;E business owner needs, in one place.
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
          gridAutoRows: isMobile ? "auto" : "minmax(190px, auto)",
          gap: "18px",
        }}>
          {/* Academy — large */}
          <Link href="/academy" className="eba-bento-card" style={{ ...card, gridColumn: isMobile ? "auto" : "span 2", gridRow: isMobile ? "auto" : "span 2" }}>
            <Icon span><GraduationCap size={26} color="#fff" strokeWidth={1.9} /></Icon>
            <h3 style={{ ...title, fontSize: isMobile ? "1.6rem" : "2rem" }}>The Academy</h3>
            <p style={desc}>The full operating system for running an M&amp;E business — built from real operations, not theory.</p>
            <div style={{ display: "flex", gap: "32px", marginTop: "26px" }}>
              <div>
                <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: "2.6rem", lineHeight: 1, color: NAVY }}>
                  <CountUp end={101} />
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: sub, marginTop: "6px" }}>Lessons</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: "2.6rem", lineHeight: 1, color: NAVY }}>
                  <CountUp end={10} />
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: sub, marginTop: "6px" }}>Modules</div>
              </div>
            </div>
            <Arrow label="Explore the curriculum" />
          </Link>

          {/* AI Tools — wide */}
          <Link href="/ai-tools" className="eba-bento-card" style={{ ...card, gridColumn: isMobile ? "auto" : "span 2" }}>
            <Icon><Sparkles size={22} color={RUST} strokeWidth={1.9} /></Icon>
            <h3 style={title}>AI Tools</h3>
            <p style={desc}>A compliance chatbot and an O&amp;M manual generator, trained for how M&amp;E actually works.</p>
            <Arrow label="See the tools" />
          </Link>

          {/* Document Library */}
          <Link href="/documents" className="eba-bento-card" style={card}>
            <Icon><FileText size={22} color={RUST} strokeWidth={1.9} /></Icon>
            <h3 style={title}>Document Library</h3>
            <p style={desc}>RAMS, O&amp;M, CDM and compliance templates, ready to use.</p>
            <Arrow label="Browse" />
          </Link>

          {/* Mentorship */}
          <Link href="/mentorship" className="eba-bento-card" style={card}>
            <Icon><Users size={22} color={RUST} strokeWidth={1.9} /></Icon>
            <h3 style={title}>Mentorship</h3>
            <p style={desc}>1:1 guidance with Mark Poulton — limited intakes.</p>
            <Arrow label="Check availability" />
          </Link>
        </div>
      </div>
    </section>
  );
}
