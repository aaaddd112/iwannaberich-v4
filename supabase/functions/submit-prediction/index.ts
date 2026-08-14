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

const BLOCKED_PATTERNS = [
  /\bf+u+c+k+\b/i,
  /\bf[\W_]*u[\W_]*c[\W_]*k/i,
  /\bs+h+i+t+\b/i,
  /\bs[\W_]*h[\W_]*i[\W_]*t/i,
  /\bb+i+t+c+h+\b/i,
  /\bb[\W_]*i[\W_]*t[\W_]*c[\W_]*h/i,
  /\ba+s+s+h+o+l+e+\b/i,
  /\ba[\W_]*s[\W_]*s[\W_]*h[\W_]*o[\W_]*l[\W_]*e/i,
  /\bc+u+n+t+\b/i,
  /\bn+i+g+g+e+r\b/i,
  /\bf+a+g+\b/i,
  /\bc+o+c+k+\b/i,
  /\bp+u+s+s+y\b/i,

  // Romanian
  /\bp[uú]l[aă]\b/i,
  /\bmuie\b/i,
  /\bf[uă]t\b/i,
  /\bfutut\b/i,
  /\bpisd[aă]\b/i,
  /\bcurv[aă]\b/i,
];

function normalizeText(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[0]/g, "o")
    .replace(/[1]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[4@]/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsBlockedContent(text: string): boolean {
  const normalized = normalizeText(text);

  return BLOCKED_PATTERNS.some(
    (pattern) =>
      pattern.test(text) ||
      pattern.test(normalized)
  );
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  const cfIp = req.headers.get("cf-connecting-ip");

  if (cfIp) {
    return cfIp.trim();
  }

  return "unknown";
}

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

Deno.serve(async (req) => {
  // CORS preflight.
  // 204 responses must not contain a body.
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        error: "Method not allowed",
      },
      405
    );
  }

  try {
    const body = await req.json();

    const comment =
      typeof body.comment === "string"
        ? body.comment.trim()
        : "";

    const honeypot =
      typeof body.website === "string"
        ? body.website.trim()
        : "";

    // Basic bots sometimes fill hidden fields.
    if (honeypot.length > 0) {
      return jsonResponse({
        success: true,
      });
    }

    if (!comment) {
      return jsonResponse(
        {
          error: "Prediction cannot be empty.",
        },
        400
      );
    }

    if (comment.length > 280) {
      return jsonResponse(
        {
          error: "Prediction is too long.",
        },
        400
      );
    }

    if (containsBlockedContent(comment)) {
      return jsonResponse(
        {
          error:
            "Let's keep it civil. The internet is already weird enough.",
        },
        400
      );
    }

    const ip = getClientIp(req);

    const ipSalt =
      Deno.env.get("PREDICTION_RATE_LIMIT_SALT") ??
      serviceRoleKey;

    const ipHash = await sha256(
      `${ipSalt}:${ip}`
    );

    const {
      data: allowed,
      error: rateLimitError,
    } = await supabase.rpc(
      "consume_prediction_rate_limit",
      {
        p_ip_hash: ipHash,
        p_max_10m: 3,
        p_max_day: 10,
      }
    );

    if (rateLimitError) {
      console.error(
        "Rate limit error:",
        rateLimitError
      );

      return jsonResponse(
        {
          error:
            "Something went wrong. Try again in a moment.",
        },
        500
      );
    }

    if (!allowed) {
      return jsonResponse(
        {
          error:
            "Slow down. Even billionaires need rate limits.",
        },
        429
      );
    }

    const normalized = normalizeText(comment);

    const commentHash = await sha256(
      normalized
    );

    const duplicateSince =
      new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString();

    const {
      data: duplicate,
      error: duplicateError,
    } = await supabase
      .from("predictions_comments")
      .select("id")
      .eq("normalized_hash", commentHash)
      .gte("created_at", duplicateSince)
      .limit(1)
      .maybeSingle();

    if (duplicateError) {
      console.error(
        "Duplicate check error:",
        duplicateError
      );

      return jsonResponse(
        {
          error:
            "Could not verify prediction.",
        },
        500
      );
    }

    if (duplicate) {
      return jsonResponse(
        {
          error:
            "You've already posted that prediction.",
        },
        409
      );
    }

    const {
      data: inserted,
      error: insertError,
    } = await supabase
      .from("predictions_comments")
      .insert({
        comment,
        normalized_hash: commentHash,
      })
      .select(
        "id, comment, created_at"
      )
      .single();

    if (insertError) {
      console.error(
        "Prediction insert error:",
        insertError
      );

      return jsonResponse(
        {
          error:
            "Could not save prediction.",
        },
        500
      );
    }

    return jsonResponse({
      success: true,
      prediction: inserted,
    });
  } catch (error) {
    console.error(
      "Prediction endpoint error:",
      error
    );

    return jsonResponse(
      {
        error: "Invalid request.",
      },
      400
    );
  }
});