/**
 * /api/kajabi-webhook — one-way Kajabi → HubSpot sync.
 *
 * Replaces the two Zaps in TEBA_HUBSPOT_CRM_SPEC §6. Kajabi POSTs here when a
 * contact is created or a purchase completes; this writes the corresponding
 * HubSpot record.
 *
 * One-way only, Kajabi → HubSpot. Never the reverse: two-way sync between
 * systems with different data models produces duplicate contacts and phantom
 * customers, per spec §6.
 *
 * Environment (Vercel project settings — never commit these):
 *   HUBSPOT_PRIVATE_APP_TOKEN   the same pat-eu1-… token the provisioner uses,
 *                               plus the two record-write scopes listed below
 *   KAJABI_WEBHOOK_SECRET       any long random string; Kajabi must send it back
 *
 * Required scopes beyond the provisioner's six — record writes are separate from
 * schema writes, so this will 403 until they are added:
 *   crm.objects.contacts.write, crm.objects.deals.write
 *
 * Health check, writes nothing:
 *   GET /api/kajabi-webhook?secret=…    reports config and scope readiness
 *
 * See scripts/HUBSPOT_CRM_RUNBOOK.md §5 and scripts/ZAPIER_SETUP.md.
 */
export const config = { runtime: "edge" };

const HUBSPOT = "https://api.hubapi.com";

// Live IDs, read from portal 149002234. Academy pipeline; a purchase is by
// definition already won, so it lands directly in the closed-won stage.
const ACADEMY_PIPELINE = "4018643182";
const STAGE_CLOSED_WON_ENROLLED = "5818433734";

// Enumeration values HubSpot will accept. Anything not in these sets is dropped
// rather than sent: HubSpot rejects the whole write on an unknown enum value, so
// one bad field would otherwise lose the entire contact.
const TEBA_SOURCE = new Set([
  "website", "social_media", "warm_network", "referral", "event",
]);
const PRODUCT_INTEREST = new Set([
  "academy", "rams", "coshh", "o_m", "co_pilot", "mentorship", "enterprise",
]);

// Kajabi tag → HubSpot value. Only mappings that are certain live here.
// "Interest · AI Tools" is deliberately absent: HubSpot splits tools into RAMS,
// COSHH, O&M and Co-Pilot, so collapsing them loses which tool a lead wants.
// An unmapped tag leaves the property empty, which is a known unknown rather
// than a wrong answer.
const TAG_MAP: Record<string, { prop: string; value: string }> = {
  "source · website": { prop: "teba_source", value: "website" },
  "source · social media": { prop: "teba_source", value: "social_media" },
  "source · warm network": { prop: "teba_source", value: "warm_network" },
  "source · referral": { prop: "teba_source", value: "referral" },
  "interest · academy": { prop: "product_interest", value: "academy" },
  "interest · enterprise / in-house training": { prop: "product_interest", value: "enterprise" },
};

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function env(name: string): string | undefined {
  return (globalThis as any).process?.env?.[name];
}

type HsError = Error & { status?: number; detail?: unknown };

async function hs(
  token: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<any> {
  const res = await fetch(`${HUBSPOT}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const parsed = text ? safeParse(text) : {};
  if (!res.ok) {
    const err = new Error(
      `${method} ${path} → ${res.status}: ${parsed?.message ?? text}`,
    ) as HsError;
    err.status = res.status;
    err.detail = parsed;
    throw err;
  }
  return parsed;
}

function safeParse(t: string): any {
  try { return JSON.parse(t); } catch { return { raw: t }; }
}

/**
 * Kajabi does not publish one stable webhook envelope, and the shape differs
 * between form submissions, contact events and purchase events. Rather than
 * assume, pull the first plausible value from a list of candidate paths — and
 * report what was actually received when nothing matches, so a mismatch is
 * diagnosable from the response instead of silently writing a blank contact.
 */
function pick(payload: any, paths: string[]): any {
  for (const p of paths) {
    let cur = payload;
    for (const seg of p.split(".")) {
      if (cur == null || typeof cur !== "object") { cur = undefined; break; }
      cur = cur[seg];
    }
    if (cur !== undefined && cur !== null && cur !== "") return cur;
  }
  return undefined;
}

const EMAIL_PATHS = [
  "email", "contact.email", "member.email", "data.email",
  "payload.email", "customer.email", "contact_email",
];
const ID_PATHS = [
  "id", "contact_id", "contact.id", "member.id", "member_id",
  "data.id", "payload.id", "customer.id",
];
const NAME_PATHS = ["name", "full_name", "contact.name", "member.name", "data.name"];
const FIRST_PATHS = ["first_name", "contact.first_name", "member.first_name"];
const LAST_PATHS = ["last_name", "contact.last_name", "member.last_name"];
const TAG_PATHS = ["tags", "contact.tags", "member.tags", "data.tags"];
const AMOUNT_PATHS = [
  "amount", "total", "price", "offer.price", "purchase.amount",
  "data.amount", "amount_in_cents",
];
const OFFER_PATHS = ["offer_title", "offer.title", "offer_name", "product_title", "data.offer_title"];

/** Split "Ste Noone" into first/last without inventing a surname for one-word names. */
function splitName(full?: string): { firstname?: string; lastname?: string } {
  if (!full || typeof full !== "string") return {};
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstname: parts[0] };
  return { firstname: parts.slice(0, -1).join(" "), lastname: parts[parts.length - 1] };
}

/** "£999.00 GBP" / "99900" (cents) / 999 → 999. Returns undefined if unusable. */
function parseAmount(raw: unknown, isCents: boolean): number | undefined {
  if (raw === undefined || raw === null) return undefined;
  const n = typeof raw === "number"
    ? raw
    : Number(String(raw).replace(/[^0-9.\-]/g, ""));
  if (!Number.isFinite(n)) return undefined;
  return isCents ? n / 100 : n;
}

function propsFromTags(tags: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!Array.isArray(tags)) return out;
  const interests: string[] = [];
  for (const t of tags) {
    const name = typeof t === "string" ? t : t?.name;
    if (typeof name !== "string") continue;
    const hit = TAG_MAP[name.trim().toLowerCase()];
    if (!hit) continue;
    if (hit.prop === "product_interest") {
      if (PRODUCT_INTEREST.has(hit.value)) interests.push(hit.value);
    } else if (hit.prop === "teba_source" && TEBA_SOURCE.has(hit.value)) {
      out.teba_source = hit.value;
    }
  }
  // product_interest is a multi-checkbox: HubSpot takes semicolon-separated values.
  if (interests.length) out.product_interest = [...new Set(interests)].join(";");
  return out;
}

async function findContactByEmail(token: string, email: string): Promise<string | undefined> {
  const res = await hs(token, "POST", "/crm/v3/objects/contacts/search", {
    limit: 1,
    properties: ["email"],
    filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
  });
  return res?.results?.[0]?.id;
}

async function upsertContact(
  token: string,
  email: string,
  properties: Record<string, string>,
): Promise<{ id: string; created: boolean }> {
  const existing = await findContactByEmail(token, email);
  if (existing) {
    await hs(token, "PATCH", `/crm/v3/objects/contacts/${existing}`, { properties });
    return { id: existing, created: false };
  }
  const made = await hs(token, "POST", "/crm/v3/objects/contacts", {
    properties: { email, ...properties },
  });
  return { id: made.id, created: true };
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const token = env("HUBSPOT_PRIVATE_APP_TOKEN");
  const secret = env("KAJABI_WEBHOOK_SECRET");

  if (!token || !secret) {
    return json({
      error: "not_configured",
      missing: [
        !token && "HUBSPOT_PRIVATE_APP_TOKEN",
        !secret && "KAJABI_WEBHOOK_SECRET",
      ].filter(Boolean),
    }, 501);
  }

  // Kajabi does not sign its webhooks, so the shared secret is the only thing
  // standing between this endpoint and anyone who guesses the URL. Accept it in
  // a header or the query string — Kajabi's form webhook field takes a bare URL
  // with no header control, so the query form has to work.
  const supplied = req.headers.get("x-teba-secret") ?? url.searchParams.get("secret");
  if (supplied !== secret) return json({ error: "unauthorised" }, 401);

  // ── Health check ───────────────────────────────────────────────────────────
  // Confirms the token carries the record-write scopes before a real event
  // depends on it. Reads only; writes nothing.
  if (req.method === "GET") {
    const checks: Record<string, string> = {};
    for (const [label, path] of [
      ["contacts_read", "/crm/v3/objects/contacts?limit=1"],
      ["deals_read", "/crm/v3/objects/deals?limit=1"],
      ["pipeline", `/crm/v3/pipelines/deals/${ACADEMY_PIPELINE}`],
    ] as const) {
      try { await hs(token, "GET", path); checks[label] = "ok"; }
      catch (e) { checks[label] = (e as HsError).status === 403 ? "403 missing scope" : String((e as Error).message); }
    }
    return json({
      ok: Object.values(checks).every((v) => v === "ok"),
      checks,
      note: "Record writes need crm.objects.contacts.write and crm.objects.deals.write. "
        + "Those cannot be verified without writing, so a green check here does not prove "
        + "write access — send a real test event to confirm.",
    });
  }

  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let payload: any;
  try { payload = await req.json(); } catch { return json({ error: "bad_request" }, 400); }

  const email = pick(payload, EMAIL_PATHS);
  if (typeof email !== "string" || !email.includes("@")) {
    // Echo the keys received. Without this a shape mismatch looks like silence,
    // which is the failure mode this endpoint exists to avoid.
    return json({
      error: "no_email_in_payload",
      received_keys: payload && typeof payload === "object" ? Object.keys(payload) : typeof payload,
      hint: "Add the matching path to EMAIL_PATHS in api/kajabi-webhook.ts",
    }, 422);
  }

  // ?event=purchase, or inferred from an amount being present.
  const declared = url.searchParams.get("event");
  const rawAmount = pick(payload, AMOUNT_PATHS);
  const isPurchase = declared === "purchase" || (declared !== "contact" && rawAmount !== undefined);

  try {
    const kajabiId = pick(payload, ID_PATHS);
    const nameParts = splitName(pick(payload, NAME_PATHS));

    const properties: Record<string, string> = {
      ...propsFromTags(pick(payload, TAG_PATHS)),
    };
    if (kajabiId !== undefined) properties.kajabi_contact_id = String(kajabiId);

    const first = pick(payload, FIRST_PATHS) ?? nameParts.firstname;
    const last = pick(payload, LAST_PATHS) ?? nameParts.lastname;
    if (first) properties.firstname = String(first);
    if (last) properties.lastname = String(last);

    // Only set a lifecycle floor on first contact. Sending "lead" on every event
    // would drag an existing Customer back down the ladder.
    const contact = await upsertContact(token, email, properties);
    if (contact.created && !isPurchase) {
      await hs(token, "PATCH", `/crm/v3/objects/contacts/${contact.id}`, {
        properties: { lifecyclestage: "lead" },
      });
    }

    if (!isPurchase) {
      return json({ ok: true, event: "contact", contact_id: contact.id, created: contact.created,
        properties_written: Object.keys(properties) });
    }

    const amount = parseAmount(
      rawAmount,
      typeof rawAmount === "number" ? false : String(pick(payload, ["amount_in_cents"]) ?? "") !== "",
    );
    const offer = pick(payload, OFFER_PATHS);
    const dealName = [offer, first ? `${first}${last ? ` ${last}` : ""}` : email]
      .filter(Boolean).join(" — ");

    const dealProps: Record<string, string> = {
      dealname: dealName || `Kajabi purchase — ${email}`,
      pipeline: ACADEMY_PIPELINE,
      dealstage: STAGE_CLOSED_WON_ENROLLED,
    };
    if (amount !== undefined) dealProps.amount = String(amount);

    const deal = await hs(token, "POST", "/crm/v3/objects/deals", { properties: dealProps });

    // A deal with no contact on it is invisible from the contact record and does
    // not roll up to the company, which defeats spec §3.
    await hs(
      token, "PUT",
      `/crm/v4/objects/deals/${deal.id}/associations/default/contacts/${contact.id}`,
    );

    // Lifecycle → Customer is handled by HubSpot's "set to Customer when a deal
    // is won" setting. Set it here too, so the sync is correct even if that
    // toggle is off.
    await hs(token, "PATCH", `/crm/v3/objects/contacts/${contact.id}`, {
      properties: { lifecyclestage: "customer" },
    });

    return json({
      ok: true, event: "purchase", contact_id: contact.id, deal_id: deal.id,
      amount: amount ?? null, amount_parsed_from: rawAmount ?? null,
    });
  } catch (e) {
    const err = e as HsError;
    const scopeIssue = err.status === 403;
    return json({
      error: scopeIssue ? "missing_scope" : "hubspot_error",
      message: err.message,
      hint: scopeIssue
        ? "Add crm.objects.contacts.write and crm.objects.deals.write to the private app, then Commit changes."
        : undefined,
    }, scopeIssue ? 403 : 502);
  }
}
