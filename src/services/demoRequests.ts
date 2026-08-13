import { supabase } from "@/integrations/supabase/client";

export interface DemoRequestInput {
  name: string;
  email: string;
  organization?: string | null;
  requestedRole?: string | null;
  phone?: string | null;
  message?: string | null;
  source?: "website" | "signup";
}

/**
 * Single shared path for creating a demo lead. Used by the public
 * "Request a Demo" dialog and by sign-ups that ask for a demo.
 */
export async function submitDemoRequest(input: DemoRequestInput): Promise<void> {
  const { error } = await supabase.functions.invoke("submit-demo-request", {
    body: {
      name: input.name,
      email: input.email,
      organization: input.organization ?? null,
      requested_role: input.requestedRole ?? null,
      phone: input.phone ?? null,
      message: input.message ?? null,
      source: input.source ?? "website",
    },
  });
  if (error) throw error;
}
