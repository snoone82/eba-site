/**
 * Type declarations for _hubspot.mjs.
 *
 * The module itself is plain JS (shared, unbuilt, imported directly by
 * Vercel's Node functions) — TypeScript has no way to infer its shape and
 * fails every function that imports it with TS7016 under strict mode. This
 * was silently failing every production deploy since before this fix (the
 * root tsconfig only includes client/src, so `tsc` never caught it locally —
 * same class of bug as the memberToolHandler TS2322 fixed earlier).
 *
 * Keep this in sync with _hubspot.mjs's actual exports by hand — there is no
 * build step that generates it.
 */

export const HUBSPOT: string;
export const ACADEMY_PIPELINE: string;
export const STAGE_CLOSED_WON_ENROLLED: string;
export const TEBA_SOURCE: Set<string>;
export const PRODUCT_INTEREST: Set<string>;

export function deriveSource(
  utmSource?: string | null,
  utmMedium?: string | null,
  referrer?: string | null
): { source: string; detail: string };

export function normalisePhone(v: unknown): string | undefined;

export function json(
  obj: unknown,
  status?: number,
  extraHeaders?: Record<string, string>
): Response;

export function env(name: string): string | undefined;

/** Throws on a non-2xx, with `.status` and `.detail` attached. */
export function hs(
  token: string,
  method: string,
  path: string,
  body?: unknown
): Promise<any>;

export function findContactByEmail(token: string, email: string): Promise<string | undefined>;

export function upsertContact(
  token: string,
  email: string,
  properties: Record<string, unknown>
): Promise<{ id: string; created: boolean }>;

export function splitName(full: string | undefined): { firstname?: string; lastname?: string };

export function normaliseEmail(v: unknown): string | undefined;

export function clip(v: unknown, max: number): string | undefined;
