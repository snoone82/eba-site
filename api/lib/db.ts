/**
 * Generation log for the free Toolbox Talk Generator — doubles as the lead
 * store (source-tagged email capture) and the rate-limit ledger (count rows
 * per email/IP in the trailing 24h). Postgres-backed (Neon serverless driver,
 * works with any Postgres connection string). Fails safe when unconfigured:
 * callers get { configured: false } instead of an unhandled exception, and
 * the generate endpoint responds 501 rather than pretending to be rate-limited.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

const MAX_PER_EMAIL_PER_DAY = 5;
const MAX_PER_IP_PER_DAY = 15;

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
    })();
  }
  await schemaReady;
}

export interface RateLimitResult {
  configured: boolean;
  allowed: boolean;
  reason?: "email" | "ip";
}

export async function checkRateLimit(email: string, ip: string): Promise<RateLimitResult> {
  const sql = getSql();
  if (!sql) return { configured: false, allowed: true };
  await ensureSchema(sql);

  const [emailCount] = await sql`
    SELECT count(*)::int AS n FROM toolbox_generations
    WHERE email = ${email} AND created_at > now() - interval '1 day'
  `;
  if (Number(emailCount.n) >= MAX_PER_EMAIL_PER_DAY) {
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
