import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  ClipboardList,
  FileSearch,
  HeartPulse,
  ListChecks,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { SOURCES } from "@/content/sources";

const STATS = [
  {
    stat: "38.4M",
    label: "People in the United States living with diagnosed or undiagnosed diabetes.",
    source: "CDC National Diabetes Statistics Report",
    year: "2024",
    url: SOURCES.cdc,
  },
  {
    stat: "97.6M",
    label: "U.S. adults aged 18 years or older estimated to have prediabetes.",
    source: "CDC National Diabetes Statistics Report",
    year: "2024",
    url: SOURCES.cdc,
  },
  {
    stat: "Adults 35–70",
    label:
      "USPSTF recommends screening for prediabetes and type 2 diabetes in adults aged 35 to 70 years who have overweight or obesity.",
    source: "U.S. Preventive Services Task Force",
    year: "2021",
    url: SOURCES.uspstf,
  },
  {
    stat: "58% / 31%",
    label:
      "Study findings from the Diabetes Prevention Program: reduction in progression to type 2 diabetes with a structured lifestyle intervention (58%) and with metformin (31%) compared with placebo. These are published trial results, not Predict Disease outcomes.",
    source: "NIH / NIDDK Diabetes Prevention Program",
    year: "Trial results",
    url: SOURCES.dpp,
  },
];

const SCATTERED = [
  "Clinical history and laboratory results",
  "Family history",
  "Lifestyle and activity",
  "Symptoms and observations",
  "Behavioral and mental-health factors, when relevant",
  "Social determinants such as food access, transportation, housing, and access to care",
];

const STEPS = [
  {
    icon: FileSearch,
    title: "Review patient information",
    body: "Bring together what is already known about the patient before the visit.",
  },
  {
    icon: ClipboardList,
    title: "Complete the clinical and SDOH assessment",
    body: "Work through short, structured steps instead of one long form.",
  },
  {
    icon: ListChecks,
    title: "Evaluate screening priority and supporting evidence",
    body: "See the priority level along with the factors and data that produced it.",
  },
  {
    icon: ClipboardCheck,
    title: "Review suggested clinical next steps",
    body: "Accept, modify, or dismiss suggestions using professional judgment.",
  },
];

const OUTPUT = [
  "Screening priority: Routine, Consider Screening, or Prioritize Screening",
  "Assessment confidence",
  "Data-completeness score",
  "Factors increasing screening priority",
  "Factors reducing or moderating concern",
  "Supporting clinical evidence",
  "Missing information",
  "Conflicting information",
  "Suggested next steps",
  "Rules or model version used",
  "Date and time of assessment",
];

const TRANSPARENCY = [
  "Why the result was generated",
  "Which data contributed to it",
  "Which important data is missing",
  "Whether conflicting information was detected",
  "Which screening-rule version was applied",
];

const AUDIENCES = [
  { title: "Primary-care physicians", body: "Understand screening priority and the reasoning behind it during the visit." },
  { title: "Nurses and care managers", body: "Coordinate assessments, outreach, and follow-up for patients who need review." },
  { title: "Population-health teams", body: "Identify screening priorities across a panel rather than record by record." },
  { title: "Clinical informatics teams", body: "Inspect rule versions, data completeness, and assessment provenance." },
  { title: "Healthcare organizations", body: "Evaluate preventive-care workflows before broader adoption." },
];

/** Fictional patient used for the product preview. No real patient data. */
const DEMO_PATIENT = {
  name: "Jordan Lee",
  age: 52,
  priority: "Consider Screening",
  increasing: ["BMI 31.2", "First-degree family history of type 2 diabetes", "Limited access to fresh food"],
  moderating: ["Blood pressure within range", "Active 3 days per week"],
  missing: ["No HbA1c on file in the last 12 months"],
};

function PreviewCard() {
  return (
    <Card className="border-2 p-6 shadow-lg" aria-label="Product preview using fictional demo data">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Patient: {DEMO_PATIENT.name}</p>
          <p className="text-xs text-muted-foreground">
            Age {DEMO_PATIENT.age} · Fictional record · No identifiers
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          Demo Data
        </Badge>
      </div>

      <div className="rounded-lg border bg-accent/60 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Type 2 Diabetes Screening Priority
        </p>
        <p className="mt-1 text-2xl font-bold text-primary">{DEMO_PATIENT.priority}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on the information available, this patient may benefit from prioritized clinical
          review for Type 2 diabetes screening.
        </p>
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold text-foreground">Factors increasing priority</dt>
          <dd>
            <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
              {DEMO_PATIENT.increasing.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-foreground">Moderating factors</dt>
          <dd>
            <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
              {DEMO_PATIENT.moderating.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Missing information: </span>
        {DEMO_PATIENT.missing.join("; ")}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Illustrative preview with fictional data. Clinical decision support — not a diagnosis.
      </p>
    </Card>
  );
}

function Home() {
  const navigate = useNavigate();
  const { openDemoRequest } = useDemoRequest();
  const { user } = useAuth();
  const { status } = useWorkspace();
  const approved = Boolean(user) && status === "approved";

  const tryDemo = () => (approved ? navigate("/dashboard") : openDemoRequest());

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-gradient-to-br from-accent via-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
                Predict Disease by symptom.ai
              </p>
              <h1 className="text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                Identify patients who may need Type 2 diabetes screening—earlier.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Predict Disease brings together clinical history, family history, lifestyle factors,
                and social determinants of health to help primary-care teams identify screening
                priorities, understand contributing factors, and determine appropriate next steps.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={tryDemo}>
                  Try the Clinical Demo
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/how-it-works">See How It Works</Link>
                </Button>
              </div>

              <p className="mt-4 text-sm font-medium text-foreground">
                Clinical decision support—not a diagnosis.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                The demo uses fictional patients only. Please do not enter real patient-identifying
                information. Review our{" "}
                <Link to="/privacy" className="text-primary underline underline-offset-4">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link to="/terms" className="text-primary underline underline-offset-4">
                  Terms of Use
                </Link>
                .
              </p>
            </div>

            <PreviewCard />
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">The problem</h2>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Information relevant to Type 2 diabetes risk is often distributed across records that are
            not always reviewed together during a primary-care visit.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SCATTERED.map((s) => (
              <Card key={s} className="p-5">
                <p className="text-sm text-foreground">{s}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
            Predict Disease organizes this information for review. It does not diagnose diabetes.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">How it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Card key={s.title} className="p-6">
                <s.icon className="mb-3 h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {i + 1}. {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link to="/how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Assessment output */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">What each assessment returns</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <ul className="space-y-3">
              {OUTPUT.map((o) => (
                <li key={o} className="flex gap-3 text-muted-foreground">
                  <ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
            <Card className="h-fit border-2 p-6">
              <AlertTriangle className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-foreground">No probability claims</h3>
              <p className="mt-2 text-muted-foreground">
                Predict Disease does not present a percentage as a patient's probability of
                developing diabetes. Screening priority is expressed as Routine, Consider Screening,
                or Prioritize Screening, together with the reasoning behind the level.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Clinical transparency */}
      <section className="border-y bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">
            Designed to support—not replace—clinical judgment
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Predict Disease organizes relevant information and highlights factors that may support
            Type 2 diabetes screening. Results should be reviewed by a qualified healthcare
            professional alongside the patient's complete medical history, current clinical
            condition, and applicable screening guidelines.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TRANSPARENCY.map((t) => (
              <Card key={t} className="p-5">
                <ShieldCheck className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm text-foreground">{t}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Intended use */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">Intended users</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <Card key={a.title} className="p-6">
                <Users className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">{a.title}</h3>
                <p className="text-sm text-muted-foreground">{a.body}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
            Patients may review shared recommendations and reports through their own secure access.
            Clinical interpretation belongs to qualified healthcare professionals.
          </p>
        </div>
      </section>

      {/* Evidence and sources */}
      <section className="border-y bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">Evidence and sources</h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Every figure below is published by an authoritative source and linked directly. Predict
            Disease makes no claim of clinical validation, improved outcomes, regulatory clearance,
            or FDA approval.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STATS.map((c) => (
              <Card key={c.stat} className="flex flex-col p-6">
                <div className="mb-3 text-3xl font-bold text-primary">{c.stat}</div>
                <p className="flex-1 text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {c.source} ({c.year})
                </p>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-xs text-primary underline underline-offset-4"
                >
                  View source
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <HeartPulse className="mx-auto mb-4 h-8 w-8 text-primary" aria-hidden="true" />
          <h2 className="text-3xl font-bold text-foreground">
            See screening priority in a realistic clinical workflow.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The clinical demo uses fictional patients and stays separate from real clinical
            workspaces.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={tryDemo}>
              Try the Clinical Demo
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">See How It Works</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Clinical decision support—not a diagnosis.
          </p>
        </div>
      </section>
    </>
  );
}

const Index = () => (
  <PublicLayout
    seo={{
      title: "Predict Disease | Type 2 Diabetes Screening Support",
      description:
        "Predict Disease by symptom.ai helps primary-care teams combine clinical, family-history, lifestyle, and social-determinant information to identify Type 2 diabetes screening priorities.",
      path: "/",
    }}
  >
    <Home />
  </PublicLayout>
);

export default Index;
