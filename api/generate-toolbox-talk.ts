/**
 * POST /api/generate-toolbox-talk — the free Toolbox Talk Generator.
 *
 * Node runtime (not edge): PDF rendering needs headless Chromium. Public,
 * gated only by email (no Kajabi/login) — rate-limited per email + IP to
 * protect API cost. Captures the lead (source-tagged) into the same table
 * used for rate limiting.
 */
import { generateDocument, GenerationError } from "./lib/anthropic.js";
import { TOOLBOX_TALK_SCHEMA, type ToolboxTalk } from "./lib/schemas/toolboxTalk.js";
import { TOOLBOX_TALK_SYSTEM_PROMPT, buildToolboxTalkUserTurn } from "./lib/prompts/toolboxTalk.js";
import { renderToolboxTalkHtml } from "./lib/pdf/renderToolboxTalkHtml.js";
import { renderHtmlToPdf } from "./lib/pdf/renderPdf.js";
import { sendToolboxTalkEmail } from "./lib/email.js";
import { checkRateLimit, recordGeneration } from "./lib/db.js";

interface VercelLikeRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
}

interface VercelLikeResponse {
  status(code: number): VercelLikeResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  end(): void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TOPIC_LEN = 200;
const MAX_FIELD_LEN = 80;

function clientIp(req: VercelLikeRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (raw) return raw.split(",")[0].trim();
  return req.socket?.remoteAddress ?? "unknown";
}

function parseBody(req: VercelLikeRequest): Record<string, unknown> {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body as Record<string, unknown>;
}

export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(501).json({ error: "not_configured" });
    return;
  }

  const body = parseBody(req);
  const topic = (body.topic ?? "").toString().trim().slice(0, MAX_TOPIC_LEN);
  const trade = (body.trade ?? "").toString().trim().slice(0, MAX_FIELD_LEN);
  const site = (body.site ?? "").toString().trim().slice(0, MAX_FIELD_LEN);
  const email = (body.email ?? "").toString().trim().slice(0, 254);
  const utm = typeof body.utm === "object" && body.utm ? (body.utm as Record<string, string>) : undefined;

  if (!topic) {
    res.status(400).json({ error: "topic_required" });
    return;
  }
  if (!email || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: "valid_email_required" });
    return;
  }

  const ip = clientIp(req);

  try {
    const rateLimit = await checkRateLimit(email, ip);
    if (!rateLimit.allowed) {
      res.status(429).json({
        error: "rate_limited",
        message:
          rateLimit.reason === "email"
            ? "You've reached today's limit for this email address. Please try again tomorrow."
            : "Too many requests from this network right now. Please try again later.",
      });
      return;
    }

    let talk: ToolboxTalk;
    try {
      talk = await generateDocument<ToolboxTalk>({
        toolType: "toolbox-talk",
        systemPrompt: TOOLBOX_TALK_SYSTEM_PROMPT,
        userPrompt: buildToolboxTalkUserTurn(topic, trade, site),
        schema: TOOLBOX_TALK_SCHEMA,
        model: "claude-sonnet-5",
        maxTokens: 6000,
      });
    } catch (err) {
      if (err instanceof GenerationError) {
        res.status(502).json({ error: "generation_failed" });
        return;
      }
      throw err;
    }

    // Every call still costs tokens — count it for rate limiting even when invalid.
    recordGeneration({
      email,
      ip,
      topic,
      trade: trade || undefined,
      site: site || undefined,
      title: talk.title,
      source: "toolbox-talk-generator",
      utm,
    }).catch(() => {
      /* best-effort lead log; don't fail the request over it */
    });

    if (talk.title === "Invalid topic") {
      res.status(200).json({ invalidTopic: true });
      return;
    }

    const html = renderToolboxTalkHtml(talk, { site: site || undefined, trade: trade || undefined });
    const pdfBuffer = await renderHtmlToPdf(html);

    const emailResult = await sendToolboxTalkEmail({ to: email, title: talk.title, pdfBuffer });

    res.status(200).json({
      talk,
      pdfBase64: pdfBuffer.toString("base64"),
      emailed: emailResult.sent,
    });
  } catch (err) {
    res.status(500).json({ error: "unexpected_error" });
  }
}
