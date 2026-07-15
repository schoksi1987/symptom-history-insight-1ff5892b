import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SEV_MAP: Record<string, number> = { mild: 1, moderate: 2, severe: 3 };
const FREQ_MAP: Record<string, number> = { rare: 0.25, occasional: 0.5, frequent: 0.75, constant: 1.0 };

// v0.1 logistic weights (calibrated against synthetic cohort defaults)
const WEIGHTS = {
  intercept: -3.2,
  age_norm: 1.6,           // (age-30)/40
  bmi_norm: 1.8,           // (bmi-22)/15
  family_history: 1.3,
  symptom_load: 2.1,       // sum(sev*freq)/8
  note_confidence: 1.5,    // avg diabetes confidence
};

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { patientId } = await req.json();
    if (!patientId) return new Response(JSON.stringify({ error: "patientId required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const [{ data: profile }, { data: symptoms }, { data: notes }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", patientId).maybeSingle(),
      supabase.from("patient_symptoms").select("*").eq("patient_id", patientId),
      supabase.from("patient_notes").select("diabetes_insights, confidence_score").eq("patient_id", patientId).order("created_at", { ascending: false }).limit(5),
    ]);

    let age = 45;
    if (profile?.date_of_birth) {
      age = Math.floor((Date.now() - new Date(profile.date_of_birth).getTime()) / (365.25 * 86400_000));
    }
    const bmi = 27; // no BMI column yet; neutral default
    const family_history = false;
    const symptom_load = (symptoms ?? []).reduce((acc, s: any) => acc + (SEV_MAP[s.severity] ?? 1) * (FREQ_MAP[s.frequency] ?? 0.5), 0) / 8;
    const note_confidence = notes && notes.length
      ? notes.reduce((a, n: any) => a + (n.confidence_score ?? 0), 0) / notes.length
      : 0;

    const features = {
      age,
      age_norm: (age - 30) / 40,
      bmi_norm: (bmi - 22) / 15,
      family_history: family_history ? 1 : 0,
      symptom_load,
      note_confidence,
    };

    const terms = [
      { key: "age", value: WEIGHTS.age_norm * features.age_norm, label: `Age ${age}` },
      { key: "bmi", value: WEIGHTS.bmi_norm * features.bmi_norm, label: `BMI ${bmi}` },
      { key: "family_history", value: WEIGHTS.family_history * features.family_history, label: "Family history" },
      { key: "symptoms", value: WEIGHTS.symptom_load * features.symptom_load, label: `Symptom burden (${(symptoms ?? []).length})` },
      { key: "notes", value: WEIGHTS.note_confidence * features.note_confidence, label: "Recent note AI confidence" },
    ];
    const linear = WEIGHTS.intercept + terms.reduce((a, t) => a + t.value, 0);
    const probability = sigmoid(linear);
    const score = Math.round(probability * 100);

    const contributions = terms
      .map((t) => ({ ...t, weight: +t.value.toFixed(3) }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    const { data: saved, error } = await supabase.from("patient_risk_scores").insert({
      patient_id: patientId,
      score,
      probability: +probability.toFixed(4),
      features,
      contributions,
      model_version: "v0.1-logistic",
    }).select().single();

    if (error) throw error;
    return new Response(JSON.stringify({ ok: true, risk: saved }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
