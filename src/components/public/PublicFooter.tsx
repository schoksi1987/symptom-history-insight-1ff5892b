import { Link } from "react-router-dom";
import { Brain } from "lucide-react";
import { useDemoRequest } from "@/components/public/DemoRequestContext";

const PLATFORM = [
  { label: "Patient Risk Review", to: "/platform#risk-review" },
  { label: "Population Insights", to: "/platform#population" },
  { label: "Visit Copilot", to: "/platform#visit-copilot" },
  { label: "Clinical Decision Summary", to: "/platform#decision-summary" },
  { label: "Lifestyle & Social Context", to: "/platform#context" },
];

const RESOURCES = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "Clinical Approach", to: "/clinical-approach" },
  { label: "Clinical Evidence", to: "/clinical-evidence" },
  { label: "Implementation Guide", to: "/implementation-guide" },
  { label: "Support Center", to: "/support" },
];

const LEGAL = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Medical Disclaimer", to: "/medical-disclaimer" },
  { label: "Responsible AI", to: "/responsible-ai" },
];

function Column({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
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
        <div className="mb-10 flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold">Predict Disease</span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
          <p>&copy; {year} Predict Disease. Diabetes screening and primary-care decision support.</p>
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
