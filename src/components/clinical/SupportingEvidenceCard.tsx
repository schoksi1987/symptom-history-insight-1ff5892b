import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SupportingEvidence } from "@/types/clinical";
import { DataSourceBadge, VerificationBadge, ContributorBadge } from "./DataSourceBadge";

export const SupportingEvidenceCard = ({ evidence }: { evidence: SupportingEvidence }) => (
  <Card>
    <CardContent className="p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Badge variant="outline" className="mb-1 font-normal">{evidence.category}</Badge>
          <p className="text-sm font-medium">{evidence.label}</p>
        </div>
        <ContributorBadge strength={evidence.strength} />
      </div>
      <p className="text-sm text-muted-foreground">{evidence.observation}</p>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-muted-foreground">
          {evidence.observedAt ? new Date(evidence.observedAt).toLocaleDateString() : "Date not recorded"}
        </span>
        <DataSourceBadge source={evidence.source} />
        <VerificationBadge status={evidence.verification} />
      </div>
    </CardContent>
  </Card>
);
