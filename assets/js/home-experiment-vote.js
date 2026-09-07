/* Stable homepage experiment vote binding */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://ofcdtwrgyxjrpoxuikxg.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpZjZssTpA';
  var VOTE_KEY = 'iwbr_next_experiment_vote_v3';
  var VOTE_ENDPOINT = SUPABASE_URL + '/rest/v1/rpc/vote_next_experiment';
  var READ_ENDPOINT = SUPABASE_URL + '/rest/v1/rpc/get_next_experiment_votes';

  function apiOptions(body) {
    return {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body || {})
    };
  }

  function bind() {
    var root = document.getElementById('current-experiment');
    if (!root || root.dataset.voteBound === '1') return;

    var buttons = Array.prototype.slice.call(root.querySelectorAll('.experiment-option'));
    var totalEl = document.getElementById('experimentVoteTotal');
    if (!buttons.length) return;
    root.dataset.voteBound = '1';

    function render(rows) {
      rows = Array.isArray(rows) ? rows : [];
      var total = rows.reduce(function (sum, row) {
        return sum + Number(row.vote_count || 0);
      }, 0);
      var counts = {};
      rows.forEach(function (row) { counts[row.option_code] = Number(row.vote_count || 0); });

      if (totalEl) totalEl.textContent = total + (total === 1 ? ' vote so far' : ' votes so far');
      buttons.forEach(function (button) {
        var count = counts[button.dataset.option] || 0;
        var pct = total ? Math.round(count / total * 100) : 0;
        var strong = button.querySelector('.experiment-option-result strong');
        var small = button.querySelector('.experiment-option-result small');
        if (strong) strong.textContent = pct + '%';
        if (small) small.textContent = count + (count === 1 ? ' vote' : ' votes');
      });

      var chosen = null;
      try { chosen = localStorage.getItem(VOTE_KEY); } catch (e) {}
      buttons.forEach(function (button) {
        button.classList.toggle('is-selected', button.dataset.option === chosen);
        button.disabled = Boolean(chosen);
      });
    }

    function load() {
      return fetch(READ_ENDPOINT, apiOptions())
        .then(function (response) {
          if (!response.ok) throw new Error('Vote totals unavailable');
          return response.json();
        })
        .then(render)
        .catch(function () {
          if (totalEl) totalEl.textContent = 'Live vote totals temporarily unavailable.';
        });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var chosen = null;
        try { chosen = localStorage.getItem(VOTE_KEY); } catch (e) {}
        if (chosen) return;

        buttons.forEach(function (item) { item.disabled = true; });
        if (totalEl) totalEl.textContent = 'Recording your vote...';

        fetch(VOTE_ENDPOINT, apiOptions({ option_code: button.dataset.option }))
          .then(function (response) {
            if (!response.ok) throw new Error('Vote could not be recorded');
            try { localStorage.setItem(VOTE_KEY, button.dataset.option); } catch (e) {}
            if (window.IWBRAnalytics && window.IWBRAnalytics.trackEvent) {
              window.IWBRAnalytics.trackEvent('homepage_experiment_vote', { option: button.dataset.option });
            }
            return load();
          })
          .catch(function (error) {
            buttons.forEach(function (item) { item.disabled = false; });
            if (totalEl) totalEl.textContent = error.message || 'Vote failed. Try again.';
          });
      });
    });

    load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
})();
