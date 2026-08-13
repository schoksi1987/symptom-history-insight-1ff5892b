import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvidenceSourceCard } from "@/components/clinical/EvidenceSourceCard";
import { PrototypeBanner } from "@/components/clinical/PrototypeBanner";
import { useClinicalDataSource } from "@/hooks/useClinicalDataSource";
import type { EvidenceSource } from "@/types/clinical";

const ClinicalEvidence = () => {
  const clinical = useClinicalDataSource();
  const [sources, setSources] = useState<EvidenceSource[]>([]);

  useEffect(() => {
    clinical.getEvidenceSources().then(setSources);
  }, [clinical]);

  return (
    <div className="min-h-screen bg-background">
      <PrototypeBanner />
      <div className="container mx-auto max-w-4xl px-6 py-8 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Clinical Evidence</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Guideline and literature sources referenced by screening logic. Sources are listed with study type,
            population and evidence strength so clinical reasoning can be verified.
          </p>
        </header>

        <div className="grid gap-4">
          {sources.map((s) => <EvidenceSourceCard key={s.id} source={s} />)}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Interpretation notes</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Evidence listed here supports screening prioritisation only. It does not establish a diagnosis.</p>
            <p>Any laboratory interpretation, treatment change or referral requires physician judgement.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicalEvidence;
