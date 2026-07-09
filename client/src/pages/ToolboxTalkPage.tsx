/**
 * EBA Toolbox Talk Generator — the free, public, email-capture lead magnet.
 * No login, no Kajabi membership — just an email. Generates a bespoke,
 * EBA-branded UK toolbox talk (with a sign-off sheet) from any topic,
 * shows it on screen instantly, and emails a copy.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useIsMobile } from "@/hooks/useMobile";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track, getStoredUtm } from "@/lib/track";
import {
  NAVY, NAVY_RGB, CREAM, WHITE, COBALT, COBALT_RGB,
  DARK_GRADIENT, HERO_GLOW, SECTION_GLOW, IS_VIVID, ON_DARK, ON_DARK_RGB,
  NAV_BAR_BG, NAV_BORDER, NAV_LINK, NAV_LINK_ACTIVE, NAV_CTA_BG, NAV_CTA_TEXT,
  ENROL_HREF, ENROL_READY, ENROL_PENDING_LABEL,
} from "@/lib/constants";
import { Sparkles, Check, Download, AlertCircle } from "lucide-react";

interface ToolboxTalkSection {
  heading: string;
  type: "paragraph" | "bullets";
  text?: string;
  items?: string[];
}

interface ToolboxTalk {
  title: string;
  compliance: string;
  intro: string;
  sections: ToolboxTalkSection[];
  validationQuestions: string[];
}

interface GenerateSuccess {
  talk: ToolboxTalk;
  pdfBase64: string;
  emailed: boolean;
}

type GenerateResult =
  | { kind: "success"; data: GenerateSuccess }
  | { kind: "invalid-topic" }
  | { kind: "rate-limited"; message: string }
  | { kind: "not-configured" }
  | { kind: "error" };

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "toolbox-talk";
}

function base64ToBlobUrl(base64: string, mime: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

function ToolboxTalkNav({ scrolled }: { scrolled: boolean }) {
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
              paddingBottom: "2px",
            }}>
              {label}
            </Link>
          ))}
          <span>
            <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined}
              onClick={() => track("cta_join_cohort_nav")}
              style={{
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

function GeneratorForm({ onResult }: { onResult: (r: GenerateResult, input: { title?: string }) => void }) {
  const [topic, setTopic] = useState("");
  const [trade, setTrade] = useState("");
  const [site, setSite] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const isMobile = useIsMobile();

  const inputStyle: React.CSSProperties = {
    width: "100%", background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.18)`,
    padding: "13px 16px", fontFamily: "'Poppins', sans-serif", fontSize: "15px",
    color: NAVY, outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
    fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase",
    color: `rgba(${NAVY_RGB},0.65)`, marginBottom: "6px",
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !email.trim()) return;
    setFormError("");
    setLoading(true);
    track("toolbox_talk_generate_submit");

    try {
      const res = await fetch("/api/generate-toolbox-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, trade, site, email, utm: getStoredUtm() }),
      });

      if (res.status === 501) {
        onResult({ kind: "not-configured" }, {});
      } else if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        onResult({ kind: "rate-limited", message: body.message || "Please try again later." }, {});
      } else if (res.status === 400) {
        setFormError("Please enter a topic and a valid email address.");
      } else if (!res.ok) {
        onResult({ kind: "error" }, {});
      } else {
        const body = await res.json();
        if (body.invalidTopic) {
          onResult({ kind: "invalid-topic" }, {});
        } else {
          track("toolbox_talk_generated");
          onResult({ kind: "success", data: body as GenerateSuccess }, { title: body.talk?.title });
        }
      }
    } catch {
      onResult({ kind: "error" }, {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "16px" }}>
      <div>
        <label style={labelStyle} htmlFor="tt-topic">Topic *</label>
        <input
          id="tt-topic" required value={topic} onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. working near overhead power lines"
          style={inputStyle}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={labelStyle} htmlFor="tt-trade">Trade (optional)</label>
          <input id="tt-trade" value={trade} onChange={(e) => setTrade(e.target.value)} placeholder="e.g. electrician" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="tt-site">Site type (optional)</label>
          <input id="tt-site" value={site} onChange={(e) => setSite(e.target.value)} placeholder="e.g. commercial fit-out" style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle} htmlFor="tt-email">Your work email *</label>
        <input
          id="tt-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.co.uk" style={inputStyle}
        />
      </div>
      {formError && <p style={{ color: "#C92B42", fontSize: "13px", margin: 0 }} role="alert">{formError}</p>}
      <button
        type="submit" disabled={loading}
        style={{
          background: COBALT, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
          padding: "15px 28px", letterSpacing: "0.02em", opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Generating…" : "Generate my toolbox talk →"}
      </button>
      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: `rgba(${NAVY_RGB},0.62)`, margin: 0 }}>
        Free. No card. We'll email you a copy · UK GDPR compliant.
      </p>
    </form>
  );
}

function ResultPanel({ result, requestedTitle }: { result: GenerateResult; requestedTitle?: string }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (result.kind === "success") {
      const url = base64ToBlobUrl(result.data.pdfBase64, "application/pdf");
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [result]);

  const panelBase: React.CSSProperties = {
    borderRadius: "14px", padding: "22px 26px", marginTop: "20px",
    fontFamily: "'Poppins', sans-serif",
  };

  if (result.kind === "not-configured") {
    return (
      <div style={{ ...panelBase, background: `rgba(${COBALT_RGB},0.08)`, border: `1px solid rgba(${COBALT_RGB},0.25)` }}>
        <p style={{ fontWeight: 700, color: COBALT, margin: "0 0 4px" }}>Opening shortly.</p>
        <p style={{ fontSize: "14px", color: `rgba(${NAVY_RGB},0.7)`, margin: 0 }}>
          The generator is finishing setup. Please check back soon.
        </p>
      </div>
    );
  }

  if (result.kind === "rate-limited") {
    return (
      <div style={{ ...panelBase, background: "rgba(201,43,66,0.06)", border: "1px solid rgba(201,43,66,0.25)" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <AlertCircle size={18} color="#C92B42" style={{ flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "14px", color: NAVY, margin: 0 }}>{result.message}</p>
        </div>
      </div>
    );
  }

  if (result.kind === "invalid-topic") {
    return (
      <div style={{ ...panelBase, background: "rgba(201,43,66,0.06)", border: "1px solid rgba(201,43,66,0.25)" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <AlertCircle size={18} color="#C92B42" style={{ flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "14px", color: NAVY, margin: 0 }}>
            That doesn't look like a workplace health &amp; safety topic. Try something like
            "working at height", "manual handling" or "silica dust cutting kerbs".
          </p>
        </div>
      </div>
    );
  }

  if (result.kind === "error") {
    return (
      <div style={{ ...panelBase, background: "rgba(201,43,66,0.06)", border: "1px solid rgba(201,43,66,0.25)" }}>
        <p style={{ fontSize: "14px", color: NAVY, margin: 0 }}>
          Something went wrong generating {requestedTitle ? `"${requestedTitle}"` : "your toolbox talk"}. Please try again.
        </p>
      </div>
    );
  }

  const { talk, emailed } = result.data;

  return (
    <div style={{ ...panelBase, background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.1)`, boxShadow: "0 30px 60px -32px rgba(0,0,0,0.28)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: COBALT }} />
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY }}>Toolbox Talk ready</span>
      </div>
      <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.5rem", color: NAVY, margin: "6px 0 8px" }}>{talk.title}</h3>
      <div style={{ display: "inline-block", border: "1px solid #C92B42", color: "#C92B42", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px", marginBottom: "14px" }}>
        {talk.compliance}
      </div>
      <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: `rgba(${NAVY_RGB},0.82)` }}>{talk.intro}</p>

      {talk.sections.map((section, i) => (
        <div key={i} style={{ marginTop: "14px" }}>
          {section.heading && (
            <h4 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.02rem", color: NAVY, margin: "0 0 6px" }}>{section.heading}</h4>
          )}
          {section.type === "bullets" && section.items ? (
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              {section.items.map((item, j) => (
                <li key={j} style={{ fontSize: "14px", lineHeight: 1.55, color: `rgba(${NAVY_RGB},0.8)`, marginBottom: "5px" }}>{item}</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: `rgba(${NAVY_RGB},0.8)`, margin: 0 }}>{section.text}</p>
          )}
        </div>
      ))}

      <div style={{ marginTop: "16px", background: "#FAFAF8", border: `1px solid rgba(${NAVY_RGB},0.08)`, borderRadius: "8px", padding: "14px 18px" }}>
        <h4 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1rem", color: NAVY, margin: "0 0 8px" }}>Validation &mdash; check understanding</h4>
        <ol style={{ margin: 0, paddingLeft: "18px" }}>
          {talk.validationQuestions.map((q, i) => (
            <li key={i} style={{ fontSize: "13.5px", lineHeight: 1.55, color: `rgba(${NAVY_RGB},0.8)`, marginBottom: "5px" }}>{q}</li>
          ))}
        </ol>
      </div>

      <p style={{ fontSize: "12px", color: `rgba(${NAVY_RGB},0.55)`, marginTop: "14px" }}>
        The PDF also includes a printable attendance sign-off sheet (name / company / signature / date).
        This talk complements &mdash; it does not replace &mdash; formal H&amp;S training. AI-generated; review before delivering on site.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "16px", alignItems: "center" }}>
        {pdfUrl && (
          <a
            href={pdfUrl}
            download={`${slugify(talk.title)}.pdf`}
            onClick={() => track("toolbox_talk_pdf_download")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: COBALT, color: "#fff", textDecoration: "none",
              fontWeight: 700, fontSize: "14px", padding: "12px 22px", borderRadius: "8px",
            }}
          >
            <Download size={16} /> Download PDF
          </a>
        )}
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: `rgba(${NAVY_RGB},0.65)` }}>
          <Check size={15} color={emailed ? "#2ECC71" : `rgba(${NAVY_RGB},0.4)`} />
          {emailed ? "A copy is on its way to your inbox." : "Couldn't email a copy — use the download button above."}
        </span>
      </div>
    </div>
  );
}

export default function ToolboxTalkPage() {
  const [scrolled, setScrolled] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [requestedTitle, setRequestedTitle] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.toolboxTalk} />
      <MobileNav transparent={true} />
      <ToolboxTalkNav scrolled={scrolled} />

      <section style={{ paddingTop: isMobile ? "104px" : "150px", paddingBottom: isMobile ? "56px" : "88px", background: DARK_GRADIENT, position: "relative", overflow: "hidden" }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#3AA0FF", marginBottom: "16px" }}>
            <Sparkles size={15} strokeWidth={2} /> Free tool &middot; No purchase
          </div>
          <h1 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2.1rem" : "clamp(2.4rem, 4.6vw, 3.6rem)", lineHeight: 1.06, letterSpacing: "-0.02em", color: ON_DARK, margin: "0 0 16px", maxWidth: "760px" }}>
            The free Toolbox Talk Generator.
          </h1>
          <p style={{ fontSize: isMobile ? "15px" : "17px", lineHeight: 1.65, color: `rgba(${ON_DARK_RGB},0.75)`, maxWidth: "560px", margin: 0 }}>
            Type any site hazard or task. Get a genuinely useful, EBA-branded UK toolbox talk with a
            sign-off sheet in about a minute &mdash; on screen instantly, and a copy in your inbox.
          </p>
        </div>
      </section>

      <section style={{ background: CREAM, backgroundImage: SECTION_GLOW, padding: isMobile ? "40px 20px 64px" : "56px 40px 96px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.1)`, borderRadius: "16px", padding: isMobile ? "22px" : "32px", boxShadow: "0 30px 60px -36px rgba(0,0,0,0.22)" }}>
            <GeneratorForm
              onResult={(r, input) => {
                setResult(r);
                setRequestedTitle(input.title);
              }}
            />
          </div>

          {result && <ResultPanel result={result} requestedTitle={requestedTitle} />}
        </div>
      </section>

      <section style={{ background: NAVY, padding: isMobile ? "48px 20px" : "64px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: isMobile ? "left" : "center" }}>
          <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: isMobile ? "1.6rem" : "2rem", color: "#fff", margin: "0 0 12px" }}>
            Toolbox Talks are the free one.
          </h2>
          <p style={{ fontSize: "15px", lineHeight: 1.65, color: "rgba(255,255,255,0.72)", margin: "0 0 24px" }}>
            EBA members generate full RAMS, COSHH and O&amp;M manuals with the paid AI suite &mdash; and get
            the operating system for running a profitable engineering business. Join the founding cohort.
          </p>
          <Link
            href="/ai-tools"
            onClick={() => track("toolbox_talk_cta_ai_tools")}
            style={{ display: "inline-block", background: "#FF5B6E", color: "#0A0A0A", textDecoration: "none", fontWeight: 700, fontSize: "15px", padding: "14px 30px", borderRadius: "10px" }}
          >
            See the full AI tool suite →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
