/**
 * After `vite build`, render each route to static HTML so the first response
 * already contains the title, description, canonical, Open Graph / Twitter
 * tags, JSON-LD and the page body. No browser required — this is React
 * renderToString, which is what Vercel's build image can run reliably.
 *
 * Unknown URLs are not rewritten to index.html (see vercel.json). Vercel
 * serves dist/404.html with status 404 when nothing matches.
 */
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { routes, SITE_URL } from "./site-routes.mjs";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const ssrOut = path.join(root, "dist-ssr");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function appPaths() {
  const src = read("client/src/App.tsx");
  return [...src.matchAll(/path=\{"([^"]+)"\}/g)].map((m) => m[1]);
}

function redirectSources() {
  const vercel = JSON.parse(read("vercel.json"));
  return new Set(
    (vercel.redirects ?? [])
      .map((r) => r.source)
      .filter((s) => s.startsWith("/") && !s.includes(":")),
  );
}

function assertRoutesCovered() {
  const known = new Set(routes.map((r) => r.path));
  const redirects = redirectSources();
  const missing = appPaths().filter((p) => !known.has(p) && !redirects.has(p));
  if (missing.length) {
    throw new Error(
      `These App.tsx routes are neither prerendered nor redirected: ${missing.join(", ")}`,
    );
  }
}

function lastmod(sources) {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...sources], {
      cwd: root,
      encoding: "utf8",
    }).trim();
    if (iso) return iso.slice(0, 10);
  } catch {
    /* shallow clone or missing git — fall through */
  }
  try {
    const head = execFileSync("git", ["log", "-1", "--format=%cI"], {
      cwd: root,
      encoding: "utf8",
    }).trim();
    if (head) return head.slice(0, 10);
  } catch {
    /* ignore */
  }
  return new Date().toISOString().slice(0, 10);
}

function inject(template, helmet, body) {
  const title = helmet.title.toString();
  if (!title.includes("<title")) {
    throw new Error("render produced no <title>");
  }
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, title);
  // prioritizeSeoTags puts description, canonical, OG image and JSON-LD in `priority`.
  const head = [
    helmet.priority.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ]
    .filter(Boolean)
    .join("\n    ");
  html = html.replace("</head>", `    ${head}\n  </head>`);
  if (!html.includes('<div id="root">')) {
    throw new Error("built index.html has no #root");
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

function canonicalOf(html) {
  const m =
    html.match(/<link[^>]*rel="canonical"[^>]*>/i) ||
    html.match(/<link[^>]*rel='canonical'[^>]*>/i);
  if (!m) return "";
  const href = m[0].match(/href="([^"]+)"/) || m[0].match(/href='([^']+)'/);
  return href ? href[1] : "";
}

function titleOf(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
}

function writeRoute(routePath, html) {
  if (routePath === "/") {
    fs.writeFileSync(path.join(dist, "index.html"), html);
    return;
  }
  if (routePath === "/404") {
    fs.writeFileSync(path.join(dist, "404.html"), html);
    const dir = path.join(dist, "404");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
    return;
  }
  const dir = path.join(dist, routePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

function writeSitemap(entries) {
  const urls = entries
    .map(
      (e) =>
        `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), xml);
  fs.writeFileSync(path.join(root, "client/public/sitemap.xml"), xml);
}

assertRoutesCovered();

await build({
  configFile: path.join(root, "vite.config.ts"),
  // Bundle dependencies into the SSR file. Several (react-helmet-async among
  // them) are CommonJS and Node cannot import their named exports otherwise.
  ssr: { noExternal: true },
  build: {
    ssr: "src/entry-server.tsx",
    outDir: ssrOut,
    emptyOutDir: true,
  },
  logLevel: "warn",
});

const entry = path.join(ssrOut, "entry-server.js");
const { render } = await import(pathToFileURL(entry).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (template.includes("data-rh=")) {
  throw new Error("dist/index.html is already prerendered. Run `npm run build` so Vite writes a clean shell first.");
}

const titles = new Map();
const sitemap = [];

for (const route of routes) {
  const { html: body, helmet } = render(route.path);
  const page = inject(template, helmet, body);
  const title = titleOf(page);
  const canonical = canonicalOf(page);
  const selfCanonical = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
  // /ai-for-companies renders the enterprise page, whose canonical is /enterprise.
  const expectedCanonical = route.path === "/ai-for-companies" ? `${SITE_URL}/enterprise` : selfCanonical;
  const noindex = /noindex/i.test(page);
  const hasH1 = /<h1[\s>]/i.test(body);
  const hasOg = /property="og:title"/.test(page) && /property="og:description"/.test(page) && /property="og:image"/.test(page);
  const hasTwitter = /name="twitter:card"/.test(page);
  const hasDescription = /name="description"/.test(page);

  if (!title || !hasH1 || body.length < 1500) {
    throw new Error(`${route.path} prerender is missing a title or main content (${body.length} bytes)`);
  }
  if (!hasOg || !hasTwitter || !hasDescription || canonical !== expectedCanonical) {
    throw new Error(
      `${route.path} head tags incomplete (canonical=${canonical || "missing"}, expected ${expectedCanonical})`,
    );
  }
  if (route.indexable && noindex) {
    throw new Error(`${route.path} is marked indexable but rendered noindex`);
  }
  if (!route.indexable && route.path !== "/ai-for-companies" && !noindex) {
    throw new Error(`${route.path} should be noindex`);
  }
  if (titles.has(title) && route.indexable && titles.get(title).indexable) {
    throw new Error(`Duplicate title on ${route.path} and ${titles.get(title).path}: ${title}`);
  }
  titles.set(title, route);

  writeRoute(route.path, page);

  if (route.indexable) {
    sitemap.push({
      loc: expectedCanonical,
      lastmod: lastmod(route.sources),
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }
  const flag = route.indexable ? "" : noindex ? " [noindex]" : " [not in sitemap]";
  console.log(`prerendered ${route.path} (${page.length} bytes)${flag}`);
}

writeSitemap(sitemap);
console.log(`sitemap.xml: ${sitemap.length} indexable URLs`);
