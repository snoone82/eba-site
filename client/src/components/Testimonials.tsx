/**
 * Testimonials — social proof from engineering directors who know the operation
 * behind EBA. Theme-aware, editorial cards with an accent quote mark.
 */
import {
  NAVY, CREAM, WHITE, RUST, RUST_RGB, NAVY_RGB, SECTION_GLOW, CTA_PRIMARY_BG,
} from "@/lib/constants";
import { useIsMobile } from "@/hooks/useMobile";

type Quote = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

const QUOTES: Quote[] = [
  {
    quote:
      "Everything in the Academy is how we actually run the business day to day — pricing, contracts, cash flow, compliance. It's not theory off a shelf. If you're technically strong but the commercial side keeps biting you, this closes the gap fast.",
    name: "Garry Williamson",
    role: "Director, KEYIS NW",
    initials: "GW",
  },
  {
    quote:
      "The compliance tools alone save us hours every week — the O&M manuals and RAMS that used to eat evenings now come back in minutes, ready to review. Built by people who've done the work, and it shows.",
    name: "Gareth Whyte",
    role: "Director, Task Energy",
    initials: "GW",
  },
];

export function Testimonials() {
  const isMobile = useIsMobile();
  const border = `rgba(${NAVY_RGB},0.10)`;
  const sub = `rgba(${NAVY_RGB},0.72)`;

  return (
    <section style={{ backgroundColor: CREAM, backgroundImage: SECTION_GLOW, padding: isMobile ? "64px 20px" : "104px 40px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        <div style={{ maxWidth: "680px", marginBottom: isMobile ? "36px" : "48px" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: RUST, marginBottom: "14px" }}>
            · From the operators ·
          </div>
          <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2rem" : "clamp(2.1rem, 4vw, 3rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: NAVY, margin: 0 }}>
            Directors who run engineering businesses with it.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "18px" : "24px" }}>
          {QUOTES.map(({ quote, name, role, initials }) => (
            <figure
              key={name}
              style={{
                background: WHITE, border: `1px solid ${border}`, borderRadius: "20px",
                padding: isMobile ? "28px 24px" : "34px 34px", margin: 0,
                boxShadow: "0 20px 46px -32px rgba(0,0,0,0.28)",
                display: "flex", flexDirection: "column",
              }}
            >
              <span aria-hidden style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: "3.2rem", lineHeight: 0.6, color: `rgba(${RUST_RGB},0.28)`, marginBottom: "18px", display: "block" }}>
                &ldquo;
              </span>
              <blockquote style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? "15.5px" : "17px", lineHeight: 1.65, color: sub, margin: "0 0 26px", flex: 1 }}>
                {quote}
              </blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: "14px", paddingTop: "20px", borderTop: `1px solid ${border}` }}>
                <span style={{
                  width: "46px", height: "46px", borderRadius: "50%", background: CTA_PRIMARY_BG, color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "15px", letterSpacing: "0.02em",
                }}>{initials}</span>
                <span>
                  <span style={{ display: "block", fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "15px", color: NAVY }}>{name}</span>
                  <span style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: `rgba(${NAVY_RGB},0.72)`, marginTop: "2px" }}>{role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
