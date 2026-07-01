/**
 * HeroMockups — stylized, asset-free product mockups for the hero.
 * A laptop showing the Academy module player + a phone showing the compliance
 * chatbot, built entirely from CSS/SVG so they stay crisp and theme-aware.
 * Rendered only on the modern light themes (desktop), where the hero is white.
 */
import { useEffect, useRef, useState } from "react";
import { NAVY, WHITE, RUST, RUST_RGB, NAVY_RGB, CTA_PRIMARY_BG } from "@/lib/constants";

const MODULES = [
  "The Business You Own",
  "Cash Flow & Visibility",
  "Pricing & Margins",
  "Tendering & Winning",
  "Contracts & Risk",
];

const ANSWER =
  "You'll need a hot-works permit, a fire-watch RAMS and a 60-minute post-works watch. Want me to draft it?";

// Steps the O&M Manual Compiler "runs" through, looping.
const OM_STEPS = [
  "Reading project data",
  "Structuring to CDM",
  "Compiling 48 pages",
  "Manual ready",
];

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function HeroMockups() {
  const border = `rgba(${NAVY_RGB},0.10)`;
  const track = `rgba(${NAVY_RGB},0.08)`;
  const sub = `rgba(${NAVY_RGB},0.55)`;
  const accentSoft = `rgba(${RUST_RGB},0.12)`;

  // ── Live: chatbot types its answer; progress bar fills on mount ──
  const reduce = prefersReducedMotion();
  const [typed, setTyped] = useState(reduce ? ANSWER : "");
  const [progress, setProgress] = useState(reduce ? 62 : 0);
  // O&M compiler: index of the step currently running (>= length ⇒ all done)
  const [omStep, setOmStep] = useState(reduce ? OM_STEPS.length : 0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) return;
    // fill the lesson progress shortly after mount (CSS transition animates it)
    timers.current.push(window.setTimeout(() => setProgress(62), 450));
    // type the chatbot answer, then loop (retype) so the hero keeps living
    let i = 0;
    const type = () => {
      i += 1;
      setTyped(ANSWER.slice(0, i));
      if (i < ANSWER.length) {
        timers.current.push(window.setTimeout(type, 34));
      } else {
        // hold, clear, retype
        timers.current.push(window.setTimeout(() => { i = 0; setTyped(""); timers.current.push(window.setTimeout(type, 500)); }, 4200));
      }
    };
    timers.current.push(window.setTimeout(type, 1100));

    // O&M compiler: advance through steps, hold on "ready", then restart
    let s = 0;
    const advance = () => {
      s += 1;
      setOmStep(s);
      if (s < OM_STEPS.length) {
        timers.current.push(window.setTimeout(advance, 1050));
      } else {
        timers.current.push(window.setTimeout(() => { s = 0; setOmStep(0); timers.current.push(window.setTimeout(advance, 900)); }, 3600));
      }
    };
    timers.current.push(window.setTimeout(advance, 900));

    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [reduce]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ── Laptop ── */}
      <div className="eba-float" style={{ position: "absolute", top: "8px", right: "0", width: "470px", maxWidth: "100%" }}>
        <div style={{
          background: WHITE, borderRadius: "14px", border: `1px solid ${border}`,
          boxShadow: "0 34px 70px -24px rgba(0,0,0,0.28), 0 12px 24px -16px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}>
          {/* window chrome */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "11px 14px", borderBottom: `1px solid ${border}` }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
              <span key={c} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c, opacity: 0.85 }} />
            ))}
            <div style={{ marginLeft: "12px", flex: 1, maxWidth: "200px", height: "16px", borderRadius: "8px", background: track }} />
          </div>
          {/* app body */}
          <div style={{ display: "flex", minHeight: "276px" }}>
            {/* sidebar */}
            <div style={{ width: "168px", borderRight: `1px solid ${border}`, padding: "16px 12px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: RUST, marginBottom: "14px" }}>
                THE ACADEMY
              </div>
              {MODULES.map((m, i) => (
                <div key={m} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 9px", marginBottom: "4px", borderRadius: "7px",
                  background: i === 2 ? accentSoft : "transparent",
                }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: i < 2 ? RUST : i === 2 ? RUST : track, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10.5px", fontWeight: i === 2 ? 700 : 500, color: i === 2 ? NAVY : sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {m}
                  </span>
                </div>
              ))}
            </div>
            {/* lesson */}
            <div style={{ flex: 1, padding: "18px 18px 20px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: sub, marginBottom: "8px" }}>
                LESSON 4 OF 12
              </div>
              <div style={{ fontFamily: "var(--eba-heading)", fontSize: "20px", fontWeight: 800, color: NAVY, lineHeight: 1.15, marginBottom: "14px" }}>
                Pricing, Margins &amp; Estimating
              </div>
              {/* video area */}
              <div style={{
                position: "relative", height: "120px", borderRadius: "10px",
                background: `linear-gradient(135deg, ${accentSoft}, rgba(${NAVY_RGB},0.04))`,
                border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "14px",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%", background: CTA_PRIMARY_BG,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 20px -6px rgba(0,0,0,0.3)",
                }}>
                  <span style={{ width: 0, height: 0, borderLeft: "12px solid #fff", borderTop: "8px solid transparent", borderBottom: "8px solid transparent", marginLeft: "3px" }} />
                </div>
              </div>
              {/* progress */}
              <div style={{ height: "6px", borderRadius: "3px", background: track, overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: CTA_PRIMARY_BG, transition: "width 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: sub }}>62% complete · 7 lessons left</div>
            </div>
          </div>
        </div>
        {/* laptop base */}
        <div style={{ height: "10px", margin: "0 -26px", borderRadius: "0 0 14px 14px", background: "linear-gradient(180deg, #DCDCE2 0%, #BFBFC8 100%)" }} />
        <div style={{ height: "3px", width: "70px", margin: "0 auto", borderRadius: "0 0 6px 6px", background: "#AEAEB8" }} />
      </div>

      {/* ── Phone: Compliance Co-Pilot (enlarged) ── */}
      <div className="eba-float-slow" style={{ position: "absolute", bottom: "-24px", left: "-6px", width: "224px" }}>
        <div style={{
          background: WHITE, borderRadius: "30px", border: `1px solid ${border}`, padding: "12px 11px 18px",
          boxShadow: "0 36px 72px -20px rgba(0,0,0,0.38), 0 12px 22px -12px rgba(0,0,0,0.22)",
        }}>
          {/* notch */}
          <div style={{ width: "58px", height: "6px", borderRadius: "3px", background: track, margin: "1px auto 12px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "0 5px 12px", borderBottom: `1px solid ${border}`, marginBottom: "12px" }}>
            <span style={{ width: "26px", height: "26px", borderRadius: "8px", background: CTA_PRIMARY_BG, flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", fontWeight: 800, color: NAVY }}>Compliance Co-Pilot</span>
          </div>
          {/* user bubble */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <div style={{ maxWidth: "86%", background: accentSoft, color: NAVY, fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", lineHeight: 1.45, padding: "9px 11px", borderRadius: "12px 12px 3px 12px" }}>
              What RAMS do I need for hot works on an MOD site?
            </div>
          </div>
          {/* answer bubble */}
          <div style={{ display: "flex", marginBottom: "4px" }}>
            <div style={{ maxWidth: "92%", minHeight: "58px", background: `rgba(${NAVY_RGB},0.05)`, color: sub, fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", lineHeight: 1.45, padding: "9px 11px", borderRadius: "12px 12px 12px 3px" }}>
              {typed}
              <span className="eba-caret" style={{ display: "inline-block", width: "6px", height: "13px", background: RUST, marginLeft: "2px", verticalAlign: "-2px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── O&M Manual Compiler (animated) ── */}
      <div className="eba-float-slow" style={{ position: "absolute", top: "-18px", left: "56px", width: "230px" }}>
        <div style={{
          background: WHITE, border: `1px solid ${border}`, borderRadius: "16px", padding: "16px 16px 14px",
          boxShadow: "0 26px 52px -18px rgba(0,0,0,0.30)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "13px" }}>
            <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: CTA_PRIMARY_BG, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            </span>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11.5px", fontWeight: 800, color: NAVY, lineHeight: 1.1 }}>O&amp;M Manual Compiler</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: sub, marginTop: "1px" }}>Project · Riverside M&amp;E fit-out</div>
            </div>
          </div>
          {OM_STEPS.map((label, i) => {
            const done = omStep > i;
            const active = omStep === i;
            const isFinal = i === OM_STEPS.length - 1;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "4px 0", opacity: done || active ? 1 : 0.4, transition: "opacity 0.3s" }}>
                <span style={{
                  width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: done ? CTA_PRIMARY_BG : "transparent",
                  border: done ? "none" : `1.5px solid ${active ? RUST : track}`,
                }}>
                  {done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
                  {active && <span className="eba-caret" style={{ width: "5px", height: "5px", borderRadius: "50%", background: RUST }} />}
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: done && isFinal ? 800 : 600, color: done && isFinal ? NAVY : done || active ? NAVY : sub }}>
                  {done && isFinal ? "Manual ready · 48 pages" : label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
