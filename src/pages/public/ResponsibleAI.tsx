import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

const SECTIONS = [
  ["Transparency", "Clearly distinguish established clinical logic from AI-generated content."],
  ["Explainability", "Important assessments should expose their contributing information."],
  ["Human Oversight", "AI-generated suggestions require clinician review."],
  ["Uncertainty", "Missing and conflicting information should be surfaced."],
  [
    "Data Separation",
    "Synthetic demonstration information remains separate from real patient information.",
  ],
  ["Traceability", "Important clinical and AI-assisted actions should be auditable."],
  ["Evaluation", "Clinical and AI functions should be tested before expanded use."],
];

export default function ResponsibleAI() {
  return (
    <PublicLayout>
      <PageHero title="AI should assist clinical reasoning, not hide it." />
      <PageBody>
        {SECTIONS.map(([heading, body]) => (
          <Section key={heading} heading={heading}>
            <p>{body}</p>
          </Section>
        ))}
      </PageBody>
    </PublicLayout>
  );
}
