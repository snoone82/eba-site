/**
 * Structured-output JSON schema for RAMS (Risk Assessment & Method Statement)
 * generation. Same constraints as toolboxTalk.ts: no minLength/min/max in
 * Anthropic structured outputs — length guidance lives in descriptions and the
 * system prompt. Every object: additionalProperties:false + required.
 *
 * Deliberately does NOT ask the model for regulation numbers beyond the single
 * primary `compliance` field, and never for statistics — the prompt forbids
 * inventing either.
 */
export const RAMS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "compliance",
    "scope",
    "personsAtRisk",
    "risks",
    "methodSteps",
    "ppe",
    "emergencyArrangements",
  ],
  properties: {
    title: { type: "string", description: '"RAMS — <Activity>"' },
    compliance: {
      type: "string",
      description:
        'The single most relevant UK regulation for this activity, e.g. "Construction (Design and Management) Regulations 2015". Never invent a regulation.',
    },
    scope: {
      type: "string",
      description:
        "2–3 sentences: what work this RAMS covers and any explicit exclusions.",
    },
    personsAtRisk: {
      type: "array",
      items: { type: "string" },
      description:
        '3–6 entries, e.g. "Operatives carrying out the work", "Other site trades", "Members of the public".',
    },
    risks: {
      type: "array",
      description:
        "5–9 rows covering the genuinely significant hazards for THIS activity — not generic filler.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["hazard", "whoAndHow", "initialRisk", "controls", "residualRisk"],
        properties: {
          hazard: { type: "string", description: 'Short hazard name, e.g. "Work at height — falls".' },
          whoAndHow: {
            type: "string",
            description: "One sentence: who could be harmed and how.",
          },
          initialRisk: {
            type: "string",
            enum: ["High", "Medium", "Low"],
            description: "Risk before controls.",
          },
          controls: {
            type: "array",
            items: { type: "string" },
            description: "2–5 specific control measures, in hierarchy-of-control order where sensible.",
          },
          residualRisk: {
            type: "string",
            enum: ["High", "Medium", "Low"],
            description: "Risk with the controls applied. Never claim a hazard is eliminated.",
          },
        },
      },
    },
    methodSteps: {
      type: "array",
      description: "6–10 sequential steps for the safe system of work, in the order the work happens.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["step", "detail"],
        properties: {
          step: { type: "string", description: 'Short step heading, e.g. "Isolate and prove dead".' },
          detail: { type: "string", description: "2–4 sentences of practical, specific instruction." },
        },
      },
    },
    ppe: {
      type: "array",
      items: { type: "string" },
      description: "The PPE actually required for this activity — not a generic list of everything.",
    },
    emergencyArrangements: {
      type: "array",
      items: { type: "string" },
      description:
        "3–5 entries covering the credible emergencies for this activity (e.g. rescue from height, electric shock response).",
    },
  },
} as const;

export interface RamsRisk {
  hazard: string;
  whoAndHow: string;
  initialRisk: "High" | "Medium" | "Low";
  controls: string[];
  residualRisk: "High" | "Medium" | "Low";
}

export interface RamsDocument {
  title: string;
  compliance: string;
  scope: string;
  personsAtRisk: string[];
  risks: RamsRisk[];
  methodSteps: { step: string; detail: string }[];
  ppe: string[];
  emergencyArrangements: string[];
}
