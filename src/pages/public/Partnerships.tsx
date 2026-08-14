import { Button } from "@/components/ui/button";
import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

function Content() {
  const { openDemoRequest } = useDemoRequest();
  return (
    <>
      <PageHero title="Build better diabetes screening workflows with us." />
      <PageBody>
        <Section heading="Potential collaborators">
          <Bullets
            items={[
              "Primary-care practices",
              "Medical groups",
              "Health systems",
              "Diabetes prevention organizations",
              "Academic researchers",
              "Clinical informatics teams",
              "Digital-health organizations",
            ]}
          />
        </Section>
        <Section heading="Potential collaboration">
          <Bullets
            items={[
              "Workflow pilots",
              "Product evaluation",
              "Research collaboration",
              "Data integration",
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
    <PublicLayout>
      <Content />
    </PublicLayout>
  );
}
