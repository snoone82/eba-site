/**
 * Public routes prerendered into dist/. `indexable` routes are the only ones
 * written to sitemap.xml. Member tools are prerendered so a direct visit
 * returns 200, but they render noindex and stay out of the sitemap.
 *
 * Keep this list in step with the <Route path> entries in client/src/App.tsx.
 * scripts/prerender.mjs fails the build if a route is missing here and is not
 * a redirect in vercel.json.
 */
export const SITE_URL = "https://teb-academy.com";

export const routes = [
  { path: "/", indexable: true, changefreq: "weekly", priority: "1.0", sources: ["client/src/pages/HomePage.tsx"] },
  { path: "/academy", indexable: true, changefreq: "weekly", priority: "0.9", sources: ["client/src/pages/AcademyPage.tsx"] },
  { path: "/ai-tools", indexable: true, changefreq: "weekly", priority: "0.9", sources: ["client/src/pages/AIToolsPage.tsx"] },
  { path: "/ai-tools/om-manual", indexable: true, changefreq: "monthly", priority: "0.7", sources: ["client/src/pages/AIToolsPage.tsx"] },
  { path: "/ai-tools/compliance-chatbot", indexable: true, changefreq: "monthly", priority: "0.7", sources: ["client/src/pages/AIToolsPage.tsx"] },
  { path: "/toolbox-talk", indexable: true, changefreq: "monthly", priority: "0.6", sources: ["client/src/pages/ToolboxTalkPage.tsx"] },
  { path: "/our-story", indexable: true, changefreq: "monthly", priority: "0.7", sources: ["client/src/pages/SupportingPages.tsx"] },
  { path: "/mentorship", indexable: true, changefreq: "monthly", priority: "0.7", sources: ["client/src/pages/PlaceholderPages.tsx"] },
  { path: "/documents", indexable: true, changefreq: "monthly", priority: "0.7", sources: ["client/src/pages/SupportingPages.tsx"] },
  { path: "/pricing", indexable: true, changefreq: "monthly", priority: "0.8", sources: ["client/src/pages/PlaceholderPages.tsx"] },
  { path: "/enterprise", indexable: true, changefreq: "monthly", priority: "0.7", sources: ["client/src/pages/PlaceholderPages.tsx"] },
  // Same page as /enterprise; the component canonical points at /enterprise.
  { path: "/ai-for-companies", indexable: false, sources: ["client/src/pages/PlaceholderPages.tsx"] },
  { path: "/contact", indexable: true, changefreq: "monthly", priority: "0.6", sources: ["client/src/pages/SupportingPages.tsx"] },
  { path: "/faq", indexable: true, changefreq: "monthly", priority: "0.6", sources: ["client/src/pages/PlaceholderPages.tsx"] },
  { path: "/automation", indexable: true, changefreq: "monthly", priority: "0.6", sources: ["client/src/pages/AutomationPage.tsx"] },
  { path: "/privacy-policy", indexable: true, changefreq: "yearly", priority: "0.3", sources: ["client/src/pages/LegalPages.tsx"] },
  { path: "/terms", indexable: true, changefreq: "yearly", priority: "0.3", sources: ["client/src/pages/LegalPages.tsx"] },
  // Subscriber tools: real pages, noindex, not in the sitemap.
  { path: "/rams-generator", indexable: false, sources: ["client/src/pages/RamsGeneratorPage.tsx"] },
  { path: "/coshh-generator", indexable: false, sources: ["client/src/pages/CoshhGeneratorPage.tsx"] },
  { path: "/documents-library", indexable: false, sources: ["client/src/pages/DocumentsLibraryPage.tsx"] },
  { path: "/404", indexable: false, sources: ["client/src/pages/NotFound.tsx"] },
];
