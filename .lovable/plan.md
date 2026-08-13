# Sign-up Approval, Demo Workspace, and Admin Approvals

Gate access behind admin approval, capture professional context at sign-up, and cleanly separate demo data from real accounts.

## 1. Sign-up

Sign-up collects: first/last name, email, password, **Role** (physician, nurse, care coordinator, researcher, administrator, other), **Organization**, **Purpose of use**, and **"Would you like a demo?"**.

The selected role is a *requested/professional* role only. It never grants any permission in the app — choosing "administrator" gives no admin access.

After submit the user sees "Your request was sent for approval". No dashboard redirect.

If demo is requested, the same demo lead record the Request Demo dialog creates is filed automatically.

## 2. Access gate

- **Pending** — signed out with "Your account is awaiting admin approval."
- **Rejected** — signed out with "Your access request was declined."
- **Approved** — normal access.

## 3. Admin approvals

`/admin` keeps its existing data-science jobs and log, and gains a **Pending Approvals** section (admin-only, enforced server-side, not just hidden in the UI):

- Columns: name, email, requested role, organization, purpose, demo requested, submitted date, status
- Actions: **Approve**, **Reject**, and a **Demo access** toggle
- Approvals and rejections record which admin acted and when

## 4. Demo vs. real workspaces

One central workspace provider decides what data a signed-in user sees — pages do not each check a demo flag.

- **Demo accounts**: the existing synthetic/sample patients, dashboards and analytics, exactly as today
- **Real approved accounts**: only their own persisted data; where none exists, clean empty states with a clear next action

## 5. Admin account

`schoksi@predictdisease.com` is ensured to be approved and holds the real admin role in the existing roles table. Its password is not set, changed, or stored anywhere by this work — you manage it through the auth system.

## Technical notes

- New table `account_status`: `user_id`, `status` (pending/approved/rejected), `is_demo`, `requested_role`, `organization`, `purpose`, `demo_requested`, `approved_by`, `approved_at`, `rejected_by`, `rejected_at`, `created_at`, `updated_at`. Grants for `authenticated` and `service_role`; RLS lets a user read only their own row, blocks users from writing status/is_demo/approved_* /rejected_* (enforced by a trigger that rejects privileged-column changes from non-admins), and lets `has_role(auth.uid(), 'admin')` read and manage all rows.
- Authorization stays entirely on `user_roles` + `has_role()`. `requested_role` is descriptive text and is never read for permissions.
- Trigger on new user creation always writes `status = 'pending'` server-side and copies only descriptive metadata (`requested_role`, `organization`, `purpose`, `demo_requested`). Status, `is_demo`, approval/rejection fields and authorization roles from sign-up metadata are ignored entirely. Existing users backfilled as `approved`; `schoksi@predictdisease.com` backfilled as approved plus an `admin` row in `user_roles` if missing.
- New `demo_requests` table plus a shared `submitDemoRequest()` service routed through a secure backend path (edge function with validation) — no unrestricted anonymous insert on the table. `DemoRequestDialog` is rewired to call the same service (its form currently only shows a toast and persists nothing), and demo-flagged sign-ups reuse it — no duplicated logic, no component invocation.
- New `useWorkspace()` hook / provider exposes `{ status, isDemo, isAdmin }` and a single data-source seam; pages read from it instead of importing sample arrays directly. `clinicalService.ts` is not rewritten — the provider chooses between the demo source and real queries.
- `ProtectedRoute` stores the pending/rejected message before calling sign-out so it still renders after the session clears.
- No visual redesign or navigation changes beyond the sign-up fields, approval messaging, admin approvals section, and empty states.

## Data safety rules

- Demo/sample content stays entirely outside the real clinical tables. Nothing is ever seeded, copied or written into patient, examination, symptom, note, risk, cohort or recommendation records because an account is flagged demo.
- Toggling **Demo access** only switches which data source the workspace presents. It never copies, migrates, deletes or edits real patient data.
- An admin can toggle demo access on a pending or approved account, but the account still cannot enter the app until `status = 'approved'`.

