/**
 * SectionBreaker — a large, full-bleed divider band that announces a new zone of
 * the page (the iHasco rhythm of bold, generously-spaced section intros). A small
 * kicker + an oversized headline with an optional gradient accent word, over a
 * soft tinted / dark / gradient surface with ambient depth. Purely structural.
 */
import { useIsMobile } from "@/hooks/useMobile";
import {
  NAVY, SECTION_TINT, SECTION_GLOW, CTA_DARK_BG, CTA_PRIMARY_BG,
  ACCENT_HEX, ACCENT_RGB, RUST,
} from "@/lib/constants";
import { AmbientOrbs } from "@/components/AmbientOrbs";

type Variant = "tint" | "dark" | "gradient";

export function SectionBreaker({
  kicker,
  title,
  accent,
  after,
  variant = "tint",
}: {
  kicker: string;
  title: string;      // text before the accent word
  accent?: string;    // gradient-highlighted word/phrase
  after?: string;     // text after the accent word
  variant?: Variant;
}) {
  const isMobile = useIsMobile();
  const dark = variant === "dark" || variant === "gradient";
  const textColor = dark ? "#fff" : NAVY;
  const kickerColor = dark ? "#fff" : (variant === "tint" ? RUST : ACCENT_HEX);

  const bg =
    variant === "dark" ? "#07070B" :
    variant === "gradient" ? CTA_DARK_BG :
    SECTION_TINT;

  const accentStyle: React.CSSProperties = dark
    ? { color: "#fff", opacity: 0.96 }
    : { background: CTA_PRIMARY_BG, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" };

  return (
    <section style={{ position: "relative", overflow: "hidden", background: bg, backgroundImage: variant === "tint" ? SECTION_GLOW : undefined, padding: isMobile ? "60px 20px" : "104px 40px" }}>
      {variant === "tint" ? <AmbientOrbs /> : (
        <div aria-hidden className="eba-aurora" style={{ position: "absolute", inset: 0, background: `radial-gradient(55% 90% at 15% 0%, rgba(${ACCENT_RGB},0.4) 0%, transparent 55%), radial-gradient(50% 80% at 90% 100%, rgba(${ACCENT_RGB},0.3) 0%, transparent 55%)`, pointerEvents: "none" }} />
      )}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: kickerColor, marginBottom: "18px" }}>
          · {kicker} ·
        </div>
        <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2.2rem" : "clamp(2.6rem, 5vw, 4.2rem)", lineHeight: 1.05, letterSpacing: "-0.025em", color: textColor, margin: 0 }}>
          {title}{accent ? " " : ""}
          {accent && <span style={accentStyle}>{accent}</span>}
          {after ? ` ${after}` : ""}
        </h2>
      </div>
    </section>
  );
}
