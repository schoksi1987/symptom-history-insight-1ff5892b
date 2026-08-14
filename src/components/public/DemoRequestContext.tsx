import { createContext, useContext, useState } from "react";
import { DemoRequestDialog } from "@/components/DemoRequestDialog";

interface DemoRequestContextType {
  openDemoRequest: () => void;
}

const DemoRequestContext = createContext<DemoRequestContextType>({
  openDemoRequest: () => {},
});

/**
 * Single shared entry point for the public "Request a Demo" flow so headers,
 * footers and page CTAs all open the same dialog and hit the same service.
 */
export function DemoRequestProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DemoRequestContext.Provider value={{ openDemoRequest: () => setOpen(true) }}>
      {children}
      <DemoRequestDialog open={open} onOpenChange={setOpen} />
    </DemoRequestContext.Provider>
  );
}

export const useDemoRequest = () => useContext(DemoRequestContext);
