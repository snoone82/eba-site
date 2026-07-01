/**
 * AssistantWidget — a floating "virtual assistant" launcher + panel, in the
 * spirit of the Citation / iHasco chat bubbles. Honest by design: it is a guided
 * helper, not a fake live agent. It points visitors to the right page via quick
 * chips and can take a message (captured to FORM_ENDPOINT, with a fail-safe that
 * routes to the contact form until the endpoint is wired). Theme-aware.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import {
  NAVY, WHITE, RUST, RUST_RGB, NAVY_RGB, CREAM, CTA_PRIMARY_BG, CTA_DARK_BG,
  ON_DARK, CREAM_RGB, IS_LIGHT, FORM_ENDPOINT, isPlaceholder,
} from "@/lib/constants";
import { track, getStoredUtm } from "@/lib/track";
import { MessageSquareText, X, Sparkles, Send, Check } from "lucide-react";

const CHIPS: { label: string; href: string }[] = [
  { label: "The Academy", href: "/academy" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "Free Toolbox Talk tool", href: "/ai-tools#tools" },
  { label: "Mentorship with Mark", href: "/mentorship" },
];

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formReady = !isPlaceholder(FORM_ENDPOINT);

  const onDark = IS_LIGHT ? "#fff" : ON_DARK;

  const toggle = () => {
    setOpen((o) => {
      if (!o) track("assistant_open");
      return !o;
    });
  };

  const go = (href: string) => {
    track("assistant_chip", { href });
    setOpen(false);
    if (href.startsWith("/")) navigate(href.split("#")[0]);
    if (href.includes("#")) {
      const id = href.split("#")[1];
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 350);
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    if (!formReady) { navigate("/contact"); setOpen(false); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, source: "assistant", ...getStoredUtm() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("assistant_message_sent");
      setSent(true);
    } catch {
      setError("Couldn't send just now — please try the contact form.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", background: WHITE,
    border: `1px solid rgba(${NAVY_RGB},0.16)`, borderRadius: "10px",
    padding: "11px 13px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
    color: NAVY, outline: "none",
  };

  return (
    <>
      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="EBA assistant"
          className="eba-assistant-panel"
          style={{
            position: "fixed", zIndex: 120, right: "20px", bottom: "92px",
            width: "min(360px, calc(100vw - 40px))",
            background: WHITE, borderRadius: "20px", overflow: "hidden",
            border: `1px solid rgba(${NAVY_RGB},0.10)`,
            boxShadow: "0 40px 90px -30px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header */}
          <div style={{ background: CTA_DARK_BG, padding: "18px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={20} color="#fff" />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "15px", color: onDark }}>EBA Assistant</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: IS_LIGHT ? "rgba(255,255,255,0.85)" : `rgba(${CREAM_RGB},0.8)` }}>Here to point you in the right direction</div>
            </div>
            <button onClick={toggle} aria-label="Close assistant" style={{ background: "transparent", border: "none", cursor: "pointer", color: onDark, display: "inline-flex", padding: "4px" }}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "18px 18px 20px", maxHeight: "60vh", overflowY: "auto" }}>
            {/* Greeting bubble */}
            <div style={{ background: CREAM, borderRadius: "4px 14px 14px 14px", padding: "13px 15px", marginBottom: "16px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: 1.55, color: NAVY, margin: 0 }}>
                Hi 👋 I'm the EBA assistant. Tell me what you're after, or pick one below — I can also take a message for the team.
              </p>
            </div>

            {/* Quick chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              {CHIPS.map((c) => (
                <button key={c.label} onClick={() => go(c.href)} style={{
                  background: `rgba(${RUST_RGB},0.08)`, color: RUST, border: `1px solid rgba(${RUST_RGB},0.2)`,
                  borderRadius: "20px", padding: "8px 14px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12.5px",
                }}>{c.label}</button>
              ))}
            </div>

            {/* Message capture */}
            {sent ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: `rgba(${RUST_RGB},0.08)`, border: `1px solid rgba(${RUST_RGB},0.22)`, borderRadius: "12px", padding: "14px 16px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: CTA_PRIMARY_BG, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={15} strokeWidth={3} /></span>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: NAVY, margin: 0, lineHeight: 1.45 }}>Got it — we'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={send} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: `rgba(${NAVY_RGB},0.55)` }}>
                  Leave a message
                </label>
                <input type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <textarea required rows={3} placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
                {error && <p style={{ color: RUST, fontSize: "12.5px", margin: 0 }} role="alert">{error}</p>}
                <button type="submit" disabled={loading} style={{
                  background: CTA_PRIMARY_BG, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px", padding: "12px 18px",
                  borderRadius: "10px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? "Sending…" : <>Send <Send size={15} /></>}
                </button>
                {!formReady && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: `rgba(${NAVY_RGB},0.5)`, margin: "2px 0 0", lineHeight: 1.4 }}>
                    We'll take you to the contact form to finish — messaging goes live soon.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={toggle}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        style={{
          position: "fixed", zIndex: 120, right: "20px", bottom: "24px",
          width: "58px", height: "58px", borderRadius: "50%", border: "none", cursor: "pointer",
          background: CTA_DARK_BG, color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 20px 44px -16px rgba(0,0,0,0.55)",
        }}
      >
        {open ? <X size={24} /> : <MessageSquareText size={24} />}
      </button>
    </>
  );
}
