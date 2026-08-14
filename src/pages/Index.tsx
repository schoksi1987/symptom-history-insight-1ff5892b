import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  ClipboardCheck,
  Eye,
  Layers,
  MessageSquare,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

const CHALLENGE = [
  { stat: "38M+", label: "People in the United States living with diabetes.", source: "CDC" },
  { stat: "98M", label: "U.S. adults with prediabetes.", source: "CDC" },
  {
    stat: "$412.9B",
    label: "Estimated annual U.S. economic cost of diagnosed diabetes in 2022.",
    source: "American Diabetes Association",
  },
  {
    stat: "58%",
    label:
      "Reduction in development of type 2 diabetes observed in the NIH Diabetes Prevention Program intensive lifestyle intervention versus placebo.",
    source: "NIH/NIDDK Diabetes Prevention Program",
  },
];

const STAGES = [
  { icon: Search, title: "Screen", body: "Bring together available clinical and contextual information." },
  { icon: Layers, title: "Understand", body: "Identify relevant signals, missing information, and potential conflicts." },
  { icon: Eye, title: "Review", body: "Show why the patient was flagged and what information contributed." },
  { icon: ClipboardCheck, title: "Act", body: "Present potential next actions for clinician review." },
];

const CAPABILITIES = [
  {
    icon: Stethoscope,
    title: "Patient Risk Review",
    body: "Understand the information contributing to a patient's current screening or clinical-review status.",
  },
  {
    icon: MessageSquare,
    title: "Visit Copilot",
    body: "Support the patient conversation with transcription, extracted information, and focused follow-up suggestions requiring clinician review.",
  },
  {
    icon: Users,
    title: "Lifestyle & Social Context",
    body: "Capture relevant lifestyle, health-related social needs, and emotional/social context alongside clinical information.",
  },
  {
    icon: ClipboardCheck,
    title: "Clinical Decision Summary",
    body: "Bring evidence, missing information, contextual factors, and suggested next actions into one reviewable workspace.",
  },
  {
    icon: Layers,
    title: "Population Prioritization",
    body: "Help care teams identify which patients may require review, follow-up, or additional screening.",
  },
];

const REASONING = [
  {
    title: "Evidence-informed screening",
    body: "Uses recognized screening approaches and established clinical thresholds rather than unexplained AI-generated probabilities.",
  },
  {
    title: "Explainable factors",
    body: "Shows the clinical, family, lifestyle, and social information contributing to an assessment.",
  },
  {
    title: "Clinician in control",
    body: "Suggested actions are presented for professional review and can be accepted, modified, or dismissed.",
  },
  {
    title: "Data-quality awareness",
    body: "Surfaces missing, outdated, or conflicting information instead of hiding uncertainty.",
  },
];

const STEPS = [
  "Bring relevant patient information together.",
  "Evaluate available screening evidence and data quality.",
  "Explain why attention may be required.",
  "Support the clinician-patient conversation.",
  "Present next actions for clinician review.",
];

const TRUST = [
  "Transparent clinical logic",
  "Evidence sources",
  "Data-quality awareness",
  "Human review",
  "AI-content identification",
  "Auditability",
];

const AUDIENCES = [
  {
    title: "Primary Care Physicians",
    body: "Identify patients who may need screening or follow-up and understand why.",
  },
  { title: "Care Teams", body: "Coordinate screening, patient outreach, and follow-up work." },
  {
    title: "Medical Groups & Health Systems",
    body: "Prioritize populations and support consistent clinical workflows.",
  },
];

function Home() {
  const navigate = useNavigate();
  const { openDemoRequest } = useDemoRequest();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-100 via-orange-50 to-background" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
                Earlier diabetes risk identification.{" "}
                <span className="text-primary">Better-informed primary care.</span>
              </h1>
              <p className="mt-8 text-xl text-muted-foreground">
                Predict Disease brings screening, clinical information, family history, lifestyle and
                social context, and AI-assisted visit intelligence together to help primary care teams
                identify patients who may need attention and determine what to review next.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Designed to make diabetes screening more explainable, actionable, and connected to the
                patient conversation.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button size="lg" className="h-auto px-8 py-6 text-lg" onClick={openDemoRequest}>
                  Request a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto px-8 py-6 text-lg"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              </div>
              <Link
                to="/auth?mode=signup"
                className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
              >
                Create an Account
              </Link>

              <p className="mt-6 text-sm text-muted-foreground">
                Clinical decision-support prototype. Designed to support — not replace — professional
                clinical judgment.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-2xl">
              <img
                src="/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png"
                alt="Predict Disease clinical review workspace showing patient screening information"
                className="h-auto w-full rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Diabetes challenge */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">The Diabetes Challenge</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CHALLENGE.map((c) => (
              <Card key={c.stat} className="border-2 p-8 text-center">
                <div className="mb-3 text-4xl font-bold text-primary">{c.stat}</div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-3 text-xs text-muted-foreground">Source: {c.source}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm">
            <Link to="/clinical-evidence" className="text-primary underline underline-offset-4">
              Sources
            </Link>
          </p>
        </div>
      </section>

      {/* What Predict Disease does */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">
            From screening signals to a reviewable next step.
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s) => (
              <Card key={s.title} className="border-2 p-6">
                <s.icon className="mb-4 h-9 w-9 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core capabilities */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">Core Capabilities</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <Card key={c.title} className="border-2 p-6">
                <c.icon className="mb-4 h-9 w-9 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent clinical reasoning */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">
            Built around transparent clinical reasoning
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {REASONING.map((r) => (
              <Card key={r.title} className="border-2 p-8">
                <h3 className="mb-2 text-xl font-semibold">{r.title}</h3>
                <p className="text-muted-foreground">{r.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">How It Works</h2>
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-4 rounded-lg border bg-card p-5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="pt-1.5">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button size="lg" asChild>
              <Link to="/how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">
            Clinical intelligence should be understandable.
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map((t) => (
              <Card key={t} className="flex items-center gap-3 border-2 p-6">
                <ShieldCheck className="h-6 w-6 flex-shrink-0 text-primary" />
                <span className="font-medium">{t}</span>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/clinical-approach">Explore Our Clinical Approach</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">Who It Is For</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <Card key={a.title} className="border-2 p-8">
                <h3 className="mb-2 text-xl font-semibold">{a.title}</h3>
                <p className="text-muted-foreground">{a.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold lg:text-4xl">
            See Predict Disease in a realistic primary-care workflow.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Explore the physician dashboard, patient risk review, lifestyle and social context, Visit
            Copilot experience, and Clinical Decision Summary using synthetic patient information.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={openDemoRequest}>
              Request a Demo
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth?mode=signup">Create an Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

const Index = () => (
  <PublicLayout>
    <Home />
  </PublicLayout>
);

export default Index;
