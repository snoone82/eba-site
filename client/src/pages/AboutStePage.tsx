/**
 * About Ste — the technical-authority page behind the AI tools.
 *
 * POSITIONING: Mark owns the Academy (operator story, brass/RUST accent);
 * Ste owns the Tools (builder story, verdigris/COBALT accent). Keeping the
 * accents split is deliberate — it reads as two named authorities, not one
 * founder plus staff.
 *
 * ⚠ DRAFT — currently noIndex. Every fact only Ste can supply is marked with
 * a <Fill> span so it is impossible to ship this page by accident with
 * invented biography in it. Do NOT write career facts here that Ste has not
 * confirmed: no dates, no employers, no qualifications beyond NEBOSH, no
 * numbers. When the copy is final: remove the <Fill> spans, delete the
 * noIndex flag in Seo.tsx, and add the route to sitemap.xml.
 */

import { Link } from "wouter";
import { MobileNav } from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/useMobile";
import {
  NAVY,
  CREAM,
  NAVY_RGB,
  CREAM_RGB,
  DARK_GRADIENT,
  IS_VIVID,
  ON_DARK,
  ON_DARK_RGB,
  HERO_GLOW,
  ACCENT_GRAD,
  COBALT,
  COBALT_ON_DARK,
  CTA_PRIMARY_BG,
  CTA_PRIMARY_TEXT,
} from "@/lib/constants";
import { SectionBreaker } from "@/components/SectionBreaker";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * AMBER — a fact only Ste can supply, still missing. Deliberately loud;
 * this page must never go live with these still in it.
 */
function Fill({ children }: { children: string }) {
  return (
    <span style={{
      background: "rgba(255,159,28,0.18)",
      borderBottom: "2px dotted rgba(255,159,28,0.9)",
      padding: "0 4px",
      fontStyle: "italic",
    }}>
      [{children}]
    </span>
  );
}

/**
 * VERDIGRIS — copy drafted on Ste's behalf that states a view attributed to
 * him. Reads as finished prose but is NOT yet his word. Must be approved,
 * edited or replaced before the noIndex comes off: a vision statement in
 * someone's name has to actually be their view.
 */
function Draft({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: "rgba(43,199,181,0.14)",
      borderBottom: "2px dotted rgba(12,107,95,0.75)",
      padding: "0 4px",
    }}>
      {children}
    </span>
  );
}

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

export function AboutStePage() {
  const isMobile = useIsMobile();
  const rule = { width: "48px", height: "3px", background: ACCENT_GRAD, borderRadius: "2px", margin: "0 0 24px" } as React.CSSProperties;
  const bodyLight = { color: `rgba(${NAVY_RGB},0.78)`, fontSize: "16px", lineHeight: 1.8, margin: 0 } as React.CSSProperties;
  const bodyDark = { color: `rgba(${CREAM_RGB},0.8)`, fontSize: "17px", lineHeight: 1.75, margin: 0 } as React.CSSProperties;
  const h2Light = {
    fontFamily: "var(--eba-heading)", fontWeight: 800,
    fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
    color: NAVY, margin: "0 0 24px", lineHeight: 1.1,
  } as React.CSSProperties;
  const h2Dark = { ...h2Light, color: ON_DARK } as React.CSSProperties;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      {/* noIndex while the page still carries <Fill> placeholders — remove once final. */}
      <Seo {...PAGE_SEO.aboutSte} noIndex />
      <MobileNav transparent={false} />

      {/* 1. HERO — lead with the credential that matters: built inside a real group */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "80px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <Kicker light>Head of Automation · KEYIS Group</Kicker>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05, maxWidth: "760px",
          }}>
            These tools weren't built by a software company.
          </h1>
          <p style={{ ...bodyDark, maxWidth: "620px" }}>
            They were built inside a working engineering group, by someone who spent years doing
            the compliance paperwork by hand — and got tired of watching it eat good people's weeks.
          </p>
        </div>
      </section>

      {/* 2. THE PROBLEM I LIVED — establishes he is one of them, not a vendor */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr", gap: isMobile ? "40px" : "80px", alignItems: "start" }}>
            {/* TODO(eba): replace with a real photo of Ste — on site or at a desk with
                the tools on screen. Same treatment as MARK_PHOTO_STORY. */}
            <div style={{
              aspectRatio: "4 / 3", background: `rgba(${NAVY_RGB},0.06)`,
              border: `1px dashed rgba(${NAVY_RGB},0.25)`, borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px",
            }}>
              <span style={{ fontSize: "13px", color: `rgba(${NAVY_RGB},0.5)`, lineHeight: 1.6 }}>
                Photo of Ste needed<br />(site or desk, tools on screen)
              </span>
            </div>
            <div>
              <Kicker>The problem I lived</Kicker>
              <div style={rule} />
              <h2 style={h2Light}>I came at this from health &amp; safety, not from tech.</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p style={bodyLight}>
                  My background is health and safety. Five years as an H&amp;S Manager, and a NEBOSH
                  qualification behind it. That meant living inside the documentation engineering
                  contractors run on: RAMS, COSHH assessments, method statements, O&amp;M manuals,
                  CDM records.
                </p>
                <p style={bodyLight}>
                  {/* TODO(eba): CLIENT NAME — confirm KEYIS has consent to name Nutricia
                      publicly. Construction contracts routinely carry confidentiality
                      clauses. Fallback if not: "an £18m project for a household-name food
                      manufacturer" — nearly as strong, zero risk. */}
                  Then came an £18m project for KEYIS at Nutricia. A job that size generates
                  documentation at a rate that no amount of personal organisation keeps up with —
                  every package, every subcontractor, every revision. <Fill>One line on what
                  actually happened to you on that job — the deadline, the evening, the thing that
                  made you stop and think there has to be a better way</Fill>
                </p>
                <p style={bodyLight}>
                  The work itself was necessary. The way we were doing it wasn't. The same
                  information was being retyped into different templates, by qualified people who
                  should have been on site.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT I DID ABOUT IT — the turn from practitioner to builder */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Kicker light>What I did about it</Kicker>
          <h2 style={h2Dark}>So I learned to build the thing I wanted.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={bodyDark}>
              Self-taught. No computer science background, no development team — just a problem I
              understood better than anyone who'd have been hired to solve it.
            </p>
            <p style={bodyDark}>
              The first thing I built was an H&amp;S dashboard for project managers: their compliance
              position, visible whenever they needed to see it, instead of it living in my inbox
              and my spreadsheets. Not a product, not a demo — an internal tool that had to work on
              real jobs with real deadlines, or it got thrown out.
            </p>
            <p style={bodyDark}>
              That's the difference. Software built to be sold gets designed around what demos
              well. Software built to be used gets designed around what happens at 6pm on a Friday
              when the documents have to go out.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHAT I BUILT — the tools, honestly framed */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Kicker>What I built</Kicker>
          <div style={rule} />
          <h2 style={h2Light}>Now Head of Automation for the group.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={bodyLight}>
              The job is developing the group's automation strategy, integrating the digital and
              physical tools used on site so they actually talk to each other, and managing the
              change and training that makes any of it stick. That last part is the one people
              underestimate: the technology is rarely the hard bit.
            </p>
            <p style={bodyLight}>
              The tools EBA sells are the same tools, productised. The RAMS generator, the COSHH
              assessments, the O&amp;M compiler, the Compliance Co-Pilot — these were built for KEYIS
              Group first, ran on live projects there, and only then were offered to anyone else.
              EBA exists to put them in the hands of contractors who don't have an automation
              team of their own.
            </p>
            <p style={bodyLight}>
              I'd rather tell you that plainly than dress it up. You're not buying a startup's
              first guess at your industry. You're buying something that already had to survive
              contact with it.
            </p>
          </div>
        </div>
      </section>

      <SectionBreaker
        kicker="Where this goes"
        title="The paperwork is the easy part."
        accent="It's what comes after."
        variant="tint"
      />

      {/* 5. THE VISION — forward-looking, the reason to follow rather than just buy */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Kicker light>The vision</Kicker>
          <h2 style={h2Dark}>Where I think this industry goes next.</h2>
          {/* DRAFTED FOR APPROVAL — Ste asked me to propose a position. Everything
              inside <Draft> is my wording of a view attributed to him, grounded in
              the automation role he actually holds. He must approve, edit or replace
              it before this page is indexed. Do not quietly promote it to plain text. */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={bodyDark}>
              <Draft>
                I don't think AI replaces engineers, and I'm suspicious of anyone selling that.
                What it changes is where the work sits. Compliance documents stop being written
                from a blank page and start being generated from what the business already knows —
                and the qualified person's job moves from producing them to checking them. That's
                a better use of a NEBOSH-qualified brain than retyping a method statement.
              </Draft>
            </p>
            <p style={bodyDark}>
              <Draft>
                What I want to have built is the loop closed: what actually happens on site writes
                the paperwork, rather than someone reconstructing it afterwards from memory and
                photographs. The tools on site already produce that data. Almost nobody is
                connecting it to the documents it should be generating. That's the gap I'm working
                in, and it's where I think the next few years go.
              </Draft>
            </p>
            <p style={bodyDark}>
              <Draft>
                The contractors who work this out early won't be the biggest ones. They'll be the
                ones who stopped treating compliance as a cost of doing business and started
                treating it as something a machine should handle.
              </Draft>
            </p>
          </div>
        </div>
      </section>

      {/* 6. CTA — send to Tools first (his domain), Academy second */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "90px 40px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "var(--eba-heading)", fontWeight: 900,
          fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
          color: NAVY, margin: "0 0 28px", lineHeight: 1.05,
        }}>
          See what the tools actually do.
        </h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/ai-tools" style={{
            background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
            padding: "15px 34px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "6px",
          }}>
            Explore the AI tools →
          </Link>
          <Link href="/our-story" style={{
            background: "transparent", color: NAVY, textDecoration: "none",
            fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
            padding: "15px 34px", border: `1px solid rgba(${NAVY_RGB},0.4)`, display: "inline-block", borderRadius: "6px",
          }}>
            Meet Mark →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
