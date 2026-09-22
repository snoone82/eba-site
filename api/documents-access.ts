/**
 * GET /api/documents-access?access=<token> — lightweight token check for the
 * /documents-library page. Returns whether the link is valid and entitled,
 * without touching any file. The page uses this once on load to decide
 * whether to show the library or the honest "subscriber tool" gate (same
 * pattern as MemberGeneratorPage, adapted for a browse-and-download page
 * rather than a generator form).
 */
import { getMemberByToken } from "./_lib/db.js";
import { hasDocumentsEntitlement } from "./_lib/documentsShared.js";

export const config = { runtime: "edge" };

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") return json({ error: "method_not_allowed" }, 405);

  const url = new URL(req.url);
  const token = (url.searchParams.get("access") ?? "").trim().slice(0, 128);
  if (!token) return json({ valid: false, error: "no_token" }, 401);

  const member = await getMemberByToken(token);
  if (!member) return json({ valid: false, error: "invalid_access_link" }, 401);
  if (!hasDocumentsEntitlement(member.tier)) {
    return json({ valid: false, error: "not_subscribed_to_documents" }, 403);
  }

  return json({ valid: true });
}
