-- account_status
CREATE TABLE public.account_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  is_demo boolean NOT NULL DEFAULT false,
  demo_requested boolean NOT NULL DEFAULT false,
  requested_role text,
  organization text,
  purpose text,
  approved_by uuid,
  approved_at timestamptz,
  rejected_by uuid,
  rejected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.account_status TO authenticated;
GRANT ALL ON public.account_status TO service_role;

ALTER TABLE public.account_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "account_status_select_own_or_admin"
ON public.account_status FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "account_status_update_own_or_admin"
ON public.account_status FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "account_status_insert_admin"
ON public.account_status FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "account_status_delete_admin"
ON public.account_status FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Guard privileged columns from non-admin updates
CREATE OR REPLACE FUNCTION public.guard_account_status_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF NEW.status IS DISTINCT FROM OLD.status
       OR NEW.is_demo IS DISTINCT FROM OLD.is_demo
       OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
       OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
       OR NEW.rejected_by IS DISTINCT FROM OLD.rejected_by
       OR NEW.rejected_at IS DISTINCT FROM OLD.rejected_at
       OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Not authorized to modify account approval fields';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.guard_account_status_privileged_columns() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER guard_account_status_privileged_columns
BEFORE UPDATE ON public.account_status
FOR EACH ROW EXECUTE FUNCTION public.guard_account_status_privileged_columns();

CREATE TRIGGER update_account_status_updated_at
BEFORE UPDATE ON public.account_status
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create pending account_status on new user signup (descriptive metadata only)
CREATE OR REPLACE FUNCTION public.handle_new_user_account_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

CREATE TRIGGER on_auth_user_created_account_status
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_account_status();

-- Backfill existing users as approved
INSERT INTO public.account_status (user_id, status, approved_at)
SELECT u.id, 'approved', now() FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;

-- Ensure admin account
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE lower(u.email) = 'schoksi@predictdisease.com'
ON CONFLICT (user_id, role) DO NOTHING;

UPDATE public.account_status a
SET status = 'approved', approved_at = COALESCE(a.approved_at, now())
FROM auth.users u
WHERE u.id = a.user_id AND lower(u.email) = 'schoksi@predictdisease.com';

-- demo_requests
CREATE TABLE public.demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization text,
  requested_role text,
  phone text,
  message text,
  source text NOT NULL DEFAULT 'website',
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.demo_requests TO authenticated;
GRANT ALL ON public.demo_requests TO service_role;

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_requests_admin_read"
ON public.demo_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_demo_requests_updated_at
BEFORE UPDATE ON public.demo_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();