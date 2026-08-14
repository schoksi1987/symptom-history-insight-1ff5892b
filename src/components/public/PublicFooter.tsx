import { Link } from "react-router-dom";
import { Brain } from "lucide-react";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

const PLATFORM = [
  "Diabetes Risk Assessment",
  "Patient & Population Insights",
  "Visit Copilot",
  "Clinical Decision Summary",
  "Lifestyle & Social Context",
].map((label) => ({ label, to: "/platform" }));

const RESOURCES = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "Clinical Approach", to: "/clinical-approach" },
  { label: "Clinical Evidence & Methodology", to: "/clinical-evidence" },
  { label: "Implementation Guide", to: "/implementation" },
  { label: "Support Center", to: "/support" },
];

const LEGAL = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Medical Disclaimer", to: "/medical-disclaimer" },
  { label: "Responsible AI", to: "/responsible-ai" },
  { label: "Security", to: "/security" },
];

function Column({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l, i) => (
          <li key={`${l.to}-${i}`}>
            <Link to={l.to} className="transition-colors hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicFooter() {
  const { openDemoRequest } = useDemoRequest();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold">Predict Disease</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Diabetes screening and primary-care decision support.
            </p>
          </div>

          <Column title="Platform" links={PLATFORM} />
          <Column title="Resources" links={RESOURCES} />

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="transition-colors hover:text-primary">
                  About Predict Disease
                </Link>
              </li>
              <li>
                <button onClick={openDemoRequest} className="transition-colors hover:text-primary">
                  Request a Demo
                </button>
              </li>
              <li>
                <Link to="/partnerships" className="transition-colors hover:text-primary">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link to="/support" className="transition-colors hover:text-primary">
                  Provider Support
                </Link>
              </li>
            </ul>
          </div>

          <Column title="Trust & Legal" links={LEGAL} />
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          <p>&copy; {year} Predict Disease. All rights reserved.</p>
          <p className="mt-2">
            Clinical decision-support prototype. Designed to support — not replace — professional
            clinical judgment.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
