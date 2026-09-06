(() => {
  "use strict";

  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
  const statusLabel = (status) => ({
    submitted: "Submitted", under_review: "Under review", selected: "Selected",
    in_progress: "In progress", completed: "Completed", rejected: "Rejected"
  }[status] || status);

  function message(text, type = "") {
    const el = $("contributionMessage");
    if (!el) return;
    el.textContent = text;
    el.className = `account-message ${type}`;
  }

  function renderList(rows = []) {
    const list = $("contributionList");
    if (!list) return;
    if (!rows.length) {
      list.innerHTML = '<p class="muted">You have not submitted anything yet.</p>';
      return;
    }
    list.innerHTML = rows.map((row) => {
      const xp = row.status === "selected" ? ({ idea: 100, experiment: 250, challenge: 250, opportunity: 250 }[row.type] || 0) :
        row.status === "completed" ? ({ idea: 350, experiment: 750, challenge: 750, opportunity: 750 }[row.type] || 0) : 0;
      return `<article class="contribution-item">
        <div class="contribution-item-head"><div><small>${esc(row.type)}</small><h3>${esc(row.title)}</h3></div><span class="contribution-status">${esc(statusLabel(row.status))}</span></div>
        <p>${esc(row.content).slice(0, 240)}${row.content.length > 240 ? "…" : ""}</p>
        ${xp ? `<div class="contribution-xp">Up to +${xp.toLocaleString()} XP earned across this contribution.</div>` : ""}
        ${row.review_note ? `<p><strong>Review:</strong> ${esc(row.review_note)}</p>` : ""}
        ${row.result ? `<p><strong>Result:</strong> ${esc(row.result)}</p>` : ""}
      </article>`;
    }).join("");
  }

  async function loadContributions(userId) {
    const { data, error } = await sb.from("contributions")
      .select("id,type,title,content,status,review_note,result,impact_score,created_at,selected_at,tested_at,completed_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      $("contributionList").innerHTML = '<p class="muted">Your contribution history is temporarily unavailable.</p>';
      return;
    }
    renderList(data || []);
  }

  async function init() {
    if (!sb) return message("Contribution services are unavailable.", "error");
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      message("Sign in to contribute. Redirecting…", "error");
      setTimeout(() => { location.href = "account.html?next=contribute.html"; }, 700);
      return;
    }

    await loadContributions(session.user.id);

    const textarea = $("contributionContent");
    const count = $("contentCount");
    textarea?.addEventListener("input", () => { if (count) count.textContent = textarea.value.length; });

    $("contributionForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $("submitContribution");
      const type = document.querySelector('input[name="type"]:checked')?.value;
      const title = $("contributionTitle")?.value.trim();
      const content = textarea?.value.trim();
      if (!type || !title || title.length < 3 || !content || content.length < 10) {
        message("Give your contribution a title and at least 10 characters of detail.", "error");
        return;
      }
      button.disabled = true;
      message("Submitting…");
      const { error } = await sb.rpc("submit_contribution", {
        p_type: type, p_title: title, p_content: content
      });
      button.disabled = false;
      if (error) {
        message("We couldn't submit that contribution. Please try again.", "error");
        return;
      }
      message("Contribution submitted. No points are awarded for submission itself.", "success");
      $("contributionForm").reset();
      if (count) count.textContent = "0";
      await loadContributions(session.user.id);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
