
CREATE TABLE public.examinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  examined_by UUID REFERENCES auth.users(id),
  examined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  height_cm NUMERIC,
  weight_kg NUMERIC,
  bmi NUMERIC GENERATED ALWAYS AS (
    CASE WHEN height_cm IS NOT NULL AND height_cm > 0 AND weight_kg IS NOT NULL
      THEN weight_kg / ((height_cm/100.0) * (height_cm/100.0))
      ELSE NULL END
  ) STORED,
  waist_cm NUMERIC,
  systolic_bp NUMERIC,
  diastolic_bp NUMERIC,
  heart_rate NUMERIC,
  temperature_c NUMERIC,
  hba1c NUMERIC,
  fasting_glucose NUMERIC,
  random_glucose NUMERIC,
  ldl NUMERIC,
  hdl NUMERIC,
  triglycerides NUMERIC,
  total_cholesterol NUMERIC,
  family_history_diabetes BOOLEAN DEFAULT false,
  smoking_status TEXT,
  alcohol_use TEXT,
  physical_activity_level TEXT,
  body_systems JSONB DEFAULT '{}'::jsonb,
  medications JSONB DEFAULT '[]'::jsonb,
  physician_findings TEXT,
  patient_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.examinations TO authenticated;
GRANT ALL ON public.examinations TO service_role;

ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own examinations"
  ON public.examinations FOR SELECT TO authenticated
  USING (auth.uid() = patient_user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients insert own examinations"
  ON public.examinations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = patient_user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients update own examinations"
  ON public.examinations FOR UPDATE TO authenticated
  USING (auth.uid() = patient_user_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = patient_user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients delete own examinations"
  ON public.examinations FOR DELETE TO authenticated
  USING (auth.uid() = patient_user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_examinations_updated_at
  BEFORE UPDATE ON public.examinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX examinations_patient_examined_at_idx
  ON public.examinations (patient_user_id, examined_at DESC);
