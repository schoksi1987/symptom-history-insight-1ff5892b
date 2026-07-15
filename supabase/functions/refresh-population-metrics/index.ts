import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const today = new Date().toISOString().slice(0, 10);

    // Risk histogram
    const { data: risks } = await supabase.from("patient_risk_scores").select("patient_id, score, computed_at").order("computed_at", { ascending: false });
    const latestByPatient = new Map<string, number>();
    for (const r of risks ?? []) if (!latestByPatient.has(r.patient_id)) latestByPatient.set(r.patient_id, r.score);
    const buckets = [0, 20, 40, 60, 80, 100];
    const histogram = buckets.slice(0, -1).map((low, i) => {
      const high = buckets[i + 1];
      const count = Array.from(latestByPatient.values()).filter((s) => s >= low && s < high).length;
      return { range: `${low}-${high}`, count };
    });

    // Symptom prevalence
    const { data: syms } = await supabase.from("patient_symptoms").select("symptom_name, patient_id");
    const uniqBySym = new Map<string, Set<string>>();
    for (const s of syms ?? []) {
      const set = uniqBySym.get(s.symptom_name) ?? new Set();
      set.add(s.patient_id);
      uniqBySym.set(s.symptom_name, set);
    }
    const prevalence = Array.from(uniqBySym.entries())
      .map(([name, set]) => ({ symptom: name, patients: set.size }))
      .sort((a, b) => b.patients - a.patients)
      .slice(0, 10);

    // Age vs risk scatter
    const { data: profiles } = await supabase.from("profiles").select("user_id, date_of_birth");
    const scatter: { age: number; score: number }[] = [];
    for (const p of profiles ?? []) {
      const score = latestByPatient.get(p.user_id);
      if (score == null || !p.date_of_birth) continue;
      const age = Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / (365.25 * 86400_000));
      scatter.push({ age, score });
    }

    // Cohort sizes
    const { data: cohorts } = await supabase.from("cohorts").select("*").order("id");

    const writes = [
      { metric_key: "risk_histogram", data: { buckets: histogram } },
      { metric_key: "symptom_prevalence", data: { items: prevalence } },
      { metric_key: "age_vs_risk", data: { points: scatter } },
      { metric_key: "cohort_summary", data: { cohorts: cohorts ?? [] } },
      { metric_key: "totals", data: { patients: (profiles ?? []).length, scored: latestByPatient.size, symptoms: (syms ?? []).length } },
    ];
    for (const w of writes) {
      await supabase.from("population_metrics").upsert({ snapshot_date: today, ...w });
    }

    return new Response(JSON.stringify({ ok: true, metrics: writes.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
