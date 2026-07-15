import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const KEYS = ["risk_histogram", "symptom_prevalence", "age_vs_risk", "cohort_summary", "totals"] as const;

export default defineTool({
  name: "get_population_metrics",
  title: "Get population analytics snapshot",
  description: "Return the latest aggregate population metrics: risk histogram, symptom prevalence, age vs risk, cohort summary, or totals.",
  inputSchema: {
    metric: z.enum(KEYS).optional().describe("Which metric to return; omit for all."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ metric }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let q = sb(ctx).from("population_metrics").select("*").order("snapshot_date", { ascending: false }).limit(20);
    if (metric) q = q.eq("metric_key", metric);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    // pick the most recent per key
    const latest = new Map<string, any>();
    for (const r of data ?? []) if (!latest.has(r.metric_key)) latest.set(r.metric_key, r);
    const out = Array.from(latest.values());
    return { content: [{ type: "text", text: JSON.stringify(out) }], structuredContent: { metrics: out } };
  },
});
