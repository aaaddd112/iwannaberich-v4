import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-analytics-token",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const dashboardToken = Deno.env.get("ANALYTICS_DASHBOARD_TOKEN");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function startOfDay(daysAgo = 0) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d;
}

function isLocalPage(page: string | null) {
  return Boolean(page && /^\/C:\/|^C:\\/i.test(page));
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) || 0) + 1);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  if (!dashboardToken) {
    console.error("ANALYTICS_DASHBOARD_TOKEN is not configured.");
    return jsonResponse({ error: "Dashboard is not configured." }, 500);
  }

  const suppliedToken = req.headers.get("x-analytics-token");

  if (!suppliedToken || suppliedToken !== dashboardToken) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  try {
    const since = startOfDay(29).toISOString();

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_name, page, metadata, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000);

    if (error) {
      console.error("Dashboard query error:", error);
      return jsonResponse({ error: "Could not load analytics." }, 500);
    }

    const events = (data || []).filter(
      (event) => !isLocalPage(event.page)
    );

    const todayStart = startOfDay(0).getTime();
    const sevenDayStart = startOfDay(6).getTime();

    const today = events.filter(
      (e) => new Date(e.created_at).getTime() >= todayStart
    );
    const last7 = events.filter(
      (e) => new Date(e.created_at).getTime() >= sevenDayStart
    );

    const countEvents = (items: typeof events, name: string) =>
      items.filter((e) => e.event_name === name).length;

    const pageViewsToday = countEvents(today, "page_view");
    const pageViews7d = countEvents(last7, "page_view");

    const cta7d = countEvents(last7, "cta_click");
    const contribution7d = countEvents(last7, "contribution_open");
    const stripe7d = countEvents(last7, "stripe_checkout");
    const prediction7d = countEvents(last7, "prediction_submit");
    const telegram7d = countEvents(last7, "telegram_click");

    const pages = new Map<string, number>();
    for (const event of last7.filter((e) => e.event_name === "page_view")) {
      increment(pages, event.page || "/");
    }

    const eventCounts = new Map<string, number>();
    for (const event of last7) {
      increment(eventCounts, event.event_name);
    }

    const daily = Array.from({ length: 7 }, (_, index) => {
      const date = startOfDay(6 - index);
      const next = new Date(date);
      next.setUTCDate(next.getUTCDate() + 1);

      const count = last7.filter((event) => {
        const t = new Date(event.created_at).getTime();
        return t >= date.getTime() && t < next.getTime();
      }).length;

      return {
        date: date.toISOString().slice(0, 10),
        events: count,
      };
    });

    return jsonResponse({
      generated_at: new Date().toISOString(),
      range: {
        today: startOfDay(0).toISOString(),
        seven_days: startOfDay(6).toISOString(),
        thirty_days: since,
      },
      today: {
        page_views: pageViewsToday,
        events: today.length,
      },
      seven_days: {
        page_views: pageViews7d,
        cta_clicks: cta7d,
        contribution_opens: contribution7d,
        stripe_checkouts: stripe7d,
        predictions: prediction7d,
        telegram_clicks: telegram7d,
        scroll_50: countEvents(last7, "scroll_50"),
        scroll_90: countEvents(last7, "scroll_90"),
      },
      funnel: {
        page_views: pageViews7d,
        cta_clicks: cta7d,
        contribution_opens: contribution7d,
        stripe_checkouts: stripe7d,
      },
      top_pages: Array.from(pages.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([page, count]) => ({ page, count })),
      event_counts: Array.from(eventCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([event, count]) => ({ event, count })),
      daily,
      recent: events.slice(0, 20),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return jsonResponse({ error: "Unexpected dashboard error." }, 500);
  }
});
