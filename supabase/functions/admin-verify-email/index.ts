import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * Admin-only email verification helper.
 * - action "status": returns which of the given users have a confirmed email.
 * - action "confirm": marks a user's email as confirmed manually.
 * Caller must be an authenticated user holding the "admin" role.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const { data: caller } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!caller.user) return json({ error: "Unauthorized" }, 401);

    const { data: isAdmin, error: roleError } = await admin.rpc("has_role", {
      _user_id: caller.user.id,
      _role: "admin",
    });
    if (roleError) throw roleError;
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    if (action === "status") {
      const ids: string[] = Array.isArray(body.userIds) ? body.userIds.slice(0, 500) : [];
      const results: Record<string, boolean> = {};
      for (const id of ids) {
        const { data } = await admin.auth.admin.getUserById(id);
        results[id] = Boolean(data.user?.email_confirmed_at);
      }
      return json({ confirmed: results });
    }

    if (action === "confirm") {
      const userId: string = body?.userId;
      if (!userId) return json({ error: "userId is required" }, 400);
      const { data, error } = await admin.auth.admin.updateUserById(userId, {
        email_confirm: true,
      });
      if (error) throw error;
      return json({ ok: true, confirmed_at: data.user?.email_confirmed_at ?? null });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
