-- Phase 8-10 production schema: community reputation, daily streaks, public trust, and growth link RPC.
-- Applied to production as phase8_9_10_reputation_retention_growth and phase10_growth_share_rpc.
-- This file is the repository source of truth for the schema introduced by those phases.

create table if not exists public.community_reputation (user_id uuid primary key references auth.users(id) on delete cascade, trust_score integer not null default 100 check (trust_score between 0 and 100), moderation_strikes integer not null default 0, community_posts integer not null default 0, helpful_reactions integer not null default 0, last_activity_at timestamptz, updated_at timestamptz not null default now());
create table if not exists public.community_reputation_events (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, event_type text not null, points integer not null, source_id uuid, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create unique index if not exists community_reputation_event_once_idx on public.community_reputation_events(user_id,event_type,source_id) where source_id is not null;
create index if not exists community_reputation_events_user_created_idx on public.community_reputation_events(user_id,created_at desc);
create table if not exists public.user_streaks (user_id uuid primary key references auth.users(id) on delete cascade,current_streak integer not null default 0,best_streak integer not null default 0,last_checkin_date date,updated_at timestamptz not null default now());
alter table public.community_reputation enable row level security; alter table public.community_reputation_events enable row level security; alter table public.user_streaks enable row level security;
revoke all on public.community_reputation from anon,authenticated; revoke all on public.community_reputation_events from anon,authenticated; revoke all on public.user_streaks from anon,authenticated;
-- Function bodies are maintained in the production migration history under phase8_9_10_reputation_retention_growth.
