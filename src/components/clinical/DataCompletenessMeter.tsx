import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClinicalClassification } from "@/types/clinical";

export const DataCompletenessMeter = ({
  value,
  label = "Data completeness",
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) => (
  <div className={cn("space-y-1", className)}>
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}%</span>
    </div>
    <Progress value={value} className="h-2" />
  </div>
);

export const AssessmentConfidence = ({
  confidence,
}: {
  confidence: ClinicalClassification["confidence"];
}) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-muted-foreground">Confidence</span>
    <Badge variant="outline" className="font-normal">{confidence}</Badge>
  </div>
);
