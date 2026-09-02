/**
 * Automation & Systems — Ste's bespoke-build offer.
 *
 * POSITIONING: distinct from /enterprise (which sells one specific product,
 * the Compliance Co-Pilot chatbot). This page sells Ste building custom
 * systems for a client's business — dashboards, integrations, internal tools.
 * Cobalt accent throughout: Ste owns the Tools voice (see AboutStePage.tsx).
 *
 * Decisions confirmed with Ste, 2 Sep 2026:
 *   - Offer shape: one-off build OR ongoing managed retainer, client picks per job
 *   - Audience: engineering & M&E contractors only (same as the rest of the site)
 *   - Pricing: gated behind enquiry, never a public number (bespoke work varies)
 *   - Kept separate from /enterprise, cross-linked both ways
 *
 * HONESTY RULE — read before editing: the only things this page presents as
 * *delivered* work are things that genuinely exist: the H&S dashboard Ste
 * built for KEYIS project managers, and the AI tools suite (RAMS, COSHH,
 * Toolbox Talk, O&M compiler, Co-Pilot) that ran on live KEYIS projects.
 * Everything else — reporting dashboards, integrations, workflow automation —
 * is framed as what he builds, not as completed client projects. Do NOT add
 * a case study, a client name, a number or a before/after here unless it is
 * real. Ste has been asked for real build examples to strengthen this page;
 * add them when they arrive, not before.
 *
 * noIndex until Ste supplies those examples and confirms the copy.
 */

import { Link } from "wouter";
import { MobileNav } from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/useMobile";
import {
  NAVY, CREAM, WHITE, NAVY_RGB, CREAM_RGB,
  DARK_GRADIENT, IS_VIVID, ON_DARK, ON_DARK_RGB, HERO_GLOW,
  COBALT, COBALT_ON_DARK, COBALT_RGB,
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

// What Ste builds. Capability list — deliberately NOT presented as a list of
// completed client projects. See the honesty note at the top of this file.
const builds = [
  {
    title: "Dashboards that show the numbers people actually need",
    body: "Compliance position, job status, cash, whatever the business runs on — visible when someone needs it, instead of living in one person's inbox and spreadsheets.",
  },
  {
    title: "Integrations between the tools you already use",
    body: "Site tools, accounting, job management, document systems — made to talk to each other, so information is entered once and flows where it's needed.",
  },
  {
    title: "Automating the paperwork that eats qualified people's time",
    body: "The same information retyped into different templates by people who should be on site. That's the problem the RAMS and COSHH generators were built to kill — and it exists in every part of an engineering business, not just compliance.",
  },
  {
    title: "Internal tools built for exactly how you work",
    body: "Not off-the-shelf software bent to fit. Something built around your actual process, that has to survive real jobs with real deadlines or it gets thrown out.",
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

  const ctaHref = "/contact?enquiry=automation";

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      {/* noIndex until Ste supplies real build examples and signs off the copy. */}
      <Seo {...PAGE_SEO.automation} noIndex />
      <MobileNav transparent={false} />

      {/* 1. HERO */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "80px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <Kicker light>Automation &amp; Systems · Built for you</Kicker>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05, maxWidth: "800px",
          }}>
            The systems your engineering business is missing. Built, not bought.
          </h1>
          <p style={{ ...bodyDark, maxWidth: "640px", marginBottom: "36px" }}>
            Dashboards, integrations and internal tools built around how your business actually runs —
            by the Head of Automation of a working M&amp;E group, not a software agency guessing at your industry.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href={ctaHref} onClick={() => track("cta_automation_hero")} style={{
              background: COBALT, color: "#fff", textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
              padding: "15px 34px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
            }}>
              Tell me what you need →
            </Link>
            <Link href="/about-ste" style={{
              background: "transparent", color: ON_DARK, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              padding: "15px 34px", border: `1px solid rgba(${ON_DARK_RGB},0.4)`, display: "inline-block", borderRadius: "6px",
            }}>
              Who builds it →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM — same problem the AI tools were born from, wider */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Kicker>The problem</Kicker>
          <div style={rule} />
          <h2 style={h2Light}>Every engineering business runs on information that lives in the wrong place.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={bodyLight}>
              Job status in one person's head. Compliance position in a spreadsheet nobody else can open.
              The same figures typed into three different systems. Qualified people spending Friday
              afternoons on paperwork instead of on site.
            </p>
            <p style={bodyLight}>
              Off-the-shelf software rarely fixes it, because it was designed for a generic business and
              you have to bend your process to fit it. The alternative — a system built around how you
              actually work — has always meant hiring a software agency that has never set foot on a site.
            </p>
            <p style={bodyLight}>
              That's the gap this closes.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHAT I BUILD — capabilities, honestly framed */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Kicker light>What gets built</Kicker>
          <h2 style={{ ...h2Dark, maxWidth: "720px" }}>The kind of thing I build.</h2>
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

      {/* 4. PROOF — only what genuinely exists. See honesty note at top of file. */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Kicker>Already built, already running</Kicker>
          <div style={rule} />
          <h2 style={h2Light}>None of this is a pitch deck. It's what already exists.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={bodyLight}>
              The first system I built was an H&amp;S dashboard for project managers inside KEYIS Group —
              their compliance position, visible whenever they needed it, instead of it living in my
              inbox. Not a demo. An internal tool that had to work on live jobs or get thrown out.
            </p>
            <p style={bodyLight}>
              Then the tools EBA now sells: the RAMS generator, the COSHH assessments, the Toolbox Talk
              generator, the O&amp;M compiler, the Compliance Co-Pilot. Every one was built for the
              group first, ran on real projects, and was only offered to anyone else afterwards.
            </p>
            <p style={bodyLight}>
              That's the standard everything here is built to. Software designed to be sold gets built
              around what demos well. Software designed to be used gets built around what happens at
              6pm on a Friday when the documents have to go out.
            </p>
          </div>
          <div style={{ display: "flex", gap: "22px", flexWrap: "wrap", marginTop: "32px" }}>
            <Link href="/ai-tools" style={{ color: COBALT, textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "0.04em", borderBottom: `1px solid ${COBALT}`, paddingBottom: "2px" }}>
              See the tools →
            </Link>
            <Link href="/enterprise" style={{ color: COBALT, textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "0.04em", borderBottom: `1px solid ${COBALT}`, paddingBottom: "2px" }}>
              The Compliance Co-Pilot, as a managed service →
            </Link>
          </div>
        </div>
      </section>

      <SectionBreaker
        kicker="How it works"
        title="Built once and handed over —"
        accent="or built and run for you."
        variant="tint"
      />

      {/* 5. HOW IT WORKS — offer shape per Ste's confirmed answer */}
      <section style={{ background: WHITE, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "24px" : "32px" }}>
            {[
              {
                n: "01",
                t: "You tell me what's broken",
                d: "A short conversation about what information lives where, who needs it, and what's eating the most time. No spec required — that's the job.",
              },
              {
                n: "02",
                t: "I scope it and price it",
                d: "Bespoke work genuinely varies, so there's no public rate card. You get a clear scope and a fixed price before anything is built.",
              },
              {
                n: "03",
                t: "It's built around how you work",
                d: "Not a template with your logo on it. Tested against real jobs, adjusted until it holds.",
              },
              {
                n: "04",
                t: "You choose: own it, or have it run for you",
                d: "Some systems are built once and handed over — yours, no ongoing tie. Others need hosting, updates and someone watching them; those run as a managed monthly service. Which one is a decision, not a default.",
              },
            ].map((s) => (
              <div key={s.n} style={{ borderTop: `2px solid ${COBALT}`, paddingTop: "18px" }}>
                <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, color: COBALT, fontSize: "14px", letterSpacing: "0.08em", margin: "0 0 8px" }}>{s.n}</p>
                <h3 style={{ color: NAVY, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "17px", margin: "0 0 10px", lineHeight: 1.3 }}>{s.t}</h3>
                <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "15px", lineHeight: 1.65, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
          {/* Audience — per Ste's confirmed answer: engineering & M&E only. */}
          <p style={{ color: `rgba(${NAVY_RGB},0.62)`, fontSize: "14px", lineHeight: 1.6, margin: "40px 0 0", fontStyle: "italic", maxWidth: "640px" }}>
            Built for engineering services and M&amp;E contractors. If that's not your business, this probably isn't the right fit — and I'd rather say so than take the work.
          </p>
        </div>
      </section>

      {/* 6. CTA — pricing gated behind enquiry, per Ste's confirmed answer */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "90px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 16px", lineHeight: 1.05,
          }}>
            Tell me what's eating your week.
          </h2>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "16px", lineHeight: 1.7, margin: "0 0 32px" }}>
            Priced per project, scoped before anything is built. Reply within two working days.
          </p>
          <Link href={ctaHref} onClick={() => track("cta_automation_footer")} style={{
            background: COBALT, color: "#fff", textDecoration: "none",
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
            padding: "16px 40px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
          }}>
            Start the conversation →
          </Link>
          <p style={{ color: `rgba(${CREAM_RGB},0.55)`, fontSize: "12.5px", margin: "18px 0 0" }}>
            <span style={{ color: COBALT_ON_DARK, fontWeight: 700 }}>✓</span> Engineering contractors only &nbsp;·&nbsp;
            <span style={{ color: COBALT_ON_DARK, fontWeight: 700 }}>✓</span> Fixed price before build &nbsp;·&nbsp;
            <span style={{ color: COBALT_ON_DARK, fontWeight: 700 }}>✓</span> Own it or have it run for you
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
