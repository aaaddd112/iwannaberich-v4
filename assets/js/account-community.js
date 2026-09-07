(() => {
  "use strict";

  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const REST = `${SUPABASE_URL}/rest/v1`;
  const feed = document.getElementById("joinCommunityFeed");
  const count = document.getElementById("joinCommunityCount");
  const meta = document.getElementById("joinCommunityMeta");
  if (!feed) return;

  const escFetch = async (path) => {
    const response = await fetch(`${REST}/${path}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
    return response.json();
  };

  const timeAgo = (value) => {
    const date = new Date(value);
    const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  const initials = (name) => {
    const value = (name || "A").trim();
    return value.slice(0, 2).toUpperCase();
  };

  const createPost = (item) => {
    const article = document.createElement("article");
    article.className = "community-post";

    const header = document.createElement("div");
    header.className = "community-post-header";

    const avatar = document.createElement("span");
    avatar.className = "community-avatar";
    avatar.textContent = initials(item.nickname);
    avatar.setAttribute("aria-hidden", "true");

    const identity = document.createElement("div");
    identity.className = "community-identity";
    const name = document.createElement("strong");
    name.textContent = item.nickname || "Anonymous";
    const timestamp = document.createElement("span");
    timestamp.textContent = timeAgo(item.created_at);
    identity.append(name, timestamp);

    const tag = document.createElement("span");
    tag.className = "community-tag";
    tag.textContent = item.author_type === "owner" ? "OFFICIAL" : "PREDICTION";

    header.append(avatar, identity, tag);

    const body = document.createElement("div");
    body.className = "community-post-body";
    const quote = document.createElement("p");
    quote.textContent = item.comment || "";
    body.appendChild(quote);

    const footer = document.createElement("div");
    footer.className = "community-post-footer";
    const thread = document.createElement("span");
    thread.textContent = item.parent_id ? "Reply in discussion" : "Public experiment take";
    footer.appendChild(thread);

    if (item.author_type === "owner") {
      const badge = document.createElement("span");
      badge.className = "community-owner-badge";
      badge.textContent = "IWANNABERICH";
      footer.appendChild(badge);
    }

    article.append(header, body, footer);
    return article;
  };

  const render = (comments) => {
    feed.innerHTML = "";
    const visible = (comments || []).filter((item) => item.comment && item.comment.trim()).slice(0, 12);
    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "community-empty";
      const title = document.createElement("strong");
      title.textContent = "The room is quiet.";
      const copy = document.createElement("p");
      copy.textContent = "Be the first person to leave a take on the experiment.";
      const link = document.createElement("a");
      link.className = "btn primary";
      link.href = "support.html";
      link.textContent = "Leave a prediction →";
      empty.append(title, copy, link);
      feed.appendChild(empty);
      return;
    }
    const fragment = document.createDocumentFragment();
    visible.forEach((item) => fragment.appendChild(createPost(item)));
    feed.appendChild(fragment);
  };

  const load = async () => {
    try {
      const [comments, prediction] = await Promise.all([
        escFetch("predictions_comments?select=id%2Ccomment%2Cnickname%2Ccreated_at%2Cparent_id%2Cauthor_type&order=created_at.desc&limit=12"),
        escFetch("predictions?id=eq.1&select=yes_count%2Cno_count&limit=1"),
      ]);
      render(comments);
      const total = (comments || []).length;
      const yes = Number(prediction?.[0]?.yes_count) || 0;
      const no = Number(prediction?.[0]?.no_count) || 0;
      const votes = yes + no;
      if (count) count.textContent = votes ? `${votes.toLocaleString()} votes · ${total} recent takes` : `${total} recent takes`;
      if (meta) meta.textContent = votes ? "People are deciding whether the experiment will actually work." : "Latest public takes from the experiment.";
    } catch (error) {
      console.error("Could not load community feed:", error);
      feed.innerHTML = "";
      const fallback = document.createElement("div");
      fallback.className = "community-empty";
      const title = document.createElement("strong");
      title.textContent = "Community feed temporarily unavailable.";
      const copy = document.createElement("p");
      copy.textContent = "You can still join the experiment or browse the full prediction board.";
      const link = document.createElement("a");
      link.className = "btn";
      link.href = "support.html";
      link.textContent = "Open predictions →";
      fallback.append(title, copy, link);
      feed.appendChild(fallback);
      if (count) count.textContent = "Community online";
    }
  };

  document.addEventListener("DOMContentLoaded", load);
})();
