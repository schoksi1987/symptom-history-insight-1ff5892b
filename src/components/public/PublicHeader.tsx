import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Brain, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

const NAV = [
  { label: "Platform", to: "/platform" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Clinical Approach", to: "/clinical-approach" },
  { label: "Resources", to: "/clinical-evidence" },
  { label: "About", to: "/about" },
];

export function PublicHeader() {
  const navigate = useNavigate();
  const { openDemoRequest } = useDemoRequest();
  const [open, setOpen] = useState(false);

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
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button onClick={openDemoRequest}>Request a Demo</Button>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-background">
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((item) => (
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
                  navigate("/auth");
                }}
              >
                Sign In
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default PublicHeader;
