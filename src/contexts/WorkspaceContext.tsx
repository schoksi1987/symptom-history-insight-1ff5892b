import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AccountStatus = "pending" | "approved" | "rejected";

interface WorkspaceContextType {
  loading: boolean;
  status: AccountStatus | null;
  isDemo: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<AccountStatus | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const load = async () => {
    if (!user) {
      setStatus(null);
      setIsDemo(false);
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: account }, { data: roles }] = await Promise.all([
      supabase
        .from("account_status")
        .select("status, is_demo")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", user.id),
    ]);

    setStatus((account?.status as AccountStatus) ?? "pending");
    setIsDemo(Boolean(account?.is_demo));
    setIsAdmin(Boolean(roles?.some((r) => r.role === "admin")));
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  return (
    <WorkspaceContext.Provider
      value={{ loading: authLoading || loading, status, isDemo, isAdmin, refresh: load }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
