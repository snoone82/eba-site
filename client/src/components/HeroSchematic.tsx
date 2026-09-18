/**
 * HeroSchematic — the homepage hero visual.
 *
 * A thin-line plant-room schematic (pipework, pumps, calorifier, boiler, AHU,
 * panel) draws itself in white; then the business is drawn around it in brass:
 * margin, cash flow, people, systems, contract, compliance. That is the
 * headline made visible — the business layer around the engineering.
 *
 * Desktop (background mode): full-bleed behind the copy, right-aligned so it
 * never sits under the headline. A soft light follows the cursor and
 * brightens whatever it passes over (a second copy of the drawing, masked by
 * a radial gradient whose centre is driven by CSS variables, so pointer moves
 * never re-render React).
 *
 * Mobile (inline mode): the copy comes first, then the drawing as its own
 * block at a readable size; it starts drawing when it scrolls into view.
 *
 * Reduced-motion users get the finished drawing with no animation.
 * Everything is SVG: no image download, sharp on every screen, and nothing
 * invented — no numbers, no people.
 */
import { useEffect, useRef, useState } from "react";

const BRASS = "#C9982E";

// Draw-on animation: pathLength=1 lets one dasharray value work for every shape.
function draw(delay: number, duration = 1.1) {
  return {
    pathLength: 1,
    className: "eba-draw",
    style: { animationDelay: `${delay}s`, animationDuration: `${duration}s` },
  } as const;
}
function fade(delay: number) {
  return { className: "eba-fade", style: { animationDelay: `${delay}s` } } as const;
}

interface Callout {
  anchor: [number, number];
  elbow: [number, number];
  shelfEnd: number;
  label: string;
  sub: string;
  delay: number;
}

// The business layer. Anchors sit on the equipment; labels sit in clear space.
const CALLOUTS: Callout[] = [
  { anchor: [1010, 244], elbow: [1040, 205], shelfEnd: 1150, label: "Margin", sub: "True cost, priced properly", delay: 1.9 },
  { anchor: [960, 562], elbow: [905, 605], shelfEnd: 1010, label: "Cash flow", sub: "Applications, retentions, terms", delay: 2.15 },
  { anchor: [1170, 375], elbow: [1180, 330], shelfEnd: 1250, label: "People", sub: "Roles, leaders, ownership", delay: 2.4 },
  { anchor: [1355, 500], elbow: [1296, 560], shelfEnd: 1400, label: "Systems", sub: "Procedures that repeat", delay: 2.65 },
  { anchor: [1245, 770], elbow: [1200, 808], shelfEnd: 1340, label: "Contract", sub: "Understood before you sign", delay: 2.9 },
  { anchor: [935, 770], elbow: [880, 805], shelfEnd: 1030, label: "Compliance", sub: "Built into the way you work", delay: 3.15 },
];

function Drawing({ lit, id, labelScale = 1, grid = true }: { lit: boolean; id: string; labelScale?: number; grid?: boolean }) {
  const line = lit ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.34)";
  const brass = lit ? BRASS : "rgba(201,152,46,0.62)";
  const subText = lit ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)";
  const w = 1.5;

  return (
    <>
      {grid && (
        <>
          <defs>
            <pattern id={`${id}-grid`} width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0H0V60" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="1500" height="900" fill={`url(#${id}-grid)`} />
        </>
      )}

      {/* ── Engineering layer ── */}
      <g fill="none" stroke={line} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        {/* Flow and return headers */}
        <line x1="840" y1="260" x2="1400" y2="260" {...draw(0)} />
        <line x1="840" y1="290" x2="1400" y2="290" {...draw(0.1)} />
        {/* Riser into the AHU */}
        <line x1="1270" y1="200" x2="1270" y2="660" {...draw(0.2)} />
        {/* Valves */}
        <polygon points="888,250 912,270 912,250 888,270" {...draw(0.6, 0.6)} />
        <polygon points="1148,250 1172,270 1172,250 1148,270" {...draw(0.7, 0.6)} />
        <polygon points="1260,428 1280,452 1280,428 1260,452" {...draw(0.8, 0.6)} />
        {/* Gauge on the flow header */}
        <circle cx="1010" cy="260" r="16" {...draw(0.9, 0.7)} />
        <line x1="1010" y1="260" x2="1019" y2="250" {...draw(1.2, 0.4)} />
        {/* Drop to the pump set */}
        <line x1="960" y1="260" x2="960" y2="388" {...draw(0.5, 0.7)} />
        <line x1="960" y1="452" x2="960" y2="498" {...draw(0.7, 0.4)} />
        <circle cx="960" cy="420" r="32" {...draw(0.8, 0.8)} />
        <polygon points="948,406 948,434 976,420" {...draw(1.0, 0.5)} />
        <circle cx="960" cy="530" r="32" {...draw(0.9, 0.8)} />
        <polygon points="948,516 948,544 976,530" {...draw(1.1, 0.5)} />
        <line x1="992" y1="420" x2="1060" y2="420" {...draw(1.0, 0.5)} />
        <line x1="992" y1="530" x2="1060" y2="530" {...draw(1.1, 0.5)} />
        {/* Calorifier with coil */}
        <line x1="1115" y1="290" x2="1115" y2="360" {...draw(0.7, 0.5)} />
        <rect x="1060" y="360" width="110" height="210" rx="14" {...draw(0.6, 1.0)} />
        <polyline points="1080,400 1150,420 1080,440 1150,460 1080,480 1150,500 1080,520" {...draw(1.2, 0.9)} />
        {/* Expansion vessel off the riser */}
        <circle cx="1205" cy="470" r="22" {...draw(1.0, 0.7)} />
        <line x1="1183" y1="470" x2="1227" y2="470" {...draw(1.2, 0.4)} />
        <line x1="1227" y1="470" x2="1270" y2="470" {...draw(1.1, 0.4)} />
        {/* Boiler feeding the calorifier */}
        <rect x="860" y="640" width="150" height="130" rx="6" {...draw(0.9, 1.0)} />
        <path d="M935,745 C915,725 925,705 935,690 C945,705 955,725 935,745 Z" {...draw(1.3, 0.7)} />
        <line x1="1010" y1="700" x2="1115" y2="700" {...draw(1.2, 0.5)} />
        <line x1="1115" y1="700" x2="1115" y2="570" {...draw(1.3, 0.5)} />
        {/* Air handling unit with fan, and the duct out */}
        <rect x="1150" y="660" width="190" height="110" rx="6" {...draw(1.0, 1.0)} />
        <circle cx="1200" cy="715" r="22" {...draw(1.3, 0.6)} />
        <line x1="1240" y1="672" x2="1330" y2="758" {...draw(1.2, 0.5)} />
        <line x1="1330" y1="672" x2="1240" y2="758" {...draw(1.25, 0.5)} />
        <line x1="1340" y1="705" x2="1400" y2="705" {...draw(1.3, 0.4)} />
        <line x1="1340" y1="725" x2="1400" y2="725" {...draw(1.35, 0.4)} />
        {/* Control panel */}
        <rect x="1320" y="380" width="70" height="120" rx="4" {...draw(1.0, 0.8)} />
        <line x1="1332" y1="405" x2="1378" y2="405" {...draw(1.3, 0.3)} />
        <line x1="1332" y1="430" x2="1378" y2="430" {...draw(1.35, 0.3)} />
        <line x1="1332" y1="455" x2="1378" y2="455" {...draw(1.4, 0.3)} />
        <line x1="1320" y1="440" x2="1270" y2="440" strokeDasharray="4 5" {...fade(1.5)} />
      </g>

      {/* ── Business layer ── */}
      <g fontFamily="'Poppins', sans-serif">
        {CALLOUTS.map(c => (
          <g key={c.label}>
            <circle cx={c.anchor[0]} cy={c.anchor[1]} r={3.5 * labelScale} fill={brass} {...fade(c.delay)} />
            <polyline
              points={`${c.anchor[0]},${c.anchor[1]} ${c.elbow[0]},${c.elbow[1]} ${c.shelfEnd},${c.elbow[1]}`}
              fill="none" stroke={brass} strokeWidth={1.25 * labelScale} strokeLinejoin="round"
              {...draw(c.delay + 0.1, 0.7)}
            />
            <text x={c.elbow[0] + 4} y={c.elbow[1] - 8 * labelScale} fill={brass} fontSize={12.5 * labelScale} fontWeight={700} letterSpacing="0.16em" {...fade(c.delay + 0.5)}>
              {c.label.toUpperCase()}
            </text>
            <text x={c.elbow[0] + 4} y={c.elbow[1] + 17 * labelScale} fill={subText} fontSize={11 * labelScale} fontWeight={400} letterSpacing="0.02em" {...fade(c.delay + 0.7)}>
              {c.sub}
            </text>
          </g>
        ))}
      </g>
    </>
  );
}

const KEYFRAMES = `
  @keyframes eba-draw { to { stroke-dashoffset: 0; } }
  .eba-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: eba-draw 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
  @keyframes eba-fade { to { opacity: 1; } }
  .eba-fade { opacity: 0; animation: eba-fade 0.6s ease forwards; }
  .eba-wait .eba-draw, .eba-wait .eba-fade { animation-play-state: paused; }
  @media (prefers-reduced-motion: reduce) {
    .eba-draw { animation: none; stroke-dashoffset: 0; }
    .eba-fade { animation: none; opacity: 1; }
  }
`;

interface Props {
  /** Render as a block in the flow (mobile) instead of a full-bleed background. */
  inline?: boolean;
}

export function HeroSchematic({ inline = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  // Inline mode waits until the block is on screen before drawing.
  const [go, setGo] = useState(!inline);

  useEffect(() => {
    if (!inline) return;
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") { setGo(true); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setGo(true); obs.disconnect(); }
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [inline]);

  // The light follows the pointer via CSS variables — no React state, no re-render.
  useEffect(() => {
    const el = wrap.current;
    if (!el || inline) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [inline]);

  if (inline) {
    // Crop to the drawn area so it fills the width at a readable size.
    return (
      <div ref={wrap} aria-hidden className={go ? "eba-go" : "eba-wait"} style={{ width: "100%", aspectRatio: "650 / 690" }}>
        <svg viewBox="830 175 650 690" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", display: "block" }}>
          <Drawing lit={false} id="eba-hero-inline" labelScale={1.5} grid={false} />
        </svg>
        <style>{KEYFRAMES}</style>
      </div>
    );
  }

  const svgStyle: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" };
  const mask = "radial-gradient(circle 260px at var(--mx) var(--my), rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 100%)";

  return (
    <div
      ref={wrap}
      aria-hidden
      className="eba-go"
      style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        ["--mx" as string]: "72%", ["--my" as string]: "44%",
      }}
    >
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMid meet" style={svgStyle}>
        <Drawing lit={false} id="eba-hero-base" />
      </svg>
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMaxYMid meet" style={svgStyle}>
          <Drawing lit id="eba-hero-lit" grid={false} />
        </svg>
      </div>
      <style>{KEYFRAMES}</style>
    </div>
  );
}
