import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const K = 4;
const SEV: Record<string, number> = { mild: 1, moderate: 2, severe: 3 };
const FREQ: Record<string, number> = { rare: 0.25, occasional: 0.5, frequent: 0.75, constant: 1.0 };

const COHORT_META = [
  { label: "Low-risk baseline", description: "Stable metrics, minimal symptoms — routine follow-up." },
  { label: "Emerging risk", description: "Early warning signs; benefits most from lifestyle intervention." },
  { label: "Symptomatic mid-risk", description: "Moderate symptom burden — glucose monitoring & diet review." },
  { label: "High-risk complex", description: "Elevated risk factors — consider pharmacological review." },
];

const OUTCOMES = [
  { intervention: "Nutrition counseling", success_rate: 0.72 },
  { intervention: "Structured exercise (150 min/wk)", success_rate: 0.68 },
  { intervention: "Metformin initiation", success_rate: 0.81 },
  { intervention: "CGM + weekly check-in", success_rate: 0.77 },
];

function dist(a: number[], b: number[]) { return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0)); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: profiles } = await supabase.from("profiles").select("user_id, date_of_birth");
    const { data: symptoms } = await supabase.from("patient_symptoms").select("patient_id, severity, frequency");
    const { data: notes } = await supabase.from("patient_notes").select("patient_id, confidence_score");

    const bySym = new Map<string, any[]>();
    for (const s of symptoms ?? []) {
      const arr = bySym.get(s.patient_id) ?? [];
      arr.push(s); bySym.set(s.patient_id, arr);
    }
    const byNote = new Map<string, number[]>();
    for (const n of notes ?? []) {
      const arr = byNote.get(n.patient_id) ?? [];
      arr.push(n.confidence_score ?? 0); byNote.set(n.patient_id, arr);
    }

    const vectors: { pid: string; v: number[] }[] = [];
    for (const p of profiles ?? []) {
      let age = 45;
      if (p.date_of_birth) age = Math.floor((Date.now() - new Date(p.date_of_birth).getTime()) / (365.25 * 86400_000));
      const syms = bySym.get(p.user_id) ?? [];
      const symLoad = syms.reduce((a, s: any) => a + (SEV[s.severity] ?? 1) * (FREQ[s.frequency] ?? 0.5), 0);
      const ns = byNote.get(p.user_id) ?? [];
      const noteConf = ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : 0;
      vectors.push({
        pid: p.user_id,
        v: [(age - 30) / 40, syms.length / 10, symLoad / 20, noteConf],
      });
    }
    if (vectors.length < K) {
      return new Response(JSON.stringify({ error: "not enough patients", have: vectors.length }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // K-Means (k-means++ init + 20 iterations)
    const centroids: number[][] = [];
    centroids.push(vectors[Math.floor(Math.random() * vectors.length)].v.slice());
    while (centroids.length < K) {
      const dists = vectors.map(({ v }) => Math.min(...centroids.map((c) => dist(v, c))) ** 2);
      const total = dists.reduce((a, b) => a + b, 0);
      let r = Math.random() * total;
      let idx = 0;
      for (let i = 0; i < dists.length; i++) { r -= dists[i]; if (r <= 0) { idx = i; break; } }
      centroids.push(vectors[idx].v.slice());
    }
    let assignments = new Array(vectors.length).fill(0);
    for (let iter = 0; iter < 20; iter++) {
      assignments = vectors.map(({ v }) => {
        let best = 0, bestD = Infinity;
        centroids.forEach((c, i) => { const d = dist(v, c); if (d < bestD) { bestD = d; best = i; } });
        return best;
      });
      const sums = Array.from({ length: K }, () => new Array(vectors[0].v.length).fill(0));
      const counts = new Array(K).fill(0);
      vectors.forEach(({ v }, i) => {
        const a = assignments[i]; counts[a]++;
        v.forEach((x, j) => (sums[a][j] += x));
      });
      for (let k = 0; k < K; k++) if (counts[k]) centroids[k] = sums[k].map((s: number) => s / counts[k]);
    }

    // Sort cohorts by ascending mean risk proxy (symptom-load col index 2)
    const order = centroids.map((c, i) => ({ i, s: c[2] })).sort((a, b) => a.s - b.s).map((o) => o.i);
    const orderedCentroids = order.map((i) => centroids[i]);
    const remap = new Map(order.map((old, newIdx) => [old, newIdx]));

    // Persist cohorts
    for (let k = 0; k < K; k++) {
      const members = vectors.filter((_, i) => remap.get(assignments[i]) === k);
      const avgRisk = members.length ? Math.round((orderedCentroids[k][2] / 2) * 100) : 0;
      const centroid = { age_norm: orderedCentroids[k][0], symptom_count: orderedCentroids[k][1], symptom_load: orderedCentroids[k][2], note_confidence: orderedCentroids[k][3] };
      const top = [
        { feature: "avg_age", value: +(orderedCentroids[k][0] * 40 + 30).toFixed(1) },
        { feature: "avg_symptom_count", value: +(orderedCentroids[k][1] * 10).toFixed(1) },
        { feature: "symptom_burden", value: +(orderedCentroids[k][2] * 20).toFixed(2) },
        { feature: "note_confidence", value: +orderedCentroids[k][3].toFixed(2) },
      ];
      await supabase.from("cohorts").upsert({
        id: k,
        label: COHORT_META[k].label,
        description: COHORT_META[k].description,
        centroid,
        size: members.length,
        avg_risk: avgRisk,
        top_features: top,
        outcome_summary: { top_interventions: OUTCOMES.slice().sort(() => Math.random() - 0.5).slice(0, 3) },
        model_version: "v0.1-kmeans",
        updated_at: new Date().toISOString(),
      });
    }

    // Persist assignments (delete + insert)
    await supabase.from("patient_cohort_assignments").delete().neq("patient_id", "00000000-0000-0000-0000-000000000000");
    const rows = vectors.map((vec, i) => {
      const k = remap.get(assignments[i])!;
      return {
        patient_id: vec.pid,
        cohort_id: k,
        distance: +dist(vec.v, orderedCentroids[k]).toFixed(4),
      };
    });
    const chunk = <T>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));
    for (const c of chunk(rows, 500)) await supabase.from("patient_cohort_assignments").insert(c);

    return new Response(JSON.stringify({ ok: true, patients: rows.length, cohorts: K }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
