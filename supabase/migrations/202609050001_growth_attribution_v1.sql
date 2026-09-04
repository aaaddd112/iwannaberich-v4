create table if not exists public.growth_links (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.growth_links enable row level security;
revoke all on public.growth_links from anon, authenticated;

do $$
declare r record;
begin
  for r in select id from public.profiles loop
    insert into public.growth_links(user_id,code)
    values(r.id, lower(encode(gen_random_bytes(9),'hex')))
    on conflict (user_id) do nothing;
  end loop;
end $$;

create index if not exists growth_links_code_idx on public.growth_links(code);

create or replace function public.get_my_growth_link(p_user_id uuid)
returns table(code text, active boolean)
language sql stable security definer set search_path=public
as $$
  select gl.code, gl.active
  from public.growth_links gl
  where gl.user_id = p_user_id
    and p_user_id = auth.uid()
  limit 1
$$;

revoke all on function public.get_my_growth_link(uuid) from public, anon;
grant execute on function public.get_my_growth_link(uuid) to authenticated, service_role;

create table if not exists public.growth_attributions (
  id uuid primary key default gen_random_uuid(),
  growth_code text not null references public.growth_links(code) on delete cascade,
  contributor_user_id uuid not null references auth.users(id) on delete cascade,
  visitor_id text not null,
  first_seen_at timestamptz not null default now(),
  source_event_id uuid not null unique references public.analytics_events(id) on delete cascade
);

alter table public.growth_attributions enable row level security;
revoke all on public.growth_attributions from anon, authenticated;
create index if not exists growth_attr_contributor_idx on public.growth_attributions(contributor_user_id, first_seen_at desc);
create unique index if not exists growth_attr_code_visitor_idx on public.growth_attributions(growth_code, visitor_id);

create or replace function public.attribute_growth_page_view()
returns trigger
language plpgsql
security definer set search_path=public
as $$
declare
  v_code text;
  v_visitor text;
  v_user uuid;
begin
  if new.event_name <> 'page_view' then return new; end if;
  v_code := nullif(left(coalesce(new.metadata->>'growth_code',''),80),'');
  v_visitor := nullif(left(coalesce(new.metadata->>'visitor_id',''),120),'');
  if v_code is null or v_visitor is null then return new; end if;

  select user_id into v_user
  from public.growth_links
  where code = v_code and active = true
  limit 1;

  if v_user is null then return new; end if;

  insert into public.growth_attributions(growth_code,contributor_user_id,visitor_id,source_event_id)
  values(v_code,v_user,v_visitor,new.id)
  on conflict (growth_code,visitor_id) do nothing;

  if found then
    insert into public.xp_transactions(user_id,amount,reason,source_type,source_id,metadata)
    values(v_user,100,'Qualified visitor brought to the experiment','growth_qualified_visit',new.id,jsonb_build_object('growth_code',v_code,'visitor_id',v_visitor));
  end if;
  return new;
end;
$$;

revoke all on function public.attribute_growth_page_view() from public, anon, authenticated;
grant execute on function public.attribute_growth_page_view() to service_role;

drop trigger if exists trg_attribute_growth_page_view on public.analytics_events;
create trigger trg_attribute_growth_page_view
after insert on public.analytics_events
for each row execute function public.attribute_growth_page_view();
