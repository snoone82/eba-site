/**
 * GET /api/doc-dl-1 — Document Library download, group 1: technical,
 * tenders, environmental (~145MB). See api/_lib/documents.ts. Node runtime —
 * vercel.json includeFiles bundles api/_documents/group-1/** into this
 * function specifically.
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("group-1");
