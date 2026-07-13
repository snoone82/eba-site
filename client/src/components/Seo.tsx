/**
 * EBA — <Seo> component
 * Per-route <title>, <meta name="description">, canonical URL, Open Graph + Twitter
 * cards and optional JSON-LD structured data, rendered into <head> via
 * react-helmet-async. One <Seo> per page sets a unique title/description.
 *
 * Note: pass plain "&" in titles/descriptions — Helmet encodes it. Do NOT pass
 * "&amp;" or it will double-encode and render literally on screen.
 */

import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://teb-academy.com";
export const SITE_NAME = "The Engineering Business Academy";
// On-brand 1200×630 og-image lives at client/public/og-image.png (served at /og-image.png).
// This is an absolute teb-academy.com URL, so social link previews resolve once the custom
// domain is connected. TODO(eba): swap in a richer photo/hero version if desired.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
}

/** Per-route metadata — verbatim from the EBA SEO spec. */
export const PAGE_SEO = {
  home: {
    title: "The Engineering Business Academy — For Engineering Contractors",
    description:
      "Business growth for engineering services contractors. 101 lessons, AI tools and mentorship from a founder who built and rebuilt a £70m engineering group.",
    path: "/",
  },
  academy: {
    title: "The Academy — 101 Lessons for Engineering Business Owners",
    description:
      "A 10-module business programme for engineering contractors: leadership, culture, teams, commercial control, cash and growth. Built from real operational experience, not theory.",
    path: "/academy",
  },
  aiTools: {
    title: "AI Tools for Engineering Contractors — O&M, RAMS & Compliance",
    description:
      "AI tools built for engineering contractors: O&M manuals in 24 hours, RAMS in minutes, and a compliance chatbot trained on your firm's safety knowledge. Cut paperwork, not corners.",
    path: "/ai-tools",
  },
  omManual: {
    title: "O&M Manual Compiler — Client-Ready Manuals in 24 Hours",
    description:
      "Upload project data and generate a fully formatted, CDM-structured O&M manual in a fraction of the time. Built for engineering services contractors.",
    path: "/ai-tools/om-manual",
  },
  complianceChatbot: {
    title: "Compliance Co-Pilot — Your Safety Knowledge On Demand",
    description:
      "An AI assistant trained on your company's HSEQ documentation. Your engineers ask, it answers instantly and accurately — in your firm's own voice.",
    path: "/ai-tools/compliance-chatbot",
  },
  ourStory: {
    title: "Our Story — Mark Poulton & The Engineering Business Academy",
    description:
      "Why EBA exists: founder Mark Poulton spent 25 years building, rebuilding and running M&E contracting businesses — the operational experience behind the Academy.",
    path: "/our-story",
  },
  mentorship: {
    title: "Mentorship for Engineering Business Owners | EBA",
    description:
      "Group and 1:1 mentorship from senior operators who have run engineering businesses — with strictly limited founder sessions led by Mark Poulton. Application-only.",
    path: "/mentorship",
  },
  documents: {
    title: "Engineering Document Library — 380 Ready-to-Use Templates",
    description:
      "25 years of M&E practice distilled into a deployable document library: templates, forms, checklists and procedures in Word and PDF. Included with Academy membership.",
    path: "/documents",
  },
  pricing: {
    title: "Pricing — Founding Cohort Access | EBA",
    description:
      "Founding members lock in lifetime access at the founding price before it rises. See what's included across the Academy, AI tools, mentorship and document library.",
    path: "/pricing",
  },
  enterprise: {
    title: "Enterprise — Branded Compliance Assistant, Managed | EBA",
    description:
      "A white-label compliance chatbot trained on your company's documents and deployed as a fully managed, branded service. A fraction of agency build cost.",
    path: "/enterprise",
  },
  contact: {
    title: "Contact The Engineering Business Academy",
    description:
      "Talk to EBA about the founding cohort, the AI tools, mentorship or enterprise deployment for engineering contractors.",
    path: "/contact",
  },
  faq: {
    title: "FAQ — The Engineering Business Academy",
    description:
      "Who the Academy is for, what's included, how long it takes, the founding cohort, AI tool access and the refund policy — answered.",
    path: "/faq",
  },
  privacy: {
    title: "Privacy Policy | EBA",
    description:
      "How The Engineering Business Academy collects, uses and protects your data. UK GDPR compliant.",
    path: "/privacy-policy",
  },
  terms: {
    title: "Terms & Conditions | EBA",
    description:
      "The terms governing use of The Engineering Business Academy website, programme, AI tools and document library.",
    path: "/terms",
  },
} satisfies Record<string, SeoMeta>;

/** JSON-LD — Organization (home). */
export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "EBA",
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  description:
    "Business education and AI tools built for engineering services contractors — helping engineers grow into business owners.",
  founder: { "@type": "Person", name: "Mark Poulton" },
  areaServed: "GB",
  knowsAbout: [
    "M&E contracting",
    "Business growth for engineering contractors",
    "Pricing and cash flow",
    "Construction compliance",
    "Decarbonisation and net zero retrofit",
  ],
  sameAs: [
    "https://www.linkedin.com/company/engineering-business-academy",
    "https://www.youtube.com/@engineeringbusinessacademy",
  ],
};

/**
 * JSON-LD — Course (academy).
 * Offers block intentionally omitted until a real founding price is confirmed —
 * schema with a placeholder price is worse than schema with no offer block.
 * TODO(eba): once FOUNDING_PRICE is confirmed, add an "offers" block here.
 */
export const COURSE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "The Engineering Business Academy — Engineering Business Programme",
  description:
    "A 10-module, 101-lesson business programme for engineering services contractors covering leadership, culture, teams, commercial control, cash, risk and growth.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  educationalCredentialAwarded: "Certificate of Completion",
  inLanguage: "en-GB",
  courseMode: "online",
  about: [
    "Engineering business growth",
    "Leadership and culture",
    "Building and leading teams",
    "Commercial controls",
    "Financial control and cash flow",
    "Risk, protection and governance",
  ],
};

interface SeoProps extends SeoMeta {
  image?: string;
  jsonLd?: object | object[];
  /** Render <meta name="robots" content="noindex"> (404 etc.). */
  noIndex?: boolean;
}

export function Seo({ title, description, path, image = DEFAULT_OG_IMAGE, jsonLd, noIndex }: SeoProps) {
  const canonical = `${SITE_URL}${path}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    // defer={false} — apply tags synchronously so react-snap's background tabs
    // (where requestAnimationFrame never fires) still get per-route titles.
    <Helmet prioritizeSeoTags defer={false}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex" />}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
