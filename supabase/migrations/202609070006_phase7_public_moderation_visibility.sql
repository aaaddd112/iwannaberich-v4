drop policy if exists "Public can read comments" on public.predictions_comments;
create policy "Public can read visible comments" on public.predictions_comments for select to anon, authenticated using (moderation_status='visible');
