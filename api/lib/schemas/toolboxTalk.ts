/**
 * Structured-output JSON schema for the toolbox-talk generation call.
 * Anthropic structured outputs don't support minLength/maxLength/min/max —
 * length/count guidance lives in the field `description`s and the system
 * prompt instead. Every object needs additionalProperties:false + required.
 */
export const TOOLBOX_TALK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "compliance", "intro", "sections", "validationQuestions"],
  properties: {
    title: { type: "string", description: '"<Topic> Toolbox Talk"' },
    compliance: {
      type: "string",
      description: 'Most relevant UK regulation, e.g. "Work at Height Regulations 2005"',
    },
    intro: {
      type: "string",
      description: "1–2 sentence opening: why it matters and who's affected.",
    },
    sections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["heading", "type"],
        properties: {
          heading: {
            type: "string",
            description:
              'e.g. "Key hazards", "Safe working", "Emergency procedures". Empty string for a lead-in paragraph.',
          },
          type: { type: "string", enum: ["paragraph", "bullets"] },
          text: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
      },
    },
    validationQuestions: {
      type: "array",
      items: { type: "string" },
      description: "5–7 understanding-check questions.",
    },
  },
} as const;

export interface ToolboxTalkSection {
  heading: string;
  type: "paragraph" | "bullets";
  text?: string;
  items?: string[];
}

export interface ToolboxTalk {
  title: string;
  compliance: string;
  intro: string;
  sections: ToolboxTalkSection[];
  validationQuestions: string[];
}
