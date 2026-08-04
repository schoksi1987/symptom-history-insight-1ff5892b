import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { DecisionType, SuggestedAction } from "@/types/clinical";
import { Check, PencilLine, X, MessageSquarePlus } from "lucide-react";

export interface PhysicianDecisionControlsProps {
  onDecision: (decision: DecisionType, payload?: { rationale?: string; modifiedTitle?: string }) => void;
  disabled?: boolean;
}

export const PhysicianDecisionControls = ({ onDecision, disabled }: PhysicianDecisionControlsProps) => {
  const [mode, setMode] = useState<"none" | "modify" | "rationale">("none");
  const [rationale, setRationale] = useState("");
  const [modifiedTitle, setModifiedTitle] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={disabled} onClick={() => onDecision("Accept", { rationale })} className="gap-1">
          <Check className="h-3.5 w-3.5" aria-hidden /> Accept
        </Button>
        <Button size="sm" variant="outline" disabled={disabled} onClick={() => setMode(mode === "modify" ? "none" : "modify")} className="gap-1">
          <PencilLine className="h-3.5 w-3.5" aria-hidden /> Modify
        </Button>
        <Button size="sm" variant="outline" disabled={disabled} onClick={() => onDecision("Dismiss", { rationale })} className="gap-1">
          <X className="h-3.5 w-3.5" aria-hidden /> Dismiss
        </Button>
        <Button size="sm" variant="ghost" disabled={disabled} onClick={() => setMode(mode === "rationale" ? "none" : "rationale")} className="gap-1">
          <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden /> Add rationale
        </Button>
      </div>
      {mode === "modify" && (
        <div className="space-y-2">
          <Input
            value={modifiedTitle}
            onChange={(e) => setModifiedTitle(e.target.value)}
            placeholder="Revised action wording"
          />
          <Button size="sm" onClick={() => onDecision("Modify", { modifiedTitle, rationale })}>
            Save modified action
          </Button>
        </div>
      )}
      {mode === "rationale" && (
        <Textarea
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder="Physician rationale (recorded with the decision)"
          rows={2}
        />
      )}
    </div>
  );
};

interface Props {
  action: SuggestedAction;
  onDecision: (decision: DecisionType, payload?: { rationale?: string; modifiedTitle?: string }) => void;
}

export const SuggestedActionCard = ({ action, onDecision }: Props) => (
  <Card>
    <CardContent className="space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-medium">{action.title}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-normal">{action.priority}</Badge>
          <Badge variant="secondary" className="font-normal">{action.status}</Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{action.reason}</p>
      <p className="text-xs text-muted-foreground">Evidence source: {action.evidenceSource}</p>
      <PhysicianDecisionControls
        disabled={action.status !== "Pending Review"}
        onDecision={onDecision}
      />
    </CardContent>
  </Card>
);
