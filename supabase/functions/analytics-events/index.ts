import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://iwannaberich.xyz",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
const ALLOWED_EVENTS = new Set([
  "page_view","cta_click","contribution_open","stripe_checkout","prediction_submit","telegram_click","scroll_50","scroll_90",
  "prediction_open","signup_start","signup_complete","login_success","profile_complete","community_reply","community_reaction","share_click","referral_visit",
]);
const MAX_BODY_BYTES = 16384;
const MAX_METADATA_KEYS = 40;
function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return jsonResponse({ error: "Request too large." }, 413);
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return jsonResponse({ error: "Request too large." }, 413);
    const body = JSON.parse(raw);
    const eventName = typeof body.event_name === "string" ? body.event_name.trim() : "";
    const page = typeof body.page === "string" ? body.page.slice(0, 500) : null;
    const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata) ? body.metadata : {};
    if (!ALLOWED_EVENTS.has(eventName)) return jsonResponse({ error: "Invalid event." }, 400);
    const safeMetadata: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(metadata).slice(0, MAX_METADATA_KEYS)) {
      const cleanKey = String(key).slice(0, 60);
      if (typeof value === "string") safeMetadata[cleanKey] = value.slice(0, 200);
      else if (typeof value === "number" && Number.isFinite(value)) safeMetadata[cleanKey] = value;
      else if (typeof value === "boolean") safeMetadata[cleanKey] = value;
    }
    const { error } = await supabase.from("analytics_events").insert({ event_name: eventName, page, metadata: safeMetadata });
    if (error) { console.error("Analytics insert error:", error); return jsonResponse({ error: "Could not record event." }, 500); }
    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Analytics endpoint error:", error);
    return jsonResponse({ error: "Invalid request." }, 400);
  }
});
