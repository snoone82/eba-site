import type { ToolboxTalk } from "../schemas/toolboxTalk.js";
import { EBA_PDF_BRAND, getEmbeddedFontFaceCss, type BrandConfig } from "./brand.js";

/** Escape generated text before injecting into the HTML template (prevents HTML injection in the PDF). */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface ToolboxTalkPdfMeta {
  site?: string;
  trade?: string;
  /** Optional member/company overlay (paid-tier enhancement — unused by the free tool). */
  companyName?: string;
}

function renderLogo(brand: BrandConfig): string {
  return `
<div class="logo-block">
  <div class="wordmark">${esc(brand.wordmark)}</div>
  <div class="logo-rule"></div>
</div>`;
}

function renderSection(section: ToolboxTalk["sections"][number]): string {
  const heading = section.heading?.trim()
    ? `<h2>${esc(section.heading)}</h2>`
    : "";

  let body = "";
  if (section.type === "bullets" && Array.isArray(section.items) && section.items.length) {
    body = `<ul>${section.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  } else if (section.text) {
    body = `<p>${esc(section.text)}</p>`;
  }

  return `<div class="section">${heading}${body}</div>`;
}

function renderAttendanceRows(count: number): string {
  return Array.from({ length: count })
    .map(
      () =>
        `<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`,
    )
    .join("");
}

export function renderToolboxTalkHtml(
  talk: ToolboxTalk,
  meta: ToolboxTalkPdfMeta = {},
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
  font-size: 10.6pt;
  line-height: 1.5;
  background: var(--paper);
  margin: 0;
}
.sheet { width: 100%; border-collapse: collapse; }
.head-cell { padding-bottom: 9mm; }
.foot-cell { padding-top: 5mm; }

.logo-block { display: flex; flex-direction: column; gap: 4px; }
.wordmark {
  font-weight: 700;
  font-size: 9.5pt;
  letter-spacing: 0.08em;
  color: var(--ink);
}
.logo-rule { height: 3px; width: 64px; background: var(--accent); }

.header-row { display: flex; justify-content: space-between; align-items: flex-start; }
.header-kicker {
  font-size: 8.5pt; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.14em; color: var(--stone);
}

.eyebrow {
  font-size: 8.5pt; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.14em; color: var(--stone); margin: 0 0 6px;
}
h1 {
  font-size: 23pt; font-weight: 800; letter-spacing: -0.02em;
  line-height: 1.08; margin: 5px 0 10px;
}
.meta-line { font-size: 9pt; color: var(--stone); margin: 0 0 14px; }
.badge {
  display: inline-block; border: 1px solid var(--accent); color: var(--accent);
  font-size: 8pt; font-weight: 600; padding: 3px 9px; border-radius: 999px;
  margin-bottom: 16px;
}
.intro { font-size: 11pt; margin: 0 0 8px; }

h2 { font-size: 12pt; font-weight: 700; margin: 15px 0 6px; break-after: avoid; }
ul { margin: 0 0 11px; padding: 0; list-style: none; }
li { position: relative; padding-left: 16px; margin-bottom: 5px; }
li:before {
  content: ""; position: absolute; left: 2px; top: 0.55em;
  width: 5px; height: 5px; border-radius: 1.5px; background: var(--accent);
}
p { margin: 0 0 10px; }
.section { border-top: 2px solid var(--ink); margin-top: 20px; padding-top: 12px; break-inside: avoid; }

.qa {
  background: #FAFAF8; border: 1px solid var(--hairline); border-radius: 8px;
  padding: 12px 16px 12px 20px;
}
.qa ol { margin: 0; padding-left: 18px; }
.qa li { padding-left: 4px; }
.qa li:before { content: none; }

.att { width: 100%; border-collapse: collapse; margin-top: 8px; }
.att th {
  text-align: left; font-weight: 700; font-size: 7.6pt; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--stone); border-bottom: 1.5px solid var(--ink);
  padding: 6px 8px;
}
.att td { border-bottom: 1px solid var(--hairline); height: 30px; padding: 4px 8px; }

.delivery-line { font-size: 9pt; color: var(--stone); margin-top: 10px; }

.disclaimer {
  font-size: 8pt; color: var(--stone); border-top: 1px solid var(--hairline);
  padding-top: 8px; margin-top: 16px;
}
.footer-row { display: flex; justify-content: space-between; font-size: 8pt; color: var(--stone); }
</style>
</head>
<body>
<table class="sheet">
  <thead>
    <tr><td class="head-cell">
      <div class="header-row">
        ${renderLogo(brand)}
        <div class="header-kicker">TOOLBOX TALK</div>
      </div>
    </td></tr>
  </thead>
  <tfoot>
    <tr><td class="foot-cell">
      <div class="footer-row">
        <span>eba.academy</span>
        <span>${esc(talk.compliance)}</span>
        <span>${esc(brand.tagline)}</span>
      </div>
    </td></tr>
  </tfoot>
  <tbody>
    <tr><td>
      <div class="eyebrow">Toolbox talk &middot; ${esc(generatedDate)}</div>
      <h1>${esc(talk.title)}</h1>
      ${metaLine ? `<p class="meta-line">${metaLine}</p>` : ""}
      <div class="badge">${esc(talk.compliance)}</div>
      <p class="intro">${esc(talk.intro)}</p>

      ${talk.sections.map(renderSection).join("")}

      <div class="section">
        <h2>Validation &mdash; check understanding</h2>
        <div class="qa">
          <ol>
            ${talk.validationQuestions.map((q) => `<li>${esc(q)}</li>`).join("")}
          </ol>
        </div>
      </div>

      <div class="section">
        <h2>Attendance record</h2>
        <table class="att">
          <thead>
            <tr><th>Name</th><th>Company</th><th>Signature</th><th>Date</th></tr>
          </thead>
          <tbody>
            ${renderAttendanceRows(8)}
          </tbody>
        </table>
        <p class="delivery-line">Delivered by: __________________ &nbsp;&nbsp; Date: __________ &nbsp;&nbsp; Site: __________________</p>
      </div>

      <p class="disclaimer">
        This toolbox talk complements &mdash; it does not replace &mdash; formal H&amp;S training.
        AI-generated; review before delivering on site.
      </p>
    </td></tr>
  </tbody>
</table>
</body>
</html>`;
}
