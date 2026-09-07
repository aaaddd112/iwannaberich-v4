revoke execute on function public.owner_delete_community_thread(uuid) from anon;
revoke execute on function public.owner_delete_community_reply(uuid) from anon;
revoke execute on function public.owner_hide_prediction_comment(uuid) from anon;

revoke execute on function public.manage_contribution(uuid, text, text, text, integer) from anon;
revoke execute on function public.review_growth_submission(uuid, text, text) from anon;
