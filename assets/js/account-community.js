(() => {
  "use strict";

  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const REST = `${SUPABASE_URL}/rest/v1`;
  const POST_ENDPOINT = `${SUPABASE_URL}/functions/v1/submit-prediction`;
  const feed = document.getElementById("joinCommunityFeed");
  const count = document.getElementById("joinCommunityCount");
  const meta = document.getElementById("joinCommunityMeta");
  if (!feed) return;

  let comments = [];
  let sortMode = "latest";
  const nicknameKey = "iwbr_community_nickname";

  const escFetch = async (path) => {
    const response = await fetch(`${REST}/${path}`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
    return response.json();
  };

  const timeAgo = (value) => {
    const date = new Date(value); const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return `${seconds}s ago`; const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`; const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`; return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  const initials = (name) => (name || "A").trim().slice(0, 2).toUpperCase();
  const topLevel = () => comments.filter((item) => !item.parent_id && item.comment?.trim());
  const repliesFor = (id) => comments.filter((item) => item.parent_id === id && item.comment?.trim()).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const makeButton = (text, className, handler) => { const button = document.createElement("button"); button.type = "button"; button.className = className; button.textContent = text; button.addEventListener("click", handler); return button; };

  const createReplyComposer = (parentId, close) => {
    const wrap = document.createElement("form"); wrap.className = "community-reply-form";
    const nickname = document.createElement("input"); nickname.type = "text"; nickname.maxLength = 24; nickname.minLength = 3; nickname.required = true; nickname.placeholder = "Nickname"; nickname.autocomplete = "nickname"; nickname.value = localStorage.getItem(nicknameKey) || "";
    const text = document.createElement("textarea"); text.maxLength = 280; text.required = true; text.placeholder = "Add to the discussion..."; text.rows = 3;
    const actions = document.createElement("div"); actions.className = "community-reply-actions";
    const status = document.createElement("span"); status.className = "community-reply-status"; status.setAttribute("aria-live", "polite");
    const submit = document.createElement("button"); submit.type = "submit"; submit.className = "btn primary"; submit.textContent = "Reply →";
    actions.append(submit, makeButton("Cancel", "text-button", close));
    wrap.append(nickname, text, actions, status);
    wrap.addEventListener("submit", async (event) => {
      event.preventDefault(); const name = nickname.value.trim(); const value = text.value.trim();
      if (!/^[a-z0-9 _-]{3,24}$/i.test(name)) { status.textContent = "Nickname must be 3–24 characters."; return; }
      if (!value || value.length > 280) { status.textContent = "Reply must be 1–280 characters."; return; }
      submit.disabled = true; status.textContent = "Posting...";
      try {
        const response = await fetch(POST_ENDPOINT, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ comment: value, nickname: name, parent_id: parentId }) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) { status.textContent = result.error || "Couldn't post the reply."; return; }
        localStorage.setItem(nicknameKey, name); await load();
      } catch (error) { console.error("Community reply error:", error); status.textContent = "Couldn't reach the community."; }
      finally { submit.disabled = false; }
    });
    return wrap;
  };

  const createPost = (item) => {
    const article = document.createElement("article"); article.className = "community-post";
    const header = document.createElement("div"); header.className = "community-post-header";
    const avatar = document.createElement("span"); avatar.className = "community-avatar"; avatar.textContent = initials(item.nickname || item.author_type === "owner" ? "IW" : "A"); avatar.setAttribute("aria-hidden", "true");
    const identity = document.createElement("div"); identity.className = "community-identity";
    const name = document.createElement("strong"); name.textContent = item.nickname || (item.author_type === "owner" ? "IWANNABERICH" : "Anonymous");
    const timestamp = document.createElement("span"); timestamp.textContent = timeAgo(item.created_at); identity.append(name, timestamp);
    const tag = document.createElement("span"); tag.className = "community-tag"; tag.textContent = item.author_type === "owner" ? "OFFICIAL" : "PREDICTION";
    header.append(avatar, identity, tag);
    const body = document.createElement("div"); body.className = "community-post-body"; const text = document.createElement("p"); text.textContent = item.comment; body.appendChild(text);
    const replyCount = repliesFor(item.id).length; const footer = document.createElement("div"); footer.className = "community-post-footer";
    footer.appendChild(document.createTextNode(replyCount ? `${replyCount} ${replyCount === 1 ? "reply" : "replies"}` : "Start the discussion"));
    if (item.author_type === "owner") { const badge = document.createElement("span"); badge.className = "community-owner-badge"; badge.textContent = "IWANNABERICH"; footer.appendChild(badge); }
    const discussion = document.createElement("div"); discussion.className = "community-discussion";
    repliesFor(item.id).forEach((reply) => {
      const row = document.createElement("div"); row.className = "community-reply";
      const replyName = document.createElement("strong"); replyName.textContent = reply.nickname || (reply.author_type === "owner" ? "IWANNABERICH" : "Anonymous");
      const replyText = document.createElement("p"); replyText.textContent = reply.comment;
      const replyMeta = document.createElement("span"); replyMeta.textContent = timeAgo(reply.created_at); row.append(replyName, replyText, replyMeta); discussion.appendChild(row);
    });
    const controls = document.createElement("div"); controls.className = "community-post-controls";
    controls.appendChild(makeButton("Reply", "community-action", () => {
      if (discussion.querySelector(".community-reply-form")) return;
      const composer = createReplyComposer(item.id, () => composer.remove()); discussion.appendChild(composer); composer.querySelector("input")?.focus();
    }));
    article.append(header, body, footer, discussion, controls); return article;
  };

  const render = () => {
    feed.innerHTML = "";
    const roots = topLevel().slice().sort((a, b) => sortMode === "latest" ? new Date(b.created_at) - new Date(a.created_at) : repliesFor(b.id).length - repliesFor(a.id).length || new Date(b.created_at) - new Date(a.created_at)).slice(0, 12);
    if (!roots.length) {
      const empty = document.createElement("div"); empty.className = "community-empty"; const title = document.createElement("strong"); title.textContent = "The room is quiet.";
      const copy = document.createElement("p"); copy.textContent = "Be the first person to leave a take on the experiment."; const link = document.createElement("a"); link.className = "btn primary"; link.href = "support.html"; link.textContent = "Leave a prediction →"; empty.append(title, copy, link); feed.appendChild(empty); return;
    }
    const fragment = document.createDocumentFragment(); roots.forEach((item) => fragment.appendChild(createPost(item))); feed.appendChild(fragment);
  };

  const addControls = () => {
    const head = feed.parentElement?.querySelector(".community-section-head"); if (!head || head.querySelector(".community-sort")) return;
    const controls = document.createElement("div"); controls.className = "community-sort";
    controls.appendChild(makeButton("Latest", "community-sort-button is-active", () => { sortMode = "latest"; controls.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b.textContent === "Latest")); render(); }));
    controls.appendChild(makeButton("Most discussed", "community-sort-button", () => { sortMode = "discussion"; controls.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b.textContent === "Most discussed")); render(); }));
    head.insertBefore(controls, head.lastElementChild);
  };

  const load = async () => {
    try {
      const [rows, prediction] = await Promise.all([
        escFetch("predictions_comments?select=id%2Ccomment%2Cnickname%2Ccreated_at%2Cparent_id%2Cauthor_type&order=created_at.desc&limit=100"),
        escFetch("predictions?id=eq.1&select=yes_count%2Cno_count&limit=1"),
      ]);
      comments = rows || []; render(); addControls();
      const roots = topLevel().length; const replies = comments.filter((item) => item.parent_id).length; const yes = Number(prediction?.[0]?.yes_count) || 0; const no = Number(prediction?.[0]?.no_count) || 0; const votes = yes + no;
      if (count) count.textContent = votes ? `${votes.toLocaleString()} votes · ${roots} discussions` : `${roots} discussions`;
      if (meta) meta.textContent = replies ? `${replies} replies are keeping the conversation moving.` : "Start a discussion and make your call on the experiment.";
    } catch (error) {
      console.error("Could not load community feed:", error); feed.innerHTML = ""; const fallback = document.createElement("div"); fallback.className = "community-empty";
      const title = document.createElement("strong"); title.textContent = "Community feed temporarily unavailable."; const copy = document.createElement("p"); copy.textContent = "You can still join the experiment or browse the full prediction board.";
      const link = document.createElement("a"); link.className = "btn"; link.href = "support.html"; link.textContent = "Open predictions →"; fallback.append(title, copy, link); feed.appendChild(fallback); if (count) count.textContent = "Community online";
    }
  };

  document.addEventListener("DOMContentLoaded", load);
})();