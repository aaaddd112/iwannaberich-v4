(()=>{
  "use strict";
  const URL_BASE="https://ofcdtwrgyxjrpoxuikxg.supabase.co",KEY="sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb=window.supabase?.createClient(URL_BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true}}),$=id=>document.getElementById(id);
  async function run(){
    if(!sb||!$("growthLink"))return;
    const {data:{session}}=await sb.auth.getSession();if(!session)return;
    const [{data:link,error:le},{data:stats,error:se}]=await Promise.all([sb.rpc("get_my_growth_link",{p_user_id:session.user.id}),sb.rpc("get_my_growth_stats",{p_user_id:session.user.id})]);
    const row=link?.[0],s=stats?.[0];if(le||!row?.code||row.active===false)return;
    const url=`${window.location.origin}/?g=${encodeURIComponent(row.code)}`;$('growthLink').textContent=url;
    if(s){
      const visitors=Number(s.qualified_visitors||0),target=Number(s.next_target||0),pct=Math.max(0,Math.min(100,Number(s.progress_percent||0)));
      if($("growthVisitors"))$("growthVisitors").textContent=visitors.toLocaleString();
      if($("growthTarget"))$("growthTarget").textContent=target?`${target} people`:"100+ people";
      if($("growthTargetName"))$("growthTargetName").textContent=s.next_target_name||"Growth Legend";
      if($("growthProgressFill"))$("growthProgressFill").style.width=`${pct}%`;
      if($("growthProgressLabel"))$("growthProgressLabel").textContent=target?`${pct}% to ${s.next_target_name}`:"Milestones complete";
    }
    $("copyGrowthLink")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(url);if($("growthMessage"))$("growthMessage").textContent="Copied."}catch{if($("growthMessage"))$("growthMessage").textContent=url}});
    $("shareGrowthLink")?.addEventListener("click",async()=>{if(navigator.share){try{await navigator.share({title:"IWANNABERICH",text:"I found a ridiculous internet experiment. You should see this.",url});return}catch{}}try{await navigator.clipboard.writeText(url);if($("growthMessage"))$("growthMessage").textContent="Copied. Share it anywhere."}catch{if($("growthMessage"))$("growthMessage").textContent=url}});
  }
  document.addEventListener("DOMContentLoaded",run,{once:true});
})();
