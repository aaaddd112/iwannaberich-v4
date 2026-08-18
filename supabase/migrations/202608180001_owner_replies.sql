-- IWANNABERICH OWNER REPLIES / AUTH
-- Run once in Supabase SQL Editor.

alter table public.predictions_comments
  add column if not exists parent_id uuid references public.predictions_comments(id) on delete cascade,
  add column if not exists author_id uuid references auth.users(id) on delete set null,
  add column if not exists author_type text not null default 'visitor';

alter table public.predictions_comments
  drop constraint if exists predictions_comments_author_type_check;

alter table public.predictions_comments
  add constraint predictions_comments_author_type_check
  check (author_type in ('visitor', 'owner'));

create index if not exists predictions_comments_parent_id_idx
  on public.predictions_comments(parent_id);

create index if not exists predictions_comments_created_at_idx
  on public.predictions_comments(created_at desc);

-- Public reads remain allowed. Inserts should go through the Edge Function,
-- so direct public inserts are removed.
drop policy if exists "Public can add comments" on public.predictions_comments;

-- Keep the table readable by anonymous visitors.
drop policy if exists "Public can read comments" on public.predictions_comments;
create policy "Public can read comments"
on public.predictions_comments for select
to anon, authenticated
using (true);
