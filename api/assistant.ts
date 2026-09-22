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

const SYSTEM = `You are the assistant on the website of The Engineering Business Academy.
The Academy helps owners and leaders of engineering and technical services businesses build,
run and scale a more profitable, better-managed company.
Answer visitor questions helpfully, in British English, in a warm, plain, confident tone.
Keep answers short — usually 2-4 sentences. Never invent facts, prices or claims. If you
don't know, say so and point them to the contact form. Do not discuss anything unrelated to
The Engineering Business Academy; steer politely back.

FACTS you can rely on:
- Founded by Mark Poulton, built from decades of real-world experience building, leading and
  scaling engineering businesses across multiple divisions and international operations.
  Everything comes from real operations, not theory. Do NOT claim any external accreditations
  or awards.
- The Academy: 100+ practical lessons across 10 modules covering leadership, culture, teams,
  processes, sales, commercial controls, cash flow, risk and growth. £999 one-time payment,
  lifetime access. CPD accreditation is in progress (not yet accredited). No prior business
  knowledge needed.
- Academy + Documents (everything in the Academy plus the full 380-document library): £1,299
  one-time payment, lifetime access.
- Document Library on its own: £399 one-time payment. 380 editable documents covering
  commercial, financial, people, HSEQ, technical, subcontractor and operational areas, in
  editable Word and Excel formats. Templates to review and adapt, not issue as-is.
- AI tools, priced SEPARATELY from the Academy and NOT included with membership: O&M Manual
  Compiler (£299 per manual, compiled for you and returned for review within 24 hours), RAMS
  Generator (£39/month), COSHH Generator (£29/month, or £49/month with RAMS together),
  Compliance Co-Pilot (a custom deployment around the customer's own documents, £499 setup +
  £149/month, enquiry-led). Every AI output is a draft for the customer's people to review
  before use.
- Free Toolbox Talk Generator: genuinely free, just needs an email; produces a structured
  toolbox talk with a sign-off sheet in about a minute. Academy members get the full version
  included with membership, unlimited, no email step.
- Mentorship: group sessions, 1:1 sessions, or a limited number of founder sessions with Mark
  Poulton. Enquiry-led — pricing is agreed after an initial conversation about the support
  needed, not application-only.
- Enrolment is open now. There is no founding cohort and no money-back guarantee — Academy
  membership and the Document Library give immediate, lifetime access to digital content, so
  refunds aren't offered, though anyone unsure before enrolling should get in touch first.
  Tool subscriptions can be cancelled at any time.
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
