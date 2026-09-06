(() => {
  'use strict';

  const SUPABASE_URL = 'https://ofcdtwrgyxjrpoxuikxg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? '').replace(/[&<>\"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const types = { idea:'Idea', experiment:'Experiment', challenge:'Challenge', opportunity:'Opportunity' };

  function nav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.links');
    if (!toggle || !nav) return;
    const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open navigation'); };
    toggle.addEventListener('click', (e) => { e.stopPropagation(); const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('click', e => { if (!nav.contains(e.target) && !toggle.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
  }

  function contributor(row) {
    if (row.username) return `@${esc(row.username)}`;
    if (row.contributor_number) return `Contributor #${esc(row.contributor_number)}`;
    return 'Contributor';
  }

  function card(row) {
    const type = esc(types[row.type] || row.type);
    const author = contributor(row);
    const number = row.contributor_number ? `#${esc(row.contributor_number)}` : '';
    return `<a class="contribution-card" href="contribution.html?id=${encodeURIComponent(row.id)}">
      <div class="contribution-top">
        <div>
          <span class="contribution-type">${type}</span>
          <h2>${esc(row.title)}</h2>
        </div>
        <span class="contribution-arrow" aria-hidden="true">↗</span>
      </div>
      <div class="contribution-content">${esc(row.content)}</div>
      ${row.result ? `<div class="contribution-result"><strong>Result</strong>${esc(row.result)}</div>` : ''}
      <div class="contribution-meta"><span>${author}</span>${number ? `<span>${number}</span>` : ''}<span>${formatDate(row.completed_at || row.created_at)}</span><span class="contribution-impact">Impact ${Number(row.impact_score || 0)}/100</span></div>
    </a>`;
  }

  async function load() {
    const root = $('contributionList');
    if (!root || !sb) return;
    try {
      const { data, error } = await sb.rpc('get_public_contributions', { p_limit: 100 });
      if (error) throw error;
      const rows = data || [];
      $('contributionCount').textContent = String(rows.length);
      if (!rows.length) {
        root.innerHTML = '<div class="card contribution-empty"><p class="muted">Nothing has been completed yet. That may change.</p></div>';
        return;
      }
      root.innerHTML = rows.map(card).join('');
    } catch (error) {
      console.error('[contributions]', error);
      root.innerHTML = '<div class="card contribution-empty"><p class="muted">The public record is temporarily unavailable.</p></div>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => { nav(); load(); }, { once:true });
})();
