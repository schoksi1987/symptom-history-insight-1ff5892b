CREATE POLICY profiles_select_admin ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY user_roles_read_admin ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.protect_last_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'rejected' AND OLD.status IS DISTINCT FROM 'rejected'
     AND public.has_role(NEW.user_id, 'admin') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.account_status a ON a.user_id = ur.user_id
      WHERE ur.role = 'admin'
        AND a.status = 'approved'
        AND ur.user_id <> NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Cannot reject the last remaining administrator';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_last_admin_trigger ON public.account_status;
CREATE TRIGGER protect_last_admin_trigger
BEFORE UPDATE ON public.account_status
FOR EACH ROW EXECUTE FUNCTION public.protect_last_admin();