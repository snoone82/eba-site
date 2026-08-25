/**
 * POST /api/generate-coshh — the COSHH Generator. SUBSCRIBER-ONLY.
 *
 * Node runtime (not edge): PDF rendering needs headless Chromium — mirror the
 * functions config for generate-toolbox-talk in vercel.json.
 *
 * Requires an accessToken whose tier includes "coshh" (the COSHH offer or the
 * bundle). No public/free mode — see api/lib/memberToolHandler.ts.
 */
import { createMemberToolHandler } from "./lib/memberToolHandler.js";
import { COSHH_SCHEMA, type CoshhDocument } from "./lib/schemas/coshh.js";
import { COSHH_SYSTEM_PROMPT, buildCoshhUserTurn } from "./lib/prompts/coshh.js";
import { renderCoshhHtml } from "./lib/pdf/renderCoshhHtml.js";

export default createMemberToolHandler<CoshhDocument>({
  tool: "coshh",
  docLabel: "COSHH assessment",
  subjectField: "substance",
  invalidTitle: "Invalid substance",
  systemPrompt: COSHH_SYSTEM_PROMPT,
  buildUserTurn: buildCoshhUserTurn,
  schema: COSHH_SCHEMA,
  maxTokens: 7000,
  renderHtml: renderCoshhHtml,
});
