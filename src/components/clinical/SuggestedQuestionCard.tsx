import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CopilotSuggestion } from "@/types/clinical";

interface Props {
  suggestion: CopilotSuggestion;
  onAsk: () => void;
  onDismiss: () => void;
}

export const SuggestedQuestionCard = ({ suggestion, onAsk, onDismiss }: Props) => (
  <Card className="bg-muted/40">
    <CardContent className="space-y-2 p-3">
      <p className="text-sm font-medium">{suggestion.question}</p>
      <p className="text-xs text-muted-foreground">Why: {suggestion.reason}</p>
      <p className="text-xs text-muted-foreground">Source: {suggestion.sourceReference}</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={onAsk}>Ask</Button>
        <Button size="sm" variant="ghost" onClick={onDismiss}>Dismiss</Button>
      </div>
    </CardContent>
  </Card>
);
