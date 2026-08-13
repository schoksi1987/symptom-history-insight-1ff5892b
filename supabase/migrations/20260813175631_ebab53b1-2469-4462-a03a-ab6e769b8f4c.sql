CREATE OR REPLACE FUNCTION public.handle_new_user_account_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- demo_requested and is_demo are independent: requesting a demo never grants
  -- demo access. is_demo is always false at signup and can only be enabled by
  -- an admin.
  INSERT INTO public.account_status (user_id, status, is_demo, demo_requested, requested_role, organization, purpose)
  VALUES (
    NEW.id,
    'pending',
    false,
    COALESCE((NEW.raw_user_meta_data ->> 'demo_requested')::boolean, false),
    NULLIF(NEW.raw_user_meta_data ->> 'requested_role', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'organization', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'purpose', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user_account_status() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.force_default_demo_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.is_demo := false;
    NEW.status := 'pending';
    NEW.approved_by := NULL;
    NEW.approved_at := NULL;
    NEW.rejected_by := NULL;
    NEW.rejected_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.force_default_demo_on_insert() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS force_default_demo_on_insert_trigger ON public.account_status;
CREATE TRIGGER force_default_demo_on_insert_trigger
BEFORE INSERT ON public.account_status
FOR EACH ROW EXECUTE FUNCTION public.force_default_demo_on_insert();

COMMENT ON COLUMN public.account_status.demo_requested IS 'What the applicant asked for at signup. Never grants access.';
COMMENT ON COLUMN public.account_status.is_demo IS 'Demo workspace access, granted only by an admin. Independent of demo_requested.';