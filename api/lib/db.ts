/**
 * Postgres for the Toolbox Talk Generator (Neon serverless driver — works with
 * any Postgres connection string). Two tables:
 *
 *   toolbox_generations — the free-tier lead log (source-tagged email capture)
 *     and rate-limit ledger (count rows per email/IP in the trailing 24h).
 *   academy_members     — the "full version included with every Academy
 *     enrolment" entitlement: one row per paying member, granted by
 *     /api/toolbox-talk-grant on a Kajabi purchase webhook, looked up by the
 *     access token in their welcome email.
 *
 * Fails safe when unconfigured: callers get { configured: false } instead of
 * an unhandled exception, and the generate endpoint responds 501 rather than
 * pretending to be rate-limited.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/** Web Crypto (globalThis.crypto) works in both Node and Edge runtimes — node:crypto does not. */
function randomToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

const MAX_PER_EMAIL_PER_DAY = 5;
const MAX_PER_IP_PER_DAY = 15;
/** Safety net for members, in case a personal link leaks — not a real ceiling for normal use. */
const MAX_PER_MEMBER_PER_DAY = 50;

type Sql = NeonQueryFunction<false, false>;

let schemaReady: Promise<void> | null = null;

function getSql(): Sql | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

async function ensureSchema(sql: Sql): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS toolbox_generations (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          ip TEXT NOT NULL,
          topic TEXT NOT NULL,
          trade TEXT,
          site TEXT,
          title TEXT,
          source TEXT NOT NULL DEFAULT 'toolbox-talk-generator',
          utm JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS toolbox_generations_email_idx ON toolbox_generations (email, created_at)`;
      await sql`CREATE INDEX IF NOT EXISTS toolbox_generations_ip_idx ON toolbox_generations (ip, created_at)`;

      await sql`
        CREATE TABLE IF NOT EXISTS academy_members (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          access_token TEXT NOT NULL UNIQUE,
          tier TEXT,
          revoked BOOLEAN NOT NULL DEFAULT false,
          granted_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS academy_members_token_idx ON academy_members (access_token)`;
    })();
  }
  await schemaReady;
}

export interface RateLimitResult {
  configured: boolean;
  allowed: boolean;
  reason?: "email" | "ip";
}

export async function checkRateLimit(
  email: string,
  ip: string,
  emailLimit: number = MAX_PER_EMAIL_PER_DAY,
): Promise<RateLimitResult> {
  const sql = getSql();
  if (!sql) return { configured: false, allowed: true };
  await ensureSchema(sql);

  const [emailCount] = await sql`
    SELECT count(*)::int AS n FROM toolbox_generations
    WHERE email = ${email} AND created_at > now() - interval '1 day'
  `;
  if (Number(emailCount.n) >= emailLimit) {
    return { configured: true, allowed: false, reason: "email" };
  }

  const [ipCount] = await sql`
    SELECT count(*)::int AS n FROM toolbox_generations
    WHERE ip = ${ip} AND created_at > now() - interval '1 day'
  `;
  if (Number(ipCount.n) >= MAX_PER_IP_PER_DAY) {
    return { configured: true, allowed: false, reason: "ip" };
  }

  return { configured: true, allowed: true };
}

/** Same ledger, a much higher ceiling — a safety net rather than a real limit for paying members. */
export async function checkMemberRateLimit(email: string, ip: string): Promise<RateLimitResult> {
  return checkRateLimit(email, ip, MAX_PER_MEMBER_PER_DAY);
}

export interface RecordGenerationParams {
  email: string;
  ip: string;
  topic: string;
  trade?: string;
  site?: string;
  title: string;
  source: string;
  utm?: Record<string, string>;
}

export async function recordGeneration(params: RecordGenerationParams): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  await ensureSchema(sql);
  await sql`
    INSERT INTO toolbox_generations (email, ip, topic, trade, site, title, source, utm)
    VALUES (${params.email}, ${params.ip}, ${params.topic}, ${params.trade ?? null},
            ${params.site ?? null}, ${params.title}, ${params.source},
            ${params.utm ? JSON.stringify(params.utm) : null})
  `;
}

// ── Academy member entitlements ─────────────────────────────────────────────

export interface AcademyMember {
  email: string;
  tier: string | null;
  revoked: boolean;
}

/** Looks up an access token from the member's welcome-email link. Returns null if unconfigured, not found, or revoked. */
export async function getMemberByToken(token: string): Promise<AcademyMember | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureSchema(sql);

  const rows = await sql`
    SELECT email, tier, revoked FROM academy_members WHERE access_token = ${token}
  `;
  const row = rows[0];
  if (!row || row.revoked) return null;
  return { email: row.email as string, tier: (row.tier as string) ?? null, revoked: false };
}

/**
 * Grants (or re-grants) Toolbox Talk Generator access for a Kajabi purchase.
 * A repeat purchase for the same email refreshes the token — the old link
 * stops working, which is the intended behaviour rather than a bug.
 * Returns null if the DB isn't configured (caller should skip sending the email).
 */
export async function grantMemberAccess(email: string, tier: string | undefined): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureSchema(sql);

  const token = randomToken();
  await sql`
    INSERT INTO academy_members (email, access_token, tier, revoked, granted_at)
    VALUES (${email}, ${token}, ${tier ?? null}, false, now())
    ON CONFLICT (email) DO UPDATE
      SET access_token = EXCLUDED.access_token,
          tier = EXCLUDED.tier,
          revoked = false,
          granted_at = now()
  `;
  return token;
}
