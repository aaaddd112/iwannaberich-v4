import { createClient } from "jsr:@supabase/supabase-js@2";
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const rateLimitSalt = Deno.env.get("PUBLIC_API_RATE_LIMIT_SALT") || "iwbr-rate-limit";
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
const allowedOptions = new Set(["sell", "digital", "hustle"]);
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
function response(body: Record<string, unknown>, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } }); }
function ip(req: Request) { return req.headers.get("cf-connecting-ip")?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown"; }
async function hash(value: string) { const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`next-experiment-v1:${rateLimitSalt}:${value}`)); return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, "0")).join(""); }
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return response({ error: "Method not allowed." }, 405);
  try {
    const len = Number(req.headers.get("content-length") || 0);
    if (len > 2048) return response({ error: "Payload too large." }, 413);
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > 2048) return response({ error: "Payload too large." }, 413);
    const body = JSON.parse(raw);
    const optionCode = typeof body?.option_code === "string" ? body.option_code.trim() : "";
    if (!allowedOptions.has(optionCode)) return response({ error: "Invalid experiment option." }, 400);
    const { data: allowed, error: rateError } = await supabase.rpc("consume_api_rate_limit", { p_bucket: "next-experiment-vote", p_ip_hash: await hash(ip(req)), p_max_10m: 3, p_max_day: 10 });
    if (rateError) return response({ error: "Voting is temporarily unavailable." }, 500);
    if (allowed !== true) return response({ error: "Too many votes. Please try again later." }, 429);
    const { error } = await supabase.from("next_experiment_votes").insert({ option_code: optionCode });
    if (error) return response({ error: "Could not record vote." }, 500);

    let pointsAwarded = 0;
    const authHeader = req.headers.get("authorization") || "";
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      const token = authHeader.slice(7).trim();
      const { data: userData } = await supabase.auth.getUser(token);
      const userId = userData?.user?.id;
      if (userId) {
        const result = await supabase.rpc("award_experiment_vote", { p_user_id: userId, p_option_code: optionCode });
        if (!result.error) pointsAwarded = Number(result.data || 0);
      }
    }
    return response({ success: true, points_awarded: pointsAwarded });
  } catch (error) { console.error("Vote endpoint error:", error); return response({ error: "Invalid request." }, 400); }
});
