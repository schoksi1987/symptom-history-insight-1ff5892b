import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { useDemoRequest } from "@/components/public/DemoRequestContext";
import { SUPPORT_EMAIL } from "@/content/sources";

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
  { label: "Support & Contact", to: "/support" },
];

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Medical Disclaimer", to: "/medical-disclaimer" },
  { label: "Responsible AI", to: "/responsible-ai" },
];

function Column({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
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
          <Activity className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="flex items-baseline gap-1.5">
            <span className="font-bold text-foreground">Predict Disease</span>
            <span className="text-sm text-muted-foreground">by symptom.ai</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Column title="Platform" links={PLATFORM} />
          <Column title="Resources" links={RESOURCES} />

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="transition-colors hover:text-primary">
                  About Predict Disease
                </Link>
              </li>
              <li>
                <button onClick={openDemoRequest} className="transition-colors hover:text-primary">
                  Try the Clinical Demo
                </button>
              </li>
              <li>
                <Link to="/support" className="transition-colors hover:text-primary">
                  Contact &amp; Support
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="transition-colors hover:text-primary"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <Column title="Trust & Legal" links={LEGAL} />
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          <p>
            &copy; {year} symptom.ai. Predict Disease by symptom.ai — Type 2 diabetes screening
            decision support.
          </p>
          <p className="mt-2">
            This assessment provides clinical decision support and does not diagnose Type 2 diabetes
            or replace professional medical judgment.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
