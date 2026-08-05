/**
 * /api/lead — the teb-academy.com forms → HubSpot.
 *
 * The website's forms POST straight here from the browser (they do not go through
 * Kajabi), so point `VITE_FORM_ENDPOINT` at this route:
 *
 *   VITE_FORM_ENDPOINT=/api/lead
 *
 * **This endpoint is deliberately unauthenticated, and it has to be.** VITE_* values are
 * inlined into the public JavaScript bundle at build time, so a shared secret placed here
 * would be readable by anyone viewing source — worse than no secret, because it would look
 * protected. Any browser-submitted endpoint is public by nature; the defence is validation
 * and cheap abuse controls, not a key. That is the opposite of /api/kajabi-webhook, which
 * is server-to-server and therefore can and does require a secret.
 *
 * Environment (Vercel project settings, never committed):
 *   HUBSPOT_PRIVATE_APP_TOKEN   needs crm.objects.contacts.write
 *
 * Accepts the three payloads the site actually sends (see client/src):
 *   { name, email, source: "lead-magnet:business-health-check", ...utm }
 *   { email,       source: "lead-magnet:toolbox-talk-generator", ...utm }
 *   { name, email, company, enquiry, message, source: "contact-enquiry" }
 *
 * See scripts/HUBSPOT_CRM_RUNBOOK.md §5.
 */
import {
  json, env, hs, upsertContact, splitName, normaliseEmail, clip,
  PRODUCT_INTEREST, TEBA_SOURCE, deriveSource, normalisePhone,
} from "./_hubspot.mjs";

/** Error thrown by hs(): a normal Error with the HTTP status attached. */
type HsError = Error & { status?: number; detail?: unknown };

export const config = { runtime: "edge" };

/**
 * Contact-form enquiry type → product_interest.
 *
 * Only unambiguous rows are mapped. "documents" (Document Library) has no HubSpot option,
 * and "other" is by definition unknown — both are left empty rather than guessed. An empty
 * property is a known unknown; a wrong one becomes a number in a report someone believes.
 */
const ENQUIRY_TO_INTEREST: Record<string, string> = {
  "academy": "academy",
  "om-manual": "o_m",
  "chatbot": "co_pilot",
  "mentorship": "mentorship",
  "white-label": "enterprise",
};

/** Cap what we accept. Generous enough for a real enquiry, small enough to be useless for abuse. */
const MAX = { name: 120, company: 200, message: 5000, source: 120 };

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { allow: "POST, OPTIONS" } });
  }
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const token = env("HUBSPOT_PRIVATE_APP_TOKEN");
  if (!token) return json({ error: "not_configured", missing: ["HUBSPOT_PRIVATE_APP_TOKEN"] }, 501);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  if (!body || typeof body !== "object") return json({ error: "bad_request" }, 400);

  // A bot that fills every field it finds trips this; a real form never sends it.
  // Cheap, silent, and no worse for accessibility than the alternatives.
  if (clip(body.website_url, 200) || clip(body.fax, 200)) {
    return json({ ok: true, skipped: "honeypot" });
  }

  const email = normaliseEmail(body.email);
  if (!email) return json({ error: "invalid_email" }, 422);

  const source = clip(body.source, MAX.source) ?? "";

  /**
   * Attribution. The browser sends utm_* (captured on first page view and held
   * for the visit) plus document.referrer. utm_source wins where present because
   * it is deliberate; the referrer is the fallback for untagged links — e.g. an
   * Instagram bio tap where nobody remembered to tag the URL.
   *
   * Previously every lead was written as teba_source "website", which made
   * Facebook, LinkedIn and Instagram indistinguishable. The values were being
   * sent by the client and thrown away here.
   */
  const { source: derivedSource, detail } = deriveSource(
    body.utm_source, body.utm_medium, body.referrer,
  );

  const properties: Record<string, string> = {};
  if (TEBA_SOURCE.has(derivedSource)) properties.teba_source = derivedSource;
  if (detail) properties.teba_source_detail = clip(detail, 120)!;

  for (const [key, prop] of [
    ["utm_campaign", "utm_campaign"],
    ["utm_medium", "utm_medium"],
    ["utm_content", "utm_content"],
  ] as const) {
    const v = clip(body[key], 120);
    if (v) properties[prop] = v;
  }

  // Which form produced this lead — waitlist, toolbox talk, contact enquiry.
  if (source) properties.teba_form = source;

  const phone = normalisePhone(body.phone);
  if (phone) properties.phone = phone;

  const { firstname, lastname } = splitName(clip(body.name, MAX.name));
  if (firstname) properties.firstname = firstname;
  if (lastname) properties.lastname = lastname;

  const company = clip(body.company, MAX.company);
  if (company) properties.company = company;

  const message = clip(body.message, MAX.message);
  if (message) properties.message = message;

  const interest = ENQUIRY_TO_INTEREST[String(body.enquiry ?? "").toLowerCase()];
  if (interest && PRODUCT_INTEREST.has(interest)) properties.product_interest = interest;

  // The free toolbox talk generator is an explicit warm-lead signal in spec §2, and the
  // property exists for exactly this.
  if (source.includes("toolbox-talk")) properties.toolbox_talk_user = "true";

  /**
   * Properties that only exist if the HubSpot CRM build has been done. HubSpot
   * rejects the WHOLE write if one property name is unknown — so a half-built
   * CRM would silently lose every lead. On a 400 we strip these and retry with
   * standard properties only: an incompletely-tagged contact beats no contact.
   */
  const CUSTOM = [
    "teba_source", "teba_source_detail", "teba_form",
    "utm_campaign", "utm_medium", "utm_content",
    "product_interest", "toolbox_talk_user",
  ];

  try {
    let contact;
    try {
      contact = await upsertContact(token, email, properties);
    } catch (first) {
      const fe = first as HsError;
      if (fe.status !== 400) throw first;
      const reduced = Object.fromEntries(
        Object.entries(properties).filter(([k]) => !CUSTOM.includes(k)),
      );
      console.warn(
        "[api/lead] HubSpot rejected custom properties — retrying with standard only.",
        "Create them in HubSpot (see scratchpad/TEBA_HUBSPOT_CRM_SPEC.md).",
        fe.message,
      );
      contact = await upsertContact(token, email, reduced);
    }

    // Only on first sight. Sending it on every submission would drag an existing Customer
    // back down to Lead the next time they filled in a form.
    if (contact.created) {
      await hs(token, "PATCH", `/crm/v3/objects/contacts/${contact.id}`, {
        properties: { lifecyclestage: "lead" },
      });
    }

    return json({ ok: true, created: contact.created });
  } catch (e) {
    const err = e as HsError;
    // The browser sees a generic failure; the detail stays in the server log. The form
    // shows its own "something went wrong" message either way, and a HubSpot error string
    // is no use to a visitor.
    console.error("[api/lead]", err.message, err.detail ?? "");
    return json({ error: "upstream_error" }, 502);
  }
}
