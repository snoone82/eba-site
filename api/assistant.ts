/**
 * /api/assistant — EBA website assistant backed by the Claude API.
 *
 * Runs on the Vercel Edge runtime. Reads ANTHROPIC_API_KEY from the environment
 * (set it in the Vercel project settings — never commit it). If the key is not
 * configured it returns 501 so the client falls back to its local knowledge
 * base. Keeps answers short, accurate and on-brand via a grounded system prompt.
 */
export const config = { runtime: "edge" };

const MODEL = "claude-haiku-4-5-20251001";

const SYSTEM = `You are the assistant on the website of The Engineering Business Academy (EBA).
EBA helps mechanical & electrical (M&E) engineering contractors run a profitable business.
Answer visitor questions helpfully, in British English, in a warm, plain, confident tone.
Keep answers short — usually 2-4 sentences. Never invent facts, prices or claims. If you
don't know, say so and point them to the contact form. Do not discuss anything unrelated to
EBA; steer politely back.

FACTS you can rely on:
- Built from ~25 years of running a real M&E contracting business (through growth,
  restructuring and scale). Everything comes from real operations, not theory. Do NOT
  claim any external accreditations or awards for EBA.
- The Academy: the full "operating system" for running an M&E business — 101 lessons across
  10 modules (pricing & margin, cash flow, contracts, compliance, winning work, growth).
  CPD accreditation is in progress (not yet accredited). No prior business knowledge needed.
- Four AI tools, priced SEPARATELY from the Academy (pay-per-use or subscription; NOT included
  with membership): O&M Manual Compiler (pay per manual, from £99), RAMS Generator
  (subscription, from £49/month), Compliance Co-Pilot (subscription, from £99/month; also a
  managed white-label option), COSHH Generator (pay per use, pricing announced soon). Users
  review every AI output before use.
- Free Toolbox Talk Generator: genuinely free, just needs an email; produces a site-ready
  toolbox talk with a sign-off sheet in about a minute.
- Document Library: 380 operator-grade M&E documents (RAMS, O&M, CDM, compliance) in Word +
  PDF; included with Academy membership.
- Mentorship: direct access to founder Mark Poulton — group or 1:1,
  application-only and deliberately limited; pricing on application.
- Founding cohort: 30 places only; enrolment opens soon (not open yet); founding members lock
  in the lowest price for life. 14-day, no-questions-asked refund on Academy memberships.
- For anything you can't answer, direct people to the contact form (we reply within two
  working days).`;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

type InMsg = { role?: string; text?: string; content?: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const key = (globalThis as any).process?.env?.ANTHROPIC_API_KEY;
  if (!key) return json({ error: "not_configured" }, 501);

  let body: { message?: string; history?: InMsg[] };
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }

  const message = (body?.message ?? "").toString().slice(0, 2000).trim();
  if (!message) return json({ error: "empty" }, 400);

  const history = Array.isArray(body?.history) ? body.history.slice(-8) : [];
  const messages = [
    ...history
      .filter((m) => m && (m.text || m.content))
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: (m.text ?? m.content ?? "").toString().slice(0, 2000),
      })),
    { role: "user", content: message },
  ];

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: SYSTEM, messages }),
    });
    if (!r.ok) return json({ error: "upstream", status: r.status }, 502);
    const data = await r.json();
    const reply = (data?.content?.[0]?.text ?? "").toString().trim();
    if (!reply) return json({ error: "empty_reply" }, 502);
    return json({ reply });
  } catch {
    return json({ error: "failed" }, 500);
  }
}
