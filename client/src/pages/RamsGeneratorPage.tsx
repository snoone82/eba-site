/**
 * /rams-generator — the RAMS Generator, SUBSCRIBER-ONLY.
 * Thin wrapper over MemberGeneratorPage; behaviour and access model live there.
 * noIndex, not in nav or sitemap — subscribers arrive via their personal link.
 */
import { MemberGeneratorPage } from "@/components/MemberGeneratorPage";
import { PAGE_SEO } from "@/components/Seo";

export function RamsGeneratorPage() {
  return (
    <MemberGeneratorPage
      config={{
        toolKey: "rams",
        seo: PAGE_SEO.ramsGenerator,
        kicker: "RAMS Generator · Subscriber tool",
        heading: "A draft RAMS in minutes, not an afternoon.",
        intro:
          "Describe the activity and the generator produces a structured risk assessment and method statement — hazards, controls, safe system of work, sign-off sheet — as a branded PDF, ready for a competent person to review and adapt.",
        endpoint: "/api/generate-rams",
        subjectField: {
          key: "activity",
          label: "Activity",
          placeholder: "e.g. Installing ductwork at height from mobile scaffold",
          required: true,
        },
        extraFields: [
          { key: "trade", label: "Trade", placeholder: "e.g. Mechanical / HVAC" },
          { key: "site", label: "Site type", placeholder: "e.g. Occupied office, live plant room" },
        ],
        honestyNote:
          "The generator writes a structured draft from the activity you describe. It does not know your site, your kit or your people — the competent-person review is where it becomes a real RAMS, and every PDF carries that requirement on the sign-off sheet.",
        buttonLabel: "Generate RAMS →",
        resultNoun: "RAMS",
      }}
    />
  );
}
