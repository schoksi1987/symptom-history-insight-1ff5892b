import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SEV_MAP: Record<string, number> = { mild: 1, moderate: 2, severe: 3 };
const FREQ_MAP: Record<string, number> = { rare: 0.25, occasional: 0.5, frequent: 0.75, constant: 1.0 };

// v0.2 logistic weights (calibrated against synthetic cohort + clinical guidelines)
const WEIGHTS = {
  intercept: -3.8,
  age_norm: 1.4,            // (age-30)/40
  bmi_norm: 1.6,            // (bmi-22)/15
  family_history: 1.1,
  symptom_load: 1.6,        // sum(sev*freq)/8
  note_confidence: 1.0,
  hba1c_norm: 2.6,          // (hba1c-5.4)/2.0 -> ADA cutoffs
  fasting_glucose_norm: 1.8,// (fg-95)/40
  bp_norm: 0.9,             // (systolic-120)/30
  ldl_hdl_ratio: 0.6,       // (ldl/hdl - 2.5)/2
  smoking: 0.5,
  low_activity: 0.4,
};

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }
function num(v: any): number | null { const n = Number(v); return Number.isFinite(n) ? n : null; }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { patientId } = await req.json();
    if (!patientId) return new Response(JSON.stringify({ error: "patientId required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const [{ data: profile }, { data: symptoms }, { data: notes }, { data: exam }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", patientId).maybeSingle(),
      supabase.from("patient_symptoms").select("*").eq("patient_id", patientId),
      supabase.from("patient_notes").select("diabetes_insights, confidence_score").eq("patient_id", patientId).order("created_at", { ascending: false }).limit(5),
      supabase.from("examinations").select("*").eq("patient_user_id", patientId).order("examined_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    let age = 45;
    if (profile?.date_of_birth) {
      age = Math.floor((Date.now() - new Date(profile.date_of_birth).getTime()) / (365.25 * 86400_000));
    }

    const bmi = num(exam?.bmi) ?? 27;
    const hba1c = num(exam?.hba1c);
    const fg = num(exam?.fasting_glucose);
    const sbp = num(exam?.systolic_bp);
    const ldl = num(exam?.ldl);
    const hdl = num(exam?.hdl);
    const family_history = !!exam?.family_history_diabetes;
    const smoking = ["current","yes","daily"].includes(String(exam?.smoking_status ?? "").toLowerCase()) ? 1 : 0;
    const low_activity = ["sedentary","low","none"].includes(String(exam?.physical_activity_level ?? "").toLowerCase()) ? 1 : 0;

    const symptom_load = (symptoms ?? []).reduce((acc, s: any) => acc + (SEV_MAP[s.severity] ?? 1) * (FREQ_MAP[s.frequency] ?? 0.5), 0) / 8;
    const note_confidence = notes && notes.length
      ? notes.reduce((a, n: any) => a + (n.confidence_score ?? 0), 0) / notes.length
      : 0;

    const features: Record<string, number | null | boolean> = {
      age,
      bmi,
      hba1c,
      fasting_glucose: fg,
      systolic_bp: sbp,
      ldl,
      hdl,
      family_history,
      smoking: !!smoking,
      low_activity: !!low_activity,
      age_norm: (age - 30) / 40,
      bmi_norm: (bmi - 22) / 15,
      symptom_load,
      note_confidence,
    };

    const terms: { key: string; label: string; value: number }[] = [
      { key: "age", label: `Age ${age}`, value: WEIGHTS.age_norm * ((age - 30) / 40) },
      { key: "bmi", label: `BMI ${bmi.toFixed(1)}`, value: WEIGHTS.bmi_norm * ((bmi - 22) / 15) },
      { key: "family_history", label: "Family history of diabetes", value: WEIGHTS.family_history * (family_history ? 1 : 0) },
      { key: "symptoms", label: `Symptom burden (${(symptoms ?? []).length})`, value: WEIGHTS.symptom_load * symptom_load },
      { key: "notes", label: "Recent note AI confidence", value: WEIGHTS.note_confidence * note_confidence },
    ];

    if (hba1c !== null) terms.push({ key: "hba1c", label: `HbA1c ${hba1c.toFixed(1)}%`, value: WEIGHTS.hba1c_norm * ((hba1c - 5.4) / 2.0) });
    if (fg !== null) terms.push({ key: "fasting_glucose", label: `Fasting glucose ${fg} mg/dL`, value: WEIGHTS.fasting_glucose_norm * ((fg - 95) / 40) });
    if (sbp !== null) terms.push({ key: "blood_pressure", label: `Systolic BP ${sbp}`, value: WEIGHTS.bp_norm * ((sbp - 120) / 30) });
    if (ldl !== null && hdl !== null && hdl > 0) terms.push({ key: "lipids", label: `LDL/HDL ${(ldl/hdl).toFixed(2)}`, value: WEIGHTS.ldl_hdl_ratio * ((ldl/hdl - 2.5) / 2) });
    if (smoking) terms.push({ key: "smoking", label: "Current smoker", value: WEIGHTS.smoking });
    if (low_activity) terms.push({ key: "activity", label: "Low physical activity", value: WEIGHTS.low_activity });

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
      model_version: "v0.2-logistic-clinical",
    }).select().single();

    if (error) throw error;
    return new Response(JSON.stringify({ ok: true, risk: saved, used_examination: !!exam }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
