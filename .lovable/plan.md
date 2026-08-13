# Visible Sign in / Sign up, then republish

Two separate things are happening:

1. **The live site is an old build.** Frontend changes only reach the published site when the project is published again. The auth work (sign up, login, admin approval gating, approvals queue, audit log) exists in the code and preview, but the published version at your domain predates it.
2. **There is no visible auth entry point.** The landing header only shows "Demo Request" and "Dashboard". Sign in / sign up live at `/auth`, but nothing links there clearly, so the feature looks missing even on the current build.

## What to build

A shared app header that always shows where you stand:

- **Signed out:** brand mark on the left; "Demo Request", "Sign in", and "Sign up" on the right. Sign in and Sign up route to the auth page.
- **Signed in:** brand mark; Dashboard and Analytics links; an "Admin" link only for admin accounts; and a menu showing the signed-in email with "Sign out".
- Same header on the landing page and the internal pages, so entry and exit are always one click away.

## Then publish

Once the header is in, publish the project so the live domain picks up the auth flow and all the other changes made since the last deploy.

## Details

- New `src/components/AppHeader.tsx` built from existing shadcn components and design tokens (no hardcoded colors).
  - Session comes from the existing `useAuth` hook; admin status from the existing role check used by `ProtectedRoute`.
  - Sign out calls `signOut()` and returns to the landing page.
- Mount it in `src/pages/Index.tsx` (replacing the ad-hoc buttons) and at the top of the guarded pages.
- No database, auth-config, or business-logic changes. Presentation only, plus a publish.
