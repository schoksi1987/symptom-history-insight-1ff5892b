import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AuditInformation } from "@/types/clinical";
import { ShieldCheck } from "lucide-react";

export const AuditInformationDrawer = ({ audit }: { audit: AuditInformation }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          Safety and audit information
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Safety and audit information</SheetTitle>
          <SheetDescription>
            Clinical outputs require physician review and are not validated for diagnosis or treatment.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Clinical rules version</span><span>{audit.rulesVersion}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">AI model version</span><span>{audit.modelVersion}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Assessment generated</span><span>{new Date(audit.generatedAt).toLocaleString()}</span></div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Physician review status</span>
            <Badge variant="outline" className="font-normal">{audit.physicianReviewStatus}</Badge>
          </div>
          <Separator />
          <div>
            <p className="mb-2 font-medium">Inputs used</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              {audit.inputsUsed.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium">Missing inputs</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              {audit.missingInputs.length ? audit.missingInputs.map((i) => <li key={i}>{i}</li>) : <li>None</li>}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
