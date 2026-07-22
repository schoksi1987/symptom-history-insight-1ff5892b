
-- 1. Restrict reference tables to authenticated users only
REVOKE ALL ON public.clinical_news FROM anon;
REVOKE ALL ON public.peer_findings FROM anon;
REVOKE ALL ON public.statistical_trends FROM anon;

DROP POLICY IF EXISTS "Anyone can view clinical news" ON public.clinical_news;
DROP POLICY IF EXISTS "Anyone can view peer findings" ON public.peer_findings;
DROP POLICY IF EXISTS "Anyone can view statistical trends" ON public.statistical_trends;

CREATE POLICY "Authenticated can view clinical news"
  ON public.clinical_news FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view peer findings"
  ON public.peer_findings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view statistical trends"
  ON public.statistical_trends FOR SELECT TO authenticated USING (true);

-- 2. Lock down cohort assignments: only service_role writes
REVOKE ALL ON public.patient_cohort_assignments FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.patient_cohort_assignments FROM authenticated;
GRANT SELECT ON public.patient_cohort_assignments TO authenticated;
GRANT ALL ON public.patient_cohort_assignments TO service_role;

-- 3. Revoke EXECUTE on SECURITY DEFINER helpers from API roles
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
