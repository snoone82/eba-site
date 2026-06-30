/**
 * EBA Homepage — The Engineering Business Academy
 * Design: Warm Editorial Authority
 * Palette: Cream #EEE9DF | Navy #1B2632 | Rust #A35139 | Oat #DDD6C8
 * Fonts: Playfair Display (headings) | DM Sans (body)
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
  isPlaceholder,
  DARK_GRADIENT, BAND_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB,
} from "@/lib/constants";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/useMobile";
import { useState, useEffect, useRef } from "react";
import { Seo, PAGE_SEO, ORGANIZATION_JSONLD } from "@/components/Seo";
import { track, getStoredUtm } from "@/lib/track";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/104280767/Hckr7ge87tHNputhSZAfow/eba-hero-bg-kAgYUpyRruMzKNs2oG45FN.webp";
// Founder photo (Mark Poulton) — client/public/mark-portrait.jpg.
const MARK_IMG = "/mark-portrait.jpg";

function SectionLabel({ children }: { children: string }) {
  return (
    <span style={{
      display: "inline-block",
      background: RUST,
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
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

function RustRule() {
  return (
    <div style={{ width: "48px", height: "2px", background: RUST, marginBottom: "24px" }} />
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
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>
          Form coming soon.
        </p>
        <p style={{ color: `rgba(${NAVY_RGB},0.65)`, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
          The M&E Business Health Check sign-up opens shortly.
          {/* TODO(eba): set FORM_ENDPOINT in client/src/lib/constants.ts to enable this form. */}
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ background: `rgba(${RUST_RGB},0.1)`, border: `1px solid rgba(${RUST_RGB},0.3)`, padding: "24px 28px" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>
          Check your inbox.
        </p>
        <p style={{ color: `rgba(${NAVY_RGB},0.65)`, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
          Your M&E Business Health Check is on its way to {email}.
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
          background: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
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
          background: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
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
          background: RUST, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px",
          padding: "14px 28px", letterSpacing: "0.04em", opacity: loading ? 0.7 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {loading ? "Sending..." : "Send me the Health Check →"}
      </button>
      <p style={{ color: `rgba(${NAVY_RGB},0.4)`, fontSize: "12px", margin: 0 }}>
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
    body: "JCT, NEC, bespoke novation clauses. Most M&E contractors sign what they're given and discover the liability when it's too late.",
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
  "KEYIS Group", "Task Energy", "Pro Defend",
  "15 Years M&E Operations", "UK & Poland",
  "Advanced Manufacturing", "Healthcare", "Clean Energy", "Defence",
];

function HomeNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className="eba-desktop-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? `rgba(${NAVY_RGB},0.97)` : `rgba(${NAVY_RGB},0.0)`,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(${RUST_RGB},0.3)` : "none",
        transition: "all 0.3s ease",
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0, marginRight: "24px" }}>
            <EBALogo height={42} light={true} />
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
                color: "rgba(255,255,255,0.8)", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "14px",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              >
                {label}
              </Link>
            ))}
            <span>
              <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} style={{
                background: RUST, color: "#fff", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
                padding: "9px 20px", letterSpacing: "0.04em",
                transition: "opacity 0.2s, transform 0.16s",
                display: "inline-block",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                onClick={() => track("cta_join_cohort_nav")}
              >
                {ENROL_READY ? "Join the Academy →" : ENROL_PENDING_LABEL}
              </a>
            </span>
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
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.home} jsonLd={ORGANIZATION_JSONLD} />
      <MobileNav transparent={true} />
      <HomeNav scrolled={scrolled} />

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        // Top-anchor with padding clearing the fixed nav. flex-end overflowed
        // upward on short viewports, pushing the badge under the nav logo.
        alignItems: "flex-start",
        paddingTop: isMobile ? "96px" : "140px",
        paddingBottom: isMobile ? "48px" : "72px",
        background: DARK_GRADIENT, // fallback so a slow/dead hero image degrades to clean navy, not muddy cream
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover", backgroundPosition: "center 30%",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to top, rgba(${NAVY_RGB},0.95) 0%, rgba(${NAVY_RGB},0.6) 50%, rgba(${NAVY_RGB},0.25) 100%)`,
        }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "1280px", margin: "0 auto", padding: isMobile ? "24px 20px 60px" : "0 40px 80px" }}>
          {/* Badge */}
          <div style={{
            display: "inline-block",
            background: RUST,
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "6px 16px",
            marginBottom: "24px",
          }}>
            FOUNDING COHORT · NOW OPEN · {PLACES_REMAINING} OF {COHORT_SIZE} PLACES REMAINING
          </div>
          <div style={{ maxWidth: "760px" }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900, fontSize: isMobile ? "2.6rem" : "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 1.05, letterSpacing: "-0.02em",
              color: "#fff", margin: "0 0 24px",
            }}>
              The business programme built for M&amp;E engineering contractors.
            </h1>
            {/* Feature strip — one horizontal row, left-aligned to the content column */}
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "center",
              gap: "6px 0", marginBottom: "28px",
            }}>
              {["Built for M&E business owners", "Drawn from real operations", "Lifetime founding access"].map((stat, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center",
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  {i > 0 && <span style={{ margin: "0 16px", color: `rgba(${RUST_RGB},0.6)` }}>·</span>}
                  {stat}
                </span>
              ))}
            </div>
            <p style={{
              color: "rgba(255,255,255,0.82)", fontSize: isMobile ? "16px" : "19px", lineHeight: 1.65,
              fontWeight: 400, maxWidth: "600px", margin: "0 0 40px",
            }}>
              You know how to deliver the engineering. Nobody taught you how to run the business around it — pricing, contracts, cash flow, compliance, teams, and growth. That changes here.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} style={{
                background: RUST, color: "#fff", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
                padding: "14px 32px", letterSpacing: "0.04em",
                transition: "opacity 0.2s",
                display: "inline-block",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                onClick={() => track("cta_join_cohort_hero")}
              >
                {ENROL_READY ? "Join the Founding Cohort →" : ENROL_PENDING_LABEL}
              </a>
              <Link href="/ai-tools" style={{
                background: "transparent", color: "#fff", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
                padding: "14px 32px", border: "1px solid rgba(255,255,255,0.5)",
                transition: "border-color 0.2s",
                display: "inline-block",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
                onClick={() => track("cta_explore_tools_hero")}
              >
                Explore the AI Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── (same content column as every section; smaller + more
            muted than the hero feature strip so the two read as distinct elements) */}
      <div style={{ background: BAND_GRADIENT, padding: isMobile ? "20px 20px" : "26px 40px", borderBottom: `1px solid rgba(${NAVY_RGB},0.1)` }}>
        <p style={{
          maxWidth: "1200px", margin: "0 auto", textAlign: "left",
          fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
          fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          color: `rgba(${NAVY_RGB},0.45)`,
        }}>
          Trusted by M&E contractors working across MOD / MOJ estates &nbsp;·&nbsp; nuclear &nbsp;·&nbsp; aerospace &nbsp;·&nbsp; advanced manufacturing &nbsp;·&nbsp; clean energy &nbsp;·&nbsp; data centres
        </p>
      </div>

      {/* ── PAIN POINTS ── */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: "#fff", margin: "0 0 16px", maxWidth: "720px",
            }}>
              The engineering is not the problem. The business infrastructure around it is.
            </h2>
            <p style={{ color: `rgba(${CREAM_RGB},0.6)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "560px", margin: "0 0 48px" }}>
              Most M&E business owners are exceptional engineers operating in a system that was never designed for them. The result is predictable: excellent work, terrible margins.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))", gap: "2px" }}>
            {painPoints.map((point, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${RUST}`,
                  padding: "28px 28px",
                }}>
                  <h3 style={{
                    color: "#fff", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: "13px", letterSpacing: "0.04em",
                    textTransform: "uppercase", margin: "0 0 10px",
                  }}>
                    {point.title}
                  </h3>
                  <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: "15px", lineHeight: 1.65, margin: 0 }}>
                    {point.body}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE TRANSFORMATION (Academy) ── */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>The Academy</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 28px", lineHeight: 1.12,
            }}>
              You learned to run jobs. This is where you learn to run the business.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.75, margin: "0 0 20px" }}>
              Every M&E contractor reaches the same point. The work comes in, the team grows, the turnover climbs — and somehow it gets harder, not easier. More risk, thinner margins, less of your own time. Not because you're doing the engineering wrong. Because nobody ever taught you the business that sits underneath it.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.75, margin: "0 0 20px" }}>
              The Academy is 101 lessons across 10 modules, built around the decisions you're actually making: how to price so the profit is real, how to read a contract before you sign your liability away, how to get paid on time, how to build a team that runs the work without you in the van, and how to break the ceiling at £1m, £2m and beyond.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.75, margin: "0 0 32px" }}>
              Not generic business theory. Not a coaching framework. The specific operating knowledge of running an M&E business — from someone who has built one at scale.
            </p>
            <Link href="/academy" style={{
              color: RUST, textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
              letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`, paddingBottom: "2px",
            }}>
              See the curriculum →
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── THE OUTCOME ── */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>The Outcome</SectionLabel>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: "#fff", margin: "0 0 16px", lineHeight: 1.1,
            }}>
              What it looks like on the other side.
            </h2>
            <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "620px", margin: "0 0 56px" }}>
              The point isn't more lessons. It's a business that finally works the way it should.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "2px", marginBottom: "48px" }}>
            {outcomes.map((o, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${RUST}`,
                  padding: "28px 28px", height: "100%",
                }}>
                  <h3 style={{
                    color: "#fff", fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: "15px", letterSpacing: "0.01em",
                    margin: "0 0 8px", lineHeight: 1.3,
                  }}>
                    {o.title}
                  </h3>
                  <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                    {o.body}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontStyle: "italic",
              color: RUST, fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", fontWeight: 700,
              lineHeight: 1.4, maxWidth: "820px", margin: 0,
            }}>
              This is what "engineer your business, design your freedom" actually means. Not a slogan. A different way to run the company you already built.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ── MARK / KEYIS CREDIBILITY ── */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <RevealSection>
              <div style={{ position: "relative" }}>
                <img
                  src={MARK_IMG}
                  alt="Mark Poulton — CEO, KEYIS Group & Founder, EBA"
                  style={{ width: "100%", display: "block", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: "-2px", left: "-2px",
                  background: RUST, padding: "14px 20px",
                }}>
                  <p style={{
                    color: "#fff", fontFamily: "'DM Sans', sans-serif",
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
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 24px", lineHeight: 1.1,
              }}>
                Taught by someone who has actually done it — including the hard version.
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 20px" }}>
                Mark Poulton built a single M&E firm into a multi-division engineering group with operations across the UK and Poland. He has priced the jobs, signed the contracts, carried the team, met the payroll, and made the decisions that don't appear in any textbook — including rebuilding after a pre-pack and coming back stronger.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 20px" }}>
                That's the difference. This isn't business advice from someone who read about your industry. It's operational experience from someone who has run exactly the business you're running — at every stage you're trying to reach.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 24px" }}>
                Members get group sessions and direct 1:1 access. Not theory. Not a framework. The person who's been where you're going.
              </p>
              {/* Credential strip */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
                {credentials.map((c) => (
                  <span key={c} style={{
                    background: OAT, color: NAVY,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                    fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "5px 12px",
                  }}>
                    {c}
                  </span>
                ))}
              </div>
              <Link href="/our-story" style={{
                color: RUST, textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`,
                paddingBottom: "2px",
              }}>
                Read Mark's full story →
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── AI TOOLS (reason to believe) ── */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>AI Tools</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: "#fff", margin: "0 0 28px", lineHeight: 1.12,
            }}>
              And the tools that prove we understand your world.
            </h2>
            <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "17px", lineHeight: 1.75, margin: "0 0 32px" }}>
              Because we run M&E businesses too, we've built the tools we always wanted: O&M manuals generated in hours, RAMS in minutes, COSHH and toolbox talks on demand, and a compliance chatbot trained on your own company's safety knowledge. Built exclusively for M&E — and included with Academy membership.
            </p>
            <Link href="/ai-tools" style={{
              color: RUST, textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
              letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`, paddingBottom: "2px",
            }}>
              Explore the AI tools →
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── DOCUMENT LIBRARY ── */}
      <section style={{ background: OAT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>Document Library</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 28px", lineHeight: 1.12,
            }}>
              380 documents. 25 years of practice. Ready to use.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.75, margin: "0 0 32px" }}>
              Every template, form, checklist and procedure an M&E business runs on — in Word and PDF, ready to deploy. Twenty-five years of practice, included with membership.
            </p>
            <Link href="/documents" style={{
              color: RUST, textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
              letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`, paddingBottom: "2px",
            }}>
              Browse the library →
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── DECARBONISATION OPPORTUNITY ── */}
      <section style={{ background: OAT, padding: isMobile ? "60px 20px" : "80px 40px", borderTop: `1px solid rgba(${NAVY_RGB},0.1)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <RevealSection>
              <SectionLabel>Task Energy Insight</SectionLabel>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
              }}>
                The biggest opportunity in M&E right now. Are you positioned for it?
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 28px" }}>
                The UK's decarbonisation agenda is creating the largest sustained flow of M&E work this industry has seen in a generation. Heat pumps. Solar thermal. Social housing retrofit. Government-backed contracts worth billions — going to the M&E contractors who know how to price, deliver, and document renewable energy installations.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 32px" }}>
                Module 8 of the EBA curriculum covers how to identify, position for, and win this work — net zero treated as a growth strategy, not just a compliance cost.
              </p>
              <Link href="/academy" style={{
                color: RUST, textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`,
                paddingBottom: "2px",
              }}>
                View the curriculum →
              </Link>
            </RevealSection>
            <RevealSection>
              <SectionLabel>Pro Defend Insight</SectionLabel>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
              }}>
                The £2bn market your clients are already asking you about.
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 28px" }}>
                Fire protection and security is a common adjacent service request in M&E contracting. The market is worth £2 billion and growing — driven by post-Grenfell regulation and heightened compliance requirements across commercial and industrial sectors.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 32px" }}>
                Most M&E contractors either decline the work or subcontract it blindly. The EBA curriculum includes a dedicated module on business diversification — using Pro Defend as a live case study in how to identify, enter, and build a profitable adjacent service line.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* TODO(eba): confirm Pro Defend / Task Energy public references with Mark.
                    Outbound link repointed to /academy to keep visitors on the funnel. */}
                <Link href="/academy" style={{
                  color: RUST, textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                  letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`,
                  paddingBottom: "2px", display: "inline-block",
                }}>
                  See how Mark built it →
                </Link>
                <Link href="/academy" style={{
                  color: `rgba(${NAVY_RGB},0.55)`, textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px",
                  letterSpacing: "0.03em",
                }}>
                  View the diversification module →
                </Link>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE / WHITE-LABEL ── */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <RevealSection>
              <SectionLabel>For Companies</SectionLabel>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em",
                color: "#fff", margin: "0 0 20px", lineHeight: 1.1,
              }}>
                Your own branded compliance assistant. Deployed and managed for you.
              </h2>
              <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: "16px", lineHeight: 1.65, margin: "0 0 32px" }}>
                We take the compliance chatbot — trained on your company's own documents, procedures, CDM obligations and HSE guidance — and deploy it as a fully managed, branded service for your organisation. Your staff get accurate answers. You get a documented audit trail. We handle the setup, hosting and updates.
              </p>
              <div style={{ display: "flex", gap: "24px", marginBottom: "36px", flexWrap: "wrap" }}>
                {[
                  { value: "£997–£1,997", label: "Setup fee" },
                  { value: "£149–£349", label: "Per month" },
                  { value: "vs £25k+", label: "Agency alternative" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p style={{
                      fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                      color: RUST, fontSize: "1.4rem", fontWeight: 700, margin: "0 0 4px",
                    }}>
                      {value}
                    </p>
                    <p style={{ color: `rgba(${CREAM_RGB},0.5)`, fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/contact" style={{
                background: RUST, color: "#fff", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                onClick={() => track("cta_enterprise_enquiry")}
              >
                Enquire about enterprise deployment →
              </Link>
            </RevealSection>
            <RevealSection>
              <div style={{ background: "rgba(255,255,255,0.05)", borderLeft: `3px solid ${RUST}`, padding: "36px 32px" }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                  color: "#fff", fontSize: "1.1rem", lineHeight: 1.7, margin: "0 0 20px",
                }}>
                  "UK agencies charge £3,000–£25,000 to build custom AI chatbots. We are the accessible, managed end of that market — lower setup, plus a recurring retainer that covers hosting, updates and support."
                </p>
                <p style={{ color: `rgba(${CREAM_RGB},0.5)`, fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                  From the EBA AI Tools Catalogue
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── LEAD MAGNET ── */}
      <section style={{ background: OAT, padding: isMobile ? "60px 20px" : "80px 40px", borderTop: `1px solid rgba(${NAVY_RGB},0.1)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <RevealSection>
              <SectionLabel>Free Download</SectionLabel>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
              }}>
                The M&amp;E Business Health Check.
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 12px" }}>
                20 questions that reveal whether your M&amp;E business is built to last — or built to break under pressure.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.55)`, fontSize: "14px", lineHeight: 1.65, margin: "0 0 32px" }}>
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
                      <span style={{ color: RUST, fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1.1rem", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{i + 1}.</span>
                      <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{q}</p>
                    </div>
                  ))}
                  <p style={{ color: `rgba(${CREAM_RGB},0.35)`, fontSize: "12px", margin: "8px 0 0", fontStyle: "italic" }}>...and 15 more in the full guide.</p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: RUST, padding: isMobile ? "60px 20px" : "100px 40px", textAlign: "center" }}>
        <RevealSection>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: "#fff", margin: "0 0 20px", lineHeight: 1.05,
          }}>
            The founding cohort is open.
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)", fontSize: "18px", lineHeight: 1.65,
            maxWidth: "520px", margin: "0 auto 40px",
          }}>
            Founding members lock in lifetime access at the founding price before it rises — and shape the programme as it's built. M&E contractors only. Limited places.
          </p>
          <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} style={{
            background: DARK_GRADIENT, color: "#fff", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "16px",
            padding: "16px 40px", letterSpacing: "0.04em", display: "inline-block",
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            onClick={() => track("cta_join_cohort_footer")}
          >
            {ENROL_READY ? "Join the founding cohort →" : ENROL_PENDING_LABEL}
          </a>
        </RevealSection>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: DARK_GRADIENT, borderTop: `1px solid rgba(${RUST_RGB},0.3)`, padding: isMobile ? "48px 20px 32px" : "60px 40px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? "32px" : "48px", marginBottom: "48px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}>
                <EBALogo height={36} light={true} />
              </div>
              <p style={{ color: `rgba(${CREAM_RGB},0.5)`, fontSize: "14px", lineHeight: 1.65, maxWidth: "280px", margin: 0 }}>
                The operating system for M&E business owners. Built by someone who has run your business.
              </p>
            </div>
            {[
              { heading: "Academy", links: [
                { label: "Curriculum", href: "/academy" },
                { label: "Founding Cohort", href: ENROL_HREF ?? "/academy", external: ENROL_READY },
                { label: "Pricing", href: "/academy#pricing" },
                { label: "FAQ", href: "/faq" },
              ]},
              { heading: "AI Tools", links: [
                { label: "O&M Manual", href: "/ai-tools/om-manual" },
                { label: "Compliance Chatbot", href: "/ai-tools/compliance-chatbot" },
                { label: "RAMS Generator", href: "/ai-tools" },
                { label: "Enterprise Deployment", href: "/contact" },
              ]},
              { heading: "Company", links: [
                { label: "Our Story", href: "/our-story" },
                { label: "Mentorship", href: "/mentorship" },
                { label: "Documents", href: "/documents" },
                { label: "Contact", href: "/contact" },
              ]},
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                  {heading}
                </p>
                {links.map(({ label, href, external }: { label: string; href: string; external?: boolean }) => (
                  external ? (
                    <a key={`${heading}-${label}`} href={href} target="_blank" rel="noopener noreferrer" style={{
                      display: "block", color: `rgba(${CREAM_RGB},0.72)`, textDecoration: "none",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "14px", marginBottom: "10px",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = `rgba(${CREAM_RGB},0.72)`)}
                    >
                      {label}
                    </a>
                  ) : (
                    <Link key={`${heading}-${label}`} href={href} style={{
                      display: "block", color: `rgba(${CREAM_RGB},0.72)`, textDecoration: "none",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "14px", marginBottom: "10px",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = `rgba(${CREAM_RGB},0.72)`)}
                    >
                      {label}
                    </Link>
                  )
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "12px" : "0" }}>
            <div>
              <p style={{ color: `rgba(${CREAM_RGB},0.35)`, fontSize: "13px", margin: "0 0 4px" }}>
                © 2026 The Engineering Business Academy. All rights reserved.
              </p>
              <p style={{ color: `rgba(${CREAM_RGB},0.25)`, fontSize: "12px", margin: 0 }}>
                {!isPlaceholder(COMPANY_REG) && <>Company Reg: {COMPANY_REG} · </>}Registered in England &amp; Wales
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "12px" : "20px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <Link href="/privacy-policy" style={{ color: `rgba(${CREAM_RGB},0.35)`, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}
                  onMouseEnter={e => (e.currentTarget.style.color = `rgba(${CREAM_RGB},0.7)`)}
                  onMouseLeave={e => (e.currentTarget.style.color = `rgba(${CREAM_RGB},0.35)`)}>
                  Privacy Policy
                </Link>
                <Link href="/terms" style={{ color: `rgba(${CREAM_RGB},0.35)`, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}
                  onMouseEnter={e => (e.currentTarget.style.color = `rgba(${CREAM_RGB},0.7)`)}
                  onMouseLeave={e => (e.currentTarget.style.color = `rgba(${CREAM_RGB},0.35)`)}>
                  Terms &amp; Conditions
                </Link>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href="https://www.linkedin.com/company/engineering-business-academy" target="_blank" rel="noopener noreferrer" style={{ color: `rgba(${CREAM_RGB},0.72)`, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = `rgba(${CREAM_RGB},0.72)`)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://www.youtube.com/@engineeringbusinessacademy" target="_blank" rel="noopener noreferrer" style={{ color: `rgba(${CREAM_RGB},0.72)`, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = `rgba(${CREAM_RGB},0.72)`)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
