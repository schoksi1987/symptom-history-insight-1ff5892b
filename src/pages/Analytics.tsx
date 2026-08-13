import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter,
} from "recharts";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";

type Metric = { metric_key: string; data: any; snapshot_date: string };

export default function Analytics() {
  const [metrics, setMetrics] = useState<Record<string, Metric>>({});
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data }, { data: e }] = await Promise.all([
        supabase.from("population_metrics").select("*").order("snapshot_date", { ascending: false }).limit(50),
        (supabase as any).from("examinations").select("bmi,hba1c,systolic_bp,fasting_glucose").limit(1000),
      ]);
      const latest: Record<string, Metric> = {};
      for (const m of data ?? []) if (!latest[m.metric_key]) latest[m.metric_key] = m as Metric;
      setMetrics(latest);
      setExams(e ?? []);
      setLoading(false);
    })();
  }, []);

  const totals = metrics.totals?.data ?? { patients: 0, scored: 0, symptoms: 0 };
  const histogram = metrics.risk_histogram?.data?.buckets ?? [];
  const prevalence = metrics.symptom_prevalence?.data?.items ?? [];
  const scatter = metrics.age_vs_risk?.data?.points ?? [];
  const cohorts = metrics.cohort_summary?.data?.cohorts ?? [];

  const bin = (values: number[], edges: number[], labels: string[]) => {
    const counts = labels.map((label) => ({ range: label, count: 0 }));
    for (const v of values) {
      if (!Number.isFinite(v)) continue;
      let idx = edges.findIndex((e) => v < e);
      if (idx === -1) idx = edges.length;
      counts[idx].count++;
    }
    return counts;
  };
  const bmiHist = bin(exams.map((e) => Number(e.bmi)).filter(Number.isFinite),
    [18.5, 25, 30, 35, 40], ["<18.5", "18.5–25", "25–30", "30–35", "35–40", "≥40"]);
  const hba1cHist = bin(exams.map((e) => Number(e.hba1c)).filter(Number.isFinite),
    [5.7, 6.5, 7.5, 9], ["<5.7 normal", "5.7–6.4 pre", "6.5–7.4", "7.5–8.9", "≥9"]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Population Analytics</h1>
            <p className="text-sm text-muted-foreground">Aggregate view across the entire patient cohort.</p>
          </div>
          <Button variant="outline" asChild><Link to="/">Home</Link></Button>
        </div>
      </div>

      <div className="container mx-auto space-y-6 p-6">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard label="Patients" value={totals.patients} />
              <StatCard label="Risk-scored" value={totals.scored} />
              <StatCard label="Symptom records" value={totals.symptoms} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk score distribution</CardTitle>
                  <CardDescription>Latest computed risk score per patient (0–100).</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={histogram}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="range" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Symptom prevalence</CardTitle>
                  <CardDescription>Distinct patients reporting each symptom.</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={prevalence} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis type="category" dataKey="symptom" width={140} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="patients" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Age vs. risk score</CardTitle>
                  <CardDescription>Each dot is one patient's latest computed score.</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" dataKey="age" name="Age" className="text-xs" />
                      <YAxis type="number" dataKey="score" name="Risk" domain={[0, 100]} className="text-xs" />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter data={scatter} fill="hsl(var(--primary))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>BMI distribution</CardTitle>
                  <CardDescription>WHO categories across the examined cohort.</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={bmiHist}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="range" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>HbA1c distribution</CardTitle>
                  <CardDescription>ADA cutoffs: &lt;5.7 normal · 5.7–6.4 pre-diabetes · ≥6.5 diabetic.</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={hba1cHist}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="range" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--destructive))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold">Cohorts</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cohorts.map((c: any) => (
                  <Card key={c.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{c.label}</CardTitle>
                        <Badge variant="secondary">{c.size}</Badge>
                      </div>
                      <CardDescription>{c.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Avg risk</span><span className="font-medium">{c.avg_risk}</span></div>
                      {(c.top_features ?? []).map((f: any) => (
                        <div key={f.feature} className="flex justify-between">
                          <span className="text-muted-foreground">{f.feature}</span>
                          <span>{f.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-bold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
