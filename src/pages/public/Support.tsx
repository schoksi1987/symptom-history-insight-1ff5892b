import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

function Content() {
  const { openDemoRequest } = useDemoRequest();
  return (
    <>
      <PageHero title="How can we help?" />
      <PageBody>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-3 text-lg font-semibold">Account &amp; Access</h2>
            <Bullets
              items={["Account approval", "Sign-in problems", "Demo access", "Organization information"]}
            />
          </Card>
          <Card className="p-6">
            <h2 className="mb-3 text-lg font-semibold">Clinical Workflow</h2>
            <Bullets
              items={[
                "Patient review",
                "Assessments",
                "Lifestyle & Social Context",
                "Clinical Decision Summary",
              ]}
            />
          </Card>
          <Card className="p-6">
            <h2 className="mb-3 text-lg font-semibold">Technical Support</h2>
            <Bullets items={["Application errors", "Missing information", "Unexpected behavior"]} />
          </Card>
          <Card className="p-6">
            <h2 className="mb-3 text-lg font-semibold">Product Feedback</h2>
            <p className="text-muted-foreground">
              We invite physicians and care teams to tell us what works, what does not, and what is
              missing from the clinical workflow.
            </p>
          </Card>
        </div>

        <Section>
          <p className="rounded-md border border-destructive/40 bg-destructive/5 p-4 font-medium text-foreground">
            Do not use Predict Disease support channels for medical emergencies or urgent
            patient-care decisions.
          </p>
        </Section>

        <Button size="lg" onClick={openDemoRequest}>
          Contact us
        </Button>
      </PageBody>
    </>
  );
}

export default function Support() {
  return (
    <PublicLayout>
      <Content />
    </PublicLayout>
  );
}
