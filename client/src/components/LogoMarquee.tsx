/**
 * LogoMarquee — an auto-scrolling row of client / sector wordmarks. Pauses on
 * hover; static under prefers-reduced-motion. Edges fade out via a mask.
 */
import { NAVY, CREAM, NAVY_RGB, RUST } from "@/lib/constants";

const ITEMS = [
  "KEYIS Group", "Task Energy", "Pro Defend", "Advanced Manufacturing",
  "Clean Energy", "Data Centres", "Nuclear", "Aerospace", "Healthcare", "Defence",
];

export function LogoMarquee() {
  const sub = `rgba(${NAVY_RGB},0.55)`;
  const Item = ({ label }: { label: string }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "26px", flexShrink: 0 }}>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase", color: sub, whiteSpace: "nowrap",
      }}>{label}</span>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: RUST, opacity: 0.6, flexShrink: 0 }} />
    </span>
  );

  return (
    <section style={{ background: CREAM, padding: "10px 0 6px" }}>
      <div style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: sub, marginBottom: "26px", padding: "0 20px" }}>
        Built on real operations across
      </div>
      <div className="eba-marquee-mask" style={{ overflow: "hidden", width: "100%" }}>
        <div className="eba-marquee-track" style={{ display: "flex", alignItems: "center", gap: "26px", width: "max-content" }}>
          {[...ITEMS, ...ITEMS].map((label, i) => <Item key={i} label={label} />)}
        </div>
      </div>
    </section>
  );
}
