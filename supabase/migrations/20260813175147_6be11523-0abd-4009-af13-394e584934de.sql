CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  acting_admin uuid NOT NULL REFERENCES auth.users(id),
  target_user uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('approve','reject','demo_access')),
  previous_value text,
  new_value text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX admin_audit_log_created_at_idx ON public.admin_audit_log (created_at DESC);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read the audit log"
ON public.admin_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.log_account_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid;
BEGIN
  actor := COALESCE(auth.uid(), NEW.approved_by, NEW.rejected_by);
  IF actor IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'approved' THEN
      INSERT INTO public.admin_audit_log (acting_admin, target_user, action, previous_value, new_value)
      VALUES (actor, NEW.user_id, 'approve', OLD.status, NEW.status);
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.admin_audit_log (acting_admin, target_user, action, previous_value, new_value)
      VALUES (actor, NEW.user_id, 'reject', OLD.status, NEW.status);
    END IF;
  END IF;

  IF NEW.is_demo IS DISTINCT FROM OLD.is_demo THEN
    INSERT INTO public.admin_audit_log (acting_admin, target_user, action, previous_value, new_value)
    VALUES (actor, NEW.user_id, 'demo_access', OLD.is_demo::text, NEW.is_demo::text);
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_account_status_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS log_account_status_change_trigger ON public.account_status;
CREATE TRIGGER log_account_status_change_trigger
AFTER UPDATE ON public.account_status
FOR EACH ROW EXECUTE FUNCTION public.log_account_status_change();