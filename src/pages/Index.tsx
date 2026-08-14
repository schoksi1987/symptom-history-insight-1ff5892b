import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ClipboardCheck,
  Eye,
  HelpCircle,
  Layers,
  MessageSquare,
  Search,
  Stethoscope,
  Users,
} from "lucide-react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { useDemoRequest } from "@/components/public/DemoRequestContext";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { SOURCES } from "@/content/sources";

const CHALLENGE = [
  {
    stat: "38M+",
    label: "People in the United States living with diabetes.",
    source: "CDC",
    url: SOURCES.cdc,
  },
  {
    stat: "98M",
    label: "U.S. adults estimated to have prediabetes.",
    source: "CDC",
    url: SOURCES.cdc,
  },
  {
    stat: "$413B",
    label:
      "Approximate annual U.S. medical costs and lost work and wages associated with diagnosed diabetes.",
    source: "CDC",
    url: SOURCES.cdc,
  },
  {
    stat: "58%",
    label:
      "Reduction in progression to type 2 diabetes demonstrated in the Diabetes Prevention Program structured lifestyle intervention compared with placebo.",
    source: "NIH / NIDDK Diabetes Prevention Program",
    url: SOURCES.dpp,
  },
];

const REASONING = [
  {
    title: "Evidence-informed screening",
    body: "Established diabetes screening criteria and recognized clinical thresholds are used where applicable rather than unexplained AI-generated scores.",
  },
  {
    title: "Explainable factors",
    body: "Clinicians can see the clinical, family, lifestyle and social information contributing to an assessment.",
  },
  {
    title: "Data quality awareness",
    body: "Missing, stale or conflicting information should be surfaced rather than hidden.",
  },
  {
    title: "Clinician in control",
    body: "Suggested actions require professional review and may be accepted, modified or dismissed.",
  },
];

const WORKFLOW = [
  {
    icon: Search,
    title: "Identify",
    body: "Surface patients who may require diabetes screening, clinical review or follow-up.",
  },
  {
    icon: Layers,
    title: "Understand",
    body: "Bring relevant clinical information, laboratory results, family history and contextual factors together.",
  },
  {
    icon: HelpCircle,
    title: "Clarify",
    body: "Highlight missing, stale or conflicting information and support questions that may be useful during the visit.",
  },
  {
    icon: Eye,
    title: "Review",
    body: "Present the evidence and reasoning contributing to the patient's current status.",
  },
  {
    icon: ClipboardCheck,
    title: "Act",
    body: "Allow clinicians to review, modify or dismiss suggested next actions.",
  },
];

const CAPABILITIES = [
  {
    icon: Stethoscope,
    title: "Patient Risk Review",
    body: "Identify patients who may require screening or additional clinical review and understand the reason they were surfaced.",
    to: "/platform#risk-review",
  },
  {
    icon: MessageSquare,
    title: "Visit Copilot",
    body: "Support the clinical conversation with consent-based transcription, information extraction, relevant follow-up questions and physician review.",
    to: "/platform#visit-copilot",
    prototype: true,
  },
  {
    icon: Users,
    title: "Lifestyle & Social Context",
    body: "Capture relevant lifestyle, health-related social needs and emotional or social context without automatically turning free-text information into diagnoses.",
    to: "/platform#context",
  },
  {
    icon: ClipboardCheck,
    title: "Clinical Decision Summary",
    body: "Bring clinical status, supporting evidence, data-quality concerns and suggested actions into one reviewable workspace.",
    to: "/platform#decision-summary",
  },
  {
    icon: Layers,
    title: "Population Prioritization",
    body: "Help care teams understand which patients may require attention rather than requiring manual review of every record.",
    to: "/platform#population",
  },
];

const AUDIENCES = [
  {
    title: "Primary Care Physicians",
    body: "Quickly understand diabetes screening status, contributing information and potential next steps.",
  },
  {
    title: "Care Teams",
    body: "Coordinate screening, follow-up and prevention activity across patients requiring attention.",
  },
  {
    title: "Medical Groups & Health Systems",
    body: "Support consistent diabetes screening and review workflows across a patient population.",
  },
];

function Home() {
  const navigate = useNavigate();
  const { openDemoRequest } = useDemoRequest();
  const { user } = useAuth();
  const { status } = useWorkspace();
  const approved = Boolean(user) && status === "approved";

  const secondary = () => navigate(approved ? "/dashboard" : "/auth");
  const secondaryLabel = approved ? "Open Workspace" : "Sign In";

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
                social context, and AI-assisted visit intelligence together to help care teams
                identify patients who may need attention and decide what to do next.
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
                  onClick={secondary}
                >
                  {secondaryLabel}
                </Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Clinical decision-support prototype. Designed to support — not replace — professional
                medical judgment.
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
              <Card key={c.stat} className="flex flex-col border-2 p-8 text-center">
                <div className="mb-3 text-4xl font-bold text-primary">{c.stat}</div>
                <p className="flex-1 text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-4 text-xs text-muted-foreground">Source: {c.source}</p>
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

      {/* Transparent clinical reasoning */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">
            Built Around Transparent Clinical Reasoning
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {REASONING.map((r) => (
              <Card key={r.title} className="border-2 p-8">
                <h3 className="mb-2 text-xl font-semibold">{r.title}</h3>
                <p className="text-muted-foreground">{r.body}</p>
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

      {/* Workflow */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">
            From Patient Information to Clinical Action
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {WORKFLOW.map((s, i) => (
              <Card key={s.title} className="border-2 p-6">
                <s.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">
                  {i + 1}. {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button size="lg" asChild>
              <Link to="/how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core capabilities */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">
            Core Platform Capabilities
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <Card key={c.title} className="border-2 p-6">
                <c.icon className="mb-4 h-9 w-9 text-primary" />
                <h3 className="mb-2 flex flex-wrap items-center gap-2 text-lg font-semibold">
                  {c.title}
                  {c.prototype && (
                    <Badge variant="secondary" className="font-normal">
                      Prototype / planned
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{c.body}</p>
                <Link
                  to={c.to}
                  className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
                >
                  Learn more
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">
            Who Predict Disease Is For
          </h2>
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
            See Predict Disease in a realistic clinical workflow.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Explore how Predict Disease brings screening information, clinical context and
            clinician-reviewed decision support into one workflow.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={openDemoRequest}>
              Request a Demo
            </Button>
            <Button size="lg" variant="outline" onClick={secondary}>
              {secondaryLabel}
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Demo environments use synthetic patient information and remain separate from real
            clinical workspaces.
          </p>
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
