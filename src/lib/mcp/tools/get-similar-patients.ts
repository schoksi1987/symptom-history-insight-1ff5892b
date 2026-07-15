import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_similar_patients",
  title: "Get similar-patient cohort",
  description: "Return the cohort the signed-in user has been clustered into, its centroid features, size, average risk, and top interventions that worked for similar patients.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_i, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const client = sb(ctx);
    const { data: assign } = await client
      .from("patient_cohort_assignments")
      .select("*")
      .order("computed_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!assign) return { content: [{ type: "text", text: "No cohort assignment yet. Ask an admin to run compute-cohorts." }] };
    const { data: cohort } = await client.from("cohorts").select("*").eq("id", assign.cohort_id).maybeSingle();
    const payload = { assignment: assign, cohort };
    return { content: [{ type: "text", text: JSON.stringify(payload) }], structuredContent: payload };
  },
});
