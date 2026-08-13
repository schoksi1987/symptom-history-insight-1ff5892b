# Admin action audit trail

Every Approve, Reject, and Demo-access change is recorded automatically, with who did it, who it affected, what changed, and when.

## What gets recorded

One audit entry per change, containing:

- acting_admin — the signed-in admin who made the change
- target_user — the account the change applied to
- action — `approve`, `reject`, or `demo_access`
- previous_value / new_value — the status before and after, or demo on/off
- timestamp — when it happened

## How it works

The audit entry is written by the database itself whenever an account record changes, not by the browser. That means an entry cannot be skipped, forged, or edited from the app — even if someone changed the admin screen. Entries are append-only: no one, including admins, can modify or delete them.

## Admin visibility

The admin page gets an "Admin activity log" section under Pending Approvals: a reverse-chronological table of admin, affected user, action, before → after, and time, with a filter by action type. Only admins can read it.

## Technical notes

New table `public.admin_audit_log`:

- `id uuid pk default gen_random_uuid()`
- `acting_admin uuid not null references auth.users(id)`
- `target_user uuid not null references auth.users(id) on delete cascade`
- `action text not null check (action in ('approve','reject','demo_access'))`
- `previous_value text`, `new_value text`
- `created_at timestamptz not null default now()`

Grants and RLS:

- `GRANT SELECT ON public.admin_audit_log TO authenticated;` (read gated by policy), `GRANT ALL ... TO service_role;`
- RLS enabled; single SELECT policy `has_role(auth.uid(), 'admin')`. No INSERT/UPDATE/DELETE policies — rows are written only by the SECURITY DEFINER trigger, so the log stays append-only from the app's perspective.

Trigger `log_account_status_change()` (SECURITY DEFINER, `set search_path = public`), AFTER UPDATE ON `public.account_status` FOR EACH ROW:

- status changed `pending|rejected -> approved` → action `approve`
- status changed `-> rejected` → action `reject`
- `is_demo` changed → action `demo_access` with `'false'`/`'true'` values
- a single update that changes both status and `is_demo` writes two entries
- `acting_admin` = `auth.uid()`; when null (service-role/system change) fall back to `COALESCE(NEW.approved_by, NEW.rejected_by)` and skip the entry only if no actor can be determined
- `EXECUTE` revoked from PUBLIC/anon/authenticated

Frontend:

- New `src/components/admin/AdminAuditLog.tsx` — queries `admin_audit_log` joined against `profiles` for readable names/emails, action filter, paginated to the most recent 100 entries.
- `src/pages/Admin.tsx` renders it below `PendingApprovals`.
- `src/components/admin/PendingApprovals.tsx` refreshes the audit log after each Approve/Reject/Demo change (shared reload callback); no client-side audit writes are added.
