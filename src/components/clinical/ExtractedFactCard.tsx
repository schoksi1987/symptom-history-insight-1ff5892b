import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ExtractedClinicalFact } from "@/types/clinical";

interface Props {
  fact: ExtractedClinicalFact;
  onDecision: (decision: "Confirmed" | "Edited" | "Rejected", value?: string) => void;
}

export const ExtractedFactCard = ({ fact, onDecision }: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(fact.value);
  const decided = fact.status !== "Proposed";

  return (
    <Card>
      <CardContent className="space-y-2 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className="font-normal">{fact.type}</Badge>
          <Badge variant="secondary" className="font-normal">{fact.status}</Badge>
        </div>
        {editing ? (
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        ) : (
          <p className="text-sm">{fact.value}</p>
        )}
        {fact.sourceSentence && (
          <p className="text-xs text-muted-foreground">Source: “{fact.sourceSentence}”</p>
        )}
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <Button size="sm" onClick={() => { setEditing(false); onDecision("Edited", value); }}>Save</Button>
          ) : (
            <>
              <Button size="sm" disabled={decided} onClick={() => onDecision("Confirmed")}>Confirm</Button>
              <Button size="sm" variant="outline" disabled={decided} onClick={() => setEditing(true)}>Edit</Button>
              <Button size="sm" variant="ghost" disabled={decided} onClick={() => onDecision("Rejected")}>Reject</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
