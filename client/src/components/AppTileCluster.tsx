/**
 * AppTileCluster — the hero showpiece for the Windsor skin: a soft gradient card
 * holding a grid of colourful "product tiles" (the tools, modules and library)
 * with two floating status chips. Asset-free, theme-agnostic, crisp at any size.
 */
import { NAV_BORDER } from "@/lib/constants";

type Tile = { label: string; name: string; bg: string };

const TILES: Tile[] = [
  { label: "TOOL", name: "O&M", bg: "#4B5AE6" },
  { label: "TOOL", name: "RAMS", bg: "#10B981" },
  { label: "TOOL", name: "COSHH", bg: "#F59E0B" },
  { label: "AI", name: "Co-Pilot", bg: "#EF4444" },
  { label: "MODULE", name: "Pricing", bg: "#8B5CF6" },
  { label: "MODULE", name: "Cash", bg: "#06B6D4" },
  { label: "MODULE", name: "Contracts", bg: "#EC4899" },
  { label: "MODULE", name: "Growth", bg: "#22C55E" },
  { label: "LIBRARY", name: "380 docs", bg: "#3B82F6" },
  { label: "1:1", name: "Mentor", bg: "#F97316" },
  { label: "CPD", name: "101", bg: "#0EA5E9" },
  { label: "FREE", name: "Toolbox", bg: "#6366F1" },
];

export function AppTileCluster() {
  const chip: React.CSSProperties = {
    position: "absolute", background: "#fff", border: `1px solid rgba(20,21,26,0.10)`,
    borderRadius: "999px", padding: "9px 15px", fontSize: "12.5px", fontWeight: 600,
    color: "#20242E", boxShadow: "0 14px 30px -14px rgba(20,21,26,0.35)",
    display: "flex", alignItems: "center", gap: "8px",
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{
        position: "relative", borderRadius: "26px", padding: "26px",
        background:
          "radial-gradient(60% 80% at 20% 15%, #E9ECFF 0%, transparent 60%)," +
          "radial-gradient(60% 80% at 85% 25%, #F3E9FF 0%, transparent 60%)," +
          "radial-gradient(70% 80% at 60% 100%, #E6F7FF 0%, transparent 60%), #F7F8FE",
        border: "1px solid #EEF0FA",
        boxShadow: "0 50px 90px -50px rgba(75,90,230,0.55)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {TILES.map((t) => (
            <div key={t.name} style={{
              aspectRatio: "1", borderRadius: "15px", background: t.bg,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "3px", color: "#fff", boxShadow: "0 12px 24px -12px rgba(0,0,0,0.35)",
            }}>
              <span style={{ fontSize: "8px", fontWeight: 600, letterSpacing: "0.04em", opacity: 0.9 }}>{t.label}</span>
              <span style={{ fontSize: "13px", fontWeight: 700 }}>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...chip, top: "-14px", right: "22px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }} /> AI tools ready now
      </div>
      <div style={{ ...chip, bottom: "-14px", left: "26px" }}>⚡ 380 templates included</div>
    </div>
  );
}
