/**
 * GET /api/doc-dl-environmental — Document Library download, Environmental category.
 * See api/_lib/documents.ts. Node runtime — vercel.json includeFiles bundles
 * api/_documents/environmental/** into this function specifically.
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("environmental");
