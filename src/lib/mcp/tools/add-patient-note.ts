import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "add_patient_note",
  title: "Add patient note",
  description:
    "Add a between-visit patient note for the signed-in user. The note is stored with a timestamp and queued for AI symptom analysis.",
  inputSchema: {
    note_text: z.string().trim().min(1).describe("Free-text note describing symptoms, feelings, or observations."),
    source: z.enum(["mcp", "manual", "email"]).optional().describe("Where the note came from (default 'mcp')."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ note_text, source }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const patient_id = ctx.getUserId();
    const { data, error } = await supabase
      .from("patient_notes")
      .insert({
        patient_id,
        note_text,
        source: source ?? "mcp",
        analysis_status: "pending",
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Note saved (id: ${data.id})` }],
      structuredContent: { note: data },
    };
  },
});
