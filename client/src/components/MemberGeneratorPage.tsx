/**
 * MemberGeneratorPage — shared page shell for the SUBSCRIBER-ONLY generators
 * (RAMS, COSHH). The free Toolbox Talk keeps its own bespoke page.
 *
 * Access model (matches api/lib/memberToolHandler.ts):
 *  - ?access=<token> from the subscriber's welcome email. No login, no password.
 *  - No token → an honest "subscriber tool" explainer with the route to buy.
 *    There is deliberately NO degraded free mode on these pages.
 *  - 401 → link invalid/revoked (cancelled subscription or refreshed token).
 *  - 403 → valid link, different product (e.g. a COSHH-only link on RAMS).
 *
 * Every result screen repeats the competent-person review requirement — the
 * PDF carries it too. That message is non-negotiable and must not be softened.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Seo, type SeoMeta } from "@/components/Seo";
import { useIsMobile } from "@/hooks/useMobile";
import { track } from "@/lib/track";
import {
  NAVY, NAVY_RGB, CREAM, CREAM_RGB, WHITE, OAT,
  DARK_GRADIENT, ON_DARK, HERO_GLOW, IS_VIVID,
  COBALT, COBALT_RGB, COBALT_ON_DARK,
} from "@/lib/constants";

export interface GeneratorField {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

export interface GeneratorConfig {
  /** "rams" | "coshh" — used in analytics events. */
  toolKey: string;
  seo: SeoMeta;
  kicker: string;
  heading: string;
  intro: string;
  endpoint: string;
  /** The main input — sent under this body field name. */
  subjectField: GeneratorField;
  extraFields: GeneratorField[];
  /** Shown under the form, e.g. what the tool does / doesn't do. */
  honestyNote: string;
  buttonLabel: string;
  resultNoun: string;
}

type ResultState =
  | { kind: "idle" }
  | { kind: "done"; title: string; pdfBase64: string; emailed: boolean }
  | { kind: "invalid-topic" }
  | { kind: "invalid-access" }
  | { kind: "wrong-product" }
  | { kind: "rate-limited"; message: string }
  | { kind: "error" };

function base64ToBlobUrl(base64: string, mime: string): string {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return URL.createObjectURL(new Blob([arr], { type: mime }));
}

const inputStyle: React.CSSProperties = {
  padding: "13px 16px",
  border: `1px solid rgba(${NAVY_RGB},0.2)`,
  background: WHITE,
  fontFamily: "'Poppins', sans-serif",
  fontSize: "14px",
  color: NAVY,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

export function MemberGeneratorPage({ config }: { config: GeneratorConfig }) {
  const isMobile = useIsMobile();

  // ?access=<token> from the subscriber welcome email.
  const [token, setToken] = useState<string | undefined>(undefined);
  const [tokenChecked, setTokenChecked] = useState(false);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("access") || undefined);
    } catch {
      /* no query string — public visitor */
    }
    setTokenChecked(true);
  }, []);

  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState>({ kind: "idle" });
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (result.kind === "done") {
      const url = base64ToBlobUrl(result.pdfBase64, "application/pdf");
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPdfUrl(null);
  }, [result]);

  const subject = (values[config.subjectField.key] ?? "").trim();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || loading || !token) return;
    setLoading(true);
    setResult({ kind: "idle" });
    try {
      const res = await fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [config.subjectField.key]: subject,
          trade: (values.trade ?? "").trim(),
          site: (values.site ?? "").trim(),
          accessToken: token,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setResult({ kind: "invalid-access" });
      } else if (res.status === 403) {
        setResult({ kind: "wrong-product" });
      } else if (res.status === 429) {
        setResult({ kind: "rate-limited", message: data.message ?? "Too many requests today." });
      } else if (res.ok && data.invalidTopic) {
        setResult({ kind: "invalid-topic" });
      } else if (res.ok && data.doc && data.pdfBase64) {
        track(`${config.toolKey}_generated`);
        setResult({ kind: "done", title: data.doc.title, pdfBase64: data.pdfBase64, emailed: Boolean(data.emailed) });
      } else {
        setResult({ kind: "error" });
      }
    } catch {
      setResult({ kind: "error" });
    } finally {
      setLoading(false);
    }
  };

  const panel: React.CSSProperties = {
    background: WHITE,
    border: `1px solid rgba(${NAVY_RGB},0.1)`,
    borderRadius: "14px",
    padding: isMobile ? "24px 20px" : "32px 34px",
    boxShadow: "0 24px 50px -30px rgba(0,0,0,0.25)",
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...config.seo} noIndex />
      <MobileNav transparent={false} />

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "96px" : "130px", paddingBottom: isMobile ? "44px" : "64px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: "28px" }}>
            <EBALogo height={40} light />
          </Link>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: COBALT_ON_DARK, margin: "0 0 14px" }}>
            {config.kicker}
          </p>
          <h1 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: isMobile ? "1.9rem" : "2.7rem", letterSpacing: "-0.025em", color: ON_DARK, margin: "0 0 14px", lineHeight: 1.08, textWrap: "balance" }}>
            {config.heading}
          </h1>
          <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: isMobile ? "15px" : "16.5px", lineHeight: 1.7, margin: 0, maxWidth: "58ch" }}>
            {config.intro}
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section style={{ padding: isMobile ? "40px 20px 64px" : "56px 40px 90px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {!tokenChecked ? null : !token ? (
            /* ── No access link: honest subscriber gate ── */
            <div style={panel}>
              <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.35rem", margin: "0 0 12px" }}>
                This is a subscriber tool.
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", lineHeight: 1.7, margin: "0 0 10px", maxWidth: "62ch" }}>
                Subscribers get a personal access link by email — no login, no password. Open that
                link and this page unlocks; bookmark it and it works every time.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", lineHeight: 1.7, margin: "0 0 22px", maxWidth: "62ch" }}>
                Not a subscriber yet? Pricing and what's included are on the AI Tools page. Lost
                your link? Contact us with the email you subscribed with and we'll re-send it.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/ai-tools" style={{ background: COBALT, color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: "14px", padding: "12px 26px", borderRadius: "8px", display: "inline-block" }}>
                  See the AI tools →
                </Link>
                <Link href="/contact" style={{ background: "transparent", color: NAVY, textDecoration: "none", fontWeight: 600, fontSize: "14px", padding: "12px 26px", borderRadius: "8px", border: `1px solid rgba(${NAVY_RGB},0.3)`, display: "inline-block" }}>
                  Contact us
                </Link>
              </div>
            </div>
          ) : result.kind === "done" ? (
            /* ── Result ── */
            <div style={panel}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: COBALT, margin: "0 0 10px" }}>
                {config.resultNoun} generated
              </p>
              <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.5rem", margin: "0 0 14px" }}>
                {result.title}
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", lineHeight: 1.7, margin: "0 0 6px" }}>
                {result.emailed ? "A copy is on its way to your inbox." : "Download it below."}
              </p>
              <div style={{ background: `rgba(${COBALT_RGB},0.08)`, border: `1px solid rgba(${COBALT_RGB},0.3)`, borderRadius: "10px", padding: "14px 18px", margin: "16px 0 22px" }}>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: NAVY }}>
                  <strong>Before it goes near site:</strong> this is a draft. It must be reviewed,
                  adapted to the actual task and conditions, and signed off by a competent person.
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {pdfUrl && (
                  <a href={pdfUrl} download style={{ background: COBALT, color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: "14px", padding: "12px 26px", borderRadius: "8px", display: "inline-block" }}
                    onClick={() => track(`${config.toolKey}_pdf_download`)}
                  >
                    Download PDF →
                  </a>
                )}
                <button onClick={() => setResult({ kind: "idle" })} style={{ background: "transparent", color: NAVY, fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", padding: "12px 26px", borderRadius: "8px", border: `1px solid rgba(${NAVY_RGB},0.3)`, cursor: "pointer" }}>
                  Generate another
                </button>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <div style={panel}>
              {result.kind === "invalid-access" && (
                <ErrorNote text="That access link isn't valid any more — it may have been refreshed by a newer purchase, or the subscription has ended. Check your latest email from us, or contact us and we'll sort it." />
              )}
              {result.kind === "wrong-product" && (
                <ErrorNote text="Your access link is valid, but it belongs to a different tool subscription. Check the links in your welcome email — or if you'd like to add this tool, the bundle covers both." />
              )}
              {result.kind === "rate-limited" && <ErrorNote text={result.message} />}
              {result.kind === "invalid-topic" && (
                <ErrorNote text={`That doesn't look like something this generator can help with. Describe the ${config.subjectField.label.toLowerCase()} as you'd describe it to a colleague.`} />
              )}
              {result.kind === "error" && (
                <ErrorNote text="Something went wrong generating that. Try again — if it keeps failing, contact us." />
              )}

              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <FieldLabel text={config.subjectField.label} required />
                  <input
                    style={inputStyle}
                    placeholder={config.subjectField.placeholder}
                    value={values[config.subjectField.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [config.subjectField.key]: e.target.value }))}
                    required
                    maxLength={200}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
                  {config.extraFields.map((f) => (
                    <div key={f.key}>
                      <FieldLabel text={f.label} />
                      <input
                        style={inputStyle}
                        placeholder={f.placeholder}
                        value={values[f.key] ?? ""}
                        onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                        maxLength={80}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading || !subject}
                  style={{
                    background: COBALT, color: "#fff", border: "none", borderRadius: "8px",
                    fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px",
                    padding: "14px 28px", cursor: loading ? "wait" : "pointer",
                    opacity: loading || !subject ? 0.7 : 1, alignSelf: "flex-start",
                  }}
                >
                  {loading ? "Generating — this takes about a minute…" : config.buttonLabel}
                </button>
              </form>

              <p style={{ color: `rgba(${NAVY_RGB},0.55)`, fontSize: "13px", lineHeight: 1.6, margin: "20px 0 0", maxWidth: "66ch" }}>
                {config.honestyNote}
              </p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FieldLabel({ text, required = false }: { text: string; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: `rgba(${NAVY_RGB},0.6)`, marginBottom: "6px" }}>
      {text}
      {required && <span style={{ color: COBALT }}> *</span>}
    </label>
  );
}

function ErrorNote({ text }: { text: string }) {
  return (
    <div style={{ background: OAT, borderLeft: `3px solid #A6620B`, borderRadius: "6px", padding: "12px 16px", marginBottom: "18px" }}>
      <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: NAVY }}>{text}</p>
    </div>
  );
}
