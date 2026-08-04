import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { EvidenceSource } from "@/types/clinical";

export const EvidenceSourceCard = ({ source }: { source: EvidenceSource }) => (
  <Card>
    <CardContent className="space-y-2 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-medium">{source.title}</p>
        <Badge variant="outline" className="font-normal">Evidence strength: {source.strength}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        {source.publisher} · {source.publicationDate} · {source.studyType}
      </p>
      <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        <span>Population: {source.population}</span>
        <span>Sample size: {source.sampleSize}</span>
      </div>
      <p className="text-sm text-muted-foreground">{source.relevance}</p>
      <Button asChild variant="outline" size="sm" className="gap-1">
        <a href={source.url} target="_blank" rel="noreferrer noopener">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Open source
        </a>
      </Button>
    </CardContent>
  </Card>
);
