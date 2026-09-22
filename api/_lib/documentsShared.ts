/**
 * Tiny Edge-safe half of the Document Library entitlement check — split out
 * from api/_lib/documents.ts because that module also imports node:fs/
 * node:path (to read the actual files) which the Edge runtime can't load.
 * api/documents-access.ts (Edge) imports this; api/_lib/documents.ts
 * (Node, used by the doc-dl-<category> handlers) re-exports it so both
 * sides share one implementation.
 */
export function hasDocumentsEntitlement(tier: string | null): boolean {
  if (!tier) return false;
  return tier.toLowerCase().includes("document");
}
