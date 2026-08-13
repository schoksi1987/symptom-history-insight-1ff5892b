import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AuditRow {
  id: string;
  acting_admin: string;
  target_user: string;
  action: string;
  previous_value: string | null;
  new_value: string | null;
  created_at: string;
}

interface ProfileLite {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface AdminAuditLogHandle {
  reload: () => Promise<void>;
}

const ACTION_LABEL: Record<string, string> = {
  approve: "Approved",
  reject: "Rejected",
  demo_access: "Demo access",
};

const actionVariant = (action: string) =>
  action === "approve" ? "default" : action === "reject" ? "destructive" : "secondary";

const formatValue = (action: string, value: string | null) => {
  if (value === null || value === "") return "—";
  if (action === "demo_access") return value === "true" ? "on" : "off";
  return value;
};

export const AdminAuditLog = forwardRef<AdminAuditLogHandle>((_props, ref) => {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_audit_log")
      .select("id, acting_admin, target_user, action, previous_value, new_value, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      toast({ title: "Could not load audit log", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const entries = data ?? [];
    const ids = Array.from(new Set(entries.flatMap((r) => [r.acting_admin, r.target_user])));
    const { data: profileRows } = ids.length
      ? await supabase.from("profiles").select("user_id, first_name, last_name, email").in("user_id", ids)
      : { data: [] as ProfileLite[] };

    setRows(entries);
    setProfiles(profileRows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useImperativeHandle(ref, () => ({ reload: load }), [load]);

  const describe = useCallback(
    (userId: string) => {
      const p = profiles.find((row) => row.user_id === userId);
      const name = [p?.first_name, p?.last_name].filter(Boolean).join(" ");
      return { name: name || p?.email || "Unknown user", email: name ? p?.email ?? null : null };
    },
    [profiles],
  );

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.action === filter)),
    [rows, filter],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Admin activity log</CardTitle>
          <CardDescription>
            Every approval, rejection, and demo access change is recorded by the system. Entries
            cannot be edited or removed.
          </CardDescription>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]" aria-label="Filter by action">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            <SelectItem value="approve">Approved</SelectItem>
            <SelectItem value="reject">Rejected</SelectItem>
            <SelectItem value="demo_access">Demo access</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading activity…</p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">No admin activity recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Affected user</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((r) => {
                const admin = describe(r.acting_admin);
                const target = describe(r.target_user);
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{admin.name}</div>
                      {admin.email && <div className="text-xs text-muted-foreground">{admin.email}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{target.name}</div>
                      {target.email && <div className="text-xs text-muted-foreground">{target.email}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={actionVariant(r.action)}>
                        {ACTION_LABEL[r.action] ?? r.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatValue(r.action, r.previous_value)} → {formatValue(r.action, r.new_value)}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
});

AdminAuditLog.displayName = "AdminAuditLog";
