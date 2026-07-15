/**
 * ProductFrame — screenshot-style product-visual slot for tool cards.
 * A browser-chrome frame in the tools accent (cobalt) holding an honest,
 * clearly styled mock of the tool's output — never a stock photo, never a
 * fake screenshot of a product state that doesn't exist.
 *
 * TODO(eba): replace the styled placeholder content with real product
 * screenshots once the live tools can be captured.
 *
 * Rule of thumb: tools sections show the product; Academy / Mark / Our Story
 * sections keep photographic imagery.
 */

import { COBALT, COBALT_RGB, COLORS, NAVY, NAVY_RGB, OAT, SKY, WHITE } from "@/lib/constants";

export function ProductFrame({
  url,
  docTitle,
  docMeta,
  lines,
  chip,
  matrix = false,
}: {
  /** Address-bar text, e.g. "teb-academy.com/ai-tools/om-manual" */
  url: string;
  /** Mock document header, e.g. "O&M Manual — Section 4: Mechanical Services" */
  docTitle: string;
  /** Small meta line under the header, e.g. "Project ref · Rev A · CDM 2015" */
  docMeta?: string;
  /** Completed content lines (rendered as text rows with a green tick) */
  lines: string[];
  /** Optional status chip, e.g. "GENERATED IN 4M 12S" — the product's proof line */
  chip?: string;
  /** Optional mini risk matrix (RAMS-style coloured grid) */
  matrix?: boolean;
}) {
  return (
    <div style={{
      background: WHITE,
      border: `1px solid rgba(${COBALT_RGB},0.35)`,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: `0 18px 40px -30px rgba(${NAVY_RGB},0.45)`,
    }}>
      {/* Browser chrome — tools accent */}
      <div style={{
        background: `rgba(${COBALT_RGB},0.08)`,
        borderBottom: `1px solid rgba(${COBALT_RGB},0.22)`,
        padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px",
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: `rgba(${COBALT_RGB},0.35)` }} />
        ))}
        <span style={{
          flex: 1, marginLeft: "6px", background: WHITE,
          border: `1px solid rgba(${COBALT_RGB},0.2)`, borderRadius: "4px",
          padding: "3px 10px", fontFamily: "'Poppins', sans-serif",
          fontSize: "10.5px", color: `rgba(${NAVY_RGB},0.62)`,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {url}
        </span>
        <span style={{
          fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "8.5px",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: COBALT, whiteSpace: "nowrap",
        }}>
          Product preview
        </span>
      </div>
      {/* Mock document */}
      <div style={{ padding: "16px 18px 18px" }}>
        <p style={{
          fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13px",
          color: NAVY, margin: "0 0 3px", lineHeight: 1.35,
        }}>
          {docTitle}
        </p>
        {docMeta && (
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "10.5px", color: `rgba(${NAVY_RGB},0.5)`, margin: "0 0 12px" }}>
            {docMeta}
          </p>
        )}
        {/* Mini risk matrix (RAMS-style) — green/amber/red assessment grid */}
        {matrix && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 22px)", gap: "4px", margin: "0 0 12px" }}>
            {["#2ECC71", "#2ECC71", "#FF9F1C", "#2ECC71", "#FF9F1C", "#FF5B6E", "#2ECC71", "#2ECC71", "#FF9F1C"].map((c, i) => (
              <div key={i} style={{ width: "22px", height: "22px", borderRadius: "5px", background: c, opacity: 0.85 }} />
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: docMeta || matrix ? 0 : "12px" }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{
                width: "15px", height: "15px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
                border: `1.5px solid ${COLORS.mint}`, color: COLORS.mint,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px", fontWeight: 800,
              }}>✓</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11.5px", lineHeight: 1.45, color: `rgba(${NAVY_RGB},0.68)` }}>
                {line}
              </span>
            </div>
          ))}
        </div>
        {/* Skeleton rows suggesting more content below the fold */}
        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {["82%", "64%", "73%"].map((w, i) => (
            <div key={i} style={{ height: "6px", width: w, borderRadius: "3px", background: OAT }} />
          ))}
        </div>
        {/* Status chip — the product's proof line, verdigris fill + ink text */}
        {chip && (
          <span style={{
            display: "inline-block", marginTop: "14px",
            background: SKY, color: "#0A0A0A",
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "10px",
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: "14px",
          }}>
            {chip}
          </span>
        )}
      </div>
    </div>
  );
}
