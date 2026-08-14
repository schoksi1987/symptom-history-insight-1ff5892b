import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

const QUESTIONS = [
  "Who may need attention?",
  "Why was the patient flagged?",
  "What information is missing or conflicting?",
  "What should the clinician review next?",
];

function Content() {
  const { openDemoRequest } = useDemoRequest();
  return (
    <>
      <PageHero
        title="Diabetes screening intelligence for primary care"
        intro={
          <p>
            Predict Disease helps care teams organize the information relevant to diabetes screening
            and clinical review.
          </p>
        }
      />
      <PageBody>
        <Section heading="The platform is designed around four questions">
          <div className="grid gap-4 sm:grid-cols-2">
            {QUESTIONS.map((q) => (
              <Card key={q} className="p-5 text-base font-medium text-foreground">
                {q}
              </Card>
            ))}
          </div>
        </Section>

        <Section heading="Capabilities">
          <Bullets
            items={[
              "Patient and population prioritization",
              "Clinical screening review",
              "Family-history context",
              "Lifestyle and social context",
              "Visit Copilot",
              "Clinical Decision Summary",
              "Evidence visibility",
              "Clinician review of suggested actions",
            ]}
          />
        </Section>

        <Section>
          <p className="border-l-4 border-primary pl-4 italic">
            Predict Disease is a clinical decision-support prototype and does not independently
            diagnose or prescribe treatment.
          </p>
        </Section>

        <Button size="lg" onClick={openDemoRequest}>
          Request a Demo
        </Button>
      </PageBody>
    </>
  );
}

export default function Platform() {
  return (
    <PublicLayout>
      <Content />
    </PublicLayout>
  );
}
