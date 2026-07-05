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

import { COBALT, COBALT_RGB, NAVY, NAVY_RGB, OAT, WHITE } from "@/lib/constants";

export function ProductFrame({
  url,
  docTitle,
  docMeta,
  lines,
}: {
  /** Address-bar text, e.g. "eba.academy/ai-tools/om-manual" */
  url: string;
  /** Mock document header, e.g. "O&M Manual — Section 4: Mechanical Services" */
  docTitle: string;
  /** Small meta line under the header, e.g. "Project ref · Rev A · CDM 2015" */
  docMeta?: string;
  /** Skeleton content lines (rendered as text rows with a cobalt tick) */
  lines: string[];
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
          padding: "3px 10px", fontFamily: "'Roboto', sans-serif",
          fontSize: "10.5px", color: `rgba(${NAVY_RGB},0.62)`,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {url}
        </span>
        <span style={{
          fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "8.5px",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: COBALT, whiteSpace: "nowrap",
        }}>
          Product preview
        </span>
      </div>
      {/* Mock document */}
      <div style={{ padding: "16px 18px 18px" }}>
        <p style={{
          fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "13px",
          color: NAVY, margin: "0 0 3px", lineHeight: 1.35,
        }}>
          {docTitle}
        </p>
        {docMeta && (
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: "10.5px", color: `rgba(${NAVY_RGB},0.5)`, margin: "0 0 12px" }}>
            {docMeta}
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: docMeta ? 0 : "12px" }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{
                width: "13px", height: "13px", borderRadius: "3px", flexShrink: 0, marginTop: "1px",
                background: `rgba(${COBALT_RGB},0.12)`, color: COBALT,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "8px", fontWeight: 800,
              }}>✓</span>
              <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "11.5px", lineHeight: 1.45, color: `rgba(${NAVY_RGB},0.68)` }}>
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
      </div>
    </div>
  );
}
