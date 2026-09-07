create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_created_at_idx on public.analytics_events (event_name, created_at desc);
