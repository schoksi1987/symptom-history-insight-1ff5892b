import { Card } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  ClipboardList,
  HeartPulse,
  ListChecks,
  MapPin,
  MessageSquare,
  Stethoscope,
  Users,
} from "lucide-react";

export const INPUT_DOMAINS = [
  {
    icon: Stethoscope,
    title: "Clinical",
    body: "Vitals, BMI, blood pressure, labs such as HbA1c and glucose, and current medications.",
    captured: true,
  },
  {
    icon: HeartPulse,
    title: "Family history",
    body: "First-degree relatives with type 2 diabetes, and related metabolic conditions.",
    captured: true,
  },
  {
    icon: Activity,
    title: "Lifestyle",
    body: "Physical activity, sleep, eating patterns, tobacco and alcohol use.",
    captured: true,
  },
  {
    icon: MessageSquare,
    title: "Symptoms and observations",
    body: "What the patient reports and what the clinician documents during the visit.",
    captured: true,
  },
  {
    icon: Users,
    title: "Social determinants (SDOH)",
    body: "Food access, transportation, housing stability, cost barriers, caregiving load.",
    captured: true,
  },
  {
    icon: MapPin,
    title: "Community and geographic context",
    body: "Local access to primary care, pharmacies, and food resources.",
    captured: false,
  },
];

const STAGES = [
  {
    icon: ClipboardList,
    title: "Information collected",
    body: "Six input domains feed one structured record for the patient.",
  },
  {
    icon: ListChecks,
    title: "Screening criteria applied",
    body: "Published adult screening criteria are checked against that record.",
  },
  {
    icon: Users,
    title: "Similar-patient comparison",
    body: "The record is grouped with de-identified patients who share similar profiles.",
  },
  {
    icon: Stethoscope,
    title: "Screening priority",
    body: "Routine, Consider Screening, or Prioritize Screening — with the reasons behind it.",
  },
];

/** Illustrative cluster graphic. Static positions, no live data. */
const CLUSTER_POINTS = [
  [22, 62],
  [34, 48],
  [30, 74],
  [46, 58],
  [44, 80],
  [58, 44],
  [56, 70],
  [68, 56],
  [70, 80],
  [82, 50],
  [86, 72],
  [16, 40],
];

function ClusterIllustration() {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Illustration of one highlighted patient inside a group of de-identified patients with similar profiles"
      className="h-48 w-full"
    >
      <ellipse
        cx="52"
        cy="62"
        rx="42"
        ry="28"
        className="fill-accent stroke-border"
        strokeWidth="0.6"
      />
      {CLUSTER_POINTS.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" className="fill-muted-foreground/50" />
      ))}
      <circle cx="52" cy="62" r="5" className="fill-primary" />
      <circle
        cx="52"
        cy="62"
        r="9"
        className="fill-none stroke-primary"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      <text x="52" y="24" textAnchor="middle" className="fill-muted-foreground" fontSize="6">
        Comparison group
      </text>
    </svg>
  );
}

export function AssessmentInputDomains() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {INPUT_DOMAINS.map((d) => (
        <Card key={d.title} className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <d.icon className="h-6 w-6 text-primary" aria-hidden="true" />
            <span
              className={`rounded-full border px-2 py-0.5 text-xs ${
                d.captured ? "border-primary/40 text-primary" : "border-dashed text-muted-foreground"
              }`}
            >
              {d.captured ? "Captured" : "Often missing"}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground">{d.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{d.body}</p>
        </Card>
      ))}
    </div>
  );
}

export function AssessmentProcessGraphic() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
      {STAGES.map((s, i) => (
        <div key={s.title} className="relative">
          <Card className="h-full border-2 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <s.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </Card>
          {i < STAGES.length - 1 && (
            <ArrowRight
              className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary lg:block"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function SimilarPatientPanel() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground">
        How similar-patient comparison works
      </h3>
      <ClusterIllustration />
      <p className="text-sm text-muted-foreground">
        Each record is grouped with de-identified patients who share similar clinical, lifestyle,
        and social profiles. Grouping is used to surface patterns worth reviewing — never to make a
        diagnosis. The criteria version and assessment date are recorded with every result.
      </p>
    </Card>
  );
}
