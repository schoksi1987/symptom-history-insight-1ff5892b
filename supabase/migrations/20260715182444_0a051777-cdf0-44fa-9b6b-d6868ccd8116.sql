
-- Risk scores
CREATE TABLE public.patient_risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  score numeric NOT NULL,
  probability numeric NOT NULL,
  model_version text NOT NULL DEFAULT 'v0.1-logistic',
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  contributions jsonb NOT NULL DEFAULT '[]'::jsonb,
  computed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.patient_risk_scores TO authenticated;
GRANT ALL ON public.patient_risk_scores TO service_role;
ALTER TABLE public.patient_risk_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "risk_scores_own" ON public.patient_risk_scores FOR SELECT TO authenticated USING (patient_id = auth.uid());
CREATE INDEX idx_risk_scores_patient ON public.patient_risk_scores(patient_id, computed_at DESC);

-- Cohorts (shared reference data)
CREATE TABLE public.cohorts (
  id integer PRIMARY KEY,
  label text NOT NULL,
  description text,
  centroid jsonb NOT NULL DEFAULT '{}'::jsonb,
  size integer NOT NULL DEFAULT 0,
  avg_risk numeric NOT NULL DEFAULT 0,
  top_features jsonb NOT NULL DEFAULT '[]'::jsonb,
  outcome_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  model_version text NOT NULL DEFAULT 'v0.1-kmeans',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cohorts TO authenticated;
GRANT ALL ON public.cohorts TO service_role;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cohorts_read_all" ON public.cohorts FOR SELECT TO authenticated USING (true);

-- Cohort assignments
CREATE TABLE public.patient_cohort_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  cohort_id integer NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  distance numeric NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.patient_cohort_assignments TO authenticated;
GRANT ALL ON public.patient_cohort_assignments TO service_role;
ALTER TABLE public.patient_cohort_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cohort_assign_own" ON public.patient_cohort_assignments FOR SELECT TO authenticated USING (patient_id = auth.uid());
CREATE INDEX idx_cohort_assign_patient ON public.patient_cohort_assignments(patient_id, computed_at DESC);

-- Symptom forecasts
CREATE TABLE public.symptom_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  symptom_name text NOT NULL,
  history jsonb NOT NULL DEFAULT '[]'::jsonb,
  forecast jsonb NOT NULL DEFAULT '[]'::jsonb,
  trend text NOT NULL DEFAULT 'stable',
  anomaly boolean NOT NULL DEFAULT false,
  computed_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.symptom_forecasts TO authenticated;
GRANT ALL ON public.symptom_forecasts TO service_role;
ALTER TABLE public.symptom_forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "forecast_own" ON public.symptom_forecasts FOR SELECT TO authenticated USING (patient_id = auth.uid());
CREATE INDEX idx_forecasts_patient ON public.symptom_forecasts(patient_id, computed_at DESC);

-- Population metrics (shared)
CREATE TABLE public.population_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  metric_key text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(snapshot_date, metric_key)
);
GRANT SELECT ON public.population_metrics TO authenticated;
GRANT ALL ON public.population_metrics TO service_role;
ALTER TABLE public.population_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pop_metrics_read_all" ON public.population_metrics FOR SELECT TO authenticated USING (true);
CREATE INDEX idx_pop_metrics_recent ON public.population_metrics(metric_key, snapshot_date DESC);

-- User roles for admin gate on seeding/admin page
CREATE TYPE public.app_role AS ENUM ('admin', 'clinician', 'user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_read_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
