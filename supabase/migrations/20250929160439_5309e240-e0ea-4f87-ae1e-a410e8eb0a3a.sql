-- Add analysis fields to patient_notes table
ALTER TABLE public.patient_notes 
ADD COLUMN ai_summary TEXT,
ADD COLUMN identified_symptoms JSONB DEFAULT '[]',
ADD COLUMN diabetes_insights JSONB DEFAULT '{}',
ADD COLUMN confidence_score DECIMAL(3,2),
ADD COLUMN analysis_status TEXT DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed'));

-- Create symptoms table for tracking
CREATE TABLE public.patient_symptoms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  symptom_name TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  frequency TEXT CHECK (frequency IN ('rare', 'occasional', 'frequent', 'constant')),
  first_reported DATE DEFAULT CURRENT_DATE,
  last_reported DATE DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'note' CHECK (source IN ('note', 'manual', 'ai_detected')),
  note_id UUID REFERENCES public.patient_notes(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on symptoms table
ALTER TABLE public.patient_symptoms ENABLE ROW LEVEL SECURITY;

-- RLS policies for patient_symptoms
CREATE POLICY "Patients can view their own symptoms" 
ON public.patient_symptoms 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert their own symptoms" 
ON public.patient_symptoms 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own symptoms" 
ON public.patient_symptoms 
FOR UPDATE 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete their own symptoms" 
ON public.patient_symptoms 
FOR DELETE 
USING (auth.uid() = patient_id);

-- Add trigger for symptoms table
CREATE TRIGGER update_patient_symptoms_updated_at
BEFORE UPDATE ON public.patient_symptoms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();