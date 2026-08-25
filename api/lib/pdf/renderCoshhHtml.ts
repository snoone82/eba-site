import type { CoshhDocument } from "../schemas/coshh.js";
import { EBA_PDF_BRAND, getEmbeddedFontFaceCss, type BrandConfig } from "./brand.js";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface CoshhPdfMeta {
  site?: string;
  trade?: string;
  companyName?: string;
}

function listSection(heading: string, items: string[]): string {
  if (!items.length) return "";
  return `<div class="section">
    <h2>${esc(heading)}</h2>
    <ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
  </div>`;
}

export function renderCoshhHtml(
  doc: CoshhDocument,
  meta: CoshhPdfMeta = {},
  brand: BrandConfig = EBA_PDF_BRAND,
): string {
  const fontFaces = getEmbeddedFontFaceCss();
  const generatedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const metaLine = [
    meta.site ? `Site: ${esc(meta.site)}` : "Site: __________",
    meta.trade ? `Trade: ${esc(meta.trade)}` : "",
    meta.companyName ? `Company: ${esc(meta.companyName)}` : "",
  ]
    .filter(Boolean)
    .join(" &middot; ");

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<style>
${fontFaces}

:root {
  --ink: ${brand.ink};
  --paper: ${brand.paper};
  --accent: ${brand.accent};
  --hairline: ${brand.hairline};
  --stone: ${brand.stone};
}

@page { size: A4; margin: 12mm 14mm; }
* { box-sizing: border-box; }
html, body {
  font-family: ${brand.fontFamily};
  color: var(--ink);
  font-size: 10.4pt;
  line-height: 1.5;
  background: var(--paper);
  margin: 0;
}
.sheet { width: 100%; border-collapse: collapse; }
.head-cell { padding-bottom: 8mm; }
.foot-cell { padding-top: 5mm; }
.logo-block { display: flex; flex-direction: column; gap: 4px; }
.wordmark { font-weight: 700; font-size: 9.5pt; letter-spacing: 0.08em; color: var(--ink); }
.logo-rule { height: 3px; width: 64px; background: var(--accent); }
.header-row { display: flex; justify-content: space-between; align-items: flex-start; }
.header-kicker { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--stone); }
.eyebrow { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--stone); margin: 0 0 6px; }
h1 { font-size: 21pt; font-weight: 800; letter-spacing: -0.02em; line-height: 1.08; margin: 5px 0 10px; }
.meta-line { font-size: 9pt; color: var(--stone); margin: 0 0 12px; }
.badge {
  display: inline-block; border: 1px solid var(--accent); color: var(--accent);
  font-size: 8pt; font-weight: 600; padding: 3px 9px; border-radius: 999px; margin-bottom: 14px;
}
h2 { font-size: 12pt; font-weight: 700; margin: 15px 0 6px; break-after: avoid; }
p { margin: 0 0 9px; }
ul { margin: 0 0 8px; padding: 0; list-style: none; }
li { position: relative; padding-left: 15px; margin-bottom: 4px; }
li:before {
  content: ""; position: absolute; left: 2px; top: 0.55em;
  width: 5px; height: 5px; border-radius: 1.5px; background: var(--accent);
}
.section { border-top: 2px solid var(--ink); margin-top: 18px; padding-top: 11px; break-inside: avoid; }

.sds-box {
  background: #FBF0EE; border: 1.5px solid #B3261E; border-radius: 8px;
  padding: 11px 15px; font-size: 9.4pt; margin: 0 0 4px;
}
.sds-box strong { color: #B3261E; }

.signoff { width: 100%; border-collapse: collapse; margin-top: 8px; }
.signoff th {
  text-align: left; font-weight: 700; font-size: 7.6pt; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--stone); border-bottom: 1.5px solid var(--ink); padding: 6px 8px;
}
.signoff td { border-bottom: 1px solid var(--hairline); height: 30px; padding: 4px 8px; }

.disclaimer {
  font-size: 8pt; color: var(--stone); border-top: 1px solid var(--hairline);
  padding-top: 8px; margin-top: 14px;
}
.footer-row { display: flex; justify-content: space-between; font-size: 8pt; color: var(--stone); }
</style>
</head>
<body>
<table class="sheet">
  <thead>
    <tr><td class="head-cell">
      <div class="header-row">
        <div class="logo-block">
          <div class="wordmark">${esc(brand.wordmark)}</div>
          <div class="logo-rule"></div>
        </div>
        <div class="header-kicker">COSHH ASSESSMENT</div>
      </div>
    </td></tr>
  </thead>
  <tfoot>
    <tr><td class="foot-cell">
      <div class="footer-row">
        <span>${esc(brand.domain)}</span>
        <span>${esc(doc.compliance)}</span>
        <span>${esc(brand.tagline)}</span>
      </div>
    </td></tr>
  </tfoot>
  <tbody>
    <tr><td>
      <div class="eyebrow">COSHH assessment &middot; ${esc(generatedDate)} &middot; Draft</div>
      <h1>${esc(doc.title)}</h1>
      ${metaLine ? `<p class="meta-line">${metaLine}</p>` : ""}
      <div class="badge">${esc(doc.compliance)}</div>

      <div class="sds-box">
        <strong>Complete against the manufacturer's Safety Data Sheet.</strong>
        This draft describes the hazard at substance-type level. Product-specific hazard
        classifications, exposure limits, and PPE specifications MUST be confirmed against
        the SDS for the actual product in use before this assessment is approved.
      </div>

      <div class="section">
        <h2>Substance / task</h2>
        <p>${esc(doc.substanceOrTask)}</p>
        <h2>Nature of hazard</h2>
        <p>${esc(doc.hazardSummary)}</p>
      </div>

      ${listSection("Routes of exposure", doc.exposureRoutes)}
      ${listSection("Persons at risk", doc.personsAtRisk)}
      ${listSection("Control measures", doc.controlMeasures)}
      ${listSection("PPE", doc.ppe)}
      ${listSection("Storage & handling", doc.storageAndHandling)}
      ${listSection("Spillage procedure", doc.spillage)}
      ${listSection("First aid", doc.firstAid)}
      ${listSection("Disposal", doc.disposal)}

      <div class="section">
        <h2>Approval &amp; briefing record</h2>
        <table class="signoff">
          <thead>
            <tr><th>Name</th><th>Company</th><th>Signature</th><th>Date</th></tr>
          </thead>
          <tbody>
            ${Array.from({ length: 5 })
              .map(() => `<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`)
              .join("")}
          </tbody>
        </table>
        <p class="meta-line" style="margin-top:8px">
          SDS checked &amp; assessment approved by (competent person): __________________ &nbsp;&nbsp;
          Date: __________ &nbsp;&nbsp; SDS revision: __________
        </p>
      </div>

      <p class="disclaimer">
        AI-generated draft COSHH assessment. It complements &mdash; and does not replace &mdash;
        assessment by a competent person against the manufacturer's Safety Data Sheet.
      </p>
    </td></tr>
  </tbody>
</table>
</body>
</html>`;
}
