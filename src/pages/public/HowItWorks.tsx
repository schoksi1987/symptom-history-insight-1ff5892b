import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicLayout, PageHero, PageBody } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

const STEPS = [
  {
    title: "Bring information together",
    body: "Clinical information, laboratory results, family history, examination findings, and relevant lifestyle/social context can be organized into one view.",
  },
  {
    title: "Evaluate available evidence",
    body: "The system evaluates applicable screening information and identifies missing or inconsistent data.",
  },
  {
    title: "Explain the result",
    body: "Clinicians should be able to see why attention is being suggested rather than receiving an unexplained score.",
  },
  {
    title: "Support the conversation",
    body: "Visit-assistance capabilities can help surface information worth clarifying during the encounter.",
  },
  {
    title: "Review the next action",
    body: "Suggested actions remain subject to clinician judgment.",
  },
];

function Content() {
  const { openDemoRequest } = useDemoRequest();
  return (
    <>
      <PageHero title="From patient information to clinician action" />
      <PageBody>
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <Card key={s.title} className="flex gap-4 p-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-1 text-muted-foreground">{s.body}</p>
              </div>
            </Card>
          ))}
        </div>
        <Button size="lg" onClick={openDemoRequest}>
          Request a Demo
        </Button>
      </PageBody>
    </>
  );
}

export default function HowItWorks() {
  return (
    <PublicLayout>
      <Content />
    </PublicLayout>
  );
}
