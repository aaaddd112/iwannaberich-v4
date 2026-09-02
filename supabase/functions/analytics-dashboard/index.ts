import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-analytics-token",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const dashboardToken = Deno.env.get("ANALYTICS_DASHBOARD_TOKEN");
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

const MAX_DAYS = 90;
const MAX_ROWS = 50000;
const ALLOWED_EVENTS = new Set(["page_view","cta_click","contribution_open","stripe_checkout","prediction_submit","telegram_click","scroll_50","scroll_90"]);
const FILTER_KEYS = ["page","source","country","device","browser","os","language","utm_source","utm_medium","utm_campaign","referrer"] as const;

type FilterKey = typeof FILTER_KEYS[number];

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
function parseDate(value: string | null, fallback: Date) {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}
function clampRange(from: Date, to: Date) {
  const maxMs = MAX_DAYS * 24 * 60 * 60 * 1000;
  if (to.getTime() <= from.getTime()) return null;
  if (to.getTime() - from.getTime() > maxMs) return { from: new Date(to.getTime() - maxMs), to };
  return { from, to };
}
function metaValue(event: any, key: string) {
  const value = event?.metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}
function uniqueCount(events: any[], key: string) {
  const set = new Set<string>();
  for (const e of events) { const v = metaValue(e, key); if (v) set.add(v); }
  return set.size;
}
function rank(events: any[], key: string, limit = 12) {
  const map = new Map<string, number>();
  for (const e of events) { const v = metaValue(e, key); if (v) map.set(v, (map.get(v) || 0) + 1); }
  return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([label,count])=>({label,count}));
}
function rankPage(events: any[], limit = 12) {
  const map = new Map<string, number>();
  for (const e of events) { const v = typeof e.page === "string" && e.page ? e.page : "/"; map.set(v,(map.get(v)||0)+1); }
  return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([label,count])=>({label,count}));
}
function eventCounts(events: any[]) {
  const map = new Map<string, number>();
  for (const e of events) map.set(e.event_name,(map.get(e.event_name)||0)+1);
  return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).map(([event,count])=>({event,count}));
}
function dayKey(d: Date) { return d.toISOString().slice(0,10); }
function buildDaily(events: any[], from: Date, to: Date) {
  const out: {date:string;events:number;page_views:number;unique_visitors:number;unique_sessions:number}[] = [];
  const cursor = new Date(from); cursor.setUTCHours(0,0,0,0);
  const end = new Date(to); end.setUTCHours(0,0,0,0);
  while (cursor <= end && out.length <= MAX_DAYS + 1) {
    const next = new Date(cursor); next.setUTCDate(next.getUTCDate()+1);
    const slice = events.filter(e=>{const t=new Date(e.created_at).getTime();return t>=cursor.getTime()&&t<next.getTime();});
    out.push({date:dayKey(cursor),events:slice.length,page_views:slice.filter(e=>e.event_name==="page_view").length,unique_visitors:uniqueCount(slice,"visitor_id"),unique_sessions:uniqueCount(slice,"session_id")});
    cursor.setUTCDate(cursor.getUTCDate()+1);
  }
  return out;
}
function distinctValues(events: any[], key: string, limit = 100) {
  return Array.from(new Set(events.map(e=>metaValue(e,key)).filter(Boolean))).sort((a,b)=>a.localeCompare(b)).slice(0,limit);
}
function distinctPages(events: any[], limit = 100) {
  return Array.from(new Set(events.map(e=>typeof e.page === "string" && e.page ? e.page : "/"))).sort().slice(0,limit);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null,{status:204,headers:corsHeaders});
  if (req.method !== "GET") return jsonResponse({error:"Method not allowed."},405);
  if (!dashboardToken) return jsonResponse({error:"Dashboard is not configured."},500);
  if (req.headers.get("x-analytics-token") !== dashboardToken) return jsonResponse({error:"Unauthorized."},401);

  try {
    const now = new Date();
    const url = new URL(req.url);
    const requestedFrom = parseDate(url.searchParams.get("from"), new Date(now.getTime() - 7*24*60*60*1000));
    const requestedTo = parseDate(url.searchParams.get("to"), now);
    const range = clampRange(requestedFrom, requestedTo);
    if (!range) return jsonResponse({error:"Invalid date range."},400);

    const eventFilter = url.searchParams.get("event")?.trim() || "";
    if (eventFilter && !ALLOWED_EVENTS.has(eventFilter)) return jsonResponse({error:"Invalid event filter."},400);
    const excludeVisitor = url.searchParams.get("exclude_visitor")?.trim().slice(0,100) || "";

    let query = supabase.from("analytics_events").select("event_name,page,metadata,created_at").gte("created_at",range.from.toISOString()).lt("created_at",range.to.toISOString()).order("created_at",{ascending:false}).limit(MAX_ROWS);
    if (eventFilter) query = query.eq("event_name",eventFilter);
    for (const key of FILTER_KEYS) {
      const value = url.searchParams.get(key)?.trim().slice(0,200) || "";
      if (!value) continue;
      if (key === "page") query = query.eq("page",value);
      else if (key === "source") query = query.eq("metadata->>last_touch_source",value);
      else if (key === "referrer") query = query.eq("metadata->>referrer_host",value);
      else if (key === "utm_source") query = query.eq("metadata->>utm_source",value);
      else if (key === "utm_medium") query = query.eq("metadata->>utm_medium",value);
      else if (key === "utm_campaign") query = query.eq("metadata->>utm_campaign",value);
      else query = query.eq(`metadata->>${key}`,value);
    }
    if (excludeVisitor) query = query.not("metadata->>visitor_id","eq",excludeVisitor);

    const {data,error} = await query;
    if (error) { console.error(error); return jsonResponse({error:"Could not load analytics."},500); }
    const events = (data || []).filter((e:any)=>{
      const p = e?.page;
      return !(typeof p === "string" && (/^\/[A-Za-z]:\\/i.test(p) || /^[A-Za-z]:\\/i.test(p)));
    });

    const pageViews = events.filter(e=>e.event_name==="page_view");
    const sessions = uniqueCount(events,"session_id");
    const visitors = uniqueCount(events,"visitor_id");
    const engagedSessions = new Set(events.filter(e=>e.event_name!=="page_view").map(e=>metaValue(e,"session_id")).filter(Boolean)).size;
    const funnel = {
      page_views: pageViews.length,
      cta_clicks: events.filter(e=>e.event_name==="cta_click").length,
      contribution_opens: events.filter(e=>e.event_name==="contribution_open").length,
      stripe_checkouts: events.filter(e=>e.event_name==="stripe_checkout").length,
      prediction_submits: events.filter(e=>e.event_name==="prediction_submit").length,
      telegram_clicks: events.filter(e=>e.event_name==="telegram_click").length,
    };
    const audience = {
      sources: rank(pageViews,"last_touch_source"), referrers: rank(pageViews,"referrer_host"), countries: rank(pageViews,"country"),
      regions: rank(pageViews,"region"), cities: rank(pageViews,"city"), devices: rank(pageViews,"device_type"), browsers: rank(pageViews,"browser"),
      oses: rank(pageViews,"os"), languages: rank(pageViews,"language"), timezones: rank(pageViews,"timezone"), utm_sources: rank(pageViews,"utm_source"),
      utm_mediums: rank(pageViews,"utm_medium"), utm_campaigns: rank(pageViews,"utm_campaign"),
    };
    const facets = {
      events: Array.from(ALLOWED_EVENTS).sort(), pages: distinctPages(events), sources: distinctValues(events,"last_touch_source"), countries: distinctValues(events,"country"),
      devices: distinctValues(events,"device_type"), browsers: distinctValues(events,"browser"), oses: distinctValues(events,"os"), languages: distinctValues(events,"language"),
      utm_sources: distinctValues(events,"utm_source"), utm_mediums: distinctValues(events,"utm_medium"), utm_campaigns: distinctValues(events,"utm_campaign"),
    };

    return jsonResponse({
      generated_at:new Date().toISOString(),
      range:{from:range.from.toISOString(),to:range.to.toISOString(),max_days:MAX_DAYS,truncated:events.length>=MAX_ROWS},
      summary:{events:events.length,page_views:pageViews.length,unique_visitors:visitors,unique_sessions:sessions,engaged_sessions:engagedSessions,bounce_like_sessions:Math.max(0,sessions-engagedSessions),engagement_rate:sessions?Math.round(engagedSessions/sessions*100):0},
      funnel, audience, facets, daily:buildDaily(events,range.from,range.to), top_pages:rankPage(pageViews), event_counts:eventCounts(events), recent:events.slice(0,50),
    });
  } catch (error) { console.error(error); return jsonResponse({error:"Unexpected dashboard error."},500); }
});
