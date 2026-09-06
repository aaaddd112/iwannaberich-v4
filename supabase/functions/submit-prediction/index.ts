import { createClient } from "jsr:@supabase/supabase-js@2";
import { htmlText, sendOwnerNotification } from "../_shared/notify.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://iwannaberich.xyz",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ownerEmail = (Deno.env.get("OWNER_EMAIL") ?? "").trim().toLowerCase();

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BLOCKED_PATTERNS = [
  /\bf+u+c+k+\b/i, /\bf[\W_]*u[\W_]*c[\W_]*k/i,
  /\bs+h+i+t+\b/i, /\bs[\W_]*h[\W_]*i[\W_]*t/i,
  /\bb+i+t+c+h+\b/i, /\bb[\W_]*i[\W_]*t[\W_]*c[\W_]*h/i,
  /\ba+s+s+h+o+l+e+\b/i, /\ba[\W_]*s[\W_]*s[\W_]*h[\W_]*o[\W_]*l[\W_]*e/i,
  /\bc+u+n+t+\b/i, /\bn+i+g+g+e+r\b/i, /\bf+a+g+\b/i,
  /\bc+o+c+k+\b/i, /\bp+u+s+s+y\b/i,
  /\bp[uú]l[aă]\b/i, /\bmuie\b/i, /\bf[uă]t\b/i, /\bfutut\b/i,
  /\bpisd[aă]\b/i, /\bcurv[aă]\b/i,
];

function normalizeText(text: string): string {
  return text.normalize("NFKC").toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[0]/g, "o").replace(/[1]/g, "i").replace(/[3]/g, "e")
    .replace(/[4@]/g, "a").replace(/[5$]/g, "s").replace(/[7]/g, "t")
    .replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function containsBlockedContent(text: string): boolean {
  const normalized = normalizeText(text);
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(text) || pattern.test(normalized));
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getClientIp(req: Request): string {
  // Prefer headers controlled by the actual proxy in front of the function.
  // x-forwarded-for is last because arbitrary clients can spoof it.
  return req.headers.get("cf-connecting-ip")?.trim()
    || req.headers.get("x-real-ip")?.trim()
    || req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || "unknown";
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";
    const parentId = typeof body.parent_id === "string" && body.parent_id ? body.parent_id : null;

    if (honeypot) return jsonResponse({ success: true });
    if (!comment) return jsonResponse({ error: "Prediction cannot be empty." }, 400);
    if (comment.length > 280) return jsonResponse({ error: "Prediction is too long." }, 400);
    if (containsBlockedContent(comment)) {
      return jsonResponse({ error: "Let's keep it civil. The internet is already weird enough." }, 400);
    }

    let authorType = "visitor";
    let authorId: string | null = null;

    if (parentId) {
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
      if (!token) return jsonResponse({ error: "Owner login required." }, 401);

      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData.user) return jsonResponse({ error: "Owner login required." }, 401);

      const email = (userData.user.email ?? "").toLowerCase();
      if (!ownerEmail || email !== ownerEmail) {
        return jsonResponse({ error: "This account is not authorized as the owner." }, 403);
      }

      const { data: parent, error: parentError } = await supabase
        .from("predictions_comments")
        .select("id, parent_id")
        .eq("id", parentId)
        .single();

      if (parentError || !parent || parent.parent_id !== null) {
        return jsonResponse({ error: "Replies can only be attached to an original prediction." }, 400);
      }

      authorType = "owner";
      authorId = userData.user.id;
    }

    const ip = getClientIp(req);
    const ipSalt = Deno.env.get("PREDICTION_RATE_LIMIT_SALT") ?? serviceRoleKey;
    const ipHash = await sha256(`${ipSalt}:${ip}`);

    const { data: allowed, error: rateLimitError } = await supabase.rpc(
      "consume_prediction_rate_limit",
      { p_ip_hash: ipHash, p_max_10m: parentId ? 20 : 3, p_max_day: parentId ? 100 : 10 }
    );

    if (rateLimitError) return jsonResponse({ error: "Something went wrong. Try again in a moment." }, 500);
    if (!allowed) return jsonResponse({ error: "Slow down. Even billionaires need rate limits." }, 429);

    const normalized = normalizeText(comment);
    const commentHash = await sha256(normalized + (parentId ?? ""));
    const duplicateSince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: duplicate, error: duplicateError } = await supabase
      .from("predictions_comments")
      .select("id")
      .eq("normalized_hash", commentHash)
      .gte("created_at", duplicateSince)
      .limit(1)
      .maybeSingle();

    if (duplicateError) return jsonResponse({ error: "Could not verify prediction." }, 500);
    if (duplicate) return jsonResponse({ error: "You've already posted that prediction." }, 409);

    const { data: inserted, error: insertError } = await supabase
      .from("predictions_comments")
      .insert({
        comment,
        normalized_hash: commentHash,
        parent_id: parentId,
        author_id: authorId,
        author_type: authorType,
      })
      .select("id, comment, created_at, parent_id, author_type")
      .single();

    if (insertError) {
      console.error("Prediction insert error:", insertError);
      return jsonResponse({ error: "Could not save prediction." }, 500);
    }

    const createdAt = inserted.created_at ?? new Date().toISOString();
    const subject = parentId
      ? "IWANNABERICH — new prediction reply"
      : "IWANNABERICH — new prediction";
    const text = [
      parentId ? "A visitor replied to a prediction." : "A visitor left a new prediction.",
      "",
      `Prediction: ${comment}`,
      `Created: ${createdAt}`,
      `Type: ${authorType}`,
      `ID: ${inserted.id}`,
    ].join("\n");
    const html = `
      <h2>${parentId ? "New prediction reply" : "New prediction"}</h2>
      <p><strong>Prediction:</strong></p>
      <blockquote>${htmlText(comment)}</blockquote>
      <p><strong>Created:</strong> ${htmlText(createdAt)}</p>
      <p><strong>Type:</strong> ${htmlText(authorType)}</p>
      <p><strong>ID:</strong> ${htmlText(inserted.id)}</p>
    `;
    await sendOwnerNotification(subject, text, html);

    return jsonResponse({ success: true, prediction: inserted });
  } catch (error) {
    console.error("Prediction endpoint error:", error);
    return jsonResponse({ error: "Invalid request." }, 400);
  }
});
