/**
 * /api/kajabi-purchase — single combined endpoint for Kajabi's native
 * "Outbound Webhooks → Purchase Webhook URL" field.
 *
 * That field (Offer → Webhooks) only accepts ONE URL, so it can't fire both
 * the access-link grant (toolbox-talk-grant.ts) and the HubSpot sync
 * (kajabi-webhook.ts) the way the separate "Automations" builder could have.
 * This endpoint runs both, from the one URL Kajabi actually lets you paste.
 *
 * Reuses the two existing handlers as-is (same secret check, same tolerant
 * payload parsing, same behaviour) rather than duplicating their logic —
 * /api/toolbox-talk-grant and /api/kajabi-webhook still work standalone too,
 * for any offer still wired the old way.
 *
 * Paste this ONE url into an offer's Purchase Webhook URL field:
 *   https://teb-academy.com/api/kajabi-purchase?secret=<KAJABI_WEBHOOK_SECRET>
 *
 * Health check, writes nothing:
 *   GET /api/kajabi-purchase?secret=…    reports both endpoints' config readiness
 */
import { env } from "./_hubspot.mjs";
import grantHandler from "./toolbox-talk-grant.js";
import hubspotHandler from "./kajabi-webhook.js";

export const config = { runtime: "edge" };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function summarise(label: string, res: Response) {
  let body: unknown;
  try { body = await res.json(); } catch { body = null; }
  return { endpoint: label, status: res.status, ok: res.status >= 200 && res.status < 300, body };
}

export default async function handler(req: Request): Promise<Response> {
  // Kajabi (and most webhook UIs) send a HEAD request to check the URL is
  // reachable when you save it — no body, so there's nothing to relay to
  // either sub-handler. Answer it directly and fast, same secret check as
  // everything else, empty body (HEAD responses carry no body by convention).
  if (req.method === "HEAD") {
    const url = new URL(req.url);
    const secret = env("KAJABI_WEBHOOK_SECRET");
    const supplied = url.searchParams.get("secret");
    const status = !secret ? 501 : supplied !== secret ? 401 : 200;
    return new Response(null, { status });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  // Same request, sent to both handlers — each reads the body/query independently.
  const bodyText = req.method === "POST" ? await req.text() : undefined;
  const makeRequest = () =>
    new Request(req.url, {
      method: req.method,
      headers: { "content-type": "application/json" },
      body: bodyText,
    });

  const [grantResult, hubspotResult] = await Promise.allSettled([
    grantHandler(makeRequest()),
    hubspotHandler(makeRequest()),
  ]);

  const grant = grantResult.status === "fulfilled"
    ? await summarise("toolbox-talk-grant", grantResult.value)
    : { endpoint: "toolbox-talk-grant", ok: false, error: String(grantResult.reason) };
  const hubspot = hubspotResult.status === "fulfilled"
    ? await summarise("kajabi-webhook", hubspotResult.value)
    : { endpoint: "kajabi-webhook", ok: false, error: String(hubspotResult.reason) };

  // Unauthorised on BOTH sub-calls means the secret in the URL is wrong — surface
  // that plainly at the top level rather than only inside the nested bodies.
  const bothUnauthorised = "status" in grant && "status" in hubspot
    && grant.status === 401 && hubspot.status === 401;

  return json(
    {
      ok: grant.ok && hubspot.ok,
      unauthorised: bothUnauthorised || undefined,
      access_link: grant,
      hubspot_sync: hubspot,
    },
    bothUnauthorised ? 401 : 200,
  );
}
