# Admin access and account cleanup

## Where things stand

- No account currently holds the `admin` role. Three real accounts exist: `shailpoojachoksi@gmail.com`, `azradaei@gmail.com`, `shailchintan@gmail.com` — all approved, none with a role row.
- `schoksi@predictdisease.com` has never signed up, so the owner-admin triggers (which fire on both insert and email confirmation for that address) have never run.
- Passwords are stored only as hashes, so there is no admin password to retrieve. The admin credential is whatever password is set when the account is created.
- The `/admin` route is already guarded: users without the admin role see "This area is restricted to administrators." No rework needed there.

## What will change

1. **Grant admin to `shailpoojachoksi@gmail.com`.** Add the `admin` role row for that account and keep its status approved. It can then reach `/admin` — approvals queue, audit log, jobs console — with its existing password.
2. **Remove `azradaei@gmail.com`.** Delete the account entirely. Its dependent rows (profile, account status, any clinical records keyed to it) cascade away with it, so nothing is left orphaned.
3. **Owner account stays available.** `schoksi@predictdisease.com` can still sign up at any time and will be auto-approved and granted admin by the existing triggers.

## Notes

- Deleting `azradaei@gmail.com` is permanent — the account cannot sign in again and would have to re-register and be re-approved.
- Before deleting, the records tied to that account are checked so you know exactly what disappears with it.

## Technical notes

- Role grant: insert into `public.user_roles (user_id, 'admin')` for the matching `auth.users` row, `ON CONFLICT DO NOTHING`; ensure `public.account_status.status = 'approved'` for it.
- Deletion: remove the `auth.users` row for `azradaei@gmail.com`; foreign keys to `auth.users` are `ON DELETE CASCADE`, so `profiles`, `account_status`, `examinations`, and audit references clear with it.
- Both operations are data changes, not schema changes — no table or policy is altered, and no trigger or RLS rule is weakened.
