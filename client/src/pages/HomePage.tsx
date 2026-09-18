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
  COBALT, COBALT_ON_DARK, COBALT_RGB, RUST_ON_DARK,
  MARK_PHOTO_HERO, MARK_PHOTO_FOUNDER,
} from "@/lib/constants";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Testimonials } from "@/components/Testimonials";
import { CaseStudySection } from "@/components/CaseStudySection";
import { Photo } from "@/components/Photo";
import { TeachingPanel } from "@/components/TeachingPanel";
import { useIsMobile } from "@/hooks/useMobile";
import { useState, useEffect, useRef } from "react";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ProductFrame } from "@/components/ProductFrame";
import { Seo, PAGE_SEO, ORGANIZATION_JSONLD } from "@/components/Seo";
import { track } from "@/lib/track";

// Founder photography reads from constants — TODO(eba): real-photo swap is
// a constants-only change (see MARK_PHOTO_* in constants.ts).
const MARK_IMG = MARK_PHOTO_FOUNDER;

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

// Business challenge tiles — Mark's amendment schedule (17 Sep 2026), section 5.
// Constructive framing: recognise the challenge, never accuse the reader.
const challenges = [
  {
    title: "Protecting your margin",
    body: "Winning work is only part of the equation. Strong engineering businesses understand their true costs, protect margin, manage variations and make sure every project contributes properly to the business.",
  },
  {
    title: "Better control of cash flow",
    body: "Applications, payment terms, retentions, VAT and project timing can put pressure on even profitable businesses. Better processes and greater visibility give you more control over the cash coming in and going out.",
  },
  {
    title: "Contracts you understand before you sign",
    body: "JCT, NEC and bespoke contracts can create significant commercial risk. Understanding the key clauses, obligations and liabilities before work begins can protect both your margin and your business.",
  },
  {
    title: "Compliance that supports delivery",
    body: "RAMS, COSHH, O&M manuals, CDM requirements and increasing client demands all create workload. The right systems and procedures make compliance easier to manage, repeat and scale.",
  },
  {
    title: "Building a team that doesn't depend on you",
    body: "Growth becomes difficult when every decision still comes back to the owner. Clear roles, stronger leadership, better training and the right processes allow your people to take more responsibility.",
  },
  {
    title: "Building the business for the next stage",
    body: "As an engineering business grows, what worked at the beginning will not always work at the next level. Sustainable growth requires better systems, stronger leadership, commercial discipline and a clear strategy.",
  },
];

// Outcome section — section 10 of the schedule; mirrors the six challenges.
const outcomes = [
  {
    title: "Protecting your margin",
    body: "You understand your true costs, price with greater confidence, manage variations properly and have better visibility of performance across every project.",
  },
  {
    title: "Better control of cash flow",
    body: "Applications go in on time, retentions and outstanding debt are actively managed, and you have greater visibility of the cash coming into and going out of the business.",
  },
  {
    title: "Contracts understood before you commit",
    body: "You understand the key obligations, liabilities and commercial risks before committing to the work, allowing you to make better-informed decisions from the outset.",
  },
  {
    title: "Compliance built into the way you work",
    body: "Clear procedures, responsibilities and documentation make compliance more consistent, repeatable and easier to manage as the business grows.",
  },
  {
    title: "A stronger team with greater ownership",
    body: "Clear roles, better training, stronger leadership and greater accountability allow your people to take more responsibility and reduce the dependence of the business on any one person.",
  },
  {
    title: "A business built for the next stage",
    body: "Better systems, stronger leadership and greater commercial control give you the foundations to grow sustainably and make clearer decisions about what comes next.",
  },
];

// What's Included — section 7. Access labels keep the proposition honest:
// templates are the +Documents tier, tools are priced separately, mentoring
// is application-only. Never imply one membership includes everything.
const included = [
  { title: "100+ Practical Lessons", access: "Academy membership", href: "/academy", cta: "Explore the Full Curriculum",
    body: "Focused, practical lessons covering the commercial, operational and leadership areas that matter when building and growing an engineering business." },
  { title: "Procedures & Templates", access: "Academy + Documents", href: "/documents", cta: "Browse the library",
    body: "Practical procedures, templates and business tools that help turn what you learn into repeatable processes inside your own business." },
  { title: "AI Tools & Agents", access: "Priced separately", href: "/ai-tools", cta: "Explore the AI Tools",
    body: "Practical AI tools designed to save time, improve productivity and help you apply the Academy's knowledge in the day-to-day running of the business." },
  { title: "Mentoring", access: "Application-only", href: "/mentorship", cta: "Explore Mentoring",
    body: "Direct access to real-world business experience to help you work through challenges, decisions and opportunities within your own engineering business." },
];

// Curriculum — section 8. Module names and lesson counts are the real Kajabi
// structure (pulled 3 Sep 2026). Descriptions explain what each module covers.
const curriculum = [
  { n: "01", title: "The Job of the Leader", lessons: 17, body: "Set the direction, define the standards and build a business that relies less on you: goals, values, mentors, leverage and where your time actually goes." },
  { n: "02", title: "Culture & Standards", lessons: 12, body: "Establish the values, standards and communication that shape how your people work, and align the team behind the mission." },
  { n: "03", title: "Leadership & Building Teams", lessons: 15, body: "Plan the structure, find and onboard the right people, develop leaders, run appraisals and 360 reviews, and plan for succession." },
  { n: "04", title: "Processes, Procedures & Other Controls", lessons: 8, body: "Build the procedures, playbook and routine controls that make quality repeatable and the business easier to manage." },
  { n: "05", title: "Sales, Marketing & Growth Discipline", lessons: 8, body: "Understand your sectors and customers, run a disciplined pipeline and CRM, and develop the brand and strategy behind sustainable growth." },
  { n: "06", title: "Commercial Controls", lessons: 10, body: "Understand the commercial principles, processes and controls required to protect margin from estimating through to final account." },
  { n: "07", title: "Financial Control & Cash", lessons: 11, body: "Payment terms, credit control, cash forecasting, management accounts and the financial disciplines that keep a growing business healthy." },
  { n: "08", title: "Risk, Protection & Governance", lessons: 8, body: "Identify and manage business risk: cyber security, service and shareholder agreements, articles of association, labour costs and credit insurance." },
  { n: "09", title: "The Dark Side of Business", lessons: 5, body: "Understand why businesses fail, how to respond when customers do, and the lessons from distressed situations, so you can protect your own." },
  { n: "10", title: "Implementation Toolkit", lessons: 7, body: "Business plans, cash forecasts, audits, board templates and value levers to put the Academy into practice in your own business." },
];

// Company access — section 13.
const companyPoints = [
  { title: "Develop your managers and future leaders", body: "Give your people a broader understanding of how an engineering business works beyond their own role or department." },
  { title: "Build greater commercial awareness", body: "Help teams understand margin, cash flow, contracts, project performance and the commercial impact of the decisions they make." },
  { title: "Create more consistent ways of working", body: "Use the Academy alongside your own procedures and systems to build common standards and better business disciplines across teams." },
  { title: "Reduce dependence on key individuals", body: "Build knowledge deeper into the organisation so that experience, decision-making and responsibility are shared more widely." },
];

const credentials = [
  "Decades of real-world industry experience", "UK & International",
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
        {/* Announce bar removed (Ste, 18 Sep): the logo is the brand feature of
            the header, so the large lockup lives here rather than in the hero. */}
        {/* The bar is fixed, so it shrinks once the page scrolls: the full-size
            lockup at the top, a compact one over the content so the logo never
            sits on top of the page's own text. */}
        <div style={{ padding: "0 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? "72px" : "148px", transition: "height 0.25s ease" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0, marginRight: "24px" }}>
            <EBALogo height={scrolled ? 52 : 118} light navOnCobalt />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "22px", flexShrink: 0 }}>
            {[
              { label: "Academy", href: "/academy" },
              { label: "AI Tools", href: "/ai-tools" },
              { label: "Documents", href: "/documents" },
              { label: "Mentorship", href: "/mentorship" },
              { label: "Pricing", href: "/pricing" },
              { label: "FAQ", href: "/faq" },
              { label: "Our Story", href: "/our-story" },
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
                onClick={() => track("cta_join_academy_nav")}
              >
                {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
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

      {/* ── HERO ── (CIOB style: real photo under a deep navy overlay) */}
      <section style={{
        position: "relative",
        minHeight: isMobile ? "auto" : "600px",
        display: "flex",
        alignItems: "center",
        paddingTop: isMobile ? "108px" : "212px",
        paddingBottom: isMobile ? "56px" : "84px",
        background: "#1B2632", // fallback so a slow hero image degrades to clean navy
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${MARK_PHOTO_HERO})`,
          backgroundSize: "cover", backgroundPosition: "center 24%",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(100deg, rgba(20,28,37,0.95) 0%, rgba(27,38,50,0.82) 48%, rgba(27,38,50,0.45) 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "1280px", margin: "0 auto", padding: isMobile ? "24px 20px 60px" : "0 40px 80px" }}>
          <div style={{ maxWidth: "760px" }}>
            <h1 style={{
              fontFamily: "var(--eba-heading)",
              fontWeight: 800, fontSize: isMobile ? "2.4rem" : "clamp(2.8rem, 4.6vw, 4rem)",
              lineHeight: 1.08, letterSpacing: "-0.015em",
              color: "#fff", margin: "0 0 22px", maxWidth: "20ch",
            }}>
              You know how to deliver on site. Nobody taught you how to build the business around it.
            </h1>
            {/* Stats strip */}
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "center",
              gap: "6px 0", marginBottom: "24px",
            }}>
              {["100+ Lessons", "10 Practical Modules", "Decades of Real-World Industry Experience"].map((stat, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center",
                  color: "rgba(255,255,255,0.78)",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px", fontWeight: 600,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  {i > 0 && <span style={{ margin: "0 14px", color: `rgba(${RUST_RGB},0.9)` }}>·</span>}
                  {stat}
                </span>
              ))}
            </div>
            <p style={{
              color: "rgba(255,255,255,0.88)", fontSize: isMobile ? "16px" : "18px", lineHeight: 1.65,
              fontWeight: 400, maxWidth: "600px", margin: "0 0 36px",
            }}>
              Margin, contracts, cash flow, compliance, people, systems, leadership and growth: practical business knowledge built specifically for engineering and technical services businesses.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <a className="eba-shine eba-lift" href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} style={{
                background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                padding: "14px 32px", letterSpacing: "0.04em",
                display: "inline-block",
              }}
                onClick={() => track("cta_join_academy_hero")}
              >
                {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
              </a>
              <Link href="/academy" style={{
                background: "transparent", color: COBALT_ON_DARK, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                padding: "14px 32px", border: `1.5px solid ${COBALT_ON_DARK}`,
                transition: "background 0.2s, color 0.2s", borderRadius: "6px",
                display: "inline-block",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `rgba(${COBALT_RGB},0.18)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                onClick={() => track("cta_explore_academy_hero")}
              >
                Explore the Academy
              </Link>
            </div>
            {/* Reassurance strip — same three claims already live on /pricing;
                surfaced here because research shows risk-reversal belongs at
                the point of decision, not buried on a page nobody reaches. */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", marginTop: "22px" }}>
              {["14-day money-back guarantee", "Lifetime access to the Academy", "Built from real-world engineering business experience"].map(t => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", fontWeight: 600, color: "rgba(255,255,255,0.72)" }}>
                  <span style={{ color: RUST_ON_DARK, fontWeight: 800 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
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
          Built for engineering and technical services businesses
        </p>
        <div className="eba-marquee-mask" style={{ overflow: "hidden" }}>
          <div className="eba-marquee-track" style={{ display: "flex", alignItems: "center", width: "max-content" }}>
            {[0, 1].map(dup => (
              /* Sector categories — schedule section 3 (17 Sep 2026). */
              ["Mechanical & Electrical", "HVAC, Plumbing & Refrigeration", "Fire & Security", "HV, LV & Power", "Facilities & Maintenance", "Controls & Automation", "Renewables & Energy", "Data & Communications", "Industrial & Specialist Engineering Services"].map(sector => (
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

      {/* ── WHO THE ACADEMY IS FOR ── schedule section 3 */}
      <section style={{ background: WHITE, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>Who it is for</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 22px", lineHeight: 1.12,
            }}>
              Built for engineering and technical services businesses
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.75, margin: "0 0 18px" }}>
              The Engineering Business Academy is for owners and leaders who want stronger commercial control, better procedures, better teams and a business that can continue to grow without becoming increasingly dependent on them.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.75, margin: "0 0 28px" }}>
              Whether you're strengthening the foundations of the business, developing your leadership team or preparing for the next stage of growth, the Academy gives you practical knowledge, systems and tools to help move the business forward.
            </p>
            <Link href="/academy" style={{
              color: RUST, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`, paddingBottom: "2px",
            }}>
              Explore the Academy →
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── THE CHALLENGES ── schedule sections 4 and 5 */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "84px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px", maxWidth: "720px",
            }}>
              The challenges change as the business grows
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "640px", margin: "0 0 14px" }}>
              More projects, more people and more responsibility bring a different set of challenges. As the business grows, margin, cash flow, contracts, compliance, people, systems and leadership all require greater control.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "640px", margin: "0 0 48px" }}>
              The strongest engineering businesses build their commercial, operational and leadership capability alongside their technical capability.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
            {challenges.map((point, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="eba-bento-card" style={{
                  height: "100%",
                  background: WHITE,
                  border: `1px solid rgba(${ACCENT_RGB},0.18)`,
                  borderLeft: `3px solid ${ACCENT_HEX}`,
                  borderRadius: "16px",
                  boxShadow: "0 20px 44px -30px rgba(0,0,0,0.25)",
                  padding: "28px 28px",
                }}>
                  <h3 style={{
                    color: NAVY, fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700, fontSize: "13px", letterSpacing: "0.04em",
                    textTransform: "uppercase", margin: "0 0 10px",
                  }}>
                    {point.title}
                  </h3>
                  <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15px", lineHeight: 1.65, margin: 0 }}>
                    {point.body}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE TRANSFORMATION (Academy) ── */}
      <section style={{ background: WHITE, padding: isMobile ? "60px 20px" : "96px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>The Academy</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 28px", lineHeight: 1.12,
            }}>
              You know how to deliver on site. This is where you learn to build the business around it.
            </h2>
            {[
              "As an engineering business grows, the challenges change. More people, more projects, more responsibility, more commercial risk and more pressure on your time.",
              "The technical knowledge that helped you build the business will only take you so far. The next stage requires stronger commercial thinking, better systems, better leadership and a clearer understanding of how every part of the business works together.",
              "The Engineering Business Academy brings that knowledge into one place, with 100+ practical lessons covering pricing, contracts, cash flow, compliance, people, systems, leadership, strategy and growth.",
              "It is built around the real decisions engineering business owners and leaders make every day: how to protect margin, manage commercial risk, improve cash flow, build stronger teams, create better systems and grow a business that is less dependent on you.",
              "This is not generic business theory. It is practical, real-world knowledge built specifically for engineering and technical services businesses, based on the lessons, systems and experience gained from building and scaling engineering businesses in the real world.",
            ].map((para, i, arr) => (
              <p key={i} style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.75, margin: i === arr.length - 1 ? "0 0 32px" : "0 0 20px" }}>
                {para}
              </p>
            ))}
            <Link href="/academy" style={{
              color: RUST, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`, paddingBottom: "2px",
            }}>
              Explore the Academy →
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── schedule section 7 */}
      <section id="whats-included" style={{ background: CREAM, padding: isMobile ? "60px 20px" : "88px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>What's included</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 14px", lineHeight: 1.12, maxWidth: "720px",
            }}>
              Practical learning you can put to work in the business
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "640px", margin: "0 0 40px" }}>
              The Academy is designed to help you not only understand what good looks like, but put it into practice in your own business.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "18px" }}>
            {included.map((item, i) => (
              <RevealSection key={item.title} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="eba-bento-card" style={{
                  height: "100%", background: WHITE, borderRadius: "16px",
                  border: `1px solid rgba(${NAVY_RGB},0.08)`, boxShadow: "0 20px 44px -30px rgba(0,0,0,0.25)",
                  padding: "28px 28px", display: "flex", flexDirection: "column",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                    <h3 style={{ color: NAVY, fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.01em", margin: 0 }}>{item.title}</h3>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: RUST, background: `rgba(${RUST_RGB},0.10)`, padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap" }}>{item.access}</span>
                  </div>
                  <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15px", lineHeight: 1.65, margin: "0 0 18px" }}>{item.body}</p>
                  <Link href={item.href} style={{ marginTop: "auto", color: RUST, textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "0.03em" }}>
                    {item.cta} →
                  </Link>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── schedule section 8. Real module names and lesson counts. */}
      <section style={{ background: WHITE, padding: isMobile ? "60px 20px" : "88px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>The curriculum</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 14px", lineHeight: 1.12,
            }}>
              100+ lessons across 10 practical modules
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "680px", margin: "0 0 40px" }}>
              A practical business curriculum built around the decisions engineering business owners and leaders actually make, from winning and delivering profitable work to building the people, systems and strategy required for growth.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "2px" }}>
            {curriculum.map((m, i) => (
              <RevealSection key={m.n} style={{ transitionDelay: `${i * 40}ms` }}>
                <div style={{ background: CREAM, border: `1px solid rgba(${NAVY_RGB},0.08)`, padding: "22px 24px", height: "100%", display: "grid", gridTemplateColumns: "56px 1fr", gap: "16px" }}>
                  <span style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.8rem", color: RUST, lineHeight: 1, letterSpacing: "-0.03em" }}>{m.n}</span>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline", flexWrap: "wrap", marginBottom: "6px" }}>
                      <h3 style={{ color: NAVY, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15.5px", margin: 0 }}>{m.title}</h3>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 600, color: `rgba(${NAVY_RGB},0.55)`, whiteSpace: "nowrap" }}>{m.lessons} lessons</span>
                    </div>
                    <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14.5px", lineHeight: 1.6, margin: 0 }}>{m.body}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection style={{ marginTop: "32px" }}>
            <Link href="/academy" style={{
              background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              padding: "14px 32px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
            }} onClick={() => track("cta_explore_curriculum_home")}>
              Explore the Full Curriculum
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── WHY THIS IS DIFFERENT ── schedule section 16: explain what it is, never attack alternatives. */}
      <section style={{ background: OAT, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.7rem, 3vw, 2.3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 14px", lineHeight: 1.12,
            }}>
              Built specifically for engineering businesses
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16.5px", lineHeight: 1.7, maxWidth: "720px", margin: "0 0 32px" }}>
              The challenges of running an engineering business are different. Projects, applications, retentions, variations, contracts, compliance, labour, subcontractors and cash flow all interact. The Academy is built around that reality.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "18px" }}>
            {[
              { title: "Practical, not theoretical", body: "The lessons focus on real decisions, processes and challenges faced by engineering business owners and leaders." },
              { title: "Built from experience", body: "The content comes from practical experience building and scaling engineering businesses, not generic business theory adapted for the sector." },
              { title: "Designed to be applied", body: "The aim is not simply to learn more. It is to take what you learn and use it to improve the way your own business operates." },
            ].map((d, i) => (
              <RevealSection key={d.title} style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{ background: WHITE, borderTop: `3px solid ${RUST}`, padding: "24px 24px", height: "100%", borderRadius: "10px" }}>
                  <h3 style={{ color: NAVY, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px", margin: "0 0 8px" }}>{d.title}</h3>
                  <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14.5px", lineHeight: 1.6, margin: 0 }}>{d.body}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE OUTCOME ── schedule section 10 */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "96px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>The Outcome</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px", lineHeight: 1.1,
            }}>
              What better looks like in the business.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "620px", margin: "0 0 56px" }}>
              The value isn't simply in completing lessons. It's in applying what you learn to build a stronger, better-run and more scalable engineering business.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "2px", marginBottom: "48px" }}>
            {outcomes.map((o, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{
                  background: WHITE, borderLeft: `3px solid ${RUST}`, border: `1px solid rgba(${NAVY_RGB},0.08)`, borderLeftWidth: "3px", borderLeftColor: RUST,
                  padding: "28px 28px", height: "100%",
                }}>
                  <h3 style={{
                    color: NAVY, fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700, fontSize: "15px", letterSpacing: "0.01em",
                    margin: "0 0 8px", lineHeight: 1.3,
                  }}>
                    {o.title}
                  </h3>
                  <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                    {o.body}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
          <RevealSection>
            <p style={{
              fontFamily: "var(--eba-heading)", fontStyle: "italic",
              color: RUST, fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", fontWeight: 700,
              lineHeight: 1.4, maxWidth: "820px", margin: 0,
            }}>
              The aim is a stronger, more profitable and better-run engineering business, with greater control, clearer systems, stronger people and less dependence on the owner.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ── FOUNDER CREDIBILITY ── */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <RevealSection>
              <div style={{ position: "relative" }}>
                {/* Stock portraiture retired 5 Aug — see MARK_PHOTO_* in constants.
                    The slot now carries the substance instead of a stranger's face. */}
                <TeachingPanel
                  kicker="Who teaches it"
                  heading="Built from real-world engineering business experience."
                  attribution="Mark Poulton — CEO, KEYIS Group · Founder, The Engineering Business Academy"
                  rows={[
                    // Schedule section 11 (17 Sep 2026). Mark's preferred "UK + International".
                    { figure: "10", label: "Practical modules covering the commercial, operational and leadership areas of an engineering business" },
                    { figure: "100+", label: "Practical lessons built from real decisions, challenges and experience gained in engineering businesses" },
                    { figure: "UK + International", label: "Experience building and leading engineering businesses across multiple divisions and international operations" },
                  ]}
                  onDark
                />
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
                Built from real-world engineering business experience.
              </h2>
              <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 20px" }}>
                The Academy is based on Mark's experience of building, leading and scaling engineering businesses in the real world. The lessons come from the decisions, challenges, systems and processes involved in growing engineering businesses, including what has worked, what hasn't, and what has been learned along the way.
              </p>
              <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 24px" }}>
                Mentoring runs alongside the Academy: direct access to real-world business experience to help you work through challenges, decisions and opportunities within your own engineering business.
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
              <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
                <Link href="/our-story" style={{
                  color: RUST_ON_DARK, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                  letterSpacing: "0.04em", borderBottom: `1px solid ${RUST_ON_DARK}`,
                  paddingBottom: "2px",
                }}>
                  Read Mark's full story →
                </Link>
                <Link href="/mentorship" style={{
                  color: RUST_ON_DARK, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                  letterSpacing: "0.04em", borderBottom: `1px solid ${RUST_ON_DARK}`,
                  paddingBottom: "2px",
                }}>
                  Explore Mentoring →
                </Link>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── LESSON PREVIEW ── schedule section 9. Real, published Module 6 lesson
          (Kajabi 2198350627), chosen for a practical, constructive subject:
          margin protected through preparation. Copy is drawn from the real
          lesson description, not invented. */}
      <section id="preview-lesson" style={{ background: WHITE, padding: isMobile ? "60px 20px" : "96px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr", gap: isMobile ? "32px" : "64px", alignItems: "center" }}>
            <RevealSection>
              <SectionLabel>Watch a lesson from the Academy</SectionLabel>
              <RustRule />
              <h2 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 800,
                fontSize: "clamp(1.7rem, 3vw, 2.3rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 18px", lineHeight: 1.15,
              }}>
                Money is made before you step on site.
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15.5px", lineHeight: 1.75, margin: "0 0 14px" }}>
                See exactly what to expect inside The Engineering Business Academy. Watch one of the practical lessons and get a feel for the content, approach and level of detail.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15.5px", lineHeight: 1.75, margin: "0 0 24px" }}>
                From Module 6, Commercial Controls: why margin is protected through design, planning, procurement, labour selection and preparation before the job begins, rather than recovered during delivery.
              </p>
              <a href="#preview-lesson-video" style={{
                background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                padding: "14px 32px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
              }} onClick={() => track("cta_watch_lesson_home")}>
                Watch the Lesson
              </a>
            </RevealSection>
            <RevealSection>
              <div id="preview-lesson-video">
                <VideoEmbed wistiaId="dqmf23wn6f" title="Money Is Made Before You Step on Site" />
              </div>
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
              <SectionLabel bg={COBALT}>AI Tools</SectionLabel>
              <div style={{ width: "48px", height: "3px", background: COBALT, borderRadius: "2px", marginBottom: "24px" }} />
              <h2 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 800,
                fontSize: "clamp(1.7rem, 3vw, 2.3rem)", letterSpacing: "-0.015em",
                color: NAVY, margin: "0 0 18px", lineHeight: 1.15,
              }}>
                Practical AI tools built for engineering businesses
              </h2>
              {/* Schedule section 12. Tools are priced separately from Academy
                  membership. The second paragraph names the tools that actually
                  exist rather than generic capabilities. */}
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15.5px", lineHeight: 1.7, margin: "0 0 16px" }}>
                Use AI to save time, improve productivity and put better business processes into practice. The Academy's AI tools are designed around the real tasks engineering business owners and leaders deal with every day.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15.5px", lineHeight: 1.7, margin: "0 0 16px" }}>
                From RAMS, COSHH assessments and toolbox talks to O&M manuals and a compliance co-pilot trained on your own company's documents, the aim is simple: help your people work more efficiently and make better use of the knowledge inside the Academy.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.62)`, fontSize: "14.5px", lineHeight: 1.65, margin: "0 0 26px", fontStyle: "italic" }}>
                AI should make good people more productive, not replace the judgement, experience and accountability required to run an engineering business.
              </p>
              <Link href="/ai-tools" style={{
                color: COBALT, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                letterSpacing: "0.04em", borderBottom: `1px solid ${COBALT}`, paddingBottom: "2px",
              }}>
                Explore the AI Tools →
              </Link>
            </RevealSection>
            <RevealSection>
              <ProductFrame
                url="teb-academy.com/ai-tools/om-manual"
                docTitle="O&M Manual — Section 4: Mechanical Services"
                docMeta="Project ref · Rev A · CDM 2015 structured"
                lines={["Equipment schedules extracted", "Maintenance intervals compiled", "Commissioning records indexed"]}
                chip="Compiled · back in 24h"
              />
            </RevealSection>
          </div>

        </div>
      </section>

      {/* ── DOCUMENT LIBRARY ── */}
      <section style={{ background: CREAM, padding: isMobile ? "52px 20px" : "72px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>Document Library</SectionLabel>
            <RustRule />
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.7rem, 3vw, 2.3rem)", letterSpacing: "-0.015em",
              color: NAVY, margin: "0 0 18px", lineHeight: 1.15,
            }}>
              380 documents. Built from real practice. Ready to use.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15.5px", lineHeight: 1.7, margin: "0 0 26px", maxWidth: "640px" }}>
              Every template, form, checklist and procedure an engineering business runs on, in Word and PDF, ready to adapt and deploy. Drawn from decades of real-world industry experience and included with Academy + Documents membership.
            </p>
            <Link href="/documents" style={{
              color: RUST, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
              letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`, paddingBottom: "2px",
            }}>
              Browse the library →
            </Link>
          </RevealSection>
        </div>
      </section>


      {/* ── ENTERPRISE / WHITE-LABEL ── */}
      <section style={{ background: OAT, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <RevealSection>
              <SectionLabel bg={COBALT}>Company access</SectionLabel>
              <h2 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
              }}>
                Bring the Academy into your engineering business
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.65, margin: "0 0 16px" }}>
                The Engineering Business Academy isn't only for individual owners and leaders. It can also be used across your business to develop managers, strengthen future leaders and build greater commercial and operational understanding throughout your team.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.65, margin: "0 0 32px" }}>
                Give your people access to the same practical knowledge, tools and ways of working, helping create greater consistency across the business and reducing the reliance on knowledge sitting with only a few individuals.
              </p>
              <Link href="/enterprise" style={{
                background: COBALT, color: "#fff", textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                onClick={() => track("cta_company_access_home")}
              >
                Explore Company Access →
              </Link>
            </RevealSection>
            <RevealSection>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {companyPoints.map(cp => (
                  <div key={cp.title} style={{ background: WHITE, borderLeft: `3px solid ${COBALT}`, padding: "18px 22px", borderRadius: "8px" }}>
                    <h3 style={{ color: NAVY, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14.5px", margin: "0 0 6px" }}>{cp.title}</h3>
                    <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{cp.body}</p>
                  </div>
                ))}
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
            Build a stronger business around the engineering.
          </h2>
          <p style={{
            color: `rgba(${ON_DARK_RGB},0.85)`, fontSize: "18px", lineHeight: 1.65,
            maxWidth: "520px", margin: "0 auto 40px",
          }}>
            Get the practical knowledge, systems and tools to strengthen your commercial control, improve your operations, develop your people and build a business capable of sustainable growth.
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
              onClick={() => track("cta_join_academy_footer")}
            >
              {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
            </a>
            <a href="#whats-included" style={{
              background: "transparent", color: "#fff", textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "16px",
              padding: "16px 40px", border: "1.5px solid rgba(255,255,255,0.7)",
              transition: "background 0.2s", borderRadius: "6px", display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              onClick={() => track("cta_whats_included_footer")}
            >
              Explore What's Included
            </a>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", justifyContent: "center", marginTop: "28px" }}>
            {["14-day money-back guarantee", "Lifetime access to the Academy"].map(t => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>
                <span style={{ color: RUST_ON_DARK, fontWeight: 800 }}>✓</span> {t}
              </span>
            ))}
          </div>
          <p style={{ textAlign: "center", margin: "20px 0 0" }}>
            <Link href="/faq" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "2px" }}>
              Questions first? Read the FAQ →
            </Link>
          </p>
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
