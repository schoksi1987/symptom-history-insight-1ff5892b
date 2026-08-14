import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

export default function ClinicalApproach() {
  return (
    <PublicLayout>
      <PageHero title="Clinical intelligence should be explainable." />
      <PageBody>
        <Section heading="Established clinical criteria">
          <p>
            Where established criteria exist, use explicit logic and thresholds rather than
            generative AI to invent classifications.
          </p>
        </Section>
        <Section heading="Screening tools">
          <p>
            Validated screening instruments may be used to identify patients who warrant additional
            evaluation. Screening does not equal diagnosis.
          </p>
        </Section>
        <Section heading="AI assistance">
          <p>
            AI can assist with organizing information, transcription, summarization, extraction, and
            question suggestions.
          </p>
          <p>AI-generated information must remain clearly identifiable and reviewable.</p>
        </Section>
        <Section heading="Data quality">
          <p>Missing, stale, conflicting, or uncertain information should be visible.</p>
        </Section>
        <Section heading="Human decision-making">
          <p>
            The clinician remains responsible for interpreting the patient's circumstances and making
            clinical decisions.
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
