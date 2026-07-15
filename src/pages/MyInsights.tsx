import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function MyInsights() {
  const { user } = useAuth();
  const [risk, setRisk] = useState<any>(null);
  const [cohort, setCohort] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [exam, setExam] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const [r, a, f, e] = await Promise.all([
      supabase.from("patient_risk_scores").select("*").eq("patient_id", user.id).order("computed_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("patient_cohort_assignments").select("*").eq("patient_id", user.id).order("computed_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("symptom_forecasts").select("*").eq("patient_id", user.id).order("computed_at", { ascending: false }),
      (supabase as any).from("examinations").select("*").eq("patient_user_id", user.id).order("examined_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    setRisk(r.data);
    setAssignment(a.data);
    setForecasts(f.data ?? []);
    setExam(e.data);
    if (a.data?.cohort_id != null) {
      const { data: c } = await supabase.from("cohorts").select("*").eq("id", a.data.cohort_id).maybeSingle();
      setCohort(c);
    }
  };

  useEffect(() => { load(); }, [user]);

  const recompute = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const [risk, fc] = await Promise.all([
        supabase.functions.invoke("compute-risk-score", { body: { patientId: user.id } }),
        supabase.functions.invoke("compute-symptom-forecast", { body: { patientId: user.id } }),
      ]);
      if (risk.error) throw risk.error;
      if (fc.error) throw fc.error;
      toast({ title: "Insights updated" });
      await load();
    } catch (e: any) {
      toast({ title: "Recompute failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (!user) return <div className="p-8"><p>Please <Link className="underline" to="/auth">sign in</Link>.</p></div>;

  const riskLevel = risk?.score >= 66 ? "high" : risk?.score >= 33 ? "moderate" : "low";
  const riskColor = riskLevel === "high" ? "destructive" : riskLevel === "moderate" ? "default" : "secondary";

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">My Health Insights</h1>
            <p className="text-sm text-muted-foreground">Personalised diabetes risk & symptom trajectory.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={recompute} disabled={busy}>{busy ? "Computing…" : "Recompute"}</Button>
            <Button variant="outline" asChild><Link to="/">Home</Link></Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Diabetes risk score</CardTitle>
              {risk && <Badge variant={riskColor as any}>{riskLevel.toUpperCase()}</Badge>}
            </div>
            <CardDescription>Logistic model v0.1 — {risk?.model_version ?? "not computed yet"}</CardDescription>
          </CardHeader>
          <CardContent>
            {!risk ? (
              <p className="text-sm text-muted-foreground">Click Recompute to generate your score.</p>
            ) : (
              <>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{risk.score}</span>
                  <span className="text-muted-foreground">/ 100</span>
                </div>
                <Progress value={risk.score} className="mb-4" />
                <p className="mb-2 text-sm font-medium">Top contributing factors</p>
                <ul className="space-y-1 text-sm">
                  {(risk.contributions ?? []).slice(0, 4).map((c: any) => (
                    <li key={c.key} className="flex justify-between border-b border-border pb-1">
                      <span>{c.label}</span>
                      <span className={c.weight > 0 ? "text-destructive" : "text-primary"}>
                        {c.weight > 0 ? "+" : ""}{c.weight.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest examination</CardTitle>
            <CardDescription>
              {exam ? `Recorded ${new Date(exam.examined_at).toLocaleDateString()}` : "No examination saved yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!exam ? (
              <p className="text-sm text-muted-foreground">
                Complete an examination to feed clinical vitals (BMI, HbA1c, blood pressure, lipids) into your risk model.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Vital label="BMI" value={exam.bmi?.toFixed(1)} unit="kg/m²" flag={exam.bmi > 30} />
                <Vital label="HbA1c" value={exam.hba1c} unit="%" flag={exam.hba1c > 6.5} />
                <Vital label="Fasting glucose" value={exam.fasting_glucose} unit="mg/dL" flag={exam.fasting_glucose > 126} />
                <Vital label="Blood pressure" value={exam.systolic_bp && exam.diastolic_bp ? `${exam.systolic_bp}/${exam.diastolic_bp}` : null} flag={exam.systolic_bp > 140} />
                <Vital label="LDL" value={exam.ldl} unit="mg/dL" flag={exam.ldl > 130} />
                <Vital label="HDL" value={exam.hdl} unit="mg/dL" flag={exam.hdl && exam.hdl < 40} />
              </div>
            )}
          </CardContent>
        </Card>


          <CardHeader>
            <CardTitle>Similar patients</CardTitle>
            <CardDescription>Cohort from k-means clustering across the population.</CardDescription>
          </CardHeader>
          <CardContent>
            {!cohort ? (
              <p className="text-sm text-muted-foreground">No cohort assigned yet.</p>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{cohort.label}</p>
                    <p className="text-sm text-muted-foreground">{cohort.description}</p>
                  </div>
                  <Badge variant="outline">{cohort.size} patients</Badge>
                </div>
                <p className="mb-2 text-sm font-medium">What worked for similar patients</p>
                <ul className="space-y-1 text-sm">
                  {(cohort.outcome_summary?.top_interventions ?? []).map((o: any, i: number) => (
                    <li key={i} className="flex justify-between border-b border-border pb-1">
                      <span>{o.intervention}</span>
                      <span className="text-primary">{Math.round(o.success_rate * 100)}%</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Symptom trajectory</CardTitle>
            <CardDescription>Weekly severity × frequency with 4-week Holt-linear forecast.</CardDescription>
          </CardHeader>
          <CardContent>
            {forecasts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No forecasts yet. Click Recompute after logging symptoms.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {forecasts.slice(0, 4).map((f) => {
                  const series = [
                    ...(f.history ?? []).map((h: any) => ({ week: h.week, actual: h.value })),
                    ...(f.forecast ?? []).map((h: any) => ({ week: h.week, forecast: h.value })),
                  ];
                  return (
                    <div key={f.id} className="rounded-md border border-border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium">{f.symptom_name}</p>
                        <div className="flex gap-1">
                          <Badge variant={f.trend === "worsening" ? "destructive" : f.trend === "improving" ? "secondary" : "outline"}>{f.trend}</Badge>
                          {f.anomaly && <Badge variant="destructive">anomaly</Badge>}
                        </div>
                      </div>
                      <div className="h-40">
                        <ResponsiveContainer>
                          <LineChart data={series}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="week" hide />
                            <YAxis domain={[0, 3]} className="text-xs" />
                            <Tooltip />
                            <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" dot={false} />
                            <Line type="monotone" dataKey="forecast" stroke="hsl(var(--destructive))" strokeDasharray="4 4" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
