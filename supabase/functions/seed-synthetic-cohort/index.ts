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
  if ((count ?? 0) > 250) {
    return new Response(JSON.stringify({ skipped: true, existing: count }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const N = 300;
  const now = Date.now();
  const profiles: any[] = [];
  const symptoms: any[] = [];
  const notes: any[] = [];

  for (let i = 0; i < N; i++) {
    const user_id = crypto.randomUUID();
    const age = Math.round(clamp(35 + randn() * 15, 18, 88));
    const bmi = +clamp(26 + randn() * 5, 17, 45).toFixed(1);
    const family_history = Math.random() < 0.3;
    // Risk signal (0..1)
    const risk = clamp(
      0.02 * (age - 30) + 0.05 * (bmi - 22) + (family_history ? 0.25 : 0) + randn() * 0.15,
      0.02, 0.98
    );
    const created = new Date(now - Math.random() * 540 * 86400_000).toISOString();
    profiles.push({
      user_id,
      email: `demo+${i}@synthetic.local`,
      first_name: rand(FIRST),
      last_name: rand(LAST),
      date_of_birth: new Date(Date.now() - age * 365.25 * 86400_000).toISOString().slice(0, 10),
      created_at: created,
      updated_at: created,
    });

    const nSyms = Math.round(4 + risk * 8);
    const pool = [...SYMPTOMS].sort(() => Math.random() - 0.5).slice(0, nSyms);
    for (const s of pool) {
      const active = Math.random() < 0.4 + risk * s.w * 0.6;
      if (!active) continue;
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
  for (const c of chunk(profiles, 100)) await supabase.from("profiles").insert(c);
  for (const c of chunk(symptoms, 500)) await supabase.from("patient_symptoms").insert(c);
  for (const c of chunk(notes, 500)) await supabase.from("patient_notes").insert(c);

  return new Response(
    JSON.stringify({ ok: true, profiles: profiles.length, symptoms: symptoms.length, notes: notes.length }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
