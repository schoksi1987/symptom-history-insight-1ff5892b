import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AccountRow {
  id: string;
  user_id: string;
  status: string;
  is_demo: boolean;
  demo_requested: boolean;
  requested_role: string | null;
  organization: string | null;
  purpose: string | null;
  created_at: string;
  profile?: { first_name: string | null; last_name: string | null; email: string | null } | null;
}

const statusVariant = (status: string) =>
  status === "approved" ? "default" : status === "rejected" ? "destructive" : "secondary";

// Synthetic cohort patients are generated for the analytics models. They are not
// real applicants and must never appear in the approvals queue.
const isSynthetic = (row: AccountRow) => (row.profile?.email ?? "").endsWith("@synthetic.local");

export function PendingApprovals({ onChange }: { onChange?: () => void } = {}) {
  const { user } = useAuth();
  const [rows, setRows] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [emailConfirmed, setEmailConfirmed] = useState<Record<string, boolean>>({});

  const [approving, setApproving] = useState<AccountRow[] | null>(null);
  const [rejecting, setRejecting] = useState<AccountRow[] | null>(null);
  const [grantDemo, setGrantDemo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("account_status")
      .select("id, user_id, status, is_demo, demo_requested, requested_role, organization, purpose, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Could not load accounts", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const ids = (data ?? []).map((r) => r.user_id);
    const [{ data: profiles }, { data: adminRoles }] = await Promise.all([
      ids.length
        ? supabase.from("profiles").select("user_id, first_name, last_name, email").in("user_id", ids)
        : Promise.resolve({ data: [] as any[] }),
      ids.length
        ? supabase.from("user_roles").select("user_id").eq("role", "admin").in("user_id", ids)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const mapped = (data ?? []).map((r) => ({
      ...r,
      profile: profiles?.find((p) => p.user_id === r.user_id) ?? null,
    }));

    setAdminIds(new Set((adminRoles ?? []).map((r: any) => r.user_id)));
    const visible = mapped.filter((r) => !isSynthetic(r));
    setRows(visible);
    setSelected(new Set());
    setLoading(false);

    if (visible.length) {
      const { data: statusData } = await supabase.functions.invoke("admin-verify-email", {
        body: { action: "status", userIds: visible.map((r) => r.user_id) },
      });
      if (statusData?.confirmed) setEmailConfirmed(statusData.confirmed);
    }
  }, []);


  useEffect(() => {
    void load();
  }, [load]);

  const pending = useMemo(() => rows.filter((r) => r.status === "pending"), [rows]);
  const others = useMemo(() => rows.filter((r) => r.status !== "pending"), [rows]);

  const selectedRows = useMemo(() => pending.filter((r) => selected.has(r.id)), [pending, selected]);
  const allPendingSelected = pending.length > 0 && selectedRows.length === pending.length;

  const toggleRow = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(pending.map((r) => r.id)) : new Set());
  };

  const openApprove = (list: AccountRow[]) => {
    // Demo access always starts off: a demo request never grants access on its own.
    setGrantDemo(false);
    setApproving(list);
  };

  const confirmApprove = async () => {
    const list = approving;
    if (!list?.length) return;
    setApproving(null);
    const ids = list.map((r) => r.id);
    if (ids.length === 1) setBusy(ids[0]);
    else setBulkBusy(true);

    const { error } = await supabase
      .from("account_status")
      .update({ status: "approved", approved_by: user?.id ?? null, approved_at: new Date().toISOString() })
      .in("id", ids);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      setBusy(null);
      setBulkBusy(false);
      return;
    }

    const demoChanges = list.filter((r) => r.is_demo !== grantDemo).map((r) => r.id);
    if (demoChanges.length) {
      const { error: demoError } = await supabase
        .from("account_status")
        .update({ is_demo: grantDemo })
        .in("id", demoChanges);
      if (demoError) {
        toast({ title: "Demo access not changed", description: demoError.message, variant: "destructive" });
      }
    }

    toast({ title: ids.length > 1 ? `${ids.length} accounts approved` : "Account approved" });
    await load();
    onChange?.();
    setBusy(null);
    setBulkBusy(false);
  };

  const confirmReject = async () => {
    const list = rejecting;
    if (!list?.length) return;
    setRejecting(null);
    const ids = list.map((r) => r.id);
    if (ids.length === 1) setBusy(ids[0]);
    else setBulkBusy(true);

    const { error } = await supabase
      .from("account_status")
      .update({ status: "rejected", rejected_by: user?.id ?? null, rejected_at: new Date().toISOString() })
      .in("id", ids);

    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: ids.length > 1 ? `${ids.length} accounts rejected` : "Account rejected" });
      await load();
      onChange?.();
    }
    setBusy(null);
    setBulkBusy(false);
  };

  const toggleDemo = async (row: AccountRow, value: boolean) => {
    setBusy(row.id);
    const { error } = await supabase.from("account_status").update({ is_demo: value }).eq("id", row.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else {
      await load();
      onChange?.();
    }
    setBusy(null);
  };

  // Manual email verification for applicants who never click the confirmation link.
  const verifyEmail = async (row: AccountRow) => {
    setBusy(row.id);
    const { data, error } = await supabase.functions.invoke("admin-verify-email", {
      body: { action: "confirm", userId: row.user_id },
    });
    if (error || data?.error) {
      toast({
        title: "Could not verify email",
        description: error?.message ?? data?.error,
        variant: "destructive",
      });
    } else {
      setEmailConfirmed((prev) => ({ ...prev, [row.user_id]: true }));
      toast({ title: "Email verified", description: row.profile?.email ?? undefined });
      onChange?.();
    }
    setBusy(null);
  };



  const renderRows = (list: AccountRow[], selectable: boolean) =>
    list.map((r) => (
      <TableRow key={r.id}>
        <TableCell className="w-10">
          {selectable ? (
            <Checkbox
              checked={selected.has(r.id)}
              onCheckedChange={(v) => toggleRow(r.id, v === true)}
              aria-label="Select account"
            />
          ) : null}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2 font-medium">
            <span>
              {[r.profile?.first_name, r.profile?.last_name].filter(Boolean).join(" ") ||
                r.profile?.email ||
                "Unnamed account"}
            </span>
            {adminIds.has(r.user_id) && <Badge variant="outline">Admin</Badge>}
          </div>
          <div className="text-xs text-muted-foreground">{r.profile?.email ?? "No email on file"}</div>
        </TableCell>

        <TableCell className="text-sm">{r.requested_role ?? "—"}</TableCell>
        <TableCell className="text-sm">{r.organization ?? "—"}</TableCell>
        <TableCell className="max-w-[240px] text-sm">{r.purpose ?? "—"}</TableCell>
        <TableCell className="text-sm">{r.demo_requested ? "Yes" : "No"}</TableCell>
        <TableCell className="text-sm">{new Date(r.created_at).toLocaleDateString()}</TableCell>
        <TableCell><Badge variant={statusVariant(r.status)}>{r.status}</Badge></TableCell>
        <TableCell>
          <Switch
            checked={r.is_demo}
            disabled={busy === r.id || bulkBusy}
            onCheckedChange={(v) => toggleDemo(r, v)}
            aria-label="Demo access"
          />
        </TableCell>
        <TableCell className="space-x-2 whitespace-nowrap">
          <Button
            size="sm"
            disabled={busy === r.id || bulkBusy || r.status === "approved"}
            onClick={() => openApprove([r])}
          >
            Approve
          </Button>
          <span
            title={
              adminIds.has(r.user_id)
                ? "Administrators cannot be rejected — the system must always keep an admin."
                : undefined
            }
            className="inline-block"
          >
            <Button
              size="sm"
              variant="outline"
              disabled={busy === r.id || bulkBusy || r.status === "rejected" || adminIds.has(r.user_id)}
              onClick={() => setRejecting([r])}
            >
              Reject
            </Button>
          </span>

        </TableCell>
      </TableRow>
    ));

  const dialogList = approving ?? rejecting ?? [];
  const bulkMode = dialogList.length > 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>
          Approve or reject access requests. Synthetic cohort patients used by the analytics models are
          excluded from this list. "Demo requested" is what the applicant asked for — it never grants
          access on its own. "Demo access" is granted only by an admin, and only changes which workspace
          data an account sees; it never touches real patient records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-x-auto">
        {pending.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3">
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} of {pending.length} pending selected
            </span>
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                disabled={selectedRows.length === 0 || bulkBusy}
                onClick={() => openApprove(selectedRows)}
              >
                Approve selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={selectedRows.filter((r) => !adminIds.has(r.user_id)).length === 0 || bulkBusy}
                onClick={() => setRejecting(selectedRows.filter((r) => !adminIds.has(r.user_id)))}
              >
                Reject selected
              </Button>

            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading accounts…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No accounts found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allPendingSelected}
                    disabled={pending.length === 0}
                    onCheckedChange={(v) => toggleAll(v === true)}
                    aria-label="Select all pending"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Requested role</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Demo requested</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Demo access</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRows(pending, true)}
              {renderRows(others, false)}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AlertDialog open={approving !== null} onOpenChange={(open) => !open && setApproving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkMode ? `Approve ${dialogList.length} accounts?` : "Approve this account?"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-1 text-sm">
                {bulkMode ? (
                  <div>
                    {dialogList
                      .map(
                        (r) =>
                          [r.profile?.first_name, r.profile?.last_name].filter(Boolean).join(" ") ||
                          r.profile?.email ||
                          "Unnamed account",
                      )
                      .join(", ")}
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-medium text-foreground">
                        {[dialogList[0]?.profile?.first_name, dialogList[0]?.profile?.last_name]
                          .filter(Boolean)
                          .join(" ") || dialogList[0]?.profile?.email || "Unknown user"}
                      </span>
                    </div>
                    <div>Organization: {dialogList[0]?.organization ?? "—"}</div>
                    <div>Purpose: {dialogList[0]?.purpose ?? "—"}</div>
                    <div>Demo requested: {dialogList[0]?.demo_requested ? "Yes" : "No"}</div>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
            <div>
              <Label htmlFor="grant-demo" className="text-sm font-medium">
                Grant demo access
              </Label>
              <p className="text-xs text-muted-foreground">
                {bulkMode
                  ? "Applies to every selected account. Defaults to off."
                  : dialogList[0]?.demo_requested
                    ? "This applicant requested a demo. Approving does not grant it — decide explicitly."
                    : "Demo access is a separate decision from approval."}
              </p>
            </div>
            <Switch
              id="grant-demo"
              checked={grantDemo}
              onCheckedChange={setGrantDemo}
              aria-label="Grant demo access"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove}>Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejecting !== null} onOpenChange={(open) => !open && setRejecting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogList.length > 1 ? `Reject ${dialogList.length} accounts?` : "Reject this account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Rejected accounts cannot sign in. Each change is written to the admin activity log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject}>Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
