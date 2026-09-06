import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json({ error: "unauthorized" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return json({ error: "server_configuration_error" }, 500);

  const adminHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json"
  };

  const callerToken = authorization.slice("Bearer ".length);
  const callerHeaders = {
    apikey: serviceKey,
    Authorization: authorization,
    "Content-Type": "application/json"
  };

  try {
    const adminRes = await fetch(`${url}/rest/v1/admin_users?select=user_id,role`, { headers: adminHeaders });
    if (!adminRes.ok) return json({ error: "authorization_check_failed" }, 500);
    const admins = await adminRes.json();

    const tokenRes = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${callerToken}` }
    });
    if (!tokenRes.ok) return json({ error: "unauthorized" }, 401);
    const caller = await tokenRes.json();
    const admin = admins.find((x: { user_id: string }) => x.user_id === caller.id);
    if (!admin) return json({ error: "not_authorized" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "list");

    if (action === "list") {
      const status = body?.status ? String(body.status) : "";
      const params = new URLSearchParams({
        select: "id,user_id,type,title,content,status,review_note,result,impact_score,selected_at,tested_at,completed_at,created_at,updated_at",
        order: "created_at.desc",
        limit: "100"
      });
      if (status && status !== "all") params.set("status", `eq.${status}`);
      if (!status) params.set("status", "in.(submitted,under_review,selected,in_progress)");

      const res = await fetch(`${url}/rest/v1/contributions?${params}`, { headers: adminHeaders });
      if (!res.ok) return json({ error: "unable_to_load_contributions" }, 500);
      const contributions = await res.json();
      const userIds = [...new Set(contributions.map((x: { user_id: string }) => x.user_id))];

      const profileMap = new Map<string, string>();
      const contributorMap = new Map<string, number>();
      if (userIds.length) {
        const ids = userIds.join(",");
        const [profilesRes, identitiesRes] = await Promise.all([
          fetch(`${url}/rest/v1/profiles?select=id,username&id=in.(${ids})`, { headers: adminHeaders }),
          fetch(`${url}/rest/v1/contributor_identities?select=user_id,contributor_number&user_id=in.(${ids})`, { headers: adminHeaders })
        ]);
        if (profilesRes.ok) for (const p of await profilesRes.json()) profileMap.set(p.id, p.username);
        if (identitiesRes.ok) for (const c of await identitiesRes.json()) contributorMap.set(c.user_id, Number(c.contributor_number));
      }

      return json({
        role: admin.role,
        contributions: contributions.map((x: { user_id: string }) => ({
          ...x,
          username: profileMap.get(x.user_id) || null,
          contributor_number: contributorMap.get(x.user_id) || null
        }))
      });
    }

    if (action === "manage") {
      const contributionId = String(body?.contribution_id || "");
      const reviewAction = String(body?.review_action || "");
      const allowed = ["under_review", "select", "start", "complete", "reject"];
      if (!contributionId || !allowed.includes(reviewAction)) return json({ error: "invalid_request" }, 400);

      const rpcRes = await fetch(`${url}/rest/v1/rpc/manage_contribution`, {
        method: "POST",
        headers: callerHeaders,
        body: JSON.stringify({
          p_contribution_id: contributionId,
          p_action: reviewAction,
          p_review_note: body?.review_note ?? null,
          p_result: body?.result ?? null,
          p_impact_score: body?.impact_score ?? null
        })
      });
      const text = await rpcRes.text();
      if (!rpcRes.ok) {
        let detail: unknown = text;
        try { detail = JSON.parse(text); } catch (_) {}
        return json({ error: typeof detail === "string" && detail ? detail : "review_failed" }, 400);
      }
      let data: unknown = null;
      try { data = JSON.parse(text); } catch (_) {}
      return json({ success: true, result: data });
    }

    return json({ error: "unknown_action" }, 400);
  } catch (error) {
    console.error("[admin-contributions]", error);
    return json({ error: "internal_error" }, 500);
  }
});
