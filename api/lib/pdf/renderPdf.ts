/**
 * Headless-Chromium PDF renderer shared by the whole tool suite.
 *
 * Critical Chromium gotcha: `--print-to-pdf` mis-positions `position:fixed`
 * header/footers. The HTML templates use a `<table>` with `<thead>`/`<tfoot>`
 * instead — Chromium repeats those on every page and reserves their space,
 * reliably preventing body text overlapping the footer.
 */
import puppeteer, { type Browser } from "puppeteer-core";

async function resolveLaunchOptions() {
  // Local/dev override — point at a real Chromium binary (e.g. Playwright's).
  const localExecutable = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (localExecutable) {
    return {
      executablePath: localExecutable,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    };
  }

  // Production (Vercel serverless / AWS Lambda) — lambda-compatible Chromium.
  const chromium = (await import("@sparticuz/chromium")).default;
  return {
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: true,
  };
}

/** Render an HTML string to an A4 PDF buffer via headless Chromium. */
export async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const launchOptions = await resolveLaunchOptions();
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    return Buffer.from(pdf);
  } finally {
    if (browser) await browser.close();
  }
}
