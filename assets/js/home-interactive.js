/* IWANNABERICH interactive homepage layer */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SUPABASE_URL = 'https://ofcdtwrgyxjrpoxuikxg.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
  var VOTE_KEY = 'iwbr_next_experiment_vote_v3';
  var VOTE_ENDPOINT = SUPABASE_URL + '/rest/v1/rpc/vote_next_experiment';
  var READ_ENDPOINT = SUPABASE_URL + '/rest/v1/rpc/get_next_experiment_votes';
  var analytics = function (name, data) { if (window.IWBRAnalytics && window.IWBRAnalytics.trackEvent) window.IWBRAnalytics.trackEvent(name, data || {}); };
  var esc = function (value) { return String(value == null ? '' : value).replace(/[&<>\"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };

  document.body.classList.add('interactive-ready');

  // Preserve campaign/referral attribution from the first page someone visits.
  (function captureReferral() {
    try {
      var params = new URLSearchParams(window.location.search);
      var ref = params.get('ref') || params.get('g');
      if (ref && /^[a-z0-9_-]{2,80}$/i.test(ref.trim())) {
        localStorage.setItem('iwbr_referral', ref.trim().toLowerCase());
      }
    } catch (e) {}
  }());

  // Carry a stored referral into Account links so the attribution survives browsing.
  function patchReferralLinks() {
    var ref = null;
    try { ref = localStorage.getItem('iwbr_referral'); } catch (e) {}
    if (!ref) return;
    document.querySelectorAll('a[href="account.html"], a[href^="account.html?"]').forEach(function (link) {
      try {
        var url = new URL(link.getAttribute('href'), window.location.href);
        if (!url.searchParams.get('ref')) url.searchParams.set('ref', ref);
        link.setAttribute('href', url.pathname.split('/').pop() + '?' + url.searchParams.toString() + (url.hash || ''));
      } catch (e) {}
    });
  }

  // Subtle cursor spotlight on desktop.
  if (!reducedMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    var cursor = document.createElement('div');
    cursor.className = 'interactive-cursor';
    document.body.appendChild(cursor);
    window.addEventListener('pointermove', function (event) {
      cursor.style.left = event.clientX + 'px';
      cursor.style.top = event.clientY + 'px';
    }, { passive: true });
  }

  // Gentle 3D response for the main goal card.
  var goal = document.querySelector('.hero-goal');
  if (goal && !reducedMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    goal.addEventListener('pointermove', function (event) {
      var rect = goal.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      goal.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
      goal.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
      goal.style.transform = 'perspective(900px) rotateX(' + (-y * 3) + 'deg) rotateY(' + (x * 4) + 'deg) translateZ(0)';
    });
    goal.addEventListener('pointerleave', function () { goal.style.transform = ''; });
  }

  // Turn the four-step loop into a small interactive story.
  var loopSteps = Array.prototype.slice.call(document.querySelectorAll('.mission-loop-step'));
  if (loopSteps.length) {
    loopSteps.forEach(function (step, index) {
      step.addEventListener('click', function () {
        loopSteps.forEach(function (item) { item.classList.remove('is-active'); });
        step.classList.add('is-active');
        var card = document.querySelector('.mission-loop');
        if (card) {
          card.setAttribute('data-active-step', String(index + 1));
          card.classList.remove('is-pulsing');
          void card.offsetWidth;
          card.classList.add('is-pulsing');
        }
      });
    });
    if (!reducedMotion) {
      var activeIndex = 0;
      setInterval(function () {
        if (document.hidden) return;
        loopSteps.forEach(function (item) { item.classList.remove('is-active'); });
        loopSteps[activeIndex].classList.add('is-active');
        activeIndex = (activeIndex + 1) % loopSteps.length;
      }, 2800);
    }
  }

  // Animate the mission wealth number when the existing verified data layer updates it.
  var wealth = document.getElementById('missionWealthValue');
  if (wealth && !reducedMotion && typeof MutationObserver !== 'undefined') {
    var lastValue = wealth.textContent;
    var observer = new MutationObserver(function () {
      var nextValue = wealth.textContent;
      if (nextValue !== lastValue && /€/.test(nextValue)) {
        var card = document.querySelector('.mission-focus-card');
        if (card) {
          card.classList.remove('is-pulsing');
          void card.offsetWidth;
          card.classList.add('is-pulsing');
        }
        lastValue = nextValue;
      }
    });
    observer.observe(wealth, { childList: true, characterData: true, subtree: true });
  }

  function injectDecisionRoom() {
    if (document.getElementById('decision-room')) return;
    var mission = document.querySelector('.mission-focus');
    var journal = document.querySelector('.mission-journal');
    if (!mission || !journal) return;

    var section = document.createElement('section');
    section.id = 'decision-room';
    section.className = 'wrap reveal decision-room';
    section.setAttribute('aria-labelledby', 'decision-room-title');
    section.innerHTML = '' +
      '<div class="decision-room-head">' +
        '<div><p class="eyebrow">THE INTERNET GETS A SAY</p><h2 class="title" id="decision-room-title">What happens with the next €13?</h2><p class="lead">Pick the move. I will use the winning option for the next step and document what happens.</p></div>' +
        '<span class="decision-live"><i></i> LIVE DECISION</span>' +
      '</div>' +
      '<div class="decision-room-card card">' +
        '<div class="decision-options" id="decisionOptions">' +
          '<button class="decision-option" data-option="sell" type="button"><span><b>01</b> Flip something</span><strong>—</strong><small>—</small></button>' +
          '<button class="decision-option" data-option="digital" type="button"><span><b>02</b> Build a tiny digital product</span><strong>—</strong><small>—</small></button>' +
          '<button class="decision-option" data-option="hustle" type="button"><span><b>03</b> Try a ridiculous internet hustle</span><strong>—</strong><small>—</small></button>' +
        '</div>' +
        '<div class="decision-room-foot"><span id="decisionTotal">Loading the room...</span><span id="decisionStatus">One vote per browser.</span></div>' +
      '</div>' +
      '<div class="decision-after" id="decisionAfter" hidden><strong>Your vote is in.</strong><span>You just changed the public experiment. Want to explain your call?</span><a class="btn primary" href="community.html#make-prediction">Make your prediction →</a></div>';

    mission.parentNode.insertBefore(section, journal);
    addDecisionStyles();
    bindDecisionRoom(section);
  }

  function addDecisionStyles() {
    if (document.getElementById('decision-room-styles')) return;
    var style = document.createElement('style');
    style.id = 'decision-room-styles';
    style.textContent = '' +
      '.decision-room{padding-top:88px}.decision-room-head{display:flex;align-items:end;justify-content:space-between;gap:28px;margin-bottom:26px}.decision-room-head .lead{max-width:700px;margin-bottom:0}.decision-live{display:inline-flex;align-items:center;gap:8px;font:700 .72rem/1 monospace;letter-spacing:.12em;color:#aeb2bc;white-space:nowrap}.decision-live i{width:7px;height:7px;border-radius:50%;background:#7f5cff;box-shadow:0 0 14px rgba(127,92,255,.8);animation:decisionPulse 1.8s infinite}.decision-room-card{overflow:hidden}.decision-options{display:grid;grid-template-columns:repeat(3,1fr)}.decision-option{position:relative;min-height:150px;padding:26px;border:0;border-right:1px solid rgba(255,255,255,.08);background:transparent;color:inherit;text-align:left;cursor:pointer;transition:background .2s ease,transform .2s ease}.decision-option:last-child{border-right:0}.decision-option:hover{background:rgba(255,255,255,.035);transform:translateY(-2px)}.decision-option:disabled{cursor:default}.decision-option.is-selected{background:rgba(127,92,255,.10);box-shadow:inset 0 0 0 1px rgba(127,92,255,.35)}.decision-option span{display:block;font-size:1.05rem;line-height:1.45}.decision-option b{display:block;margin-bottom:18px;color:#777b86;font:700 .72rem monospace;letter-spacing:.12em}.decision-option strong{display:block;margin-top:22px;font:700 2rem/1 'Playfair Display',Georgia,serif}.decision-option small{display:block;margin-top:7px;color:#777b86}.decision-room-foot{display:flex;justify-content:space-between;gap:16px;padding:15px 22px;border-top:1px solid rgba(255,255,255,.08);color:#858995;font-size:.78rem}.decision-after{display:flex;align-items:center;gap:16px;margin-top:14px;padding:18px 20px;border:1px solid rgba(127,92,255,.22);border-radius:12px;background:rgba(127,92,255,.05)}.decision-after strong{white-space:nowrap}.decision-after span{color:#a8abb5;flex:1}.decision-after .btn{white-space:nowrap}@keyframes decisionPulse{0%,100%{opacity:.45}50%{opacity:1}}@media(max-width:800px){.decision-room{padding-top:64px}.decision-room-head{display:block}.decision-live{margin-top:18px}.decision-options{grid-template-columns:1fr}.decision-option{min-height:auto;border-right:0;border-bottom:1px solid rgba(255,255,255,.08)}.decision-option:last-child{border-bottom:0}.decision-room-foot{display:block}.decision-room-foot span{display:block}.decision-room-foot span+span{margin-top:6px}.decision-after{display:block}.decision-after span{display:block;margin:8px 0 14px}}@media(prefers-reduced-motion:reduce){.decision-live i{animation:none}.decision-option{transition:none}}';
    document.head.appendChild(style);
  }

  function bindDecisionRoom(section) {
    var buttons = Array.prototype.slice.call(section.querySelectorAll('.decision-option'));
    var totalEl = section.querySelector('#decisionTotal');
    var statusEl = section.querySelector('#decisionStatus');
    var after = section.querySelector('#decisionAfter');
    if (!buttons.length) return;

    function render(rows) {
      rows = Array.isArray(rows) ? rows : [];
      var total = rows.reduce(function (sum, row) { return sum + Number(row.vote_count || 0); }, 0);
      var counts = {};
      rows.forEach(function (row) { counts[row.option_code] = Number(row.vote_count || 0); });
      if (totalEl) totalEl.textContent = total ? total.toLocaleString('en-US') + ' votes so far' : 'Be the first to vote.';
      buttons.forEach(function (button) {
        var count = counts[button.dataset.option] || 0;
        var pct = total ? Math.round(count / total * 100) : 0;
        var strong = button.querySelector('strong');
        var small = button.querySelector('small');
        if (strong) strong.textContent = pct + '%';
        if (small) small.textContent = count + ' vote' + (count === 1 ? '' : 's');
      });
      var chosen = null;
      try { chosen = localStorage.getItem(VOTE_KEY); } catch (e) {}
      buttons.forEach(function (button) {
        button.classList.toggle('is-selected', button.dataset.option === chosen);
        button.disabled = Boolean(chosen);
      });
      if (chosen && after) after.hidden = false;
      if (chosen && statusEl) statusEl.textContent = 'Your vote: ' + chosen.toUpperCase();
    }

    function load() {
      return fetch(READ_ENDPOINT, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json' }, body: '{}' })
        .then(function (response) { if (!response.ok) throw new Error('Vote totals unavailable'); return response.json(); })
        .then(render)
        .catch(function () { if (totalEl) totalEl.textContent = 'Live totals temporarily unavailable.'; });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var chosen;
        try { chosen = localStorage.getItem(VOTE_KEY); } catch (e) { chosen = null; }
        if (chosen) return;
        var option = button.dataset.option;
        buttons.forEach(function (item) { item.disabled = true; });
        if (statusEl) statusEl.textContent = 'Recording your vote...';
        fetch(VOTE_ENDPOINT, { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ option_code: option }) })
          .then(function (response) {
            if (!response.ok) throw new Error('Vote could not be recorded');
            try { localStorage.setItem(VOTE_KEY, option); } catch (e) {}
            analytics('homepage_experiment_vote', { option: option });
            if (after) after.hidden = false;
            if (statusEl) statusEl.textContent = 'Your vote is part of the experiment.';
            return load();
          })
          .catch(function (error) {
            buttons.forEach(function (item) { item.disabled = false; });
            if (statusEl) statusEl.textContent = error.message || 'Vote failed. Try again.';
          });
      });
    });
    load();
  }

  // Add the decision room after the bridge removes the legacy experiment block.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      patchReferralLinks();
      setTimeout(injectDecisionRoom, 80);
    });
  } else {
    patchReferralLinks();
    setTimeout(injectDecisionRoom, 80);
  }

  var missionLoop = document.querySelector('.mission-loop');
  if (missionLoop && !missionLoop.querySelector('.home-interactive-hint')) {
    var hint = document.createElement('span');
    hint.className = 'home-interactive-hint';
    hint.textContent = 'Click a step';
    missionLoop.appendChild(hint);
  }
}());
