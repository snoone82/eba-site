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
  WHITE, HERO_GLOW, SECTION_GLOW, ACCENT_RGB, ACCENT_GRAD, RUST_ON_DARK, SHOW_DOC_PRICES, MARK_PHOTO_STORY, LIBRARY_HREF, PRICING,
  ENROL_DOCS_HREF, ENROL_DOCS_READY,
  NAV_BAR_BG, NAV_LINK, NAV_LINK_ACTIVE, NAV_BORDER, NAV_CTA_BG, NAV_CTA_TEXT,
} from "@/lib/constants";
import { SectionBreaker } from "@/components/SectionBreaker";
import { Photo } from "@/components/Photo";
import { TeachingPanel } from "@/components/TeachingPanel";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track } from "@/lib/track";

// Founder photo (Mark Poulton) — client/public/.
// TODO(eba): real-photo swap is constants-only (MARK_PHOTO_* in constants.ts).
const MARK_IMG = MARK_PHOTO_STORY;

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
          <EBALogo height={48} light navOnCobalt />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {[            { label: "Academy", href: "/academy" }, { label: "AI Tools", href: "/ai-tools" }, { label: "Documents", href: "/documents" }, { label: "Mentorship", href: "/mentorship" }, { label: "Pricing", href: "/pricing" }, { label: "Our Story", href: "/our-story" }].map(({ label, href }) => (
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
              {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
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
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05, maxWidth: "800px",
          }}>
            Why The Engineering Business Academy exists.
          </h1>
          {/* Copy per Mark's final Our Story schedule (20 Sep 2026). No absolute
              claims ("nobody teaches this", "exactly the business you're running")
              and no credibility-by-comparison with other coaches or courses. */}
          {[
            "Technical expertise is only one part of running a successful engineering business.",
            "Building the business around the work - commercial control, cash flow, contracts, people, systems, leadership and growth - brings a completely different set of challenges.",
            "The Engineering Business Academy was created to share practical knowledge, tools and experience developed through actually running and growing engineering businesses.",
          ].map((p, i, arr) => (
            <p key={i} style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "640px", margin: i === arr.length - 1 ? 0 : "0 0 14px" }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* 2. Real-world experience */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr", gap: isMobile ? "40px" : "80px", alignItems: "start" }}>
            <RevealSection>
              <div style={{ position: "relative" }}>
                {/* Stock portraiture retired 5 Aug. The slot carries the substance
                    instead. Three headline proof points per Mark (20 Sep 2026); the
                    pre-pack experience stays in the narrative, not the strip. */}
                <TeachingPanel
                  kicker="Real-world experience"
                  heading="Built from experience inside engineering businesses."
                  attribution="Mark Poulton — Founder, The Engineering Business Academy"
                  rows={[
                    { figure: "1 → Group", label: "From one engineering business to a multi-division group" },
                    { figure: "UK + Europe", label: "Businesses and operations across the UK and Europe" },
                    { figure: "Decades", label: "Of practical engineering-business experience" },
                  ]}
                  onDark={false}
                />
              </div>
            </RevealSection>
            <RevealSection>
              <SectionLabel>The founder</SectionLabel>
              <div style={rule} />
              <h2 style={{
                fontFamily: "var(--eba-heading)", fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
                color: NAVY, margin: "0 0 24px", lineHeight: 1.1,
              }}>
                Experience from building and leading engineering businesses.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.8, margin: 0 }}>
                  Across decades in the industry, Mark Poulton has built, led and grown engineering businesses from individual operations into a wider multi-division group.
                </p>
                <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.8, margin: 0 }}>
                  Along the way, he has dealt first-hand with the realities of running and scaling a business: winning work, pricing projects, negotiating contracts, managing cash and payroll, building leadership teams, launching new divisions, entering new markets and making difficult decisions when circumstances change.
                </p>
                <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.8, margin: 0 }}>
                  That journey has included periods of strong growth as well as significant challenge, restructuring and rebuilding. The lessons from both have shaped the practical thinking, systems and approach behind The Engineering Business Academy.
                </p>
              </div>
              <a href="https://uk.linkedin.com/in/mark-poulton-8221772b" target="_blank" rel="noopener noreferrer" onClick={() => track("cta_our_story_linkedin")} style={{
                display: "inline-block", marginTop: "24px",
                color: RUST, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                letterSpacing: "0.04em", borderBottom: `1px solid ${RUST}`, paddingBottom: "2px",
              }}>
                View Mark Poulton's LinkedIn profile →
              </a>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 3. Why create the Academy? */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>The Academy</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
              color: ON_DARK, margin: "24px 0 28px", lineHeight: 1.1,
            }}>
              Why create the Academy?
            </h2>
            {[
              "Much of what owners and leaders need to know about running an engineering business is learned through experience.",
              "Over the years, Mark built processes, procedures, commercial controls, leadership structures and ways of working to deal with the challenges that came with growing the businesses around him.",
              "The Engineering Business Academy brings that experience together in one place so other owners and leaders can learn from it, adapt it to their own businesses and make better-informed decisions as they grow.",
            ].map((p, i, arr) => (
              <p key={i} style={{ color: `rgba(${CREAM_RGB},0.8)`, fontSize: "17px", lineHeight: 1.75, margin: i === arr.length - 1 ? 0 : "0 0 16px" }}>
                {p}
              </p>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* Section breaker */}
      <SectionBreaker
        kicker="What we offer"
        title="More than"
        accent="the Academy alone."
        variant="tint"
      />

      {/* 4. What the Academy brings together */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>What we offer</SectionLabel>
            <div style={rule} />
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.8, margin: "0 0 16px" }}>
              The Engineering Business Academy brings together practical business learning, a comprehensive document library, AI tools and agents, and access to mentorship - all developed around the realities of running engineering and technical services businesses, and built for owners and leaders of engineering and technical services businesses.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.78)`, fontSize: "17px", lineHeight: 1.8, margin: 0 }}>
              The aim is to provide owners and leaders with practical knowledge and resources they can use as they build stronger, better-run businesses.
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
              {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
            </a>
            <Link href="/mentorship" style={{
              background: "transparent", color: ON_DARK, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              padding: "15px 34px", border: `1px solid rgba(${ON_DARK_RGB},0.6)`, display: "inline-block",
            }}>
              Explore Mentorship →
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

// Real document catalogue derived from the uploaded library. Wording follows
// Mark's Documents page amendment schedule (19 Sep 2026): practical, editable
// starting points developed from real engineering-business experience, never
// "compliant", "ready to issue" or "suitable for all". Counts to be verified
// before launch (Mark's note, section 7).
type DocCategory = {
  id: string; label: string; count: number; highlight: string;
  description: string[]; availability: string;
  note: { title: string; body: string };
  docs: { title: string; detail: string; price: string; bundle?: boolean }[];
};
const docCategories: DocCategory[] = [
  {
    id: "hs",
    label: "Health, Safety & Environmental",
    count: 68,
    highlight: "68 documents",
    description: [
      "A practical library of health, safety and environmental forms, permits, checklists, registers and supporting documents developed through real engineering operations.",
      "The documents provide a strong starting point for building consistent HSEQ processes within your business and can be edited to suit your activities, clients, projects and management systems.",
      "All health, safety and compliance documents should be reviewed and adapted by a competent person before use.",
    ],
    availability: "Available as a complete document pack.",
    note: {
      title: "Built to support consistent HSEQ processes.",
      body: "These documents provide practical structures for recording and managing health, safety and environmental information. They should be reviewed and adapted to the particular business, activity, project and applicable requirements before use.",
    },
    docs: [
      {
        title: "Permits to Work — Full Suite (11 permits)",
        detail: "A suite of editable permit templates covering hot works, ladders, excavation, confined spaces, general works, electrical activities, sanction to test, limitation of access, isolation of supply, energisation and work at height. Designed to provide a structured starting point that can be adapted to your own procedures, projects and risk controls.",
        price: "£45",
        bundle: true,
      },
      {
        title: "Risk Assessment Template",
        detail: "Structured risk assessment template designed for engineering installation, service and maintenance activities. Includes hazard identification, likelihood and severity assessment, control measures and responsibility fields. Designed to be adapted to the specific task, environment and risks involved.",
        price: "£15",
      },
      {
        title: "Method Statement Template",
        detail: "Structured method statement template covering scope, sequence of operations, plant and equipment, PPE, emergency arrangements, responsibilities and sign-off. Designed to help engineering teams prepare consistent project-specific method statements for review and submission.",
        price: "£15",
      },
      {
        title: "Small Works Method Statement & Risk Assessment",
        detail: "Combined risk assessment and method statement template designed for smaller engineering works where a concise document is appropriate. Provides a structured way to capture the task, hazards, controls, working method and responsibilities without unnecessary complexity.",
        price: "£12",
      },
      {
        title: "COSHH Assessment & Inventory",
        detail: "COSHH assessment template and accompanying substance inventory register covering hazard information, exposure routes, control measures and emergency arrangements. Designed to support consistent recording and management of substances used across engineering and technical services activities.",
        price: "£18",
      },
      {
        title: "Site Health & Safety Monitoring Pack (20 checklists)",
        detail: "A practical suite of site-monitoring checklists covering areas including electrical safety, fire and emergency arrangements, vibration, hot works, housekeeping, manual handling, RAMS, roof works, access, towers, welfare, inductions, confined spaces, work equipment and MEWPs. Designed to support structured site inspections and consistent recording by supervisors, managers and HSEQ teams.",
        price: "£55",
        bundle: true,
      },
      {
        title: "Subcontractor RAMS Review Form",
        detail: "Structured form for reviewing subcontractor risk assessments and method statements before work begins. Includes document references, review prompts, competency considerations, actions and sign-off fields.",
        price: "£12",
      },
      {
        title: "Monthly Health & Safety Report",
        detail: "Monthly H&S reporting template covering incidents, near misses, inspections, training, actions and other key safety information. Designed to provide management teams with a consistent overview of health and safety performance and outstanding actions.",
        price: "£20",
      },
      {
        title: "Site Induction Record & Induction Checklist",
        detail: "Site induction record and supporting checklist covering emergency arrangements, welfare, site rules, PPE, key risks and other project-specific information. Designed to provide a consistent record of site induction for employees, subcontractors and visitors where appropriate.",
        price: "£12",
      },
      {
        title: "Subcontractor Health & Safety Register",
        detail: "Editable register for maintaining key subcontractor health and safety information, including insurance details, RAMS status, inductions, reviews and other relevant records across projects.",
        price: "£18",
      },
      {
        title: "MEWP Inspection Checklist & Emergency Rescue Plan",
        detail: "Pre-use MEWP inspection checklist together with a supporting emergency rescue-plan template. Designed to help teams document equipment checks, responsibilities and rescue arrangements relevant to the planned activity.",
        price: "£15",
      },
      {
        title: "Accident & Incident Investigation Form",
        detail: "Structured form for investigating accidents, incidents and near misses, including immediate actions, contributing factors, root-cause analysis, corrective actions and reporting considerations.",
        price: "£12",
      },
      {
        title: "Environmental Pack (4 documents)",
        detail: "Includes an environmental update register, environmental incident investigation form, site environmental checklist and waste management plan. Designed to support more consistent environmental management and record keeping within engineering businesses. Where relevant, the documents can support organisations operating within an ISO 14001-aligned environmental management system.",
        price: "£28",
        bundle: true,
      },
    ],
  },
  {
    id: "commercial",
    label: "Commercial & Financial",
    count: 28,
    highlight: "28 documents",
    description: [
      "Practical commercial and financial documents developed around the way engineering businesses manage projects, costs, cash and contractual obligations.",
      "From assessing opportunities and opening projects through to variations, applications, cost control and final account, the documents are designed to support stronger commercial discipline and greater visibility across the project lifecycle.",
    ],
    availability: "Available as a complete commercial and financial document pack.",
    note: {
      title: "Built to support stronger commercial discipline.",
      body: "These documents provide practical structures for managing project information, costs, cash, variations, subcontractors and contractual communication. They should be adapted to your own commercial procedures and, where contractual rights or obligations are involved, checked against the specific terms of the relevant contract.",
    },
    docs: [
      {
        title: "Cash Flow Forecast — Weekly & Monthly",
        detail: "Two editable cash flow forecasting tools: a weekly rolling forecast for short-term cash visibility and a monthly forecast for longer-term planning. Designed to help engineering businesses understand expected cash movements, identify pressure points earlier and make better-informed financial decisions.",
        price: "£45",
        bundle: true,
      },
      {
        title: "Monthly Project Commercial Report",
        detail: "Structured monthly commercial report covering contract value, variations, applications, certified amounts, costs, WIP and forecast final account. Designed to give project and management teams a consistent view of commercial performance, outstanding issues and expected project outcome.",
        price: "£25",
      },
      {
        title: "Contract Costs Summary Sheet",
        detail: "Project cost-tracking spreadsheet comparing budget and actual costs across labour, materials, plant, subcontractors, preliminaries and other key cost headings. Designed to improve visibility of project cost performance and help teams identify changes to forecast margin as the job progresses.",
        price: "£20",
      },
      {
        title: "Variation Template",
        detail: "Structured variation template covering instruction reference, scope, valuation breakdown, programme implications, supporting information and approval status. Designed to help teams record and present variations consistently from identification through to agreement.",
        price: "£15",
      },
      {
        title: "Variation Register",
        detail: "Editable register for tracking variations throughout a project, including instruction date, description, submitted value, agreed value, status and other key commercial information. Designed to give commercial and project teams a clear view of outstanding and agreed variations throughout the job.",
        price: "£15",
      },
      {
        title: "Subcontractor Application for Payment",
        detail: "Structured subcontractor payment template covering contract value, variations, materials where applicable, retention, previous payments and the current amount being assessed. Designed to create a consistent record of subcontractor payment assessment and approval.",
        price: "£15",
      },
      {
        title: "Subcontractor Final Account Statement",
        detail: "Final account statement template for recording subcontractor account settlement, including the original contract value, agreed variations, adjustments, contra charges and final balance. Designed to provide a clear commercial record when bringing a subcontract package to conclusion.",
        price: "£15",
      },
      {
        title: "Project Final Account Statement",
        detail: "Project final account statement template covering the original contract value, agreed variations, relevant adjustments, loss and expense where applicable, previous payments and the final account position. Designed to help commercial teams present and record the financial conclusion of a project in a consistent format.",
        price: "£18",
      },
      {
        title: "Bid / No-Bid Summary",
        detail: "Structured decision-making framework for assessing tender and project opportunities before committing significant estimating and management resource. Considers areas including client relationship, strategic fit, project type, commercial risk, expected margin, programme, capacity and likelihood of success.",
        price: "£12",
      },
      {
        title: "Subcontract Tender Enquiry & Pre-Let Minutes",
        detail: "Subcontract tender enquiry and pre-let meeting templates designed to help define scope, responsibilities, commercial terms, programme requirements and other key matters before appointment. Provides a consistent record of what has been discussed, clarified and agreed with prospective subcontractors.",
        price: "£18",
        bundle: true,
      },
      {
        title: "Daywork Sheet",
        detail: "Editable daywork sheet for recording labour, plant, materials and other relevant information associated with instructed daywork. Includes space for project details, description of work, supporting records and client or site acknowledgement where required.",
        price: "£10",
      },
      {
        title: "Early Warning Notice",
        detail: "Structured early warning / notification template designed to help project teams record emerging issues, potential impacts, proposed actions and relevant contract references. The document should always be reviewed against the specific notice provisions, timescales and communication requirements of the contract before issue.",
        price: "£12",
      },
      {
        title: "Credit Control Letters (2 templates)",
        detail: "Two-stage credit control letter sequence for following up overdue invoices in a clear and professional manner. Designed to provide a consistent escalation process while maintaining appropriate communication with the customer.",
        price: "£15",
        bundle: true,
      },
    ],
  },
  {
    id: "technical",
    label: "Technical & Commissioning",
    count: 45,
    highlight: "45 documents",
    description: [
      "Practical technical, commissioning and document-control templates developed around the delivery, testing and handover of engineering projects.",
      "The library includes service records, commissioning sheets, drawing registers, technical submissions, equipment schedules and close-out documentation designed to support more consistent project delivery and handover.",
    ],
    availability: "Available as a complete technical and commissioning document pack.",
    note: {
      title: "Built to support consistent project delivery and handover.",
      body: "These documents provide practical structures for recording technical information, commissioning activities, equipment data, document control and project close-out. They should be reviewed and adapted to suit the particular system, project, client requirements and applicable technical standards before use.",
    },
    docs: [
      {
        title: "Service & Maintenance Record Sheet",
        detail: "Editable service and maintenance record for engineering plant and equipment, capturing the service date, engineer, work completed, observations, defects and recommended next service date. Designed to support consistent record keeping across planned and reactive maintenance activities.",
        price: "£10",
      },
      {
        title: "Commissioning Sheets — Heating Systems",
        detail: "Commissioning and service record templates for heating systems including boilers, heat exchangers, pressurisation units and associated controls. Designed to provide a consistent structure for recording commissioning information, settings, test results and relevant equipment details.",
        price: "£25",
      },
      {
        title: "Commissioning Sheets — Air Conditioning & Ventilation",
        detail: "Commissioning and service record templates for air conditioning and ventilation systems including AHUs, FCUs, VRF/VRV systems and associated equipment. Designed to help engineering teams record system information, commissioning results, settings and service details in a consistent format.",
        price: "£25",
      },
      {
        title: "Commissioning Sheets — Electrical Systems",
        detail: "Commissioning and service record templates for LV electrical systems, including distribution equipment, lighting, small power and associated installation information. Designed to support consistent recording of inspections, test information, system details and commissioning activities.",
        price: "£20",
      },
      {
        title: "Commissioning Sheets — Domestic Services",
        detail: "Commissioning and service record templates for domestic water and sanitary systems, including cold water, hot water and associated plant. Designed to provide a clear and consistent record of system information, commissioning activities and relevant test results.",
        price: "£20",
      },
      {
        title: "Drawing Registers — Mechanical & Electrical",
        detail: "Separate mechanical and electrical drawing registers for recording drawing number, title, revision, issue date, status and distribution. Designed to provide project teams with a clear and consistent method of controlling and tracking drawing information throughout the project.",
        price: "£18",
        bundle: true,
      },
      {
        title: "Technical Submission Register & Template",
        detail: "Technical submission register and supporting submission template designed to track information issued to clients, consultants and other reviewing parties. Includes fields for product information, supporting documentation, issue dates, review status, comments and approval records.",
        price: "£18",
        bundle: true,
      },
      {
        title: "Equipment Schedule Templates",
        detail: "Editable equipment schedule templates for recording key plant and equipment information across engineering projects. Designed to support design coordination, procurement, project delivery and handover by keeping important equipment information in a consistent format.",
        price: "£20",
      },
      {
        title: "F-Gas & Gas Safe Registers",
        detail: "Editable registers for recording relevant F-Gas and Gas Safe information, including engineer details, certification records, equipment information and key dates. Designed to support the management and visibility of certification and equipment records within the business.",
        price: "£18",
        bundle: true,
      },
      {
        title: "Outstanding Works & Defects List",
        detail: "Structured register for managing outstanding works, defects and close-out actions during project completion and post-completion periods. Tracks the item, location, responsibility, target date, status and completion information to provide clearer visibility of what remains outstanding.",
        price: "£12",
      },
      {
        title: "Fire Damper Drop Test Schedules",
        detail: "Fire damper inspection and test schedule for recording damper reference, location, inspection or test date, result, observations and remedial actions. Designed to provide a consistent record of inspection and testing activity. The document should be reviewed and adapted to suit the applicable system, building, maintenance regime and project requirements.",
        price: "£15",
      },
    ],
  },
  {
    id: "subcontract",
    label: "Subcontractor Scope of Works",
    count: 9,
    highlight: "9 documents",
    description: [
      "Practical subcontractor scope-of-works templates developed around the way engineering businesses procure, manage and coordinate specialist trades.",
      "Each template provides a structured starting point for defining scope, responsibilities, programme requirements, quality expectations, interfaces, testing, commissioning and handover obligations before appointment.",
      "Each scope should be reviewed and adapted to the specific project, subcontract terms, design responsibilities and procurement strategy before issue.",
    ],
    availability: "Available as a complete subcontract scope-of-works pack.",
    note: {
      title: "Clearer scope before appointment.",
      body: "Well-defined subcontract scopes help reduce ambiguity, improve coordination and create a clearer record of responsibilities before work begins. These templates provide a practical starting point, but should always be reviewed against the specific project, drawings, specification, programme, subcontract conditions and agreed design responsibilities before they are issued.",
    },
    docs: [
      {
        title: "Electrical Installation — Scope of Works",
        detail: "Structured scope-of-works template for electrical installation subcontractors, covering areas such as containment, cabling, distribution, testing, commissioning, coordination and handover. Designed to help clearly define package responsibilities and interfaces before appointment.",
        price: "£20",
      },
      {
        title: "General Mechanical Installation — Scope of Works",
        detail: "Structured scope-of-works template for mechanical installation subcontractors covering pipework, plant installation, equipment, interfaces, testing, commissioning and handover requirements. Designed to create greater clarity around what is included within the subcontract package and how it interfaces with other trades.",
        price: "£20",
      },
      {
        title: "Ductwork — Scope of Works",
        detail: "Scope-of-works template for ductwork subcontract packages, covering fabrication, installation, coordination, testing, commissioning and handover of ventilation and extract systems. Designed to help define package boundaries, responsibilities and project-specific requirements before appointment.",
        price: "£18",
      },
      {
        title: "BMS — Scope of Works",
        detail: "Scope-of-works template for building management system subcontractors covering control requirements, points schedules, interfaces, commissioning, software, documentation and handover. Designed to help clarify responsibilities between the BMS specialist and the wider mechanical, electrical and controls packages.",
        price: "£20",
      },
      {
        title: "Commissioning — Scope of Works",
        detail: "Scope-of-works template for specialist commissioning subcontractors covering pre-commissioning checks, system commissioning, witnessed testing, records, certification and handover information. Designed to provide clearer definition of commissioning responsibilities, deliverables and interfaces across the project.",
        price: "£18",
      },
      {
        title: "Design — Scope of Works",
        detail: "Scope-of-works template for specialist design subcontractors covering design deliverables, programme, coordination, review processes, BIM requirements, information exchange and handover. Design responsibility and liability provisions should always be reviewed against the specific subcontract and project requirements before issue.",
        price: "£20",
      },
      {
        title: "Insulation — Scope of Works",
        detail: "Scope-of-works template for insulation subcontractors covering pipework, ductwork, plant and equipment insulation, interfaces, finishes and associated project requirements. Designed to provide a clear starting point for defining the package against the project specification and coordinated installation.",
        price: "£15",
      },
      {
        title: "Medical Pipeline — Scope of Works",
        detail: "Scope-of-works template for specialist medical gas pipeline subcontractors covering installation, testing, validation, coordination and handover documentation. The scope should be reviewed against the applicable project specification, healthcare requirements, technical guidance and specialist responsibilities before appointment.",
        price: "£22",
      },
      {
        title: "Flue Systems — Scope of Works",
        detail: "Scope-of-works template for flue-system subcontractors covering design coordination, installation, interfaces, testing, commissioning and handover requirements. Designed to provide a structured starting point for defining package responsibilities, with project-specific technical and regulatory requirements added before issue.",
        price: "£15",
      },
    ],
  },
  {
    id: "hr",
    label: "People, HR & Employment",
    count: 38,
    highlight: "38 documents",
    description: [
      "A practical library of people, HR and employment documents developed around the needs of engineering and technical services businesses.",
      "The library covers employment, recruitment, onboarding, training, absence management, apprenticeships and employee administration, providing consistent documents and processes that can be adapted to suit your own organisation.",
      "Employment-related documents should be reviewed against your current policies, employment arrangements and applicable legislation before use.",
    ],
    availability: "Available as a complete people, HR and employment document pack.",
    note: {
      title: "Built to create more consistent people processes.",
      body: "These documents provide a practical starting point for recruitment, employment, training, absence management, onboarding and employee administration. They should be adapted to reflect your own organisation, employment arrangements and policies, and reviewed against current legal requirements where appropriate.",
    },
    docs: [
      {
        title: "Employment Contracts — Full Suite (4 contracts)",
        detail: "Editable employment contract templates covering four common roles and arrangements within an engineering business: site-based engineer, office-based employee, office-based employee with a company vehicle, and apprentice engineer. Designed to provide a structured starting point for documenting key employment terms and responsibilities. Employment contracts should be reviewed against the individual role, company arrangements and current employment law before issue.",
        price: "£65",
        bundle: true,
      },
      {
        title: "Employee Handbook",
        detail: "Editable employee handbook template covering key workplace policies, conduct, disciplinary and grievance processes, absence management, health and safety responsibilities and other employment-related matters. Designed to provide a structured foundation that businesses can adapt to reflect their own culture, policies, benefits and ways of working.",
        price: "£45",
      },
      {
        title: "Recruitment & Onboarding Pack",
        detail: "A practical set of recruitment and onboarding documents including an application form, interview checklist, new-starter information form, equal opportunities monitoring form and induction checklist. Designed to create a more consistent process from candidate application through to joining and induction.",
        price: "£35",
        bundle: true,
      },
      {
        title: "H&S Induction Checklist",
        detail: "Health and safety induction checklist covering areas including emergency arrangements, welfare, site rules, PPE, reporting requirements and other key information relevant to new employees and visitors. Designed to provide a consistent structure for recording the induction information provided.",
        price: "£10",
      },
      {
        title: "Employee Training Record",
        detail: "Individual training record for tracking qualifications, certifications, training activity, renewal dates and development requirements. Designed to help businesses maintain clearer visibility of the competence and training records relevant to each employee's role.",
        price: "£10",
      },
      {
        title: "Apprenticeship Scheme Documentation",
        detail: "Apprenticeship scheme documentation including an overview of the programme, supporting administration and an apprentice employment contract template. Developed from practical experience operating an engineering apprenticeship programme and designed to provide a starting point for businesses building a more structured approach to apprentice development. The documentation should be adapted to reflect the relevant apprenticeship programme, training provider, employment arrangements and current requirements.",
        price: "£25",
      },
      {
        title: "Absence & Leave Management Pack",
        detail: "A practical set of documents for recording and managing employee absence and leave, including absence records, holiday requests, return-to-work documentation and family-leave notification templates. Designed to support more consistent administration and record keeping across the business.",
        price: "£28",
        bundle: true,
      },
      {
        title: "DSE Assessment",
        detail: "Display screen equipment assessment template designed to help record workstation, equipment and working-environment considerations for employees who regularly use display screen equipment. The assessment should be reviewed and adapted in line with the employee's working arrangements and the organisation's current health and safety requirements.",
        price: "£10",
      },
      {
        title: "Exit Interview & Termination Checklist",
        detail: "Exit interview and leaver checklist designed to provide a consistent process when an employee leaves the business. Covers areas including handover, company property, system access, outstanding administration and information required for final payroll processing.",
        price: "£12",
        bundle: true,
      },
    ],
  },
  {
    id: "manuals",
    label: "O&M Manuals & HSEQ Manuals",
    count: 6,
    highlight: "6 manual templates",
    description: [
      "Practical manual templates developed around the handover, maintenance, operational and HSEQ requirements of engineering and technical services businesses.",
      "The templates provide a structured starting point for compiling project-specific information, technical records, maintenance requirements and management arrangements in a consistent format.",
      "The exact documentation required will depend on the project, contract, client requirements and applicable technical or regulatory obligations, so each manual should be reviewed and adapted before issue.",
    ],
    availability: "Available as a complete manuals pack.",
    note: {
      title: "A structured starting point for project-specific manuals.",
      body: "These templates are designed to reduce the time involved in creating technical and management manuals from a blank page while improving consistency across the business. They should always be reviewed and adapted to reflect the actual project, installed systems, contract requirements, client standards and responsibilities before issue.",
    },
    docs: [
      {
        title: "Technical Services O&M Manual — Full Structure (7 sections)",
        detail: "Structured O&M manual template covering the key information commonly required at project handover, including project introduction, description of works, maintenance information, manufacturers and suppliers, technical literature, commissioning records and as-fitted drawing information. Designed to give project teams a consistent framework for compiling handover information and adapting it to the requirements of the particular project and client.",
        price: "£85",
        bundle: true,
      },
      {
        title: "Technical Services Maintenance Manual (10 sections)",
        detail: "Structured maintenance manual template designed to support the ongoing operation and maintenance of technical services installations. Includes sections for planned maintenance activities, reactive maintenance arrangements, equipment information, responsibilities, records and supporting documentation. Designed to be adapted to the systems, assets, maintenance strategy and client requirements relevant to the particular operation.",
        price: "£75",
        bundle: true,
      },
      {
        title: "Site HSEQ Manual",
        detail: "Site-level health, safety, environmental and quality manual template designed to help businesses document project-specific HSEQ arrangements, responsibilities, controls and management processes. Provides a structured framework that can be adapted to the project, organisation, client requirements and relevant management systems. Where relevant, the template can be adapted to support project-specific management arrangements for organisations undertaking principal contractor responsibilities.",
        price: "£55",
      },
      {
        title: "LV Operations & Verification Manual",
        detail: "Operations and verification manual templates for low-voltage electrical installations, covering system information, operational procedures, verification records, responsibilities and emergency arrangements. Designed to provide a structured starting point that can be adapted to the particular installation, operational arrangements and technical requirements.",
        price: "£35",
        bundle: true,
      },
    ],
  },
];

const BUNDLE_PRICES: Record<string, { label: string; price: string; saving: string }> = {
  hs: { label: "Complete H&S & Environmental Pack", price: "£195", saving: "Save over £80 vs individual" },
  commercial: { label: "Complete Commercial & Financial Pack", price: "£175", saving: "Save over £60 vs individual" },
  technical: { label: "Complete Technical & Commissioning Pack", price: "£145", saving: "Save over £55 vs individual" },
  subcontract: { label: "Complete Subcontract Scope of Works Pack", price: "£125", saving: "Save over £45 vs individual" },
  hr: { label: "Complete People, HR & Employment Pack", price: "£165", saving: "Save over £70 vs individual" },
  manuals: { label: "Complete Manuals Pack", price: "£195", saving: "Save over £55 vs individual" },
};

export function DocumentsPage() {
  {/* TODO(eba): per Mark's review — consider re-cutting the six categories
      toward: general business, health & safety, commercial, accounting,
      sales, operations, HR, training, project management. The current six
      reflect how the real library is organised; align with Mark. */}
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
            380 practical documents built from real engineering business experience.
          </h1>
          {/* Hero copy per Mark's Documents page schedule (19 Sep 2026). */}
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "600px", margin: "0 0 14px" }}>
            A practical library of forms, registers, procedures, templates and business documents developed through the real-world operation of engineering businesses.
          </p>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "600px", margin: "0 0 32px" }}>
            These are not generic business templates adapted for the sector. They have been built around the commercial, operational, compliance and management requirements engineering businesses deal with every day.
          </p>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { value: "380", label: "Documents" },
              { value: "6", label: "Categories" },
              { value: "Editable", label: "Word & Excel formats" },
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
          {/* Package consistency (Mark, 19 Sep): the library is NOT part of the
              standard Academy tier. It is sold on its own (Kajabi offer
              2151348610) or inside Academy + Documents. Same statement on the
              Academy and Pricing pages. */}
          <p style={{ color: NAVY, fontFamily: "'Poppins', sans-serif", fontSize: "14px", fontWeight: 500, margin: 0 }}>
            <strong>The complete document library is available separately or as part of the Academy + Documents package.</strong>
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {LIBRARY_HREF && (
              <a href={LIBRARY_HREF} target="_blank" rel="noopener noreferrer" onClick={() => track("checkout_click", { source: "documents_library" })} style={{
                background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "12px",
                padding: "8px 18px", letterSpacing: "0.04em", display: "inline-block", flexShrink: 0, borderRadius: "6px",
              }}>
                Buy the Complete Document Library · {PRICING.libraryStandalone} →
              </a>
            )}
            <a href={ENROL_DOCS_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_DOCS_READY || undefined} onClick={() => track("checkout_click", { source: "documents", tier: "academy+docs" })} style={{
              background: "transparent", color: NAVY, border: `1px solid rgba(${NAVY_RGB},0.35)`, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "12px",
              padding: "7px 18px", letterSpacing: "0.04em", display: "inline-block", flexShrink: 0, borderRadius: "6px",
            }}>
              {ENROL_DOCS_READY ? "Explore Academy + Documents →" : ENROL_PENDING_LABEL}
            </a>
          </div>
        </div>
      </div>

      {/* Photo band */}
      <div style={{ position: "relative", width: "100%", height: isMobile ? "240px" : "380px", overflow: "hidden" }}>
        <img src="/site-fitout.jpg" alt="Developed around the real documentation and processes used within engineering businesses" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 45%", display: "block" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(${NAVY_RGB},0.74) 0%, rgba(${NAVY_RGB},0.4) 45%, rgba(${ACCENT_RGB},0.28) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", width: "100%" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: "14px" }}>· Browse the library ·</div>
            <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, color: "#fff", fontSize: isMobile ? "1.5rem" : "clamp(1.8rem, 3.4vw, 2.8rem)", lineHeight: 1.12, letterSpacing: "-0.015em", maxWidth: "680px", margin: "0 0 12px" }}>
              Practical documents for the day-to-day running of an engineering business.
            </p>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: isMobile ? "14px" : "15.5px", lineHeight: 1.6, maxWidth: "620px", margin: 0 }}>
              Browse the library by business area, from health and safety and commercial controls through to technical delivery, subcontractors, people and management systems.
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
              {/* Category-pack sales block removed for launch (Mark's final
                  Documents schedule, 20 Sep 2026): documents are browsable but
                  only the complete £399 library is sold on its own. */}
              <RevealSection style={{ marginBottom: "40px" }}>
                <div style={{ maxWidth: "820px" }}>
                  <h2 style={{
                    fontFamily: "var(--eba-heading)", fontWeight: 800,
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.02em",
                    color: NAVY, margin: "0 0 16px",
                  }}>
                    {cat.label}
                  </h2>
                  {cat.description.map((para, pi) => (
                    <p key={pi} style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "15px", lineHeight: 1.75, margin: pi === cat.description.length - 1 ? 0 : "0 0 12px" }}>
                      {para}
                    </p>
                  ))}
                </div>
              </RevealSection>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {cat.docs.map((doc, i) => (
                  <RevealSection key={i} style={{ transitionDelay: `${i * 30}ms` }}>
                    {/* Browse-only rows: no per-document purchase or enquiry
                        button at launch (Mark's final Documents schedule, item 1). */}
                    <div style={{ background: WHITE, borderLeft: `3px solid ${OAT}`, padding: "20px 24px" }}>
                      <h4 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1rem", color: NAVY, margin: "0 0 6px" }}>
                        {doc.title}
                      </h4>
                      <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.65, margin: 0 }}>
                        {doc.detail}
                      </p>
                    </div>
                  </RevealSection>
                ))}
              </div>

              {/* Category note (Mark's schedule, per category) */}
              <RevealSection style={{ marginTop: "32px" }}>
                <div style={{ background: WHITE, padding: "24px 28px", borderLeft: `3px solid ${RUST}` }}>
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.1rem", color: NAVY, margin: "0 0 8px" }}>{cat.note.title}</h3>
                  <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{cat.note.body}</p>
                </div>
              </RevealSection>

              <RevealSection style={{ marginTop: "16px" }}>
                <div style={{ background: OAT, padding: "24px 28px", borderLeft: `3px solid rgba(${NAVY_RGB},0.2)` }}>
                  <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.65, margin: "0 0 8px" }}>
                    Documents are supplied in editable Microsoft Word and Excel formats so they can be reviewed and adapted to suit your own business. The complete library can be purchased separately or accessed through the Academy + Documents package.
                  </p>
                  <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.65, margin: "0 0 14px" }}>
                    For company-wide licensing or bespoke document-development requirements, talk to us about the right option for your business.{" "}
                    <Link href="/contact?enquiry=documents" style={{ color: RUST, textDecoration: "none", fontWeight: 600 }}>Contact Us About Documents →</Link>
                  </p>
                  <a href={LIBRARY_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!LIBRARY_HREF || undefined} onClick={() => track("checkout_click", { source: "documents-category", tier: "library" })} style={{
                    background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12.5px",
                    padding: "10px 20px", letterSpacing: "0.04em", display: "inline-block",
                  }}>
                    {LIBRARY_HREF ? `Buy the Complete Document Library · ${PRICING.libraryStandalone} →` : ENROL_PENDING_LABEL}
                  </a>
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
                    Or get the complete library with the Academy + Documents package.
                  </p>
                </div>
                <a href={ENROL_DOCS_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_DOCS_READY || undefined} onClick={() => track("checkout_click", { source: "documents", tier: "academy+docs" })} style={{
                  background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                  padding: "14px 32px", letterSpacing: "0.04em", display: "inline-block", flexShrink: 0,
                }}>
                  {ENROL_DOCS_READY ? "Explore Academy + Documents →" : ENROL_PENDING_LABEL}
                </a>
              </div>
            </RevealSection>
          )}
        </div>
      </section>

      {/* ── How to use the documents / broader positioning (Mark, sections 14 and 15) ── */}
      <section style={{ background: WHITE, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "64px" }}>
          <RevealSection>
            <SectionLabel light>How to use the documents</SectionLabel>
            <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", color: NAVY, margin: "0 0 16px", lineHeight: 1.15 }}>
              Built to adapt to your business.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 14px" }}>
              The documents give you a practical starting point rather than a blank page. Download them in editable format, review them against your own business, clients, projects and responsibilities, and adapt them to the way your organisation works.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.75, margin: 0 }}>
              The aim is to save the time involved in creating business documents from scratch while still keeping responsibility and judgement with your own team.
            </p>
          </RevealSection>
          <RevealSection>
            <SectionLabel light>The wider library</SectionLabel>
            <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", color: NAVY, margin: "0 0 16px", lineHeight: 1.15 }}>
              More than compliance documents.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 14px" }}>
              The library covers the wider operation of an engineering business, including commercial controls, financial processes, technical delivery, subcontractors, people, employment, health and safety, environmental management and project handover.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.75, margin: 0 }}>
              Together, the documents provide practical building blocks for creating more consistent and repeatable ways of working across the business.
            </p>
          </RevealSection>
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

// Broad enquiry categories (Mark's final Contact schedule, 20 Sep 2026) so the
// form never needs updating when a new AI tool is launched. Legacy values from
// older links are mapped onto the new set rather than dropped.
const CONTACT_ENQUIRIES = ["academy", "documents", "ai-tools", "ai-companies", "mentorship", "account", "other"];
const LEGACY_ENQUIRIES: Record<string, string> = {
  pricing: "academy",
  "om-manual": "ai-tools",
  chatbot: "ai-tools",
  "white-label": "ai-companies",
  automation: "ai-companies",
};

export function ContactPage() {
  // "Request a build" CTAs land here as /contact?enquiry=chatbot etc. — preselect
  // the dropdown so the visitor doesn't have to re-state what they clicked on.
  // The pricing gate on /pricing also passes ?tier=... — prefill the message so
  // the enquiry isn't context-free ("which tier?" shouldn't be our first reply).
  const { preselect, prefillMessage } = (() => {
    if (typeof window === "undefined") return { preselect: "other", prefillMessage: "" };
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("enquiry") ?? "";
      const q = LEGACY_ENQUIRIES[raw] ?? raw;
      const tier = params.get("tier");
      return {
        preselect: q && CONTACT_ENQUIRIES.includes(q) ? q : "other",
        prefillMessage: tier ? `I'm interested in: ${tier}` : "",
      };
    } catch { return { preselect: "other", prefillMessage: "" }; }
  })();
  const [form, setForm] = useState({ name: "", email: "", company: "", enquiry: preselect, message: prefillMessage });
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
            <p style={{ color: `rgba(${CREAM_RGB},0.7)`, fontSize: "17px", lineHeight: 1.65, maxWidth: "520px" }}>
              Whether you have a question about the Academy, documents, AI tools and agents, mentorship or a solution for your business, use the form below and we will get back to you within two working days.
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
              { k: "The Academy", v: ENROL_READY ? "Available now" : "Opening soon" },
              { k: "Documents", v: "Complete library available" },
              { k: "AI Tools & Agents", v: "Available individually" },
              { k: "Mentorship", v: "Enquiry-led · limited availability" },
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
                    We will get back to you within two working days.
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
                      <option value="academy">Academy — General Enquiry</option>
                      <option value="documents">Document Library — General Enquiry</option>
                      <option value="ai-tools">AI Tools &amp; Agents — General Enquiry</option>
                      <option value="ai-companies">AI for Companies / Bespoke Automation</option>
                      <option value="mentorship">Mentorship — Enquiry</option>
                      <option value="account">Account / Access Support</option>
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
              {/* A contact and support page, not an alternative checkout route:
                  fixed-price products are bought from the product/pricing pages. */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {([
                  { label: "The Academy", detail: "Questions about the curriculum, what is included or access after enrolment. Academy pricing is published on the Pricing page, with direct enrolment from there. Select Academy in the enquiry form." , cta: "See Academy Pricing →", href: "/pricing" },
                  { label: "Document Library", detail: "The complete 380-document library is available to purchase directly from the website. If you have a question about the library, document formats or access after purchase, select Document Library in the enquiry form.", cta: "Explore the Document Library →", href: "/documents" },
                  { label: "AI Tools & Agents", detail: "Our AI tools and agents are available through the AI Tools section of the website. If you have a question about an available tool, your subscription or how a tool could be used within your business, select AI Tools & Agents in the enquiry form.", cta: "Explore AI Tools →", href: "/ai-tools" },
                  { label: "AI for Companies & Bespoke Automation", detail: "For businesses looking to use AI or automation around their own documents, information, processes or workflows, tell us a little about what you are trying to improve. We can then discuss the most appropriate approach for your organisation." },
                  { label: "Mentorship", detail: "Tell us a little about your business, where you are now and the areas where you would like support. We can then discuss the most appropriate mentoring format and confirm current availability." },
                  { label: "Account & access support", detail: "If you already have an account and need help with access, a purchase or one of your subscriptions, select Account / Access Support in the enquiry form and include the email address associated with your account." },
                ] as { label: string; detail: string; cta?: string; href?: string }[]).map(({ label, detail, cta, href }) => (
                  <div key={label} style={{ background: WHITE, borderLeft: `3px solid ${OAT}`, padding: "20px 20px" }}>
                    <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, color: NAVY, fontSize: "0.95rem", margin: "0 0 6px" }}>{label}</p>
                    <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.65, margin: cta ? "0 0 10px" : 0 }}>{detail}</p>
                    {cta && href && (
                      <Link href={href} style={{ color: RUST, textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px" }}>{cta}</Link>
                    )}
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
