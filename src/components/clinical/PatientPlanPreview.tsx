import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PatientPlan } from "@/types/clinical";

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium">{title}</p>
    {items.length ? (
      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    ) : (
      <p className="text-sm text-muted-foreground">Not yet added.</p>
    )}
  </div>
);

interface Props {
  plan: PatientPlan;
  onApprove?: () => void;
  onShare?: () => void;
}

export const PatientPlanPreview = ({ plan, onApprove, onShare }: Props) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-base">Patient plan</CardTitle>
      <Badge variant={plan.approvalStatus === "Draft" ? "secondary" : "default"} className="font-normal">
        {plan.approvalStatus}
      </Badge>
    </CardHeader>
    <CardContent className="space-y-4">
      <Section title="What was reviewed" items={plan.whatWasReviewed} />
      <Section title="What needs attention" items={plan.whatNeedsAttention} />
      <Section title="Agreed next steps" items={plan.agreedNextSteps} />
      <Section title="Lifestyle goals" items={plan.lifestyleGoals} />
      <Section title="Testing instructions" items={plan.testingInstructions} />
      <div className="space-y-1">
        <p className="text-sm font-medium">Follow-up date</p>
        <p className="text-sm text-muted-foreground">{plan.followUpDate ?? "Not scheduled"}</p>
      </div>
      <Section title="When to contact the clinic" items={plan.whenToContactClinic} />
      <div className="flex flex-wrap gap-2 pt-2">
        <Button size="sm" onClick={onApprove} disabled={plan.approvalStatus !== "Draft"}>
          Physician approve
        </Button>
        <Button size="sm" variant="outline" onClick={onShare} disabled={plan.approvalStatus !== "Physician Approved"}>
          Share with patient
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Patient-facing content is shared only after physician approval. Internal notes, model calculations and
        cohort comparisons are never included.
      </p>
    </CardContent>
  </Card>
);
