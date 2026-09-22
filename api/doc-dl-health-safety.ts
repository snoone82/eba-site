/**
 * GET /api/doc-dl-health-safety — Document Library download, Health & Safety category.
 * See api/_lib/documents.ts. Node runtime — vercel.json includeFiles bundles
 * api/_documents/health-safety/** into this function specifically.
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("health-safety");
