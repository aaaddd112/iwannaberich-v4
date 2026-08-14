(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const PREDICTION_ENDPOINT = `${SUPABASE_URL}/functions/v1/submit-prediction`;
  const VOTE_STORAGE_KEY = "iwbr_prediction_vote";
  const COMMENT_MAX_LENGTH = 280;

  const $ = (id) => document.getElementById(id);

  function init() {
    if (!window.supabase) {
      console.warn("Supabase library not available.");
      return;
    }

    let client;
    try {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (error) {
      console.error("Supabase initialization failed:", error);
      return;
    }

    initVoting(client);
    initComments(client);
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
        ? `${total.toLocaleString("en-US")} vote${total === 1 ? "" : "s"} so far`
        : "Be the first to vote.";
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
        totalEl.textContent = "Votes unavailable right now.";
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
  }

  function initComments(client) {
    const input = $("predictionCommentInput");
    const honeypot = $("predictionWebsite");
    const charCount = $("predictionCharCount");
    const submitBtn = $("submitPredictionComment");
    const errorEl = $("predictionError");
    const listEl = $("predictionComments");
    const emptyEl = $("predictionCommentsEmpty");

    if (!input || !charCount || !submitBtn || !errorEl || !listEl || !emptyEl) return;

    function setError(message) {
      errorEl.textContent = message || "";
    }

    function updateCharCount() {
      const remaining = COMMENT_MAX_LENGTH - input.value.length;
      charCount.textContent = `${remaining} characters left`;
    }

    function renderComments(comments) {
      listEl.innerHTML = "";
      if (!comments.length) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.id = "predictionCommentsEmpty";
        empty.textContent = "No comments yet. Be the first.";
        listEl.appendChild(empty);
        return;
      }

      comments.forEach((item) => {
        const row = document.createElement("div");
        row.className = "predict-comment";
        const p = document.createElement("p");
        p.textContent = `"${item.comment}"`;
        row.appendChild(p);
        listEl.appendChild(row);
      });
    }

    async function loadComments() {
      const { data, error } = await client
        .from("predictions_comments")
        .select("comment, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Load comments error:", error);
        listEl.innerHTML = "";
        const failed = document.createElement("p");
        failed.className = "muted";
        failed.textContent = "Comments unavailable right now.";
        listEl.appendChild(failed);
        return;
      }
      renderComments(data || []);
    }

    async function submitComment() {
      const value = input.value.trim();
      if (!value) return setError("Write something first.");
      if (value.length > COMMENT_MAX_LENGTH) return setError(`Keep it under ${COMMENT_MAX_LENGTH} characters.`);

      setError("");
      submitBtn.disabled = true;
      submitBtn.textContent = "Checking...";

      try {
        const response = await fetch(PREDICTION_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            comment: value,
            website: honeypot?.value || "",
          }),
        });

        let result = {};
        try { result = await response.json(); } catch (_) {}

        if (!response.ok) {
          setError(result.error || "Couldn't post your prediction. Try again.");
          return;
        }

        input.value = "";
        if (honeypot) honeypot.value = "";
        updateCharCount();
        await loadComments();
      } catch (error) {
        console.error("Submit comment error:", error);
        setError("Couldn't reach the prediction system. Try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Post prediction";
      }
    }

    input.addEventListener("input", updateCharCount);
    submitBtn.addEventListener("click", submitComment);
    updateCharCount();
    loadComments();
  }
})();
