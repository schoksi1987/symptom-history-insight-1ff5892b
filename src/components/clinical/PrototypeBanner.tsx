import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_DATA_NOTICE } from "@/types/clinical";

export const PrototypeBanner = ({ className }: { className?: string }) => (
  <div
    role="status"
    className={cn(
      "w-full border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-xs text-destructive",
      className,
    )}
  >
    <AlertTriangle className="mr-1 inline h-3 w-3" aria-hidden />
    Prototype only. Clinical outputs require physician review and are not validated for diagnosis or treatment.
  </div>
);

export const DemoDataNotice = ({ className }: { className?: string }) => (
  <p className={cn("text-xs italic text-muted-foreground", className)}>{DEMO_DATA_NOTICE}</p>
);
