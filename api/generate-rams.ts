/**
 * POST /api/generate-rams — the RAMS Generator. SUBSCRIBER-ONLY.
 *
 * Node runtime (not edge): PDF rendering needs headless Chromium — mirror the
 * functions config for generate-toolbox-talk in vercel.json.
 *
 * Requires an accessToken whose tier includes "rams" (the RAMS offer or the
 * bundle). No public/free mode — see api/lib/memberToolHandler.ts.
 */
import { createMemberToolHandler } from "./lib/memberToolHandler.js";
import { RAMS_SCHEMA, type RamsDocument } from "./lib/schemas/rams.js";
import { RAMS_SYSTEM_PROMPT, buildRamsUserTurn } from "./lib/prompts/rams.js";
import { renderRamsHtml } from "./lib/pdf/renderRamsHtml.js";

export default createMemberToolHandler<RamsDocument>({
  tool: "rams",
  docLabel: "RAMS",
  subjectField: "activity",
  invalidTitle: "Invalid activity",
  systemPrompt: RAMS_SYSTEM_PROMPT,
  buildUserTurn: buildRamsUserTurn,
  schema: RAMS_SCHEMA,
  maxTokens: 9000,
  renderHtml: renderRamsHtml,
});
