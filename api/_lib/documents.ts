/**
 * Shared handler factory for the Document Library download endpoints.
 *
 * Vercel's Hobby plan caps a deployment at 12 Serverless Functions total —
 * one function per category (10) plus the existing 8 would have blown that.
 * So the 380 real files ship in two grouped functions instead:
 *   group-1 (api/doc-dl-1.ts): technical, tenders, environmental (~145MB)
 *   group-2 (api/doc-dl-2.ts): everything else (~141MB)
 * Each function's vercel.json `includeFiles` bundles only its own
 * api/_documents/group-N/** — that's what actually ships the real files;
 * this module only contains logic. Splitting in two (rather than one) also
 * keeps each function's bundle comfortably under Vercel's per-function size
 * limit, which a single ~286MB function would have run close to.
 *
 * Files live in api/_documents/<group>/<categorySlug>/... and are matched
 * against api/_documents/catalogue.json (the server copy of
 * client/src/data/documentCatalogue.ts — regenerate both together if the
 * document set changes). The catalogue is also the security boundary: a
 * request is only ever served a path that exists verbatim in it, so a
 * manipulated `file`/`category` query param can't read anything outside a
 * category folder, and a category from the wrong group 404s rather than
 * falling through to a path that was never bundled into that function.
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
import { hasDocumentsEntitlement } from "./documentsShared.js";

export { hasDocumentsEntitlement };

export interface DocumentEntry {
  category_slug: string;
  category_label: string;
  title: string;
  filename: string;
  rel_within_cat: string;
  ext: string;
  size: number;
}

/** category_slug → the api/_documents/<group>/ directory it physically ships in. Keep in sync with vercel.json's includeFiles. */
export const CATEGORY_GROUP: Record<string, string> = {
  technical: "group-1",
  tenders: "group-1",
  environmental: "group-1",
  procedures: "group-2",
  templates: "group-2",
  "human-resources": "group-2",
  "health-safety": "group-2",
  commercial: "group-2",
  manuals: "group-2",
  subcontracting: "group-2",
};

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

/**
 * GET /api/doc-dl-<group>?access=<token>&category=<categorySlug>&file=<rel_within_cat>
 * `group` is the physical shipping group this function's files were bundled from
 * (e.g. "group-1") — a request for a category that belongs to a different group
 * 404s, since those files were never included in this function's deployment.
 */
export function createDocDownloadHandler(group: string) {
  return async function handler(req: VercelLikeRequest, res: VercelLikeResponse): Promise<void> {
    if (req.method !== "GET") {
      res.status(405).json({ error: "method_not_allowed" });
      return;
    }

    const accessToken = getQueryParam(req, "access").trim().slice(0, 128);
    const category = getQueryParam(req, "category");
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

    if (CATEGORY_GROUP[category] !== group) {
      res.status(404).json({ error: "document_not_found" });
      return;
    }

    const entry = getCatalogue().find(
      (e) => e.category_slug === category && e.rel_within_cat === file,
    );
    if (!entry) {
      res.status(404).json({ error: "document_not_found" });
      return;
    }

    try {
      const filePath = join(process.cwd(), "api/_documents", group, entry.category_slug, entry.rel_within_cat);
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
