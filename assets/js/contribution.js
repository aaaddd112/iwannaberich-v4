(() => {
  'use strict';
  const SUPABASE_URL = 'https://ofcdtwrgyxjrpoxuikxg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpY';
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const types = { idea:'Idea', experiment:'Experiment', challenge:'Challenge', opportunity:'Opportunity' };

  function nav(){
    const toggle=document.querySelector('.nav-toggle'), nav=document.querySelector('.links');
    if(!toggle||!nav)return;
    const close=()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');};
    toggle.addEventListener('click',e=>{e.stopPropagation();const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }
  function date(v){return v?new Date(v).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}):'Unknown';}
  function author(row){return row.username?`@${esc(row.username)}`:(row.contributor_number?`Contributor #${esc(row.contributor_number)}`:'Contributor');}

  async function load(){
    const root=$('detailRoot');
    const id=new URLSearchParams(location.search).get('id');
    if(!root||!sb||!id){root.innerHTML='<a class="detail-back" href="contributions.html">← Back to contributions</a><div class="detail-error"><h1>Record not found.</h1><p class="muted">This contribution does not exist or is not public.</p></div>';return;}
    try{
      const {data,error}=await sb.rpc('get_public_contribution',{p_id:id});
      if(error)throw error;
      const row=Array.isArray(data)?data[0]:data;
      if(!row)throw new Error('not_found');
      const type=esc(types[row.type]||row.type);
      document.title=`${row.title} — IWANNABERICH`;
      const metaDescription=`Completed IWANNABERICH contribution: ${row.title}.`;
      const meta=document.querySelector('meta[name="description"]'); if(meta)meta.setAttribute('content',metaDescription);
      root.innerHTML=`<a class="detail-back" href="contributions.html">← Back to contributions</a>
        <div class="detail-header"><span class="contribution-type">${type}</span><h1>${esc(row.title)}</h1><p class="detail-copy">A contribution that made it through the review process and became part of the public experiment record.</p></div>
        <div class="detail-grid"><div>
          <section class="detail-section"><h2>The idea</h2><p>${esc(row.content)}</p></section>
          <section class="detail-section"><h2>What happened</h2><p>${esc(row.result||'No result was published.')}</p></section>
        </div>
        <aside class="detail-side"><dl><dt>Contributor</dt><dd>${author(row)}</dd><dt>Completed</dt><dd>${date(row.completed_at||row.created_at)}</dd><dt>Impact</dt><dd>${Number(row.impact_score||0)}/100</dd><dt>Status</dt><dd>Completed</dd></dl></aside></div>`;
    }catch(error){console.error('[contribution]',error);root.innerHTML='<a class="detail-back" href="contributions.html">← Back to contributions</a><div class="detail-error"><h1>Record unavailable.</h1><p class="muted">This contribution does not exist or is not public.</p></div>';}
  }
  document.addEventListener('DOMContentLoaded',()=>{nav();load();},{once:true});
})();
