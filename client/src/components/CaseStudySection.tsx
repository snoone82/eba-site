/**
 * CaseStudySection — before/after member case studies (Academy side, rust accent).
 * Gated behind SHOW_CASE_STUDIES in constants.ts and renders nothing until real,
 * verified member results exist — no invented examples, ever. Populate
 * CASE_STUDIES in constants.ts and flip the gate to show it.
 */

import {
  CASE_STUDIES, SHOW_CASE_STUDIES,
  CREAM, NAVY, NAVY_RGB, RUST, RUST_RGB, WHITE,
} from "@/lib/constants";
import { Photo } from "@/components/Photo";
import { useIsMobile } from "@/hooks/useMobile";

export function CaseStudySection() {
  const isMobile = useIsMobile();
  if (!SHOW_CASE_STUDIES || CASE_STUDIES.length === 0) return null;

  return (
    <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <span style={{
          display: "inline-block", background: RUST, color: "#fff",
          fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px",
          letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "5px 14px", marginBottom: "20px",
        }}>
          Member Results
        </span>
        <h2 style={{
          fontFamily: "var(--eba-heading)", fontWeight: 800,
          fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
          color: NAVY, margin: "0 0 48px", lineHeight: 1.1,
        }}>
          What members have done with it.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {CASE_STUDIES.map(cs => (
            <article key={`${cs.name}-${cs.company}`} style={{
              background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.10)`,
              borderTop: `3px solid ${RUST}`, borderRadius: "12px",
              padding: "28px 28px", display: "flex", flexDirection: "column", gap: "18px",
            }}>
              {cs.photo && <Photo src={cs.photo} alt={`${cs.name}, ${cs.company}`} ratio="16 / 9" radius="8px" shadow={false} />}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: `rgba(${NAVY_RGB},0.5)`, margin: "0 0 6px" }}>Before</p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", lineHeight: 1.6, color: `rgba(${NAVY_RGB},0.75)`, margin: 0 }}>{cs.before}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: RUST, margin: "0 0 6px" }}>After</p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", lineHeight: 1.6, color: `rgba(${NAVY_RGB},0.75)`, margin: 0 }}>{cs.after}</p>
                </div>
              </div>
              <blockquote style={{
                margin: 0, padding: "16px 18px",
                background: `rgba(${RUST_RGB},0.06)`, borderLeft: `3px solid ${RUST}`,
                fontFamily: "var(--eba-heading)", fontStyle: "italic",
                fontSize: "15px", lineHeight: 1.6, color: NAVY,
              }}>
                “{cs.quote}”
              </blockquote>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px", color: `rgba(${NAVY_RGB},0.72)`, margin: 0 }}>
                {cs.name} · {cs.company}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
