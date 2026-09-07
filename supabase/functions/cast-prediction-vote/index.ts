import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const ALLOWED_ORIGIN = "https://iwannaberich.xyz";
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(req: Request) {
  const direct = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip");
  if (direct?.trim()) return direct.trim();
  return "unknown";
}

async function readJson(req: Request) {
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > 2048) throw new Error("Body too large");
  const raw = await req.text();
  if (new TextEncoder().encode(raw).byteLength > 2048) throw new Error("Body too large");
  return JSON.parse(raw);
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (origin && origin !== ALLOWED_ORIGIN) {
    return new Response(JSON.stringify({ error: "Origin not allowed." }), {
      status: 403,
      headers: corsHeaders
    });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const body = await readJson(req);
    const voteType = body?.vote_type;
    const predictionId = Number(body?.prediction_id ?? 1);

    if (predictionId !== 1 || !["yes", "no"].includes(voteType)) {
      return new Response(JSON.stringify({ error: "Invalid vote." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const ip = getClientIp(req);
    if (ip === "unknown") {
      return new Response(JSON.stringify({ error: "Unable to identify voter." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const voterHash = await sha256(`iwbr-v1:${ip}`);
    const { data: allowed, error: rateError } = await supabase.rpc(
      "consume_prediction_rate_limit",
      { p_ip_hash: voterHash, p_limit_10m: 3, p_limit_day: 3 }
    );

    if (rateError || allowed !== true) {
      return new Response(JSON.stringify({ error: "Too many attempts. Try again later." }), {
        status: 429,
        headers: corsHeaders
      });
    }

    const { error: insertError } = await supabase
      .from("prediction_votes")
      .insert({ prediction_id: predictionId, vote_type: voteType, voter_hash: voterHash });

    if (insertError) {
      if (insertError.code === "23505") {
        return new Response(JSON.stringify({ error: "You already voted." }), {
          status: 409,
          headers: corsHeaders
        });
      }
      console.error("Vote insert error:", insertError);
      return new Response(JSON.stringify({ error: "Vote unavailable right now." }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const { error: incrementError } = await supabase.rpc("increment_prediction_vote", {
      vote_type: voteType
    });

    if (incrementError) {
      await supabase
        .from("prediction_votes")
        .delete()
        .eq("prediction_id", predictionId)
        .eq("voter_hash", voterHash);
      console.error("Vote increment error:", incrementError);
      return new Response(JSON.stringify({ error: "Vote unavailable right now." }), {
        status: 500,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ ok: true, vote_type: voteType }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Vote handler error:", error);
    const status = error instanceof Error && error.message === "Body too large" ? 413 : 400;
    return new Response(JSON.stringify({
      error: status === 413 ? "Request too large." : "Invalid request."
    }), {
      status,
      headers: corsHeaders
    });
  }
});
