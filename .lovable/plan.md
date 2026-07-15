## What's wired today
- ✅ Exam saves to `examinations` table
- ✅ `compute-risk-score` reads exam vitals → score with per-feature contributions
- ✅ MyInsights shows flagged vitals + risk factors
- ✅ Analytics BMI + HbA1c distributions
- ✅ MCP tool `get_patient_examination`
- ✅ Seeded 150 synthetic patients each have an exam
- ✅ `/recommendations/:id` route added

## What's still a gap
The **Recommendations page** (`/recommendations`) calls `generate-patient-insights`, which only reads `profiles`, `patient_symptoms`, `patient_notes`. It does not read `examinations` or the computed `patient_risk_scores`, so the AI recommendations ignore the clinical exam.

## Fix — 1 focused change
Update `supabase/functions/generate-patient-insights/index.ts`:

1. Also fetch the latest row from `examinations` and latest `patient_risk_scores`.
2. Add them to the AI prompt under `CLINICAL EXAMINATION` and `MODEL RISK SCORE (with contributing factors)`.
3. Instruct the model to ground `recommendations` in the actual out-of-range vitals (e.g. "HbA1c 8.2% → intensify glycemic control", "LDL 165 → consider statin", "Systolic 142 → lifestyle + BP recheck") and to reconcile with the deterministic risk score rather than compute its own.
4. Persist the model risk score alongside the AI analysis so the UI shows one consistent number.

## Small UI touch on Recommendations
Add a "Based on your examination" summary chip listing which vitals drove each recommendation (BMI / HbA1c / BP / LDL / smoking / activity), pulled from the risk-score `contributions` we already store.

## Deploy
Redeploy `generate-patient-insights`. No schema changes, no new tables.

After this, every recommendation on `/recommendations/:id` will be traceable to a specific exam value — closing the loop between exam → data-science model → AI recommendation.

Say go and I'll ship it.