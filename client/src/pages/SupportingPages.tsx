/**
 * EBA Supporting Pages — About, Documents, Contact
 * Design: Warm Editorial Authority
 * Palette: approved brand — jet black / white / coral / sky (see constants.ts)
 * Fonts: Poppins (brand typeface)
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
  FORM_ENDPOINT,
  COMPANY_REG,
  RUST,
  NAVY,
  CREAM,
  OAT,
  isPlaceholder,
  DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB,
  IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_BAND_BG, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT, NAV_RGB,
  WHITE, HERO_GLOW, SECTION_GLOW, ACCENT_RGB, ACCENT_GRAD, RUST_ON_DARK,
  NAV_BAR_BG, NAV_LINK, NAV_LINK_ACTIVE, NAV_BORDER, NAV_CTA_BG, NAV_CTA_TEXT,
} from "@/lib/constants";
import { SectionBreaker } from "@/components/SectionBreaker";
import { Photo } from "@/components/Photo";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track } from "@/lib/track";

// Founder photo (Mark Poulton) — client/public/.
const MARK_IMG = "/mark-conversation.jpg";

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
      { threshold: 0.06 }
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
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      ...style,
    }}>
      {children}
    </div>
  );
}

function NavBar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
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
          {[            { label: "Academy", href: "/academy" }, { label: "AI Tools", href: "/ai-tools" }, { label: "Documents", href: "/documents" }, { label: "Mentorship", href: "/mentorship" }, { label: "Our Story", href: "/our-story" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
            <Link key={label} href={href} style={{
              color: href === active ? NAV_LINK_ACTIVE : NAV_LINK,
              textDecoration: "none", fontFamily: "'Poppins', sans-serif",
              fontWeight: href === active ? 600 : 500, fontSize: "14px",
              borderBottom: href === active ? `2px solid ${NAV_LINK_ACTIVE}` : "none",
              paddingBottom: "2px",
            }}>
              {label}
            </Link>
          ))}
          <span>
            <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
              background: NAV_CTA_BG, color: NAV_CTA_TEXT, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px",
              padding: "9px 20px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "10px",
            }}>
              {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
            </a>
          </span>
        </div>
      </div>
    </nav>
  );
}

function PageFooter() {
  return <SiteFooter />;
}

// ─────────────────────────────────────────────
// OUR STORY PAGE
// ─────────────────────────────────────────────

export function OurStoryPage() {
  const isMobile = useIsMobile();
  const rule = { width: "48px", height: "3px", background: ACCENT_GRAD, borderRadius: "2px", margin: "0 0 24px" } as React.CSSProperties;
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.ourStory} />
      <MobileNav transparent={false} />
      <NavBar active="/our-story" />

      {/* 1. Hero — Why EBA exists */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "80px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <SectionLabel>Our Story</SectionLabel>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05, maxWidth: "700px",
          }}>
            Why EBA exists.
          </h1>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "600px" }}>
            Engineers are taught to build. Nobody teaches them how to run the business around the building — pricing, contracts, cash flow, compliance, people, growth. EBA exists to close that gap.
          </p>
        </div>
      </section>

      {/* 2. The operator's story */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr", gap: isMobile ? "40px" : "80px", alignItems: "start" }}>
            <RevealSection>
              <div style={{ position: "relative" }}>
                <Photo
                  src={MARK_IMG}
                  alt="Mark Poulton — Founder, Engineering Business Academy"
                  ratio="4 / 3"
                />
                <div style={{ position: "absolute", bottom: "16px", left: "16px", zIndex: 2, background: RUST, padding: "12px 18px", borderRadius: "10px" }}>
                  <p style={{ color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                    Mark Poulton — Founder, Engineering Business Academy
                  </p>
                </div>
              </div>
            </RevealSection>
            <RevealSection>
              <SectionLabel>The operator's story</SectionLabel>
              <div style={rule} />
              <h2 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 24px", lineHeight: 1.1,
              }}>
                He has actually made these decisions.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.8, margin: 0 }}>
                  Over 25 years, Mark Poulton started with a single M&E firm and built it into a substantial contracting operation.
                  {/* TODO(eba): founding year + how the single firm grew. */}
                </p>
                <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.8, margin: 0 }}>
                  He has priced the jobs, signed the contracts, carried payroll, and made the calls that don't appear in any textbook — including rebuilding the group after a pre-pack and coming back stronger.
                  {/* TODO(eba): the pre-pack and rebuild — Mark has authorised mentioning it; confirm exactly how much detail is public and how he wants it framed before adding specifics here. */}
                </p>
                <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.8, margin: 0 }}>
                  This isn't someone who read about your industry. It's someone who has run exactly the business you're running — at every stage you're trying to reach.
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 3. Why teach it now */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>Why teach it now</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
              color: ON_DARK, margin: "24px 0 28px", lineHeight: 1.1,
            }}>
              From operator to academy.
            </h2>
            <p style={{ color: `rgba(${CREAM_RGB},0.8)`, fontSize: "17px", lineHeight: 1.75, margin: 0 }}>
              The business skills it takes to run a serious M&E contracting operation aren't taught anywhere. Mark learned them the hard way, over years of running the company. EBA is him opening that up — so the next operators don't have to learn it the same way.
            </p>
            {/* TODO(eba): replace or supplement the paragraph above with Mark's own reason in his words — a short pull-quote works well here. */}
          </RevealSection>
        </div>
      </section>

      {/* Section breaker */}
      <SectionBreaker
        kicker="What EBA is"
        title="Not a course."
        accent="An operating system."
        variant="tint"
      />

      {/* 4. What EBA is */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>What EBA is</SectionLabel>
            <div style={rule} />
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.8, margin: 0 }}>
              EBA is the thing Mark wishes he'd had: a business academy, AI tools, mentorship and a document library — built for engineering services contractors, from operational experience rather than theory. The academy and the tools carry the knowledge; the mentorship and documents put it to work in your business.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* 5. CTA — navy band (ON_DARK text needs a genuinely dark surface) */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "90px 40px", textAlign: "center" }}>
        <RevealSection>
          <h2 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 28px", lineHeight: 1.05,
          }}>
            Build the business, not just the jobs.
          </h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("checkout_click", { source: "our-story" })} style={{
              background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
              padding: "15px 34px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
            }}>
              {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
            </a>
            <Link href="/mentorship" style={{
              background: "transparent", color: ON_DARK, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              padding: "15px 34px", border: `1px solid rgba(${ON_DARK_RGB},0.6)`, display: "inline-block",
            }}>
              Explore mentorship →
            </Link>
          </div>
        </RevealSection>
      </section>

      <PageFooter />
    </div>
  );
}

// ─────────────────────────────────────────────
// DOCUMENTS PAGE
// ─────────────────────────────────────────────

// Real document catalogue derived from the uploaded library
const docCategories = [
  {
    id: "hs",
    label: "Health, Safety & Environmental",
    count: 68,
    description: "A comprehensive library of health, safety and environmental documents developed and refined across 25 years of M&E contracting. Every form, permit, checklist and register your business requires — structured, compliant and ready to use.",
    highlight: "68 documents",
    docs: [
      {
        title: "Permits to Work — Full Suite (11 permits)",
        detail: "Hot works, ladder, excavation, confined space, general, electrical, sanction to test, limitation of access, isolation of supply, permit to energise, and work at height. Compliant with current legislation and suitable for use on commercial and industrial M&E projects.",
        price: "£45",
        bundle: true,
      },
      {
        title: "Risk Assessment Template",
        detail: "Structured risk assessment template for M&E installation and maintenance activities. Includes hazard identification, likelihood and severity matrix, control measures, and responsible person fields. Aligned with CDM 2015 requirements.",
        price: "£15",
      },
      {
        title: "Method Statement Template",
        detail: "Comprehensive method statement template for M&E works. Covers scope, sequence of operations, plant and equipment, PPE, emergency arrangements, and sign-off. Suitable for principal contractor submission.",
        price: "£15",
      },
      {
        title: "Small Works Method Statement & Risk Assessment",
        detail: "Combined RAMS document for minor M&E works where a full standalone method statement is disproportionate. Structured for rapid completion without sacrificing compliance.",
        price: "£12",
      },
      {
        title: "COSHH Assessment & Inventory",
        detail: "COSHH assessment template and accompanying substance inventory register. Covers hazard identification, exposure routes, control measures, and emergency procedures. Suitable for all M&E trades.",
        price: "£18",
      },
      {
        title: "Site Health & Safety Monitoring Pack (20 checklists)",
        detail: "Monthly site monitoring checklists covering: electricity, fire and emergency, hand-arm vibration, hot works, housekeeping and waste, manual handling, RAMS compliance, roof works, safe access, mobile towers, site cabins, site induction, confined spaces, work equipment, and MEWP. Designed for use by site supervisors and H&S managers.",
        price: "£55",
        bundle: true,
      },
      {
        title: "Sub-contractor RAMS Review Form",
        detail: "Structured form for reviewing and approving sub-contractor risk assessments and method statements prior to commencement of works. Includes competency checks, document reference fields, and approval sign-off.",
        price: "£12",
      },
      {
        title: "Monthly Health & Safety Report",
        detail: "Management-level monthly H&S report template covering incidents, near misses, inspections, training, and corrective actions. Suitable for board reporting and client submission.",
        price: "£20",
      },
      {
        title: "Site Induction Record & Induction Checklist",
        detail: "Site induction record form and accompanying checklist for new starters and visiting sub-contractors. Covers emergency arrangements, welfare facilities, site rules, and PPE requirements.",
        price: "£12",
      },
      {
        title: "Sub-contractor Health & Safety Register",
        detail: "Spreadsheet register for tracking sub-contractor insurance, RAMS approvals, induction records, and performance reviews across multiple projects.",
        price: "£18",
      },
      {
        title: "MEWP Inspection Checklist & Emergency Rescue Plan",
        detail: "Pre-use inspection checklist for mobile elevated work platforms and a supporting emergency rescue plan. Required documentation for any MEWP operation.",
        price: "£15",
      },
      {
        title: "Accident & Incident Investigation Form",
        detail: "Structured investigation form for accidents, incidents and near misses. Includes root cause analysis fields, immediate and long-term corrective actions, and RIDDOR assessment section.",
        price: "£12",
      },
      {
        title: "Environmental Pack (4 documents)",
        detail: "Environmental update register, environmental accident and incident investigation form, site environmental checklist, and waste management plan. Suitable for ISO 14001 aligned operations.",
        price: "£28",
        bundle: true,
      },
    ],
  },
  {
    id: "commercial",
    label: "Commercial & Financial",
    count: 28,
    description: "Commercial and financial management documents developed for M&E contracting operations. From job opening to final account, these tools provide the financial visibility and commercial control that most M&E businesses lack.",
    highlight: "28 documents",
    docs: [
      {
        title: "Cash Flow Forecast — Weekly & Monthly",
        detail: "Two-format cash flow forecasting tool: a weekly rolling forecast for short-term liquidity management and a monthly project-level forecast for programme planning. Built specifically for M&E contracting cash profiles.",
        price: "£45",
        bundle: true,
      },
      {
        title: "Monthly Project Commercial Report",
        detail: "Comprehensive project-level commercial report covering contract value, variations, applications, certified amounts, WIP, and forecast final account. Designed for monthly reporting to management and clients.",
        price: "£25",
      },
      {
        title: "Contract Costs Summary Sheet",
        detail: "Project cost tracking spreadsheet with budget versus actual analysis across labour, materials, plant, sub-contractors, and preliminaries. Provides real-time margin visibility at project level.",
        price: "£20",
      },
      {
        title: "Variation Template 2025",
        detail: "Professional variation order template with instruction reference, scope description, valuation breakdown, and approval workflow. Updated for current commercial practice.",
        price: "£15",
      },
      {
        title: "Variation Register",
        detail: "Spreadsheet register for tracking all variations across a project — instruction date, scope, submitted value, agreed value, and status. Essential for final account management.",
        price: "£15",
      },
      {
        title: "Sub-contractor Application for Payment",
        detail: "Structured application for payment template for use with sub-contractors. Includes contract sum, variations, materials on site, retention, and previous certified amounts.",
        price: "£15",
      },
      {
        title: "Sub-contractor Final Account Statement",
        detail: "Final account statement template for sub-contractor settlement. Covers contract sum, all agreed variations, contra charges, and final balance calculation.",
        price: "£15",
      },
      {
        title: "Project Final Account Statement",
        detail: "Main contract final account statement template. Structured for submission to clients at project completion, covering all contract sums, variations, loss and expense, and final balance.",
        price: "£18",
      },
      {
        title: "Bid / No-Bid Summary",
        detail: "Structured decision framework for evaluating tender opportunities before committing resource. Covers client relationship, scope fit, risk profile, margin expectation, and programme capacity.",
        price: "£12",
      },
      {
        title: "Subcontract Tender Enquiry & Pre-Let Minutes",
        detail: "Formal sub-contractor tender enquiry document and accompanying pre-let meeting minutes template. Ensures commercial terms, scope, and programme are agreed and documented before appointment.",
        price: "£18",
        bundle: true,
      },
      {
        title: "Daywork Sheet",
        detail: "Compliant daywork sheet for recording labour, plant and materials on instructed daywork. Formatted for client countersignature and subsequent application for payment.",
        price: "£10",
      },
      {
        title: "Early Warning Notice",
        detail: "Formal early warning notice template for NEC and bespoke contracts. Structured to meet contractual notification requirements and protect the contractor's commercial position.",
        price: "£12",
      },
      {
        title: "Credit Control Letters (2 templates)",
        detail: "Two-stage credit control letter sequence for overdue invoices. Professional in tone, legally considered, and structured to prompt payment without damaging the client relationship.",
        price: "£15",
        bundle: true,
      },
    ],
  },
  {
    id: "technical",
    label: "Technical & Commissioning",
    count: 45,
    description: "Technical documentation and commissioning records for M&E installations. Service and commissioning sheets covering all principal M&E systems, alongside drawing registers, equipment schedules, and quality checklists.",
    highlight: "45 documents",
    docs: [
      {
        title: "Service & Maintenance Record Sheet",
        detail: "Standard service and maintenance record for M&E plant and equipment. Records service date, engineer, works carried out, defects identified, and next service date. Suitable for all planned preventative maintenance regimes.",
        price: "£10",
      },
      {
        title: "Commissioning Sheets — Heating Systems",
        detail: "Commissioning and service record sheets for heating systems including boilers, heat exchangers, pressurisation units, and associated controls. Aligned with BSRIA and manufacturer requirements.",
        price: "£25",
      },
      {
        title: "Commissioning Sheets — Air Conditioning & Ventilation",
        detail: "Commissioning and service record sheets for air conditioning and ventilation systems including AHUs, FCUs, VRF/VRV, and associated ductwork. Suitable for REFCOM and F-Gas compliance.",
        price: "£25",
      },
      {
        title: "Commissioning Sheets — Electrical Systems",
        detail: "Commissioning and service record sheets for LV electrical installations including distribution boards, containment, lighting, and small power. Aligned with BS 7671 requirements.",
        price: "£20",
      },
      {
        title: "Commissioning Sheets — Domestic Services",
        detail: "Commissioning and service record sheets for domestic services including cold water, hot water, sanitary systems, and associated plant.",
        price: "£20",
      },
      {
        title: "Drawing Registers — Mechanical & Electrical",
        detail: "Separate drawing registers for mechanical and electrical disciplines. Tracks drawing number, revision, title, issue date, and distribution. Essential for document control on construction projects.",
        price: "£18",
        bundle: true,
      },
      {
        title: "Technical Submission Register & Template",
        detail: "Register for tracking technical submissions to clients and consultants, and a structured submission template. Covers product data, installation instructions, and approval status.",
        price: "£18",
        bundle: true,
      },
      {
        title: "Equipment Schedule Templates",
        detail: "Equipment schedule templates for principal M&E systems. Structured for use during design, procurement, and handover stages.",
        price: "£20",
      },
      {
        title: "F-Gas & Gas Safe Registers",
        detail: "Compliance registers for F-Gas and Gas Safe obligations. Tracks engineer certificates, equipment records, and inspection dates.",
        price: "£18",
        bundle: true,
      },
      {
        title: "Outstanding Works & Defects List",
        detail: "Structured defects and outstanding works register for use during the practical completion and defects liability period. Tracks item, location, responsible party, target date, and close-out.",
        price: "£12",
      },
      {
        title: "Fire Damper Drop Test Schedules",
        detail: "Fire damper inspection and drop test schedule for use in compliance with BS 9999 and HTM requirements. Records damper reference, location, test date, result, and remedial action.",
        price: "£15",
      },
    ],
  },
  {
    id: "subcontract",
    label: "Sub-contractor Scope of Works",
    count: 9,
    description: "Professionally drafted sub-contractor scope of works documents for the principal M&E trades. Each document defines the scope, programme obligations, quality requirements, and interface responsibilities for the relevant trade.",
    highlight: "9 documents",
    docs: [
      {
        title: "Electrical Installation — Scope of Works",
        detail: "Comprehensive scope of works for electrical installation sub-contractors. Covers containment, wiring, distribution, testing, commissioning, and handover obligations.",
        price: "£20",
      },
      {
        title: "General Mechanical Installation — Scope of Works",
        detail: "Scope of works for general mechanical installation sub-contractors covering pipework, plant installation, insulation interfaces, and commissioning obligations.",
        price: "£20",
      },
      {
        title: "Ductwork — Scope of Works",
        detail: "Scope of works for ductwork sub-contractors covering fabrication, installation, testing, and commissioning of ventilation and extract systems.",
        price: "£18",
      },
      {
        title: "BMS — Scope of Works",
        detail: "Scope of works for building management system sub-contractors. Defines control philosophy, points schedule, commissioning obligations, and software handover requirements.",
        price: "£20",
      },
      {
        title: "Commissioning — Scope of Works",
        detail: "Scope of works for specialist commissioning sub-contractors. Covers pre-commissioning checks, system commissioning, witnessed testing, and documentation requirements.",
        price: "£18",
      },
      {
        title: "Design — Scope of Works",
        detail: "Scope of works for design sub-contractors. Covers design deliverables, review and approval process, BIM requirements, and design liability obligations.",
        price: "£20",
      },
      {
        title: "Insulation — Scope of Works",
        detail: "Scope of works for insulation sub-contractors covering pipework, ductwork, and equipment insulation to specification.",
        price: "£15",
      },
      {
        title: "Medical Pipeline — Scope of Works",
        detail: "Scope of works for medical pipeline sub-contractors. Covers HTM 02-01 compliance, pressure testing, validation, and handover documentation requirements.",
        price: "£22",
      },
      {
        title: "Flue Systems — Scope of Works",
        detail: "Scope of works for flue system installation sub-contractors. Covers design coordination, installation, testing, and regulatory compliance obligations.",
        price: "£15",
      },
    ],
  },
  {
    id: "hr",
    label: "Human Resources & Employment",
    count: 38,
    description: "A complete HR document library for M&E businesses. Employment contracts, onboarding packs, absence management, training records, and all supporting HR administration — developed for the specific employment structures of M&E contracting.",
    highlight: "38 documents",
    docs: [
      {
        title: "Employment Contracts — Full Suite (4 contracts)",
        detail: "Professionally drafted employment contracts for: site engineer, office-based staff, office-based staff with company vehicle, and apprentice engineer. All compliant with current employment legislation.",
        price: "£65",
        bundle: true,
      },
      {
        title: "Employee Handbook",
        detail: "Comprehensive employee handbook covering company policies, disciplinary and grievance procedures, absence management, health and safety obligations, and employment terms. Suitable for use as the primary HR policy document.",
        price: "£45",
      },
      {
        title: "Recruitment & Onboarding Pack",
        detail: "Application form, interview checklist, new starter information form, equal opportunities monitoring form, and induction checklist. Provides a structured process from application to first day.",
        price: "£35",
        bundle: true,
      },
      {
        title: "H&S Induction Checklist",
        detail: "Health and safety induction checklist for new employees and site visitors. Covers emergency procedures, welfare facilities, site rules, PPE, and reporting obligations.",
        price: "£10",
      },
      {
        title: "Employee Training Record",
        detail: "Individual training record for tracking qualifications, certifications, and training completions. Suitable for CSCS, IPAF, PASMA, gas safe, and all trade-specific training.",
        price: "£10",
      },
      {
        title: "Apprenticeship Scheme Documentation",
        detail: "Apprenticeship scheme overview and supporting documentation including the apprentice employment contract and scheme structure. Developed from an active M&E apprenticeship programme.",
        price: "£25",
      },
      {
        title: "Absence & Leave Management Pack",
        detail: "Absence record, holiday request forms (individual and team), return to work form, and maternity, paternity, and adoption leave notification documents.",
        price: "£28",
        bundle: true,
      },
      {
        title: "DSE Assessment",
        detail: "Display screen equipment assessment form for office-based staff. Compliant with the Health and Safety (Display Screen Equipment) Regulations 1992.",
        price: "£10",
      },
      {
        title: "Exit Interview & Termination Checklist",
        detail: "Structured exit interview form and termination checklist covering equipment return, system access removal, and final pay calculation.",
        price: "£12",
        bundle: true,
      },
    ],
  },
  {
    id: "manuals",
    label: "O&M Manuals & HSEQ Manual",
    count: 6,
    description: "Complete manual templates for technical services operations. The O&M manual structure and the site HSEQ manual represent the handover and operational documentation that every M&E contractor is contractually required to produce.",
    highlight: "6 manual templates",
    docs: [
      {
        title: "Technical Services O&M Manual — Full Structure (7 sections)",
        detail: "Complete O&M manual template structured across seven sections: cover sheet, introduction, description of works, maintenance procedures, manufacturers directory, technical literature register, commissioning data, and as-fitted drawings register. The definitive template for M&E handover documentation.",
        price: "£85",
        bundle: true,
      },
      {
        title: "Technical Services Maintenance Manual (10 sections)",
        detail: "Comprehensive maintenance manual template for ongoing technical services operations. Covers planned preventative maintenance schedules, reactive maintenance procedures, and compliance documentation across all principal M&E systems.",
        price: "£75",
        bundle: true,
      },
      {
        title: "Site HSEQ Manual",
        detail: "Site-level health, safety, environment and quality manual. Provides the overarching management framework for HSEQ on construction and maintenance projects. Suitable for use as the principal contractor's project-specific HSEQ plan.",
        price: "£55",
      },
      {
        title: "LV Operations & Verification Manual",
        detail: "Operations and verification manual templates for low voltage electrical installations. Covers system description, operational procedures, verification records, and emergency arrangements.",
        price: "£35",
        bundle: true,
      },
    ],
  },
];

const BUNDLE_PRICES: Record<string, { label: string; price: string; saving: string }> = {
  hs: { label: "Complete H&S & Environmental Library", price: "£195", saving: "Save over £80 vs individual" },
  commercial: { label: "Complete Commercial & Financial Pack", price: "£175", saving: "Save over £60 vs individual" },
  technical: { label: "Complete Technical & Commissioning Pack", price: "£145", saving: "Save over £55 vs individual" },
  subcontract: { label: "Complete Subcontract Scope of Works Pack", price: "£125", saving: "Save over £45 vs individual" },
  hr: { label: "Complete HR & Employment Library", price: "£165", saving: "Save over £70 vs individual" },
  manuals: { label: "Complete Manuals Pack", price: "£195", saving: "Save over £55 vs individual" },
};

export function DocumentsPage() {
  const [openCategory, setOpenCategory] = useState<string | null>("hs");
  const isMobile = useIsMobile();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.documents} />
      <MobileNav transparent={false} />
      <NavBar active="/documents" />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "80px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <SectionLabel>Document Library</SectionLabel>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05, maxWidth: "720px",
          }}>
            380 documents. 25 years of M&E practice.
          </h1>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "580px", margin: "0 0 32px" }}>
            Every document in this library was developed and used in the operation of a principal M&E contracting business. These are not generic templates. They are the actual forms, registers, contracts, and procedures that a serious M&E business requires.
          </p>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { value: "380", label: "Documents" },
              { value: "6", label: "Categories" },
              { value: "Academy", label: "Members get all included" },
            ].map(({ value, label }) => (
              <div key={label} style={{ borderLeft: `3px solid ${RUST_ON_DARK}`, paddingLeft: "16px" }}>
                <p style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST_ON_DARK, fontSize: "1.4rem", fontWeight: 700, margin: "0 0 4px" }}>{value}</p>
                <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy banner */}
      <div style={{ background: CTA_BAND_BG, padding: isMobile ? "16px 20px" : "16px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "16px" }}>
          <p style={{ color: NAVY, fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontWeight: 500, margin: 0 }}>
            <strong>Academy members receive the complete document library as part of their membership</strong> — no additional purchase required.
          </p>
          <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("checkout_click", { source: "documents" })} style={{
            background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "12px",
            padding: "8px 18px", letterSpacing: "0.04em", display: "inline-block", flexShrink: 0, borderRadius: "6px",
          }}>
            {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
          </a>
        </div>
      </div>

      {/* Photo band */}
      <div style={{ position: "relative", width: "100%", height: isMobile ? "240px" : "380px", overflow: "hidden" }}>
        <img src="/site-fitout.jpg" alt="A live M&E project — the environment these documents were built for" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 45%", display: "block" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(${NAVY_RGB},0.74) 0%, rgba(${NAVY_RGB},0.4) 45%, rgba(${ACCENT_RGB},0.28) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", width: "100%" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: "14px" }}>· Browse the library ·</div>
            <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, color: "#fff", fontSize: isMobile ? "1.5rem" : "clamp(1.8rem, 3.4vw, 2.8rem)", lineHeight: 1.12, letterSpacing: "-0.015em", maxWidth: "640px", margin: 0 }}>
              Everything an M&amp;E business actually runs on.
            </p>
          </div>
        </div>
      </div>

      {/* Document categories */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Category navigation */}
          <RevealSection style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
              {docCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
                  style={{
                    background: openCategory === cat.id ? NAVY : "#fff",
                    color: openCategory === cat.id ? "#fff" : NAVY,
                    border: "none", cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    padding: "10px 18px", transition: "all 0.2s",
                  }}
                >
                  {cat.label}
                  <span style={{
                    marginLeft: "8px",
                    background: openCategory === cat.id ? RUST : OAT,
                    color: openCategory === cat.id ? "#fff" : `rgba(${NAVY_RGB},0.6)`,
                    fontSize: "10px", padding: "2px 7px",
                    transition: "all 0.2s",
                  }}>
                    {cat.highlight}
                  </span>
                </button>
              ))}
            </div>
          </RevealSection>

          {/* Active category */}
          {docCategories.map((cat) => openCategory === cat.id && (
            <div key={cat.id} style={{ animation: "expandIn 0.25s ease-out" }}>
              <RevealSection style={{ marginBottom: "40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: isMobile ? "32px" : "48px", alignItems: "start" }}>
                  <div>
                    <h2 style={{
                      fontFamily: "var(--eba-heading)", fontWeight: 800,
                      fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.02em",
                      color: NAVY, margin: "0 0 16px",
                    }}>
                      {cat.label}
                    </h2>
                    <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "15px", lineHeight: 1.75, margin: 0 }}>
                      {cat.description}
                    </p>
                  </div>
                  <div style={{ background: DARK_GRADIENT, padding: "24px 24px", borderLeft: `3px solid ${RUST}` }}>
                    <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
                      Complete Pack
                    </p>
                    <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, color: ON_DARK, fontSize: "1.1rem", margin: "0 0 4px" }}>
                      {BUNDLE_PRICES[cat.id].label}
                    </p>
                    <p style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST, fontSize: "1.4rem", fontWeight: 700, margin: "0 0 6px" }}>
                      {BUNDLE_PRICES[cat.id].price}
                    </p>
                    <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "12px", margin: "0 0 16px" }}>
                      {BUNDLE_PRICES[cat.id].saving}
                    </p>
                    <Link href="/contact" style={{
                      background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                      fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px",
                      padding: "9px 18px", letterSpacing: "0.04em", display: "inline-block",
                    }}>
                      Purchase pack →
                    </Link>
                  </div>
                </div>
              </RevealSection>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {cat.docs.map((doc, i) => (
                  <RevealSection key={i} style={{ transitionDelay: `${i * 30}ms` }}>
                    <div style={{
                      background: WHITE, borderLeft: `3px solid ${doc.bundle ? RUST : OAT}`,
                      padding: "20px 24px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
                      gap: isMobile ? "12px" : "24px", alignItems: "start",
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                          <h4 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1rem", color: NAVY, margin: 0 }}>
                            {doc.title}
                          </h4>
                          {doc.bundle && (
                            <span style={{
                              background: `rgba(${RUST_RGB},0.12)`, color: RUST,
                              fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                              fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase",
                              padding: "2px 8px",
                            }}>
                              Pack
                            </span>
                          )}
                        </div>
                        <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.65, margin: 0 }}>
                          {doc.detail}
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px" }}>
                          {doc.price}
                        </p>
                        <Link href="/contact" style={{
                          background: CTA_DARK_BG, color: "#fff", textDecoration: "none",
                          fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px",
                          padding: "7px 14px", letterSpacing: "0.04em", display: "inline-block",
                          whiteSpace: "nowrap",
                        }}>
                          Purchase →
                        </Link>
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>

              <RevealSection style={{ marginTop: "32px" }}>
                <div style={{ background: OAT, padding: "24px 28px", borderLeft: `3px solid rgba(${NAVY_RGB},0.2)` }}>
                  <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.65, margin: 0 }}>
                    All documents are provided in editable Microsoft Word or Excel format. Academy members receive the complete library — all 380 documents across all six categories — as part of their membership. To enquire about volume licensing or bespoke document development, please{" "}
                    <Link href="/contact" style={{ color: RUST, textDecoration: "none", fontWeight: 600 }}>contact us</Link>.
                  </p>
                </div>
              </RevealSection>
            </div>
          ))}

          {/* CTA if nothing open */}
          {!openCategory && (
            <RevealSection>
              <div style={{ background: DARK_GRADIENT, padding: isMobile ? "32px 20px" : "48px 48px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "24px" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.6rem", color: ON_DARK, margin: "0 0 8px" }}>
                    Select a category above to browse the library.
                  </h3>
                  <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "15px", margin: 0 }}>
                    Or join the Academy and receive all 380 documents as part of your membership.
                  </p>
                </div>
                <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("checkout_click", { source: "documents" })} style={{
                  background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                  padding: "14px 32px", letterSpacing: "0.04em", display: "inline-block", flexShrink: 0,
                }}>
                  {ENROL_READY ? "Apply for the Founding Cohort →" : ENROL_PENDING_LABEL}
                </a>
              </div>
            </RevealSection>
          )}
        </div>
      </section>

      <PageFooter />
      <style>{`@keyframes expandIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", enquiry: "academy", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fail safe: never fake "received" when there is nowhere to send it.
    if (isPlaceholder(FORM_ENDPOINT)) {
      setError("The enquiry form isn't live yet — please email us directly in the meantime.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-enquiry" }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again, or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: WHITE, border: `1px solid ${OAT}`,
    padding: "12px 16px", fontFamily: "'Poppins', sans-serif", fontSize: "15px",
    color: NAVY, outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.contact} />
      <MobileNav transparent={false} />
      <NavBar active="/contact" />

      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "80px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr", gap: isMobile ? "36px" : "64px", alignItems: "center" }}>
          <div>
            <SectionLabel>Enquiries</SectionLabel>
            <h1 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 900,
              fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
              color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05,
            }}>
              Get in touch.
            </h1>
            <p style={{ color: `rgba(${CREAM_RGB},0.7)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "480px" }}>
              Academy enrolment, document purchases, AI tool enquiries, white-label deployments, and mentorship applications. Use the form below and we will respond within two working days.
            </p>
          </div>

          {/* Response card — fills the hero and sets expectations */}
          <div style={{
            background: `rgba(${CREAM_RGB},0.06)`,
            border: `1px solid rgba(${CREAM_RGB},0.16)`,
            borderRadius: "18px", padding: isMobile ? "24px" : "28px 30px",
            backdropFilter: "blur(6px)",
          }}>
            {[
              { k: "Response time", v: "Within 2 working days" },
              { k: "Founding cohort", v: ENROL_READY ? "Enrolling now" : "Opening soon — join the waitlist" },
              { k: "AI tools", v: "Pay-per-use or subscription" },
              { k: "Mentorship", v: "By application · limited places" },
            ].map(({ k, v }, i, arr) => (
              <div key={k} style={{
                padding: "14px 0",
                borderBottom: i < arr.length - 1 ? `1px solid rgba(${CREAM_RGB},0.12)` : "none",
              }}>
                <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>{k}</p>
                <p style={{ color: ON_DARK, fontFamily: "'Poppins', sans-serif", fontSize: "15px", fontWeight: 600, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: isMobile ? "40px" : "80px" }}>
            <RevealSection>
              {submitted ? (
                <div style={{ background: DARK_GRADIENT, padding: "48px", borderLeft: `4px solid ${RUST}` }}>
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, color: ON_DARK, fontSize: "1.5rem", margin: "0 0 12px" }}>
                    Enquiry received.
                  </h3>
                  <p style={{ color: `rgba(${CREAM_RGB},0.7)`, fontSize: "15px", margin: 0 }}>
                    We will respond within two working days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: "8px" }}>Name</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} onFocus={e => (e.target.style.borderColor = RUST)} onBlur={e => (e.target.style.borderColor = OAT)} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: "8px" }}>Email</label>
                      <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} onFocus={e => (e.target.style.borderColor = RUST)} onBlur={e => (e.target.style.borderColor = OAT)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: "8px" }}>Company</label>
                    <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={inputStyle} onFocus={e => (e.target.style.borderColor = RUST)} onBlur={e => (e.target.style.borderColor = OAT)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: "8px" }}>Enquiry type</label>
                    <select value={form.enquiry} onChange={e => setForm(f => ({ ...f, enquiry: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }} onFocus={e => (e.target.style.borderColor = RUST)} onBlur={e => (e.target.style.borderColor = OAT)}>
                      <option value="academy">Academy — Founding Cohort Enrolment</option>
                      <option value="documents">Document Library — Purchase Enquiry</option>
                      <option value="om-manual">AI Tool — O&M Manual Compiler</option>
                      <option value="chatbot">AI Tool — Compliance Co-Pilot</option>
                      <option value="white-label">AI Tool — White-Label Deployment</option>
                      <option value="mentorship">Mentorship — Application</option>
                      <option value="other">General Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY, marginBottom: "8px" }}>Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => (e.target.style.borderColor = RUST)} onBlur={e => (e.target.style.borderColor = OAT)} />
                  </div>
                  {error && (
                    <p style={{ color: RUST, fontSize: "13px", margin: 0 }} role="alert">{error}</p>
                  )}
                  <button type="submit" disabled={loading} style={{
                    background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, border: "none", cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
                    padding: "14px 32px", letterSpacing: "0.04em", alignSelf: "flex-start",
                    opacity: loading ? 0.7 : 1,
                    transition: "opacity 0.2s, transform 0.16s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = loading ? "0.7" : "1")}
                    onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {loading ? "Sending..." : "Submit enquiry →"}
                  </button>
                </form>
              )}
            </RevealSection>

            <RevealSection>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {[
                  { label: "Academy enrolment", detail: "Questions regarding the founding cohort, curriculum, pricing, or access. Select Academy in the enquiry type." },
                  { label: "Document purchases", detail: "Individual documents or complete category packs. We will confirm availability and provide a payment link within two working days." },
                  { label: "AI tool enquiries", detail: "Demonstrations of the O&M Manual Compiler or Compliance Co-Pilot can be arranged on request. Select the relevant tool." },
                  { label: "White-label deployments", detail: "For organisations requiring a managed compliance chatbot deployment. Please describe your organisation and approximate document volume." },
                  { label: "Mentorship applications", detail: "Places are limited and allocated by application. Please describe your business, turnover range, and the specific challenges you are seeking to address." },
                ].map(({ label, detail }) => (
                  <div key={label} style={{ background: WHITE, borderLeft: `3px solid ${OAT}`, padding: "20px 20px" }}>
                    <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, color: NAVY, fontSize: "0.95rem", margin: "0 0 6px" }}>{label}</p>
                    <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.65, margin: 0 }}>{detail}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
