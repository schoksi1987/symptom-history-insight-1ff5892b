import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

export function PendingApprovals({ onChange }: { onChange?: () => void } = {}) {
  const { user } = useAuth();
  const [rows, setRows] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [approving, setApproving] = useState<AccountRow | null>(null);
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
    const { data: profiles } = ids.length
      ? await supabase.from("profiles").select("user_id, first_name, last_name, email").in("user_id", ids)
      : { data: [] as any[] };

    setRows(
      (data ?? []).map((r) => ({
        ...r,
        profile: profiles?.find((p) => p.user_id === r.user_id) ?? null,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openApprove = (row: AccountRow) => {
    // Demo access always starts off: a demo request never grants access on its own.
    setGrantDemo(false);
    setApproving(row);
  };

  const confirmApprove = async () => {
    const row = approving;
    if (!row) return;
    setApproving(null);
    setBusy(row.id);

    const { error } = await supabase
      .from("account_status")
      .update({ status: "approved", approved_by: user?.id ?? null, approved_at: new Date().toISOString() })
      .eq("id", row.id);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      setBusy(null);
      return;
    }

    if (grantDemo !== row.is_demo) {
      const { error: demoError } = await supabase
        .from("account_status")
        .update({ is_demo: grantDemo })
        .eq("id", row.id);
      if (demoError) {
        toast({ title: "Demo access not changed", description: demoError.message, variant: "destructive" });
      }
    }

    await load();
    onChange?.();
    setBusy(null);
  };

  const reject = async (row: AccountRow) => {
    setBusy(row.id);
    const { error } = await supabase
      .from("account_status")
      .update({ status: "rejected", rejected_by: user?.id ?? null, rejected_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else {
      await load();
      onChange?.();
    }
    setBusy(null);
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

  const pending = rows.filter((r) => r.status === "pending");
  const others = rows.filter((r) => r.status !== "pending");

  const renderRows = (list: AccountRow[]) =>
    list.map((r) => (
      <TableRow key={r.id}>
        <TableCell>
          <div className="font-medium">
            {[r.profile?.first_name, r.profile?.last_name].filter(Boolean).join(" ") || "—"}
          </div>
          <div className="text-xs text-muted-foreground">{r.profile?.email ?? "—"}</div>
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
            disabled={busy === r.id}
            onCheckedChange={(v) => toggleDemo(r, v)}
            aria-label="Demo access"
          />
        </TableCell>
        <TableCell className="space-x-2 whitespace-nowrap">
          <Button size="sm" disabled={busy === r.id || r.status === "approved"} onClick={() => openApprove(r)}>
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy === r.id || r.status === "rejected"}
            onClick={() => reject(r)}
          >
            Reject
          </Button>
        </TableCell>
      </TableRow>
    ));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>
          Approve or reject access requests. "Demo requested" is what the applicant asked for — it
          never grants access on its own. "Demo access" is granted only by an admin, and only
          changes which workspace data an account sees; it never touches real patient records.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading accounts…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No accounts found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
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
              {renderRows(pending)}
              {renderRows(others)}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AlertDialog open={approving !== null} onOpenChange={(open) => !open && setApproving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this account?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium text-foreground">
                    {[approving?.profile?.first_name, approving?.profile?.last_name]
                      .filter(Boolean)
                      .join(" ") || approving?.profile?.email || "Unknown user"}
                  </span>
                </div>
                <div>Organization: {approving?.organization ?? "—"}</div>
                <div>Purpose: {approving?.purpose ?? "—"}</div>
                <div>Demo requested: {approving?.demo_requested ? "Yes" : "No"}</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
            <div>
              <Label htmlFor="grant-demo" className="text-sm font-medium">
                Grant demo access
              </Label>
              <p className="text-xs text-muted-foreground">
                {approving?.demo_requested
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
    </Card>
  );
}
