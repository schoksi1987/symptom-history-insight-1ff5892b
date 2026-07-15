import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIRST = ["Alex","Sam","Jordan","Taylor","Casey","Morgan","Riley","Quinn","Avery","Jamie","Cameron","Drew","Sydney","Reese","Skylar","Rowan","Emerson","Finley","Harper","Kendall","Logan","Micah","Peyton","Sage","Blake","Charlie","Dakota","Elliot","Frankie","Gray"];
const LAST = ["Nguyen","Patel","Garcia","Kim","Smith","Johnson","Williams","Brown","Jones","Davis","Miller","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Lee","Walker","Hall","Young","King","Wright","Lopez","Hill","Scott","Green"];
const SYMPTOMS = [
  { n: "fatigue", w: 0.7 },
  { n: "increased_thirst", w: 0.9 },
  { n: "frequent_urination", w: 0.9 },
  { n: "blurred_vision", w: 0.6 },
  { n: "slow_healing_wounds", w: 0.5 },
  { n: "tingling_hands_feet", w: 0.5 },
  { n: "unexplained_weight_loss", w: 0.4 },
  { n: "recurring_infections", w: 0.4 },
  { n: "headache", w: 0.2 },
  { n: "dizziness", w: 0.3 },
];
const SEV = ["mild","moderate","severe"];
const FREQ = ["rare","occasional","frequent","constant"];

function rand<T>(a: T[]) { return a[Math.floor(Math.random()*a.length)]; }
function randn() { let u=0,v=0; while(!u) u=Math.random(); while(!v) v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function clamp(n:number,a:number,b:number){return Math.max(a,Math.min(b,n));}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  if ((count ?? 0) > 120) {
    return new Response(JSON.stringify({ skipped: true, existing: count }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const N = 150;
  const now = Date.now();
  const symptoms: any[] = [];
  const notes: any[] = [];
  const exams: any[] = [];
  let created = 0;

  for (let i = 0; i < N; i++) {
    const age = Math.round(clamp(35 + randn() * 15, 18, 88));
    const bmi = +clamp(26 + randn() * 5, 17, 45).toFixed(1);
    const family_history = Math.random() < 0.3;
    const risk = clamp(
      0.02 * (age - 30) + 0.05 * (bmi - 22) + (family_history ? 0.25 : 0) + randn() * 0.15,
      0.02, 0.98
    );
    const first = rand(FIRST); const last = rand(LAST);
    const email = `demo+${Date.now()}-${i}@synthetic.local`;

    const { data: userRes, error: userErr } = await supabase.auth.admin.createUser({
      email,
      password: crypto.randomUUID(),
      email_confirm: true,
      user_metadata: { first_name: first, last_name: last, synthetic: true },
    });
    if (userErr || !userRes?.user) continue;
    const user_id = userRes.user.id;
    created++;

    await supabase.from("profiles").update({
      date_of_birth: new Date(Date.now() - age * 365.25 * 86400_000).toISOString().slice(0, 10),
    }).eq("user_id", user_id);

    // Clinical vitals correlated to risk band
    const height_cm = +clamp(165 + randn() * 10, 145, 195).toFixed(1);
    const weight_kg = +clamp(bmi * (height_cm / 100) * (height_cm / 100) + randn() * 2, 40, 160).toFixed(1);
    const hba1c = +clamp(5.2 + risk * 3.2 + randn() * 0.4, 4.5, 12.5).toFixed(1);
    const fasting_glucose = Math.round(clamp(85 + risk * 90 + randn() * 12, 70, 260));
    const systolic_bp = Math.round(clamp(115 + risk * 30 + randn() * 8, 95, 190));
    const diastolic_bp = Math.round(clamp(72 + risk * 15 + randn() * 6, 55, 115));
    const ldl = Math.round(clamp(100 + risk * 60 + randn() * 15, 60, 220));
    const hdl = Math.round(clamp(55 - risk * 18 + randn() * 6, 25, 90));
    const triglycerides = Math.round(clamp(120 + risk * 180 + randn() * 30, 60, 500));
    const total_cholesterol = Math.round(ldl + hdl + triglycerides / 5);
    const smoking_status = Math.random() < 0.15 + risk * 0.15 ? "current" : "never";
    const activity_bucket = risk > 0.6 ? "sedentary" : risk > 0.35 ? "low" : "moderate";

    exams.push({
      patient_user_id: user_id,
      examined_at: new Date(now - Math.random() * 90 * 86400_000).toISOString(),
      height_cm, weight_kg,
      systolic_bp, diastolic_bp,
      heart_rate: Math.round(clamp(72 + randn() * 8, 55, 110)),
      temperature_c: 36.7,
      hba1c, fasting_glucose,
      ldl, hdl, triglycerides, total_cholesterol,
      family_history_diabetes: family_history,
      smoking_status,
      alcohol_use: Math.random() < 0.4 ? "occasional" : "none",
      physical_activity_level: activity_bucket,
      physician_findings: risk > 0.6
        ? "Metabolic syndrome features; HbA1c and fasting glucose elevated. Initiate lifestyle intervention and consider pharmacotherapy."
        : risk > 0.35
          ? "Borderline glycemic markers; recommend diet counseling and 3-month recheck."
          : "Within normal limits; routine annual screening.",
    });

    const nSyms = Math.round(4 + risk * 8);
    const pool = [...SYMPTOMS].sort(() => Math.random() - 0.5).slice(0, nSyms);
    for (const s of pool) {
      if (Math.random() >= 0.4 + risk * s.w * 0.6) continue;
      const sevIdx = clamp(Math.round(risk * s.w * 3 + randn() * 0.6), 0, 2);
      const freqIdx = clamp(Math.round(risk * s.w * 3 + randn() * 0.6), 0, 3);
      symptoms.push({
        patient_id: user_id,
        symptom_name: s.n,
        severity: SEV[sevIdx],
        frequency: FREQ[freqIdx],
        source: "synthetic",
        created_at: new Date(now - Math.random() * 400 * 86400_000).toISOString(),
      });
    }

    const nNotes = 2 + Math.floor(Math.random() * 4);
    for (let k = 0; k < nNotes; k++) {
      const summary = risk > 0.6
        ? "Patient reports worsening thirst and fatigue; glucose control concerns."
        : risk > 0.35
          ? "Mild symptoms, encourage monitoring diet and activity."
          : "No significant symptoms; routine follow-up.";
      notes.push({
        patient_id: user_id,
        note_text: summary,
        ai_summary: summary,
        analysis_status: "completed",
        diabetes_insights: { riskLevel: risk > 0.6 ? "high" : risk > 0.35 ? "moderate" : "low", confidence: +risk.toFixed(2) },
        confidence_score: +risk.toFixed(2),
        created_at: new Date(now - Math.random() * 500 * 86400_000).toISOString(),
      });
    }
  }

  const chunk = <T>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length/n) }, (_, i) => a.slice(i*n, i*n+n));
  for (const c of chunk(exams, 500)) {
    const { error } = await supabase.from("examinations").insert(c);
    if (error) console.error("exam insert:", error.message);
  }
  for (const c of chunk(symptoms, 500)) {
    const { error } = await supabase.from("patient_symptoms").insert(c);
    if (error) console.error("symptom insert:", error.message);
  }
  for (const c of chunk(notes, 500)) {
    const { error } = await supabase.from("patient_notes").insert(c);
    if (error) console.error("note insert:", error.message);
  }

  return new Response(
    JSON.stringify({ ok: true, profiles: created, symptoms: symptoms.length, notes: notes.length }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
