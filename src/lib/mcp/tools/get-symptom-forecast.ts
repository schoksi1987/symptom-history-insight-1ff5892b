import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_symptom_forecast",
  title: "Get symptom forecast",
  description: "Return per-symptom weekly history, a 4-week forecast, trend label (improving/stable/worsening), and anomaly flag for the signed-in user.",
  inputSchema: {
    symptom_name: z.string().optional().describe("Filter to a specific symptom."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ symptom_name, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    let q = sb(ctx).from("symptom_forecasts").select("*").order("computed_at", { ascending: false }).limit(limit ?? 10);
    if (symptom_name) q = q.eq("symptom_name", symptom_name);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { forecasts: data } };
  },
});
