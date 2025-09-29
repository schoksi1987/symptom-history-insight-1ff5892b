-- Create profiles table for patient authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create patient_notes table
CREATE TABLE public.patient_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'symptom', 'medication', 'lifestyle', 'emergency')),
  source TEXT DEFAULT 'app' CHECK (source IN ('app', 'email', 'sms')),
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  email_subject TEXT,
  email_from TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patient_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for patient_notes
CREATE POLICY "Patients can view their own notes" 
ON public.patient_notes 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert their own notes" 
ON public.patient_notes 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own notes" 
ON public.patient_notes 
FOR UPDATE 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can delete their own notes" 
ON public.patient_notes 
FOR DELETE 
USING (auth.uid() = patient_id);

-- Create email_processors table to track patient email addresses
CREATE TABLE public.email_processors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  email_address TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_processors ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_processors
CREATE POLICY "Patients can view their own email processors" 
ON public.email_processors 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can manage their own email processors" 
ON public.email_processors 
FOR ALL 
USING (auth.uid() = patient_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_notes_updated_at
BEFORE UPDATE ON public.patient_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for note attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('patient-attachments', 'patient-attachments', false);

-- Create storage policies for patient attachments
CREATE POLICY "Patients can view their own attachments"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'patient-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Patients can upload their own attachments"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'patient-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Patients can update their own attachments"
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'patient-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Patients can delete their own attachments"
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'patient-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);