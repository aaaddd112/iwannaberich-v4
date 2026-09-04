(()=>{
  'use strict';
  const URL_BASE='https://ofcdtwrgyxjrpoxuikxg.supabase.co';
  const KEY='sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
  const sb=window.supabase?.createClient(URL_BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
  const addNav=()=>{
    const nav=document.querySelector('.links'); if(!nav||nav.querySelector('[data-participation-nav]'))return;
    const a=document.createElement('a'); a.href='account.html'; a.textContent='Join the experiment'; a.className='participation-home-nav'; a.dataset.participationNav='1';
    const about=nav.querySelector('a[href="about.html"]'); if(about)about.before(a); else nav.appendChild(a);
  };
  const addCard=()=>{
    const mission=document.querySelector('#mission'); if(!mission||document.querySelector('#participationHome'))return;
    const section=document.createElement('section'); section.id='participationHome'; section.className='wrap reveal participation-home'; section.setAttribute('aria-labelledby','participationHomeTitle');
    section.innerHTML=`<div class="card participation-home-card"><div><p class="eyebrow">JOIN THE EXPERIMENT</p><h3 id="participationHomeTitle">Don't just watch it happen.</h3><p>Become a contributor. Get your Contributor ID, build Contribution Score, bring people into the experiment, vote on what happens next, and leave your mark on the journey to €1B.</p><div class="participation-home-actions"><a class="btn primary" href="account.html" id="participationHomeCta">Become a contributor</a><a class="btn" href="contributors.html">See contributors</a></div></div><div class="participation-home-stat"><span class="label">YOUR STATUS</span><div class="participation-home-score" id="participationHomeScore">Not joined</div><div class="participation-home-status" id="participationHomeStatus">Join now and get your Contributor ID.</div></div></div>`;
    mission.after(section);
  };
  const loadUser=async()=>{
    if(!sb)return;
    const {data:{session}}=await sb.auth.getSession();
    const nav=document.querySelector('[data-participation-nav]'),score=document.querySelector('#participationHomeScore'),status=document.querySelector('#participationHomeStatus'),cta=document.querySelector('#participationHomeCta');
    if(!session){return}
    if(nav){nav.textContent='My contribution';nav.href='profile.html';nav.classList.add('is-user')}
    const {data,error}=await sb.rpc('get_my_participation');
    if(error||!data?.length)return;
    const p=data[0];
    if(score)score.textContent=Number(p.xp||0).toLocaleString()+' points';
    if(status)status.textContent=`@${p.username} · ${p.rank||'Contributor'} · ${Number(p.referral_count||0).toLocaleString()} referrals`;
    if(cta){cta.textContent='Open my profile';cta.href='profile.html'}
  };
  document.addEventListener('DOMContentLoaded',()=>{addNav();addCard();loadUser()});
})();
