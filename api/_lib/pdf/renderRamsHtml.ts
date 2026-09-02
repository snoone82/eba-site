import type { RamsDocument } from "../schemas/rams.js";
import { EBA_PDF_BRAND, getEmbeddedFontFaceCss, type BrandConfig } from "./brand.js";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface RamsPdfMeta {
  site?: string;
  trade?: string;
  companyName?: string;
}

function riskBadge(level: "High" | "Medium" | "Low"): string {
  const colour = level === "High" ? "#B3261E" : level === "Medium" ? "#A6620B" : "#1B7F5A";
  return `<span class="risk" style="color:${colour};border-color:${colour}">${level}</span>`;
}

export function renderRamsHtml(
  doc: RamsDocument,
  meta: RamsPdfMeta = {},
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

  const riskRows = doc.risks
    .map(
      (r) => `<tr>
        <td><strong>${esc(r.hazard)}</strong><br/><span class="sub">${esc(r.whoAndHow)}</span></td>
        <td class="risk-cell">${riskBadge(r.initialRisk)}</td>
        <td><ul>${r.controls.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></td>
        <td class="risk-cell">${riskBadge(r.residualRisk)}</td>
      </tr>`,
    )
    .join("");

  const methodSteps = doc.methodSteps
    .map(
      (s, i) => `<div class="step">
        <div class="step-num">${i + 1}</div>
        <div><h3>${esc(s.step)}</h3><p>${esc(s.detail)}</p></div>
      </div>`,
    )
    .join("");

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
  font-size: 10pt;
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
.header-kicker {
  font-size: 8.5pt; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.14em; color: var(--stone);
}

.eyebrow { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--stone); margin: 0 0 6px; }
h1 { font-size: 21pt; font-weight: 800; letter-spacing: -0.02em; line-height: 1.08; margin: 5px 0 10px; }
.meta-line { font-size: 9pt; color: var(--stone); margin: 0 0 12px; }
.badge {
  display: inline-block; border: 1px solid var(--accent); color: var(--accent);
  font-size: 8pt; font-weight: 600; padding: 3px 9px; border-radius: 999px; margin-bottom: 14px;
}
h2 { font-size: 12pt; font-weight: 700; margin: 15px 0 8px; break-after: avoid; }
h3 { font-size: 10.5pt; font-weight: 700; margin: 0 0 3px; }
p { margin: 0 0 8px; }
ul { margin: 0; padding: 0; list-style: none; }
li { position: relative; padding-left: 14px; margin-bottom: 4px; }
li:before {
  content: ""; position: absolute; left: 2px; top: 0.55em;
  width: 5px; height: 5px; border-radius: 1.5px; background: var(--accent);
}
.section { border-top: 2px solid var(--ink); margin-top: 18px; padding-top: 11px; break-inside: avoid; }

.risk-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
.risk-table th {
  text-align: left; font-weight: 700; font-size: 7.6pt; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--stone); border-bottom: 1.5px solid var(--ink); padding: 6px 8px;
}
.risk-table td { border-bottom: 1px solid var(--hairline); padding: 8px; vertical-align: top; }
.risk-table tr { break-inside: avoid; }
.sub { color: var(--stone); font-size: 8.5pt; }
.risk-cell { white-space: nowrap; }
.risk {
  display: inline-block; border: 1px solid; font-size: 8pt; font-weight: 700;
  padding: 2px 8px; border-radius: 999px;
}

.step { display: flex; gap: 10px; margin-bottom: 10px; break-inside: avoid; }
.step-num {
  flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
  background: var(--ink); color: #fff; font-size: 9pt; font-weight: 700;
  display: flex; align-items: center; justify-content: center; margin-top: 1px;
}

.signoff { width: 100%; border-collapse: collapse; margin-top: 8px; }
.signoff th {
  text-align: left; font-weight: 700; font-size: 7.6pt; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--stone); border-bottom: 1.5px solid var(--ink); padding: 6px 8px;
}
.signoff td { border-bottom: 1px solid var(--hairline); height: 30px; padding: 4px 8px; }

.review-box {
  background: #FBF6EA; border: 1px solid var(--accent); border-radius: 8px;
  padding: 10px 14px; font-size: 9pt; margin-top: 14px;
}
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
        <div class="header-kicker">RISK ASSESSMENT &amp; METHOD STATEMENT</div>
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
      <div class="eyebrow">RAMS &middot; ${esc(generatedDate)} &middot; Rev A (draft)</div>
      <h1>${esc(doc.title)}</h1>
      ${metaLine ? `<p class="meta-line">${metaLine}</p>` : ""}
      <div class="badge">${esc(doc.compliance)}</div>
      <p>${esc(doc.scope)}</p>

      <div class="section">
        <h2>Persons at risk</h2>
        <ul>${doc.personsAtRisk.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>

      <div class="section">
        <h2>Risk assessment</h2>
        <table class="risk-table">
          <thead>
            <tr><th>Hazard</th><th>Initial</th><th>Control measures</th><th>Residual</th></tr>
          </thead>
          <tbody>${riskRows}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>Method statement — safe system of work</h2>
        ${methodSteps}
      </div>

      <div class="section">
        <h2>PPE required</h2>
        <ul>${doc.ppe.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>

      <div class="section">
        <h2>Emergency arrangements</h2>
        <ul>${doc.emergencyArrangements.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>

      <div class="section">
        <h2>Review &amp; briefing record</h2>
        <div class="review-box">
          <strong>This is a generated draft.</strong> It must be reviewed, adapted to the actual
          site and task, and signed off by a competent person before work starts. Operatives must
          be briefed and sign below.
        </div>
        <table class="signoff">
          <thead>
            <tr><th>Name</th><th>Company</th><th>Signature</th><th>Date</th></tr>
          </thead>
          <tbody>
            ${Array.from({ length: 6 })
              .map(() => `<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`)
              .join("")}
          </tbody>
        </table>
        <p class="meta-line" style="margin-top:8px">
          Reviewed &amp; approved by (competent person): __________________ &nbsp;&nbsp;
          Position: __________ &nbsp;&nbsp; Date: __________
        </p>
      </div>

      <p class="disclaimer">
        AI-generated draft RAMS. It complements &mdash; and does not replace &mdash; assessment
        by a competent person with knowledge of the actual site, task and workforce.
      </p>
    </td></tr>
  </tbody>
</table>
</body>
</html>`;
}
