/**
 * Shared handler factory for SUBSCRIBER-ONLY document generators (RAMS, COSHH).
 *
 * Differs from the free toolbox talk deliberately:
 *  - No public email mode. A valid access token is REQUIRED — these tools are
 *    paid subscriptions, and the honest failure for a missing/invalid/revoked
 *    token is a clear "subscriber tool" message, never a degraded free mode.
 *  - Entitlement is checked against the member's tier (the Kajabi offer title
 *    recorded at grant time): a RAMS subscriber's token does not open COSHH,
 *    and vice versa. The bundle title contains both words, so it opens both.
 *
 * Known limitation, inherited from academy_members (one row per email): a
 * customer holding two separate subscriptions has whichever tier was granted
 * last. The bundle offer is the supported way to hold both tools.
 */
import { generateDocument, GenerationError } from "./anthropic.js";
import { renderHtmlToPdf } from "./pdf/renderPdf.js";
import { sendGeneratedDocEmail } from "./email.js";
import { checkMemberRateLimit, recordGeneration, getMemberByToken } from "./db.js";

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

const MAX_SUBJECT_LEN = 200;
const MAX_FIELD_LEN = 80;

/** Tier check: tier is the Kajabi offer title. "rams" matches the RAMS offer and the bundle; same for "coshh". */
export function hasToolEntitlement(tier: string | null, tool: "rams" | "coshh"): boolean {
  if (!tier) return false;
  return tier.toLowerCase().includes(tool);
}

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

export interface MemberToolConfig<TDoc extends { title: string }> {
  tool: "rams" | "coshh";
  /** e.g. "RAMS" — used in emails and error copy. */
  docLabel: string;
  /** Body field carrying the main input ("activity" / "substance"). */
  subjectField: string;
  invalidTitle: string;
  systemPrompt: string;
  buildUserTurn: (subject: string, trade: string, site: string) => string;
  schema: Record<string, unknown>;
  maxTokens: number;
  renderHtml: (doc: TDoc, meta: { site?: string; trade?: string }) => string;
}

export function createMemberToolHandler<TDoc extends { title: string }>(cfg: MemberToolConfig<TDoc>) {
  return async function handler(req: VercelLikeRequest, res: VercelLikeResponse): Promise<void> {
    if (req.method !== "POST") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(501).json({ error: "not_configured" });
      return;
    }

    const body = parseBody(req);
    const subject = (body[cfg.subjectField] ?? "").toString().trim().slice(0, MAX_SUBJECT_LEN);
    const trade = (body.trade ?? "").toString().trim().slice(0, MAX_FIELD_LEN);
    const site = (body.site ?? "").toString().trim().slice(0, MAX_FIELD_LEN);
    const accessToken = (body.accessToken ?? "").toString().trim().slice(0, 128);

    if (!subject) {
      res.status(400).json({ error: `${cfg.subjectField}_required` });
      return;
    }
    if (!accessToken) {
      res.status(401).json({ error: "subscriber_only" });
      return;
    }

    const member = await getMemberByToken(accessToken);
    if (!member) {
      res.status(401).json({ error: "invalid_access_link" });
      return;
    }
    if (!hasToolEntitlement(member.tier, cfg.tool)) {
      // Valid token, wrong product — e.g. an Academy or COSHH-only link on the
      // RAMS tool. Named distinctly so the page can explain rather than confuse.
      res.status(403).json({ error: "not_subscribed_to_tool" });
      return;
    }

    const ip = clientIp(req);

    try {
      const rateLimit = await checkMemberRateLimit(member.email, ip);
      if (!rateLimit.allowed) {
        res.status(429).json({
          error: "rate_limited",
          message: "You've hit today's generation ceiling. If this is a genuine day's workload, contact us and we'll raise it.",
        });
        return;
      }

      let doc: TDoc;
      try {
        doc = await generateDocument<TDoc>({
          toolType: cfg.tool,
          systemPrompt: cfg.systemPrompt,
          userPrompt: cfg.buildUserTurn(subject, trade, site),
          schema: cfg.schema,
          model: "claude-sonnet-5",
          maxTokens: cfg.maxTokens,
        });
      } catch (err) {
        if (err instanceof GenerationError) {
          res.status(502).json({ error: "generation_failed" });
          return;
        }
        throw err;
      }

      recordGeneration({
        email: member.email,
        ip,
        topic: subject,
        trade: trade || undefined,
        site: site || undefined,
        title: doc.title,
        source: `${cfg.tool}-subscriber`,
        utm: { tier: member.tier ?? "unknown" },
      }).catch(() => {
        /* best-effort log */
      });

      if (doc.title === cfg.invalidTitle) {
        res.status(200).json({ invalidTopic: true });
        return;
      }

      const html = cfg.renderHtml(doc, { site: site || undefined, trade: trade || undefined });
      const pdfBuffer = await renderHtmlToPdf(html);
      const emailResult = await sendGeneratedDocEmail({
        to: member.email,
        title: doc.title,
        docLabel: cfg.docLabel,
        pdfBuffer,
      });

      res.status(200).json({
        doc,
        pdfBase64: pdfBuffer.toString("base64"),
        emailed: emailResult.sent,
      });
    } catch {
      res.status(500).json({ error: "unexpected_error" });
    }
  };
}
