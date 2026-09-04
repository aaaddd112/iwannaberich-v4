-- HELP ME GET RICH — V1.2 XP ledger and atomic automatic mission completion.

create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null,
  source_type text not null,
  source_id uuid,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint xp_transactions_amount_nonzero check (amount <> 0)
);

create index xp_transactions_user_created_idx
  on public.xp_transactions(user_id, created_at desc);

create unique index xp_transactions_source_unique
  on public.xp_transactions(user_id, source_type, source_id)
  where source_id is not null;

alter table public.xp_transactions enable row level security;
revoke all on table public.xp_transactions from anon, authenticated;

create or replace function public.complete_automatic_mission(p_attempt_id uuid)
returns table (
  attempt public.mission_attempts,
  xp_awarded integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_attempt public.mission_attempts;
  v_mission public.missions;
  v_existing public.xp_transactions;
  v_reward integer;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'unauthorized';
  end if;

  select * into v_attempt
  from public.mission_attempts
  where id = p_attempt_id and user_id = v_user_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'attempt_not_found';
  end if;

  select * into v_mission
  from public.missions
  where id = v_attempt.mission_id and active = true
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'mission_not_found';
  end if;

  if v_mission.verification_type <> 'automatic' then
    raise exception using errcode = '22023', message = 'automatic_verification_required';
  end if;

  if v_attempt.status = 'completed' then
    select * into v_existing
    from public.xp_transactions
    where user_id = v_user_id
      and source_type = 'mission_completion'
      and source_id = v_attempt.id
    limit 1;

    return query select v_attempt, coalesce(v_existing.amount, 0);
    return;
  end if;

  if v_attempt.status not in ('started','submitted') then
    raise exception using errcode = '22023', message = 'attempt_not_completable';
  end if;

  v_reward := v_mission.reward_xp;

  update public.mission_attempts
  set status = 'completed', completed_at = now(), updated_at = now()
  where id = v_attempt.id
  returning * into v_attempt;

  if v_reward > 0 then
    insert into public.xp_transactions (
      user_id, amount, reason, source_type, source_id, metadata
    ) values (
      v_user_id,
      v_reward,
      'Mission completed: ' || v_mission.code,
      'mission_completion',
      v_attempt.id,
      jsonb_build_object('mission_id', v_mission.id, 'mission_code', v_mission.code)
    )
    on conflict (user_id, source_type, source_id) do nothing;
  end if;

  return query select v_attempt, v_reward;
end;
$$;

revoke all on function public.complete_automatic_mission(uuid) from public, anon;
grant execute on function public.complete_automatic_mission(uuid) to authenticated;
