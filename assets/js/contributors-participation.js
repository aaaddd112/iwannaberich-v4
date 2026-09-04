(()=>{
'use strict';
const URL_BASE='https://ofcdtwrgyxjrpoxuikxg.supabase.co';
const KEY='sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
const sb=window.supabase?.createClient(URL_BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const list=document.getElementById('publicContributorList');
const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=v=>Number(v||0).toLocaleString();
function rank(x){if(x>=500000)return'Billionaire Material';if(x>=150000)return'Mogul';if(x>=50000)return'Investor';if(x>=15000)return'Associate';if(x>=5000)return'Agent';if(x>=1000)return'Experimenter';if(x>=250)return'Observer';return'Curious'}
async function load(){if(!sb||!list)return;const {data,error}=await sb.rpc('get_public_leaderboard',{p_limit:25});if(error){list.innerHTML='<p class="muted">Leaderboard unavailable right now.</p>';return}if(!data?.length){list.innerHTML='<div class="leaderboard-empty"><strong>The leaderboard is waiting.</strong><span>Be one of the first contributors.</span><a class="btn primary" href="account.html">Join the experiment</a></div>';return}list.innerHTML=data.map((p,i)=>`<article class="leaderboard-row"><div class="leaderboard-position">${String(i+1).padStart(2,'0')}</div><div class="leaderboard-identity"><strong>#${esc(p.contributor_number)} ${esc(p.display_name||p.username)}</strong><span>@${esc(p.username)} · ${esc(p.rank||rank(Number(p.xp)))}</span></div><div class="leaderboard-score"><strong>${fmt(p.xp)}</strong><span>score</span></div><div class="leaderboard-badges">${fmt(p.achievements)} ${Number(p.achievements)===1?'badge':'badges'}</div></article>`).join('')}
document.addEventListener('DOMContentLoaded',load);
})();