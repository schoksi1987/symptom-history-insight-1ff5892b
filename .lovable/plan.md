# Sign-up Approval, Demo Mode, and Admin Reset

Gate access behind admin approval, separate demo data from real accounts, and reset the admin login.

## 1. Approval workflow

- New accounts start in a **pending** state and cannot use the app.
- Sign-up form still collects name, email, password. After submit the user sees "Your request was sent for approval" instead of being routed to the dashboard.
- Login: if the account is not approved, the session is immediately signed out and the user sees "Your account is awaiting admin approval."
- Rejected accounts see "Your access request was declined."

## 2. Admin approval queue

- New **Pending Approvals** section on `/admin`, visible only to admin accounts.
- Lists each request: name, email, requested date, status.
- Actions per row: **Approve**, **Reject**. Approving records who approved and when.
- Existing accounts already in the system are marked approved so nothing breaks.

## 3. Demo vs. real accounts

- A per-account **demo flag**. Accounts with the flag see the current sample patients, dashboards, analytics and copilot content exactly as today.
- Accounts without the flag get an **empty workspace**: dashboard, patient queue, analytics and insights show clean "No patients yet / No data yet" empty states with a clear next action, no sample patients or sample metrics.
- You can toggle the demo flag for any account from the admin queue list, so you can create a fresh demo login whenever you present.

## 4. Admin credentials

- `schoksi@predictdisease.com` is set as the admin account, approved, and given the admin role.
- Password will be set to the one you send me in chat. **Reply with the password you want** and I will apply it during the build (change it after your first sign-in).

## Technical notes

- New table `account_status` (user_id, status: pending/approved/rejected, is_demo, approved_by, approved_at) with grants and RLS: a user reads only their own row; admins read and update all rows via the existing `has_role(auth.uid(), 'admin')` function. No client-side writes to `status` by non-admins.
- Trigger on new user insert creates a `pending` row; backfill existing users as `approved`.
- `useAuth` gains `status` and `isDemo`; `ProtectedRoute` blocks non-approved sessions and signs them out.
- Page data sources (`clinicalService.ts` and dashboard mock arrays) become conditional on `isDemo`, returning empty collections otherwise — page structure and components are unchanged.
- Admin password is applied via the auth admin API in an edge function invoked once, then removed; no credentials stored in the repo.
- No email sending in this phase (approval queue only), so no sender-domain work is required.
