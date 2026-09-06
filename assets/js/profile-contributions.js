(() => {
  "use strict";

  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  const typeLabels = { idea: "Idea", experiment: "Experiment", challenge: "Challenge", opportunity: "Opportunity" };
  const statusLabels = { submitted: "Submitted", under_review: "Under review", selected: "Selected", in_progress: "In progress", completed: "Completed", rejected: "Rejected" };

  function render(rows) {
    const root = $("profileContributions");
    if (!root) return;
    if (!rows?.length) {
      root.innerHTML = '<div class="profile-contributions-empty"><strong>Nothing on the table yet.</strong><p class="muted">Your first contribution could change what happens next.</p><a class="btn primary" href="contribute.html">Make a contribution →</a></div>';
      return;
    }
    root.innerHTML = rows.map((row) => {
      const status = statusLabels[row.status] || row.status;
      const type = typeLabels[row.type] || row.type;
      const date = row.created_at ? new Date(row.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";
      const result = row.status === "completed" && row.result ? `<p class="profile-contribution-result"><span>RESULT</span>${escapeHtml(row.result)}</p>` : "";
      const impact = row.status === "completed" ? `<span class="profile-contribution-impact">Impact ${Number(row.impact_score || 0)}/100</span>` : "";
      return `<article class="profile-contribution">
        <div class="profile-contribution-top"><div><span class="profile-contribution-type">${escapeHtml(type)}</span><h3>${escapeHtml(row.title)}</h3></div><span class="profile-contribution-status status-${escapeHtml(row.status)}">${escapeHtml(status)}</span></div>
        <p class="profile-contribution-content">${escapeHtml(row.content)}</p>
        <div class="profile-contribution-meta"><span>${escapeHtml(date)}</span>${impact}</div>
        ${result}
      </article>`;
    }).join("");
  }

  async function load() {
    const root = $("profileContributions");
    if (!root || !sb) return;
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { root.innerHTML = '<p class="muted">Sign in to see your contributions.</p>'; return; }
    const { data, error } = await sb.from("contributions").select("id,type,title,content,status,result,impact_score,created_at,selected_at,tested_at,completed_at").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(20);
    if (error) {
      console.error("[profile-contributions]", error);
      root.innerHTML = '<p class="muted">Your contributions could not be loaded right now.</p>';
      return;
    }
    render(data || []);
  }

  document.addEventListener("DOMContentLoaded", load);
})();
