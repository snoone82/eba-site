/**
 * MobileNav — shared hamburger navigation component
 * Design: EBA Warm Editorial Authority
 * Palette: approved brand — jet black / white / coral / sky (see constants.ts)
 * Appears on screens < 768px; desktop nav handles larger viewports.
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { ENROL_HREF, ENROL_READY, ENROL_PENDING_LABEL, NAVY, RUST, RUST_ON_DARK, CREAM, DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB, IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT, NAV_RGB, NAV_BAR_BG, NAV_BORDER } from "@/lib/constants";
import { track } from "@/lib/track";

const NAV_LINKS = [
  { label: "Academy", href: "/academy" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Documents", href: "/documents" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "Our Story", href: "/our-story" },
  { label: "Contact", href: "/contact" },
];

interface MobileNavProps {
  /** Whether the page has a transparent hero nav that transitions on scroll */
  transparent?: boolean;
}

export function MobileNav({ transparent = true }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Track scroll for nav background
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="eba-mobile-nav-bar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "60px", padding: "0 20px",
        background: NAV_BAR_BG,
        borderBottom: `1px solid ${NAV_BORDER}`,
        boxShadow: scrolled || open ? "0 12px 30px -18px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.3s ease",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", minWidth: 0, flexShrink: 1, marginRight: "12px" }}>
          <EBALogo height={32} light navOnCobalt />
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px", display: "flex", flexDirection: "column",
            gap: "5px", alignItems: "flex-end",
          }}
        >
          {/* Three bars that animate to X */}
          <span style={{
            display: "block", height: "2px", background: "#fff",
            width: open ? "24px" : "24px",
            transform: open ? "translateY(7px) rotate(45deg)" : "none",
            transition: "transform 0.25s cubic-bezier(0.23,1,0.32,1)",
            transformOrigin: "center",
          }} />
          <span style={{
            display: "block", height: "2px", background: "#fff",
            width: "18px",
            opacity: open ? 0 : 1,
            transition: "opacity 0.15s ease",
          }} />
          <span style={{
            display: "block", height: "2px", background: "#fff",
            width: open ? "24px" : "24px",
            transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            transition: "transform 0.25s cubic-bezier(0.23,1,0.32,1)",
            transformOrigin: "center",
          }} />
        </button>
      </div>

      {/* ── Full-screen drawer overlay ── */}
      <div className="eba-mobile-drawer" style={{
        position: "fixed", inset: 0, zIndex: 190,
        background: DARK_GRADIENT,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1)",
        display: "flex", flexDirection: "column",
        paddingTop: "80px", paddingBottom: "40px",
        paddingLeft: "32px", paddingRight: "32px",
      }}>
        {/* Accent line (bright coral — on-dark accent) */}
        <div style={{ width: "40px", height: "3px", background: RUST_ON_DARK, marginBottom: "48px" }} />

        {/* Nav links */}
        <nav>
          {NAV_LINKS.map(({ label, href }, i) => (
            <div
              key={label}
              style={{
                transform: open ? "translateX(0)" : "translateX(40px)",
                opacity: open ? 1 : 0,
                transition: `transform 0.4s cubic-bezier(0.23,1,0.32,1) ${i * 60 + 80}ms, opacity 0.4s ease ${i * 60 + 80}ms`,
              }}
            >
              <Link
                href={href}
                style={{
                  display: "block",
                  fontFamily: "var(--eba-heading)",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 8vw, 2.8rem)",
                  color: location === href ? RUST_ON_DARK : (IS_VIVID ? ON_DARK : CREAM),
                  textDecoration: "none",
                  lineHeight: 1.2,
                  marginBottom: "8px",
                  letterSpacing: "-0.02em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = RUST_ON_DARK)}
                onMouseLeave={e => (e.currentTarget.style.color = location === href ? RUST_ON_DARK : (IS_VIVID ? ON_DARK : CREAM))}
              >
                {label}
              </Link>
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div style={{
          marginTop: "auto",
          transform: open ? "translateY(0)" : "translateY(20px)",
          opacity: open ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1) 400ms, opacity 0.4s ease 400ms",
        }}>
          <a
            href={ENROL_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!ENROL_READY || undefined}
            onClick={() => track("cta_join_cohort_nav")}
            style={{
              display: "inline-block",
              background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT,
              textDecoration: "none",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600, fontSize: "15px",
              padding: "14px 32px",
              letterSpacing: "0.04em",
              marginBottom: "24px",
            }}
          >
            {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
          </a>
          <p style={{
            color: `rgba(${CREAM_RGB},0.72)`,
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: 0,
          }}>
            The Engineering Business Academy
          </p>
        </div>
      </div>
    </>
  );
}
