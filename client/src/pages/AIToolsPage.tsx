/**
 * EBA AI Tools Page
 * Design: Warm Editorial Authority
 * Shows animated demo previews of O&M manual compiler and compliance chatbot
 * Live tools redirect to tools subdomain
 */

import { Link, useLocation } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ToolboxLeadMagnet } from "@/components/ToolboxLeadMagnet";
import { SectionBreaker } from "@/components/SectionBreaker";
import { Photo } from "@/components/Photo";
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
  isPlaceholder, OM_SERVICE_URL, TOOL_PRICE_NOTES,
  WHITE,
  DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB,
  IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT, CTA_BAND_BG, NAV_RGB,
  NAV_BAR_BG, NAV_LINK, NAV_LINK_ACTIVE, NAV_BORDER, NAV_CTA_BG, NAV_CTA_TEXT,
  HERO_GLOW, SECTION_GLOW,
  COBALT, COBALT_RGB, COBALT_ON_DARK, ENTERPRISE_PRICING,
} from "@/lib/constants";
import { RoiStatBand } from "@/components/RoiStatBand";
import { ProductFrame } from "@/components/ProductFrame";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track } from "@/lib/track";
import { Check, FileText, ShieldCheck, MessageSquareText, FlaskConical, Sparkles } from "lucide-react";

const TOOLS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/104280767/Hckr7ge87tHNputhSZAfow/eba-tools-hero-7Tmxbyb64azJnSqcMHzLQZ.webp";

// Tools page = tools accent (cobalt). Academy/Mark/story sections keep rust.
function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <span style={{
      display: "inline-block",
      background: light ? `rgba(${COBALT_RGB},0.12)` : COBALT,
      color: light ? COBALT : "#fff",
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
    <div className="eba-grad-border--hover eba-lift" style={{ background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.10)`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 50px -28px rgba(0,0,0,0.22)" }}>
      {/* Mock browser bar */}
      <div style={{ background: OAT, padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, background: `rgba(${NAVY_RGB},0.08)`, borderRadius: "3px", padding: "4px 12px", marginLeft: "8px" }}>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: `rgba(${NAVY_RGB},0.72)` }}>
            eba.academy/ai-tools/om-manual
          </span>
        </div>
      </div>
      {/* Demo content */}
      <div style={{ padding: "32px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#28c840" }}>
            Live Tool
          </span>
        </div>
        <h4 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.1rem", color: NAVY, margin: "0 0 24px" }}>
          O&M Manual Compiler
        </h4>
        {/* Progress steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {omSteps.map((s, i) => (
            <div key={i} style={{
              padding: "14px 18px",
              background: i === step ? NAVY : i < step ? `rgba(${NAVY_RGB},0.04)` : "transparent",
              borderLeft: `3px solid ${i === step ? COBALT : i < step ? `rgba(${COBALT_RGB},0.3)` : OAT}`,
              transition: "all 0.4s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  background: i < step ? COBALT : i === step ? "#fff" : OAT,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 700,
                  color: i < step ? "#fff" : i === step ? NAVY : `rgba(${NAVY_RGB},0.4)`,
                }}>
                  {i < step ? <Check size={12} strokeWidth={3} /> : i + 1}
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px",
                    color: i === step ? "#fff" : i < step ? NAVY : `rgba(${NAVY_RGB},0.5)`,
                    margin: "0 0 2px",
                  }}>
                    {s.label}
                  </p>
                  {i === step && (
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: `rgba(${CREAM_RGB},0.7)`, margin: 0 }}>
                      {s.detail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "20px", padding: "14px 18px", background: `rgba(${COBALT_RGB},0.06)`, borderLeft: `3px solid ${COBALT}` }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: `rgba(${NAVY_RGB},0.72)`, margin: 0 }}>
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
  { role: "bot", text: "Based on your CDM 2015 procedures document (Section 4.2), as Principal Contractor you are required to: plan, manage and monitor construction work; ensure suitable welfare facilities are provided; draw up construction phase plan before work begins; and liaise with the Principal Designer on pre-construction information. Source: your CDM Procedures v3.1, p.12." },
  { role: "user", text: "Do we need a hot works permit for this electrical installation?" },
  { role: "bot", text: "Yes. Your Hot Works Permit procedure (Form HS-07) is required for any work involving open flames, heat guns, or equipment that could ignite materials. The permit must be signed by the site supervisor and reviewed at the end of each shift. Source: your Safe Systems of Work, Section 8." },
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
    <div className="eba-grad-border--hover eba-lift" style={{ background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.10)`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 50px -28px rgba(0,0,0,0.22)" }}>
      <div style={{ background: OAT, padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
        ))}
        <div style={{ flex: 1, background: `rgba(${NAVY_RGB},0.08)`, borderRadius: "3px", padding: "4px 12px", marginLeft: "8px" }}>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: `rgba(${NAVY_RGB},0.72)` }}>
            eba.academy/ai-tools/compliance-chat
          </span>
        </div>
      </div>
      <div style={{ padding: "24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#28c840" }}>
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
                  width: "28px", height: "28px", background: DARK_GRADIENT, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginRight: "8px", alignSelf: "flex-end",
                }}>
                  <span style={{ color: ON_DARK, fontSize: "10px", fontWeight: 700 }}>EB</span>
                </div>
              )}
              <div style={{
                maxWidth: "80%",
                background: msg.role === "user" ? NAVY : OAT,
                color: msg.role === "user" ? "#fff" : NAVY,
                padding: "10px 14px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px", lineHeight: 1.55,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", background: DARK_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: ON_DARK, fontSize: "10px", fontWeight: 700 }}>EB</span>
              </div>
              <div style={{ background: OAT, padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%", background: COBALT,
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
            fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: `rgba(${NAVY_RGB},0.72)`,
          }}>
            Ask a safety or compliance question...
          </div>
          <div style={{ background: COBALT, padding: "10px 16px", display: "flex", alignItems: "center" }}>
            <span style={{ color: ON_DARK, fontSize: "16px" }}>→</span>
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
    price: isPlaceholder(TOOL_PRICE_NOTES.omManual) ? "Pricing announced soon" : TOOL_PRICE_NOTES.omManual,
    status: "live",
    href: "/ai-tools/om-manual",
    // O&M flow preference: Kajabi-hosted service flow once set, else the
    // Stripe Payment Link, else the internal detail page (fail-safe chain).
    checkout: !isPlaceholder(OM_SERVICE_URL) ? OM_SERVICE_URL : STRIPE.omManual,
    demo: <OmManualDemo />,
  },
  {
    label: "COMPLIANCE CO-PILOT",
    title: "Your company's safety knowledge, on demand.",
    body: "The Compliance Co-Pilot is trained on your company's HSEQ documentation. Your engineers ask it questions — it answers instantly, accurately, and in your company's voice. Available as a standalone subscription or as a fully managed white-label deployment for your entire organisation.",
    price: isPlaceholder(TOOL_PRICE_NOTES.coPilot) ? "Pricing announced soon" : TOOL_PRICE_NOTES.coPilot,
    status: "live",
    href: "/ai-tools/compliance-chatbot",
    checkout: STRIPE.complianceChatbot,
    demo: <ComplianceChatDemo />,
  },
];

const comingSoon = [
  {
    label: "TENDER ASSISTANT · IN DEVELOPMENT",
    title: "Win more bids. Lose fewer on price.",
    body: "Analyses your bid against project requirements, flags commercial risks, and helps you price accurately — without leaving margin on the table. Built for contractors without a bid team.",
    price: "Included in subscription / standalone pricing TBC",
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
      <p style={{ color: COBALT, fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontStyle: "italic", margin: "12px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
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
          border: `1px solid rgba(${NAVY_RGB},0.2)`, background: `rgba(${CREAM_RGB},0.6)`,
          fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: NAVY, outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: COBALT, color: "#fff", border: "none", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px",
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
        background: NAV_BAR_BG,
        borderBottom: `1px solid ${NAV_BORDER}`,
        boxShadow: scrolled ? "0 12px 30px -18px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.3s ease",
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <EBALogo height={48} light navOnCobalt />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {[
              { label: "Academy", href: "/academy" },
              { label: "AI Tools", href: "/ai-tools" },
              { label: "Documents", href: "/documents" },
              { label: "Mentorship", href: "/mentorship" },
              { label: "Our Story", href: "/our-story" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{
                color: href === "/ai-tools" ? NAV_LINK_ACTIVE : NAV_LINK,
                textDecoration: "none", fontFamily: "'Poppins', sans-serif",
                fontWeight: href === "/ai-tools" ? 600 : 500, fontSize: "14px",
                borderBottom: href === "/ai-tools" ? `2px solid ${NAV_LINK_ACTIVE}` : "none",
                paddingBottom: "2px",
              }}>
                {label}
              </Link>
            ))}
            <span><a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
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
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...seoMeta} />
      <MobileNav transparent={true} />


      {/* ── NAV ── desktop only */}
      <AIToolsNav scrolled={scrolled} />
      {/* ── HERO ── */}
      <section style={{
        paddingTop: isMobile ? "104px" : "150px", paddingBottom: isMobile ? "56px" : "88px",
        background: DARK_GRADIENT,
        position: "relative", overflow: "hidden",
      }}>
        {IS_VIVID ? (
          <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: `url(${TOOLS_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        )}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: COBALT_ON_DARK, marginBottom: "18px" }}>
            · AI Tools · Built for engineering contractors ·
          </div>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5.5vw, 4.6rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 22px", lineHeight: 1.04, maxWidth: "820px",
          }}>
            The compliance paperwork, done in minutes.
          </h1>
          <p style={{
            color: `rgba(${ON_DARK_RGB},0.72)`, fontSize: isMobile ? "16px" : "19px", lineHeight: 1.65,
            maxWidth: "620px", margin: "0 0 36px",
          }}>
            Four AI tools built for how engineering contracting actually works — O&amp;M manuals, RAMS, COSHH, and a compliance co-pilot trained on your own documents. You stay in control: review every output before it leaves your desk.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "44px" }}>
            <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_aitools")} style={{
              background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              padding: "14px 32px", letterSpacing: "0.04em", display: "inline-block",
            }}>
              {ENROL_READY ? "Get the tools — join the Academy" : ENROL_PENDING_LABEL}
            </a>
            <a href="#tools" style={{
              background: "transparent", color: ON_DARK, textDecoration: "none",
              fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px",
              padding: "14px 32px", border: `1px solid rgba(${ON_DARK_RGB},0.28)`, display: "inline-block",
            }}>
              See the four tools ↓
            </a>
          </div>
          <div style={{ display: "flex", gap: isMobile ? "24px" : "40px", flexWrap: "wrap" }}>
            {[
              { value: "30 min", label: "Per O&M manual, not 2–3 days" },
              { value: "£0", label: "Extra staff required" },
              { value: "You", label: "Review every output" },
            ].map(({ value, label }) => (
              <div key={label} style={{ borderLeft: `3px solid ${COBALT_ON_DARK}`, paddingLeft: "16px" }}>
                <p style={{ fontFamily: "var(--eba-heading)", color: COBALT_ON_DARK, fontSize: "1.6rem", fontWeight: 800, margin: "0 0 4px" }}>
                  {value}
                </p>
                <p style={{ color: `rgba(${ON_DARK_RGB},0.72)`, fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI STAT BAND ── what the tools actually save (tools accent) */}
      <section style={{ background: CREAM, padding: isMobile ? "40px 20px" : "56px 40px", borderBottom: `1px solid rgba(${NAVY_RGB},0.06)` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <RoiStatBand />
          </RevealSection>
        </div>
      </section>

      {/* ── THE FOUR TOOLS (overview) ── */}
      <section id="tools" style={{ backgroundColor: WHITE, backgroundImage: SECTION_GLOW, padding: isMobile ? "64px 20px" : "104px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 48px" }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: COBALT, marginBottom: "14px" }}>
              · Four tools · Live now ·
            </div>
            <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2rem" : "clamp(2.2rem, 4vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: NAVY, margin: 0 }}>
              Built for engineering contractors. Ready today.
            </h2>
          </div>
          {/* Product-visual slots, not stock photos: each card shows the tool's
              output in a browser-chrome frame (see ProductFrame). */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "18px" }}>
            {[
              {
                Icon: FileText, name: "O&M Manual Compiler",
                outcome: "A client-ready, CDM-structured O&M manual in under 30 minutes — from your project data.",
                note: isPlaceholder(TOOL_PRICE_NOTES.omManual) ? "Pay per manual · pricing soon" : TOOL_PRICE_NOTES.omManual,
                frame: { url: "eba.academy/ai-tools/om-manual", docTitle: "O&M Manual — Section 4: Mechanical Services", docMeta: "Project ref · Rev A · CDM 2015 structured", lines: ["Equipment schedules extracted", "Maintenance intervals compiled", "Commissioning records indexed"] },
              },
              {
                Icon: ShieldCheck, name: "RAMS Generator",
                outcome: "A fully formatted, compliant Risk Assessment & Method Statement in minutes — no specialist needed.",
                note: isPlaceholder(TOOL_PRICE_NOTES.rams) ? "Subscription · pricing soon" : TOOL_PRICE_NOTES.rams,
                frame: { url: "eba.academy/ai-tools/rams", docTitle: "RAMS — Pipework Installation, Level 3 Riser", docMeta: "Method statement · Risk matrix · Sign-off sheet", lines: ["Task-specific hazards identified", "Control measures sequenced", "Permits and PPE listed"] },
              },
              {
                Icon: MessageSquareText, name: "Compliance Co-Pilot",
                outcome: "Your company's HSEQ knowledge, answered instantly and cited to the source document.",
                note: isPlaceholder(TOOL_PRICE_NOTES.coPilot) ? "Subscription · pricing soon" : TOOL_PRICE_NOTES.coPilot,
                frame: { url: "eba.academy/ai-tools/compliance-chat", docTitle: "Q: Do we need a hot works permit for this task?", docMeta: "Answered from: your Safe Systems of Work, Section 8", lines: ["Instant answer in your company's voice", "Cited to the source document", "Available to every engineer, 24/7"] },
              },
              {
                Icon: FlaskConical, name: "COSHH Generator",
                outcome: "A branded COSHH assessment from substance, task and exposure route — in about a minute.",
                note: "Pay per use · pricing soon",
                frame: { url: "eba.academy/ai-tools/coshh", docTitle: "COSHH Assessment — Solvent Cement, Pipe Jointing", docMeta: "Substance · Task · Exposure route · Controls", lines: ["Hazard classification pulled in", "Exposure controls specified", "Branded PDF ready to issue"] },
              },
            ].map(({ Icon, name, outcome, note, frame }) => (
              <div key={name} className="eba-bento-card" style={{
                background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.10)`, borderRadius: "20px",
                padding: isMobile ? "26px 24px" : "30px 30px", display: "flex", flexDirection: "column",
                boxShadow: "0 18px 40px -28px rgba(0,0,0,0.25)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                  <span style={{ width: "46px", height: "46px", borderRadius: "13px", background: COBALT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={22} color="#fff" strokeWidth={1.9} />
                  </span>
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.01em", color: NAVY, margin: 0 }}>{name}</h3>
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14.5px", lineHeight: 1.6, color: `rgba(${NAVY_RGB},0.72)`, margin: "0 0 18px" }}>{outcome}</p>
                <div style={{ marginBottom: "18px" }}>
                  <ProductFrame {...frame} />
                </div>
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", fontWeight: 700, color: COBALT, background: `rgba(${COBALT_RGB},0.10)`, padding: "5px 12px", borderRadius: "8px" }}>{note}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 600, color: `rgba(${NAVY_RGB},0.72)` }}>
                    <Check size={13} strokeWidth={2.5} /> You review every output
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE TOOLBOX TALK (lead magnet) ── */}
      <ToolboxLeadMagnet />

      {/* ── SECTION BREAKER ── */}
      <SectionBreaker
        kicker="See them work"
        title="Not slideware."
        accent="Real tools, real output."
        variant="dark"
      />

      {/* ── LIVE TOOLS WITH DEMOS ── */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <SectionLabel light>See it work</SectionLabel>
            <h2 style={{
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 64px",
            }}>
              See two of them in action.
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
                        fontFamily: "var(--eba-heading)", fontWeight: 800,
                        fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.02em",
                        color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
                      }}>
                        {tool.title}
                      </h3>
                      <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "16px", lineHeight: 1.7, margin: "0 0 28px" }}>
                        {tool.body}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
                        <span style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: COBALT, fontSize: "1.1rem", fontWeight: 700 }}>
                          {tool.price}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#28c840", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#28c840", display: "inline-block", animation: "pulse 2s infinite" }} />
                          LIVE NOW
                        </span>
                      </div>
                      {!isPlaceholder(tool.checkout) ? (
                        <a href={tool.checkout} target="_blank" rel="noopener noreferrer" style={{
                          background: COBALT, color: "#fff", textDecoration: "none",
                          fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
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
                          background: COBALT, color: "#fff", textDecoration: "none",
                          fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
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
                        fontFamily: "var(--eba-heading)", fontWeight: 800,
                        fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.02em",
                        color: NAVY, margin: "0 0 20px", lineHeight: 1.1,
                      }}>
                        {tool.title}
                      </h3>
                      <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "16px", lineHeight: 1.7, margin: "0 0 28px" }}>
                        {tool.body}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
                        <span style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: COBALT, fontSize: "1.1rem", fontWeight: 700 }}>
                          {tool.price}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#28c840", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#28c840", display: "inline-block", animation: "pulse 2s infinite" }} />
                          LIVE NOW
                        </span>
                      </div>
                      {!isPlaceholder(tool.checkout) ? (
                        <a href={tool.checkout} target="_blank" rel="noopener noreferrer" style={{
                          background: COBALT, color: "#fff", textDecoration: "none",
                          fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
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
                          background: COBALT, color: "#fff", textDecoration: "none",
                          fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
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
              fontFamily: "var(--eba-heading)", fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
              color: NAVY, margin: "0 0 16px",
            }}>
              More tools coming shortly.
            </h2>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "16px", lineHeight: 1.65, maxWidth: "520px", margin: "0 0 48px" }}>
              All included in the Academy subscription. Available standalone for non-members.
            </p>
          </RevealSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2px" }}>
            {comingSoon.map((tool, i) => (
              <RevealSection key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{
                  background: WHITE, borderTop: `3px solid rgba(${COBALT_RGB},0.35)`,
                  padding: "28px 28px", opacity: 0.8,
                }}>
                  <span style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                    fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                    color: `rgba(${NAVY_RGB},0.72)`, display: "block", marginBottom: "12px",
                  }}>
                    {tool.label}
                  </span>
                  <h4 style={{
                    fontFamily: "var(--eba-heading)", fontWeight: 700,
                    fontSize: "1.1rem", color: NAVY, margin: "0 0 10px",
                  }}>
                    {tool.title}
                  </h4>
                  <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "13px", lineHeight: 1.6, margin: "0 0 16px" }}>
                    {tool.body}
                  </p>
                  <span style={{
                    fontFamily: "var(--eba-heading)", fontStyle: "italic",
                    color: COBALT, fontSize: "13px",
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
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <RevealSection>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "64px", alignItems: "center" }}>
              <div>
                <SectionLabel>For Companies</SectionLabel>
                <h2 style={{
                  fontFamily: "var(--eba-heading)", fontWeight: 800,
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
                  color: ON_DARK, margin: "0 0 20px", lineHeight: 1.1,
                }}>
                  Your own branded compliance assistant. Deployed across your entire organisation.
                </h2>
                <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: "16px", lineHeight: 1.65, margin: "0 0 32px" }}>
                  The same AI technology that powers the EBA Compliance Co-Pilot — trained on your specific HSEQ documentation, branded with your company identity, deployed to every engineer in your business. Implementation: 2 weeks. Cost: a fraction of what a compliance consultancy charges. Capability: your entire safety knowledge base, available to every person on site, 24 hours a day.
                </p>
                {/* Enterprise pricing GATED until confirmed (ENTERPRISE_PRICING). */}
                <div style={{ display: "flex", gap: "32px", marginBottom: "36px", flexWrap: "wrap" }}>
                  {(ENTERPRISE_PRICING
                    ? [
                        { value: ENTERPRISE_PRICING.setup, label: "Setup" },
                        { value: ENTERPRISE_PRICING.monthly, label: "Retainer" },
                      ]
                    : [{ value: "Priced per deployment", label: "Enquire for a quote" }]
                  ).map(({ value, label }) => (
                    <div key={label}>
                      <p style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: COBALT_ON_DARK, fontSize: "1.2rem", fontWeight: 700, margin: "0 0 4px" }}>
                        {value}
                      </p>
                      <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <Link href="/contact" style={{
                  background: COBALT, color: "#fff", textDecoration: "none",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
                  padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
                }}>
                  Enquire about a deployment →
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Tools sections show the product, not stock photos. */}
                <ProductFrame
                  url="compliance.yourcompany.co.uk"
                  docTitle="Your Company Compliance Assistant"
                  docMeta="Your branding · trained on your HSEQ documents"
                  lines={["Answers in your company's voice", "Cited to your source procedures", "Deployed to every engineer on site"]}
                />
                <div style={{ background: `rgba(${ON_DARK_RGB},0.05)`, borderLeft: `3px solid ${COBALT_ON_DARK}`, padding: "28px 30px", borderRadius: "12px" }}>
                  <p style={{
                    fontFamily: "var(--eba-heading)", fontStyle: "italic",
                    color: ON_DARK, fontSize: "1rem", lineHeight: 1.75, margin: "0 0 20px",
                  }}>
                    "UK agencies charge £3,000–£25,000 to build custom AI chatbots. We are the accessible, managed end of that market — lower setup, plus a recurring retainer that covers hosting, updates and support. Cheaper than the agencies, and far cheaper than per-seat AI licences for a whole workforce."
                  </p>
                  <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                    Market context — UK agency pricing for custom chatbot builds
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
