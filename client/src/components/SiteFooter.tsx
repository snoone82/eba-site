/**
 * SiteFooter — shared multi-column footer used on every page.
 * Theme-aware via tokens: dark footer + light text in classic/noir; white footer
 * + dark text in the modern light themes. One source of truth for footer nav.
 */
import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { useIsMobile } from "@/hooks/useMobile";
import {
  DARK_GRADIENT, RUST, RUST_RGB, CREAM_RGB, IS_VIVID, COMPANY_REG, isPlaceholder,
  NAV_BAR_BG, NAV_BORDER, FOOTER_BG,
} from "@/lib/constants";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Academy",
    links: [
      { label: "Curriculum", href: "/academy" },
      { label: "Founding Cohort", href: "/pricing" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "AI Tools",
    links: [
      { label: "O&M Manual", href: "/ai-tools" },
      { label: "Compliance Co-Pilot", href: "/ai-tools" },
      { label: "RAMS Generator", href: "/ai-tools" },
      { label: "Enterprise Deployment", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "Mentorship", href: "/mentorship" },
      { label: "Documents", href: "/documents" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  const isMobile = useIsMobile();
  // Cobalt footer to bookend the cobalt header — white content on the brand fill.
  const heading = "rgba(255,255,255,0.95)";
  const linkCol = "rgba(255,255,255,0.72)";
  const muted = "rgba(255,255,255,0.5)";
  const eyebrow = "rgba(255,255,255,0.65)";

  return (
    <footer style={{ background: FOOTER_BG, borderTop: `1px solid rgba(255,255,255,0.12)`, padding: isMobile ? "48px 20px 28px" : "64px 40px 36px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr 1fr 1fr",
          gap: isMobile ? "36px" : "48px",
          marginBottom: "44px",
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", marginBottom: "18px" }}>
              <EBALogo height={38} light />
            </Link>
            <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "15px", color: heading, margin: "0 0 8px", maxWidth: "300px", lineHeight: 1.4 }}>
              The operating system for M&amp;E business owners.
            </p>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: "13px", color: muted, margin: 0, maxWidth: "300px", lineHeight: 1.6 }}>
              Built by someone who has run one.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.heading}>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: eyebrow, margin: "0 0 16px" }}>
                {col.heading}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                {col.links.map(l => (
                  <Link key={l.label} href={l.href} style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14px", color: linkCol, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = heading)}
                    onMouseLeave={e => (e.currentTarget.style.color = linkCol)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.15)`, paddingTop: "22px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "8px" }}>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: "12px", color: muted, margin: 0 }}>
            © 2026 The Engineering Business Academy. All rights reserved.{!isPlaceholder(COMPANY_REG) && <> Company Reg: {COMPANY_REG}.</>} Registered in England &amp; Wales.
          </p>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: "12px", margin: 0 }}>
            <Link href="/privacy-policy" style={{ color: linkCol, textDecoration: "none" }}>Privacy Policy</Link>
            <span style={{ color: muted, margin: "0 10px" }}>·</span>
            <Link href="/terms" style={{ color: linkCol, textDecoration: "none" }}>Terms &amp; Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
