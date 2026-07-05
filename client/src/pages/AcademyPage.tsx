/**
 * EBA Academy Page
 * Curriculum overview — links to Kajabi for checkout
 * Design: Warm Editorial Authority
 */

import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionBreaker } from "@/components/SectionBreaker";
import { useIsMobile } from "@/hooks/useMobile";
import { useState, useEffect, useRef } from "react";
import {
  ENROL_HREF,
  ENROL_READY,
  ENROL_PENDING_LABEL,
  COMPANY_REG,
  FOUNDING_PRICE,
  PLACES_REMAINING,
  COHORT_SIZE,
  RUST,
  NAVY,
  CREAM,
  OAT,
  isPlaceholder,
  WHITE,
  DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB, ACCENT_RGB,
  IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT, NAV_RGB,
  NAV_BAR_BG, NAV_LINK, NAV_LINK_ACTIVE, NAV_BORDER, NAV_CTA_BG, NAV_CTA_TEXT,
  HERO_GLOW, SECTION_GLOW, METHOD_NAME, RUST_ON_DARK,
  ENROL_DOCS_READY, ENROL_DOCS_HREF,
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
 * The REAL curriculum — module names and lesson counts read directly from
 * Kajabi (June 2026). Total = exactly 101 lessons. Do not "improve" these
 * names; they are the product.
 *
 * `standoutLessons` are actual lesson titles from the course, surfaced because
 * they sell better than marketing copy.
 * TODO(eba): confirm the standout-lesson-to-module mapping against Kajabi —
 * the titles are real, the module placement below is editorial.
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
    description: "The biggest module in the course, because it's the biggest lever. What the owner of an engineering business is actually there to do: set direction, hold the standard, make the calls nobody else can make — and build a business that needs you less every month.",
    standoutLessons: ["The Best Leaders Make Themselves Surplus to Requirements"],
  },
  {
    number: "02",
    title: "Culture & Standards",
    lessons: 12,
    description: "Culture isn't a poster in the office. It's what you tolerate. This module covers setting the standards the business runs on, holding them when it's inconvenient, and building a company good people don't want to leave.",
    standoutLessons: ["Your People Are Your Real Customers", "Attitude Over Ability"],
  },
  {
    number: "03",
    title: "Leadership & Building Teams",
    lessons: 15,
    description: "Building a team that runs the work without you in the van. Hiring, developing and holding people to the standard — and making the hard personnel decisions early instead of carrying them for years.",
    standoutLessons: ["If You Need to Micromanage Someone They Must Go", "Always Get Rid of the Worst 10%"],
  },
  {
    number: "04",
    title: "Processes, Procedures & Other Controls",
    lessons: 8,
    description: "The controls that make quality repeatable when you're not in the room. How to systemise the way the business delivers so the output doesn't depend on who happened to be on the job.",
  },
  {
    number: "05",
    title: "Sales, Marketing & Growth Discipline",
    lessons: 8,
    description: "Growth as a discipline, not an accident. Winning the right work at the right price, saying no to the wrong work, and growing at a pace the business can actually absorb.",
  },
  {
    number: "06",
    title: "Commercial Controls",
    lessons: 10,
    description: "The commercial side of contracting: how the money is protected before and during the job — terms, variations, applications, and the commercial decisions that decide whether the margin you priced is the margin you keep.",
    standoutLessons: ["Money Is Made Before You Step on Site"],
  },
  {
    number: "07",
    title: "Financial Control & Cash",
    lessons: 11,
    description: "Cash kills profitable contractors. Payment terms, cash flow visibility, and the financial controls that keep a growing engineering business solvent while it grows.",
    standoutLessons: ["Never Accept 60-Day Terms"],
  },
  {
    number: "08",
    title: "Risk, Protection & Governance",
    lessons: 8,
    description: "The risks that can take a contracting business down, and the protection and governance that stop them: liability, insurance, structure, and the decisions that protect what you've built.",
  },
  {
    number: "09",
    title: "The Dark Side of Business",
    lessons: 5,
    // TODO(eba): confirm the public framing of the pre-pack story with Mark — it's his story.
    description: "Other programmes skip this. Mark went bust — a pre-pack administration — and teaches exactly what happened, why, and what he'd never let happen again. Five lessons every contractor needs before they need them.",
    standoutLessons: ["My Experience of Going Bust — A Pre-Pack Administration"],
    dark: true,
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
            <EBALogo height={38} light navOnCobalt />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[{ label: "Academy", href: "/academy" }, { label: "AI Tools", href: "/ai-tools" }, { label: "Documents", href: "/documents" }, { label: "Mentorship", href: "/mentorship" }, { label: "Our Story", href: "/our-story" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
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
              {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
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
              <SectionLabel>{ENROL_READY ? `Founding Cohort — ${PLACES_REMAINING} of ${COHORT_SIZE} Places Remaining` : `Founding Cohort — Enrolment Opens Soon · ${COHORT_SIZE} Places Only`}</SectionLabel>
              <h1 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 900,
                fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
                color: ON_DARK, margin: "0 0 24px", lineHeight: 1.05,
              }}>
                You learned to run jobs. This is where you learn to run the business.
              </h1>
              <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "17px", lineHeight: 1.7, margin: "0 0 40px" }}>
                Built from 15 years of running a UK M&E engineering group at scale — multiple UK divisions, international operations in Poland, and the launch of two adjacent businesses in fire protection and decarbonisation. Every lesson is drawn from direct operational experience. Nothing is theory. Nothing is recycled from a generic business course and rebranded for construction.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a href={KAJABI_URL} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("checkout_click", { source: "academy" })} style={{
                  background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                  padding: "14px 32px", letterSpacing: "0.04em", display: "inline-block",
                }}>
                  {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
                </a>
                <a href="#curriculum" style={{
                  background: "transparent", color: ON_DARK, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                  padding: "14px 32px", border: `1px solid rgba(${ON_DARK_RGB},0.4)`, display: "inline-block",
                }}>
                  View curriculum
                </a>
              </div>
              <p style={{ marginTop: "26px", fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontWeight: 600, color: `rgba(${ON_DARK_RGB},0.72)`, maxWidth: "460px", lineHeight: 1.5 }}>
                More depth than a course. More accessible than a coaching retainer. <span style={{ color: RUST_ON_DARK }}>Built specifically for engineering contractors.</span>
              </p>
              {/* TODO(eba): confirm the £500k–£5m turnover band with Mark before launch. */}
              <p style={{ marginTop: "14px", fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontStyle: "italic", color: `rgba(${ON_DARK_RGB},0.62)`, maxWidth: "460px", lineHeight: 1.5 }}>
                Built for established engineering services contractors — typically £500k–£5m turnover. If that's you, apply for the founding cohort.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { value: "101", label: "Lessons" },
                { value: "10", label: "Modules" },
                { value: "15+ years", label: "M&E group experience" },
                { value: "Lifetime", label: "Access at founding price" },
              ].map(({ value, label }) => (
                <div key={label} style={{
                  background: IS_VIVID ? WHITE : `rgba(${ON_DARK_RGB},0.06)`,
                  border: `1px solid rgba(${NAVY_RGB},0.08)`, borderLeft: `3px solid ${RUST}`,
                  borderRadius: "12px", boxShadow: IS_VIVID ? "0 12px 30px -24px rgba(0,0,0,0.25)" : "none",
                  padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px",
                }}>
                  <span style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST, fontSize: "1.4rem", fontWeight: 700, minWidth: "80px" }}>
                    {value}
                  </span>
                  <span style={{ color: IS_VIVID ? `rgba(${NAVY_RGB},0.7)` : `rgba(${CREAM_RGB},0.7)`, fontSize: "14px", fontWeight: 500 }}>
                    {label}
                  </span>
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
              Written for the business behind the toolbox — not the tools.
            </p>
          </div>
        </div>
      </div>

      {/* ── THE JOURNEY ── 4-step route through the programme (typographic — no icons) */}
      <section style={{ background: CREAM, padding: isMobile ? "56px 20px" : "88px 40px", borderBottom: `1px solid rgba(${NAVY_RGB},0.08)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel light>The Journey</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.4vw, 2.5rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 44px", lineHeight: 1.12,
            }}>
              From application to a business that runs without you.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? "28px" : "32px" }}>
              {[
                { step: "1", title: "Join the founding cohort", body: "Apply, secure one of the limited places, and lock in the founding price for life." },
                { step: "2", title: "Work the 10 modules", body: "Self-paced over 12–16 weeks — pricing, contracts, cash flow, teams, growth." },
                { step: "3", title: "Mentorship & community", body: "Group sessions and 1:1 access while you put the system into your business." },
                { step: "4", title: "The business on the other side", body: "Systems that run without you — priced right, paid on time, off your shoulders." },
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
              What you will learn.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "560px", margin: "0 0 56px" }}>
              Half of running a profitable engineering business is commercial control. The other half is leadership — culture, teams, and the standards you hold. The Academy teaches both, because Mark ran both. Ten modules — the ten components of {METHOD_NAME}. Click any module to see what's inside.
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
                        {mod.dark && (
                          <span style={{
                            marginLeft: "12px", background: RUST, color: "#fff",
                            fontSize: "9px", fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                            padding: "2px 8px", verticalAlign: "middle",
                          }}>
                            Rarely taught
                          </span>
                        )}
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
            <SectionLabel>How It Works</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: ON_DARK, margin: "0 0 56px", lineHeight: 1.1,
            }}>
              How it works.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? "2px" : "2px" }}>
              {[
                { Icon: Play, label: "Video-led lessons", body: "Each lesson is delivered by Mark Poulton directly to camera. No slides. No talking heads. No stock footage." },
                { Icon: Clock, label: "Self-paced", body: "Work through the curriculum at your pace. Most members complete the full academy in 12–16 weeks at 2–3 hours per week." },
                { Icon: Smartphone, label: "Mobile-ready", body: "Access every lesson on desktop, tablet, or phone. Learn on site, in the van, or at the kitchen table." },
                { Icon: InfinityIcon, label: "Lifetime access", body: "Your founding membership gives you permanent access. Every new module and update added to the curriculum is included at no extra cost." },
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

      {/* ── SECTION BREAKER ── */}
      <SectionBreaker
        kicker="Founding cohort"
        title="The founding price rises"
        accent="after launch."
        variant="tint"
      />

      {/* ── PRICING / CTA ── */}
      <section id="pricing" style={{ background: OAT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel light>Founding Cohort Pricing</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px", lineHeight: 1.1,
            }}>
              Founding price. Locked in for life.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "640px", margin: "0 0 56px" }}>
              Founding members pay a permanently lower price than every member who joins after the cohort closes. There is no catch. It is how we reward the people who back EBA before the public launch.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "2px", marginBottom: "40px", maxWidth: "880px" }}>
              {/* Two-tier founding pricing per the rebuild brief:
                  Academy £999 → £1,499 · +Documents £1,299 → £1,999.
                  TODO(eba): [CONFIRM] final prices with Mark, then set
                  FOUNDING_PRICE in constants.ts to a real value to reveal them
                  (until then each tier shows "Pricing announced soon"). */}
              {[
                {
                  tier: "Founding Academy",
                  price: "£999",
                  monthly: "rises to £1,499 after the founding cohort",
                  popular: false,
                  includes: [
                    "Full 101-lesson curriculum",
                    "Lifetime access",
                    "All future curriculum updates",
                    "Founding cohort group session with Mark",
                  ],
                },
                {
                  tier: "Founding Academy + Documents",
                  price: "£1,299",
                  monthly: "rises to £1,999 after the founding cohort",
                  popular: true,
                  includes: [
                    "Everything in Founding Academy",
                    "Full 380-document library (Word + PDF)",
                    "All future document additions",
                  ],
                },
              ].map(({ tier, price, monthly, popular, includes }, i) => (
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
                  {PRICING_ANNOUNCED && (
                    <div style={{ color: popular ? `rgba(${CREAM_RGB},0.5)` : `rgba(${NAVY_RGB},0.45)`, fontSize: "13px", margin: "0 0 28px" }}>{monthly}</div>
                  )}
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
                  }}>{(popular ? ENROL_DOCS_READY : ENROL_READY) ? "Apply now →" : ENROL_PENDING_LABEL}</a>
                </div>
              ))}
            </div>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", textAlign: "center" }}>
              14-day money-back guarantee. If it isn't right for your business, you pay nothing.
            </p>
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
