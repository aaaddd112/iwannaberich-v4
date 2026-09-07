import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ALLOWED_ORIGIN = "https://iwannaberich.xyz";
const REACTIONS = new Set(["fire", "bullseye", "laugh", "eyes"]);
const CORS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Vary": "Origin",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: CORS });

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function rpc(name: string, body: unknown) {
  return fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (req.headers.get("origin") !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed" }, 403);

  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 2048) return json({ error: "Request too large" }, 413);
    const payload = await req.json();
    const commentId = typeof payload?.comment_id === "string" ? payload.comment_id.trim() : "";
    const reactionType = typeof payload?.reaction_type === "string" ? payload.reaction_type.trim() : "";
    const voterId = typeof payload?.voter_id === "string" ? payload.voter_id.trim() : "";
    if (!/^[0-9a-f-]{36}$/i.test(commentId) || !REACTIONS.has(reactionType) || !/^[0-9a-f-]{36}$/i.test(voterId)) {
      return json({ error: "Invalid reaction" }, 400);
    }

    const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipHash = await sha256(`${ip}|iwbr-reaction-rate-v1`);
    const rate = await rpc("consume_api_rate_limit", {
      p_bucket: "community-reaction",
      p_ip_hash: ipHash,
      p_max_10m: 20,
      p_max_day: 100,
    });
    if (!rate.ok || (await rate.json()) !== true) return json({ error: "Too many reactions. Try again later." }, 429);

    const voterHash = await sha256(`${ip}|${voterId}|${req.headers.get("user-agent") || "unknown"}|iwbr-reaction-v1`);
    const toggle = await rpc("apply_community_reaction", {
      p_comment_id: commentId,
      p_reaction_type: reactionType,
      p_voter_hash: voterHash,
    });
    if (!toggle.ok) {
      const detail = await toggle.text();
      if (detail.includes("comment_not_found")) return json({ error: "Comment not found" }, 404);
      return json({ error: "Could not update reaction" }, 400);
    }
    const active = await toggle.json();

    const countsResponse = await rpc("get_community_reaction_counts", { p_comment_ids: [commentId] });
    if (!countsResponse.ok) return json({ active: Boolean(active), counts: [] });
    const counts = await countsResponse.json();
    return json({ active: Boolean(active), counts });
  } catch (error) {
    console.error("Community reaction error:", error);
    return json({ error: "Could not update reaction" }, 500);
  }
});
