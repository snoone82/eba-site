/**
 * GET /api/doc-dl-tenders — Document Library download, Tenders category.
 * See api/_lib/documents.ts. Node runtime — vercel.json includeFiles bundles
 * api/_documents/tenders/** into this function specifically.
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("tenders");
