/**
 * ToolboxLeadMagnet — top-of-funnel teaser block for the free Toolbox Talk
 * Generator, embedded on the AI Tools / homepage. The actual generator (topic
 * + email capture + generation, plus the unlimited Academy-member mode) lives
 * at /toolbox-talk — this section's job is to sell the tool and send the
 * click there. Theme-aware.
 */
import { Link } from "wouter";
import {
  NAVY, CREAM, WHITE, NAVY_RGB,
  COBALT, COBALT_RGB,
  SECTION_GLOW,
} from "@/lib/constants";
import { useIsMobile } from "@/hooks/useMobile";
import { track } from "@/lib/track";
import { Sparkles } from "lucide-react";

function TryItButton() {
  return (
    <Link
      href="/toolbox-talk"
      onClick={() => track("lead_toolbox_generator_click")}
      style={{
        display: "inline-flex", alignItems: "center", gap: "10px",
        background: COBALT, color: "#fff", textDecoration: "none",
        fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
        padding: "14px 28px", letterSpacing: "0.02em",
      }}
    >
      Generate a toolbox talk now →
    </Link>
  );
}

export function ToolboxLeadMagnet() {
  const isMobile = useIsMobile();
  const border = `rgba(${NAVY_RGB},0.10)`;
  const sub = `rgba(${NAVY_RGB},0.62)`;

  return (
    <section id="free-toolbox-talk" style={{ backgroundColor: CREAM, backgroundImage: SECTION_GLOW, padding: isMobile ? "64px 20px" : "96px 40px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr", gap: isMobile ? "40px" : "64px", alignItems: "center" }}>
        {/* Copy + CTA */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: COBALT, marginBottom: "16px" }}>
            <Sparkles size={15} strokeWidth={2} /> Free tool · No purchase
          </div>
          <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2rem" : "clamp(2.1rem, 4vw, 3rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: NAVY, margin: "0 0 18px" }}>
            The free Toolbox Talk Generator.
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: isMobile ? "15px" : "17px", lineHeight: 1.65, color: sub, margin: "0 0 28px", maxWidth: "480px" }}>
            Pick a task, get a site-ready toolbox talk in about a minute — with a sign-off sheet included. Free to use, no card required. Just tell us where to send it. Academy members get the full version included with enrolment.
          </p>
          <TryItButton />
        </div>

        {/* Preview */}
        <div style={{ background: WHITE, border: `1px solid ${border}`, borderRadius: "18px", overflow: "hidden", boxShadow: "0 30px 60px -32px rgba(0,0,0,0.28)" }}>
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: COBALT }} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY }}>Toolbox Talk</span>
          </div>
          <div style={{ padding: "24px 26px" }}>
            <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.2rem", color: NAVY, marginBottom: "4px" }}>Working at Height</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: sub, marginBottom: "18px" }}>Site: __________ · Date: __________ · Ref: TBT-014</div>
            {["Key hazards — falls, dropped objects, fragile surfaces", "Controls — inspected access equipment, edge protection, exclusion zones", "PPE — harness + lanyard where required, hard hat, hi-vis", "Emergency — rescue plan in place before work starts"].map((line, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "4px", background: `rgba(${COBALT_RGB},0.14)`, color: COBALT, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px", fontWeight: 800, marginTop: "2px" }}>✓</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: `rgba(${NAVY_RGB},0.72)`, lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `1px dashed ${border}`, display: "flex", justifyContent: "space-between", fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: `rgba(${NAVY_RGB},0.72)` }}>
              <span>Attendee sign-off ✎</span><span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
