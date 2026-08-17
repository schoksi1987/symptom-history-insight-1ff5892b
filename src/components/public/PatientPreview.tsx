import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Fictional patient used for the product illustration. No real patient data. */
const PATIENT = {
  name: "Jordan Lee",
  age: 52,
  sex: "Female",
  lastVisit: "Mar 4, 2026",
  bmi: "31.2",
  bp: "128/82 mmHg",
  lastA1c: "No HbA1c on file in the last 12 months",
  priority: "Consider Screening",
  assessed: "Mar 4, 2026",
  version: "Screening criteria v1.4",
};

const DOMAIN_ROWS = [
  { domain: "Clinical", contributed: "BMI 31.2 · BP 128/82 · no HbA1c in 12 months", state: "partial" },
  { domain: "Family history", contributed: "Mother with type 2 diabetes", state: "captured" },
  { domain: "Lifestyle", contributed: "Active 3 days per week · 6 hours sleep", state: "captured" },
  { domain: "Symptoms and observations", contributed: "Fatigue, increased thirst noted at visit", state: "captured" },
  { domain: "Social determinants (SDOH)", contributed: "Limited access to fresh food · cost concerns", state: "captured" },
  { domain: "Community context", contributed: "Not recorded", state: "missing" },
];

const INCREASING = [
  "BMI 31.2 (above screening threshold with age 52)",
  "First-degree family history of type 2 diabetes",
  "Limited access to fresh food",
  "Reported fatigue and increased thirst",
];

const MODERATING = ["Blood pressure within range", "Active 3 days per week", "No tobacco use"];

const NEXT_STEPS = [
  "Order HbA1c or fasting plasma glucose",
  "Review dietary access barriers with care coordination",
  "Schedule follow-up within 8 weeks",
];

function StateDot({ state }: { state: string }) {
  const cls =
    state === "captured" ? "bg-primary" : state === "partial" ? "bg-primary/40" : "bg-muted-foreground/30";
  return <span className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${cls}`} aria-hidden="true" />;
}

export function PatientPreview() {
  return (
    <Card
      className="border-2 p-6 shadow-lg"
      aria-label="Product illustration using a fictional patient record"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Patient: {PATIENT.name}</p>
          <p className="text-xs text-muted-foreground">
            Age {PATIENT.age} · {PATIENT.sex} · Last visit {PATIENT.lastVisit} · Fictional record, no
            identifiers
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0">
          Demo Data
        </Badge>
      </div>

      <dl className="mb-4 grid grid-cols-3 gap-3 text-center">
        {[
          { label: "BMI", value: PATIENT.bmi },
          { label: "Blood pressure", value: PATIENT.bp },
          { label: "Last HbA1c", value: "None on file" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border p-3">
            <dt className="text-xs text-muted-foreground">{m.label}</dt>
            <dd className="text-sm font-semibold text-foreground">{m.value}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-lg border bg-accent/60 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Type 2 Diabetes Screening Priority
        </p>
        <p className="mt-1 text-2xl font-bold text-primary">{PATIENT.priority}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on the information available, this patient may benefit from prioritized clinical
          review for Type 2 diabetes screening.
        </p>
      </div>

      <Tabs defaultValue="inputs" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
          <TabsTrigger value="next">Next steps</TabsTrigger>
        </TabsList>

        <TabsContent value="inputs" className="mt-4 space-y-2">
          {DOMAIN_ROWS.map((r) => (
            <div key={r.domain} className="flex gap-2 text-sm">
              <StateDot state={r.state} />
              <div>
                <span className="font-medium text-foreground">{r.domain}: </span>
                <span className="text-muted-foreground">{r.contributed}</span>
              </div>
            </div>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">
            Domains with no data stay visible instead of being hidden.
          </p>
        </TabsContent>

        <TabsContent value="reasoning" className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-foreground">Factors increasing priority</p>
            <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
              {INCREASING.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Moderating factors</p>
            <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
              {MODERATING.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Missing information: </span>
            {PATIENT.lastA1c}
          </div>
          <p className="text-sm text-muted-foreground">
            Grouped with de-identified patients showing similar clinical, lifestyle, and social
            profiles; that group most often needed an HbA1c and a food-access referral.
          </p>
        </TabsContent>

        <TabsContent value="next" className="mt-4 space-y-2">
          <ul className="space-y-1 text-sm text-muted-foreground">
            {NEXT_STEPS.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
          <p className="pt-2 text-xs text-muted-foreground">
            Suggested steps are accepted, modified, or dismissed by the clinician.
          </p>
        </TabsContent>
      </Tabs>

      <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
        Assessed {PATIENT.assessed} · {PATIENT.version} · Illustrative preview with fictional data.
        Clinical decision support — not a diagnosis.
      </p>
    </Card>
  );
}
