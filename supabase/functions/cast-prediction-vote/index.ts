import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ALLOWED_ORIGINS = new Set([
  "https://iwannaberich.xyz",
  "https://www.iwannaberich.xyz",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://iwannaberich.xyz";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

function json(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin),
  });
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(req: Request): string {
  return req.headers.get("cf-connecting-ip")?.trim()
    || req.headers.get("x-real-ip")?.trim()
    || req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || "unknown";
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed" }, 403, origin);
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed" }, 403, origin);

  try {
    const body = await req.json();
    const voteType = body?.vote_type;
    const predictionId = Number(body?.prediction_id ?? 1);

    if (predictionId !== 1 || !["yes", "no"].includes(voteType)) {
      return json({ error: "Invalid vote." }, 400, origin);
    }

    const ip = getClientIp(req);
    const salt = Deno.env.get("PUBLIC_API_RATE_LIMIT_SALT") || SERVICE_ROLE_KEY;
    const voterHash = await sha256(`iwbr-v1:${salt}:${ip}`);

    const { data: allowed, error: rateLimitError } = await supabase.rpc("consume_api_rate_limit", {
      p_bucket: "prediction-vote",
      p_ip_hash: voterHash,
      p_max_10m: 3,
      p_max_day: 10,
    });

    if (rateLimitError) {
      console.error("Prediction vote rate-limit error:", rateLimitError);
      return json({ error: "Voting is temporarily unavailable." }, 500, origin);
    }

    if (!allowed) return json({ error: "Slow down. You can vote again later." }, 429, origin);

    const { error: insertError } = await supabase
      .from("prediction_votes")
      .insert({ prediction_id: predictionId, vote_type: voteType, voter_hash: voterHash });

    if (insertError) {
      if (insertError.code === "23505") {
        return json({ error: "You already voted." }, 409, origin);
      }
      console.error("Vote insert error:", insertError);
      return json({ error: "Vote unavailable right now." }, 500, origin);
    }

    const { error: incrementError } = await supabase.rpc("increment_prediction_vote", { vote_type: voteType });
    if (incrementError) {
      await supabase.from("prediction_votes")
        .delete()
        .eq("prediction_id", predictionId)
        .eq("voter_hash", voterHash);
      console.error("Vote increment error:", incrementError);
      return json({ error: "Vote unavailable right now." }, 500, origin);
    }

    return json({ ok: true, vote_type: voteType }, 200, origin);
  } catch (error) {
    console.error("Vote handler error:", error);
    return json({ error: "Invalid request." }, 400, origin);
  }
});
