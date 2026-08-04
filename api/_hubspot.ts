/**
 * Shared HubSpot helpers for the API routes.
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

export type HsError = Error & { status?: number; detail?: unknown };

export function json(obj: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...extraHeaders },
  });
}

export function env(name: string): string | undefined {
  return (globalThis as any).process?.env?.[name];
}

function safeParse(t: string): any {
  try { return JSON.parse(t); } catch { return { raw: t }; }
}

export async function hs(
  token: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<any> {
  const res = await fetch(`${HUBSPOT}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const parsed = text ? safeParse(text) : {};
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}: ${parsed?.message ?? text}`) as HsError;
    err.status = res.status;
    err.detail = parsed;
    throw err;
  }
  return parsed;
}

export async function findContactByEmail(token: string, email: string): Promise<string | undefined> {
  const res = await hs(token, "POST", "/crm/v3/objects/contacts/search", {
    limit: 1,
    properties: ["email"],
    filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
  });
  return res?.results?.[0]?.id;
}

/**
 * Create or update by email. Never duplicates — a re-submitted form is an update.
 */
export async function upsertContact(
  token: string,
  email: string,
  properties: Record<string, string>,
): Promise<{ id: string; created: boolean }> {
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
export function splitName(full?: string): { firstname?: string; lastname?: string } {
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
export function normaliseEmail(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const e = v.trim().toLowerCase();
  if (e.length > 254 || !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(e)) return undefined;
  return e;
}

/** Trim and cap, so an oversized field cannot be used to bloat a record. */
export function clip(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}
