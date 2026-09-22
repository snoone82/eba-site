/**
 * GET /api/doc-dl-human-resources — Document Library download, Human Resources category.
 * See api/_lib/documents.ts. Node runtime — vercel.json includeFiles bundles
 * api/_documents/human-resources/** into this function specifically.
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("human-resources");
