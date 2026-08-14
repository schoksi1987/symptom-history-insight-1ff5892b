import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Brain, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDemoRequest } from "@/components/public/DemoRequestContext";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/contexts/WorkspaceContext";

const NAV = [
  { label: "Platform", to: "/platform" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Clinical Approach", to: "/clinical-approach" },
];

const RESOURCES = [
  { label: "Clinical Evidence", to: "/clinical-evidence" },
  { label: "Implementation Guide", to: "/implementation-guide" },
  { label: "Support Center", to: "/support" },
  { label: "Responsible AI", to: "/responsible-ai" },
];

export function PublicHeader() {
  const navigate = useNavigate();
  const { openDemoRequest } = useDemoRequest();
  const { user } = useAuth();
  const { status } = useWorkspace();
  const [open, setOpen] = useState(false);

  const approved = Boolean(user) && status === "approved";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Predict Disease</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/clinical-evidence"
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            Clinical Evidence
          </NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Resources
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-popover">
              {RESOURCES.map((r) => (
                <DropdownMenuItem key={r.to} asChild>
                  <Link to={r.to}>{r.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button onClick={openDemoRequest}>Request a Demo</Button>
          {approved ? (
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Open Workspace
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 overflow-y-auto bg-background">
            <nav className="mt-8 flex flex-col gap-1">
              {[...NAV, ...RESOURCES].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                onClick={() => {
                  setOpen(false);
                  openDemoRequest();
                }}
              >
                Request a Demo
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate(approved ? "/dashboard" : "/auth");
                }}
              >
                {approved ? "Open Workspace" : "Sign In"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default PublicHeader;
