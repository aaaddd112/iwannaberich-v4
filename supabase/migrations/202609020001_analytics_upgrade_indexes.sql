-- IWANNABERICH — analytics dashboard performance indexes
-- Supports date/range and audience filtering in the private analytics dashboard.

create index if not exists analytics_events_page_created_at_idx
  on public.analytics_events (page, created_at desc);

create index if not exists analytics_events_visitor_id_idx
  on public.analytics_events ((metadata->>'visitor_id'), created_at desc);

create index if not exists analytics_events_source_created_at_idx
  on public.analytics_events ((metadata->>'last_touch_source'), created_at desc);

create index if not exists analytics_events_country_created_at_idx
  on public.analytics_events ((metadata->>'country'), created_at desc);

create index if not exists analytics_events_device_created_at_idx
  on public.analytics_events ((metadata->>'device_type'), created_at desc);

create index if not exists analytics_events_browser_created_at_idx
  on public.analytics_events ((metadata->>'browser'), created_at desc);

create index if not exists analytics_events_os_created_at_idx
  on public.analytics_events ((metadata->>'os'), created_at desc);

create index if not exists analytics_events_utm_source_created_at_idx
  on public.analytics_events ((metadata->>'utm_source'), created_at desc);

create index if not exists analytics_events_utm_medium_created_at_idx
  on public.analytics_events ((metadata->>'utm_medium'), created_at desc);

create index if not exists analytics_events_utm_campaign_created_at_idx
  on public.analytics_events ((metadata->>'utm_campaign'), created_at desc);
