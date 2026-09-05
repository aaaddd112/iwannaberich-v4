(()=>{
'use strict';
const URL_BASE='https://ofcdtwrgyxjrpoxuikxg.supabase.co';
const KEY='sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
const sb=window.supabase?.createClient(URL_BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const list=document.getElementById('publicContributorList');
const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=v=>Number(v||0).toLocaleString();
function rank(x){if(x>=500000)return'Billionaire Material';if(x>=150000)return'Mogul';if(x>=50000)return'Investor';if(x>=15000)return'Associate';if(x>=5000)return'Agent';if(x>=1000)return'Experimenter';if(x>=250)return'Observer';return'Curious'}
function growthTarget(v){if(v<1)return[1,'First Signal'];if(v<5)return[5,'Networker'];if(v<25)return[25,'Amplifier'];if(v<100)return[100,'Internet Agent'];return[100,null]}
async function load(){
 if(!sb||!list)return;
 const [{data,error},{data:{session}}]=await Promise.all([
  sb.rpc('get_public_leaderboard',{p_limit:1000}),
  sb.auth.getSession()
 ]);
 if(error){list.innerHTML='<p class="muted">Leaderboard unavailable right now.</p>';return}
 if(!data?.length){list.innerHTML='<div class="leaderboard-empty"><strong>The leaderboard is waiting.</strong><span>Be one of the first contributors.</span><a class="btn primary" href="account.html">Join the experiment</a></div>';return}
 const rows=[...data].sort((a,b)=>Number(b.qualified_visitors||0)-Number(a.qualified_visitors||0)||Number(b.xp||0)-Number(a.xp||0));
 let me=null,mePosition=0;
 if(session?.user){
  const {data:mine}=await sb.rpc('get_my_participation');
  if(mine?.length){me=mine[0];mePosition=rows.findIndex(p=>String(p.contributor_number)===String(me.contributor_number))+1}
 }
 const topRows=rows.slice(0,25);
 list.innerHTML=topRows.map((p,i)=>{
  const visitors=Number(p.qualified_visitors||0),score=Number(p.xp||0),badge=Number(p.achievements||0),isMe=me&&String(p.contributor_number)===String(me.contributor_number);
  return `<article class="leaderboard-row${isMe?' is-you':''}><div class="leaderboard-position">${String(i+1).padStart(2,'0')}</div><div class="leaderboard-identity"><strong>#${esc(p.contributor_number)} ${esc(p.display_name||p.username)}</strong><span>@${esc(p.username)} · ${esc(p.rank||rank(score))}${isMe?' · YOU':''}</span></div><div class="leaderboard-growth"><strong>${fmt(visitors)}</strong><span>people brought</span></div><div class="leaderboard-score"><strong>${fmt(score)}</strong><span>score</span></div><div class="leaderboard-badges">${fmt(badge)} ${badge===1?'badge':'badges'}</div></article>`
 }).join('');
 const mineCard=document.getElementById('yourLeaderboardStatus');
 if(mineCard&&me){
  const visitors=Number(me.qualified_visitors||0),[target,targetName]=growthTarget(visitors),remaining=Math.max(0,target-visitors);
  mineCard.innerHTML=`<div class="your-status-head"><div><p class="label">YOUR POSITION</p><h2>${mePosition>0?`#${mePosition}`:'Outside the top 25'}</h2></div><span class="your-contributor-id">CONTRIBUTOR #${esc(me.contributor_number)}</span></div><div class="your-status-stats"><div><strong>${fmt(visitors)}</strong><span>people brought</span></div><div><strong>${remaining?fmt(remaining):'✓'}</strong><span>${remaining?`to reach ${esc(targetName)}`:'next target unlocked'}</span></div></div><button class="btn" id="shareLeaderboardStatus" type="button">Share my position</button>`;
  document.getElementById('shareLeaderboardStatus')?.addEventListener('click',async()=>{
   const text=mePosition>0?`I’m #${mePosition} on the IWANNABERICH Growth Leaderboard. I’m Contributor #${me.contributor_number} and I’ve brought ${visitors} ${visitors===1?'person':'people'} into the experiment. ${location.origin}/contributors.html`:`I’m Contributor #${me.contributor_number} in the IWANNABERICH Growth Leaderboard. I’ve brought ${visitors} ${visitors===1?'person':'people'} into the experiment. ${location.origin}/contributors.html`;
   if(navigator.share){try{await navigator.share({title:'IWANNABERICH Growth Leaderboard',text});return}catch(e){}}
   try{await navigator.clipboard.writeText(text);document.getElementById('leaderboardShareMessage').textContent='Share text copied.'}catch(e){document.getElementById('leaderboardShareMessage').textContent='Could not copy. Try sharing the page directly.'}
  });
 }else if(mineCard){
  mineCard.innerHTML='<p class="muted">Sign in to see your position and share your status.</p><a class="btn primary" href="account.html">Join the experiment</a>';
 }
}
document.addEventListener('DOMContentLoaded',load);
})();
