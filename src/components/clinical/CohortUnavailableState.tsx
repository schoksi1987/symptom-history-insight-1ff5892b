import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import type { CohortAnalysis } from "@/types/clinical";

export const CohortUnavailableState = ({ cohort }: { cohort: CohortAnalysis }) => {
  if (cohort.available) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Cohort comparison</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <Row label="Cohort size" value={cohort.cohortSize} />
          <Row label="Matched characteristics" value={cohort.matchedCharacteristics} />
          <Row label="Observation period" value={cohort.observationPeriod} />
          <Row label="Outcome definition" value={cohort.outcomeDefinition} />
          <Row label="Outcome rate" value={cohort.outcomeRate != null ? `${cohort.outcomeRate}%` : undefined} />
          <Row label="Confidence interval" value={cohort.confidenceInterval} />
          <Row label="Data source" value={cohort.dataSource} />
          <Row label="Model version" value={cohort.modelVersion} />
          {cohort.matchingCriteria?.length ? (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">Matching criteria</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {cohort.matchingCriteria.map((c) => (
                  <Badge key={c} variant="outline" className="font-normal">{c}</Badge>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Cohort Comparison Not Yet Available</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 rounded-md border bg-muted/40 p-4">
          <Info className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{cohort.unavailableReason}</p>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
            Fields prepared for a validated cohort
          </p>
          <div className="flex flex-wrap gap-1">
            {[
              "Cohort size",
              "Matching criteria",
              "Number of matched characteristics",
              "Observation period",
              "Outcome definition",
              "Outcome rate",
              "Confidence interval",
              "Data source",
              "Model version",
            ].map((f) => (
              <Badge key={f} variant="outline" className="font-normal text-muted-foreground">{f}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Row = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span>{value ?? "Insufficient Information"}</span>
  </div>
);
