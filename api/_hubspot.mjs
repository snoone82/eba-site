/**
 * Shared HubSpot helpers for the API routes.
 *
 * Plain JavaScript, and deliberately so. A .ts module here cannot be imported by both
 * consumers: Vercel's edge bundler rejects a "./_hubspot.ts" specifier outright, while
 * Node's native type-stripping (used by the test scripts) requires the explicit extension
 * and rejects the extensionless form Vercel wants. A real .mjs file resolves for both.
 * The api/ directory is not in tsconfig's include, so nothing is lost in type coverage.
 *
 * Underscore-prefixed, so Vercel treats it as a module rather than a route.
 *
 * Used by:
 *   api/kajabi-webhook.ts  — server-to-server, secret-protected (Kajabi → HubSpot)
 *   api/lead.ts            — public, browser-submitted (teb-academy.com forms)
 *
 * Portal 149002234. IDs read from the live portal; see scripts/HUBSPOT_CRM_RUNBOOK.md.
 */

export const HUBSPOT = "https://api.hubapi.com";

export const ACADEMY_PIPELINE = "4018643182";
export const STAGE_CLOSED_WON_ENROLLED = "5818433734";

// Values HubSpot will accept. Anything outside these sets is dropped rather than sent:
// HubSpot rejects the entire write on one unknown enum value, so a single bad field would
// otherwise lose the whole contact.
export const TEBA_SOURCE = new Set([
  "website", "social_media", "warm_network", "referral", "event",
]);
export const PRODUCT_INTEREST = new Set([
  "academy", "rams", "coshh", "o_m", "co_pilot", "mentorship", "enterprise",
]);

/**
 * Hosts and utm_source values that mean "came from social".
 * Keys are matched against utm_source AND against the referrer hostname, so a
 * link works whether or not it was tagged.
 */
const SOCIAL = {
  facebook: "facebook", "facebook.com": "facebook", "m.facebook.com": "facebook",
  "l.facebook.com": "facebook", fb: "facebook",
  instagram: "instagram", "instagram.com": "instagram", "l.instagram.com": "instagram", ig: "instagram",
  linkedin: "linkedin", "linkedin.com": "linkedin", "www.linkedin.com": "linkedin", "lnkd.in": "linkedin",
  youtube: "youtube", "youtube.com": "youtube", "www.youtube.com": "youtube", "youtu.be": "youtube",
  tiktok: "tiktok", "tiktok.com": "tiktok",
  twitter: "twitter", "twitter.com": "twitter", "x.com": "twitter",
};

const SEARCH = new Set([
  "google", "google.com", "www.google.com", "bing", "bing.com",
  "duckduckgo.com", "search.yahoo.com",
]);

/**
 * Work out where a lead came from, from a tagged utm_source first and the
 * referrer as fallback.
 *
 * Returns { source, detail } where `source` is one of the TEBA_SOURCE enum
 * values (safe to write to HubSpot) and `detail` is the specific platform
 * ("instagram", "linkedin") or referring host, for reporting.
 *
 * Untagged direct traffic returns website/"direct" — an honest unknown rather
 * than a guess. Never invent an attribution we don't have.
 */
export function deriveSource(utmSource, utmMedium, referrer) {
  const u = String(utmSource ?? "").trim().toLowerCase();
  if (u) {
    if (SOCIAL[u]) return { source: "social_media", detail: SOCIAL[u] };
    if (SEARCH.has(u)) return { source: "website", detail: `search:${u}` };
    if (String(utmMedium ?? "").toLowerCase() === "social") {
      return { source: "social_media", detail: u };
    }
    if (u === "referral") return { source: "referral", detail: "referral" };
    return { source: "website", detail: u };
  }

  let host = "";
  try { host = new URL(String(referrer ?? "")).hostname.toLowerCase(); } catch { /* no/!valid referrer */ }
  if (!host) return { source: "website", detail: "direct" };
  if (host.endsWith("teb-academy.com")) return { source: "website", detail: "internal" };
  // Match on the bare host so www./m./l. variants don't each need listing.
  const bare = host.replace(/^(www|m|l|lm)\./, "");
  if (SOCIAL[host] || SOCIAL[bare]) {
    return { source: "social_media", detail: SOCIAL[host] ?? SOCIAL[bare] };
  }
  if (SEARCH.has(host) || SEARCH.has(bare)) return { source: "website", detail: `search:${bare}` };
  return { source: "referral", detail: bare };
}

/** Digits, spaces, +, (), - only. Anything else is not a phone number. */
export function normalisePhone(v) {
  if (!v || typeof v !== "string") return undefined;
  const t = v.trim().slice(0, 32);
  return /^[\d\s+()\-.]{6,32}$/.test(t) ? t : undefined;
}

export function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...extraHeaders },
  });
}

export function env(name) {
  return globalThis.process?.env?.[name];
}

function safeParse(t) {
  try { return JSON.parse(t); } catch { return { raw: t }; }
}

/** Throws on a non-2xx, with `.status` and `.detail` attached for the caller to branch on. */
export async function hs(token, method, path, body) {
  const res = await fetch(`${HUBSPOT}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const parsed = text ? safeParse(text) : {};
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}: ${parsed?.message ?? text}`);
    err.status = res.status;
    err.detail = parsed;
    throw err;
  }
  return parsed;
}

export async function findContactByEmail(token, email) {
  const res = await hs(token, "POST", "/crm/v3/objects/contacts/search", {
    limit: 1,
    properties: ["email"],
    filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
  });
  return res?.results?.[0]?.id;
}

/** Create or update by email. Never duplicates — a re-submitted form is an update. */
export async function upsertContact(token, email, properties) {
  const existing = await findContactByEmail(token, email);
  if (existing) {
    if (Object.keys(properties).length) {
      await hs(token, "PATCH", `/crm/v3/objects/contacts/${existing}`, { properties });
    }
    return { id: existing, created: false };
  }
  const made = await hs(token, "POST", "/crm/v3/objects/contacts", {
    properties: { email, ...properties },
  });
  return { id: made.id, created: true };
}

/** Split "Ste Noone" into first/last without inventing a surname for one-word names. */
export function splitName(full) {
  if (!full || typeof full !== "string") return {};
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstname: parts[0] };
  return { firstname: parts.slice(0, -1).join(" "), lastname: parts[parts.length - 1] };
}

/**
 * Trim, lowercase, and validate in one step — returns undefined if unusable.
 *
 * Normalising *before* validating matters: a visitor who types a trailing space, or whose
 * browser does not trim the field, would otherwise be turned away by a form that looks
 * broken to them. The pattern is deliberately permissive; the goal is to reject junk, not
 * to police which addresses are valid.
 */
export function normaliseEmail(v) {
  if (typeof v !== "string") return undefined;
  const e = v.trim().toLowerCase();
  if (e.length > 254 || !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(e)) return undefined;
  return e;
}

/** Trim and cap, so an oversized field cannot be used to bloat a record. */
export function clip(v, max) {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}
