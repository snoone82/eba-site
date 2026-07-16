/**
 * SiteFooter — shared multi-column footer used on every page.
 * Theme-aware via tokens: dark footer + light text in classic/noir; white footer
 * + dark text in the modern light themes. One source of truth for footer nav.
 */
import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { useIsMobile } from "@/hooks/useMobile";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import {
  DARK_GRADIENT, RUST, RUST_RGB, CREAM_RGB, IS_VIVID, COMPANY_REG, isPlaceholder,
  NAV_BAR_BG, NAV_BORDER, FOOTER_BG, ACCREDITATIONS, TAGLINE, SOCIAL_LINKS,
} from "@/lib/constants";

// Icon + accessible label per platform, detected from the URL. Renders only
// for links present in SOCIAL_LINKS — never an icon for an account that
// doesn't exist.
function socialMeta(url: string) {
  if (url.includes("facebook.com")) return { Icon: Facebook, label: "Facebook" };
  if (url.includes("instagram.com")) return { Icon: Instagram, label: "Instagram" };
  if (url.includes("youtube.com")) return { Icon: Youtube, label: "YouTube" };
  if (url.includes("linkedin.com")) return { Icon: Linkedin, label: "LinkedIn" };
  return null;
}

// Per Mark's review: the footer must give a complete route around the site —
// Explore mirrors the top navigation (incl. Documents and Mentorship), and
// Contact lives here as the structured enquiry route rather than in the nav.
const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Academy", href: "/academy" },
      { label: "AI Tools", href: "/ai-tools" },
      { label: "Documents", href: "/documents" },
      { label: "Mentorship", href: "/mentorship" },
      { label: "Our Story", href: "/our-story" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Academy",
    links: [
      { label: "Curriculum", href: "/academy" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "AI Tools",
    links: [
      { label: "O&M Manual", href: "/ai-tools" },
      { label: "Compliance Co-Pilot", href: "/ai-tools" },
      { label: "Free Toolbox Talk", href: "/ai-tools" },
      { label: "Enterprise Deployment", href: "/enterprise" },
    ],
  },
];

export function SiteFooter() {
  const isMobile = useIsMobile();
  // Cobalt footer to bookend the cobalt header — white content on the brand fill.
  const heading = "rgba(255,255,255,0.95)";
  const linkCol = "rgba(255,255,255,0.72)";
  const muted = "rgba(255,255,255,0.72)";
  const eyebrow = "rgba(255,255,255,0.75)";

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
              <EBALogo height={46} light />
            </Link>
            {/* The locked tagline — read from constants, never hard-coded. */}
            <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "15px", color: heading, margin: 0, maxWidth: "300px", lineHeight: 1.5 }}>
              {TAGLINE}
            </p>
            {/* Social icons — click-through only (no embedded feeds); renders
                solely from SOCIAL_LINKS so we never link a dead account. */}
            {SOCIAL_LINKS.length > 0 && (
              <div style={{ display: "flex", gap: "14px", marginTop: "20px" }}>
                {SOCIAL_LINKS.map(url => {
                  const meta = socialMeta(url);
                  if (!meta) return null;
                  const { Icon, label } = meta;
                  return (
                    <a key={url} href={url} target="_blank" rel="noopener noreferrer" aria-label={`EBA on ${label}`}
                      style={{
                        width: "38px", height: "38px", borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.18)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        color: "rgba(255,255,255,0.75)", transition: "color 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.heading}>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: eyebrow, margin: "0 0 16px" }}>
                {col.heading}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
                {col.links.map(l => (
                  <Link key={l.label} href={l.href} style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: linkCol, textDecoration: "none", transition: "color 0.2s" }}
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

        {/* Accreditation & membership strip — renders ONLY when ACCREDITATIONS
            is non-empty (never show a badge we don't hold). */}
        {ACCREDITATIONS.length > 0 && (
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.15)`, padding: "22px 0", display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: eyebrow }}>
              Accreditation &amp; membership
            </span>
            {ACCREDITATIONS.map(a => (
              a.url
                ? <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer"><img src={a.logo} alt={a.name} style={{ height: "34px", display: "block", opacity: 0.9 }} loading="lazy" /></a>
                : <img key={a.name} src={a.logo} alt={a.name} style={{ height: "34px", display: "block", opacity: 0.9 }} loading="lazy" />
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.15)`, paddingTop: "22px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "8px" }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: muted, margin: 0 }}>
            © 2026 The Engineering Business Academy. All rights reserved.{!isPlaceholder(COMPANY_REG) && <> Company Reg: {COMPANY_REG}.</>} Registered in England &amp; Wales.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", margin: 0 }}>
            <Link href="/privacy-policy" style={{ color: linkCol, textDecoration: "none" }}>Privacy Policy</Link>
            <span style={{ color: muted, margin: "0 10px" }}>·</span>
            <Link href="/terms" style={{ color: linkCol, textDecoration: "none" }}>Terms &amp; Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
