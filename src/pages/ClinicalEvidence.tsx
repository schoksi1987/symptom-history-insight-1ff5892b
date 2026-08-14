import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";

const LABELS = [
  ["Established Clinical Criteria", "Recognized clinical thresholds or rules."],
  [
    "Validated Screening Instruments",
    "Published screening methods designed to identify individuals who may need testing or review.",
  ],
  ["Research Evidence", "Peer-reviewed findings providing relevant clinical context."],
  ["AI-Generated Assistance", "Generated or summarized material requiring human review."],
];

const SOURCES = [
  { name: "CDC — National Diabetes Statistics Report", url: "https://www.cdc.gov/diabetes/php/data-research/index.html" },
  { name: "NIH / NIDDK — Diabetes Prevention Program", url: "https://www.niddk.nih.gov/about-niddk/research-areas/diabetes/diabetes-prevention-program-dpp" },
  { name: "American Diabetes Association — Standards of Care", url: "https://diabetesjournals.org/care" },
  { name: "FDA — Digital Health and Clinical Decision Support Software", url: "https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software" },
];

export default function ClinicalEvidence() {
  return (
    <PublicLayout>
      <PageHero
        title="Evidence should be visible, not implied."
        intro={
          <p>
            Predict Disease is being designed around established clinical guidance, validated
            screening approaches, peer-reviewed evidence, and transparent logic. Predict Disease
            itself has not undergone clinical validation.
          </p>
        }
      />
      <PageBody>
        <Section heading="How evidence is recorded">
          <p>Evidence records in the platform support fields such as:</p>
          <Bullets
            items={[
              "Source organization or publication",
              "Title",
              "Publication date",
              "Study or guideline type",
              "Population",
              "Sample size where applicable",
              "Relevant finding",
              "Link to source",
              "Relevance to the product feature",
            ]}
          />
        </Section>

        <Section heading="Evidence labels">
          <div className="grid gap-4 sm:grid-cols-2">
            {LABELS.map(([title, body]) => (
              <Card key={title} className="p-5">
                <Badge variant="secondary" className="mb-2">
                  {title}
                </Badge>
                <p className="text-sm text-muted-foreground">{body}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section heading="Sources">
          <ul className="space-y-2">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-primary underline underline-offset-4"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
