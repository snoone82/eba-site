/**
 * Structured-output JSON schema for COSHH assessment generation.
 *
 * THE HARD RULE, enforced here and in the prompt: a real COSHH assessment is
 * based on the manufacturer's Safety Data Sheet for the specific product in
 * use. The model must NEVER invent H-statements, workplace exposure limits, or
 * product-specific figures — where SDS data is needed the output says
 * "confirm against the manufacturer's SDS". The generated document is a
 * structured draft that a competent person completes against the real SDS.
 */
export const COSHH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "compliance",
    "substanceOrTask",
    "hazardSummary",
    "exposureRoutes",
    "personsAtRisk",
    "controlMeasures",
    "ppe",
    "storageAndHandling",
    "spillage",
    "firstAid",
    "disposal",
  ],
  properties: {
    title: { type: "string", description: '"COSHH Assessment — <Substance or task>"' },
    compliance: {
      type: "string",
      description:
        'Normally "Control of Substances Hazardous to Health Regulations 2002 (COSHH)". Never invent a regulation.',
    },
    substanceOrTask: {
      type: "string",
      description: "The substance, product type, or task assessed, as given by the user.",
    },
    hazardSummary: {
      type: "string",
      description:
        "2–3 sentences on the GENERAL nature of the hazard for this substance/task type. NEVER cite specific H-statements, exposure limits, or product data — direct the reader to the manufacturer's SDS for those.",
    },
    exposureRoutes: {
      type: "array",
      items: { type: "string" },
      description: 'The plausible routes for this substance type: e.g. "Inhalation of vapour", "Skin contact".',
    },
    personsAtRisk: { type: "array", items: { type: "string" }, description: "3–5 entries." },
    controlMeasures: {
      type: "array",
      items: { type: "string" },
      description:
        "5–8 specific measures in hierarchy-of-control order: elimination/substitution first, then engineering controls, then safe working, PPE last.",
    },
    ppe: {
      type: "array",
      items: { type: "string" },
      description:
        'PPE appropriate to this substance type. Where glove/respirator TYPE depends on the product, say "as specified by the manufacturer\'s SDS" rather than guessing.',
    },
    storageAndHandling: { type: "array", items: { type: "string" }, description: "3–5 practical entries." },
    spillage: { type: "array", items: { type: "string" }, description: "3–5 steps for a spill of this substance type." },
    firstAid: {
      type: "array",
      items: { type: "string" },
      description:
        "First-aid responses per exposure route. General good practice only — defer to the SDS for product-specific instructions.",
    },
    disposal: { type: "array", items: { type: "string" }, description: "2–4 entries; defer to SDS/waste regs for specifics." },
  },
} as const;

export interface CoshhDocument {
  title: string;
  compliance: string;
  substanceOrTask: string;
  hazardSummary: string;
  exposureRoutes: string[];
  personsAtRisk: string[];
  controlMeasures: string[];
  ppe: string[];
  storageAndHandling: string[];
  spillage: string[];
  firstAid: string[];
  disposal: string[];
}
