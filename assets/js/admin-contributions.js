(() => {
  'use strict';

  const SUPABASE_URL = 'https://ofcdtwrgyxjrpoxuikxg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? '').replace(/[&<>\"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const labels = { submitted:'Submitted', under_review:'Under review', selected:'Selected', in_progress:'In progress', completed:'Completed', rejected:'Rejected' };
  const types = { idea:'Idea', experiment:'Experiment', challenge:'Challenge', opportunity:'Opportunity' };
  const selectedXp = { idea:100, experiment:250, challenge:250, opportunity:250 };
  const completedXp = { idea:250, experiment:500, challenge:500, opportunity:500 };

  function setMessage(text, type = '') {
    const el = $('panelMessage');
    if (!el) return;
    el.textContent = text;
    el.className = `admin-message ${type}`;
  }

  async function api(body) {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) throw new Error('unauthorized');
    const { data, error } = await sb.functions.invoke('admin-contributions', { body });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  }

  function actionsFor(row) {
    if (row.status === 'submitted') return [['under_review','Review'],['reject','Reject']];
    if (row.status === 'under_review') return [['select','Select'],['reject','Reject']];
    if (row.status === 'selected') return [['start','Start'],['reject','Reject']];
    if (row.status === 'in_progress') return [['complete','Complete']];
    return [];
  }

  function render(rows) {
    const root = $('reviewList');
    if (!root) return;
    const typeFilter = $('typeFilter')?.value || '';
    const filtered = typeFilter ? rows.filter((r) => r.type === typeFilter) : rows;
    $('count').textContent = `${filtered.length} contribution${filtered.length === 1 ? '' : 's'}`;

    if (!filtered.length) {
      root.innerHTML = '<div class="card empty">Nothing in this queue.</div>';
      return;
    }

    root.innerHTML = filtered.map((row) => {
      const actions = actionsFor(row);
      const selected = selectedXp[row.type] || 0;
      const completed = completedXp[row.type] || 0;
      const earned = selected + completed;
      const contributor = row.username ? `@${row.username}` : `User ${row.user_id?.slice(0,8) || 'unknown'}`;
      const date = row.created_at ? new Date(row.created_at).toLocaleString() : '';
      const controls = actions.length ? `
        <div class="review-controls">
          <div class="review-fields">
            <label>Review note / result
              <textarea data-field="note" maxlength="5000" placeholder="Optional note, or result when completing..."></textarea>
            </label>
            <label>Impact
              <input data-field="impact" type="number" min="0" max="100" step="1" value="${Number(row.impact_score || 0)}">
            </label>
          </div>
          <div class="xp-preview">Potential contribution reward: +${earned.toLocaleString()} XP total, if selected and later completed.</div>
          <div class="review-actions">
            ${actions.map(([action, text]) => `<button class="btn ${action === 'reject' ? 'danger' : 'primary'}" data-action="${action}" data-id="${esc(row.id)}">${text}${action === 'select' ? ` +${selected.toLocaleString()} XP` : ''}${action === 'complete' ? ` +${completed.toLocaleString()} XP` : ''}</button>`).join('')}
          </div>
        </div>` : '';

      return `<article class="contribution-review" data-id="${esc(row.id)}">
        <div class="review-top">
          <div><span class="review-type">${esc(types[row.type] || row.type)}</span><h2 class="review-title">${esc(row.title)}</h2></div>
          <span class="review-status">${esc(labels[row.status] || row.status)}</span>
        </div>
        <div class="review-content">${esc(row.content)}</div>
        <div class="review-meta"><span>${esc(contributor)}</span>${row.contributor_number ? `<span>#${esc(row.contributor_number)}</span>` : ''}<span>${esc(date)}</span><span>Impact ${Number(row.impact_score || 0)}/100</span></div>
        ${row.review_note ? `<p class="muted"><strong>Review:</strong> ${esc(row.review_note)}</p>` : ''}
        ${row.result ? `<p class="muted"><strong>Result:</strong> ${esc(row.result)}</p>` : ''}
        ${controls}
      </article>`;
    }).join('');

    root.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => review(button.dataset.id, button.dataset.action, button.closest('.contribution-review')));
    });
  }

  async function load() {
    try {
      const status = $('statusFilter')?.value || '';
      const out = await api({ action: 'list', status });
      $('login').hidden = true;
      $('panel').hidden = false;
      setMessage('');
      render(out.contributions || []);
    } catch (error) {
      $('login').hidden = false;
      $('panel').hidden = true;
      $('loginMessage').textContent = error.message === 'not_authorized' ? 'This account is not authorized.' : 'Unable to load contributions.';
    }
  }

  async function review(id, action, card) {
    if (action === 'reject' && !confirm('Reject this contribution?')) return;
    const note = card?.querySelector('[data-field="note"]')?.value.trim() || null;
    const impactRaw = card?.querySelector('[data-field="impact"]')?.value;
    const impact = impactRaw === '' || impactRaw == null ? null : Math.max(0, Math.min(100, Number(impactRaw)));
    const buttons = card?.querySelectorAll('button[data-action]') || [];
    buttons.forEach((b) => { b.disabled = true; });
    setMessage('Saving review…');
    try {
      await api({ action: 'manage', contribution_id: id, review_action: action, review_note: note, result: action === 'complete' ? note : null, impact_score: Number.isFinite(impact) ? impact : null });
      setMessage(action === 'select' ? 'Contribution selected. XP awarded.' : action === 'complete' ? 'Contribution completed. XP awarded and result recorded.' : action === 'reject' ? 'Contribution rejected.' : `Contribution moved to ${labels[action] || action}.`, 'success');
      await load();
    } catch (error) {
      setMessage(error.message || 'Review failed.', 'error');
      buttons.forEach((b) => { b.disabled = false; });
    }
  }

  $('statusFilter')?.addEventListener('change', load);
  $('typeFilter')?.addEventListener('change', () => load());
  $('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    $('loginMessage').textContent = 'Signing in…';
    const { error } = await sb.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
    if (error) { $('loginMessage').textContent = 'Invalid credentials.'; return; }
    await load();
  });
  $('signOut')?.addEventListener('click', async () => { await sb.auth.signOut(); location.reload(); });
  document.addEventListener('DOMContentLoaded', () => { if (sb) load(); }, { once: true });
})();
