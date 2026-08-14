import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";

export default function Implementation() {
  return (
    <PublicLayout>
      <PageHero title="Getting started with Predict Disease" />
      <PageBody>
        <Section heading="Step 1 — Define the use case">
          <Bullets
            items={[
              "Preventive primary-care screening",
              "Overdue diabetes screening",
              "Abnormal glucose follow-up",
              "Prediabetes follow-up",
              "Population outreach",
            ]}
          />
        </Section>
        <Section heading="Step 2 — Determine available information">
          <Bullets
            items={[
              "Demographics",
              "Laboratory results",
              "Diagnoses",
              "Medications",
              "Family history",
              "Observations",
              "Lifestyle factors",
              "Health-related social needs",
            ]}
          />
        </Section>
        <Section heading="Step 3 — Define the clinical workflow">
          <p>
            Determine who reviews signals, who follows up, and how clinical decisions are documented.
          </p>
        </Section>
        <Section heading="Step 4 — Validate the workflow">
          <p>Start with synthetic or appropriately governed test information.</p>
        </Section>
        <Section heading="Step 5 — Measure results">
          <p>
            Potential workflow measures include screening completion, follow-up time, data
            completeness, clinician review efficiency, and appropriate preventive-program referral.
          </p>
          <p className="text-sm">
            These are workflow measures only. Predict Disease does not claim validated clinical
            improvements.
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
