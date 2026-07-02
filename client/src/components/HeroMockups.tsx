/**
 * HeroMockups — stylized, asset-free product mockups for the hero, stacked as
 * three equal-width "app window" cards (Academy player, O&M Manual Compiler,
 * Compliance Co-Pilot). Built from CSS/SVG so they stay crisp and theme-aware.
 * Rendered only on the modern light themes (desktop), where the hero is white.
 */
import { useEffect, useRef, useState } from "react";
import { NAVY, WHITE, RUST, RUST_RGB, NAVY_RGB, CTA_PRIMARY_BG } from "@/lib/constants";
import { useTilt } from "@/hooks/useTilt";

const MODULES = [
  "The Business You Own",
  "Cash Flow & Visibility",
  "Pricing & Margins",
  "Tendering & Winning",
];

const ANSWER =
  "You'll need a hot-works permit, a fire-watch RAMS and a 60-minute post-works watch. Want me to draft it?";

const OM_STEPS = ["Reading project data", "Structuring to CDM", "Compiling 48 pages", "Manual ready"];

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function HeroMockups() {
  const border = `rgba(${NAVY_RGB},0.10)`;
  const track = `rgba(${NAVY_RGB},0.08)`;
  const sub = `rgba(${NAVY_RGB},0.55)`;
  const accentSoft = `rgba(${RUST_RGB},0.12)`;

  const reduce = prefersReducedMotion();
  const [typed, setTyped] = useState(reduce ? ANSWER : "");
  const [progress, setProgress] = useState(reduce ? 62 : 0);
  const [omStep, setOmStep] = useState(reduce ? OM_STEPS.length : 0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (reduce) return;
    timers.current.push(window.setTimeout(() => setProgress(62), 450));

    let i = 0;
    const type = () => {
      i += 1;
      setTyped(ANSWER.slice(0, i));
      if (i < ANSWER.length) {
        timers.current.push(window.setTimeout(type, 34));
      } else {
        timers.current.push(window.setTimeout(() => { i = 0; setTyped(""); timers.current.push(window.setTimeout(type, 500)); }, 4200));
      }
    };
    timers.current.push(window.setTimeout(type, 1100));

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

  const cardShell: React.CSSProperties = {
    width: "100%", background: WHITE, borderRadius: "16px", border: `1px solid ${border}`,
    boxShadow: "0 30px 62px -26px rgba(0,0,0,0.30), 0 10px 20px -14px rgba(0,0,0,0.18)",
    overflow: "hidden",
  };
  const chromeRow = (label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 13px", borderBottom: `1px solid ${border}` }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
        <span key={c} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c, opacity: 0.85 }} />
      ))}
      <span style={{ marginLeft: "8px", fontFamily: "'Roboto', sans-serif", fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.06em", color: sub, textTransform: "uppercase" }}>{label}</span>
    </div>
  );

  const tiltRef = useTilt<HTMLDivElement>(6);

  return (
    <div ref={tiltRef} className="eba-tilt" style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%" }}>

      {/* ── Card 1: Academy player ── */}
      <div className="eba-float-slow eba-grad-border" style={cardShell}>
        {chromeRow("The Academy")}
        <div style={{ display: "flex", minHeight: "196px" }}>
          <div style={{ width: "150px", borderRight: `1px solid ${border}`, padding: "14px 11px" }}>
            <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: RUST, marginBottom: "12px" }}>MODULES</div>
            {MODULES.map((m, i) => (
              <div key={m} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 8px", marginBottom: "3px", borderRadius: "7px", background: i === 2 ? accentSoft : "transparent" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: i <= 2 ? RUST : track, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "10px", fontWeight: i === 2 ? 700 : 500, color: i === 2 ? NAVY : sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: "16px 16px 18px" }}>
            <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: sub, marginBottom: "7px" }}>LESSON 4 OF 12</div>
            <div style={{ fontFamily: "var(--eba-heading)", fontSize: "18px", fontWeight: 800, color: NAVY, lineHeight: 1.15, marginBottom: "12px" }}>Pricing, Margins &amp; Estimating</div>
            <div style={{ position: "relative", height: "84px", borderRadius: "10px", background: `linear-gradient(135deg, ${accentSoft}, rgba(${NAVY_RGB},0.04))`, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: CTA_PRIMARY_BG, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -6px rgba(0,0,0,0.3)" }}>
                <span style={{ width: 0, height: 0, borderLeft: "11px solid #fff", borderTop: "7px solid transparent", borderBottom: "7px solid transparent", marginLeft: "3px" }} />
              </div>
            </div>
            <div style={{ height: "6px", borderRadius: "3px", background: track, overflow: "hidden", marginBottom: "7px" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: CTA_PRIMARY_BG, transition: "width 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
            </div>
            <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: "10px", color: sub }}>62% complete · 7 lessons left</div>
          </div>
        </div>
      </div>

      {/* ── Card 2: O&M Manual Compiler ── */}
      <div className="eba-float eba-grad-border" style={cardShell}>
        {chromeRow("O&M Manual Compiler")}
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "13px" }}>
            <span style={{ width: "30px", height: "30px", borderRadius: "9px", background: CTA_PRIMARY_BG, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
            </span>
            <div>
              <div style={{ fontFamily: "var(--eba-heading)", fontSize: "13.5px", fontWeight: 800, color: NAVY, lineHeight: 1.1 }}>Riverside M&amp;E fit-out</div>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: "9.5px", color: sub, marginTop: "1px" }}>Generating O&amp;M manual…</div>
            </div>
          </div>
          {OM_STEPS.map((label, i) => {
            const done = omStep > i;
            const active = omStep === i;
            const isFinal = i === OM_STEPS.length - 1;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", opacity: done || active ? 1 : 0.4, transition: "opacity 0.3s" }}>
                <span style={{ width: "17px", height: "17px", borderRadius: "50%", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? CTA_PRIMARY_BG : "transparent", border: done ? "none" : `1.5px solid ${active ? RUST : track}` }}>
                  {done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
                  {active && <span className="eba-caret" style={{ width: "5px", height: "5px", borderRadius: "50%", background: RUST }} />}
                </span>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "12px", fontWeight: done && isFinal ? 800 : 600, color: done || active ? NAVY : sub }}>
                  {done && isFinal ? "Manual ready · 48 pages" : label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Card 3: Compliance Co-Pilot ── */}
      <div className="eba-float-slow eba-grad-border" style={cardShell}>
        {chromeRow("Compliance Co-Pilot")}
        <div style={{ padding: "16px 16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <div style={{ maxWidth: "82%", background: accentSoft, color: NAVY, fontFamily: "'Roboto', sans-serif", fontSize: "12px", lineHeight: 1.45, padding: "9px 12px", borderRadius: "12px 12px 3px 12px" }}>
              What RAMS do I need for hot works on an MOD site?
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ maxWidth: "88%", minHeight: "56px", background: `rgba(${NAVY_RGB},0.05)`, color: sub, fontFamily: "'Roboto', sans-serif", fontSize: "12px", lineHeight: 1.45, padding: "9px 12px", borderRadius: "12px 12px 12px 3px" }}>
              {typed}
              <span className="eba-caret" style={{ display: "inline-block", width: "6px", height: "13px", background: RUST, marginLeft: "2px", verticalAlign: "-2px" }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
