UPDATE public.account_status AS account
SET is_demo = false,
    approved_by = COALESCE(account.approved_by, target.id),
    updated_at = now()
FROM auth.users AS target
WHERE account.user_id = target.id
  AND lower(target.email) = lower('shailpoojachoksi@gmail.com')
  AND account.is_demo = true;