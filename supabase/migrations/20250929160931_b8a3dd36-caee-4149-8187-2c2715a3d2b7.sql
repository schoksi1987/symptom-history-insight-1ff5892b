-- Ensure unique constraint for upsert
CREATE UNIQUE INDEX IF NOT EXISTS uniq_patient_symptom_note
ON public.patient_symptoms (patient_id, symptom_name, note_id);