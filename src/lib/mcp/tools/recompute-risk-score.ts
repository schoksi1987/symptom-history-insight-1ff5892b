import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "recompute_risk_score",
  title: "Recompute diabetes risk score",
  description: "Recompute the diabetes risk score for the signed-in user from their current symptoms, profile, and notes.",
  inputSchema: {},
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async (_i, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const res = await fetch(`${process.env.SUPABASE_URL}/functions/v1/compute-risk-score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ctx.getToken()}`,
      },
      body: JSON.stringify({ patientId: ctx.getUserId() }),
    });
    const body = await res.json();
    if (!res.ok) return { content: [{ type: "text", text: body.error ?? "Compute failed" }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(body.risk) }], structuredContent: { risk: body.risk } };
  },
});
