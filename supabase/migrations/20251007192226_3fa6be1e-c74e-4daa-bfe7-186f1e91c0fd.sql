-- Create table for clinical news and research
CREATE TABLE public.clinical_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  published_date DATE,
  category TEXT, -- 'diabetes_research', 'treatment', 'prevention', etc.
  relevance_score NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for peer findings
CREATE TABLE public.peer_findings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  physician_id UUID,
  finding_title TEXT NOT NULL,
  finding_description TEXT NOT NULL,
  patient_demographics JSONB, -- age range, conditions, etc.
  outcome_data JSONB, -- success rates, risk reduction, etc.
  clinical_context TEXT,
  publication_date DATE,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for statistical trends
CREATE TABLE public.statistical_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trend_name TEXT NOT NULL,
  trend_category TEXT, -- 'risk_factors', 'outcomes', 'demographics'
  data_points JSONB NOT NULL, -- statistical data
  time_period TEXT,
  population_size INTEGER,
  confidence_level NUMERIC,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for patient similarity analysis
CREATE TABLE public.patient_similarity_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id),
  similar_patient_profile JSONB, -- anonymized similar patient data
  similarity_score NUMERIC,
  matching_factors JSONB, -- which factors matched
  risk_insights JSONB, -- predicted risks based on similarity
  news_references UUID[], -- references to clinical_news
  peer_finding_references UUID[], -- references to peer_findings
  statistical_references UUID[], -- references to statistical_trends
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistical_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_similarity_analysis ENABLE ROW LEVEL SECURITY;

-- Public read access for news, findings, and trends (curated content)
CREATE POLICY "Anyone can view clinical news"
ON public.clinical_news FOR SELECT
USING (true);

CREATE POLICY "Anyone can view peer findings"
ON public.peer_findings FOR SELECT
USING (true);

CREATE POLICY "Anyone can view statistical trends"
ON public.statistical_trends FOR SELECT
USING (true);

-- Patients can only view their own similarity analysis
CREATE POLICY "Patients can view their own similarity analysis"
ON public.patient_similarity_analysis FOR SELECT
USING (auth.uid() = patient_id);

-- Create indexes for better query performance
CREATE INDEX idx_clinical_news_category ON public.clinical_news(category);
CREATE INDEX idx_clinical_news_published_date ON public.clinical_news(published_date);
CREATE INDEX idx_peer_findings_publication_date ON public.peer_findings(publication_date);
CREATE INDEX idx_statistical_trends_category ON public.statistical_trends(trend_category);
CREATE INDEX idx_patient_similarity_patient_id ON public.patient_similarity_analysis(patient_id);

-- Create triggers for updated_at
CREATE TRIGGER update_clinical_news_updated_at
BEFORE UPDATE ON public.clinical_news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peer_findings_updated_at
BEFORE UPDATE ON public.peer_findings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_statistical_trends_updated_at
BEFORE UPDATE ON public.statistical_trends
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();