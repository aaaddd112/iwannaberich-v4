(()=>{
'use strict';
const U='https://ofcdtwrgyxjrpoxuikxg.supabase.co',K='sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
const sb=window.supabase?.createClient(U,K,{auth:{persistSession:true,autoRefreshToken:true}});
const list=document.getElementById('publicContributorList');
const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=v=>Number(v||0).toLocaleString();
const growthTarget=v=>v<1?[1,'First Signal']:v<5?[5,'Networker']:v<25?[25,'Amplifier']:v<100?[100,'Internet Agent']:[100,null];
const rankCode=r=>({Curious:'curious',Observer:'observer',Experimenter:'experimenter',Agent:'agent',Associate:'associate',Investor:'investor',Mogul:'mogul','Billionaire Material':'billionaire_material',OWNER:'owner'}[r]||'member');
const badge=r=>`<span class="leaderboard-rank-badge${r==='OWNER'?' owner':''}"><svg aria-hidden="true"><use href="assets/badges/badge-sprite.svg#${rankCode(r)}"></use></svg><span>${esc(r)}</span></span>`;
const style=()=>{
  if(document.getElementById('phase8-10-css'))return;
  const l=document.createElement('link');l.id='phase8-10-css';l.rel='stylesheet';l.href='assets/css/phase8-10.css?v=1.0.0';document.head.appendChild(l);
  if(document.getElementById('leaderboard-badge-css'))return;
  const b=document.createElement('style');b.id='leaderboard-badge-css';b.textContent='.leaderboard-rank-badge{display:inline-flex;align-items:center;gap:4px;margin-left:4px;vertical-align:middle}.leaderboard-rank-badge svg{width:17px;height:17px}.leaderboard-rank-badge.owner{color:#f0d98a}.leaderboard-rank-badge.owner svg{width:19px;height:19px}';document.head.appendChild(b);
};
async function load(){
 style();if(!sb||!list)return;
 const mineCard=document.getElementById('yourLeaderboardStatus'),note=document.querySelector('.contributors-note');
 if(note)note.textContent='Rankings are based on qualified participants attributed to contributor growth links. Contribution Score and achievements are shown as additional status.';
 const [{data,error},{data:{session}}]=await Promise.all([sb.rpc('get_public_leaderboard',{p_limit:1000}),sb.auth.getSession()]);
 if(error){list.innerHTML='<p class="muted">Leaderboard unavailable right now.</p>';return}
 const rows=Array.isArray(data)?[...data].sort((a,b)=>Number(b.qualified_visitors||0)-Number(a.qualified_visitors||0)||Number(b.xp||0)-Number(a.xp||0)):[];
 let me=null,mePosition=0;
 if(session?.user){const {data:mine}=await sb.rpc('get_my_participation');if(mine?.length){me=mine[0];mePosition=rows.findIndex(p=>String(p.contributor_number)===String(me.contributor_number))+1}}
 list.innerHTML=rows.length?rows.slice(0,25).map((p,i)=>{
  const visitors=Number(p.qualified_visitors||0),score=Number(p.xp||0),badgeCount=Number(p.achievements||0),isMe=me&&String(p.contributor_number)===String(me.contributor_number),user=encodeURIComponent(p.username||''),rank=String(p.rank||'Curious');
  return `<article class="leaderboard-row${isMe?' is-you':''}"><div class="leaderboard-position">${String(i+1).padStart(2,'0')}</div><div class="leaderboard-identity"><strong><a class="leaderboard-profile-link" href="member.html?u=${user}">#${esc(p.contributor_number)} ${esc(p.display_name||p.username)}</a></strong><span>@${esc(p.username)} · ${badge(rank)}${isMe?' · YOU':''}</span></div><div class="leaderboard-growth"><strong>${fmt(visitors)}</strong><span>qualified participants</span></div><div class="leaderboard-score"><strong>${fmt(score)}</strong><span>score</span></div><div class="leaderboard-badges">${fmt(badgeCount)} ${badgeCount===1?'badge':'badges'}</div></article>`;
 }).join(''):'<div class="leaderboard-empty"><strong>The leaderboard is waiting.</strong><span>Be one of the first contributors.</span><a class="btn primary" href="account.html">Join the experiment</a></div>';
 if(mineCard&&me){
  const visitors=Number(me.qualified_visitors||0),[target,targetName]=growthTarget(visitors),remaining=Math.max(0,target-visitors);
  mineCard.innerHTML=`<div class="your-status-head"><div><p class="label">YOUR POSITION</p><h2>${mePosition>0?`#${mePosition}`:'Outside the top 25'}</h2></div><span class="your-contributor-id">CONTRIBUTOR #${esc(me.contributor_number)}</span></div><div class="your-status-stats"><div><strong>${fmt(visitors)}</strong><span>qualified participants</span></div><div><strong>${remaining?fmt(remaining):'✓'}</strong><span>${remaining?`to reach ${esc(targetName)}`:'next target unlocked'}</span></div></div><a class="btn" href="member.html?u=${encodeURIComponent(me.username)}">View my public profile</a><div class="growth-share-box"><p class="label">YOUR GROWTH LINK</p><p class="muted">Send this link to people who would actually join the experiment. Qualified participation is what moves your ranking.</p><div class="growth-share-row"><input id="growthLink" readonly aria-label="Your growth link"><button class="btn" id="copyGrowthLink" type="button">Copy link</button><button class="btn primary" id="shareGrowthLink" type="button">Share</button></div><p id="growthShareStatus" class="muted" aria-live="polite"></p></div>`;
  const input=document.getElementById('growthLink'),copy=document.getElementById('copyGrowthLink'),share=document.getElementById('shareGrowthLink'),status=document.getElementById('growthShareStatus');
  const {data:link}=await sb.rpc('get_my_growth_link');
  if(link?.[0]?.url){input.value=link[0].url;copy.onclick=async()=>{try{await navigator.clipboard.writeText(input.value);status.textContent='Growth link copied.';window.IWBRAnalytics?.trackEvent('growth_link_copy',{})}catch{status.textContent='Copy failed. Select the link manually.'}};share.onclick=async()=>{const payload={title:'IWANNABERICH',text:'I am testing something absurd in public. Come see it.',url:input.value};try{if(navigator.share){await navigator.share(payload);status.textContent='Shared.'}else{await navigator.clipboard.writeText(input.value);status.textContent='No native share available, link copied instead.'}window.IWBRAnalytics?.trackEvent('growth_link_share',{})}catch(e){if(e.name!=='AbortError')status.textContent='Share failed.'}}}
 }else if(mineCard)mineCard.innerHTML=session?.user?'<p class="muted">Finish your contributor profile to receive a position and public profile.</p><a class="btn primary" href="account.html">Finish my profile</a>':'<p class="muted">Sign in to see your position and public profile.</p><a class="btn primary" href="account.html">Join the experiment</a>';
}
document.addEventListener('DOMContentLoaded',load);
})();