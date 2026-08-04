import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ClinicalClassification } from "@/types/clinical";
import { AlertCircle, CalendarClock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  classification: ClinicalClassification;
  className?: string;
}

export const ClinicalStatusBanner = ({ classification, className }: Props) => {
  const needsReview = classification.physicianReviewRequired;
  return (
    <Card className={cn("border-l-4", needsReview ? "border-l-destructive" : "border-l-primary", className)}>
      <CardContent className="p-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Current clinical status</p>
            <h2 className="text-lg font-semibold leading-snug">{classification.status}</h2>
          </div>
          {needsReview && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" aria-hidden />
              Physician review required
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{classification.explanation}</p>
        <Separator />
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="h-3 w-3" aria-hidden />
            Calculated {new Date(classification.calculatedAt).toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <Info className="h-3 w-3" aria-hidden />
            Rules {classification.rulesVersion} · Model {classification.modelVersion}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
