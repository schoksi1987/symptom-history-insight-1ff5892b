# Establish the admin account

## Where things stand

- There is no admin user today. Three real accounts exist (`shailpoojachoksi@gmail.com`, `azradaei@gmail.com`, `shailchintan@gmail.com`), all approved, and none of them has any role assigned.
- `schoksi@predictdisease.com` has never signed up, so the existing database trigger that auto-approves that address and grants it the admin role has never fired.
- Passwords are stored only as hashes, so there is no existing admin password to look up. The admin credential is whatever password you set when you create the account.
- The `/admin` route is already wrapped in an admin-only guard that shows "This area is restricted to administrators." to anyone without the admin role, so the requested guard is in place and needs no rework.

## What will happen

1. You sign up at `/auth` using `schoksi@predictdisease.com` and a password of your choosing.
2. On email confirmation, the existing trigger sets that account to approved and inserts the `admin` role. Signing in then unlocks `/admin` (approvals queue, audit log, jobs console).

## Work to do

- **Make the grant resilient.** Today the admin grant only fires on the confirmation transition. Add a companion path so the role is also granted at insert time if that email signs up while email confirmation is disabled, and a one-time backfill so an already-created `schoksi@predictdisease.com` account is promoted immediately. This removes the "signed up but still not admin" failure mode.
- **Confirm the sign-up path accepts the address.** Verify the `/auth` sign-up form and its required professional-context fields (role, organization, purpose, demo) complete successfully for this account, and that the trigger keeps demo access off.
- **Verify end to end.** After you create the account, check that the role row exists, the status is approved, and `/admin` renders the approvals queue rather than the restricted notice.

## Technical notes

- New migration: extend `grant_owner_admin_on_verified_email()` coverage with an insert-time equivalent on `auth.users`, plus an idempotent backfill (`INSERT ... ON CONFLICT DO NOTHING`) into `public.user_roles` and an upsert of `public.account_status` to `approved` for the owner email.
- `is_demo` stays `false`: the `force_default_demo_on_insert` trigger is untouched, so demo access remains an explicit admin decision.
- No change to `ProtectedRoute` or `/admin`; the `requireAdmin` guard already resolves through `has_role`.
- Security memory: the owner email remains hardcoded in a security-definer trigger by design; no other account gains privileges from sign-up metadata.
