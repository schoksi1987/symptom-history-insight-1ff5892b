import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SEV: Record<string, number> = { mild: 1, moderate: 2, severe: 3 };
const FREQ: Record<string, number> = { rare: 0.25, occasional: 0.5, frequent: 0.75, constant: 1.0 };

function weekKey(d: Date) {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  t.setDate(t.getDate() - t.getDay());
  return t.toISOString().slice(0, 10);
}

// Holt linear exponential smoothing
function holt(y: number[], alpha = 0.5, beta = 0.3, horizon = 4) {
  if (y.length === 0) return { fitted: [], forecast: [] as number[], level: 0, trend: 0 };
  let L = y[0];
  let T = y.length > 1 ? y[1] - y[0] : 0;
  const fitted = [L];
  for (let i = 1; i < y.length; i++) {
    const prevL = L, prevT = T;
    L = alpha * y[i] + (1 - alpha) * (prevL + prevT);
    T = beta * (L - prevL) + (1 - beta) * prevT;
    fitted.push(L);
  }
  const forecast: number[] = [];
  for (let h = 1; h <= horizon; h++) forecast.push(Math.max(0, L + h * T));
  return { fitted, forecast, level: L, trend: T };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { patientId } = await req.json();
    if (!patientId) return new Response(JSON.stringify({ error: "patientId required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: rows } = await supabase.from("patient_symptoms").select("*").eq("patient_id", patientId);
    const groups = new Map<string, any[]>();
    for (const r of rows ?? []) {
      const arr = groups.get(r.symptom_name) ?? [];
      arr.push(r);
      groups.set(r.symptom_name, arr);
    }

    // wipe previous forecasts for this patient
    await supabase.from("symptom_forecasts").delete().eq("patient_id", patientId);

    const results: any[] = [];
    for (const [name, list] of groups.entries()) {
      const weekly = new Map<string, number>();
      for (const r of list) {
        const wk = weekKey(new Date(r.created_at));
        const v = (SEV[r.severity] ?? 1) * (FREQ[r.frequency] ?? 0.5);
        weekly.set(wk, Math.max(weekly.get(wk) ?? 0, v));
      }
      const keys = Array.from(weekly.keys()).sort();
      if (keys.length < 2) continue;
      const y = keys.map((k) => weekly.get(k)!);
      const { forecast, trend } = holt(y);
      const mean = y.reduce((a, b) => a + b, 0) / y.length;
      const sd = Math.sqrt(y.reduce((a, b) => a + (b - mean) ** 2, 0) / y.length);
      const anomaly = y[y.length - 1] > mean + 2 * sd;
      const trendLabel = trend > 0.05 ? "worsening" : trend < -0.05 ? "improving" : "stable";
      const history = keys.map((k, i) => ({ week: k, value: +y[i].toFixed(2) }));
      const lastWeek = new Date(keys[keys.length - 1]);
      const forecastSeries = forecast.map((v, i) => {
        const d = new Date(lastWeek);
        d.setDate(d.getDate() + (i + 1) * 7);
        return { week: d.toISOString().slice(0, 10), value: +v.toFixed(2) };
      });
      results.push({
        patient_id: patientId,
        symptom_name: name,
        history,
        forecast: forecastSeries,
        trend: trendLabel,
        anomaly,
      });
    }

    if (results.length) await supabase.from("symptom_forecasts").insert(results);
    return new Response(JSON.stringify({ ok: true, forecasts: results.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
