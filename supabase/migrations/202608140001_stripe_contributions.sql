-- IWANNABERICH — Stripe-backed public wealth
-- Run once in Supabase SQL Editor.

create table if not exists public.stripe_contributions (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text unique,
  stripe_payment_link_id text,
  stripe_event_id text not null unique,
  amount_cents bigint not null check (amount_cents > 0),
  refunded_cents bigint not null default 0 check (refunded_cents >= 0 and refunded_cents <= amount_cents),
  currency text not null check (currency = 'eur'),
  status text not null default 'paid' check (status in ('paid', 'refunded', 'partially_refunded')),
  paid_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stripe_contributions enable row level security;

-- The public website reads the total through the RPC below; it does not need
-- direct access to individual payment rows.
revoke all on public.stripe_contributions from anon, authenticated;

create or replace function public.get_current_wealth()
returns numeric
language sql
security definer
set search_path = public
as $$
  select coalesce(
    round(sum((amount_cents - refunded_cents)::numeric) / 100, 2),
    0
  )
  from public.stripe_contributions
  where currency = 'eur';
$$;

grant execute on function public.get_current_wealth() to anon, authenticated;

-- Used by the Edge Function to insert/update payment rows. The function runs
-- with Supabase's secret/service key and does not rely on public table writes.
create or replace function public.record_stripe_contribution(
  p_checkout_session_id text,
  p_payment_intent_id text,
  p_payment_link_id text,
  p_event_id text,
  p_amount_cents bigint,
  p_currency text,
  p_paid_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_currency <> 'eur' then
    raise exception 'Unsupported currency: %', p_currency;
  end if;

  insert into public.stripe_contributions (
    stripe_checkout_session_id,
    stripe_payment_intent_id,
    stripe_payment_link_id,
    stripe_event_id,
    amount_cents,
    currency,
    status,
    paid_at,
    updated_at
  ) values (
    p_checkout_session_id,
    p_payment_intent_id,
    p_payment_link_id,
    p_event_id,
    p_amount_cents,
    lower(p_currency),
    'paid',
    p_paid_at,
    now()
  )
  on conflict (stripe_checkout_session_id) do nothing;
end;
$$;

create or replace function public.apply_stripe_refund(
  p_payment_intent_id text,
  p_refunded_cents bigint,
  p_event_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only increase the recorded refund. This makes repeated webhook delivery
  -- idempotent and prevents a refund from being subtracted twice.
  update public.stripe_contributions
  set refunded_cents = least(greatest(p_refunded_cents, 0), amount_cents),
      status = case
        when least(greatest(p_refunded_cents, 0), amount_cents) >= amount_cents then 'refunded'
        when least(greatest(p_refunded_cents, 0), amount_cents) > 0 then 'partially_refunded'
        else 'paid'
      end,
      updated_at = now()
  where stripe_payment_intent_id = p_payment_intent_id;
end;
$$;

-- No direct execution for the public client. These are called by the
-- server-side Edge Function using the secret key.
revoke execute on function public.record_stripe_contribution(text, text, text, text, bigint, text, timestamptz) from public, anon, authenticated;
revoke execute on function public.apply_stripe_refund(text, bigint, text) from public, anon, authenticated;
