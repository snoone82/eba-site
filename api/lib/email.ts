import { Resend } from "resend";

const SITE_URL = "https://teb-academy.com";
const FROM_FALLBACK = "The Engineering Business Academy <toolbox@teb-academy.com>";

let resend: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "toolbox-talk"
  );
}

function escapeHtmlLite(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export interface SendEmailResult {
  sent: boolean;
  error?: string;
}

export interface SendToolboxTalkEmailParams {
  to: string;
  title: string;
  pdfBuffer: Buffer;
}

/** Emails a copy of the generated PDF. Fails safe: if RESEND_API_KEY isn't set, returns sent:false rather than throwing — the on-screen result still works. */
export async function sendToolboxTalkEmail({
  to,
  title,
  pdfBuffer,
}: SendToolboxTalkEmailParams): Promise<SendEmailResult> {
  const client = getResend();
  if (!client) return { sent: false, error: "not_configured" };

  const fromAddress = process.env.RESEND_FROM_EMAIL || FROM_FALLBACK;

  try {
    const { error } = await client.emails.send({
      from: fromAddress,
      to,
      subject: `${title} — your Toolbox Talk from EBA`,
      html: `
        <p>Hi,</p>
        <p>Here's the toolbox talk you just generated: <strong>${escapeHtmlLite(title)}</strong>.
        It's attached as a ready-to-print PDF with a sign-off sheet.</p>
        <p>Toolbox Talks are the free tool. Academy members get this generator unlimited, plus the
        full curriculum &mdash; <a href="${SITE_URL}/academy">see the Academy</a>.</p>
        <p>&mdash; The Engineering Business Academy</p>
      `,
      attachments: [
        {
          filename: `${slugify(title)}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "unknown_error" };
  }
}

export interface SendMemberAccessEmailParams {
  to: string;
  accessToken: string;
}

/** Sends the Academy member their personal, unlimited Toolbox Talk Generator link after a Kajabi purchase. */
export async function sendMemberAccessEmail({
  to,
  accessToken,
}: SendMemberAccessEmailParams): Promise<SendEmailResult> {
  const client = getResend();
  if (!client) return { sent: false, error: "not_configured" };

  const fromAddress = process.env.RESEND_FROM_EMAIL || FROM_FALLBACK;
  const link = `${SITE_URL}/toolbox-talk?access=${encodeURIComponent(accessToken)}`;

  try {
    const { error } = await client.emails.send({
      from: fromAddress,
      to,
      subject: "Your Toolbox Talk Generator access link",
      html: `
        <p>Welcome to the Academy,</p>
        <p>As part of your enrolment, here's your personal link to the full Toolbox Talk
        Generator &mdash; unlimited, no email step needed:</p>
        <p><a href="${link}">${link}</a></p>
        <p>Bookmark it — it's personal to you and works every time you need a toolbox talk.</p>
        <p>&mdash; The Engineering Business Academy</p>
      `,
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "unknown_error" };
  }
}

export interface SendGeneratedDocEmailParams {
  to: string;
  title: string;
  /** "RAMS" / "COSHH assessment" — used in the subject and body. */
  docLabel: string;
  pdfBuffer: Buffer;
}

/** Emails a subscriber their generated document. Fails safe like the toolbox variant. */
export async function sendGeneratedDocEmail({
  to,
  title,
  docLabel,
  pdfBuffer,
}: SendGeneratedDocEmailParams): Promise<SendEmailResult> {
  const client = getResend();
  if (!client) return { sent: false, error: "not_configured" };

  const fromAddress = process.env.RESEND_FROM_EMAIL || FROM_FALLBACK;

  try {
    const { error } = await client.emails.send({
      from: fromAddress,
      to,
      subject: `${title} — your ${docLabel} from EBA`,
      html: `
        <p>Hi,</p>
        <p>Here's the ${escapeHtmlLite(docLabel)} you just generated:
        <strong>${escapeHtmlLite(title)}</strong>. It's attached as a PDF.</p>
        <p><strong>Before it goes near site:</strong> it must be reviewed, adapted to the actual
        task and conditions, and signed off by a competent person. It's a draft, not a finished
        assessment.</p>
        <p>&mdash; The Engineering Business Academy</p>
      `,
      attachments: [
        {
          filename: `${slugify(title)}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "unknown_error" };
  }
}

/** Which generators a purchase unlocks — used by the grant hook to email the right links. */
export type ToolKey = "toolbox-talk" | "rams" | "coshh";

const TOOL_META: Record<ToolKey, { path: string; label: string }> = {
  "toolbox-talk": { path: "/toolbox-talk", label: "Toolbox Talk Generator" },
  rams: { path: "/rams-generator", label: "RAMS Generator" },
  coshh: { path: "/coshh-generator", label: "COSHH Generator" },
};

export interface SendToolAccessEmailParams {
  to: string;
  accessToken: string;
  tools: ToolKey[];
}

/**
 * Sends a subscriber their personal access link(s) after a Kajabi purchase.
 * One token opens every tool the tier entitles them to; we list each tool's
 * URL separately so each is a one-tap bookmark.
 */
export async function sendToolAccessEmail({
  to,
  accessToken,
  tools,
}: SendToolAccessEmailParams): Promise<SendEmailResult> {
  const client = getResend();
  if (!client) return { sent: false, error: "not_configured" };

  const fromAddress = process.env.RESEND_FROM_EMAIL || FROM_FALLBACK;
  const items = tools
    .map((t) => {
      const meta = TOOL_META[t];
      const link = `${SITE_URL}${meta.path}?access=${encodeURIComponent(accessToken)}`;
      return `<li><strong>${meta.label}</strong><br/><a href="${link}">${link}</a></li>`;
    })
    .join("");
  const plural = tools.length > 1;

  try {
    const { error } = await client.emails.send({
      from: fromAddress,
      to,
      subject: plural ? "Your generator access links" : `Your ${TOOL_META[tools[0]].label} access link`,
      html: `
        <p>Thanks for subscribing,</p>
        <p>Here ${plural ? "are your personal links" : "is your personal link"} &mdash; no login
        needed, ${plural ? "they work" : "it works"} every time:</p>
        <ul>${items}</ul>
        <p>Bookmark ${plural ? "them" : "it"}. ${plural ? "They're" : "It's"} personal to you;
        if you cancel, the link${plural ? "s" : ""} stop${plural ? "" : "s"} working.</p>
        <p>Every generated document must be reviewed and signed off by a competent person
        before use on site.</p>
        <p>&mdash; The Engineering Business Academy</p>
      `,
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "unknown_error" };
  }
}
