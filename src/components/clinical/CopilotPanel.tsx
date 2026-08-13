import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Mic, Pause, Play, Square, Bot, FileText } from "lucide-react";
import { toast } from "sonner";
import type { CopilotSuggestion, ExtractedClinicalFact, TranscriptSegment as Segment } from "@/types/clinical";
import { useClinicalDataSource } from "@/hooks/useClinicalDataSource";
import { TranscriptSegment } from "./TranscriptSegment";
import { SuggestedQuestionCard } from "./SuggestedQuestionCard";
import { ExtractedFactCard } from "./ExtractedFactCard";
import { DemoDataNotice } from "./PrototypeBanner";

export type CopilotState =
  | "Not Started"
  | "Recording Consent Required"
  | "Recording"
  | "Paused"
  | "Processing"
  | "Review Extracted Information"
  | "Completed"
  | "Recording Failed";

const PHYSICIAN_PROMPTS = [
  "Summarize the visit",
  "What information is missing?",
  "Explain why the patient was flagged",
  "Draft the assessment",
  "Create a follow-up task",
  "Generate patient education",
];

const PROPOSED_ACTIONS = [
  "Add to note",
  "Add to assessment",
  "Create task",
  "Create referral",
  "Schedule follow-up",
  "Add patient goal",
  "Generate patient handout",
];

interface Props {
  patientId?: string;
  encounterId?: string;
}

export const CopilotPanel = ({ patientId, encounterId }: Props) => {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState<CopilotState>("Not Started");
  const [transcript, setTranscript] = useState<Segment[]>([]);
  const [suggestions, setSuggestions] = useState<CopilotSuggestion[]>([]);
  const [facts, setFacts] = useState<ExtractedClinicalFact[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const clinical = useClinicalDataSource();

  useEffect(() => {
    clinical.getTranscript(encounterId).then(setTranscript);
    clinical.getCopilotSuggestions(encounterId).then(setSuggestions);
    clinical.getExtractedFacts(encounterId).then(setFacts);
  }, [encounterId, clinical]);

  const visibleSuggestions = suggestions.filter((s) => s.status === "Open").slice(0, 2);

  const handleFact = async (id: string, decision: "Confirmed" | "Edited" | "Rejected", value?: string) => {
    await clinical.saveExtractedFactDecision(id, decision, value);
    setFacts((prev) => prev.map((f) => (f.id === id ? { ...f, status: decision, value: value ?? f.value } : f)));
  };

  const askCopilot = (text: string) => {
    if (!text.trim()) return;
    setAnswer(
      `Copilot response placeholder for “${text}”. Clinical reasoning is generated backend-side and always requires physician review.`,
    );
    setQuestion("");
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" aria-hidden />
            <CardTitle className="text-base">Visit Copilot</CardTitle>
            <Badge variant="outline" className="font-normal">{state}</Badge>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Toggle Visit Copilot">
              <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-5">
            <DemoDataNotice />

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setState("Recording Consent Required")}>Start Visit</Button>
              <Button size="sm" variant="outline" onClick={() => setState("Not Started")} disabled={state !== "Recording Consent Required"}>
                Confirm Recording Consent
              </Button>
              <Button size="sm" className="gap-1" onClick={() => setState("Recording")}>
                <Mic className="h-3.5 w-3.5" aria-hidden /> Start Recording
              </Button>
              <Button size="sm" variant="outline" className="gap-1" disabled={state !== "Recording"} onClick={() => setState("Paused")}>
                <Pause className="h-3.5 w-3.5" aria-hidden /> Pause
              </Button>
              <Button size="sm" variant="outline" className="gap-1" disabled={state !== "Paused"} onClick={() => setState("Recording")}>
                <Play className="h-3.5 w-3.5" aria-hidden /> Resume
              </Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setState("Review Extracted Information")}>
                <Square className="h-3.5 w-3.5" aria-hidden /> Stop
              </Button>
              <Button size="sm" variant="secondary" onClick={() => askCopilot("Summarize the visit")}>Ask Copilot</Button>
              <Button size="sm" variant="secondary" className="gap-1" onClick={() => setState("Processing")}>
                <FileText className="h-3.5 w-3.5" aria-hidden /> Generate Draft Note
              </Button>
            </div>

            <Separator />

            {/* A. Live transcript */}
            <section>
              <p className="mb-2 text-sm font-medium">Live transcript</p>
              <div className="max-h-52 overflow-y-auto rounded-md border p-2">
                {transcript.length ? (
                  transcript.map((s) => <TranscriptSegment key={s.id} segment={s} />)
                ) : (
                  <p className="p-2 text-sm text-muted-foreground">No transcript captured yet.</p>
                )}
              </div>
            </section>

            {/* B. Suggested questions */}
            <section className="space-y-2">
              <p className="text-sm font-medium">Suggested questions</p>
              {visibleSuggestions.length ? (
                visibleSuggestions.map((s) => (
                  <SuggestedQuestionCard
                    key={s.id}
                    suggestion={s}
                    onAsk={() => {
                      setSuggestions((prev) => prev.map((x) => (x.id === s.id ? { ...x, status: "Asked" } : x)));
                      askCopilot(s.question);
                    }}
                    onDismiss={() =>
                      setSuggestions((prev) => prev.map((x) => (x.id === s.id ? { ...x, status: "Dismissed" } : x)))
                    }
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No open suggestions.</p>
              )}
            </section>

            {/* C. Extracted information */}
            <section className="space-y-2">
              <p className="text-sm font-medium">Extracted information</p>
              <p className="text-xs text-muted-foreground">
                Proposed facts are not added to the record until confirmed.
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {facts.map((f) => (
                  <ExtractedFactCard key={f.id} fact={f} onDecision={(d, v) => handleFact(f.id, d, v)} />
                ))}
              </div>
            </section>

            {/* D. Physician questions */}
            <section className="space-y-2">
              <p className="text-sm font-medium">Ask the copilot</p>
              <div className="flex flex-wrap gap-2">
                {PHYSICIAN_PROMPTS.map((p) => (
                  <Button key={p} size="sm" variant="outline" onClick={() => askCopilot(p)}>{p}</Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type a question for the copilot"
                  onKeyDown={(e) => e.key === "Enter" && askCopilot(question)}
                />
                <Button size="sm" onClick={() => askCopilot(question)}>Send</Button>
              </div>
              {answer && <p className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">{answer}</p>}
            </section>

            {/* E. Proposed actions */}
            <section className="space-y-2">
              <p className="text-sm font-medium">Proposed actions</p>
              <p className="text-xs text-muted-foreground">Each action requires physician confirmation before anything is recorded.</p>
              <div className="flex flex-wrap gap-2">
                {PROPOSED_ACTIONS.map((a) => (
                  <Button
                    key={a}
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      if (a === "Create task" && patientId) {
                        await clinical.createFollowUpTask(patientId, encounterId, { title: "Follow-up task" });
                      }
                      toast.success(`${a} — confirmed by physician`);
                    }}
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </section>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
