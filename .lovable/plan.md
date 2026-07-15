
## Goal

Turn the app into a working diabetes analytics product with four data-science capabilities, seeded synthetic data, and matching MCP tools so both the UI and external agents can use them.

## 1. Synthetic seed data

Create a `seed-synthetic-cohort` edge function (admin-invoked once) that generates ~300 synthetic patients with correlated features:

- profiles: age, sex, BMI, ethnicity, family history
- 4–12 symptoms each (weighted by simulated risk)
- 2–5 notes each with plausible free text
- back-dated `created_at` spread over 18 months so trends exist

Uses `service_role` inside the function. Idempotent (skips if `profiles` count > 250). A "Seed demo data" button on an admin/dev page triggers it.

## 2. Schema additions

New tables (RLS: user reads own rows; service_role writes):

- `patient_risk_scores` — `patient_id`, `score` (0–100), `probability`, `model_version`, `features` (jsonb), `contributions` (jsonb, per-feature SHAP-like weights), `computed_at`
- `patient_cohort_assignments` — `patient_id`, `cohort_id`, `distance`, `computed_at`
- `cohorts` — `id`, `label`, `centroid` (jsonb), `size`, `avg_risk`, `top_features` (jsonb), `outcome_summary` (jsonb) — readable by all authenticated users
- `symptom_forecasts` — `patient_id`, `symptom_name`, `history` (jsonb series), `forecast` (jsonb series), `trend` (`improving|stable|worsening`), `anomaly` (bool), `computed_at`
- `population_metrics` — daily snapshot: symptom prevalence, risk histogram, correlations (jsonb). Readable by all authenticated users.

Standard GRANTs per Lovable Cloud rules.

## 3. Data science compute (both, per your answer)

### Precomputed via SQL + scheduled job

- `pg_cron` job nightly: refresh `cohorts` (KMeans-style assignment done in SQL using precomputed feature vectors via a `compute-cohorts` edge function invoked by cron), refresh `population_metrics` (pure SQL aggregation).
- Cohort clustering: feature vector = [normalized age, symptom count, avg severity ordinal, note sentiment score from existing `diabetes_insights`]. K=4 clusters. Assigned via nearest-centroid in JS inside the edge function, written to `patient_cohort_assignments`.

### On-demand edge functions

- `compute-risk-score` — logistic-regression style scorer implemented in TS (fixed learned weights we set from synthetic data; document as v0.1 heuristic model). Inputs: patient_id. Reads symptoms + profile + latest notes' `diabetes_insights.confidence`, outputs score + per-feature contributions. Persists to `patient_risk_scores`.
- `compute-symptom-forecast` — for each tracked symptom, build a weekly time series of severity ordinal (mild=1, moderate=2, severe=3) × frequency weight; fit simple exponential smoothing (Holt linear) in TS; project 4 weeks; flag anomaly if last point > mean+2σ. Persists to `symptom_forecasts`.
- `compute-cohorts` — nightly recluster (called by cron).
- All functions: CORS, zod validation, `verify_jwt=false` with in-code JWT check for user-triggered ones; cron-only ones stay service-role internal.

## 4. Frontend

New/updated pages (presentation only — logic lives in edge functions):

- **Patient Dashboard** — add:
  - Risk gauge (0–100) with top 3 contributing factors
  - "Similar patients" card: cohort label, size, avg risk, what worked for them (from `cohorts.outcome_summary`)
  - Symptom forecast sparkline per top symptom + trend badge
  - "Recompute" button → invokes `compute-risk-score` + `compute-symptom-forecast`
- **Population Analytics** (new route `/analytics`, admin/clinician view):
  - Risk-score histogram
  - Symptom prevalence bar chart
  - Age × risk scatter
  - Cohort cards (4 tiles)
  - All via `recharts` reading `population_metrics` + `cohorts`
- **Admin/Dev page** — "Seed synthetic cohort" button, "Run nightly jobs now" button.

Uses existing shadcn tokens; no hardcoded colors.

## 5. MCP tools (added to existing 4)

Each in `src/lib/mcp/tools/`, registered in `src/lib/mcp/index.ts`:

- `get_risk_score` — returns latest risk score + contributions for signed-in user
- `recompute_risk_score` — triggers `compute-risk-score` for signed-in user
- `get_similar_patients` — returns cohort assignment, cohort profile, outcomes
- `get_symptom_forecast` — inputs `{ symptom_name?, limit? }`; returns forecast rows
- `get_population_metrics` — inputs `{ metric? }`; returns latest population snapshot (public-ish aggregate — readable by any authenticated user)

Run `app_mcp_server--extract_mcp_manifest` and deploy the `mcp` function after edits.

## 6. Technical notes

- Models are transparent heuristics (logistic regression w/ fixed weights, Holt smoothing, k-means-style centroid assignment) implemented in TypeScript — no Python runtime. This fits the edge-function stack and is auditable for a clinical demo. Document `model_version` on every write so we can swap in trained weights later.
- Weights are calibrated once against the synthetic cohort in a one-off script whose output we hardcode into `compute-risk-score`.
- All AI-narrative generation (e.g. "why this cohort matches") continues to use Lovable AI Gateway (`google/gemini-2.5-flash`) via existing `generate-patient-insights` — we do NOT duplicate that.
- No changes to existing auth, existing MCP OAuth setup, or existing insights pipeline.

## Order of implementation

1. Migration: new tables + GRANTs + RLS
2. `seed-synthetic-cohort` function + admin button
3. `compute-risk-score` + Patient Dashboard risk card
4. `compute-symptom-forecast` + forecast card
5. `compute-cohorts` + similar-patients card
6. `population_metrics` refresh SQL + `/analytics` page
7. pg_cron schedule for nightly refresh
8. New MCP tools + manifest extract + deploy
