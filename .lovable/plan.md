## Goal
Wire the patient examination page into the database, feed clinical vitals into the risk-scoring model, and surface them across insights and analytics — so the deployed app runs a real data-science pipeline instead of a mock exam form.

## 1. New `examinations` table
Fields captured by the current exam UI:
- vitals: `height_cm`, `weight_kg`, `bmi` (generated), `systolic_bp`, `diastolic_bp`, `heart_rate`, `temperature_c`, `respiratory_rate`, `oxygen_saturation`
- labs: `hba1c`, `fasting_glucose`, `random_glucose`, `ldl`, `hdl`, `triglycerides`, `total_cholesterol`
- history: `family_history_diabetes` (bool), `smoking_status`, `alcohol_use`, `physical_activity_level`
- exam findings: `body_systems_jsonb`, `physician_findings` (text), `medications_jsonb`
- meta: `patient_user_id` (FK), `examined_by` (physician user_id), `examined_at`

RLS: patient can read own exams; physicians (role=physician/admin via `has_role`) can read/write for any patient. GRANTs for `authenticated` + `service_role`. Trigger to auto-update `updated_at`. Trigger to enqueue risk recompute on insert/update.

## 2. Save the exam form
Replace mock local state in `src/pages/PatientExamination.tsx` (or equivalent) with:
- `useQuery` to load latest exam for the patient
- `useMutation` to upsert on Save
- Toast + optimistic UI

## 3. Extend the risk model
Update `supabase/functions/compute-risk-score/index.ts`:
- Pull latest exam row for the patient
- Add weighted features: BMI (>30 high), HbA1c (>6.5 diabetic, 5.7–6.4 pre), fasting glucose (>126), BP (>140/90), LDL (>130), HDL (<40 M / <50 F), family history, smoking, low activity
- Return per-feature contributions in existing `factors` JSON so the explainability panel keeps working
- Keep age + symptom signals as before

## 4. Backfill synthetic data
Update `seed-synthetic-cohort` to also generate a plausible exam per seeded patient (correlated with their risk band) so cohorts, forecasts and analytics have vitals to work with.

## 5. Surface vitals in UI
- **My Insights / Patient detail**: show latest vitals card + which factors drove the risk score
- **Analytics**: add BMI distribution, HbA1c distribution, BP vs risk scatter to the population dashboard
- **Admin**: "Recompute all" button already exists — extend to also refresh population metrics after exams change

## 6. MCP tools
Add one new tool `get_patient_examination` (read-only, RLS-scoped) so external agents can pull the latest exam. Update `.lovable/mcp/manifest.json` and redeploy the `mcp` function.

## 7. Deploy
Migration → regen types → edge function deploys are automatic. Then you can publish to `symptom.ai`.

## Technical notes
- BMI stored as generated column: `GENERATED ALWAYS AS (weight_kg / ((height_cm/100.0)^2)) STORED`
- Recompute trigger calls `compute-risk-score` via `pg_net` (or just invalidate cache and let client trigger it — simpler, no new extension)
- All numeric fields nullable so partial exams save cleanly
- Model stays fully explainable (linear weighted sum, no black box) — matches earlier "defensible in chart review" goal

Say the word and I'll build it.