import { Card } from "@/components/ui/card";
import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";

const TOPICS = [
  {
    heading: "Getting Started",
    intro: "Help navigating:",
    items: [
      "Workspace",
      "Patient queue",
      "Assessments",
      "Demo mode",
      "Clinical summaries",
    ],
  },
  {
    heading: "Account & Access",
    intro: "Topics:",
    items: ["Pending approval", "Declined access", "Login issues", "Demo access", "Account roles"],
  },
  {
    heading: "Clinical Workflow",
    intro: "Topics:",
    items: [
      "Patient screening workflow",
      "Examinations",
      "Lifestyle & Social Context",
      "Clinical Decision Summary",
      "Clinician review actions",
    ],
  },
  {
    heading: "Technical Issues",
    intro: "Topics:",
    items: ["Missing data", "Application error", "Incorrect page state", "Integration issue"],
  },
];

export default function Support() {
  return (
    <PublicLayout>
      <PageHero title="Predict Disease Support" />
      <PageBody>
        {TOPICS.map((t) => (
          <Section key={t.heading} heading={t.heading}>
            <p>{t.intro}</p>
            <Bullets items={t.items} />
          </Section>
        ))}

        <Section heading="Product Feedback">
          <p>
            Predict Disease is actively evolving. Feedback from clinicians, care teams and healthcare
            organizations helps shape the product.
          </p>
          <Card className="p-5 text-sm text-muted-foreground">
            A support request system is not yet available in this prototype. Support topics are
            documented here so teams know what is covered; no support message can be submitted from
            this page at this time.
          </Card>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
