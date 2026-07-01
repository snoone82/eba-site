/**
 * ToolboxLeadMagnet — top-of-funnel email-capture block for the free Toolbox
 * Talk Generator. Honest + fail-safe: until VITE_FORM_ENDPOINT is set it shows a
 * "coming soon" state rather than faking a signup. Theme-aware.
 */
import { useState } from "react";
import {
  NAVY, CREAM, WHITE, RUST, RUST_RGB, NAVY_RGB, CTA_PRIMARY_BG,
  SECTION_GLOW, FORM_ENDPOINT, isPlaceholder,
} from "@/lib/constants";
import { useIsMobile } from "@/hooks/useMobile";
import { track, getStoredUtm } from "@/lib/track";
import { Sparkles, Check } from "lucide-react";

function CaptureForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formReady = !isPlaceholder(FORM_ENDPOINT);

  const sub = `rgba(${NAVY_RGB},0.6)`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "lead-magnet:toolbox-talk-generator", ...getStoredUtm() }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      track("lead_toolbox_generator_submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again, or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  // Fail-safe: no endpoint yet — honest "coming soon", never a fake success.
  if (!formReady) {
    return (
      <div style={{ background: `rgba(${RUST_RGB},0.08)`, border: `1px solid rgba(${RUST_RGB},0.25)`, borderRadius: "12px", padding: "18px 20px" }}>
        <p style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, color: RUST, fontSize: "1rem", margin: "0 0 4px" }}>Opening shortly.</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: sub, lineHeight: 1.55, margin: 0 }}>
          The free Toolbox Talk Generator launches with the founding cohort. Registration opens here soon.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ background: `rgba(${RUST_RGB},0.08)`, border: `1px solid rgba(${RUST_RGB},0.25)`, borderRadius: "12px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: CTA_PRIMARY_BG, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={18} strokeWidth={3} /></span>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14.5px", color: NAVY, margin: 0, lineHeight: 1.5 }}>
          Check your inbox — your access link is on its way to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: "440px" }}>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="email" required placeholder="Your work email" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, minWidth: "200px", padding: "13px 16px", border: `1px solid rgba(${NAVY_RGB},0.2)`, background: WHITE, fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: NAVY, outline: "none" }}
        />
        <button type="submit" disabled={loading} style={{ background: CTA_PRIMARY_BG, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px", padding: "13px 24px", letterSpacing: "0.03em", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" }}>
          {loading ? "…" : "Get instant access →"}
        </button>
      </div>
      {error && <p style={{ color: RUST, fontSize: "13px", margin: "10px 0 0" }} role="alert">{error}</p>}
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: `rgba(${NAVY_RGB},0.45)`, margin: "10px 0 0" }}>
        Free. No card. Unsubscribe any time · UK GDPR compliant.
      </p>
    </form>
  );
}

export function ToolboxLeadMagnet() {
  const isMobile = useIsMobile();
  const border = `rgba(${NAVY_RGB},0.10)`;
  const sub = `rgba(${NAVY_RGB},0.62)`;

  return (
    <section style={{ backgroundColor: CREAM, backgroundImage: SECTION_GLOW, padding: isMobile ? "64px 20px" : "96px 40px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr", gap: isMobile ? "40px" : "64px", alignItems: "center" }}>
        {/* Copy + capture */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: RUST, marginBottom: "16px" }}>
            <Sparkles size={15} strokeWidth={2} /> Free tool · No purchase
          </div>
          <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: isMobile ? "2rem" : "clamp(2.1rem, 4vw, 3rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: NAVY, margin: "0 0 18px" }}>
            The free Toolbox Talk Generator.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? "15px" : "17px", lineHeight: 1.65, color: sub, margin: "0 0 28px", maxWidth: "480px" }}>
            Pick a task, get a site-ready toolbox talk in about a minute — with a sign-off sheet included. Free to use, no card required. Just tell us where to send it.
          </p>
          <CaptureForm />
        </div>

        {/* Preview */}
        <div style={{ background: WHITE, border: `1px solid ${border}`, borderRadius: "18px", overflow: "hidden", boxShadow: "0 30px 60px -32px rgba(0,0,0,0.28)" }}>
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: RUST }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: NAVY }}>Toolbox Talk</span>
          </div>
          <div style={{ padding: "24px 26px" }}>
            <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.2rem", color: NAVY, marginBottom: "4px" }}>Working at Height</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: sub, marginBottom: "18px" }}>Site: __________ · Date: __________ · Ref: TBT-014</div>
            {["Key hazards — falls, dropped objects, fragile surfaces", "Controls — inspected access equipment, edge protection, exclusion zones", "PPE — harness + lanyard where required, hard hat, hi-vis", "Emergency — rescue plan in place before work starts"].map((line, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "4px", background: `rgba(${RUST_RGB},0.14)`, color: RUST, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px", fontWeight: 800, marginTop: "2px" }}>✓</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: `rgba(${NAVY_RGB},0.72)`, lineHeight: 1.45 }}>{line}</span>
              </div>
            ))}
            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `1px dashed ${border}`, display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: `rgba(${NAVY_RGB},0.5)` }}>
              <span>Attendee sign-off ✎</span><span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
