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
  NAVY, WHITE, RUST, RUST_RGB, NAVY_RGB, CREAM, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT, CTA_DARK_BG,
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
  "Hi — I'm the EBA assistant. Ask me about the Academy, the AI tools, the free Toolbox Talk Generator, documents, mentorship, pricing or enrolment.";

const SUGGESTIONS = [
  "What are the AI tools?",
  "How much does it cost?",
  "When does enrolment open?",
  "Who is it for?",
];

// ── Curated EBA knowledge base — accurate answers drawn from the site ──────────
const KB: { test: RegExp; answer: string }[] = [
  { test: /\b(price|pricing|cost|how much|fee|fees|expensive|afford)\b/i,
    answer: "The Academy is £999 as a one-time payment, or £1,299 with the full 380-document library, both with lifetime access. The AI tools are priced separately: RAMS £39/month, COSHH £29/month, both together £49/month, O&M manuals £299 each compiled for you, and the Compliance Co-Pilot at £499 setup + £149/month. Full detail's on the Pricing page." },
  { test: /\b(free|toolbox|talk generator|no cost|trial)\b/i,
    answer: "There's a free Toolbox Talk Generator: enter the task and get a structured toolbox talk draft with hazards, controls, PPE and a sign-off section in a few minutes. Review it before you use it with your team. Academy members get the full version included with membership." },
  { test: /\b(o&m|om manual|manual compiler)\b/i,
    answer: "The O&M manual service is compiled for you: send your project documents and a structured O&M manual comes back ready for your review within 24 hours. It's £299 per manual. You review and approve the final document before issue." },
  { test: /\b(rams|method statement|risk assessment)\b/i,
    answer: "The RAMS Generator creates a structured Risk Assessment & Method Statement draft in minutes, giving competent people a faster starting point while review and approval stay with your team. It's £39 a month, or £49 a month with COSHH included." },
  { test: /\b(coshh|substance|hazardous)\b/i,
    answer: "The COSHH Generator creates a structured COSHH assessment draft from the substance, task and exposure information you provide, ready for competent review. It's £29 a month, or £49 a month with RAMS included." },
  { test: /\b(co-?pilot|chatbot|assistant|hseq|knowledge)\b/i,
    answer: "The Compliance Co-Pilot is configured around your company's own HSEQ procedures and documents. Your team asks a question and gets a response that references the source document. We configure and host it for you. £499 setup plus £149 a month, including hosting and support." },
  { test: /\b(ai|tools|software|automat)\b/i,
    answer: "We're building a growing suite of AI tools and agents for engineering businesses. Available now: the O&M Manual Compiler (£299 per manual), RAMS Generator (£39/month), COSHH Generator (£29/month, or £49/month with RAMS) and the Compliance Co-Pilot (£499 setup + £149/month). Outputs are drafts for your people to review. Not included with Academy membership. The AI Tools page has demos." },
  { test: /\b(enrol|enroll|start|begin|when|join|sign ?up|cohort|waitlist|available)\b/i,
    answer: "Enrolment is open. You can join the Academy now from the Academy or Pricing page, with lifetime access from the day you join." },
  { test: /\b(academy|course|curriculum|module|lesson|learn|programme|program)\b/i,
    answer: "The Academy is 100+ practical lessons across 10 modules covering leadership, culture, teams, processes, sales, commercial controls, cash flow, risk and growth, built from decades of real-world experience building and scaling engineering businesses. CPD accreditation is in progress." },
  { test: /\b(document|library|template|form|register|policy|packs?)\b/i,
    answer: "The Document Library is 380 ready-to-use documents: templates, forms, checklists and procedures in editable Word and PDF formats, drawn from real practice. It's included with Academy + Documents membership, or available on its own." },
  { test: /\b(mentor|mentorship|1:?1|one to one|mark|poulton|coaching)\b/i,
    answer: "Mentorship is small-group or 1:1 sessions with experienced engineering business leaders, plus a limited number of founder sessions with Mark Poulton. Pricing is agreed after an initial conversation about the support you need. The Mentorship page explains the options and how to start a conversation." },
  { test: /\b(who|suitable|right for|beginner|sole trader|small|electrician|plumb|hvac)\b/i,
    answer: "It's built for owners and leaders of engineering and technical services businesses who want stronger commercial control, better systems, stronger teams and a business ready for its next stage of growth. No prior business training needed." },
  { test: /\b(refund|money ?back|guarantee|cancel)\b/i,
    answer: "There's a 14-day money-back guarantee on Academy memberships. If it's not right for your business, get in touch within 14 days." },
  { test: /\b(keyis|about|behind|real|experience|who are you|legit|trust)\b/i,
    answer: "The Academy is built from decades of real-world experience building, leading and scaling engineering businesses across multiple divisions and international operations. Everything here comes from real operations, not theory." },
  { test: /\b(contact|human|person|speak|call|phone|email|reach|talk to)\b/i,
    answer: "Happy to connect you with the team. The contact form is the fastest route and we reply within two working days. Or tell me your question here and I'll do my best." },
  { test: /\b(hi|hello|hey|help|hiya|morning|afternoon)\b/i,
    answer: "Hi! I can help with the Academy, the AI tools, the free Toolbox Talk Generator, documents, mentorship, pricing or enrolment. What would you like to know?" },
  { test: /\b(thank|thanks|cheers|great|perfect|brilliant)\b/i,
    answer: "Any time! Anything else I can help with: pricing, the tools, or joining the Academy?" },
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
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: IS_LIGHT ? "rgba(255,255,255,0.85)" : `rgba(${CREAM_RGB},0.8)` }}>Ask me anything about EBA</div>
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
                  fontFamily: "'Poppins', sans-serif", fontSize: "13.5px", lineHeight: 1.5,
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
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "12px",
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
              style={{ flex: 1, minWidth: 0, background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.16)`, borderRadius: "22px", padding: "11px 15px", fontFamily: "'Poppins', sans-serif", fontSize: "13.5px", color: NAVY, outline: "none" }}
            />
            <button type="submit" disabled={!input.trim() || thinking} aria-label="Send" style={{
              width: "40px", height: "40px", borderRadius: "50%", border: "none", flexShrink: 0,
              background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, cursor: input.trim() && !thinking ? "pointer" : "not-allowed",
              display: "inline-flex", alignItems: "center", justifyContent: "center", opacity: input.trim() && !thinking ? 1 : 0.6,
            }}>
              <Send size={16} />
            </button>
          </form>
          <div style={{ flexShrink: 0, textAlign: "center", padding: "0 0 10px" }}>
            <button onClick={() => { navigate("/contact"); setOpen(false); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontSize: "11.5px", color: `rgba(${NAVY_RGB},0.72)` }}>
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
