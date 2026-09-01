import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const rateLimitSalt = Deno.env.get("PUBLIC_API_RATE_LIMIT_SALT") || serviceRoleKey;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ALLOWED_EVENTS = new Set([
  "page_view", "cta_click", "contribution_open", "stripe_checkout",
  "prediction_submit", "telegram_click", "scroll_50", "scroll_90",
]);

const MAX_BODY_BYTES = 16 * 1024;
const MAX_PAGE_LENGTH = 200;
const MAX_METADATA_BYTES = 4096;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getClientIp(req: Request): string {
  return req.headers.get("cf-connecting-ip")?.trim()
    || req.headers.get("x-real-ip")?.trim()
    || "unknown";
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) return jsonResponse({ error: "Request is too large." }, 413);

    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonResponse({ error: "Request is too large." }, 413);
    }

    const body = JSON.parse(rawBody);
    const eventName = typeof body.event_name === "string" ? body.event_name.trim() : "";
    const page = typeof body.page === "string" ? body.page.slice(0, MAX_PAGE_LENGTH) : null;
    const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
      ? body.metadata : {};

    if (!ALLOWED_EVENTS.has(eventName)) return jsonResponse({ error: "Invalid event." }, 400);

    const metadataJson = JSON.stringify(metadata);
    if (new TextEncoder().encode(metadataJson).byteLength > MAX_METADATA_BYTES) {
      return jsonResponse({ error: "Analytics metadata is too large." }, 413);
    }

    const ipHash = await sha256(`analytics-v1:${rateLimitSalt}:${getClientIp(req)}`);
    const { data: allowed, error: rateLimitError } = await supabase.rpc("consume_api_rate_limit", {
      p_bucket: "analytics-events",
      p_ip_hash: ipHash,
      p_max_10m: 120,
      p_max_day: 2000,
    });

    if (rateLimitError) {
      console.error("Analytics rate-limit error:", rateLimitError);
      return jsonResponse({ error: "Analytics is temporarily unavailable." }, 500);
    }
    if (!allowed) return jsonResponse({ error: "Too many analytics events." }, 429);

    const { error } = await supabase.from("analytics_events").insert({
      event_name: eventName,
      page,
      metadata,
    });

    if (error) {
      console.error("Analytics insert error:", error);
      return jsonResponse({ error: "Could not record event." }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Analytics endpoint error:", error);
    return jsonResponse({ error: "Invalid request." }, 400);
  }
});
