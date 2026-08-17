import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stethoscope, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { DemoRequestDialog } from "@/components/DemoRequestDialog";

interface AppHeaderProps {
  /** Show the "Demo Request" button (landing page only). */
  showDemoRequest?: boolean;
}

export function AppHeader({ showDemoRequest = false }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useWorkspace();
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Stethoscope className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Predict Disease</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {showDemoRequest && (
            <Button variant="outline" onClick={() => setDemoDialogOpen(true)}>
              Demo Request
            </Button>
          )}

          {user ? (
            <>
              <nav className="hidden items-center gap-1 md:flex">
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/analytics">Analytics</Link>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" asChild>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
              </nav>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Account menu">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="md:hidden">
                    <Link to="/analytics">Analytics</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link to="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Sign in
              </Button>
              <Button onClick={() => navigate("/auth?mode=signup")}>Sign up</Button>
            </>
          )}
        </div>
      </div>

      {showDemoRequest && (
        <DemoRequestDialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen} />
      )}
    </header>
  );
}

export default AppHeader;
