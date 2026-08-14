import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

const PRINCIPLES = [
  [
    "Transparency",
    "Users should be able to distinguish established clinical criteria from AI-generated content.",
  ],
  ["Explainability", "Important assessments should show information contributing to the result."],
  ["Human Oversight", "AI suggestions require professional review."],
  ["Uncertainty", "Missing, outdated and conflicting information should be surfaced."],
  [
    "Data Separation",
    "Synthetic demonstration data remains separate from real patient information.",
  ],
  ["Traceability", "Important AI-assisted and clinician actions should be auditable."],
  [
    "Evaluation",
    "Clinical and AI functionality should be tested and evaluated before expanded clinical use.",
  ],
];

export default function ResponsibleAI() {
  return (
    <PublicLayout
      seo={{
        title: "Responsible AI",
        description: "How Predict Disease by symptom.ai approaches transparency, data quality, and clinician oversight of AI-assisted features.",
        path: "/responsible-ai",
      }}
    >
      <PageHero title="Responsible AI at Predict Disease" />
      <PageBody>
        {PRINCIPLES.map(([heading, body]) => (
          <Section key={heading} heading={heading}>
            <p>{body}</p>
          </Section>
        ))}
      </PageBody>
    </PublicLayout>
  );
}
