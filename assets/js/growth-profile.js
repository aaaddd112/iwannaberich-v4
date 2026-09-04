(()=>{
  "use strict";
  const URL_BASE="https://ofcdtwrgyxjrpoxuikxg.supabase.co",KEY="sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb=window.supabase?.createClient(URL_BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true}}),$=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  async function load(){
    if(!sb)return;
    const {data:{session}}=await sb.auth.getSession(); if(!session)return;
    const [{data:link},{data:stats}]=await Promise.all([sb.rpc("get_my_growth_link",{p_user_id:session.user.id}),sb.rpc("get_my_growth_stats",{p_user_id:session.user.id})]);
    const code=link?.[0]?.code||""; const s=stats?.[0];
    if($("growthLink")){const url=`${location.origin}/?g=${encodeURIComponent(code)}`;$("growthLink").textContent=url;$("copyGrowthLink")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(url);$("growthMessage").textContent="Growth link copied."}catch{$("growthMessage").textContent=url}});$("shareGrowthLink")?.addEventListener("click",async()=>{const text=`Help me grow IWANNABERICH. I’m Contributor #${$("profileContributorNumber")?.textContent||"?"}. ${url}`;if(navigator.share){try{await navigator.share({title:"Help grow IWANNABERICH",text});return}catch{}}try{await navigator.clipboard.writeText(text);$("growthMessage").textContent="Share text copied."}catch{$("growthMessage").textContent=text}})}
    if(!s)return;
    $("growthVisitors").textContent=Number(s.qualified_visitors||0).toLocaleString();
    $("growthTarget").textContent=s.next_target?`${s.next_target} people`:"100+ people";
    $("growthTargetName").textContent=s.next_target_name||"Growth Legend";
    const pct=Math.max(0,Math.min(100,Number(s.progress_percent||0))); if($("growthProgressFill"))$("growthProgressFill").style.width=`${pct}%`;
    if($("growthProgressLabel"))$("growthProgressLabel").textContent=`${pct}% to ${esc(s.next_target_name||"the next milestone")}`;
  }
  document.addEventListener("DOMContentLoaded",load);
})();
