import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

export default function ClinicalApproach() {
  return (
    <PublicLayout>
      <PageHero
        title="Clinical Intelligence Should Be Explainable"
        intro={
          <p>
            Predict Disease separates clinical rules, screening logic and AI assistance rather than
            treating every function as a black-box AI prediction.
          </p>
        }
      />
      <PageBody>
        <Section heading="Established Clinical Criteria">
          <p>
            Where recognized clinical thresholds exist, use explicit clinical logic rather than
            asking a generative model to invent a classification.
          </p>
        </Section>
        <Section heading="Screening Priority">
          <p>
            Risk factors and validated screening approaches can identify patients who may benefit
            from additional evaluation. Screening priority is not a diagnosis.
          </p>
        </Section>
        <Section heading="AI Assistance">
          <p>
            Generative AI may help summarize information, organize conversations, extract relevant
            context and suggest questions. AI-generated content requires clinician review.
          </p>
        </Section>
        <Section heading="Data Quality">
          <p>
            Missing, outdated or conflicting information can materially affect interpretation.
            Predict Disease should surface uncertainty rather than hiding it.
          </p>
        </Section>
        <Section heading="Professional Judgment">
          <p>
            The clinician remains responsible for understanding the complete patient context and
            making clinical decisions.
          </p>
        </Section>
        <Section heading="Current Product Status">
          <p>
            Predict Disease is currently a clinical decision-support prototype. Clinical
            functionality must undergo appropriate review and validation before production
            deployment.
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
