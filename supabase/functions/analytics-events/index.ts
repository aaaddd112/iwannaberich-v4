import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

const ALLOWED_EVENTS = new Set([
  "page_view",
  "cta_click",
  "contribution_open",
  "stripe_checkout",
  "prediction_submit",
  "telegram_click",
  "scroll_50",
  "scroll_90",
]);

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Method not allowed." },
      405
    );
  }

  try {
    const body = await req.json();

    const eventName =
      typeof body.event_name === "string"
        ? body.event_name.trim()
        : "";

    const page =
      typeof body.page === "string"
        ? body.page.slice(0, 500)
        : null;

    const metadata =
      body.metadata &&
      typeof body.metadata === "object" &&
      !Array.isArray(body.metadata)
        ? body.metadata
        : {};

    if (!ALLOWED_EVENTS.has(eventName)) {
      return jsonResponse(
        { error: "Invalid event." },
        400
      );
    }

    const { error } = await supabase
      .from("analytics_events")
      .insert({
        event_name: eventName,
        page,
        metadata,
      });

    if (error) {
      console.error(
        "Analytics insert error:",
        error
      );

      return jsonResponse(
        { error: "Could not record event." },
        500
      );
    }

    return jsonResponse({
      success: true,
    });
  } catch (error) {
    console.error(
      "Analytics endpoint error:",
      error
    );

    return jsonResponse(
      { error: "Invalid request." },
      400
    );
  }
});