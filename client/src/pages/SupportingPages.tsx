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
// Real document catalogue derived from the uploaded library. Structure and
// wording per Mark/Duane's "Documents Page & Checkout - Final Amendments"
// brief (24 Sep 2026): the website mirrors the actual customer library —
// 380 files in these 10 folders, in this order. No per-folder document
// counts shown (the library is intentionally uneven by category). No
// individual-document or category-pack purchase routes — the complete
// £399 library (or Academy + Documents) is the only document-only route.
type DocCategory = {
  id: string; label: string;
  description: string[];
};
const docCategories: DocCategory[] = [
  {
    id: "procedures",
    label: "Procedures",
    description: [
      "A comprehensive procedure framework covering the key functions involved in running and controlling an engineering business.",
      "The procedures cover quality and document control, sales and marketing, estimating and purchasing, design and project management, high-voltage electrical work, manufacturing, commercial and accounting controls, environmental and health & safety, human resources and training, subcontractors and equipment, IT and cyber security, software and digital systems, customer complaints and accreditations.",
      "They are designed to help businesses create clearer responsibilities, greater consistency and more structured ways of working.",
    ],
  },
  {
    id: "templates",
    label: "Templates",
    description: [
      "Practical business templates used across administration, quality, commercial management and day-to-day company operations.",
      "The folder includes RFI and technical-query records, complaint forms, credit requests, meeting templates, non-conformance reports, customer surveys, quotation and enquiry records, QA indexes, management and board meeting templates, procedure audits, task matrices and other frequently used business documents.",
      "Each template provides a practical starting point that can be branded and adapted around your own processes.",
    ],
  },
  {
    id: "human-resources",
    label: "Human Resources",
    description: [
      "A broad collection of documents supporting the employment and management of people throughout the employee lifecycle.",
      "The folder includes recruitment and interview documents, new-starter and induction records, employment contracts, holiday and absence forms, maternity, adoption and paternity documents, training and apprenticeship records, expense and mileage forms, DSE assessments, return-to-work documentation, employee handbook material, termination and exit documents and other practical HR records.",
      "Employment-related documents should be reviewed against your own policies and current legal requirements before use.",
    ],
  },
  {
    id: "health-safety",
    label: "Health & Safety",
    description: [
      "A substantial library of practical health & safety documents for engineering and technical-services businesses.",
      "The folder includes permits to work, risk assessments, COSHH documents, method-statement templates, site checklists, inspection records, monitoring forms, toolbox-talk records, electrical permits and registers, equipment and vehicle registers, subcontractor reviews, rescue plans and other site-management documents.",
      "These documents are intended to provide structured starting points and should be reviewed and adapted by an appropriately competent person before being used.",
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    description: [
      "Practical tools for improving commercial control from initial opportunity through project delivery, cash management and final account.",
      "The folder includes project-opening and analysis sheets, payment applications, subcontractor payment and pricing tools, quotation and variation registers, project commercial reports, cost summaries, cash-flow forecasts, purchasing tools, sales forecasts, final-account documents, purchase orders, pre-let records, tender enquiries, invoice-query sheets, site diaries, daywork records, early-warning notices and bid/no-bid tools.",
      "The documents are designed to support stronger visibility, control and consistency across the commercial lifecycle.",
    ],
  },
  {
    id: "technical",
    label: "Technical",
    description: [
      "The largest section of the library, containing technical, engineering, commissioning, inspection, calculation and project-delivery resources across a wide range of disciplines.",
      "The folder includes general technical and asset registers, drawing and procurement trackers, commissioning records, design documents and extensive service and commissioning sheets covering heating, air conditioning, electrical systems, ventilation, domestic services, controls, leak detection, air curtains, catering equipment, pumps and other equipment.",
      "It also includes inspection and audit sheets, engineering calculation templates, equipment schedules, installation-standard drawings, fire-damper details, high-voltage documentation, manufacturing and control-panel records, and software-development and digital-system documentation.",
      "Technical documents should be reviewed and adapted to the specific project, design, contractual and regulatory requirements involved.",
    ],
  },
  {
    id: "manuals",
    label: "Manuals",
    description: [
      "Structured manual templates designed to support project handover, maintenance, site management and specialist electrical activities.",
      "The folder includes a complete Technical Services O&M Manual structure, Site HSEQ Manual, Technical Services Maintenance Manual and LV Operations and Verification Manuals.",
      "These provide a practical framework for compiling and maintaining structured company or project documentation and should be adapted to reflect the specific organisation, project and responsibilities involved.",
    ],
  },
  {
    id: "tenders",
    label: "Tenders",
    description: [
      "Practical documents to support proposal preparation and smaller quotation opportunities.",
      "The folder includes a structured proposal template together with a small-works quotation and acceptance document, providing a starting point for presenting offers consistently and recording customer acceptance.",
      "Tender and quotation documents should always be adapted to the specific opportunity, client requirements and commercial terms.",
    ],
  },
  {
    id: "environmental",
    label: "Environmental",
    description: [
      "Practical environmental documents for recording, monitoring and managing environmental activities on projects and within the wider business.",
      "The folder includes an environmental update register, environmental accident and incident investigation document, site environmental checklist and waste-management plan.",
      "These documents provide a structured starting point and should be reviewed against the environmental requirements relevant to the organisation and individual project.",
    ],
  },
  {
    id: "subcontracting",
    label: "Sub-contractor Scope of Works",
    description: [
      "Editable scope-of-work templates designed to help businesses define subcontractor responsibilities more clearly before work begins.",
      "The folder includes scopes covering BMS, commissioning, design, ductwork, electrical installation, flues, general mechanical installation, insulation and medical pipelines.",
      "Each document provides a structured starting point for defining work packages, responsibilities and interfaces and should be amended to reflect the specific subcontract, project information, design responsibility and contractual requirements involved.",
    ],
  },
];

export function DocumentsPage() {
  const [openCategory, setOpenCategory] = useState<string | null>("procedures");
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
            380 practical business documents, organised the way you will actually use them.
          </h1>
          {/* Hero copy per Mark/Duane's "Documents Page & Checkout - Final Amendments" brief (24 Sep 2026). */}
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "600px", margin: "0 0 14px" }}>
            The complete library contains 380 practical documents organised into 10 folders, reflecting the way the resources are supplied after purchase.
          </p>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "600px", margin: "0 0 14px" }}>
            The library covers everything from company procedures, people management and health & safety through to commercial controls, technical delivery, manuals, tenders and subcontractor scopes of work.
          </p>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "600px", margin: "0 0 32px" }}>
            The documents have been developed from real-world engineering business processes and provide a practical starting point that can be reviewed, branded and adapted to suit your own organisation.
          </p>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { value: "380", label: "Documents" },
              { value: "10", label: "Folders" },
              { value: "Editable", label: "Primarily Word & Excel" },
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

              <RevealSection style={{ marginTop: "16px" }}>
                <div style={{ background: OAT, padding: "24px 28px", borderLeft: `3px solid rgba(${NAVY_RGB},0.2)` }}>
                  <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.65, margin: "0 0 8px" }}>
                    Documents are supplied primarily in editable Word and Excel formats, with a small number of supporting PDF and PowerPoint files where appropriate. The complete library can be purchased separately or accessed through the Academy + Documents package.
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

      {/* Closing library summary — Mark/Duane's Documents brief (24 Sep 2026), item 4. */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", letterSpacing: "-0.02em", color: ON_DARK, margin: "0 0 20px", lineHeight: 1.15 }}>
            One complete library. Ten practical folders.
          </h2>
          <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "16px", lineHeight: 1.75, margin: "0 0 16px" }}>
            Customers receive the complete 380-document library organised into: Procedures · Templates · Human Resources · Health & Safety · Commercial · Technical · Manuals · Tenders · Environmental · Sub-contractor Scope of Works.
          </p>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "15px", lineHeight: 1.75, margin: "0 0 32px" }}>
            The documents are designed to provide practical starting points rather than replace professional, legal or competent-person review. They should be reviewed and adapted to suit the individual business, project and circumstances in which they are used.
          </p>
          <a href={LIBRARY_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!LIBRARY_HREF || undefined} onClick={() => track("checkout_click", { source: "documents-closing", tier: "library" })} style={{
            background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
            padding: "15px 34px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
          }}>
            {LIBRARY_HREF ? `Buy the Complete Document Library · ${PRICING.libraryStandalone} →` : ENROL_PENDING_LABEL}
          </a>
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
