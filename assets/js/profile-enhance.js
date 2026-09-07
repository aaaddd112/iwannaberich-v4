(()=>{
  'use strict';
  const U='https://ofcdtwrgyxjrpoxuikxg.supabase.co',K='sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
  const sb=window.supabase?.createClient(U,K,{auth:{persistSession:true,autoRefreshToken:true}});
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const badgeCode=code=>({first_contact:'first_contact',first_prediction:'first_prediction',first_discussion:'first_discussion',first_reply:'first_reply',streak_3:'streak_3',streak_7:'streak_7',streak_14:'streak_14',streak_30:'streak_30',early_contributor:'early_contributor',growth_first:'growth_first',growth_networker:'growth_networker',growth_amplifier:'growth_amplifier',growth_agent:'growth_agent',money_maker:'money_maker',opportunist:'opportunist',mad_scientist:'mad_scientist',chaos_agent:'chaos_agent',two_hundred_iq:'two_hundred_iq',game_changer:'game_changer',global_agent:'global_agent',veteran:'veteran',the_impossible:'the_impossible',here_at_25:'here_at_25',here_at_100:'here_at_100',rank_agent:'rank_agent',rank_associate:'rank_associate',rank_billionaire_material:'rank_billionaire_material',rank_experimenter:'rank_experimenter',rank_investor:'rank_investor',rank_mogul:'rank_mogul',rank_observer:'rank_observer'}[code]||'member');
  const icon=(code,cls='badge-icon lg')=>`<svg class="${cls}" aria-hidden="true" focusable="false"><use href="assets/badges/badge-sprite.svg#${badgeCode(code)}"></use></svg>`;

  async function run(){
    if(!sb)return;
    const {data:{session}}=await sb.auth.getSession();
    if(!session)return;
    const {data:p}=await sb.rpc('get_my_participation');
    const x=p?.[0];
    if(!x)return;

    if($('profileContributorNumber'))$('profileContributorNumber').textContent=x.contributor_number||'-';

    const box=$('achievementList');
    if(box){
      const {data:a}=await sb.from('user_achievements').select('unlocked_at,metadata,achievements(code,name,description,icon,xp_reward)').eq('user_id',session.user.id).order('unlocked_at',{ascending:false});
      box.innerHTML=a?.length?a.map(v=>{const a=v.achievements||{};const rare=['streak_30','growth_agent','game_changer','global_agent','the_impossible','two_hundred_iq'].includes(a.code);return`<article class="achievement${rare?' is-rare':''}">${icon(a.code)}<div><strong>${esc(a.name||'Achievement')}</strong><p>${esc(a.description||'Unlocked by contributing to the experiment.')}</p><small>${Number(a.xp_reward||0).toLocaleString()} XP reward</small></div></article>`}).join(''):'<p class="muted">No badges yet. Your first one is waiting.</p>';
    }

    const card=document.createElement('section');
    card.className='card share-card-tools';
    card.innerHTML=`<div>
      <p class="label">YOUR SHARE CARD</p>
      <h2>Make your place in the story visible.</h2>
      <p class="muted">A shareable snapshot of who you are in the experiment - contributor number, status and the current journey.</p>
    </div>
    <div class="share-card-actions"><button class="btn primary" id="generateShareCard" type="button">Generate share card</button></div>
    <div id="shareCardPreview" class="share-card-preview" hidden></div>`;
    document.querySelector('.profile-share')?.after(card);

    $('generateShareCard')?.addEventListener('click',()=>{
      if(!window.IWBRShareCard)return;
      const wealth='13';
      const canvas=window.IWBRShareCard.render(x,wealth);
      const preview=$('shareCardPreview');
      preview.hidden=false;
      preview.innerHTML='';
      const img=new Image();
      img.alt=`IWANNABERICH Contributor #${x.contributor_number} share card`;
      img.src=canvas.toDataURL('image/png');
      preview.appendChild(img);
      const actions=document.createElement('div');
      actions.className='share-card-actions';
      const save=document.createElement('button');
      save.className='btn';save.type='button';save.textContent='Save image';
      save.onclick=()=>window.IWBRShareCard.download(`iwannaberich-contributor-${x.contributor_number}.png`);
      const share=document.createElement('button');
      share.className='btn primary';share.type='button';share.textContent='Share image';
      share.onclick=async()=>canvas.toBlob(async blob=>{
        if(!blob)return;
        const file=new File([blob],`iwannaberich-${x.contributor_number}.png`,{type:'image/png'});
        if(navigator.share&&navigator.canShare?.({files:[file]})){try{await navigator.share({title:'IWANNABERICH',text:`I am Contributor #${x.contributor_number}. I was here early.`,files:[file]});return}catch(e){}}
        try{await navigator.clipboard.writeText(`I am Contributor #${x.contributor_number} in IWANNABERICH. I was here early. https://iwannaberich.xyz/profile.html`)}catch(e){}
      },'image/png');
      actions.append(save,share);preview.appendChild(actions);
    });
  }
  document.addEventListener('DOMContentLoaded',run,{once:true});
})();