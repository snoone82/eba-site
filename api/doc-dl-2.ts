/**
 * GET /api/doc-dl-2 — Document Library download, group 2: procedures,
 * templates, human-resources, health-safety, commercial, manuals,
 * subcontracting (~141MB). See api/_lib/documents.ts. Node runtime —
 * vercel.json includeFiles bundles api/_documents/group-2/** into this
 * function specifically.
 */
import { createDocDownloadHandler } from "./_lib/documents.js";

export default createDocDownloadHandler("group-2");
