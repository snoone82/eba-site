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
  IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, NAV_RGB,
  HERO_GLOW, SECTION_GLOW,
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
      fontFamily: "'DM Sans', sans-serif",
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

const modules = [
  {
    number: "01",
    title: "The Business You Actually Own",
    lessons: 9,
    description: "Most M&E business owners don't have a business — they have a job with employees. This module establishes the difference, diagnoses where you are, and maps out where you need to get to. Covers business structure, owner dependency, the gap between turnover and real income, and what a sustainable M&E business actually looks like.",
    topics: ["Business structure and owner dependency", "Turnover vs real income", "What a sustainable M&E business looks like", "Diagnosing where you are now"],
  },
  {
    number: "02",
    title: "Cash Flow and Financial Visibility",
    lessons: 11,
    description: "Cash flow kills profitable businesses. This module covers the mechanics of M&E cash flow — applications for payment, retentions, VAT timing, the gap between billing and collection — and how to build visibility and control. Includes the financial models used to run a real M&E business.",
    topics: ["Applications for payment and retentions", "VAT timing and cash flow gaps", "Real-world financial models", "Building visibility and control"],
  },
  {
    number: "03",
    title: "Pricing, Margins and Estimating",
    lessons: 12,
    description: "The most common reason M&E contractors fail is not losing work — it's winning work at the wrong price. This module covers estimating methodology, margin protection, variation recovery, and how to price for profit without pricing yourself out of the market.",
    topics: ["Estimating methodology", "Margin protection", "Variation recovery", "Pricing for profit without losing bids"],
  },
  {
    number: "04",
    title: "Tendering and Winning Work",
    lessons: 10,
    description: "How to build a bid pipeline, qualify opportunities before you invest time, write tenders that stand out, price competitively without being cheapest, and convert more of what you submit. Covers both private sector and public sector frameworks.",
    topics: ["Building a bid pipeline", "Qualifying opportunities", "Writing tenders that stand out", "Private and public sector frameworks"],
  },
  {
    number: "05",
    title: "Contracts, Risk and Commercial Management",
    lessons: 11,
    description: "JCT. NEC3. NEC4. Bespoke contracts. Most M&E contractors sign what they're given. This module covers what you're actually agreeing to, which clauses routinely damage M&E contractors, how to negotiate key terms, and how to manage a project commercially from day one.",
    topics: ["JCT, NEC3, NEC4 and bespoke contracts", "Clauses that routinely damage M&E contractors", "Negotiating key terms", "Commercial management from day one"],
  },
  {
    number: "06",
    title: "Hiring, Teams and Operations",
    lessons: 10,
    description: "Building a team that doesn't depend on you. Covers recruitment strategy, onboarding, TUPE, subcontractor management, field operations, and the management structures used to scale from a small team to multi-site operations across six divisions.",
    topics: ["Recruitment strategy and onboarding", "TUPE and subcontractor management", "Field operations", "Management structures for multi-site scaling"],
  },
  {
    number: "07",
    title: "Health, Safety and Compliance",
    lessons: 12,
    description: "CDM 2015. RAMS. COSHH. Fire protection. Legionella. The compliance requirements for an M&E business are extensive and evolving. This module covers the full compliance landscape, how to build a robust safety management system, and how to use compliance as a commercial differentiator rather than a cost.",
    topics: ["CDM 2015, RAMS, COSHH", "Fire protection and Legionella", "Building a safety management system", "Compliance as a commercial differentiator"],
  },
  {
    number: "08",
    title: "Growth, Systems and Scaling",
    lessons: 10,
    description: "How to grow deliberately rather than accidentally. Covers operational systemisation, the technology stack for a growing M&E business, when and how to add a new division, and expanding into new territories and adjacent service lines — drawn directly from real experience doing exactly that.",
    topics: ["Operational systemisation", "Technology stack for growing M&E businesses", "Adding a new division", "Expanding into new territories and services"],
  },
  {
    number: "09",
    title: "The Dark Side of Business",
    lessons: 8,
    description: "Other programmes skip this. Pre-pack administration. Insolvency risk. Director liability. Contractor failure. Late payment enforcement. What to do when a major client doesn't pay. What happens when a project fails commercially. This module exists because Mark Poulton has been through it — and because every M&E contractor needs to understand the risks before they experience them.",
    topics: ["Pre-pack administration", "Insolvency risk and director liability", "Late payment enforcement", "When a major client doesn't pay"],
    dark: true,
  },
  {
    number: "10",
    title: "The Implementation Toolkit",
    lessons: 8,
    description: "The academy ends where the work begins. This module is the bridge between learning and doing — covering how to prioritise the changes you need to make, build a 90-day action plan, and implement across your business without disrupting live projects.",
    topics: ["Prioritising changes", "Building a 90-day action plan", "Implementation without disrupting live projects", "Templates and frameworks ready to deploy"],
  },
];


function AcademyNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className="eba-desktop-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? `rgba(${NAV_RGB},0.97)` : `rgba(${NAV_RGB},0.85)`,
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? `1px solid rgba(${RUST_RGB},0.3)` : "none",
        transition: "all 0.3s ease", padding: "0 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <EBALogo height={38} light={!IS_VIVID} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[{ label: "Academy", href: "/academy" }, { label: "AI Tools", href: "/ai-tools" }, { label: "Documents", href: "/documents" }, { label: "Mentorship", href: "/mentorship" }, { label: "Our Story", href: "/our-story" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
              <Link key={href} href={href} style={{
                color: href === "/academy" ? ON_DARK : `rgba(${ON_DARK_RGB},0.7)`,
                textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                fontWeight: href === "/academy" ? 600 : 500, fontSize: "14px",
                borderBottom: href === "/academy" ? `2px solid ${RUST}` : "none",
                paddingBottom: "2px",
              }}>
                {label}
              </Link>
            ))}
            <span><a href={KAJABI_URL} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
              background: CTA_PRIMARY_BG, color: "#fff", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
              padding: "9px 20px", letterSpacing: "0.04em", display: "inline-block",
            }}>
              {ENROL_READY ? "Join the Academy →" : ENROL_PENDING_LABEL}
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
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
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
                Everything they never taught you about running an M&E business.
              </h1>
              <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "17px", lineHeight: 1.7, margin: "0 0 40px" }}>
                Built from 25 years of running a principal M&E contracting business — through growth, restructuring and scale. Every lesson is drawn from direct operational experience. Nothing is theory. Nothing is recycled from a generic business course and rebranded for construction.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a href={KAJABI_URL} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("checkout_click", { source: "academy" })} style={{
                  background: CTA_PRIMARY_BG, color: "#fff", textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
                  padding: "14px 32px", letterSpacing: "0.04em", display: "inline-block",
                }}>
                  {ENROL_READY ? "Join the founding cohort →" : ENROL_PENDING_LABEL}
                </a>
                <a href="#curriculum" style={{
                  background: "transparent", color: ON_DARK, textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px",
                  padding: "14px 32px", border: `1px solid rgba(${ON_DARK_RGB},0.4)`, display: "inline-block",
                }}>
                  View curriculum
                </a>
              </div>
              <p style={{ marginTop: "26px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: `rgba(${ON_DARK_RGB},0.6)`, maxWidth: "460px", lineHeight: 1.5 }}>
                More depth than a course. More accessible than a coaching retainer. <span style={{ color: RUST }}>The only one built for M&amp;E.</span>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { value: "101", label: "Lessons" },
                { value: "10", label: "Modules" },
                { value: "25+ years", label: "Operational M&E experience" },
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
                  <span style={{ color: `rgba(${CREAM_RGB},0.7)`, fontSize: "14px", fontWeight: 500 }}>
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
            <p style={{ color: `rgba(${NAVY_RGB},0.65)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "560px", margin: "0 0 56px" }}>
              Ten modules covering every dimension of running an M&E business. Click any module to see the lesson breakdown.
            </p>
          </RevealSection>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {modules.map((mod, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 40}ms` }}>
                <div style={{
                  background: mod.dark ? NAVY : "#fff",
                  border: `1px solid rgba(${NAVY_RGB},0.08)`,
                  borderLeft: `4px solid ${openModule === i ? RUST : mod.dark ? RUST : OAT}`,
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
                      color: mod.dark ? RUST : openModule === i ? RUST : `rgba(${NAVY_RGB},0.25)`,
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
                            fontSize: "9px", fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                            padding: "2px 8px", verticalAlign: "middle",
                          }}>
                            Rarely taught
                          </span>
                        )}
                      </h3>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
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
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {mod.topics.map((topic, j) => (
                          <span key={j} style={{
                            background: mod.dark ? `rgba(${ON_DARK_RGB},0.08)` : OAT,
                            color: mod.dark ? `rgba(${CREAM_RGB},0.7)` : `rgba(${NAVY_RGB},0.7)`,
                            fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                            padding: "5px 12px",
                          }}>
                            {topic}
                          </span>
                        ))}
                      </div>
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
                  <Icon size={26} strokeWidth={1.75} color={RUST} style={{ display: "block", marginBottom: "14px" }} />
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.1rem", color: ON_DARK, margin: "0 0 10px" }}>{label}</h3>
                  <p style={{ color: `rgba(${CREAM_RGB},0.65)`, fontSize: "14px", lineHeight: 1.65, margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── SECTION BREAKER ── */}
      <SectionBreaker
        kicker="Founding cohort"
        title="Lock in the lowest price"
        accent="it'll ever be."
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
            <p style={{ color: `rgba(${NAVY_RGB},0.65)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "640px", margin: "0 0 56px" }}>
              Founding members pay a permanently lower price than every member who joins after the cohort closes. There is no catch. It is how we reward the people who back EBA before the public launch.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "2px", marginBottom: "40px" }}>
              {/* TODO(eba): set real per-tier prices below, then set FOUNDING_PRICE in
                  constants.ts to a real value to reveal them (until then each tier shows
                  "Pricing announced soon" instead of the £[XX] placeholder). */}
              {[
                {
                  tier: "Founding Academy",
                  price: "£[XX]",
                  monthly: "or £[XX]/mo × 6",
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
                  price: "£[XX]",
                  monthly: "or £[XX]/mo × 6",
                  popular: true,
                  includes: [
                    "Everything in Founding Academy",
                    "Full 380-document library (Word + PDF)",
                    "All future document additions",
                  ],
                },
                {
                  tier: "Founding Academy + Documents + Mentorship",
                  price: "£[XX]",
                  monthly: "or £[XX]/mo × 6",
                  popular: false,
                  includes: [
                    "Everything above",
                    "12 months group mentorship access",
                    "Priority for 1:1 sessions",
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
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
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
                    color: RUST, fontSize: PRICING_ANNOUNCED ? "2.2rem" : "1.25rem", fontWeight: 700, margin: "0 0 4px",
                  }}>{PRICING_ANNOUNCED ? price : "Pricing announced soon"}</div>
                  {PRICING_ANNOUNCED && (
                    <div style={{ color: popular ? `rgba(${CREAM_RGB},0.5)` : `rgba(${NAVY_RGB},0.45)`, fontSize: "13px", margin: "0 0 28px" }}>{monthly}</div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                    {includes.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <Check size={16} strokeWidth={2.5} color={RUST} style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ color: popular ? `rgba(${CREAM_RGB},0.75)` : `rgba(${NAVY_RGB},0.7)`, fontSize: "14px", lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href={KAJABI_URL} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("checkout_click", { source: "academy" })} style={{
                    background: popular ? RUST : "transparent",
                    color: popular ? "#fff" : NAVY,
                    border: popular ? "none" : `2px solid ${NAVY}`,
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px",
                    padding: "13px 24px", letterSpacing: "0.04em", display: "block",
                    textAlign: "center",
                  }}>{ENROL_READY ? "Join now →" : ENROL_PENDING_LABEL}</a>
                </div>
              ))}
            </div>
            <p style={{ color: `rgba(${NAVY_RGB},0.5)`, fontSize: "13px", textAlign: "center" }}>
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
