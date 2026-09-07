create or replace function public.record_experiment_vote_growth_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  vote_total bigint;
  option_label text;
begin
  select count(*) into vote_total from public.next_experiment_votes;
  option_label := case new.option_code
    when 'sell' then 'flip something'
    when 'digital' then 'build a tiny digital product'
    when 'hustle' then 'try a ridiculous internet hustle'
    else new.option_code
  end;

  if vote_total in (1, 10, 50, 100) then
    insert into public.growth_events (event_type, title, body)
    select
      'community_signal',
      case vote_total
        when 1 then 'The first signal landed.'
        else 'The experiment just hit ' || vote_total || ' votes.'
      end,
      case vote_total
        when 1 then 'Someone chose to shape the next €13 move. The experiment is officially being influenced by the public.'
        else 'The public is now actively steering what happens next. The latest vote backed: ' || option_label || '.'
      end
    where not exists (
      select 1 from public.growth_events
      where event_type = 'community_signal'
        and title = case vote_total
          when 1 then 'The first signal landed.'
          else 'The experiment just hit ' || vote_total || ' votes.'
        end
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_record_experiment_vote_growth_event on public.next_experiment_votes;
create trigger trg_record_experiment_vote_growth_event
after insert on public.next_experiment_votes
for each row execute function public.record_experiment_vote_growth_event();