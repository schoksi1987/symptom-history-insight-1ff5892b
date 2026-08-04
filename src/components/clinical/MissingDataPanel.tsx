import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DataQualityIssue } from "@/types/clinical";
import { CircleHelp, Clock, TriangleAlert } from "lucide-react";

const icons = {
  Missing: CircleHelp,
  Conflicting: TriangleAlert,
  Outdated: Clock,
} as const;

export const MissingDataPanel = ({ issues }: { issues: DataQualityIssue[] }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-base">Missing or conflicting information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {issues.length === 0 && (
        <p className="text-sm text-muted-foreground">No missing or conflicting information identified.</p>
      )}
      {issues.map((issue) => {
        const Icon = icons[issue.type];
        return (
          <div key={issue.id} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{issue.label}</p>
                <Badge variant="outline" className="font-normal">{issue.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{issue.detail}</p>
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
);

export const ConflictAlert = ({ title, detail }: { title: string; detail: string }) => (
  <div className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-3">
    <TriangleAlert className="mt-0.5 h-4 w-4 text-destructive" aria-hidden />
    <div>
      <p className="text-sm font-medium text-destructive">{title}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  </div>
);
