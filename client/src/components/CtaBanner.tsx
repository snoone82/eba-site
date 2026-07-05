/**
 * CtaBanner — a full-bleed bright gradient call-to-action band, in the spirit of
 * the Citation "Speak to an expert →" strip. Breaks up long white pages with a
 * bold colour block and a single clear action. Theme-aware: the light family
 * gets the signature prism gradient; default/noir fall back to the dark band.
 */
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/useMobile";
import { CTA_DARK_BG, CREAM_RGB, IS_LIGHT } from "@/lib/constants";
import { track } from "@/lib/track";

export function CtaBanner({
  title,
  sub,
  cta,
  href,
  eventName,
}: {
  title: string;
  sub?: string;
  cta: string;
  href: string;
  eventName?: string;
}) {
  const isMobile = useIsMobile();
  const onDark = "#fff";

  return (
    <section style={{ position: "relative", overflow: "hidden", background: CTA_DARK_BG, padding: isMobile ? "48px 20px" : "64px 40px" }}>
      <div style={{
        position: "relative", zIndex: 1, maxWidth: "1120px", margin: "0 auto",
        display: "flex", flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between",
        gap: isMobile ? "24px" : "40px",
      }}>
        <div>
          <h2 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: isMobile ? "1.9rem" : "clamp(2rem, 3.6vw, 2.9rem)",
            lineHeight: 1.08, letterSpacing: "-0.02em", color: onDark, margin: 0,
          }}>
            {title}
          </h2>
          {sub && (
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: isMobile ? "15px" : "17px", lineHeight: 1.6, color: IS_LIGHT ? "rgba(255,255,255,0.9)" : `rgba(${CREAM_RGB},0.8)`, margin: "12px 0 0", maxWidth: "560px" }}>
              {sub}
            </p>
          )}
        </div>
        <Link
          href={href}
          onClick={() => eventName && track(eventName)}
          style={{
            flexShrink: 0, background: "#fff", color: "#111",
            textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 800,
            fontSize: isMobile ? "15px" : "16px", letterSpacing: "0.01em",
            padding: isMobile ? "14px 26px" : "16px 34px", borderRadius: "12px",
            display: "inline-flex", alignItems: "center", gap: "10px",
            boxShadow: "0 18px 40px -20px rgba(0,0,0,0.5)", whiteSpace: "nowrap",
          }}
        >
          {cta} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
