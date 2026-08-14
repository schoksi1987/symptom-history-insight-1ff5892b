# Sign-up confirmation, admin visibility of applicant details, and admin protection

Three fixes: a dead-end sign-up screen, applicants showing as "Unnamed account", and the risk of rejecting the last admin.

## 1. Sign-up confirmation is a dead end

After a successful sign-up the form stays on screen with only an inline alert.

Replace the sign-up tab content, once submitted, with a confirmation panel:
- Heading "Request submitted" and the approval message
- "Back to home" button (routes to `/`)
- "Go to sign in" button (switches to the Sign In tab)

The form fields are cleared and hidden so the request cannot be resubmitted by accident.

## 2. Applicant name/email missing in Pending Approvals

Confirmed cause: the applicant's name and email are stored correctly (e.g. the current pending request has first name, last name and email on file), but the profile table only lets a user read their own row. Admins therefore get nothing back and the queue falls back to "Unnamed account".

Fix: allow admins to read profile rows. Nothing else about profile access changes — regular users still only see their own row, and no one gains write access to another person's profile.

Organization and purpose show as "—" only when the applicant left those optional fields blank; no change needed there.

## 3. The system must always keep an admin

- Admins cannot be rejected. The database refuses any rejection that would leave the system without an approved admin, so this holds no matter where the change comes from — not just in the admin screen.
- In Pending Approvals, rows belonging to an admin are labelled with an "Admin" badge and their Reject button is disabled with an explanatory tooltip. Bulk reject skips admin rows.
- To make that visible, admins are allowed to read the roles table (users keep reading only their own roles).

## Technical notes

- Migration:
  - `CREATE POLICY profiles_select_admin ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'))`.
  - `CREATE POLICY user_roles_read_admin ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'))`.
  - `BEFORE UPDATE` trigger `protect_last_admin()` (SECURITY DEFINER, `search_path = public`) on `account_status`: if `NEW.status = 'rejected'` and the target user has the `admin` role, raise an exception when no other approved admin would remain.
- `PendingApprovals.tsx`: load `user_roles` for the listed users, mark admin rows, disable/skip Reject for them, keep the existing audit-log behaviour untouched.
- `Auth.tsx`: `signupSubmitted` renders a confirmation panel instead of the form; buttons use `navigate("/")` and `setAuthMode("login")`.
- No schema changes to `account_status` columns and no changes to demo/approval logic.
