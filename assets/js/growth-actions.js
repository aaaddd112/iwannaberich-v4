(()=>{
  "use strict";
  const URL_BASE="https://ofcdtwrgyxjrpoxuikxg.supabase.co",KEY="sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb=window.supabase?.createClient(URL_BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
  const $=id=>document.getElementById(id);
  async function shareGrowth(){
    const {data:{session}}=await sb.auth.getSession(); if(!session)return;
    const {data}=await sb.rpc("get_my_growth_link",{p_user_id:session.user.id});
    const code=data?.[0]?.code; if(!code)return;
    const url=`${location.origin}/?g=${encodeURIComponent(code)}`;
    const text="I found a ridiculous internet experiment. You should see this.";
    if(navigator.share){try{await navigator.share({title:"IWANNABERICH",text,url});return}catch{}}
    try{await navigator.clipboard.writeText(`${text} ${url}`);if($("growthActionMessage"))$("growthActionMessage").textContent="Link copied. Now send it to someone."}catch{}
  }
  function init(){
    $("growthActionShare")?.addEventListener("click",shareGrowth);
    $("growthActionAudience")?.addEventListener("click",()=>{$("growthActionMessage").textContent="Find a creator, community, newsletter or site where this experiment would genuinely fit. No spam."});
  }
  document.addEventListener("DOMContentLoaded",init,{once:true});
})();
