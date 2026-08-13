# Make sign in / sign up / sign out visible

Nothing was lost: the auth page, admin approval gating, approvals queue, and audit log are all still in place. The sign-in screen simply isn't visible while you're signed in, and there is no persistent header with auth controls anywhere in the app.

## What to build

A single shared app header used across the site that always shows where you stand:

- **Signed out:** "Sign in" and "Sign up" buttons that go to the auth page.
- **Signed in:** your email, an "Admin" link (only for admin accounts), and a "Sign out" button.
- Header appears on the landing page and on the internal pages (dashboard, analytics, admin, patient views), so the entry and exit points are always one click away.

## Details

- New `src/components/AppHeader.tsx`:
  - Reads session from the existing `useAuth` hook and admin status from the existing role check used by `ProtectedRoute`.
  - Signed-out state: brand mark on the left, "Sign in" (ghost) and "Sign up" (primary) on the right, both routing to `/auth`.
  - Signed-in state: brand mark, links to Dashboard / Analytics (and Admin when the account has the admin role), then a dropdown with the account email and "Sign out" calling `signOut()` then navigating to `/`.
  - Styling uses existing design tokens and shadcn components only — no hardcoded colors.
- Mount `AppHeader` in `src/pages/Index.tsx` (replacing the ad-hoc auth button) and at the top of the guarded pages so it's consistent.
- No database, auth-config, or business-logic changes. Presentation only.
