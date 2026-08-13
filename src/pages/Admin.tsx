import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { PendingApprovals } from "@/components/admin/PendingApprovals";
import { AdminAuditLog, type AdminAuditLogHandle } from "@/components/admin/AdminAuditLog";
import { AppHeader } from "@/components/AppHeader";


const JOBS: { key: string; fn: string; label: string; description: string }[] = [
  { key: "seed", fn: "seed-synthetic-cohort", label: "Seed synthetic cohort", description: "Insert ~300 synthetic patients with symptoms and notes (idempotent)." },
  { key: "cohorts", fn: "compute-cohorts", label: "Recompute cohorts", description: "K-means (k=4) over all patients; refreshes cohort assignments." },
  { key: "metrics", fn: "refresh-population-metrics", label: "Refresh population metrics", description: "Rebuild aggregate snapshots powering the Analytics dashboard." },
];

export default function Admin() {
  const [busy, setBusy] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const auditRef = useRef<AdminAuditLogHandle>(null);

  const run = async (fn: string, key: string) => {
    setBusy(key);
    try {
      const { data, error } = await supabase.functions.invoke(fn, { body: {} });
      if (error) throw error;
      const line = `[${new Date().toLocaleTimeString()}] ${fn} → ${JSON.stringify(data)}`;
      setLog((l) => [line, ...l].slice(0, 20));
      toast({ title: `${fn} completed`, description: JSON.stringify(data).slice(0, 140) });
    } catch (e: any) {
      toast({ title: `${fn} failed`, description: e.message, variant: "destructive" });
      setLog((l) => [`[${new Date().toLocaleTimeString()}] ${fn} FAILED: ${e.message}`, ...l]);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Admin & Data Science Jobs</h1>
            <p className="text-sm text-muted-foreground">Trigger the analytics pipeline manually.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/analytics">Analytics</Link></Button>
            <Button variant="outline" asChild><Link to="/">Home</Link></Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-6 p-6">
        <PendingApprovals onChange={() => void auditRef.current?.reload()} />
        <AdminAuditLog ref={auditRef} />
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-4 p-6 md:grid-cols-3">

        {JOBS.map((j) => (
          <Card key={j.key}>
            <CardHeader>
              <CardTitle>{j.label}</CardTitle>
              <CardDescription>{j.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => run(j.fn, j.key)} disabled={!!busy}>
                {busy === j.key ? "Running…" : "Run"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="container mx-auto p-6">
        <Card>
          <CardHeader><CardTitle>Job log</CardTitle></CardHeader>
          <CardContent>
            {log.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs run yet in this session.</p>
            ) : (
              <ul className="space-y-1 font-mono text-xs">
                {log.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
