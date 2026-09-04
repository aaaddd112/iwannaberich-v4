(() => {
  "use strict";
  const URL_BASE = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb = window.supabase?.createClient(URL_BASE, KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  const $ = id => document.getElementById(id);

  async function run() {
    if (!sb || !$('growthLink')) return;
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return;
    const { data, error } = await sb.rpc('get_my_growth_link', { p_user_id: session.user.id });
    const row = data?.[0];
    if (error || !row?.code || row.active === false) return;
    const url = `${window.location.origin}/?g=${encodeURIComponent(row.code)}`;
    $('growthLink').textContent = url;
    $('copyGrowthLink')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(url); if ($('growthMessage')) $('growthMessage').textContent = 'Copied.'; }
      catch { if ($('growthMessage')) $('growthMessage').textContent = url; }
    });
    $('shareGrowthLink')?.addEventListener('click', async () => {
      if (navigator.share) {
        try { await navigator.share({ title: 'IWANNABERICH', text: 'I found a ridiculous internet experiment. You should see this.', url }); } catch {}
      } else {
        try { await navigator.clipboard.writeText(url); if ($('growthMessage')) $('growthMessage').textContent = 'Copied. Share it anywhere.'; } catch {}
      }
    });
  }

  document.addEventListener('DOMContentLoaded', run, { once: true });
})();
