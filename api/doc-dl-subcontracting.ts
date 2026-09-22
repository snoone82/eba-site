/**
 * GET /api/doc-dl-subcontracting — Document Library download, Subcontracting category.
 * See api/_lib/documents.ts. Node runtime — vercel.json includeFiles bundles
 * api/_documents/subcontracting/** into this function specifically.
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("subcontracting");
