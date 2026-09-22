/**
 * Shared handler factory for the Document Library download endpoints.
 *
 * One thin api/doc-dl-<category>.ts entrypoint per category (see vercel.json's
 * `includeFiles` for each — that's what actually bundles that category's real
 * files into the deployed function; this module only contains logic).
 *
 * Files live in api/_documents/<categorySlug>/... and are matched against
 * api/_documents/catalogue.json (the server copy of
 * client/src/data/documentCatalogue.ts — regenerate both together if the
 * document set changes). The catalogue is also the security boundary: a
 * request is only ever served a path that exists verbatim in it, so a
 * manipulated `file` query param can't read anything outside the category
 * folder.
 *
 * Same entitlement model as RAMS/COSHH (api/_lib/memberToolHandler.ts): a
 * valid, non-revoked academy_members access token is required, and its tier
 * (the Kajabi offer title recorded at grant time) must mention "document" —
 * that covers both the standalone Document Library and the Academy +
 * Documents bundle.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getMemberByToken } from "./db.js";

export interface DocumentEntry {
  category_slug: string;
  category_label: string;
  title: string;
  filename: string;
  rel_within_cat: string;
  ext: string;
  size: number;
}

interface VercelLikeRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelLikeResponse {
  status(code: number): VercelLikeResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  send(body: Buffer): void;
  end(): void;
}

let catalogue: DocumentEntry[] | null = null;

function getCatalogue(): DocumentEntry[] {
  if (!catalogue) {
    const raw = readFileSync(join(process.cwd(), "api/_documents/catalogue.json"), "utf8");
    catalogue = JSON.parse(raw) as DocumentEntry[];
  }
  return catalogue;
}

/** Tier check, same shape as hasToolEntitlement in memberToolHandler.ts. "document" matches both the standalone Document Library and the Academy + Documents bundle. */
export function hasDocumentsEntitlement(tier: string | null): boolean {
  if (!tier) return false;
  return tier.toLowerCase().includes("document");
}

const MIME_TYPES: Record<string, string> = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ppt: "application/vnd.ms-powerpoint",
  pdf: "application/pdf",
};

function getQueryParam(req: VercelLikeRequest, key: string): string {
  const v = req.query?.[key];
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

/** GET /api/doc-dl-<category>?access=<token>&file=<rel_within_cat> */
export function createDocDownloadHandler(categorySlug: string) {
  return async function handler(req: VercelLikeRequest, res: VercelLikeResponse): Promise<void> {
    if (req.method !== "GET") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }

    const accessToken = getQueryParam(req, "access").trim().slice(0, 128);
    const file = getQueryParam(req, "file");

    if (!accessToken) {
      res.status(401).json({ error: "subscriber_only" });
      return;
    }

    const member = await getMemberByToken(accessToken);
    if (!member) {
      res.status(401).json({ error: "invalid_access_link" });
      return;
    }
    if (!hasDocumentsEntitlement(member.tier)) {
      res.status(403).json({ error: "not_subscribed_to_documents" });
      return;
    }

    const entry = getCatalogue().find(
      (e) => e.category_slug === categorySlug && e.rel_within_cat === file,
    );
    if (!entry) {
      res.status(404).json({ error: "document_not_found" });
      return;
    }

    try {
      const filePath = join(process.cwd(), "api/_documents", entry.category_slug, entry.rel_within_cat);
      const buffer = readFileSync(filePath);
      const mime = MIME_TYPES[entry.ext] ?? "application/octet-stream";
      const encodedName = encodeURIComponent(entry.filename);

      res.setHeader("Content-Type", mime);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${entry.filename.replace(/["\\]/g, "_")}"; filename*=UTF-8''${encodedName}`,
      );
      res.setHeader("Cache-Control", "private, no-store");
      res.status(200).send(buffer);
    } catch {
      res.status(500).json({ error: "read_failed" });
    }
  };
}
