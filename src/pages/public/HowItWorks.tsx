import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicLayout, PageHero, PageBody } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

const STEPS = [
  {
    title: "Bring Information Together",
    body: "Clinical data, laboratory results, history and contextual information are organized around the patient.",
  },
  {
    title: "Evaluate Available Evidence",
    body: "The system evaluates applicable screening rules and checks whether information is sufficiently complete and internally consistent.",
  },
  {
    title: "Explain Why the Patient Was Flagged",
    body: "Clinicians can see the information contributing to the current status.",
  },
  {
    title: "Support the Visit",
    body: "The Visit Copilot can assist with questions, conversation context and structured information review where enabled.",
  },
  {
    title: "Review the Next Action",
    body: "Suggestions remain reviewable. The clinician decides whether to accept, modify or dismiss an action.",
  },
];

function Content() {
  const { openDemoRequest } = useDemoRequest();
  return (
    <>
      <PageHero title="From Screening Signal to Clinician Decision" />
      <PageBody>
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Card className="flex items-start gap-4 p-5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-semibold">{s.title}</h2>
                  <p className="mt-1 text-muted-foreground">{s.body}</p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
        <Button size="lg" onClick={openDemoRequest}>
          Request a Demo
        </Button>
      </PageBody>
    </>
  );
}

export default function HowItWorks() {
  return (
    <PublicLayout
      seo={{
        title: "How It Works",
        description: "See the four-step Predict Disease workflow: review patient information, complete the clinical and SDOH assessment, evaluate screening priority, and review next steps.",
        path: "/how-it-works",
      }}
    >
      <Content />
    </PublicLayout>
  );
}
