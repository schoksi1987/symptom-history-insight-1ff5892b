import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicLayout, PageHero, PageBody, Bullets } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

const SECTIONS = [
  {
    id: "risk-review",
    heading: "Patient Risk Review",
    body: "Identify patients who may require screening or additional clinical review, and understand the specific clinical, family, lifestyle and social information behind why they were surfaced.",
    bullets: [
      "Screening status against established criteria",
      "Contributing clinical and contextual factors",
      "Data completeness for the current assessment",
    ],
  },
  {
    id: "population",
    heading: "Population Prioritization",
    body: "Help care teams understand which patients may require attention rather than requiring manual review of every record.",
    bullets: [
      "Patients overdue for screening",
      "Prediabetes follow-up",
      "Previously abnormal glucose results",
    ],
  },
  {
    id: "visit-copilot",
    heading: "Visit Copilot",
    prototype: true,
    body: "Support the clinical conversation with consent-based transcription, information extraction, relevant follow-up questions and physician review.",
    bullets: [
      "Consent-based transcription",
      "Extracted information presented for clinician confirmation",
      "Suggested follow-up questions",
    ],
  },
  {
    id: "context",
    heading: "Lifestyle & Social Context",
    body: "Capture relevant lifestyle, health-related social needs and emotional or social context without automatically turning free-text information into diagnoses.",
    bullets: [
      "Structured lifestyle information",
      "Health-related social needs",
      "Free-text context retained as context, not diagnosis",
    ],
  },
  {
    id: "decision-summary",
    heading: "Clinical Decision Summary",
    body: "Bring clinical status, supporting evidence, data-quality concerns and suggested actions into one reviewable workspace.",
    bullets: [
      "Supporting evidence for the current status",
      "Known gaps and conflicts",
      "Suggested actions the clinician can accept, modify or dismiss",
    ],
  },
  {
    id: "quality",
    heading: "Data Quality & Explainability",
    body: "Missing, stale or conflicting information is surfaced rather than hidden, and AI-generated content stays clearly identifiable.",
    bullets: [
      "Data completeness indicators",
      "Stale or conflicting value flags",
      "Clear separation of clinical criteria and AI-generated assistance",
    ],
  },
];

function Content() {
  const { openDemoRequest } = useDemoRequest();
  return (
    <>
      <PageHero
        title="One Workspace for Earlier Diabetes Risk Review"
        intro={
          <p>
            Predict Disease organizes the information relevant to diabetes screening and clinical
            review so care teams can see who may need attention and why.
          </p>
        }
      />
      <PageBody>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 space-y-3">
            <h2 className="flex flex-wrap items-center gap-2 text-2xl font-semibold">
              {s.heading}
              {s.prototype && (
                <Badge variant="secondary" className="font-normal">
                  Prototype / planned
                </Badge>
              )}
            </h2>
            <p className="text-muted-foreground">{s.body}</p>
            <Bullets items={s.bullets} />
          </section>
        ))}

        <p className="border-l-4 border-primary pl-4 italic text-muted-foreground">
          Predict Disease is a clinical decision-support prototype and does not independently
          diagnose or prescribe treatment.
        </p>

        <Button size="lg" onClick={openDemoRequest}>
          Request a Demo
        </Button>
      </PageBody>
    </>
  );
}

export default function Platform() {
  return (
    <PublicLayout
      seo={{
        title: "Platform Overview",
        description: "Explore the Predict Disease by symptom.ai workspace: patient risk review, visit copilot, lifestyle and social context, and clinical decision summaries.",
        path: "/platform",
      }}
    >
      <Content />
    </PublicLayout>
  );
}
