/**
 * generateDocument — the shared generation primitive the whole tool suite
 * (Toolbox Talk now; O&M / RAMS / COSHH / Compliance Co-Pilot later) calls:
 * structured inputs -> a Claude call returning validated JSON. Model is a
 * per-call config value, not a constant, so paid/higher-stakes tools can
 * pass a stronger model without touching this file.
 */
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export interface GenerateDocumentParams {
  /** Which tool is calling (for logging/cost tracking) — e.g. "toolbox-talk". */
  toolType: string;
  systemPrompt: string;
  userPrompt: string;
  /** Plain JSON Schema — no minLength/maxLength/min/max; additionalProperties:false + required on every object. */
  schema: Record<string, unknown>;
  model?: string;
  maxTokens?: number;
}

export class GenerationError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "GenerationError";
  }
}

export async function generateDocument<T>({
  systemPrompt,
  userPrompt,
  schema,
  model = "claude-sonnet-5",
  maxTokens = 6000,
}: GenerateDocumentParams): Promise<T> {
  const anthropic = getClient();

  let response;
  try {
    response = await anthropic.messages.parse({
      model,
      max_tokens: maxTokens,
      thinking: { type: "adaptive" },
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      output_config: { format: { type: "json_schema", schema } },
    });
  } catch (err) {
    throw new GenerationError("Claude request failed", err);
  }

  if (response.stop_reason === "refusal") {
    throw new GenerationError("Claude declined to generate this content");
  }
  if (!response.parsed_output) {
    throw new GenerationError("Claude did not return parseable structured output");
  }

  return response.parsed_output as T;
}
