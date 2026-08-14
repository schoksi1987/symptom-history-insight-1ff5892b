import { Button } from "@/components/ui/button";
import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

function Content() {
  const { openDemoRequest } = useDemoRequest();
  return (
    <>
      <PageHero
        title="Build Better Diabetes Screening Workflows With Us"
        intro={
          <p>
            Predict Disease is interested in collaborating with organizations focused on earlier
            diabetes identification, prevention and primary-care workflow improvement.
          </p>
        }
      />
      <PageBody>
        <Section heading="Potential collaborators">
          <Bullets
            items={[
              "Primary care practices",
              "Medical groups",
              "Health systems",
              "Payers",
              "Diabetes prevention organizations",
              "Academic researchers",
              "Clinical informatics teams",
            ]}
          />
        </Section>
        <Section heading="Potential collaboration areas">
          <Bullets
            items={[
              "Workflow pilots",
              "Clinical evaluation",
              "Research",
              "Data integration",
              "Usability testing",
              "Outcome measurement",
            ]}
          />
        </Section>
        <Button size="lg" onClick={openDemoRequest}>
          Discuss a Partnership
        </Button>
      </PageBody>
    </>
  );
}

export default function Partnerships() {
  return (
    <PublicLayout
      seo={{
        title: "Partnerships",
        description: "Partnership and evaluation opportunities with Predict Disease by symptom.ai.",
        path: "/partnerships",
      }}
    >
      <Content />
    </PublicLayout>
  );
}
