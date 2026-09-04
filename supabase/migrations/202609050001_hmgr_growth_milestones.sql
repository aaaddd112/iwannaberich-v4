-- Growth milestones: reward measurable traffic outcomes, never client-reported clicks.
insert into public.achievements(code,name,description,icon,xp_reward,active)
values
('growth_first','First Signal','Brought the first new person to the experiment.','↗',50,true),
('growth_networker','Networker','Brought 5 real visitors to the experiment.','◎',250,true),
('growth_amplifier','Amplifier','Brought 25 real visitors to the experiment.','✦',1000,true),
('growth_agent','Internet Agent','Brought 100 real visitors to the experiment.','◉',5000,true)
on conflict(code) do update set name=excluded.name,description=excluded.description,icon=excluded.icon,xp_reward=excluded.xp_reward,active=true;

create or replace function public.award_growth_achievements(p_user_id uuid)
returns integer language plpgsql security definer set search_path=public as $$
declare v_count integer:=0; v_visitors bigint; v_code text; v_threshold integer;
begin
 if p_user_id is null then return 0; end if;
 select count(*) into v_visitors from public.growth_attributions where contributor_user_id=p_user_id;
 for v_code,v_threshold in select * from (values ('growth_first',1),('growth_networker',5),('growth_amplifier',25),('growth_agent',100)) s(code,threshold) loop
   if v_visitors >= v_threshold and public.award_achievement_to_user(p_user_id,v_code,jsonb_build_object('qualified_visitors',v_visitors)) then v_count:=v_count+1; end if;
 end loop;
 return v_count;
end; $$;
revoke all on function public.award_growth_achievements(uuid) from public,anon,authenticated;
grant execute on function public.award_growth_achievements(uuid) to service_role;

create or replace function public.get_my_growth_stats(p_user_id uuid)
returns table(qualified_visitors bigint,next_target integer,next_target_name text,progress_percent integer)
language sql stable security definer set search_path=public as $$
with c as (select count(*)::bigint visitors from public.growth_attributions where contributor_user_id=p_user_id and p_user_id=auth.uid()),
t as (select case when visitors<1 then 1 when visitors<5 then 5 when visitors<25 then 25 when visitors<100 then 100 else 0 end target from c)
select c.visitors,t.target,case t.target when 1 then 'First Signal' when 5 then 'Networker' when 25 then 'Amplifier' when 100 then 'Internet Agent' else 'Growth Legend' end,
case when t.target=0 then 100 else least(100,round((c.visitors::numeric/t.target)*100)::integer) end from c cross join t;
$$;
revoke all on function public.get_my_growth_stats(uuid) from public,anon;
grant execute on function public.get_my_growth_stats(uuid) to authenticated,service_role;

create or replace function public.attribute_growth_page_view()
returns trigger language plpgsql security definer set search_path=public as $$
declare v_code text; v_visitor text; v_user uuid;
begin
 if new.event_name <> 'page_view' then return new; end if;
 v_code:=nullif(left(coalesce(new.metadata->>'growth_code',''),80),'');
 v_visitor:=nullif(left(coalesce(new.metadata->>'visitor_id',''),120),'');
 if v_code is null or v_visitor is null then return new; end if;
 select user_id into v_user from public.growth_links where code=v_code and active=true limit 1;
 if v_user is null then return new; end if;
 insert into public.growth_attributions(growth_code,contributor_user_id,visitor_id,source_event_id)
 values(v_code,v_user,v_visitor,new.id) on conflict(growth_code,visitor_id) do nothing;
 if found then
   insert into public.xp_transactions(user_id,amount,reason,source_type,source_id,metadata)
   values(v_user,100,'Qualified visitor brought to the experiment','growth_qualified_visit',new.id,jsonb_build_object('growth_code',v_code,'visitor_id',v_visitor));
   perform public.award_growth_achievements(v_user);
 end if;
 return new;
end; $$;
revoke all on function public.attribute_growth_page_view() from public,anon,authenticated;
grant execute on function public.attribute_growth_page_view() to service_role;
