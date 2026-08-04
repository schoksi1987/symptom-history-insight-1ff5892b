import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DataSource, VerificationStatus, ContributorStrength } from "@/types/clinical";
import { FlaskConical, Stethoscope, User, Download, ShieldCheck, ShieldAlert, ShieldQuestion, TriangleAlert } from "lucide-react";

const sourceIcon: Record<DataSource, typeof User> = {
  "Patient Reported": User,
  "Physician Entered": Stethoscope,
  Laboratory: FlaskConical,
  Imported: Download,
};

export const DataSourceBadge = ({ source, className }: { source: DataSource; className?: string }) => {
  const Icon = sourceIcon[source];
  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", className)}>
      <Icon className="h-3 w-3" aria-hidden />
      {source}
    </Badge>
  );
};

const verificationStyle: Record<VerificationStatus, { icon: typeof ShieldCheck; className: string }> = {
  Verified: { icon: ShieldCheck, className: "border-primary/40 text-primary" },
  Unverified: { icon: ShieldQuestion, className: "border-muted-foreground/40 text-muted-foreground" },
  "Needs Review": { icon: ShieldAlert, className: "border-accent-foreground/30 text-accent-foreground" },
  Conflicting: { icon: TriangleAlert, className: "border-destructive/40 text-destructive" },
};

export const VerificationBadge = ({ status, className }: { status: VerificationStatus; className?: string }) => {
  const { icon: Icon, className: tone } = verificationStyle[status];
  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", tone, className)}>
      <Icon className="h-3 w-3" aria-hidden />
      {status}
    </Badge>
  );
};

export const ContributorBadge = ({ strength }: { strength: ContributorStrength }) => (
  <Badge
    variant="secondary"
    className={cn(
      "font-normal",
      strength === "Strong Contributor" && "bg-destructive/10 text-destructive",
      strength === "Protective Factor" && "bg-primary/10 text-primary",
    )}
  >
    {strength}
  </Badge>
);
