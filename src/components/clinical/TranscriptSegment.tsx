import { Badge } from "@/components/ui/badge";
import type { TranscriptSegment as Segment } from "@/types/clinical";
import { cn } from "@/lib/utils";

export const TranscriptSegment = ({ segment }: { segment: Segment }) => (
  <div className="flex gap-3 py-1.5">
    <span className="w-12 shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">{segment.timestamp}</span>
    <Badge
      variant="outline"
      className={cn("h-5 shrink-0 font-normal", segment.speaker === "Physician" && "border-primary/40 text-primary")}
    >
      {segment.speaker}
    </Badge>
    <p className="text-sm">{segment.text}</p>
  </div>
);
