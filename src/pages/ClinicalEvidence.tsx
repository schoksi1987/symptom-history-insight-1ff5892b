import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { PublicLayout, PageHero, PageBody } from "@/components/public/PublicLayout";
import { SOURCES } from "@/content/sources";

interface EvidenceCardProps {
  org: string;
  title: string;
  year: string;
  kind: string;
  children: React.ReactNode;
  informs: string;
  url: string;
  linkLabel: string;
}

function EvidenceCard({
  org,
  title,
  year,
  kind,
  children,
  informs,
  url,
  linkLabel,
}: EvidenceCardProps) {
  return (
    <Card className="space-y-4 border-2 p-6">
      <div className="space-y-1">
        <p className="text-sm font-medium text-primary">{org}</p>
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">{year}</Badge>
          <Badge variant="outline">{kind}</Badge>
        </div>
      </div>

      <div className="space-y-3 text-muted-foreground">{children}</div>

      <div className="rounded-lg border-l-4 border-primary bg-muted/40 p-4">
        <p className="mb-1 text-sm font-semibold text-foreground">
          How Predict Disease uses this evidence
        </p>
        <p className="text-sm text-muted-foreground">{informs}</p>
      </div>

      <Button variant="outline" asChild>
        <a href={url} target="_blank" rel="noopener noreferrer">
          {linkLabel}
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </Card>
  );
}

const FDA_PRINCIPLES = [
  "Clearly state intended use and intended professional users",
  "Identify relevant patient inputs and data-quality requirements",
  "Describe the underlying logic or methods and available validation",
  "Show relevant patient-specific information, including important unknowns",
];

export default function ClinicalEvidence() {
  return (
    <PublicLayout
      seo={{
        title: "Clinical Evidence",
        description: "Authoritative sources behind the Type 2 diabetes screening guidance surfaced by Predict Disease by symptom.ai.",
        path: "/clinical-evidence",
      }}
    >
      <PageHero
        title="Evidence should be visible, not implied."
        intro={
          <p>
            Predict Disease is being designed around established clinical guidance, published
            research and transparent clinical logic. External clinical standards inform product
            design; they do not constitute validation of Predict Disease itself.
          </p>
        }
      />
      <PageBody>
        <div className="rounded-lg border-2 border-primary/40 bg-primary/5 p-5">
          <p className="text-sm font-medium">
            Predict Disease has not yet been independently validated as an autonomous diagnostic or
            treatment system. We do not claim proprietary predictive accuracy until appropriate
            validation has been completed.
          </p>
        </div>

        <h2 className="text-2xl font-semibold">Clinical Evidence &amp; Methodology</h2>

        <EvidenceCard
          org="American Diabetes Association"
          title="Standards of Care in Diabetes — 2026"
          year="2026"
          kind="Clinical practice guideline"
          url={SOURCES.ada}
          linkLabel="View ADA Source"
          informs="Established thresholds can support deterministic clinical classification and screening logic. They should not be converted into an invented future-progression probability."
        >
          <p>
            The ADA Standards of Care provide current criteria for screening and diagnosis of
            diabetes and prediabetes.
          </p>
          <div>
            <p className="font-medium text-foreground">Diabetes-range laboratory criteria</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              <li>A1C ≥ 6.5%</li>
              <li>Fasting plasma glucose ≥ 126 mg/dL</li>
              <li>2-hour plasma glucose during a 75-g OGTT ≥ 200 mg/dL</li>
              <li>
                Random plasma glucose ≥ 200 mg/dL when accompanied by classic hyperglycemic symptoms
                or hyperglycemic crisis
              </li>
            </ul>
            <p className="mt-2 text-sm">
              In the absence of unequivocal hyperglycemia, confirmatory testing is generally
              required.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">Prediabetes ranges</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              <li>A1C 5.7–6.4%</li>
              <li>Fasting plasma glucose 100–125 mg/dL</li>
              <li>2-hour OGTT 140–199 mg/dL</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground">Screening context</p>
            <p className="text-sm">
              ADA guidance supports risk assessment or validated risk calculators in asymptomatic
              adults and general screening beginning at age 35, with earlier risk-based testing where
              appropriate.
            </p>
          </div>
        </EvidenceCard>

        <EvidenceCard
          org="U.S. Preventive Services Task Force"
          title="Screening for Prediabetes and Type 2 Diabetes"
          year="2021"
          kind="Preventive services recommendation"
          url={SOURCES.uspstf}
          linkLabel="View USPSTF Source"
          informs="This guidance informs screening-workflow context and reinforces the role of primary care in identifying patients who may benefit from evaluation and prevention."
        >
          <p>
            The USPSTF recommends screening for prediabetes and type 2 diabetes in asymptomatic
            adults ages 35–70 who have overweight or obesity, and recommends offering or referring
            patients with prediabetes to effective preventive interventions.
          </p>
        </EvidenceCard>

        <EvidenceCard
          org="National Institutes of Health / NIDDK"
          title="Diabetes Prevention Program"
          year="2002"
          kind="Randomized clinical trial"
          url={SOURCES.dpp}
          linkLabel="View NIDDK Source"
          informs="Prevention evidence informs why earlier identification and referral to structured prevention programs matter. It is not a claim about Predict Disease outcomes."
        >
          <p>
            The Diabetes Prevention Program demonstrated that a structured lifestyle intervention
            reduced progression to type 2 diabetes by 58% compared with placebo after approximately
            three years among adults at high risk.
          </p>
          <p>
            The original DPP also reported a 31% reduction in the metformin group compared with
            placebo.
          </p>
          <p className="font-medium text-foreground">
            These are study results from the Diabetes Prevention Program. They are not outcomes
            produced or guaranteed by Predict Disease.
          </p>
        </EvidenceCard>

        <EvidenceCard
          org="Centers for Disease Control and Prevention"
          title="Division of Diabetes Translation — diabetes burden data"
          year="2024"
          kind="Public health surveillance data"
          url={SOURCES.cdc}
          linkLabel="View CDC Source"
          informs="Population burden data provides context for why earlier screening and follow-up in primary care matter."
        >
          <p>
            CDC reports that more than 38 million people in the United States have diabetes and
            approximately 98 million U.S. adults have prediabetes. Medical costs and lost work and
            wages associated with diagnosed diabetes total approximately $413 billion annually.
          </p>
        </EvidenceCard>

        <EvidenceCard
          org="U.S. Food and Drug Administration"
          title="Clinical Decision Support Software — guidance for industry"
          year="Final guidance, September 2022"
          kind="Regulatory guidance"
          url={SOURCES.fda}
          linkLabel="View FDA CDS Guidance"
          informs="Clinical conclusions should expose their basis. AI-generated suggestions remain subject to clinician review. Predict Disease does not claim FDA approval or FDA compliance."
        >
          <p>
            FDA clinical decision-support guidance emphasizes the importance of enabling healthcare
            professionals to independently review the basis for recommendations.
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {FDA_PRINCIPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </EvidenceCard>
      </PageBody>
    </PublicLayout>
  );
}
