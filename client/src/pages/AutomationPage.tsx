/**
 * Automation & Systems — a capability of The Engineering Business Academy.
 *
 * POSITIONING (Mark's final Automation & Systems schedule, 20 Sep 2026):
 * practical dashboards, integrations, workflow automation and bespoke internal
 * tools built around real engineering-business workflows. Presented as an
 * organisational capability ("we"), never a personal freelance service, and
 * not limited to M&E contractors. Distinct from:
 *   - /ai-tools       ready-to-use products and agents available now
 *   - /enterprise     AI for Companies: company-level AI and bespoke AI solutions
 *
 * HONESTY RULE — read before editing: nothing here is presented as a completed
 * client project. The "developed around real workflows" section describes the
 * approach; it does not list tools, name clients or quote numbers. Do NOT add a
 * case study, client name or before/after unless it is real and approved.
 *
 * Pricing is enquiry-led (bespoke work varies). Ownership, hosting, support
 * and recurring costs are agreed in the scope, so the page never promises
 * "yours, no ongoing tie".
 *
 * noIndex remains until Ste confirms the page is ready for search.
 */

import { Link } from "wouter";
import { MobileNav } from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/useMobile";
import {
  NAVY, CREAM, WHITE, NAVY_RGB, CREAM_RGB,
  DARK_GRADIENT, IS_VIVID, ON_DARK, ON_DARK_RGB, HERO_GLOW,
  COBALT, COBALT_ON_DARK,
} from "@/lib/constants";
import { SectionBreaker } from "@/components/SectionBreaker";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { SiteFooter } from "@/components/SiteFooter";
import { track } from "@/lib/track";

function Kicker({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p style={{
      fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700,
      letterSpacing: "0.18em", textTransform: "uppercase",
      color: light ? COBALT_ON_DARK : COBALT, margin: "0 0 14px",
    }}>
      {children}
    </p>
  );
}

// What we can build — a capability list, not a list of completed projects.
const builds = [
  {
    title: "Dashboards & management information",
    body: "Bring together the information people need to manage the business, projects or operations more effectively.",
  },
  {
    title: "System integrations",
    body: "Connect existing platforms and information sources so data can move between systems with less manual intervention.",
  },
  {
    title: "Workflow automation",
    body: "Reduce repetitive administration, document handling, data entry and routine processes that consume valuable time.",
  },
  {
    title: "Bespoke applications & internal tools",
    body: "Develop practical applications around specific company workflows where an existing product does not meet the requirement.",
  },
];

const steps = [
  {
    n: "01",
    t: "Understand the workflow",
    d: "We look at the current process, the information involved, the people using it and the problem you are trying to solve.",
  },
  {
    n: "02",
    t: "Scope the solution",
    d: "We identify the most appropriate approach and agree the scope, deliverables, implementation requirements and pricing before development begins.",
  },
  {
    n: "03",
    t: "Build and test",
    d: "The solution is developed around your requirements and tested with the people who will actually use it.",
  },
  {
    n: "04",
    t: "Deploy and support",
    d: "Once ready, the solution is deployed into the business with the appropriate support, hosting and ongoing development arrangements agreed for that particular system.",
  },
];

export function AutomationPage() {
  const isMobile = useIsMobile();
  const bodyLight = { color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.8, margin: 0 } as React.CSSProperties;
  const bodyDark = { color: `rgba(${CREAM_RGB},0.8)`, fontSize: "17px", lineHeight: 1.75, margin: 0 } as React.CSSProperties;
  const h2Light = {
    fontFamily: "var(--eba-heading)", fontWeight: 800,
    fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
    color: NAVY, margin: "0 0 24px", lineHeight: 1.1,
  } as React.CSSProperties;
  const h2Dark = { ...h2Light, color: ON_DARK } as React.CSSProperties;
  const rule = { width: "48px", height: "3px", background: COBALT, borderRadius: "2px", margin: "0 0 24px" } as React.CSSProperties;
  const inlineLink = { color: COBALT, textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "0.04em", borderBottom: `1px solid ${COBALT}`, paddingBottom: "2px" } as React.CSSProperties;

  // Bespoke automation sits under "AI for Companies / Bespoke Automation" on
  // the contact form (Mark's Contact schedule, 20 Sep 2026).
  const ctaHref = "/contact?enquiry=ai-companies&tier=Automation%20%26%20Systems";

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.automation} noIndex />
      <MobileNav transparent={false} />

      {/* 1. HERO */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "80px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <Kicker light>Automation &amp; Systems · Built around your business</Kicker>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05, maxWidth: "820px",
          }}>
            Practical systems and automation built around how your business works.
          </h1>
          <p style={{ ...bodyDark, maxWidth: "660px", marginBottom: "16px" }}>
            For engineering and technical services businesses looking to manage information better, connect existing systems, reduce repetitive administration and build practical internal tools around real workflows.
          </p>
          <p style={{ ...bodyDark, maxWidth: "660px", marginBottom: "36px" }}>
            From dashboards and integrations to bespoke applications and workflow automation, solutions are developed around the problem the business is trying to solve rather than forcing the business into a generic off-the-shelf system.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href={ctaHref} onClick={() => track("cta_automation_hero")} style={{
              background: COBALT, color: "#fff", textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
              padding: "15px 34px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
            }}>
              Talk to Us About Your Requirements →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE STARTING POINT */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Kicker>The starting point</Kicker>
          <div style={rule} />
          <h2 style={h2Light}>Better systems start with understanding the workflow.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={bodyLight}>
              Engineering businesses often rely on a combination of job-management systems, accounting platforms, spreadsheets, SharePoint, email and specialist applications.
            </p>
            <p style={bodyLight}>
              As businesses grow, information can become duplicated, disconnected or difficult to access. Teams can end up re-entering the same information, manually producing reports or relying on processes that no longer suit the scale of the business.
            </p>
            <p style={bodyLight}>
              Off-the-shelf software can solve many problems, but there are also situations where integration, automation or a purpose-built application is a better fit. That is where this service is designed to help.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE CAN BUILD */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Kicker light>Capabilities</Kicker>
          <h2 style={{ ...h2Dark, maxWidth: "720px" }}>What we can build.</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "18px", marginTop: "8px" }}>
            {builds.map((b) => (
              <div key={b.title} style={{
                background: `rgba(${ON_DARK_RGB},0.06)`, border: `1px solid rgba(${ON_DARK_RGB},0.12)`,
                borderTop: `3px solid ${COBALT_ON_DARK}`, padding: "28px 28px", borderRadius: "10px",
              }}>
                <h3 style={{ color: ON_DARK, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "16px", margin: "0 0 10px", lineHeight: 1.35 }}>
                  {b.title}
                </h3>
                <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: "15px", lineHeight: 1.65, margin: 0 }}>
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. APPROACH — no individual tools listed, so the page stays current */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Kicker>Our approach</Kicker>
          <div style={rule} />
          <h2 style={h2Light}>Developed around real engineering-business workflows.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={bodyLight}>
              Our approach is informed by systems, applications and automation developed around the day-to-day requirements of working engineering businesses.
            </p>
            <p style={bodyLight}>
              That means starting with genuine operational, commercial, compliance or administrative problems, understanding how people actually carry out the work and developing practical solutions around those requirements.
            </p>
            <p style={bodyLight}>
              The same approach underpins the AI tools and agents available through The Engineering Business Academy: solve a real problem, test the solution in practice and improve it around the people who actually use it.
            </p>
          </div>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap", marginTop: "32px" }}>
            <Link href="/ai-tools" style={inlineLink}>
              Explore AI Tools &amp; Agents →
            </Link>
            <Link href="/enterprise" style={inlineLink}>
              Explore AI for Companies →
            </Link>
          </div>
        </div>
      </section>

      <SectionBreaker
        kicker="How it works"
        title="Scoped and priced"
        accent="before development begins."
        variant="tint"
      />

      {/* 5. HOW IT WORKS */}
      <section style={{ background: WHITE, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ ...h2Light, margin: "0 0 36px" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "24px" : "32px" }}>
            {steps.map((s) => (
              <div key={s.n} style={{ borderTop: `2px solid ${COBALT}`, paddingTop: "18px" }}>
                <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, color: COBALT, fontSize: "14px", letterSpacing: "0.08em", margin: "0 0 8px" }}>{s.n}</p>
                <h3 style={{ color: NAVY, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "17px", margin: "0 0 10px", lineHeight: 1.3 }}>{s.t}</h3>
                <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15px", lineHeight: 1.65, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", margin: "40px 0 0", maxWidth: "720px" }}>
            <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "14.5px", lineHeight: 1.65, margin: 0 }}>
              Depending on the solution, work may be delivered as a one-off project or as an ongoing managed service. Ownership, hosting, support and any recurring costs are agreed clearly as part of the scope before work begins.
            </p>
            <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "14.5px", lineHeight: 1.65, margin: 0 }}>
              Our primary focus is engineering and technical services businesses, where our understanding of the sector allows solutions to be developed around familiar operational and commercial workflows.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "90px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 16px", lineHeight: 1.05,
          }}>
            Tell us what you are trying to improve.
          </h2>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "16px", lineHeight: 1.7, margin: "0 0 14px" }}>
            Whether it is a repetitive process, disconnected information, reporting requirement or an internal workflow that could work better, tell us a little about the problem and how it operates today.
          </p>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "16px", lineHeight: 1.7, margin: "0 0 32px" }}>
            We can then discuss whether automation, integration or a bespoke application is the right approach. We reply within two working days.
          </p>
          <Link href={ctaHref} onClick={() => track("cta_automation_footer")} style={{
            background: COBALT, color: "#fff", textDecoration: "none",
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
            padding: "16px 40px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
          }}>
            Start the Conversation →
          </Link>
          <p style={{ color: `rgba(${CREAM_RGB},0.55)`, fontSize: "12.5px", margin: "18px 0 0" }}>
            <span style={{ color: COBALT_ON_DARK, fontWeight: 700 }}>✓</span> Built around real workflows &nbsp;·&nbsp;
            <span style={{ color: COBALT_ON_DARK, fontWeight: 700 }}>✓</span> Scope and price agreed before development &nbsp;·&nbsp;
            <span style={{ color: COBALT_ON_DARK, fontWeight: 700 }}>✓</span> One-off or managed solutions
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
