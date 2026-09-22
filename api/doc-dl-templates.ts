/**
 * GET /api/doc-dl-templates — Document Library download, Templates category.
 * See api/_lib/documents.ts. Node runtime — vercel.json includeFiles bundles
 * api/_documents/templates/** into this function specifically.
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("templates");
