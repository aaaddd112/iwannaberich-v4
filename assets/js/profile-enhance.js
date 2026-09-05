(()=>{
  'use strict';
  const U='https://ofcdtwrgyxjrpoxuikxg.supabase.co',K='sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
  const sb=window.supabase?.createClient(U,K,{auth:{persistSession:true,autoRefreshToken:true}});
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  async function run(){
    if(!sb)return;
    const {data:{session}}=await sb.auth.getSession();
    if(!session)return;
    const {data:p}=await sb.rpc('get_my_participation');
    const x=p?.[0];
    if(!x)return;

    if($('profileContributorNumber'))$('profileContributorNumber').textContent=x.contributor_number||'—';

    const box=$('achievementList');
    if(box){
      const {data:a}=await sb.from('user_achievements').select('unlocked_at,metadata,achievements(name,description,icon,xp_reward)').eq('user_id',session.user.id).order('unlocked_at',{ascending:false});
      box.innerHTML=a?.length?a.map(v=>`<article class="achievement"><span class="achievement-icon">${esc(v.achievements?.icon||'★')}</span><div><strong>${esc(v.achievements?.name||'Achievement')}</strong><p>${esc(v.achievements?.description||'Unlocked by contributing to the experiment.')}</p></div></article>`).join(''):'<p class="muted">No badges yet. Your first one is waiting.</p>';
    }

    const card=document.createElement('section');
    card.className='card share-card-tools';
    card.innerHTML=`<div>
      <p class="label">YOUR SHARE CARD</p>
      <h2>Make your place in the story visible.</h2>
      <p class="muted">A shareable snapshot of who you are in the experiment — contributor number, status and the current journey.</p>
    </div>
    <div class="share-card-actions"><button class="btn primary" id="generateShareCard" type="button">Generate share card</button></div>
    <div id="shareCardPreview" class="share-card-preview" hidden></div>`;
    document.querySelector('.profile-share')?.after(card);

    $('generateShareCard')?.addEventListener('click',()=>{
      if(!window.IWBRShareCard){return}
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
      save.className='btn';
      save.type='button';
      save.textContent='Save image';
      save.onclick=()=>window.IWBRShareCard.download(`iwannaberich-contributor-${x.contributor_number}.png`);

      const share=document.createElement('button');
      share.className='btn primary';
      share.type='button';
      share.textContent='Share image';
      share.onclick=async()=>canvas.toBlob(async blob=>{
        if(!blob)return;
        const file=new File([blob],`iwannaberich-${x.contributor_number}.png`,{type:'image/png'});
        if(navigator.share&&navigator.canShare?.({files:[file]})){
          try{await navigator.share({title:'IWANNABERICH',text:`I’m Contributor #${x.contributor_number}. I was here early.`,files:[file]});return}catch(e){}
        }
        try{await navigator.clipboard.writeText(`I’m Contributor #${x.contributor_number} in IWANNABERICH. I was here early. https://iwannaberich.xyz/profile.html`)}catch(e){}
      },'image/png');

      actions.append(save,share);
      preview.appendChild(actions);
    });
  }

  document.addEventListener('DOMContentLoaded',run,{once:true});
})();