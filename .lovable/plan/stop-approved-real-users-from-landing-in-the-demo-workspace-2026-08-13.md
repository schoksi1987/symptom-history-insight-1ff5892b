# Stop approved real users from landing in the demo workspace

## Confirmed cause

- `shailpoojachoksi@gmail.com` is approved and has the admin role, but its current account record has `is_demo=true`, so the centralized clinical data source intentionally selects sample data.
- The physician Dashboard also contains hardcoded patient names, visits, examination totals, news, findings, and trends. Those sections appear even when `is_demo=false`, so changing the account flag alone would not produce the required empty new-user dashboard.

## Changes

1. **Correct this admin account**
   - Set `is_demo=false` for `shailpoojachoksi@gmail.com` while retaining its approved status and admin role.
   - Let the existing database audit trigger record the demo-access change.

2. **Enforce workspace separation on the Dashboard**
   - Read the existing centralized workspace/data-source state in the Dashboard.
   - Show sample patient queues and sample dashboard content only when `is_demo=true`.
   - For approved real accounts, render a professional empty workspace with zero counts and no fictional patients, appointments, examination results, or clinical findings.
   - Keep navigation and administrator access available so the admin can manage approvals and begin adding real data.

3. **Remove unconditional demo indicators**
   - Make the demo-data notice conditional on the active workspace instead of displaying it for every user.
   - Ensure patient links are not generated from sample IDs in a real workspace.

4. **Verify both modes**
   - Sign in as the approved admin and confirm `/dashboard` is the real empty workspace and `/admin` remains accessible.
   - Verify an account explicitly granted demo access still receives the sample dashboard.
   - Confirm sign-out and sign-in preserve the correct workspace selection.

## Technical scope

- Reuse `WorkspaceContext` and `useClinicalDataSource`; do not create a second demo-mode flag.
- No synthetic/demo patient records will be inserted into real clinical tables.
- No changes to approval status, role authorization, or the independence of `demo_requested` and `is_demo`.