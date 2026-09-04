-- HELP ME GET RICH — V1.0 Account Foundation
-- Safe additive migration: creates only new tables and policies.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  display_name text,
  avatar_path text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) between 3 and 24),
  constraint profiles_username_format check (username ~ '^[a-z0-9_-]+$')
);

create unique index profiles_username_lower_unique
  on public.profiles (lower(username));

create table public.user_private (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  constraint admin_users_role_check check (role in ('owner', 'admin', 'moderator'))
);

create table public.reserved_usernames (
  username text primary key,
  reason text,
  created_at timestamptz not null default now(),
  constraint reserved_usernames_format check (username ~ '^[a-z0-9_-]+$')
);

insert into public.reserved_usernames (username, reason) values
  ('admin', 'system role'),
  ('administrator', 'system role'),
  ('moderator', 'system role'),
  ('support', 'system role'),
  ('official', 'reserved brand identity'),
  ('iwannaberich', 'reserved brand identity'),
  ('helpmegetrich', 'reserved product identity')
on conflict (username) do nothing;

alter table public.profiles enable row level security;
alter table public.user_private enable row level security;
alter table public.admin_users enable row level security;
alter table public.reserved_usernames enable row level security;

create policy "Public can read public profiles"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

create policy "Users can update own public profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can read own private data"
  on public.user_private
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Public can read reserved usernames"
  on public.reserved_usernames
  for select
  to anon, authenticated
  using (true);

revoke all on table public.user_private from anon, authenticated;
revoke all on table public.admin_users from anon, authenticated;

-- Re-grant only the private table SELECT needed by its RLS policy.
grant select on table public.user_private to authenticated;

-- No INSERT/UPDATE/DELETE grants are given to anon/authenticated for admin_users.
-- profiles INSERT will be performed by the controlled server-side profile flow.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
grant execute on function public.set_updated_at() to service_role;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_private_set_updated_at
before update on public.user_private
for each row execute function public.set_updated_at();
