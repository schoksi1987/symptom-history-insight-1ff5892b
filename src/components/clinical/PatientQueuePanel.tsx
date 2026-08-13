import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import type { PatientQueueEntry } from "@/types/clinical";
import { useClinicalDataSource } from "@/hooks/useClinicalDataSource";
import { DemoDataNotice } from "./PrototypeBanner";

const NEEDS_ATTENTION: PatientQueueEntry["status"][] = [
  "Laboratory Values Consistent With Diabetes — Physician Review Required",
  "Elevated Screening Priority",
  "Prediabetes",
  "Insufficient Information",
];

export const PatientQueuePanel = () => {
  const clinical = useClinicalDataSource();
  const [queue, setQueue] = useState<PatientQueueEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    clinical.getPhysicianQueue().then(setQueue);
  }, [clinical]);

  const needsAttention = queue.filter((q) => NEEDS_ATTENTION.includes(q.status));

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" aria-hidden />
          Needs Attention
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Patients flagged for physician review before or during today&apos;s visits.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {clinical.isDemo && <DemoDataNotice />}
        {needsAttention.length === 0 && (
          <p className="text-sm text-muted-foreground">No patients currently require review.</p>
        )}
        {needsAttention.map((p) => (
          <div key={p.patientId} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">Appointment {p.appointmentTime}</p>
              </div>
              <Badge variant="outline" className="font-normal">{p.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.reasonFlagged}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Data completeness</p>
                <Progress value={p.dataCompleteness} className="mt-1 h-2" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Last laboratory result: {p.lastLabDate ?? "Not available"}</p>
                <p>Action status: {p.actionStatus}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => navigate(`/patient/${p.patientId}`)}>Open patient</Button>
              <Button size="sm" variant="outline" onClick={() => navigate(`/patient/${p.patientId}/examination`)}>
                Start visit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => navigate(`/recommendations/${p.patientId}`)}>
                Clinical decision summary
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
