(() => {
  "use strict";
  const URL_BASE = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb = window.supabase?.createClient(URL_BASE, KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  function rank(xp){ if(xp>=500000)return "Billionaire Material"; if(xp>=150000)return "Mogul"; if(xp>=50000)return "Investor"; if(xp>=15000)return "Associate"; if(xp>=5000)return "Agent"; if(xp>=1000)return "Experimenter"; if(xp>=250)return "Observer"; return "Curious"; }
  async function load(){
    if(!sb){location.href="account.html";return;}
    const {data:{session}}=await sb.auth.getSession(); if(!session){location.href="account.html";return;}
    const {data,error}=await sb.rpc("get_my_participation");
    if(error||!data?.length){location.href="account.html";return;}
    const p=data[0]; const name=p.display_name||p.username;
    $("profileName").textContent=name; $("profileHandle").textContent=`@${p.username}`;
    $("profileRank").textContent=p.rank||rank(Number(p.xp)); $("profileXp").textContent=Number(p.xp||0).toLocaleString();
    $("profileReferrals").textContent=Number(p.referral_count||0).toLocaleString(); $("profileAchievements").textContent=Number(p.achievement_count||0).toLocaleString();
    const link=`${location.origin}/account.html?ref=${encodeURIComponent(p.referral_code)}`; $("referralLink").textContent=link;
    const shareText=`I’m Contributor @${p.username} in IWANNABERICH. I was here early. See where this goes: ${link}`;
    $("copyReferral")?.addEventListener("click",async()=>{await navigator.clipboard.writeText(link);$("shareMessage").textContent="Referral link copied.";});
    $("shareReferral")?.addEventListener("click",async()=>share(shareText,"Share my referral link"));
    $("shareMoment")?.addEventListener("click",async()=>share(`I’m Contributor @${p.username} in IWANNABERICH. I was here early. Currently at €13. ${link}`,"Share my status"));
  }
  async function share(text,title){ if(navigator.share){try{await navigator.share({title,text});return;}catch(e){}} await navigator.clipboard.writeText(text); $("shareMessage").textContent="Share text copied."; }
  $("signOut")?.addEventListener("click",async()=>{await sb.signOut();location.href="account.html";});
  document.addEventListener("DOMContentLoaded",load);
})();
