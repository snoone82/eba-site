/**
 * EBA Homepage — The Engineering Business Academy
 * Design: Warm Editorial Authority
 * Palette: approved brand — jet black / white / coral / sky (see constants.ts)
 * Fonts: Poppins (brand typeface)
 */

import { Link } from "wouter";
import {
  ENROL_HREF,
  ENROL_READY,
  ENROL_PENDING_LABEL,
  FORM_ENDPOINT,
  COMPANY_REG,
  PLACES_REMAINING,
  COHORT_SIZE,
  RUST,
  NAVY,
  CREAM,
  OAT,
  WHITE,
  isPlaceholder,
  DARK_GRADIENT, BAND_GRADIENT, CTA_BAND_BG, RUST_RGB, NAVY_RGB, CREAM_RGB,
  IS_VIVID, IS_LIGHT, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT, HERO_GLOW, NAV_RGB, ACCENT_RGB, ACCENT_HEX, ACCENT_GRAD,
  NAV_BAR_BG, NAV_LINK, NAV_LINK_ACTIVE, NAV_BORDER, NAV_CTA_BG, NAV_CTA_TEXT,
  SHOW_TESTIMONIALS,
  METHOD_NAME, COBALT, COBALT_ON_DARK, COBALT_RGB, RUST_ON_DARK,
} from "@/lib/constants";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Testimonials } from "@/components/Testimonials";
import { CaseStudySection } from "@/components/CaseStudySection";
import { Photo } from "@/components/Photo";
import { useIsMobile } from "@/hooks/useMobile";
import { useState, useEffect, useRef } from "react";
import { RoiStatBand } from "@/components/RoiStatBand";
import { ProductFrame } from "@/components/ProductFrame";
import { Seo, PAGE_SEO, ORGANIZATION_JSONLD } from "@/components/Seo";
import { track, getStoredUtm } from "@/lib/track";

// Founder photo (Mark Poulton) — client/public/mark-portrait.jpg.
const MARK_IMG = "/mark-1on1.jpg";

// Defaults to the Academy accent (rust); pass bg for tools sections (cobalt).
function SectionLabel({ children, bg }: { children: string; bg?: string }) {
  return (
    <span style={{
      display: "inline-block",
      background: bg ?? RUST,
      color: "#fff",
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600,
      fontSize: "11px",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "5px 14px",
      marginBottom: "20px",
    }}>
      {children}
    </span>
  );
}


// Oversized register numeral — quiet drawing-office wayfinding on light sections.
function SectionNum({ n }: { n: string }) {
  return (
    <span aria-hidden style={{
      display: "block", fontFamily: "var(--eba-heading)", fontWeight: 700,
      fontSize: "56px", lineHeight: 1, letterSpacing: "-0.02em",
      color: `rgba(${RUST_RGB},0.4)`, marginBottom: "10px",
    }}>
      {n}
    </span>
  );
}

function RustRule() {
  return (
    <div style={{ width: "48px", height: "3px", background: ACCENT_GRAD, borderRadius: "2px", marginBottom: "24px" }} />
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  // MUST default true — see reveal bug; do NOT change to false.
  // Content is visible by default; the fade is additive only. If the observer
  // never fires (prerender/hydration, no IntersectionObserver, reduced-motion),
  // content simply stays visible. This has regressed twice — keep it true.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced-motion and environments without IntersectionObserver — stay visible.
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Start hidden only now that we know JS + observer are available, then reveal on scroll.
    setVisible(false);
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);

    // Safety net: force visible after 400ms regardless, so nothing can stay hidden.
    const failsafe = setTimeout(() => setVisible(true), 400);

    return () => { obs.disconnect(); clearTimeout(failsafe); };
  }, []);

  return { ref, visible };
}

function LeadMagnetForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only treat the form as live once a real endpoint is configured.
  const formReady = !isPlaceholder(FORM_ENDPOINT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          source: "lead-magnet:business-health-check",
          ...getStoredUtm(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      track("lead_health_check_submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again, or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  // Fail safe: no endpoint wired yet — show an honest "coming soon", never a fake success.
  if (!formReady) {
    return (
      <div style={{ background: `rgba(${RUST_RGB},0.1)`, border: `1px solid rgba(${RUST_RGB},0.3)`, padding: "24px 28px" }}>
        <p style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>
          Form coming soon.
        </p>
        <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
          The Engineering Business Health Check sign-up opens shortly.
          {/* TODO(eba): set FORM_ENDPOINT in client/src/lib/constants.ts to enable this form. */}
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ background: `rgba(${RUST_RGB},0.1)`, border: `1px solid rgba(${RUST_RGB},0.3)`, padding: "24px 28px" }}>
        <p style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>
          Check your inbox.
        </p>
        <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
          Your Engineering Business Health Check is on its way to {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <input
        type="text"
        placeholder="Your first name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{
          padding: "13px 16px", border: `1px solid rgba(${NAVY_RGB},0.2)`,
          background: WHITE, fontFamily: "'Poppins', sans-serif", fontSize: "14px",
          color: NAVY, outline: "none", width: "100%", boxSizing: "border-box" as const,
        }}
      />
      <input
        type="email"
        placeholder="Your business email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{
          padding: "13px 16px", border: `1px solid rgba(${NAVY_RGB},0.2)`,
          background: WHITE, fontFamily: "'Poppins', sans-serif", fontSize: "14px",
          color: NAVY, outline: "none", width: "100%", boxSizing: "border-box" as const,
        }}
      />
      {error && (
        <p style={{ color: RUST, fontSize: "13px", margin: 0 }} role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, border: "none", cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px",
          padding: "14px 28px", letterSpacing: "0.04em", opacity: loading ? 0.7 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {loading ? "Sending..." : "Send me the Health Check →"}
      </button>
      <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "12px", margin: 0 }}>
        No spam. Unsubscribe any time. UK GDPR compliant.
      </p>
    </form>
  );
}

function RevealSection({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      ...style,
    }}>
      {children}
    </div>
  );
}

const painPoints = [
  {
    title: "Pricing that doesn't protect you",
    body: "You price to win, not to profit. Variations go unrecovered. Every project costs more than it should and you're too busy delivering to fix it.",
  },
  {
    title: "Cash flow that runs the business, not you",
    body: "Retentions held. Applications late. VAT due before you've been paid. The gap between billing and banking kills good businesses.",
  },
  {
    title: "Contracts you sign without fully reading",
    body: "JCT, NEC, bespoke novation clauses. Most engineering contractors sign what they're given and discover the liability when it's too late.",
  },
  {
    title: "Compliance that consumes your people",
    body: "RAMS, COSHH, O&M manuals, CDM records. The paperwork has become a second job — and it still gets rejected first time.",
  },
  {
    title: "A team you're carrying rather than building",
    body: "You hire fast, train poorly, and end up doing the work yourself. The business grows, but your dependence on it grows faster.",
  },
  {
    title: "A growth ceiling you can't break through",
    body: "You've hit £1m, maybe £2m. Getting to the next level requires systems, strategy, and decisions you've never been taught to make.",
  },
];

// Outcome section — mirrors the six pain points, flipped to the result.
const outcomes = [
  {
    title: "Pricing that protects your margin.",
    body: "You price to profit, not just to win. Variations get recovered. You know your real numbers on every job.",
  },
  {
    title: "Cash that's in the bank before it's owed out.",
    body: "Applications on time, retentions chased, the gap between billing and banking closed.",
  },
  {
    title: "Contracts you understand before you sign.",
    body: "You know your liability going in — not when it's already too late.",
  },
  {
    title: "Compliance that runs in the background.",
    body: "The paperwork stops being a second job. It gets done, it gets accepted, and it doesn't eat your people.",
  },
  {
    title: "A team that carries the work, not you.",
    body: "You hire well, train properly, and step out of the van — and the business holds without you in it.",
  },
  {
    title: "A business you own, not one that owns you.",
    body: "Past the ceiling, with the systems and the freedom to choose what you build next.",
  },
];

const credentials = [
  "15+ Years M&E Group Experience", "UK & Poland",
  "Advanced Manufacturing", "Healthcare", "Clean Energy", "Defence",
];

function HomeNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className="eba-desktop-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: NAV_BAR_BG,
        borderBottom: `1px solid ${NAV_BORDER}`,
        boxShadow: scrolled ? "0 12px 30px -18px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.3s ease",
        padding: 0,
      }}>
        {/* Announce bar */}
        <div style={{ background: CTA_BAND_BG, textAlign: "center", padding: "8px 40px" }}>
          <Link href="/contact" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", color: `rgba(${NAVY_RGB},0.7)`, textDecoration: "none" }}>
            For organisations interested in in-house training for your team, <strong style={{ color: NAVY }}>get in touch →</strong>
          </Link>
        </div>
        <div style={{ padding: "0 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0, marginRight: "24px" }}>
            <EBALogo height={42} light navOnCobalt />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "22px", flexShrink: 0 }}>
            {[
              { label: "Academy", href: "/academy" },
              { label: "AI Tools", href: "/ai-tools" },
              { label: "Documents", href: "/documents" },
              { label: "Mentorship", href: "/mentorship" },
              { label: "Our Story", href: "/our-story" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{
                color: NAV_LINK, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = NAV_LINK_ACTIVE)}
                onMouseLeave={e => (e.currentTarget.style.color = NAV_LINK)}
              >
                {label}
              </Link>
            ))}
            <span>
              <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} style={{
                background: NAV_CTA_BG, color: NAV_CTA_TEXT, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px",
                padding: "9px 20px", letterSpacing: "0.04em", borderRadius: "10px",
                transition: "opacity 0.2s, transform 0.16s",
                display: "inline-block",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                onClick={() => track("cta_join_cohort_nav")}
              >
                {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
              </a>
            </span>
          </div>
        </div>
        </div>
    </nav>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isMobile = useIsMobile();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.home} jsonLd={ORGANIZATION_JSONLD} />
      <MobileNav transparent={true} />
      <HomeNav scrolled={scrolled} />

      {/* ── HERO ── split layout: pitch left, "from the lessons" ledger right.
          A curriculum business shows its lessons the way SaaS shows screens. */}
      <section style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        paddingTop: isMobile ? "104px" : "140px",
        paddingBottom: isMobile ? "56px" : "88px",
        background: "#0E2A25", // fallback so a slow hero image degrades cleanly
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(/mark-teaching.jpg)`,
          backgroundSize: "cover", backgroundPosition: "center 24%",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(100deg, rgba(10,33,29,0.97) 0%, rgba(14,42,37,0.92) 52%, rgba(14,42,37,0.72) 100%)",
        }} />
        <div style={{
          position: "relative", zIndex: 2, width: "100%", maxWidth: "1280px", margin: "0 auto",
          padding: isMobile ? "24px 20px 40px" : "0 40px",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
          gap: isMobile ? "44px" : "72px", alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-block", background: RUST_ON_DARK, color: NAVY,
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "11px",
              letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 16px", marginBottom: "24px",
            }}>
              {ENROL_READY
                ? `FOUNDING COHORT · NOW OPEN · ${PLACES_REMAINING} OF ${COHORT_SIZE} PLACES REMAINING`
                : `FOUNDING COHORT · ENROLMENT OPENS SOON · ${COHORT_SIZE} PLACES ONLY`}
            </div>
            <h1 style={{
              fontFamily: "var(--eba-heading)",
              fontWeight: 700, fontSize: isMobile ? "2.3rem" : "clamp(2.6rem, 4.2vw, 3.7rem)",
              lineHeight: 1.08, letterSpacing: "-0.015em",
              color: "#fff", margin: "0 0 22px", maxWidth: "18ch",
            }}>
              The business programme built for engineering services contractors.
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.88)", fontSize: isMobile ? "16px" : "17.5px", lineHeight: 1.65,
              fontWeight: 300, maxWidth: "560px", margin: "0 0 32px",
            }}>
              You know how to deliver the engineering. Nobody taught you how to run the business around it — pricing, contracts, cash flow, compliance, teams, and growth. That changes here.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "26px" }}>
              <a className="eba-shine eba-lift" href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} style={{
                background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
                padding: "14px 32px", letterSpacing: "0.04em",
                display: "inline-block", borderRadius: "6px",
              }}
                onClick={() => track("cta_join_cohort_hero")}
              >
                {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
              </a>
              <a href="/ai-tools#free-toolbox-talk" style={{
                background: "transparent", color: COBALT_ON_DARK, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                padding: "14px 32px", border: `1.5px solid ${COBALT_ON_DARK}`,
                transition: "background 0.2s", borderRadius: "6px",
                display: "inline-block",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `rgba(${COBALT_RGB},0.14)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                onClick={() => track("cta_free_tool_hero")}
              >
                Try the free Toolbox Talk tool
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 0" }}>
              {["101 Lessons", "10 Modules", "15+ Years M&E Group Experience"].map((stat, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center",
                  color: "rgba(255,255,255,0.72)",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11.5px", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  {i > 0 && <span style={{ margin: "0 13px", color: `rgba(${RUST_RGB},0.9)` }}>·</span>}
                  {stat}
                </span>
              ))}
            </div>
          </div>

          {/* Ledger card — REAL lesson titles from the Kajabi curriculum. */}
          <RevealSection>
            <div style={{ background: WHITE, borderRadius: "14px", overflow: "hidden", boxShadow: "0 40px 80px -40px rgba(0,0,0,0.6)" }}>
              <div style={{ padding: "16px 24px 14px", borderBottom: `1px solid rgba(${NAVY_RGB},0.10)`, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "10.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST }}>
                  From the lessons
                </span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: `rgba(${NAVY_RGB},0.45)` }}>
                  {METHOD_NAME}
                </span>
              </div>
              <div style={{ padding: "8px 24px" }}>
                {[
                  { ref: "Module 03", quote: "If You Need to Micromanage Someone They Must Go" },
                  { ref: "Module 06", quote: "Money Is Made Before You Step on Site" },
                  { ref: "Module 07", quote: "Never Accept 60-Day Terms" },
                  { ref: "Module 09", quote: "My Experience of Going Bust — A Pre-Pack Administration" },
                ].map(({ ref, quote }, i) => (
                  <div key={ref} style={{ padding: "13px 0", borderTop: i > 0 ? `1px solid rgba(${NAVY_RGB},0.08)` : "none" }}>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: RUST, margin: "0 0 3px" }}>{ref}</p>
                    <p style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", fontWeight: 600, fontSize: "15px", lineHeight: 1.4, color: NAVY, margin: 0 }}>
                      “{quote}”
                    </p>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 24px", background: CREAM, borderTop: `1px solid rgba(${NAVY_RGB},0.08)` }}>
                <Link href="/academy" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px", color: RUST, textDecoration: "none" }}
                  onClick={() => track("cta_curriculum_hero_card")}
                >
                  See all 101 lessons →
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── TRUSTED-BY BANNER ── big animated sector marquee */}
      <div style={{ background: BAND_GRADIENT, padding: isMobile ? "26px 0 30px" : "36px 0 42px", borderBottom: `1px solid rgba(${NAVY_RGB},0.08)`, overflow: "hidden" }}>
        <p style={{
          textAlign: "center", margin: isMobile ? "0 20px 18px" : "0 40px 22px",
          fontFamily: "'Poppins', sans-serif", fontSize: "12px",
          fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
          color: `rgba(${NAVY_RGB},0.72)`,
        }}>
          Trusted across
        </p>
        <div className="eba-marquee-mask" style={{ overflow: "hidden" }}>
          <div className="eba-marquee-track" style={{ display: "flex", alignItems: "center", width: "max-content" }}>
            {[0, 1].map(dup => (
              /* [CONFIRM] final sector order with Mark — lead with the three the target buyer most aspires to. */
              ["M&E", "fire suppression & sprinklers", "MOD / MOJ estates", "nuclear", "aerospace", "data centres"].map(sector => (
                <span key={`${dup}-${sector}`} style={{
                  display: "inline-flex", alignItems: "center", whiteSpace: "nowrap",
                  fontFamily: "var(--eba-heading)", fontWeight: 800,
                  fontSize: isMobile ? "1.5rem" : "clamp(1.8rem, 3vw, 2.4rem)",
                  letterSpacing: "-0.01em", color: NAVY,
                }}>
                  <span aria-hidden style={{ color: RUST, margin: isMobile ? "0 18px" : "0 30px", fontWeight: 800 }}>·</span>
                  {sector}
                </span>
              ))
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURE STRIP ── one centred row, three distinct claims (numbers stay in the hero) */}
      <div style={{ background: CREAM, padding: isMobile ? "18px 20px" : "20px 40px", borderBottom: `1px solid rgba(${NAVY_RGB},0.06)` }}>
        <p style={{
          textAlign: "center", margin: 0,
          fontFamily: "'Poppins', sans-serif", fontSize: isMobile ? "11px" : "12.5px",
          fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          color: `rgba(${NAVY_RGB},0.72)`,
        }}>
          Built for engineering business owners
          <span style={{ color: `rgba(${RUST_RGB},0.8)`, margin: "0 14px" }}>·</span>
          Drawn from real operations
          <span style={{ color: `rgba(${RUST_RGB},0.8)`, margin: "0 14px" }}>·</span>
          Lifetime founding access
        </p>
      </div>

      {/* ── THE TRANSFORMATION LEDGER ── pain and outcome merged into six
          before → after rows: the whole argument in one section. */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "84px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionNum n="01" />
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px", maxWidth: "720px", lineHeight: 1.12,
            }}>
              The engineering is not the problem. The business infrastructure around it is.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "17px", fontWeight: 300, lineHeight: 1.65, maxWidth: "620px", margin: "0 0 44px" }}>
              Most engineering business owners are exceptional engineers operating in a system that was never designed for them. Here is where that system leaks — and what it looks like fixed.
            </p>
          </RevealSection>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {painPoints.map((point, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 40}ms` }}>
                <div style={{
                  background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.08)`, borderRadius: "14px",
                  display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 56px 1fr",
                  alignItems: "center", padding: isMobile ? "22px 22px" : "24px 30px",
                  gap: isMobile ? "14px" : "0",
                  boxShadow: "0 16px 36px -30px rgba(0,0,0,0.25)",
                }}>
                  <div>
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.04em", textTransform: "uppercase", color: `rgba(${NAVY_RGB},0.55)`, margin: "0 0 6px" }}>
                      {point.title}
                    </h3>
                    <p style={{ color: `rgba(${NAVY_RGB},0.68)`, fontSize: "14.5px", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{point.body}</p>
                  </div>
                  <span aria-hidden style={{
                    fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "22px", color: RUST,
                    textAlign: "center", transform: isMobile ? "rotate(90deg)" : "none", justifySelf: "center",
                  }}>→</span>
                  <div>
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "0.04em", textTransform: "uppercase", color: RUST, margin: "0 0 6px" }}>
                      {outcomes[i].title}
                    </h3>
                    <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "14.5px", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{outcomes[i].body}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection>
            <p style={{
              fontFamily: "var(--eba-heading)", fontStyle: "italic",
              color: RUST, fontSize: "clamp(1.2rem, 2.3vw, 1.55rem)", fontWeight: 700,
              lineHeight: 1.4, maxWidth: "820px", margin: "44px 0 0",
            }}>
              This is what "engineer your business, design your freedom" actually means. Not a slogan. A different way to run the company you already built.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ── THE ACADEMY ── narrative + the real module register side by side.
          The curriculum IS the product; show it on the homepage. */}
      <section style={{ background: WHITE, padding: isMobile ? "60px 20px" : "92px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 0.95fr", gap: isMobile ? "44px" : "72px", alignItems: "start" }}>
          <RevealSection>
            <SectionNum n="02" />
            <SectionLabel>The Academy</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 700,
              fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 24px", lineHeight: 1.12,
            }}>
              You learned to run jobs. This is where you learn to run the business.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16.5px", fontWeight: 300, lineHeight: 1.75, margin: "0 0 18px" }}>
              Every engineering contractor reaches the same point. The work comes in, the team grows, the turnover climbs — and somehow it gets harder, not easier. Not because you're doing the engineering wrong. Because nobody ever taught you the business that sits underneath it.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16.5px", fontWeight: 300, lineHeight: 1.75, margin: "0 0 18px" }}>
              The Academy teaches {METHOD_NAME}. Half of it is commercial control — pricing, terms, cash, risk. The other half is leadership — culture, teams, and the standards you hold. It teaches both, because Mark ran both.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16.5px", fontWeight: 300, lineHeight: 1.75, margin: "0 0 28px" }}>
              Not generic business theory. Not a coaching framework. The specific operating knowledge of running an engineering business — from someone who has built one at scale.
            </p>
            <Link href="/academy" style={{
              color: RUST, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              letterSpacing: "0.04em", borderBottom: `1.5px solid ${RUST}`, paddingBottom: "2px",
            }}>
              See the curriculum →
            </Link>
            {/* TODO(eba): confirm the £500k–£5m turnover band with Mark before launch. */}
            <p style={{ color: `rgba(${NAVY_RGB},0.62)`, fontSize: "14px", fontWeight: 300, lineHeight: 1.6, margin: "22px 0 0", fontStyle: "italic" }}>
              Built for established engineering services contractors — typically £500k–£5m turnover. If that's you, apply for the founding cohort.
            </p>
          </RevealSection>

          {/* Module register — the REAL curriculum (lesson counts from Kajabi). */}
          <RevealSection>
            <div style={{ background: CREAM, border: `1px solid rgba(${NAVY_RGB},0.10)`, borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid rgba(${NAVY_RGB},0.10)`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "10.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: RUST }}>
                  Module register
                </span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: `rgba(${NAVY_RGB},0.45)` }}>
                  101 lessons
                </span>
              </div>
              <div>
                {[
                  ["01", "The Job of the Leader", 17],
                  ["02", "Culture & Standards", 12],
                  ["03", "Leadership & Building Teams", 15],
                  ["04", "Processes, Procedures & Other Controls", 8],
                  ["05", "Sales, Marketing & Growth Discipline", 8],
                  ["06", "Commercial Controls", 10],
                  ["07", "Financial Control & Cash", 11],
                  ["08", "Risk, Protection & Governance", 8],
                  ["09", "The Dark Side of Business", 5],
                  ["10", "Implementation Toolkit", 7],
                ].map(([num, title, lessons], i) => (
                  <Link key={String(num)} href="/academy" style={{
                    display: "flex", alignItems: "baseline", gap: "14px", textDecoration: "none",
                    padding: "10.5px 24px", borderTop: i > 0 ? `1px solid rgba(${NAVY_RGB},0.07)` : "none",
                    background: num === "09" ? NAVY : "transparent",
                  }}>
                    <span style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "13px", color: num === "09" ? RUST_ON_DARK : RUST, minWidth: "24px" }}>{num}</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "13.5px", color: num === "09" ? "#fff" : NAVY, flex: 1, lineHeight: 1.35 }}>
                      {title}
                      {num === "09" && (
                        <span style={{ marginLeft: "10px", background: RUST_ON_DARK, color: NAVY, fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", verticalAlign: "middle" }}>
                          Rarely taught
                        </span>
                      )}
                    </span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11.5px", fontWeight: 600, color: num === "09" ? `rgba(${CREAM_RGB},0.6)` : `rgba(${NAVY_RGB},0.5)`, whiteSpace: "nowrap" }}>
                      {lessons} lessons
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── FOUNDER CREDIBILITY ── */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <RevealSection>
              <div style={{ position: "relative" }}>
                <Photo
                  src={MARK_IMG}
                  alt="Mark Poulton — CEO, KEYIS Group & Founder, EBA"
                  ratio="4 / 5"
                  focus="center 22%"
                />
                <div style={{
                  position: "absolute", bottom: "16px", left: "16px", zIndex: 2,
                  background: RUST, padding: "12px 18px", borderRadius: "10px",
                }}>
                  <p style={{
                    color: "#fff", fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600, fontSize: "11px", letterSpacing: "0.1em",
                    textTransform: "uppercase", margin: 0,
                  }}>
                    Mark Poulton — CEO, KEYIS Group
                  </p>
                </div>
              </div>
            </RevealSection>
            <RevealSection>
              <SectionLabel>The Founder</SectionLabel>
              <RustRule />
              <h2 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 800,
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em",
                color: ON_DARK, margin: "0 0 24px", lineHeight: 1.1,
              }}>
                Taught by someone who has actually done it — including the hard version.
              </h2>
              <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 20px" }}>
                Mark Poulton built a single M&E firm into a multi-division engineering group with operations across the UK and Poland. He has priced the jobs, signed the contracts, carried the team, met the payroll, and made the decisions that don't appear in any textbook — including rebuilding after a pre-pack and coming back stronger.
              </p>
              <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 20px" }}>
                That's the difference. This isn't business advice from someone who read about your industry. It's operational experience from someone who has run exactly the business you're running — at every stage you're trying to reach.
              </p>
              <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 24px" }}>
                Members get group sessions and direct 1:1 access. Not theory. Not a framework. The person who's been where you're going.
              </p>
              {/* Credential strip */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
                {credentials.map((c) => (
                  <span key={c} style={{
                    background: `rgba(${ON_DARK_RGB},0.08)`, color: `rgba(${CREAM_RGB},0.85)`,
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                    fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "5px 12px",
                  }}>
                    {c}
                  </span>
                ))}
              </div>
              <Link href="/our-story" style={{
                color: RUST_ON_DARK, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                letterSpacing: "0.04em", borderBottom: `1px solid ${RUST_ON_DARK}`,
                paddingBottom: "2px",
              }}>
                Read Mark's full story →
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── hidden until real founding-member quotes exist */}
      {SHOW_TESTIMONIALS && <Testimonials />}

      {/* ── CASE STUDIES ── gated behind SHOW_CASE_STUDIES; renders nothing
          until real, verified member results exist (no invented examples) */}
      <CaseStudySection />

      {/* ── AI TOOLS ── one block + ROI stat band (tools accent = cobalt, product frame not stock photo) */}
      <section style={{ background: WHITE, padding: isMobile ? "56px 20px" : "84px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: isMobile ? "36px" : "72px", alignItems: "center" }}>
            <RevealSection>
              <SectionNum n="03" />
              <SectionLabel bg={COBALT}>AI Tools</SectionLabel>
              <div style={{ width: "48px", height: "3px", background: COBALT, borderRadius: "2px", marginBottom: "24px" }} />
              <h2 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 800,
                fontSize: "clamp(1.7rem, 3vw, 2.3rem)", letterSpacing: "-0.015em",
                color: NAVY, margin: "0 0 18px", lineHeight: 1.15,
              }}>
                And the tools that prove we understand your world.
              </h2>
              {/* TODO(eba): confirm whether the tools are included with Academy membership
                  or priced separately — the pricing page currently says separately. */}
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15.5px", lineHeight: 1.7, margin: "0 0 26px" }}>
                Because we run engineering businesses too, we've built the tools we always wanted: O&M manuals delivered in hours, RAMS in minutes, COSHH and toolbox talks on demand, and a compliance chatbot trained on your own company's safety knowledge.
              </p>
              <Link href="/ai-tools" style={{
                color: COBALT, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                letterSpacing: "0.04em", borderBottom: `1px solid ${COBALT}`, paddingBottom: "2px",
              }}>
                Explore the AI tools →
              </Link>
            </RevealSection>
            <RevealSection>
              <ProductFrame
                url="eba.academy/ai-tools/om-manual"
                docTitle="O&M Manual — Section 4: Mechanical Services"
                docMeta="Project ref · Rev A · CDM 2015 structured"
                lines={["Equipment schedules extracted", "Maintenance intervals compiled", "Commissioning records indexed"]}
              />
            </RevealSection>
          </div>
          {/* Compact ROI band — what the tools actually save */}
          <RevealSection style={{ marginTop: isMobile ? "36px" : "48px" }}>
            <RoiStatBand compact />
          </RevealSection>
        </div>
      </section>

      {/* ── THE THREE PILLARS ── Academy · Documents · Mentorship (mentorship was
          previously absent from the homepage — it is a key differentiator). */}
      <section style={{ background: CREAM, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionNum n="04" />
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 700,
              fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)", letterSpacing: "-0.015em",
              color: NAVY, margin: "0 0 40px", lineHeight: 1.12,
            }}>
              Three assets. One operating system.
            </h2>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "18px" }}>
            {[
              { href: "/academy", stat: "101", unit: "lessons", title: "The Academy", body: "Ten modules of leadership and commercial control, video-led, self-paced, lifetime access.", note: "The founding membership" },
              { href: "/documents", stat: "380", unit: "documents", title: "The Document Library", body: "Every template, form, checklist and procedure a contracting business runs on — Word and PDF.", note: "Included with the +Documents tier" },
              { href: "/mentorship", stat: "1:1", unit: "access", title: "Mentorship", body: "Group sessions and direct access to Mark while you put the system into your business.", note: "Application-only, alongside membership" },
            ].map(({ href, stat, unit, title, body, note }) => (
              <RevealSection key={title}>
                <Link href={href} className="eba-lift" style={{
                  display: "flex", flexDirection: "column", height: "100%", textDecoration: "none",
                  background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.09)`, borderTop: `3px solid ${RUST}`,
                  borderRadius: "14px", padding: "28px 28px",
                  boxShadow: "0 18px 40px -32px rgba(0,0,0,0.3)",
                }}>
                  <p style={{ margin: "0 0 2px" }}>
                    <span style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", fontWeight: 700, fontSize: "2rem", color: RUST }}>{stat}</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: `rgba(${NAVY_RGB},0.5)`, marginLeft: "8px" }}>{unit}</span>
                  </p>
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.2rem", color: NAVY, margin: "0 0 8px" }}>{title}</h3>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontWeight: 300, lineHeight: 1.6, color: `rgba(${NAVY_RGB},0.7)`, margin: "0 0 18px" }}>{body}</p>
                  <span style={{ marginTop: "auto", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: `rgba(${NAVY_RGB},0.55)` }}>{note} →</span>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTOR INSIGHTS ── compact duo (photos live on the detail pages). */}
      <section style={{ background: WHITE, padding: isMobile ? "52px 20px" : "68px 40px", borderTop: `1px solid rgba(${NAVY_RGB},0.08)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionNum n="05" />
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "28px" : "40px", alignItems: "start" }}>
            <RevealSection>
              <div style={{ borderLeft: `3px solid ${RUST}`, paddingLeft: "24px" }}>
                <SectionLabel>Sector Insight</SectionLabel>
                <h2 style={{
                  fontFamily: "var(--eba-heading)", fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)", letterSpacing: "-0.015em",
                  color: NAVY, margin: "0 0 14px", lineHeight: 1.2,
                }}>
                  The biggest opportunity in M&E right now. Are you positioned for it?
                </h2>
                <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", fontWeight: 300, lineHeight: 1.7, margin: "0 0 16px" }}>
                  The UK's decarbonisation agenda is creating the largest sustained flow of M&E work this industry has seen in a generation — heat pumps, solar thermal, social housing retrofit, government-backed contracts worth billions.
                </p>
                {/* [DECIDE with Mark]: reframed as market insight + adjacent-line example —
                    no module claim (real Module 8 = Risk, Protection & Governance). */}
                <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", fontWeight: 300, lineHeight: 1.7, margin: "0 0 20px" }}>
                  Positioning for that work — entering it deliberately, pricing it properly, building it into a durable service line — is the adjacent-line playbook the Academy teaches, drawn from Mark's own move into decarbonisation.
                </p>
                <Link href="/academy" style={{
                  color: RUST, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                  letterSpacing: "0.04em", borderBottom: `1.5px solid ${RUST}`, paddingBottom: "2px",
                }}>
                  View the curriculum →
                </Link>
              </div>
            </RevealSection>
            <RevealSection>
              <div style={{ borderLeft: `3px solid ${RUST}`, paddingLeft: "24px" }}>
                <SectionLabel>Sector Insight</SectionLabel>
                <h2 style={{
                  fontFamily: "var(--eba-heading)", fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)", letterSpacing: "-0.015em",
                  color: NAVY, margin: "0 0 14px", lineHeight: 1.2,
                }}>
                  The £2bn market your clients are already asking you about.
                </h2>
                <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", fontWeight: 300, lineHeight: 1.7, margin: "0 0 16px" }}>
                  Fire protection and security is a common adjacent service request in engineering contracting — a £2bn market growing on post-Grenfell regulation. Most contractors either decline the work or subcontract it blindly.
                </p>
                <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", fontWeight: 300, lineHeight: 1.7, margin: "0 0 20px" }}>
                  The EBA curriculum includes a dedicated module on how to identify, enter, and build a profitable adjacent service line.
                </p>
                {/* Curriculum case study — kept on the funnel, no outbound link to pro-defend.com. */}
                <Link href="/academy" style={{
                  color: RUST, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                  letterSpacing: "0.04em", borderBottom: `1.5px solid ${RUST}`, paddingBottom: "2px",
                }}>
                  See how it's taught →
                </Link>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE ── slim band (full detail lives on /ai-tools + /enterprise). */}
      <section style={{ background: OAT, padding: isMobile ? "44px 20px" : "56px 40px" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr auto",
          gap: isMobile ? "24px" : "48px", alignItems: "center",
        }}>
          <RevealSection>
            <SectionLabel bg={COBALT}>For Companies</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 700,
              fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", letterSpacing: "-0.015em",
              color: NAVY, margin: "0 0 10px", lineHeight: 1.2,
            }}>
              Your own branded compliance assistant, deployed and managed for you.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "15px", fontWeight: 300, lineHeight: 1.65, margin: 0, maxWidth: "640px" }}>
              Trained on your company's HSEQ documents, branded with your identity, available to every engineer on site. Setup £997–£1,997 · from £149/month — a fraction of an agency build.
            </p>
          </RevealSection>
          <RevealSection>
            <Link href="/contact" style={{
              background: COBALT, color: "#fff", textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14.5px",
              padding: "14px 30px", letterSpacing: "0.03em", display: "inline-block", borderRadius: "6px",
              whiteSpace: "nowrap",
            }}
              onClick={() => track("cta_enterprise_enquiry")}
            >
              Enquire about deployment →
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── LEAD MAGNET ── */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "80px 40px", borderTop: `1px solid rgba(${NAVY_RGB},0.08)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <RevealSection>
              <SectionLabel>Free Download</SectionLabel>
              <h2 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
              }}>
                The Engineering Business Health Check.
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 12px" }}>
                20 questions that reveal whether your engineering business is built to last — or built to break under pressure.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14px", lineHeight: 1.65, margin: "0 0 32px" }}>
                Covers pricing discipline, cash flow structure, contract exposure, compliance overhead, team dependency, and growth ceiling. Free. No obligation. Sent directly to your inbox.
              </p>
              <LeadMagnetForm />
            </RevealSection>
            <RevealSection>
              <div style={{ background: DARK_GRADIENT, padding: "40px 36px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { q: "Are you pricing to win, or pricing to profit?" },
                    { q: "Do you know your gross margin on every project?" },
                    { q: "Could your business survive a 90-day payment delay?" },
                    { q: "Have you read every contract you've signed this year?" },
                    { q: "If you stepped away for 4 weeks, what would break?" },
                  ].map(({ q }, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <span style={{ color: RUST_ON_DARK, fontFamily: "var(--eba-heading)", fontStyle: "italic", fontSize: "1.1rem", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{i + 1}.</span>
                      <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{q}</p>
                    </div>
                  ))}
                  <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "12px", margin: "8px 0 0", fontStyle: "italic" }}>...and 15 more in the full guide.</p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── black band per approved mockup A; the full-width brand
          gradient hairline above it is one of the three allowed gradient uses. */}
      <section style={{ position: "relative", background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px", textAlign: "center" }}>
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: ACCENT_GRAD }} />
        <RevealSection>
          <h2 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05,
          }}>
            The founding cohort is open.
          </h2>
          <p style={{
            color: `rgba(${ON_DARK_RGB},0.85)`, fontSize: "18px", lineHeight: 1.65,
            maxWidth: "520px", margin: "0 auto 40px",
          }}>
            Founding members lock in lifetime access at the founding price before it rises — and shape the programme as it's built. Engineering contractors only. Limited places.
          </p>
          {/* Two-track CTA: Academy track = rust primary; Tools track = cobalt outline. */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} style={{
              background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "16px",
              padding: "16px 40px", letterSpacing: "0.04em", display: "inline-block",
              transition: "opacity 0.2s", borderRadius: "6px",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              onClick={() => track("cta_join_cohort_footer")}
            >
              {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
            </a>
            <a href="/ai-tools#free-toolbox-talk" style={{
              background: "transparent", color: "#fff", textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "16px",
              padding: "16px 40px", border: "1.5px solid rgba(255,255,255,0.7)",
              transition: "background 0.2s", borderRadius: "6px", display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              onClick={() => track("cta_free_tool_footer")}
            >
              Try the free Toolbox Talk tool
            </a>
          </div>
        </RevealSection>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
