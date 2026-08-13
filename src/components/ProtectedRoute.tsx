import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ACCESS_MESSAGES: Record<string, string> = {
  pending: "Your account is awaiting admin approval.",
  rejected: "Your access request was declined.",
};

function AccessNotice({ message }: { message: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Access status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          <Button onClick={() => navigate("/")}>Back to home</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, signOut } = useAuth();
  const { loading: workspaceLoading, status, isAdmin } = useWorkspace();
  const navigate = useNavigate();
  // Held in component state so the message survives clearing the session.
  const [accessMessage, setAccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user && !accessMessage) {
      navigate("/auth");
    }
  }, [user, loading, navigate, accessMessage]);

  useEffect(() => {
    if (loading || workspaceLoading || !user || !status) return;
    if (status === "pending" || status === "rejected") {
      setAccessMessage(ACCESS_MESSAGES[status]);
      void signOut();
    }
  }, [status, loading, workspaceLoading, user, signOut]);

  if (accessMessage) return <AccessNotice message={accessMessage} />;

  if (loading || workspaceLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (requireAdmin && !isAdmin) {
    return <AccessNotice message="This area is restricted to administrators." />;
  }

  return <>{children}</>;
}
