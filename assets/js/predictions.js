(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const PREDICTION_ENDPOINT = `${SUPABASE_URL}/functions/v1/submit-prediction`;
  const VOTE_STORAGE_KEY = "iwbr_prediction_vote";
  const COMMENT_MAX_LENGTH = 280;

  const $ = (id) => document.getElementById(id);
  const OWNER_BADGE = {
    en: "IWANNABERICH · OWNER",
    es: "IWANNABERICH · PROPIETARIO",
    fr: "IWANNABERICH · PROPRIÉTAIRE",
    de: "IWANNABERICH · INHABER",
    pt: "IWANNABERICH · DONO",
    zh: "IWANNABERICH · 创建者",
    ja: "IWANNABERICH · 作成者",
    ar: "IWANNABERICH · المالك"
  };
  const tr = (key, fallback, vars) => {
    if (key === "support.ownerBadge") {
      const lang = localStorage.getItem("iwbr_language") || document.documentElement.lang || "en";
      return OWNER_BADGE[lang] || OWNER_BADGE.en;
    }
    return window.IWBRI18N?.format?.(key, vars) || fallback;
  };

  let client = null;
  let currentUser = null;

  function init() {
    if (!window.supabase) return;

    try {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (error) {
      console.error("Supabase initialization failed:", error);
      return;
    }

    initVoting(client);
    initComments(client);
    refreshAuth();
    client.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
      updateOwnerUI();
      loadComments();
    });
  }

  function initVoting(client) {
    const yesBtn = $("voteYes");
    const noBtn = $("voteNo");
    const yesPercentEl = $("yesPercent");
    const noPercentEl = $("noPercent");
    const fillEl = $("predictYesFill");
    const totalEl = $("predictTotal");
    if (!yesBtn || !noBtn || !yesPercentEl || !noPercentEl || !fillEl || !totalEl) return;

    let hasVoted = Boolean(localStorage.getItem(VOTE_STORAGE_KEY));

    function renderCounts(yesCount, noCount) {
      const total = yesCount + noCount;
      const yesPct = total > 0 ? Math.round((yesCount / total) * 100) : 0;
      const noPct = total > 0 ? 100 - yesPct : 0;
      yesPercentEl.textContent = total > 0 ? `${yesPct}%` : "–";
      noPercentEl.textContent = total > 0 ? `${noPct}%` : "–";
      fillEl.style.width = `${yesPct}%`;
      totalEl.textContent = total > 0
        ? tr("support.votesSoFar", `${total.toLocaleString("en-US")} vote${total === 1 ? "" : "s"} so far`, { count: total.toLocaleString("en-US"), plural: total === 1 ? "" : "s" })
        : tr("support.firstVote", "Be the first to vote.");
    }

    function setVotedState() {
      const chosen = localStorage.getItem(VOTE_STORAGE_KEY);
      yesBtn.classList.toggle("selected", chosen === "yes");
      noBtn.classList.toggle("selected", chosen === "no");
      yesBtn.disabled = true;
      noBtn.disabled = true;
    }

    async function loadCounts() {
      const { data, error } = await client.from("predictions")
        .select("yes_count, no_count").eq("id", 1).single();
      if (error) {
        console.error("Load predictions error:", error);
        totalEl.textContent = tr("support.unavailable", "Votes unavailable right now.");
        return;
      }
      renderCounts(Number(data.yes_count) || 0, Number(data.no_count) || 0);
    }

    async function castVote(voteType) {
      if (hasVoted) return;
      hasVoted = true;
      localStorage.setItem(VOTE_STORAGE_KEY, voteType);
      setVotedState();
      const { error } = await client.rpc("increment_prediction_vote", { vote_type: voteType });
      if (error) console.error("Vote error:", error);
      await loadCounts();
    }

    yesBtn.addEventListener("click", () => castVote("yes"));
    noBtn.addEventListener("click", () => castVote("no"));
    if (hasVoted) setVotedState();
    loadCounts();
    window.addEventListener("iwbr:languagechange", loadCounts);
  }

  async function refreshAuth() {
    const { data } = await client.auth.getUser();
    currentUser = data?.user || null;
    updateOwnerUI();
  }

  function updateOwnerUI() {
    const replyHint = $("ownerReplyHint");
    if (replyHint) {
      replyHint.hidden = !currentUser;
      replyHint.textContent = currentUser ? tr("support.ownerMode", "Owner mode enabled — you can reply below.") : "";
    }
  }

  async function submitOwnerReply(parentId, value, button, errorEl) {
    if (!currentUser) {
      errorEl.textContent = tr("support.loginOwner", "Log in as the owner first.");
      return;
    }

    button.disabled = true;
    button.textContent = tr("support.replying", "Replying...");
    errorEl.textContent = "";

    try {
      const { data: sessionData } = await client.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("No active session.");

      const response = await fetch(PREDICTION_ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: value,
          nickname: "IWANNABERICH",
          parent_id: parentId
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        errorEl.textContent = result.error || tr("support.couldntPost", "Couldn't post reply.");
        return;
      }

      await loadComments();
    } catch (error) {
      console.error("Owner reply error:", error);
      errorEl.textContent = tr("support.systemError", "Couldn't reach the prediction system.");
    } finally {
      button.disabled = false;
      button.textContent = tr("support.reply", "Reply");
    }
  }

  function renderComments(comments) {
    const listEl = $("predictionComments");
    if (!listEl) return;
    listEl.innerHTML = "";

    if (!comments.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = tr("support.noComments", "No comments yet. Be the first.");
      listEl.appendChild(empty);
      return;
    }

    const replies = new Map();
    comments.filter(c => c.parent_id).forEach(c => {
      if (!replies.has(c.parent_id)) replies.set(c.parent_id, []);
      replies.get(c.parent_id).push(c);
    });

    comments.filter(c => !c.parent_id).forEach(item => {
      const row = document.createElement("div");
      row.className = "predict-comment";

      const p = document.createElement("p");
      p.textContent = `"${item.comment}"`;
      row.appendChild(p);

      const meta = document.createElement("div");
      meta.className = "predict-comment-meta";
      if (item.author_type === "owner") {
        meta.innerHTML = `<span class="owner-badge">${tr("support.ownerBadge", "IWANNABERICH · OWNER")}</span>`;
      } else {
        meta.textContent = item.nickname || tr("support.anonymous", "Anonymous");
      }
      row.appendChild(meta);

      const childReplies = replies.get(item.id) || [];
      childReplies.forEach(reply => {
        const replyBox = document.createElement("div");
        replyBox.className = "predict-reply";
        const replyText = document.createElement("p");
        replyText.textContent = reply.comment;
        replyBox.appendChild(replyText);
        const replyMeta = document.createElement("div");
        replyMeta.className = "predict-comment-meta";
        if (reply.author_type === "owner") {
          replyMeta.innerHTML = `<span class="owner-badge">${tr("support.ownerBadge", "IWANNABERICH · OWNER")}</span>`;
        } else {
          replyMeta.textContent = reply.nickname || tr("support.anonymous", "Anonymous");
        }
        replyBox.appendChild(replyMeta);
        row.appendChild(replyBox);
      });

      if (currentUser) {
        const replyWrap = document.createElement("div");
        replyWrap.className = "owner-reply";
        const input = document.createElement("textarea");
        input.maxLength = COMMENT_MAX_LENGTH;
        input.placeholder = tr("support.replyPlaceholder", "Reply as the owner...");
        const actions = document.createElement("div");
        actions.className = "predict-comment-actions";
        const error = document.createElement("p");
        error.className = "donation-error";
        error.style.margin = "0";
        const btn = document.createElement("button");
        btn.className = "btn primary";
        btn.type = "button";
        btn.textContent = tr("support.reply", "Reply");
        btn.addEventListener("click", () => {
          const value = input.value.trim();
          if (!value) {
            error.textContent = tr("support.writeReply", "Write a reply first.");
            return;
          }
          submitOwnerReply(item.id, value, btn, error);
        });
        actions.appendChild(btn);
        replyWrap.appendChild(input);
        replyWrap.appendChild(actions);
        replyWrap.appendChild(error);
        row.appendChild(replyWrap);
      }

      listEl.appendChild(row);
    });
  }

  async function loadComments() {
    if (!client) return;
    const listEl = $("predictionComments");
    if (!listEl) return;

    const { data, error } = await client
      .from("predictions_comments")
      .select("id, comment, nickname, created_at, parent_id, author_type")
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) {
      console.error("Load comments error:", error);
      listEl.innerHTML = `<p class="muted">${tr("support.commentsUnavailable", "Comments unavailable right now.")}</p>`;
      return;
    }

    renderComments(data || []);
  }

  function initComments(client) {
    const input = $("predictionCommentInput");
    const nicknameInput = $("predictionNicknameInput");
    const honeypot = $("predictionWebsite");
    const charCount = $("predictionCharCount");
    const submitBtn = $("submitPredictionComment");
    const errorEl = $("predictionError");
    if (!input || !nicknameInput || !charCount || !submitBtn || !errorEl) return;

    function setError(message) { errorEl.textContent = message || ""; }

    function updateCharCount() {
      charCount.textContent = tr("support.chars", `${COMMENT_MAX_LENGTH - input.value.length} characters left`, { count: COMMENT_MAX_LENGTH - input.value.length });
    }

    async function submitComment() {
      const value = input.value.trim();
      const nickname = nicknameInput.value.trim();

      if (!nickname) return setError(tr("support.chooseNickname", "Please choose a nickname."));
      if (nickname.length < 3 || nickname.length > 24) {
        return setError(tr("support.nicknameLength", "Nickname must be 3–24 characters."));
      }
      if (!value) return setError(tr("support.writeFirst", "Write something first."));
      if (value.length > COMMENT_MAX_LENGTH) return setError(tr("support.commentLength", `Keep it under ${COMMENT_MAX_LENGTH} characters.`, { count: COMMENT_MAX_LENGTH }));

      setError("");
      submitBtn.disabled = true;
      submitBtn.textContent = tr("support.checking", "Checking...");

      try {
        const response = await fetch(PREDICTION_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            comment: value,
            nickname: nickname,
            website: honeypot?.value || ""
          })
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(result.error || tr("support.couldntPost", "Couldn't post your prediction. Try again."));
          return;
        }

        input.value = "";
        nicknameInput.value = "";
        if (honeypot) honeypot.value = "";
        updateCharCount();
        window.IWBRAnalytics?.trackEvent("prediction_submit");
        await loadComments();
      } catch (error) {
        console.error("Submit comment error:", error);
        setError(tr("support.systemError", "Couldn't reach the prediction system. Try again."));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = tr("support.post", "Post prediction");
      }
    }

    input.addEventListener("input", updateCharCount);
    submitBtn.addEventListener("click", submitComment);
    updateCharCount();
  }
})();
