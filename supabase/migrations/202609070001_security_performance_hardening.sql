-- IWANNABERICH — security/performance hardening
-- Keep authenticated RLS auth.uid() calls init-plan friendly and add
-- covering indexes for frequently joined foreign keys.

-- Avoid per-row auth.uid() evaluation in RLS policies.
drop policy if exists "contributor_identity_read_own" on public.contributor_identities;
create policy "contributor_identity_read_own"
on public.contributor_identities
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "users can read own contributions" on public.contributions;
create policy "users can read own contributions"
on public.contributions
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users can read own contribution events" on public.contribution_events;
create policy "users can read own contribution events"
on public.contribution_events
for select
to authenticated
using (exists (
  select 1
  from public.contributions c
  where c.id = contribution_events.contribution_id
    and c.user_id = (select auth.uid())
));

-- Remove the exact duplicate unique index while preserving the uniqueness constraint.
drop index if exists public.growth_submissions_user_url_idx;

-- Add covering indexes for foreign-key columns used in joins/deletes.
create index if not exists admin_users_created_by_idx
  on public.admin_users(created_by);
create index if not exists growth_events_user_id_idx
  on public.growth_events(user_id);
create index if not exists growth_submissions_reviewer_id_idx
  on public.growth_submissions(reviewer_id);
create index if not exists mission_events_attempt_id_idx
  on public.mission_events(attempt_id);
create index if not exists predictions_comments_author_id_idx
  on public.predictions_comments(author_id);
create index if not exists referrals_referral_code_id_idx
  on public.referrals(referral_code_id);
create index if not exists user_achievements_achievement_id_idx
  on public.user_achievements(achievement_id);
