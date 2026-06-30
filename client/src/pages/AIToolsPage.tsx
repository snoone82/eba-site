/**
 * EBA AI Tools Page
 * Design: Warm Editorial Authority
 * Shows animated demo previews of O&M manual compiler and compliance chatbot
 * Live tools redirect to tools subdomain
 */

import { Link, useLocation } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/useMobile";
import { useState, useEffect, useRef } from "react";
import {
  ENROL_HREF,
  ENROL_READY,
  ENROL_PENDING_LABEL,
  STRIPE,
  COMPANY_REG,
  RUST,
  NAVY,
  CREAM,
  OAT,
  AMBER,
  isPlaceholder,
} from "@/lib/constants";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track } from "@/lib/track";
import { Check } from "lucide-react";

const TOOLS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/104280767/Hckr7ge87tHNputhSZAfow/eba-tools-hero-7Tmxbyb64azJnSqcMHzLQZ.webp";

function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <span style={{
      display: "inline-block",
      background: light ? "rgba(163,81,57,0.15)" : RUST,
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

// ── O&M MANUAL DEMO ──
const omSteps = [
  { label: "Upload documents", detail: "Manufacturer datasheets, as-built drawings, commissioning records, certificates" },
  { label: "AI processes & structures", detail: "Extracts equipment schedules, maintenance intervals, spare parts lists, emergency procedures" },
  { label: "Review and customise", detail: "Add your company branding, adjust section order, add project-specific notes" },
  { label: "Download professional PDF", detail: "Fully structured O&M manual — compliant, branded, ready for handover" },
];

function OmManualDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % omSteps.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#fff", border: `1px solid ${OAT}`, overflow: "hidden" }}>
      {/* Mock browser bar */}
      <div style={{ background: OAT, padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, background: "rgba(27,38,50,0.08)", borderRadius: "3px", padding: "4px 12px", marginLeft: "8px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(27,38,50,0.5)" }}>
            tools.engineeringbusinessacademy.co.uk/om-manual
          </span>
        </div>
      </div>
      {/* Demo content */}
      <div style={{ padding: "32px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#28c840" }}>
            Live Tool
          </span>
        </div>
        <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: NAVY, margin: "0 0 24px" }}>
          O&M Manual Compiler
        </h4>
        {/* Progress steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {omSteps.map((s, i) => (
            <div key={i} style={{
              padding: "14px 18px",
              background: i === step ? NAVY : i < step ? "rgba(27,38,50,0.04)" : "transparent",
              borderLeft: `3px solid ${i === step ? RUST : i < step ? "rgba(163,81,57,0.3)" : OAT}`,
              transition: "all 0.4s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  background: i < step ? RUST : i === step ? "#fff" : OAT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 700,
                  color: i < step ? "#fff" : i === step ? NAVY : "rgba(27,38,50,0.4)",
                }}>
                  {i < step ? <Check size={12} strokeWidth={3} /> : i + 1}
                </div>
                <div>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
                    color: i === step ? "#fff" : i < step ? NAVY : "rgba(27,38,50,0.5)",
                    margin: "0 0 2px",
                  }}>
                    {s.label}
                  </p>
                  {i === step && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(238,233,223,0.7)", margin: 0 }}>
                      {s.detail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "20px", padding: "14px 18px", background: "rgba(163,81,57,0.06)", borderLeft: `3px solid ${RUST}` }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(27,38,50,0.6)", margin: 0 }}>
            <strong style={{ color: NAVY }}>Time saved:</strong> 2–3 days of manual compilation → under 30 minutes
          </p>
        </div>
      </div>
    </div>
  );
}

// ── COMPLIANCE CHATBOT DEMO ──
const chatMessages = [
  { role: "user", text: "What are our CDM Principal Contractor obligations for this project?" },
  { role: "bot", text: "Based on your CDM 2015 procedures document (Section 4.2), as Principal Contractor you are required to: plan, manage and monitor construction work; ensure suitable welfare facilities are provided; draw up construction phase plan before work begins; and liaise with the Principal Designer on pre-construction information. Source: KEYIS CDM Procedures v3.1, p.12." },
  { role: "user", text: "Do we need a hot works permit for this electrical installation?" },
  { role: "bot", text: "Yes. Your Hot Works Permit procedure (Form HS-07) is required for any work involving open flames, heat guns, or equipment that could ignite materials. The permit must be signed by the site supervisor and reviewed at the end of each shift. Source: KEYIS Safe Systems of Work, Section 8." },
];

function ComplianceChatDemo() {
  const [visibleMessages, setVisibleMessages] = useState(1);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (visibleMessages >= chatMessages.length) {
      const reset = setTimeout(() => setVisibleMessages(1), 4000);
      return () => clearTimeout(reset);
    }
    const delay = chatMessages[visibleMessages - 1].role === "user" ? 1800 : 2800;
    const t = setTimeout(() => {
      if (chatMessages[visibleMessages]?.role === "bot") {
        setTyping(true);
        setTimeout(() => { setTyping(false); setVisibleMessages(v => v + 1); }, 1200);
      } else {
        setVisibleMessages(v => v + 1);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [visibleMessages]);

  return (
    <div style={{ background: "#fff", border: `1px solid ${OAT}`, overflow: "hidden" }}>
      <div style={{ background: OAT, padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, background: "rgba(27,38,50,0.08)", borderRadius: "3px", padding: "4px 12px", marginLeft: "8px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(27,38,50,0.5)" }}>
            tools.engineeringbusinessacademy.co.uk/compliance-chat
          </span>
        </div>
      </div>
      <div style={{ padding: "24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#28c840" }}>
            Trained on your documents
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "280px" }}>
          {chatMessages.slice(0, visibleMessages).map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              animation: "fadeIn 0.3s ease-out",
            }}>
              {msg.role === "bot" && (
                <div style={{
                  width: "28px", height: "28px", background: NAVY, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginRight: "8px", alignSelf: "flex-end",
                }}>
                  <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>EB</span>
                </div>
              )}
              <div style={{
                maxWidth: "80%",
                background: msg.role === "user" ? NAVY : OAT,
                color: msg.role === "user" ? "#fff" : NAVY,
                padding: "10px 14px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", lineHeight: 1.55,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>EB</span>
              </div>
              <div style={{ background: OAT, padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%", background: RUST,
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: "16px", borderTop: `1px solid ${OAT}`, paddingTop: "12px", display: "flex", gap: "8px" }}>
          <div style={{
            flex: 1, background: OAT, padding: "10px 14px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(27,38,50,0.4)",
          }}>
            Ask a safety or compliance question...
          </div>
          <div style={{ background: RUST, padding: "10px 16px", display: "flex", alignItems: "center" }}>
            <span style={{ color: "#fff", fontSize: "16px" }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// `checkout` is the single place to wire each tool's Stripe Payment Link (see
// STRIPE in constants.ts). While it is a TODO placeholder the CTA stays an
// internal "details & pricing" link; once a real link is set the CTA buys directly.
const allTools = [
  {
    label: "O&M MANUAL COMPILER",
    title: "O&M Manuals in hours, not days.",
    body: "Upload your project data. The system compiles a fully formatted, client-ready O&M manual — structured to UK CDM requirements — in a fraction of the time it previously took. Every completed M&E project legally requires one — built to produce it without the manual slog.",
    price: "£150 per manual",
    status: "live",
    href: "/ai-tools/om-manual",
    checkout: STRIPE.omManual,
    demo: <OmManualDemo />,
  },
  {
    label: "COMPLIANCE CHATBOT",
    title: "Your company's safety knowledge, on demand.",
    body: "The Compliance Chatbot is trained on your company's HSEQ documentation. Your engineers ask it questions — it answers instantly, accurately, and in your company's voice. Available as a standalone subscription or as a fully managed white-label deployment for your entire organisation.",
    price: "From £149/month",
    status: "live",
    href: "/ai-tools/compliance-chatbot",
    checkout: STRIPE.complianceChatbot,
    demo: <ComplianceChatDemo />,
  },
];

const comingSoon = [
  {
    label: "RAMS GENERATOR · COMING MONTH 1",
    title: "Compliant RAMS in minutes.",
    body: "Select your activity, your hazards, your controls. The RAMS Generator produces a fully formatted, regulation-compliant Risk Assessment and Method Statement ready to submit — without a specialist.",
    price: "Included in subscription / standalone pricing TBC",
  },
  {
    label: "TENDER ASSISTANT · COMING MONTH 2",
    title: "Win more bids. Lose fewer on price.",
    body: "The Tender Assistant analyses your bid against project requirements, flags commercial risks, and helps you price accurately — without leaving margin on the table. Built for contractors without a bid team.",
    price: "Included in subscription / standalone pricing TBC",
  },
  {
    label: "COSHH GENERATOR · COMING MONTH 3",
    title: "COSHH assessments in a minute.",
    body: "Chemical substance, task, exposure route — assessed and documented instantly. No specialist knowledge required. Produces a compliant, branded PDF ready for the site file.",
    price: "Included in subscription / standalone pricing TBC",
  },
  {
    label: "TOOLBOX TALK GENERATOR · COMING MONTH 4",
    title: "Site-specific toolbox talks, weekly.",
    body: "Stop recycling the same generic toolbox talks. Generate site-specific, task-relevant safety briefings in under 60 seconds — with a sign-off sheet included.",
    price: "Included in subscription",
  },
];


function NotifyMeForm({ toolName }: { toolName: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 800);
  };

  if (submitted) {
    return (
      <p style={{ color: "rgba(163,81,57,0.8)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontStyle: "italic", margin: "12px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
        <Check size={13} strokeWidth={2.5} style={{ flexShrink: 0 }} /> We'll notify you when {toolName} is live.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{
          flex: 1, minWidth: "160px", padding: "9px 12px",
          border: `1px solid rgba(27,38,50,0.2)`, background: "rgba(238,233,223,0.6)",
          fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: NAVY, outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: RUST, color: "#fff", border: "none", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "11px",
          padding: "9px 16px", letterSpacing: "0.05em", opacity: loading ? 0.7 : 1,
          whiteSpace: "nowrap" as const,
        }}
      >
        {loading ? "..." : "Notify me"}
      </button>
    </form>
  );
}

function AIToolsNav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className="eba-desktop-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(27,38,50,0.97)" : "rgba(27,38,50,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? `1px solid rgba(163,81,57,0.3)` : "none",
        transition: "all 0.3s ease",
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <EBALogo height={38} light={true} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[
              { label: "Academy", href: "/academy" },
              { label: "AI Tools", href: "/ai-tools" },
              { label: "Documents", href: "/documents" },
              { label: "Our Story", href: "/our-story" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{
                color: href === "/ai-tools" ? "#fff" : "rgba(255,255,255,0.7)",
                textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                fontWeight: href === "/ai-tools" ? 600 : 500, fontSize: "14px",
                borderBottom: href === "/ai-tools" ? `2px solid ${RUST}` : "none",
                paddingBottom: "2px",
              }}>
                {label}
              </Link>
            ))}
            <span><a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
              background: RUST, color: "#fff", textDecoration: "none",
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

export default function AIToolsPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isMobile = useIsMobile();
  const [location] = useLocation();
  const seoMeta =
    location === "/ai-tools/om-manual"
      ? PAGE_SEO.omManual
      : location === "/ai-tools/compliance-chatbot"
        ? PAGE_SEO.complianceChatbot
        : PAGE_SEO.aiTools;
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...seoMeta} />
      <MobileNav transparent={true} />


      {/* ── NAV ── desktop only */}
      <AIToolsNav scrolled={scrolled} />
      {/* ── HERO ── */}
      <section style={{
        paddingTop: isMobile ? "90px" : "120px", paddingBottom: "80px",
        background: NAVY,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.12,
          backgroundImage: `url(${TOOLS_IMG})`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <SectionLabel>AI Tools for M&E Contractors</SectionLabel>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em",
            color: "#fff", margin: "0 0 24px", lineHeight: 1.05, maxWidth: "720px",
          }}>
            Built for how M&E actually works.
          </h1>
          <p style={{
            color: "rgba(238,233,223,0.75)", fontSize: "18px", lineHeight: 1.65,
            maxWidth: "580px", margin: "0 0 48px",
          }}>
            We built these because they didn't exist. Every M&E contractor we know was either drowning in paperwork or paying agencies thousands to produce documents that AI can now generate in minutes. The difference: ours are built specifically for M&E engineering contractors.
          </p>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { value: "2–3 days", label: "Saved per O&M manual" },
              { value: "£0", label: "Extra staff required" },
              { value: "24/7", label: "Compliance answers" },
            ].map(({ value, label }) => (
              <div key={label} style={{ borderLeft: `3px solid ${RUST}`, paddingLeft: "16px" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "1.6rem", fontWeight: 700, margin: "0 0 4px" }}>
                  {value}
                </p>
                <p style={{ color: "rgba(238,233,223,0.55)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE TOOLS WITH DEMOS ── */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel light>Live Now</SectionLabel>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 64px",
            }}>
              Two tools. Live now. Try them.
            </h2>
          </RevealSection>

          {allTools.map((tool, i) => (
            <RevealSection key={i} style={{ marginBottom: isMobile ? "48px" : "80px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : (i % 2 === 0 ? "1fr 1.1fr" : "1.1fr 1fr"),
                gap: isMobile ? "32px" : "64px", alignItems: "start",
              }}>
                {i % 2 === 0 ? (
                  <>
                    <div>
                      <SectionLabel light>{tool.label}</SectionLabel>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif", fontWeight: 800,
                        fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.02em",
                        color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
                      }}>
                        {tool.title}
                      </h3>
                      <p style={{ color: "rgba(27,38,50,0.7)", fontSize: "16px", lineHeight: 1.7, margin: "0 0 28px" }}>
                        {tool.body}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700 }}>
                          {tool.price}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#28c840", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#28c840", display: "inline-block", animation: "pulse 2s infinite" }} />
                          LIVE NOW
                        </span>
                      </div>
                      {!isPlaceholder(tool.checkout) ? (
                        <a href={tool.checkout} target="_blank" rel="noopener noreferrer" style={{
                          background: RUST, color: "#fff", textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                          padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
                          transition: "opacity 0.2s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                          onClick={() => track("cta_tool_checkout", { tool: tool.label })}
                        >
                          Buy now →
                        </a>
                      ) : (
                        <Link href={tool.href} style={{
                          background: RUST, color: "#fff", textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                          padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
                          transition: "opacity 0.2s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                          onClick={() => track("cta_tool_detail", { tool: tool.label })}
                        >
                          See full details & pricing →
                        </Link>
                      )}
                    </div>
                    <div>{tool.demo}</div>
                  </>
                ) : (
                  <>
                    <div>{tool.demo}</div>
                    <div>
                      <SectionLabel light>{tool.label}</SectionLabel>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif", fontWeight: 800,
                        fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.02em",
                        color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
                      }}>
                        {tool.title}
                      </h3>
                      <p style={{ color: "rgba(27,38,50,0.7)", fontSize: "16px", lineHeight: 1.7, margin: "0 0 28px" }}>
                        {tool.body}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "1.1rem", fontWeight: 700 }}>
                          {tool.price}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#28c840", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#28c840", display: "inline-block", animation: "pulse 2s infinite" }} />
                          LIVE NOW
                        </span>
                      </div>
                      {!isPlaceholder(tool.checkout) ? (
                        <a href={tool.checkout} target="_blank" rel="noopener noreferrer" style={{
                          background: RUST, color: "#fff", textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                          padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
                          transition: "opacity 0.2s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                          onClick={() => track("cta_tool_checkout", { tool: tool.label })}
                        >
                          Buy now →
                        </a>
                      ) : (
                        <Link href={tool.href} style={{
                          background: RUST, color: "#fff", textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                          padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
                          transition: "opacity 0.2s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                          onClick={() => track("cta_tool_detail", { tool: tool.label })}
                        >
                          See full details & pricing →
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── COMING SOON ── */}
      <section style={{ background: OAT, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel>In Development</SectionLabel>
            <h2 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px",
            }}>
              More tools coming shortly.
            </h2>
            <p style={{ color: "rgba(27,38,50,0.65)", fontSize: "16px", lineHeight: 1.65, maxWidth: "520px", margin: "0 0 48px" }}>
              All included in the Academy subscription. Available standalone for non-members.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {comingSoon.map((tool, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{
                  background: "#fff", borderTop: `3px solid rgba(163,81,57,0.25)`,
                  padding: "28px 28px", opacity: 0.8,
                }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                    fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "rgba(27,38,50,0.4)", display: "block", marginBottom: "12px",
                  }}>
                    {tool.label}
                  </span>
                  <h4 style={{
                    fontFamily: "'Playfair Display', serif", fontWeight: 700,
                    fontSize: "1.1rem", color: NAVY, margin: "0 0 10px",
                  }}>
                    {tool.title}
                  </h4>
                  <p style={{ color: "rgba(27,38,50,0.6)", fontSize: "13px", lineHeight: 1.6, margin: "0 0 16px" }}>
                    {tool.body}
                  </p>
                  <span style={{
                    fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                    color: "rgba(163,81,57,0.6)", fontSize: "13px",
                  }}>
                    {tool.price}
                  </span>
                  <NotifyMeForm toolName={tool.title} />
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHITE LABEL ── */}
      <section style={{ background: NAVY, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "64px", alignItems: "center" }}>
              <div>
                <SectionLabel>For Companies</SectionLabel>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif", fontWeight: 800,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
                  color: "#fff", margin: "0 0 20px", lineHeight: 1.1,
                }}>
                  Your own branded compliance assistant. Deployed across your entire organisation.
                </h2>
                <p style={{ color: "rgba(238,233,223,0.75)", fontSize: "16px", lineHeight: 1.65, margin: "0 0 32px" }}>
                  The same AI technology that powers the EBA Compliance Chatbot — trained on your specific HSEQ documentation, branded with your company identity, deployed to every engineer in your business. Implementation: 2 weeks. Cost: a fraction of what a compliance consultancy charges. Capability: your entire safety knowledge base, available to every person on site, 24 hours a day.
                </p>
                <div style={{ display: "flex", gap: "32px", marginBottom: "36px" }}>
                  {[
                    { value: "£997–£1,997", label: "Setup" },
                    { value: "£149–£349/mo", label: "Retainer" },
                    { value: "vs £25k+", label: "Agency cost" },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "1.2rem", fontWeight: 700, margin: "0 0 4px" }}>
                        {value}
                      </p>
                      <p style={{ color: "rgba(238,233,223,0.45)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <Link href="/contact" style={{
                  background: RUST, color: "#fff", textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                  padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
                }}>
                  Enquire about a deployment →
                </Link>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", borderLeft: `3px solid ${RUST}`, padding: "36px 32px" }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif", fontStyle: "italic",
                  color: "#fff", fontSize: "1rem", lineHeight: 1.75, margin: "0 0 20px",
                }}>
                  "UK agencies charge £3,000–£25,000 to build custom AI chatbots. We are the accessible, managed end of that market — lower setup, plus a recurring retainer that covers hosting, updates and support. Cheaper than the agencies, and far cheaper than per-seat AI licences for a whole workforce."
                </p>
                <p style={{ color: "rgba(238,233,223,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                  EBA AI Tools Catalogue, June 2026
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: NAVY, borderTop: `1px solid rgba(163,81,57,0.3)`, padding: isMobile ? "40px 20px 24px" : "48px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "24px" : "0", marginBottom: "20px" }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <EBALogo height={38} light={true} />
            </Link>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {[{ label: "Home", href: "/" }, { label: "Academy", href: "/academy" }, { label: "Our Story", href: "/our-story" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
                <Link key={href} href={href} style={{ color: "rgba(238,233,223,0.72)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "13px" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "12px" : "0" }}>
            <div>
              <p style={{ color: "rgba(238,233,223,0.3)", fontSize: "12px", margin: "0 0 3px" }}>© 2026 The Engineering Business Academy. All rights reserved.</p>
              <p style={{ color: "rgba(238,233,223,0.2)", fontSize: "11px", margin: 0 }}>{!isPlaceholder(COMPANY_REG) && <>Company Reg: {COMPANY_REG} · </>}Registered in England &amp; Wales</p>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link href="/privacy-policy" style={{ color: "rgba(238,233,223,0.3)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "rgba(238,233,223,0.3)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}>Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
