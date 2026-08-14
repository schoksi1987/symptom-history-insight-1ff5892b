import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";

export default function Implementation() {
  return (
    <PublicLayout>
      <PageHero
        title="Implementing Predict Disease"
        intro={
          <p>
            Predict Disease is designed for incremental evaluation rather than an immediate
            organization-wide rollout.
          </p>
        }
      />
      <PageBody>
        <Section heading="Step 1 — Define the Use Case">
          <Bullets
            items={[
              "Patients overdue for screening",
              "Preventive primary care",
              "Prediabetes follow-up",
              "Previously abnormal glucose results",
              "Population outreach",
            ]}
          />
        </Section>
        <Section heading="Step 2 — Identify Available Information">
          <p>Review availability of:</p>
          <Bullets
            items={[
              "Demographics",
              "Laboratory results",
              "Diagnoses",
              "Medications",
              "Family history",
              "Examination findings",
              "Lifestyle information",
              "Health-related social needs",
            ]}
          />
        </Section>
        <Section heading="Step 3 — Define the Clinical Workflow">
          <Bullets
            items={[
              "Who reviews surfaced patients",
              "When information is reviewed",
              "Who owns follow-up",
              "How clinician decisions are documented",
            ]}
          />
        </Section>
        <Section heading="Step 4 — Test With Synthetic Data">
          <p>
            Start with synthetic or appropriately governed test data before introducing identifiable
            patient information.
          </p>
        </Section>
        <Section heading="Step 5 — Validate the Workflow">
          <p>
            Evaluate data quality, usability, clinical reasoning, false positives and negatives, and
            clinician interpretation.
          </p>
        </Section>
        <Section heading="Step 6 — Measure Outcomes">
          <Bullets
            items={[
              "Screening completion",
              "Time to follow-up",
              "Missing-data identification",
              "Clinician review efficiency",
              "Prevention-program referral",
              "Workflow adoption",
            ]}
          />
        </Section>
        <Section heading="Integration and governance">
          <p>
            Designed to support integration with clinical data sources as implementation capabilities
            mature.
          </p>
          <p>
            Production use involving identifiable health information requires appropriate security,
            privacy, contractual, clinical and regulatory review.
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
