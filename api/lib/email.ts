import { Resend } from "resend";

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

export interface SendToolboxTalkEmailParams {
  to: string;
  title: string;
  pdfBuffer: Buffer;
}

export interface SendEmailResult {
  sent: boolean;
  error?: string;
}

/** Emails a copy of the generated PDF. Fails safe: if RESEND_API_KEY isn't set, returns sent:false rather than throwing — the on-screen result still works. */
export async function sendToolboxTalkEmail({
  to,
  title,
  pdfBuffer,
}: SendToolboxTalkEmailParams): Promise<SendEmailResult> {
  const client = getResend();
  if (!client) return { sent: false, error: "not_configured" };

  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "The Engineering Business Academy <toolbox@eba.academy>";

  try {
    const { error } = await client.emails.send({
      from: fromAddress,
      to,
      subject: `${title} — your Toolbox Talk from EBA`,
      html: `
        <p>Hi,</p>
        <p>Here's the toolbox talk you just generated: <strong>${escapeHtmlLite(title)}</strong>.
        It's attached as a ready-to-print PDF with a sign-off sheet.</p>
        <p>Toolbox Talks are the free tool. EBA members generate full RAMS, COSHH and O&amp;M
        manuals with the paid AI suite &mdash;
        <a href="https://eba.academy/ai-tools">see the tools</a>.</p>
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
