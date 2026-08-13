# Keep demo request and demo access independent

Requesting a demo is a signal from the applicant. Enabling demo access is a decision an admin makes. These stay two separate things, and approval never turns demo access on by itself.

## Current state (verified)

- Sign-up writes `demo_requested` from the form and always sets `is_demo` to false.
- Approving an account changes only status and approval fields; it does not touch `is_demo`.

So the rule already holds today. The work below makes it explicit in the interface, and locks it so it cannot drift later.

## What changes

### Approval becomes an explicit two-part decision

Clicking Approve opens a short confirmation dialog instead of approving immediately:

- Shows the applicant's name, organization, purpose, and whether they requested a demo.
- Presents a single Demo access choice, defaulted to off — even when the applicant requested a demo. If they requested one, the dialog notes that as context, not as a default.
- Buttons: Cancel, and Approve (which applies the status and the chosen demo setting).

When the admin approves with demo access on, that produces two audit entries as before: one approve, one demo access change.

### Clearer table wording

The approvals table separates the two columns visually: "Demo requested" (what the applicant asked for) and "Demo access" (what the admin granted), with a short caption stating that a demo request never grants access on its own.

### Database lock

A safeguard so no future code path can silently link the two:

- On sign-up, `is_demo` is forced to false regardless of any sign-up metadata.
- Demo access can only ever be changed by an admin, which the existing guard already enforces.

## Technical notes

- `supabase/functions` untouched; no new backend endpoints.
- Migration: replace `public.handle_new_user_account_status()` so the `is_demo` column is a hardcoded `false` and add a comment documenting the independence rule; add a `BEFORE INSERT` guard on `public.account_status` that resets `is_demo` to false when the inserting role is not an admin/service role. `demo_requested` continues to come from `raw_user_meta_data`.
- `src/components/admin/PendingApprovals.tsx`: add an `ApproveDialog` (shadcn `AlertDialog` + `Switch`) holding local `grantDemo` state defaulted to `false`. On confirm, issue the status update, then a separate `is_demo` update only when `grantDemo` differs from the row's current value, then reload and fire `onChange` once so the audit log refreshes.
- Reject path is unchanged (no dialog, no demo change).
- Table gains a caption line under the card description; column headers stay `Demo requested` and `Demo access`.
