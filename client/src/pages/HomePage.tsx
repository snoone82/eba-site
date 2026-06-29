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
const TOOLS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/104280767/Hckr7ge87tHNputhSZAfow/eba-tools-hero-7Tmxbyb64azJnSqcMHzLQZ.webp";
const ACADEMY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/104280767/Hckr7ge87tHNputhSZAfow/eba-academy-section-itC8hxihaXFiQ5LKou8GLG.webp";

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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
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
      <div style={{ background: "rgba(163,81,57,0.1)", border: `1px solid rgba(163,81,57,0.3)`, padding: "24px 28px" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>
          Form coming soon.
        </p>
        <p style={{ color: "rgba(27,38,50,0.65)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
          The M&E Business Health Check sign-up opens shortly.
          {/* TODO(eba): set FORM_ENDPOINT in client/src/lib/constants.ts to enable this form. */}
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ background: "rgba(163,81,57,0.1)", border: `1px solid rgba(163,81,57,0.3)`, padding: "24px 28px" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>
          Check your inbox.
        </p>
        <p style={{ color: "rgba(27,38,50,0.65)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
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
          padding: "13px 16px", border: `1px solid rgba(27,38,50,0.2)`,
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
          padding: "13px 16px", border: `1px solid rgba(27,38,50,0.2)`,
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
      <p style={{ color: "rgba(27,38,50,0.4)", fontSize: "12px", margin: 0 }}>
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

const fourProducts = [
  {
    label: "The Academy",
    title: "101 lessons. 10 modules. One business transformation.",
    body: "The most comprehensive M&E business curriculum ever built. From pricing and cash flow to international growth — delivered by someone who has done it, at scale, across multiple businesses.",
    cta: "View the curriculum →",
    href: "/academy",
    img: ACADEMY_IMG,
  },
  {
    label: "AI Tools",
    title: "The tools nobody else has built for M&E.",
    body: "O&M manuals generated in hours. RAMS produced in minutes. A compliance chatbot trained on your company's safety knowledge. Built exclusively for M&E engineering contractors.",
    cta: "See the tools →",
    href: "/ai-tools",
    img: TOOLS_IMG,
  },
  {
    label: "Mentorship",
    title: "Direct access to Mark Poulton.",
    body: "Group sessions and 1:1 access to the CEO of a multi-division M&E engineering group with operations across the UK and Poland. Not theory. Not a coaching framework. Operational experience on demand.",
    cta: "Find out more →",
    href: "/mentorship",
    img: null,
  },
  {
    label: "Documents",
    title: "380 professional documents. Ready to use.",
    body: "25 years of M&E practice, distilled into an immediately deployable document library. Every template, form, checklist and procedure your business needs — in Word and PDF format.",
    cta: "Browse the library →",
    href: "/documents",
    img: null,
  },
];

const aiTools = [
  {
    label: "O&M MANUAL COMPILER",
    title: "O&M Manuals in hours, not days.",
    body: "Upload your project data. The system compiles a fully formatted, client-ready O&M manual — structured to UK CDM requirements — in a fraction of the time it previously took.",
    price: "£150 per manual",
    status: "live",
    href: "/ai-tools/om-manual",
  },
  {
    label: "COMPLIANCE CHATBOT",
    title: "Your company's safety knowledge, on demand.",
    body: "The Compliance Chatbot is trained on your company's HSEQ documentation. Your engineers ask it questions — it answers instantly, accurately, and in your company's voice.",
    price: "From £149/month",
    status: "live",
    href: "/ai-tools/compliance-chatbot",
  },
  {
    label: "RAMS GENERATOR",
    title: "Compliant RAMS in minutes.",
    body: "Select your activity, your hazards, your controls. The RAMS Generator produces a fully formatted, regulation-compliant Risk Assessment and Method Statement ready to submit.",
    price: "Coming Month 1",
    status: "coming",
    href: "/ai-tools",
  },
  {
    label: "TENDER ASSISTANT",
    title: "Win more bids. Lose fewer on price.",
    body: "The Tender Assistant analyses your bid against project requirements, flags commercial risks, and helps you price accurately — without leaving margin on the table.",
    price: "Coming Month 2",
    status: "coming",
    href: "/ai-tools",
  },
  {
    label: "COSHH GENERATOR",
    title: "COSHH assessments in a minute.",
    body: "Chemical substance, task, exposure route — assessed and documented instantly. Produces a compliant, branded PDF ready for the site file. No specialist knowledge required.",
    price: "Coming Month 3",
    status: "coming",
    href: "/ai-tools",
  },
  {
    label: "TOOLBOX TALK GENERATOR",
    title: "Site-specific toolbox talks, weekly.",
    body: "Stop recycling the same generic toolbox talks. Generate site-specific, task-relevant safety briefings in under 60 seconds — with a sign-off sheet included.",
    price: "Coming Month 4",
    status: "coming",
    href: "/ai-tools",
  },
];

const credentials = [
  "KEYIS Group", "Task Energy", "Pro Defend",
  "15 Years M&E Operations", "UK & Poland",
  "Advanced Manufacturing", "Healthcare", "Clean Energy", "Defence",
];

function HomeNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className="hidden md:block eba-desktop-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(27,38,50,0.97)" : "rgba(27,38,50,0.0)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(163,81,57,0.3)` : "none",
        transition: "all 0.3s ease",
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <EBALogo height={42} light={true} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[
              { label: "Academy", href: "/academy" },
              { label: "AI Tools", href: "/ai-tools" },
              { label: "Documents", href: "/documents" },
              { label: "Mentorship", href: "/mentorship" },
              { label: "About", href: "/about" },
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
        alignItems: isMobile ? "flex-start" : "flex-end",
        paddingTop: isMobile ? "80px" : "0",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover", backgroundPosition: "center 30%",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(27,38,50,0.95) 0%, rgba(27,38,50,0.6) 50%, rgba(27,38,50,0.25) 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "24px 20px 60px" : "0 40px 80px" }}>
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
            {/* Stats strip */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: isMobile ? "8px 16px" : "0 32px",
              marginBottom: "28px",
            }}>
              {["101 Lessons", "10 Modules", "15+ Years M&E Group Experience", "UK & International", "Lifetime Founding Access"].map((stat, i) => (
                <span key={i} style={{
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  {i > 0 && !isMobile && <span style={{ marginRight: "32px", color: "rgba(163,81,57,0.6)" }}>·</span>}
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

      {/* ── TRUST STRIP ── */}
      <div style={{ background: OAT, padding: "16px 20px", borderBottom: `1px solid rgba(27,38,50,0.1)` }}>
        <p style={{
          textAlign: "center", margin: 0,
          fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
          fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "rgba(27,38,50,0.55)",
        }}>
          Trusted by M&E contractors working across advanced manufacturing &nbsp;·&nbsp; healthcare &nbsp;·&nbsp; clean energy &nbsp;·&nbsp; data centres &nbsp;·&nbsp; defence
        </p>
      </div>

      {/* ── PAIN POINTS ── */}
      <section style={{ background: NAVY, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: "#fff", margin: "0 0 16px", maxWidth: "720px",
            }}>
              The engineering is not the problem. The business infrastructure around it is.
            </h2>
            <p style={{ color: "rgba(238,233,223,0.6)", fontSize: "17px", lineHeight: 1.65, maxWidth: "560px", margin: "0 0 48px" }}>
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
                  <p style={{ color: "rgba(238,233,223,0.75)", fontSize: "15px", lineHeight: 1.65, margin: 0 }}>
                    {point.body}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUR PRODUCTS ── */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>What we offer</SectionLabel>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px",
            }}>
              Four ways to build a better business.
            </h2>
            <p style={{ color: "rgba(27,38,50,0.65)", fontSize: "17px", lineHeight: 1.65, maxWidth: "560px", margin: "0 0 64px" }}>
              Each product stands alone. Together they form the complete operating system for an M&E contractor.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "2px" }}>
            {fourProducts.map((product, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 80}ms` }}>
                <div style={{
                  background: i % 2 === 0 ? NAVY : OAT,
                  padding: isMobile ? "36px 24px" : "48px 48px",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {product.img && (
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: `url(${product.img})`,
                      backgroundSize: "cover", backgroundPosition: "center",
                      opacity: 0.12,
                    }} />
                  )}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <SectionLabel>{product.label}</SectionLabel>
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif", fontWeight: 800,
                      fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", letterSpacing: "-0.01em",
                      color: i % 2 === 0 ? "#fff" : NAVY, margin: "0 0 16px", lineHeight: 1.2,
                    }}>
                      {product.title}
                    </h3>
                    <p style={{
                      color: i % 2 === 0 ? "rgba(238,233,223,0.75)" : "rgba(27,38,50,0.7)",
                      fontSize: "15px", lineHeight: 1.65, margin: "0 0 32px",
                    }}>
                      {product.body}
                    </p>
                    <Link href={product.href} style={{
                      color: i % 2 === 0 ? "#fff" : NAVY, textDecoration: "none",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                      letterSpacing: "0.04em",
                      borderBottom: `1px solid ${RUST}`, paddingBottom: "2px",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = RUST)}
                      onMouseLeave={e => (e.currentTarget.style.color = i % 2 === 0 ? "#fff" : NAVY)}
                    >
                      {product.cta}
                    </Link>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI TOOLS SPOTLIGHT ── */}
      <section style={{ background: NAVY, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>AI Tools</SectionLabel>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: "#fff", margin: "0 0 16px",
            }}>
              The tools nobody else has built for this industry.
            </h2>
            <p style={{ color: "rgba(238,233,223,0.65)", fontSize: "17px", lineHeight: 1.65, maxWidth: "580px", margin: "0 0 56px" }}>
              We built these because they didn't exist. Every M&E contractor we know was either drowning in paperwork or paying agencies thousands to produce documents that AI can now generate in minutes. The difference: ours are built specifically for M&E.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "2px" }}>
            {aiTools.map((tool, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderLeft: `3px solid ${tool.status === "live" ? RUST : "rgba(163,81,57,0.3)"}`,
                  padding: "32px 28px", display: "flex", flexDirection: "column", height: "100%",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "10px",
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "rgba(238,233,223,0.5)",
                    }}>
                      {tool.label}
                    </span>
                    <span style={{
                      background: tool.status === "live" ? RUST : "rgba(255,255,255,0.1)",
                      color: "#fff", fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700, fontSize: "9px", letterSpacing: "0.1em",
                      textTransform: "uppercase", padding: "3px 8px",
                    }}>
                      {tool.status === "live" ? "LIVE" : "COMING SOON"}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif", fontWeight: 700,
                    fontSize: "1.2rem", color: "#fff", margin: "0 0 12px", lineHeight: 1.3,
                  }}>
                    {tool.title}
                  </h3>
                  <p style={{ color: "rgba(238,233,223,0.7)", fontSize: "14px", lineHeight: 1.65, margin: "0 0 24px", flex: 1 }}>
                    {tool.body}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    <span style={{
                      fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                      color: RUST, fontSize: "14px",
                    }}>
                      {tool.price}
                    </span>
                    {tool.status === "live" && (
                      <Link href={tool.href} style={{
                        color: "#fff", textDecoration: "none",
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
                        letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`,
                        paddingBottom: "1px",
                        transition: "color 0.2s",
                      }}
                        onMouseEnter={e => (e.currentTarget.style.color = RUST)}
                        onMouseLeave={e => (e.currentTarget.style.color = "#fff")}
                      >
                        See how it works →
                      </Link>
                    )}
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection style={{ marginTop: "48px" }}>
            <Link href="/ai-tools" style={{
              color: "rgba(238,233,223,0.7)", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "15px",
              borderBottom: "1px solid rgba(238,233,223,0.3)", paddingBottom: "2px",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(238,233,223,0.7)")}
            >
              View all tools and pricing →
            </Link>
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
                Built by someone who has built it — and rebuilt it.
              </h2>
              <p style={{ color: "rgba(27,38,50,0.75)", fontSize: "16px", lineHeight: 1.75, margin: "0 0 20px" }}>
                Mark Poulton built KEYIS Group from a single M&E business into a multi-division engineering group operating across six UK regions and Poland. Along the way, he scaled through healthcare, advanced manufacturing, clean energy, and data centre sectors.
              </p>
              <p style={{ color: "rgba(27,38,50,0.75)", fontSize: "16px", lineHeight: 1.75, margin: "0 0 20px" }}>
                He navigated a pre-pack administration and came out the other side with something most operators never gain: a complete understanding of what breaks engineering businesses and exactly how to fix them. He then launched Pro Defend — a fire protection and security subsidiary now operating in a £2bn market — and Task Energy, focused on the UK's decarbonisation agenda.
              </p>
              <p style={{ color: "rgba(27,38,50,0.75)", fontSize: "16px", lineHeight: 1.75, margin: "0 0 24px" }}>
                Everything inside EBA comes directly from that operational arc. Not one lesson was written from theory.
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
              <Link href="/about" style={{
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

      {/* ── DECARBONISATION OPPORTUNITY ── */}
      <section style={{ background: OAT, padding: isMobile ? "60px 20px" : "80px 40px", borderTop: `1px solid rgba(27,38,50,0.1)` }}>
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
              <p style={{ color: "rgba(27,38,50,0.75)", fontSize: "16px", lineHeight: 1.75, margin: "0 0 28px" }}>
                The UK's decarbonisation agenda is creating the largest sustained flow of M&E work this industry has seen in a generation. Heat pumps. Solar thermal. Social housing retrofit. Government-backed contracts worth billions — going to the M&E contractors who know how to price, deliver, and document renewable energy installations.
              </p>
              <p style={{ color: "rgba(27,38,50,0.75)", fontSize: "16px", lineHeight: 1.75, margin: "0 0 32px" }}>
                Module 8 of the EBA curriculum covers how to identify, position for, and win this work. It's the only M&E business programme that addresses net zero as a growth strategy.
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
              <p style={{ color: "rgba(27,38,50,0.75)", fontSize: "16px", lineHeight: 1.75, margin: "0 0 28px" }}>
                Fire protection and security is the most common adjacent service request in M&E contracting. The market is worth £2 billion and growing — driven by post-Grenfell regulation and heightened compliance requirements across commercial and industrial sectors.
              </p>
              <p style={{ color: "rgba(27,38,50,0.75)", fontSize: "16px", lineHeight: 1.75, margin: "0 0 32px" }}>
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
                  color: "rgba(27,38,50,0.55)", textDecoration: "none",
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
      <section style={{ background: NAVY, padding: isMobile ? "60px 20px" : "80px 40px" }}>
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
              <p style={{ color: "rgba(238,233,223,0.75)", fontSize: "16px", lineHeight: 1.65, margin: "0 0 32px" }}>
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
                    <p style={{ color: "rgba(238,233,223,0.5)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
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
                <p style={{ color: "rgba(238,233,223,0.5)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                  From the EBA AI Tools Catalogue
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── LEAD MAGNET ── */}
      <section style={{ background: OAT, padding: isMobile ? "60px 20px" : "80px 40px", borderTop: `1px solid rgba(27,38,50,0.1)` }}>
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
              <p style={{ color: "rgba(27,38,50,0.72)", fontSize: "16px", lineHeight: 1.75, margin: "0 0 12px" }}>
                20 questions that reveal whether your M&amp;E business is built to last — or built to break under pressure.
              </p>
              <p style={{ color: "rgba(27,38,50,0.55)", fontSize: "14px", lineHeight: 1.65, margin: "0 0 32px" }}>
                Covers pricing discipline, cash flow structure, contract exposure, compliance overhead, team dependency, and growth ceiling. Free. No obligation. Sent directly to your inbox.
              </p>
              <LeadMagnetForm />
            </RevealSection>
            <RevealSection>
              <div style={{ background: NAVY, padding: "40px 36px" }}>
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
                      <p style={{ color: "rgba(238,233,223,0.75)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{q}</p>
                    </div>
                  ))}
                  <p style={{ color: "rgba(238,233,223,0.35)", fontSize: "12px", margin: "8px 0 0", fontStyle: "italic" }}>...and 15 more in the full guide.</p>
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
            Founding members get lifetime access at the founding price — locked in before it increases. Places are limited.
          </p>
          <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} style={{
            background: NAVY, color: "#fff", textDecoration: "none",
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
      <footer style={{ background: NAVY, borderTop: `1px solid rgba(163,81,57,0.3)`, padding: isMobile ? "48px 20px 32px" : "60px 40px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? "32px" : "48px", marginBottom: "48px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}>
                <EBALogo height={36} light={true} />
              </div>
              <p style={{ color: "rgba(238,233,223,0.5)", fontSize: "14px", lineHeight: 1.65, maxWidth: "280px", margin: 0 }}>
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
                { label: "About Mark", href: "/about" },
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
                      display: "block", color: "rgba(238,233,223,0.72)", textDecoration: "none",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "14px", marginBottom: "10px",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(238,233,223,0.72)")}
                    >
                      {label}
                    </a>
                  ) : (
                    <Link key={`${heading}-${label}`} href={href} style={{
                      display: "block", color: "rgba(238,233,223,0.72)", textDecoration: "none",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "14px", marginBottom: "10px",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(238,233,223,0.72)")}
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
              <p style={{ color: "rgba(238,233,223,0.35)", fontSize: "13px", margin: "0 0 4px" }}>
                © 2026 The Engineering Business Academy. All rights reserved.
              </p>
              <p style={{ color: "rgba(238,233,223,0.25)", fontSize: "12px", margin: 0 }}>
                {!isPlaceholder(COMPANY_REG) && <>Company Reg: {COMPANY_REG} · </>}Registered in England &amp; Wales
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "12px" : "20px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <Link href="/privacy-policy" style={{ color: "rgba(238,233,223,0.35)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(238,233,223,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(238,233,223,0.35)")}>
                  Privacy Policy
                </Link>
                <Link href="/terms" style={{ color: "rgba(238,233,223,0.35)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(238,233,223,0.7)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(238,233,223,0.35)")}>
                  Terms &amp; Conditions
                </Link>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href="https://www.linkedin.com/company/engineering-business-academy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(238,233,223,0.72)", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(238,233,223,0.72)")}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://www.youtube.com/@engineeringbusinessacademy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(238,233,223,0.72)", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(238,233,223,0.72)")}>
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
