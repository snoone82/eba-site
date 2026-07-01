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
} from "@/lib/constants";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "The Academy", href: "/academy" },
      { label: "AI Tools", href: "/ai-tools" },
      { label: "Document Library", href: "/documents" },
      { label: "Mentorship", href: "/mentorship" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  const isMobile = useIsMobile();
  const heading = `rgba(${CREAM_RGB},0.92)`;
  const linkCol = `rgba(${CREAM_RGB},0.6)`;
  const muted = `rgba(${CREAM_RGB},0.4)`;

  return (
    <footer style={{ background: DARK_GRADIENT, borderTop: `1px solid rgba(${RUST_RGB},0.3)`, padding: isMobile ? "48px 20px 28px" : "64px 40px 36px" }}>
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
              <EBALogo height={38} light={!IS_VIVID} />
            </Link>
            <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "15px", color: heading, margin: "0 0 8px", maxWidth: "300px", lineHeight: 1.4 }}>
              The operating system for M&amp;E contractors.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: muted, margin: 0, maxWidth: "300px", lineHeight: 1.6 }}>
              The Academy, AI tools and templates — built from 25 years of running a real M&amp;E contracting business.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.heading}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: RUST, margin: "0 0 16px" }}>
                {col.heading}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                {col.links.map(l => (
                  <Link key={l.href} href={l.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: linkCol, textDecoration: "none", transition: "color 0.2s" }}
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
        <div style={{ borderTop: `1px solid rgba(${CREAM_RGB},0.12)`, paddingTop: "22px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "8px" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: muted, margin: 0 }}>
            © 2026 The Engineering Business Academy.{!isPlaceholder(COMPANY_REG) && <> Company Reg: {COMPANY_REG}.</>} Registered in England &amp; Wales.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: muted, margin: 0 }}>
            Built for M&amp;E engineering contractors.
          </p>
        </div>
      </div>
    </footer>
  );
}
