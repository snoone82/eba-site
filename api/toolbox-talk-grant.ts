/**
 * /api/toolbox-talk-grant — grants "the full Toolbox Talk Generator, included
 * with every Academy enrolment" on a Kajabi purchase.
 *
 * Deliberately a separate file from /api/kajabi-webhook.ts (which stays
 * scoped to its own job, the Kajabi → HubSpot CRM sync) — this is a second
 * "Send Webhook" step on the same Kajabi purchase automation, hitting a
 * different URL. Zero risk to the working HubSpot sync either way.
 *
 * On a purchase event: generates an access token, upserts it into
 * academy_members (a repeat purchase for the same email refreshes the token —
 * the old link stops working, which is intended), and emails the member their
 * personal link: https://teb-academy.com/toolbox-talk?access=<token>
 *
 * On a contact-only event: no-op, {ok:true}.
 *
 * Environment (Vercel project settings — never commit these):
 *   DATABASE_URL          same Postgres the free-tier generator uses
 *   RESEND_API_KEY        same Resend account the free-tier generator uses
 *   KAJABI_WEBHOOK_SECRET reused from /api/kajabi-webhook.ts — it's a generic
 *                         "prove you're Kajabi" secret, nothing HubSpot-
 *                         specific about the value itself
 *
 * Setup: see docs/TOOLBOX_TALK_GRANT_RUNBOOK.md for the exact Kajabi
 * dashboard steps.
 *
 * Health check, writes nothing:
 *   GET /api/toolbox-talk-grant?secret=…    reports config readiness
 */
import { json, env, normaliseEmail } from "./_hubspot.mjs";
import { grantMemberAccess } from "./lib/db.js";
import { sendMemberAccessEmail } from "./lib/email.js";

export const config = { runtime: "edge" };

/** Same tolerant-path approach as kajabi-webhook.ts — Kajabi's webhook shape differs by event type. */
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
const AMOUNT_PATHS = [
  "amount", "total", "price", "offer.price", "purchase.amount",
  "data.amount", "amount_in_cents",
];
const OFFER_PATHS = ["offer_title", "offer.title", "offer_name", "product_title", "data.offer_title"];

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const secret = env("KAJABI_WEBHOOK_SECRET");

  if (!secret) {
    return json({ error: "not_configured", missing: ["KAJABI_WEBHOOK_SECRET"] }, 501);
  }

  const supplied = req.headers.get("x-teba-secret") ?? url.searchParams.get("secret");
  if (supplied !== secret) return json({ error: "unauthorised" }, 401);

  // ── Health check ───────────────────────────────────────────────────────────
  if (req.method === "GET") {
    return json({
      ok: Boolean(env("DATABASE_URL")) && Boolean(env("RESEND_API_KEY")),
      checks: {
        database: env("DATABASE_URL") ? "configured" : "missing DATABASE_URL",
        resend: env("RESEND_API_KEY") ? "configured" : "missing RESEND_API_KEY",
      },
      note: "Writes nothing. Send a real purchase event to confirm end-to-end.",
    });
  }

  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let payload: any;
  try { payload = await req.json(); } catch { return json({ error: "bad_request" }, 400); }

  const email = normaliseEmail(pick(payload, EMAIL_PATHS));
  if (!email) {
    return json({
      error: "no_email_in_payload",
      received_keys: payload && typeof payload === "object" ? Object.keys(payload) : typeof payload,
      hint: "Add the matching path to EMAIL_PATHS in api/toolbox-talk-grant.ts",
    }, 422);
  }

  // Same purchase-vs-contact inference as kajabi-webhook.ts.
  const declared = url.searchParams.get("event");
  const rawAmount = pick(payload, AMOUNT_PATHS);
  const isPurchase = declared === "purchase" || (declared !== "contact" && rawAmount !== undefined);

  if (!isPurchase) {
    return json({ ok: true, event: "contact", granted: false });
  }

  const offer = pick(payload, OFFER_PATHS);
  const tier = typeof offer === "string" ? offer : undefined;

  try {
    const token = await grantMemberAccess(email, tier);
    if (!token) {
      return json({ error: "not_configured", missing: ["DATABASE_URL"] }, 501);
    }

    const emailResult = await sendMemberAccessEmail({ to: email, accessToken: token });

    return json({ ok: true, event: "purchase", granted: true, emailed: emailResult.sent });
  } catch (e) {
    return json({ error: "grant_failed", message: (e as Error).message }, 502);
  }
}
