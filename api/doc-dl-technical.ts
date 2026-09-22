/**
 * GET /api/doc-dl-technical — Document Library download, Technical category.
 * See api/_lib/documents.ts. Node runtime — vercel.json includeFiles bundles
 * api/_documents/technical/** into this function specifically (the largest
 * category, ~140MB — kept in its own function so it never shares a bundle).
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("technical");
