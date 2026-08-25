/**
 * /coshh-generator — the COSHH Generator, SUBSCRIBER-ONLY.
 * Thin wrapper over MemberGeneratorPage; behaviour and access model live there.
 * noIndex, not in nav or sitemap — subscribers arrive via their personal link.
 */
import { MemberGeneratorPage } from "@/components/MemberGeneratorPage";
import { PAGE_SEO } from "@/components/Seo";

export function CoshhGeneratorPage() {
  return (
    <MemberGeneratorPage
      config={{
        toolKey: "coshh",
        seo: PAGE_SEO.coshhGenerator,
        kicker: "COSHH Generator · Subscriber tool",
        heading: "A structured COSHH draft, built to be checked against the SDS.",
        intro:
          "Name the substance or task and the generator produces a draft COSHH assessment — exposure routes, controls in hierarchy order, spillage, first aid, disposal — as a branded PDF. Product-specific data stays with the manufacturer's Safety Data Sheet, where it belongs.",
        endpoint: "/api/generate-coshh",
        subjectField: {
          key: "substance",
          label: "Substance or task",
          placeholder: "e.g. Solvent cement for PVC pipework",
          required: true,
        },
        extraFields: [
          { key: "trade", label: "Trade", placeholder: "e.g. Plumbing / Public health" },
          { key: "site", label: "Site type", placeholder: "e.g. Riser cupboard, confined space" },
        ],
        honestyNote:
          "A real COSHH assessment is completed against the manufacturer's Safety Data Sheet for the exact product in use. This tool deliberately never invents H-statements or exposure limits — it structures the assessment and marks every SDS-dependent field for the competent person to confirm.",
        buttonLabel: "Generate COSHH assessment →",
        resultNoun: "COSHH assessment",
      }}
    />
  );
}
