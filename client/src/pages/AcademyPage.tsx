/**
 * EBA Academy Page
 * Curriculum overview — links to Kajabi for checkout
 * Design: Warm Editorial Authority
 */

import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useIsMobile } from "@/hooks/useMobile";
import { useState, useEffect, useRef } from "react";
import {
  ENROL_HREF,
  ENROL_READY,
  ENROL_PENDING_LABEL,
  COMPANY_REG,
  FOUNDING_PRICE,
  RUST,
  NAVY,
  CREAM,
  OAT,
  isPlaceholder,
  WHITE,
  DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB, ACCENT_RGB,
  IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT, NAV_RGB,
  NAV_BAR_BG, NAV_LINK, NAV_LINK_ACTIVE, NAV_BORDER, NAV_CTA_BG, NAV_CTA_TEXT,
  HERO_GLOW, SECTION_GLOW, RUST_ON_DARK,
  ENROL_DOCS_READY, ENROL_DOCS_HREF, PRICING,
} from "@/lib/constants";
import { Seo, PAGE_SEO, COURSE_JSONLD } from "@/components/Seo";
import { track } from "@/lib/track";
import { Play, Clock, Smartphone, Infinity as InfinityIcon, Check } from "lucide-react";

const ACADEMY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/104280767/Hckr7ge87tHNputhSZAfow/eba-academy-section-itC8hxihaXFiQ5LKou8GLG.webp";

const KAJABI_URL = ENROL_HREF;
// Pricing stays hidden behind a "Pricing announced soon" fallback until confirmed.
const PRICING_ANNOUNCED = !isPlaceholder(FOUNDING_PRICE);

function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <span style={{
      display: "inline-block",
      background: light ? `rgba(${RUST_RGB},0.12)` : RUST,
      color: light ? RUST : "#fff",
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 600, fontSize: "11px", letterSpacing: "0.1em",
      textTransform: "uppercase", padding: "5px 14px", marginBottom: "20px",
    }}>
      {children}
    </span>
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
      { threshold: 0.08 }
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

/**
 * The curriculum — module titles and lesson counts match Kajabi (101 lessons
 * in total, shown as "100+" per Mark's schedule). Modules 04, 07 and 09 and
 * four lesson titles were renamed in Kajabi on 19 Sep 2026 to Mark's wording
 * (confirmed by Mark the same day), so site and course agree. Descriptions
 * follow Mark's Academy page schedule.
 *
 * `standoutLessons` are ACTUAL lesson titles from the course, in the module
 * they actually belong to, shown as quotes.
 */
const modules: {
  number: string;
  title: string;
  lessons: number;
  description: string;
  standoutLessons?: string[];
  dark?: boolean;
}[] = [
  {
    number: "01",
    title: "The Job of the Leader",
    lessons: 17,
    description: "Leadership sets the direction for the whole business. This module covers the role of the owner and senior leader in setting priorities, maintaining standards, making difficult decisions, developing people and creating a business that becomes less dependent on any one individual.",
    // Real Module 1 lessons in Kajabi ("Surplus to Requirements" sits in Module 3).
    standoutLessons: ["What Is Your Job as a Leader", "The Hands-Off Business Owner – How I Achieved This With My Mentor"],
  },
  {
    number: "02",
    title: "Culture & Standards",
    lessons: 12,
    description: "Culture is shaped by the standards leaders set, reinforce and consistently uphold. This module covers how to define those standards, embed them into day-to-day behaviour and build an environment where good people can perform, develop and want to stay.",
    // The two people lessons Mark quoted under Module 3 actually sit in
    // Module 2 in Kajabi; they are shown where they live.
    standoutLessons: ["Your People Are Your Real Customers", "Attitude Over Ability", "When Micromanagement Becomes a Warning Sign", "Addressing Underperformance Early"],
  },
  {
    number: "03",
    title: "Leadership & Building Teams",
    lessons: 15,
    description: "Building a strong team requires more than hiring good people. This module covers recruitment, development, accountability, performance management and creating a leadership structure where responsibility is shared and people are clear on the standards expected of them.",
    standoutLessons: ["The Best Leaders Make Themselves Surplus to Requirements", "Succession Planning – You Should Always Have One Eye on This"],
  },
  {
    number: "04",
    title: "Processes, Procedures & Other Controls",
    lessons: 8,
    description: "Strong businesses rely on consistent ways of working. This module covers how to build practical processes, procedures and controls that improve consistency, protect quality and reduce reliance on individual knowledge across the business.",
  },
  {
    number: "05",
    title: "Sales, Marketing & Growth Discipline",
    lessons: 8,
    description: "Sustainable growth requires discipline and clear choices. This module covers how to build a stronger pipeline, win the right work at the right margin, say no when an opportunity does not fit, and grow at a pace the business can support.",
  },
  {
    number: "06",
    title: "Commercial Controls",
    lessons: 10,
    description: "Strong commercial control protects the margin from the point the work is won through to final account. This module covers contract terms, variations, applications, commercial decision-making and the disciplines required to protect the value built into every project.",
    standoutLessons: ["Money Is Made Before You Step on Site"],
  },
  {
    number: "07",
    title: "Financial Control & Cash",
    lessons: 11,
    description: "Profit and cash are not the same thing. This module covers payment terms, cash flow visibility, working capital and the financial controls required to support growth while maintaining a healthy and resilient business.",
    standoutLessons: ["Why Payment Terms Matter"],
  },
  {
    number: "08",
    title: "Risk, Protection & Governance",
    lessons: 8,
    description: "The risks that can take a contracting business down, and the protection and governance that stop them: liability, insurance, structure, and the decisions that protect what you've built.",
  },
  {
    number: "09",
    title: "Hard Lessons in Business",
    lessons: 5,
    description: "Some of the most valuable business lessons come from difficult periods. In this module, Mark shares his experience of a pre-pack administration, what led to it, what he learned from it, and the controls, decisions and warning signs he would approach differently today.",
    standoutLessons: ["What I Learned from a Pre-Pack Administration"],
  },
  {
    number: "10",
    title: "Implementation Toolkit",
    lessons: 7,
    description: "The academy ends where the work begins. The bridge between learning and doing: prioritising the changes, building the plan, and implementing across your business without disrupting live projects.",
  },
];


function AcademyNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className="eba-desktop-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: NAV_BAR_BG,
        borderBottom: `1px solid ${NAV_BORDER}`,
        boxShadow: scrolled ? "0 12px 30px -18px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.3s ease", padding: "0 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <EBALogo height={48} light navOnCobalt />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[{ label: "Academy", href: "/academy" }, { label: "AI Tools", href: "/ai-tools" }, { label: "Documents", href: "/documents" }, { label: "Mentorship", href: "/mentorship" }, { label: "Pricing", href: "/pricing" }, { label: "Our Story", href: "/our-story" }].map(({ label, href }) => (
              <Link key={href} href={href} style={{
                color: href === "/academy" ? NAV_LINK_ACTIVE : NAV_LINK,
                textDecoration: "none", fontFamily: "'Poppins', sans-serif",
                fontWeight: href === "/academy" ? 600 : 500, fontSize: "14px",
                borderBottom: href === "/academy" ? `2px solid ${NAV_LINK_ACTIVE}` : "none",
                paddingBottom: "2px",
              }}>
                {label}
              </Link>
            ))}
            <span><a href={KAJABI_URL} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
              background: NAV_CTA_BG, color: NAV_CTA_TEXT, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px",
              padding: "9px 20px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "10px",
            }}>
              {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
            </a></span>
          </div>
        </div>
      </nav>
  );
}

export default function AcademyPage() {
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isMobile = useIsMobile();
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.academy} jsonLd={COURSE_JSONLD} />
      <MobileNav transparent={true} />


      {/* ── NAV ── desktop only; CSS hides on mobile */}
      <AcademyNav scrolled={scrolled} />
      {/* ── HERO ── */}
      <section style={{ position: "relative", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "80px", background: DARK_GRADIENT, overflow: "hidden" }}>
        {IS_VIVID ? (
          <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: `url(${ACADEMY_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        )}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
            <div>
              {/* Founding-cohort / places-remaining label removed (Mark, 19 Sep). */}
              <SectionLabel>The Academy</SectionLabel>
              <h1 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 900,
                fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
                color: ON_DARK, margin: "0 0 24px", lineHeight: 1.05,
              }}>
                You know how to deliver on site. This is where you learn to build the business around it.
              </h1>
              <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "17px", lineHeight: 1.7, margin: "0 0 40px" }}>
                The Engineering Business Academy is built from decades of real-world experience building, leading and scaling engineering businesses. Every lesson is grounded in practical commercial, operational and leadership experience, from managing projects, people and cash flow to building systems, developing teams and growing businesses across multiple divisions and international operations.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a href={KAJABI_URL} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("checkout_click", { source: "academy" })} style={{
                  background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                  padding: "14px 32px", letterSpacing: "0.04em", display: "inline-block",
                }}>
                  {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
                </a>
                <a href="#curriculum" style={{
                  background: "transparent", color: ON_DARK, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                  padding: "14px 32px", border: `1px solid rgba(${ON_DARK_RGB},0.4)`, display: "inline-block",
                }}>
                  View the Curriculum
                </a>
              </div>
              <p style={{ marginTop: "26px", fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontWeight: 600, color: `rgba(${ON_DARK_RGB},0.72)`, maxWidth: "500px", lineHeight: 1.5 }}>
                Practical business education built specifically for engineering and technical services businesses, combining real-world experience, structured learning and tools you can apply in your own company.
              </p>
              <p style={{ marginTop: "14px", fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontStyle: "italic", color: `rgba(${ON_DARK_RGB},0.62)`, maxWidth: "500px", lineHeight: 1.5 }}>
                Built for owners and leaders of engineering and technical services businesses who want stronger commercial control, better systems, stronger teams and a business that is ready for its next stage of growth.
              </p>
            </div>
            {/* Typographic stat grid — dark-native. Wording per Mark's Academy
                schedule (19 Sep 2026): 100+ lessons, decades of experience,
                no founding-price reference. */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? "22px 20px" : "30px 28px", alignContent: "center" }}>
              {[
                { value: "100+", label: "Practical Lessons" },
                { value: "10", label: "Practical Modules" },
                { value: "Decades", label: "Real-world industry experience" },
                { value: "Lifetime", label: "Access" },
              ].map(({ value, label }) => (
                <div key={label} style={{ borderTop: `1px solid rgba(${ON_DARK_RGB},0.18)`, paddingTop: "14px" }}>
                  <p style={{
                    fontFamily: "var(--eba-heading)", fontWeight: 800,
                    fontSize: isMobile ? "1.55rem" : "1.9rem", letterSpacing: "-0.02em",
                    color: RUST_ON_DARK, margin: 0, lineHeight: 1.1,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {value}
                  </p>
                  <p style={{
                    fontFamily: "'Poppins', sans-serif", fontSize: "11.5px", fontWeight: 600,
                    letterSpacing: "0.09em", textTransform: "uppercase",
                    color: `rgba(${CREAM_RGB},0.62)`, margin: "7px 0 0", lineHeight: 1.5,
                  }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SITE BAND ── */}
      <div style={{ position: "relative", width: "100%", height: isMobile ? "220px" : "360px", overflow: "hidden" }}>
        <img src="/site-fitout.jpg" alt="A live M&E fit-out — ductwork, containment and services installation" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 45%", display: "block" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(${NAVY_RGB},0.72) 0%, rgba(${NAVY_RGB},0.35) 45%, rgba(${ACCENT_RGB},0.25) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", width: "100%" }}>
            <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, color: "#fff", fontSize: isMobile ? "1.4rem" : "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.15, letterSpacing: "-0.01em", maxWidth: "620px", margin: 0 }}>
              Built from the realities of running and growing engineering businesses.
            </p>
          </div>
        </div>
      </div>

      {/* ── THE JOURNEY ── 4-step route through the programme (typographic — no icons) */}
      <section style={{ background: CREAM, padding: isMobile ? "56px 20px" : "88px 40px", borderBottom: `1px solid rgba(${NAVY_RGB},0.08)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel light>How the Academy Works</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.4vw, 2.5rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 44px", lineHeight: 1.12,
            }}>
              A practical route from learning to implementation.
            </h2>
            {/* Mentorship is a separate, application-only product, so step 3 no
                longer implies 1:1 access comes with every purchase (Mark, 19 Sep). */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? "28px" : "32px" }}>
              {[
                { step: "1", title: "Join the Academy", body: "Get access to the Academy and start with the areas most relevant to your business and role." },
                { step: "2", title: "Work through the 10 modules", body: "Learn at your own pace across the commercial, operational and leadership areas that matter as an engineering business grows." },
                { step: "3", title: "Apply what you learn", body: "Use the lessons, tools and supporting resources to strengthen the way your own business operates." },
                { step: "4", title: "Build for the next stage", body: "Create stronger commercial control, clearer systems, better leadership and a business that is less dependent on any one person." },
              ].map(({ step, title, body }, i) => (
                <div key={step} style={{
                  borderTop: `2px solid ${i === 3 ? RUST : `rgba(${NAVY_RGB},0.15)`}`,
                  paddingTop: "20px",
                }}>
                  <span style={{
                    fontFamily: "var(--eba-heading)", fontStyle: "italic", fontWeight: 700,
                    color: RUST, fontSize: "1.6rem", display: "block", marginBottom: "10px",
                  }}>
                    {step}
                  </span>
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.05rem", color: NAVY, margin: "0 0 8px", lineHeight: 1.3 }}>
                    {title}
                  </h3>
                  <p style={{ color: `rgba(${NAVY_RGB},0.68)`, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section id="curriculum" style={{ backgroundColor: CREAM, backgroundImage: SECTION_GLOW, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel light>The Curriculum</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px",
            }}>
              What you will learn
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "620px", margin: "0 0 56px" }}>
              The Academy brings together the commercial, operational and leadership knowledge required to build and grow a stronger engineering business. Across 10 practical modules, you will cover the areas that influence margin, cash, risk, people, delivery, leadership and long-term growth. Select any module to explore the lessons inside.
            </p>
          </RevealSection>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {modules.map((mod, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 40}ms` }}>
                <div style={{
                  background: mod.dark ? NAVY : "#fff",
                  border: `1px solid rgba(${NAVY_RGB},0.08)`,
                  borderLeft: `4px solid ${openModule === i ? RUST : mod.dark ? RUST_ON_DARK : OAT}`,
                  borderRadius: "12px",
                  transition: "border-color 0.2s",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px -22px rgba(0,0,0,0.22)",
                }}>
                  <button
                    onClick={() => setOpenModule(openModule === i ? null : i)}
                    style={{
                      width: "100%", background: "none", border: "none", cursor: "pointer",
                      padding: "24px 28px", display: "flex", alignItems: "center", gap: "20px",
                      textAlign: "left",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--eba-heading)", fontStyle: "italic",
                      color: mod.dark ? RUST_ON_DARK : openModule === i ? RUST : `rgba(${NAVY_RGB},0.25)`,
                      fontSize: "1.1rem", fontWeight: 700, minWidth: "36px",
                      transition: "color 0.2s",
                    }}>
                      {mod.number}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: "var(--eba-heading)", fontWeight: 700,
                        fontSize: "1.1rem", color: mod.dark ? "#fff" : NAVY,
                        margin: "0 0 4px",
                      }}>
                        {mod.title}
                      </h3>
                      <span style={{
                        fontFamily: "'Poppins', sans-serif", fontSize: "12px",
                        color: mod.dark ? `rgba(${CREAM_RGB},0.45)` : `rgba(${NAVY_RGB},0.45)`,
                        fontWeight: 500,
                      }}>
                        {mod.lessons} lessons
                      </span>
                    </div>
                    <span style={{
                      color: mod.dark ? `rgba(${CREAM_RGB},0.5)` : `rgba(${NAVY_RGB},0.4)`,
                      fontSize: "18px", transition: "transform 0.25s ease",
                      transform: openModule === i ? "rotate(45deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}>
                      +
                    </span>
                  </button>

                  {openModule === i && (
                    <div style={{
                      padding: "0 28px 28px 84px",
                      animation: "expandIn 0.25s ease-out",
                    }}>
                      <p style={{
                        color: mod.dark ? `rgba(${CREAM_RGB},0.75)` : `rgba(${NAVY_RGB},0.7)`,
                        fontSize: "15px", lineHeight: 1.7, margin: "0 0 20px",
                      }}>
                        {mod.description}
                      </p>
                      {mod.standoutLessons && mod.standoutLessons.length > 0 && (
                        <div>
                          <p style={{
                            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "10.5px",
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: mod.dark ? `rgba(${CREAM_RGB},0.5)` : `rgba(${NAVY_RGB},0.5)`,
                            margin: "0 0 8px",
                          }}>
                            From the lessons
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {mod.standoutLessons.map((lesson, j) => (
                              <span key={j} style={{
                                background: mod.dark ? `rgba(${ON_DARK_RGB},0.08)` : OAT,
                                color: mod.dark ? `rgba(${CREAM_RGB},0.75)` : `rgba(${NAVY_RGB},0.75)`,
                                fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", fontWeight: 500,
                                fontStyle: "italic", padding: "5px 12px",
                              }}>
                                “{lesson}”
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY FORMAT ── */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            {/* One "How It Works" only — the duplicate label was removed per
                Mark's final Academy schedule (20 Sep 2026). */}
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: ON_DARK, margin: "0 0 56px", lineHeight: 1.1,
            }}>
              How It Works
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? "2px" : "2px" }}>
              {[
                { Icon: Play, label: "Video-led lessons", body: "Each lesson is delivered directly by Mark Poulton in a clear, practical format focused on one subject at a time. The emphasis is on useful experience, examples and actions you can take back into the business." },
                { Icon: Clock, label: "Self-paced", body: "Work through the curriculum at your own pace and return to individual lessons whenever they become relevant to the challenges or decisions in your business." },
                { Icon: Smartphone, label: "Mobile-ready", body: "Access the Academy on desktop, tablet or phone, making it easy to learn wherever you are and revisit lessons when you need them." },
                { Icon: InfinityIcon, label: "Lifetime access", body: "Your membership gives you lifetime access to the Academy, including future updates to the curriculum." },
              ].map(({ Icon, label, body }, i) => (
                <div key={i} style={{
                  background: `rgba(${ON_DARK_RGB},0.05)`, borderLeft: `3px solid ${RUST}`,
                  padding: "28px 24px",
                }}>
                  <Icon size={26} strokeWidth={1.75} color={RUST_ON_DARK} style={{ display: "block", marginBottom: "14px" }} />
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.1rem", color: ON_DARK, margin: "0 0 10px" }}>{label}</h3>
                  <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "14px", lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── PRICING / CTA ── one header block only (Mark's final Academy
          schedule, 20 Sep 2026: the breaker + repeated "Straightforward
          access" block were collapsed into this). */}
      <section id="pricing" style={{ background: OAT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel light>Academy Pricing</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px", lineHeight: 1.1,
            }}>
              Choose the level of access that is right for your business.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "640px", margin: "0 0 56px" }}>
              Choose the Academy on its own or combine it with the document library for a broader set of practical resources you can use inside the business.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "2px", marginBottom: "40px", maxWidth: "880px" }}>
              {/* Two tiers, prices from PRICING in constants.ts (gated by
                  PRICING_ANNOUNCED). The founding-cohort "rises to" mechanic and
                  the group session were removed per Mark's schedule (19 Sep). */}
              {[
                {
                  tier: "The Academy",
                  price: isPlaceholder(PRICING.academyFounding) ? "£999" : PRICING.academyFounding,
                  popular: false,
                  includes: [
                    "Full 100+ lesson curriculum",
                    // Members get the unlimited, no-email version (see
                    // ToolboxTalkPage isMember), so "Full" is accurate.
                    "Full Toolbox Talk Generator included",
                    "Lifetime access",
                    "Future curriculum updates included",
                  ],
                  cta: "Join the Academy",
                },
                {
                  tier: "Academy + Documents",
                  price: isPlaceholder(PRICING.academyDocsFounding) ? "£1,299" : PRICING.academyDocsFounding,
                  popular: true,
                  includes: [
                    "Everything in The Academy",
                    "Full 380-document library in editable Word and Excel formats",
                    "Future document additions included",
                  ],
                  cta: "Join the Academy + Documents",
                },
              ].map(({ tier, price, popular, includes, cta }, i) => (
                <div key={i} style={{
                  background: popular ? NAVY : "#fff",
                  padding: "36px 28px",
                  position: "relative",
                  borderTop: popular ? `4px solid ${RUST}` : `4px solid transparent`,
                }}>
                  {popular && (
                    <div style={{
                      position: "absolute", top: "-1px", right: "20px",
                      background: RUST, color: "#fff",
                      fontFamily: "'Poppins', sans-serif", fontWeight: 700,
                      fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "4px 12px",
                    }}>Most Popular</div>
                  )}
                  <h3 style={{
                    fontFamily: "var(--eba-heading)", fontWeight: 700,
                    fontSize: "1.05rem", color: popular ? "#fff" : NAVY,
                    margin: "0 0 20px", lineHeight: 1.3,
                  }}>{tier}</h3>
                  <div style={{
                    fontFamily: "var(--eba-heading)", fontStyle: "italic",
                    color: popular ? RUST_ON_DARK : RUST, fontSize: PRICING_ANNOUNCED ? "2.2rem" : "1.25rem", fontWeight: 700, margin: "0 0 4px",
                  }}>{PRICING_ANNOUNCED ? price : "Pricing announced soon"}</div>
                  <div style={{ color: popular ? `rgba(${CREAM_RGB},0.5)` : `rgba(${NAVY_RGB},0.45)`, fontSize: "13px", margin: "0 0 28px" }}>one-time payment</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                    {includes.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <Check size={16} strokeWidth={2.5} color={popular ? RUST_ON_DARK : RUST} style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ color: popular ? `rgba(${CREAM_RGB},0.75)` : `rgba(${NAVY_RGB},0.7)`, fontSize: "14px", lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href={popular ? ENROL_DOCS_HREF : KAJABI_URL} target="_blank" rel="noopener noreferrer" aria-disabled={!(popular ? ENROL_DOCS_READY : ENROL_READY) || undefined} onClick={() => track("checkout_click", { source: "academy", tier: popular ? "academy+docs" : "academy" })} style={{
                    background: popular ? RUST : "transparent",
                    color: popular ? "#fff" : NAVY,
                    border: popular ? "none" : `2px solid ${NAVY}`,
                    textDecoration: "none",
                    fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px",
                    padding: "13px 24px", letterSpacing: "0.04em", display: "block",
                    textAlign: "center",
                  }}>{(popular ? ENROL_DOCS_READY : ENROL_READY) ? cta : ENROL_PENDING_LABEL}</a>
                </div>
              ))}
            </div>
            {/* Guarantee line removed from this page per Mark's schedule (19 Sep);
                the 14-day guarantee was withdrawn entirely on 20 Sep 2026 (Ste). */}
          </RevealSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />

      <style>{`
        @keyframes expandIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
