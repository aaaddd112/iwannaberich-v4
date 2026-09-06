import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://iwannaberich.xyz",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error("create-profile: missing Supabase server configuration");
}

const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  if (!supabase) {
    return jsonResponse({ error: "server_configuration_error" }, 500);
  }

  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return jsonResponse({ error: "unauthorized" }, 401);

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }

    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username : "";
    const displayName = body?.display_name == null
      ? null
      : typeof body.display_name === "string"
        ? body.display_name
        : "";

    if (!/^[a-z0-9_-]{3,24}$/.test(username.trim().toLowerCase())) {
      return jsonResponse({ error: "invalid_username" }, 400);
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedDisplayName = displayName?.trim() || null;
    if (normalizedDisplayName && normalizedDisplayName.length > 60) {
      return jsonResponse({ error: "display_name_too_long" }, 400);
    }

    const { data, error } = await supabase.rpc("create_my_profile", {
      p_user_id: user.id,
      p_username: normalizedUsername,
      p_display_name: normalizedDisplayName,
    });

    if (error) {
      console.error("create-profile RPC error:", error);
      if (error.code === "23505") {
        return jsonResponse({ error: "username_taken_or_profile_exists" }, 409);
      }
      if (error.code === "23514") {
        return jsonResponse({ error: "username_reserved" }, 409);
      }
      if (error.code === "22023") {
        return jsonResponse({ error: error.message }, 400);
      }
      return jsonResponse({ error: "profile_creation_failed" }, 500);
    }

    return jsonResponse({ success: true, profile: data });
  } catch (error) {
    console.error("create-profile endpoint error:", error);
    return jsonResponse({ error: "invalid_request" }, 400);
  }
});
