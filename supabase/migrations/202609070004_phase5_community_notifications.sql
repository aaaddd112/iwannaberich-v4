create or replace function public.notify_parent_on_community_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_author uuid;
begin
  if new.parent_id is null or new.author_id is null then
    return new;
  end if;

  select pc.author_id into v_parent_author
  from public.predictions_comments pc
  where pc.id = new.parent_id;

  if v_parent_author is null or v_parent_author = new.author_id then
    return new;
  end if;

  insert into public.notifications(user_id, type, title, body, data)
  values (
    v_parent_author,
    'community_reply',
    'Someone replied to your take',
    left(coalesce(nullif(trim(new.nickname), ''), 'A contributor') || ': ' || trim(new.comment), 220),
    jsonb_build_object(
      'comment_id', new.id,
      'parent_id', new.parent_id,
      'author_type', new.author_type,
      'nickname', coalesce(new.nickname, 'A contributor')
    )
  )
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists trg_notify_parent_on_community_reply on public.predictions_comments;
create trigger trg_notify_parent_on_community_reply
after insert on public.predictions_comments
for each row execute function public.notify_parent_on_community_reply();

create unique index if not exists notifications_community_reply_dedupe_idx
on public.notifications (user_id, type, ((data->>'comment_id')))
where type = 'community_reply' and data ? 'comment_id';

revoke all on function public.notify_parent_on_community_reply() from public;
