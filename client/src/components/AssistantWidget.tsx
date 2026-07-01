/**
 * AssistantWidget — a floating chat assistant that actually answers questions
 * about EBA. It responds from a curated EBA knowledge base (accurate, on-site
 * facts) so it works with no backend; if VITE_ASSISTANT_ENDPOINT is configured
 * it will call that first (e.g. a real Compliance Co-Pilot / LLM backend) and
 * fall back to the knowledge base on any error. Auto-opens once on the homepage.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  NAVY, WHITE, RUST, RUST_RGB, NAVY_RGB, CREAM, CTA_PRIMARY_BG, CTA_DARK_BG,
  ON_DARK, CREAM_RGB, IS_LIGHT,
} from "@/lib/constants";
import { track } from "@/lib/track";
import { MessageSquareText, X, Sparkles, Send } from "lucide-react";

// Defaults to the bundled /api/assistant Edge function (live once ANTHROPIC_API_KEY
// is set in Vercel). Override with VITE_ASSISTANT_ENDPOINT. Any failure — missing
// key (501), not deployed (404/HTML), network — falls back to the local KB below.
const ASSISTANT_ENDPOINT: string =
  (import.meta as any).env?.VITE_ASSISTANT_ENDPOINT || "/api/assistant";

const GREETING =
  "Hi 👋 I'm the EBA assistant. Ask me about the Academy, the AI tools, the free Toolbox Talk Generator, documents, mentorship, pricing or enrolment.";

const SUGGESTIONS = [
  "What are the AI tools?",
  "How much does it cost?",
  "When does enrolment open?",
  "Who is it for?",
];

// ── Curated EBA knowledge base — accurate answers drawn from the site ──────────
const KB: { test: RegExp; answer: string }[] = [
  { test: /\b(price|pricing|cost|how much|fee|fees|expensive|afford)\b/i,
    answer: "Academy founding-cohort pricing is announced soon — founding members lock in the lowest price it'll ever be, for life. The four AI tools are priced separately (pay-per-use or subscription): O&M Compiler from £99/manual, RAMS from £49/mo, Compliance Co-Pilot from £99/mo, COSHH pricing soon. Full detail's on the Pricing page." },
  { test: /\b(free|toolbox|talk generator|no cost|trial)\b/i,
    answer: "The Toolbox Talk Generator is free — pick a task and get a site-ready toolbox talk with a sign-off sheet in about a minute. Just drop your email on the AI Tools page to use it." },
  { test: /\b(o&m|om manual|manual compiler)\b/i,
    answer: "The O&M Manual Compiler turns your project data into a fully CDM-structured O&M manual in minutes instead of days. It's pay-per-use, from £99 per manual. You review the output before it goes out." },
  { test: /\b(rams|method statement|risk assessment)\b/i,
    answer: "The RAMS Generator drafts method statements and risk assessments that are site-ready in minutes. It's a subscription, from £49/mo." },
  { test: /\b(coshh|substance|hazardous)\b/i,
    answer: "The COSHH Generator drafts substance assessments ready for you to review. It's pay-per-use — pricing announced soon." },
  { test: /\b(co-?pilot|chatbot|assistant|hseq|knowledge)\b/i,
    answer: "The Compliance Co-Pilot is trained on your company's HSEQ documentation — your team asks it questions and it answers instantly, in your firm's voice. Subscription from £99/mo, or a managed white-label deployment for your whole business." },
  { test: /\b(ai|tools|software|automat)\b/i,
    answer: "We've built four AI tools for M&E: the O&M Manual Compiler, RAMS Generator, Compliance Co-Pilot and COSHH Generator. They're trained on real M&E practice and you review every output. They're pay-per-use or subscription — not included with Academy membership. The AI Tools page has live demos." },
  { test: /\b(enrol|enroll|start|begin|when|join|sign ?up|cohort|waitlist|available)\b/i,
    answer: "Enrolment opens soon — we're forming the founding cohort (30 places only), who lock in the lowest price for life. Leave your email and we'll tell you the moment it opens. Want me to take your details?" },
  { test: /\b(academy|course|curriculum|module|lesson|learn|programme|program)\b/i,
    answer: "The Academy is the full operating system for running an M&E business — 101 lessons across 10 modules covering pricing & margin, cash flow, contracts, compliance, winning work and growth. Built from a real M&E group, not theory. CPD accreditation is in progress." },
  { test: /\b(document|library|template|form|register|policy|packs?)\b/i,
    answer: "The Document Library is 380 operator-grade M&E documents — RAMS, O&M, CDM and compliance templates in Word + PDF, all developed in a real contracting business. Academy members get the full library included." },
  { test: /\b(mentor|mentorship|1:?1|one to one|mark|poulton|coaching)\b/i,
    answer: "Mentorship is direct access to Mark Poulton (CEO, KEYIS Group) — group sessions or 1:1, application-only and deliberately limited so the time's real. Pricing on application. The Mentorship page lets you register interest." },
  { test: /\b(who|suitable|right for|beginner|sole trader|small|electrician|plumb|hvac)\b/i,
    answer: "It's built for M&E engineering contractors — sole traders through to growing multi-trade firms — who are technically excellent but want the commercial systems to scale profitably. No prior business knowledge needed." },
  { test: /\b(refund|money ?back|guarantee|cancel)\b/i,
    answer: "There's a 14-day, no-questions-asked refund on Academy memberships. If it's not right for you, just get in touch within 14 days." },
  { test: /\b(keyis|about|behind|real|experience|who are you|legit|trust)\b/i,
    answer: "EBA is built from KEYIS Group, a real M&E engineering group — ISO-certified, RoSPA award-winning, ConstructionLine Gold. Everything here comes from running an actual contracting business, 25 years of it." },
  { test: /\b(contact|human|person|speak|call|phone|email|reach|talk to)\b/i,
    answer: "Happy to connect you with the team — the contact form is the fastest route and we reply within two working days. Or tell me your question here and I'll do my best." },
  { test: /\b(hi|hello|hey|help|hiya|morning|afternoon)\b/i,
    answer: "Hi! I can help with the Academy, the four AI tools, the free Toolbox Talk Generator, documents, mentorship, pricing or enrolment. What would you like to know?" },
  { test: /\b(thank|thanks|cheers|great|perfect|brilliant)\b/i,
    answer: "Any time! Anything else I can help with — pricing, the tools, or getting on the founding-cohort list?" },
];

const FALLBACK =
  "Good question. I can help with the Academy, the AI tools, the free Toolbox Talk Generator, documents, mentorship, pricing and enrolment. For anything else the quickest route is our contact form — want the link?";

function kbAnswer(q: string): string {
  const hit = KB.find((k) => k.test.test(q));
  return hit ? hit.answer : FALLBACK;
}

type Msg = { role: "user" | "bot"; text: string };

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [location, navigate] = useLocation();
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const openedOnce = useRef(false);

  const onDark = IS_LIGHT ? "#fff" : ON_DARK;

  // Auto-open once on the homepage (per browser session).
  useEffect(() => {
    if (location !== "/") return;
    if (openedOnce.current) return;
    let seen = false;
    try { seen = sessionStorage.getItem("eba_assistant_autoopen") === "1"; } catch { /* ignore */ }
    if (seen) return;
    const t = window.setTimeout(() => {
      openedOnce.current = true;
      try { sessionStorage.setItem("eba_assistant_autoopen", "1"); } catch { /* ignore */ }
      setOpen(true);
      track("assistant_autoopen");
    }, 2600);
    return () => clearTimeout(t);
  }, [location]);

  // Keep the thread scrolled to the newest message.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, open]);

  const toggle = () => {
    setOpen((o) => { if (!o) track("assistant_open"); return !o; });
  };

  const respond = async (question: string, history: Msg[]) => {
    setThinking(true);
    // Try the live backend first; fall back to the local KB on any failure.
    let reply = "";
    try {
      const res = await fetch(ASSISTANT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history: history.slice(-8) }),
      });
      if (res.ok) {
        const data = await res.json();
        reply = (data?.reply || "").toString();
      }
    } catch { /* fall through to KB */ }
    if (!reply) {
      // small, natural delay so it reads like a considered answer
      await new Promise((r) => setTimeout(r, 480));
      reply = kbAnswer(question);
    }
    setThinking(false);
    setMessages((m) => [...m, { role: "bot", text: reply }]);
  };

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || thinking) return;
    track("assistant_ask", { q });
    setMessages((m) => {
      const next: Msg[] = [...m, { role: "user", text: q }];
      void respond(q, next);
      return next;
    });
    setInput("");
  };

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); ask(input); };

  const showSuggestions = messages.length <= 1 && !thinking;

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="EBA assistant"
          style={{
            position: "fixed", zIndex: 120, right: "20px", bottom: "92px",
            width: "min(370px, calc(100vw - 40px))", height: "min(560px, calc(100vh - 130px))",
            background: WHITE, borderRadius: "20px", overflow: "hidden",
            border: `1px solid rgba(${NAVY_RGB},0.10)`,
            boxShadow: "0 40px 90px -30px rgba(0,0,0,0.45)",
            display: "flex", flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ background: CTA_DARK_BG, padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={20} color="#fff" />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "15px", color: onDark }}>EBA Assistant</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: IS_LIGHT ? "rgba(255,255,255,0.85)" : `rgba(${CREAM_RGB},0.8)` }}>Ask me anything about EBA</div>
            </div>
            <button onClick={toggle} aria-label="Close assistant" style={{ background: "transparent", border: "none", cursor: "pointer", color: onDark, display: "inline-flex", padding: "4px" }}>
              <X size={18} />
            </button>
          </div>

          {/* Thread */}
          <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "86%",
                  background: m.role === "user" ? CTA_PRIMARY_BG : CREAM,
                  color: m.role === "user" ? "#fff" : NAVY,
                  fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", lineHeight: 1.5,
                  padding: "10px 13px",
                  borderRadius: m.role === "user" ? "13px 13px 3px 13px" : "3px 13px 13px 13px",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: CREAM, padding: "12px 14px", borderRadius: "3px 13px 13px 13px", display: "flex", gap: "4px" }}>
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="eba-caret" style={{ width: "6px", height: "6px", borderRadius: "50%", background: `rgba(${NAVY_RGB},0.4)`, animationDelay: `${d * 0.18}s` }} />
                  ))}
                </div>
              </div>
            )}

            {showSuggestions && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "4px" }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => ask(s)} style={{
                    background: `rgba(${RUST_RGB},0.08)`, color: RUST, border: `1px solid rgba(${RUST_RGB},0.2)`,
                    borderRadius: "18px", padding: "7px 12px", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12px",
                  }}>{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={onSubmit} style={{ flexShrink: 0, padding: "12px 14px 14px", borderTop: `1px solid rgba(${NAVY_RGB},0.08)`, display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…" aria-label="Ask a question"
              style={{ flex: 1, minWidth: 0, background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.16)`, borderRadius: "22px", padding: "11px 15px", fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: NAVY, outline: "none" }}
            />
            <button type="submit" disabled={!input.trim() || thinking} aria-label="Send" style={{
              width: "40px", height: "40px", borderRadius: "50%", border: "none", flexShrink: 0,
              background: CTA_PRIMARY_BG, color: "#fff", cursor: input.trim() && !thinking ? "pointer" : "not-allowed",
              display: "inline-flex", alignItems: "center", justifyContent: "center", opacity: input.trim() && !thinking ? 1 : 0.6,
            }}>
              <Send size={16} />
            </button>
          </form>
          <div style={{ flexShrink: 0, textAlign: "center", padding: "0 0 10px" }}>
            <button onClick={() => { navigate("/contact"); setOpen(false); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", color: `rgba(${NAVY_RGB},0.5)` }}>
              Prefer to talk to a person? Contact us →
            </button>
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
