(() => {
  "use strict";

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia?.("(pointer: fine)").matches;

  function injectStyle() {
    if (document.getElementById("home-experience-v2-style")) return;
    const style = document.createElement("style");
    style.id = "home-experience-v2-style";
    style.textContent = `
      .home-v2-ambient{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;opacity:.8}
      .home-v2-ambient:before{content:"";position:absolute;width:46vw;height:46vw;left:var(--hx,50%);top:var(--hy,20%);transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.06),transparent 68%);filter:blur(14px);transition:left .7s ease,top .7s ease}
      body>*:not(.home-v2-ambient){position:relative;z-index:1}
      .hero-goal{transform-style:preserve-3d}
      .home-v2-scroll-cue{display:flex;justify-content:center;align-items:center;gap:10px;margin:18px auto 0;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;opacity:.5}
      .home-v2-scroll-cue span{display:grid;place-items:center;width:24px;height:32px;border:1px solid currentColor;border-radius:999px;animation:homeV2Bob 1.8s ease-in-out infinite}
      @keyframes homeV2Bob{0%,100%{transform:translateY(0);opacity:.45}50%{transform:translateY(5px);opacity:1}}
      .home-v2-story{margin:9vh auto 10vh}
      .home-v2-story-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:28px}
      .home-v2-track{height:5px;border-radius:99px;background:rgba(255,255,255,.09);position:relative}
      .home-v2-track-fill{height:100%;width:0;border-radius:99px;background:currentColor;transition:width 1.1s cubic-bezier(.2,.8,.2,1)}
      .home-v2-nodes{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:22px}
      .home-v2-node{text-align:center;opacity:.38;transition:opacity .3s ease,transform .3s ease}
      .home-v2-node:before{content:"";display:block;width:11px;height:11px;margin:-28px auto 10px;border:2px solid currentColor;border-radius:50%;background:#09090b;transition:transform .3s ease}
      .home-v2-node.active,.home-v2-node.passed{opacity:1}
      .home-v2-node.active{transform:translateY(-4px)}
      .home-v2-node.active:before,.home-v2-node.passed:before{transform:scale(1.2)}
      .home-v2-node strong{display:block;font-size:.86rem}.home-v2-node small{opacity:.6}
      .home-v2-participate{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:8vh auto}
      .home-v2-participate .card{min-height:150px;display:flex;flex-direction:column;justify-content:space-between}
      .home-v2-participate .v2-index{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.72rem;opacity:.5}
      .home-v2-participate .v2-arrow{font-size:1.2rem;opacity:.5;transition:transform .25s ease}
      .home-v2-participate .card:hover .v2-arrow{transform:translate(4px,-4px)}
      .home-v2-live{display:flex;align-items:center;gap:8px;font-size:.72rem;opacity:.65}
      .home-v2-live i{display:block;width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 0 5px rgba(255,255,255,.05);animation:homeV2Pulse 1.8s ease-in-out infinite}
      @keyframes homeV2Pulse{50%{opacity:.35;transform:scale(.8)}}
      .home-v2-wealth-bump{animation:homeV2Bump .7s ease}
      @keyframes homeV2Bump{35%{transform:scale(1.035)}100%{transform:scale(1)}}
      @media(max-width:700px){
        .home-v2-ambient{display:none}.home-v2-story{margin:7vh auto}.home-v2-story-head{display:block}.home-v2-nodes{grid-template-columns:repeat(3,1fr);row-gap:28px}.home-v2-participate{grid-template-columns:1fr;margin:6vh auto}.home-v2-participate .card{min-height:120px}.home-v2-node:before{margin-top:-28px}
      }
      @media(prefers-reduced-motion:reduce){.home-v2-scroll-cue span,.home-v2-live i{animation:none}.home-v2-ambient:before,.home-v2-track-fill{transition:none}.hero-goal,.home-v2-participate .v2-arrow{transition:none}}
    `;
    document.head.appendChild(style);
  }

  function addAmbient() {
    if (reduceMotion || !finePointer || document.querySelector(".home-v2-ambient")) return;
    const ambient = document.createElement("div");
    ambient.className = "home-v2-ambient";
    ambient.setAttribute("aria-hidden", "true");
    document.body.prepend(ambient);
    let ticking = false;
    window.addEventListener("pointermove", (event) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ambient.style.setProperty("--hx", `${event.clientX}px`);
        ambient.style.setProperty("--hy", `${event.clientY}px`);
        ticking = false;
      });
    }, { passive: true });
  }

  function addScrollCue() {
    const hero = document.querySelector(".hero");
    if (!hero || document.querySelector(".home-v2-scroll-cue")) return;
    const cue = document.createElement("div");
    cue.className = "home-v2-scroll-cue";
    cue.innerHTML = '<span aria-hidden="true">↓</span> Explore the experiment';
    hero.appendChild(cue);
  }

  function addGoalTilt() {
    const card = document.querySelector(".hero-goal");
    if (!card || reduceMotion || !finePointer) return;
    card.addEventListener("pointermove", (event) => {
      const r = card.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - .5;
      const y = (event.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 4}deg) translateY(-2px)`;
    }, { passive: true });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  }

  function addProgressStory() {
    if (document.querySelector(".home-v2-story")) return;
    const mission = document.querySelector(".mission-focus");
    if (!mission) return;
    const section = document.createElement("section");
    section.className = "wrap home-v2-story reveal";
    section.setAttribute("aria-labelledby", "home-v2-story-title");
    section.innerHTML = `
      <div class="home-v2-story-head"><div><p class="eyebrow">THE ROAD TO €1B</p><h2 class="title" id="home-v2-story-title">One absurd milestone<br/><span class="plan-accent">at a time.</span></h2></div><div class="home-v2-live"><i aria-hidden="true"></i><span>LIVE EXPERIMENT</span></div></div>
      <div class="home-v2-track" aria-hidden="true"><div class="home-v2-track-fill"></div></div>
      <div class="home-v2-nodes">
        <div class="home-v2-node" data-v2-target="100"><strong>€100</strong><small>First test</small></div>
        <div class="home-v2-node" data-v2-target="1000"><strong>€1K</strong><small>Momentum</small></div>
        <div class="home-v2-node" data-v2-target="10000"><strong>€10K</strong><small>Proof</small></div>
        <div class="home-v2-node" data-v2-target="100000"><strong>€100K</strong><small>Scale</small></div>
        <div class="home-v2-node" data-v2-target="1000000"><strong>€1M</strong><small>Serious</small></div>
        <div class="home-v2-node" data-v2-target="1000000000"><strong>€1B</strong><small>The plan</small></div>
      </div>`;
    mission.parentNode.insertBefore(section, mission.nextSibling);
  }

  function addParticipation() {
    if (document.querySelector(".home-v2-participate")) return;
    const experiment = document.querySelector(".current-experiment");
    if (!experiment) return;
    const section = document.createElement("section");
    section.className = "wrap home-v2-participate reveal";
    section.setAttribute("aria-labelledby", "home-v2-participate-title");
    section.innerHTML = `
      <div style="grid-column:1/-1"><p class="eyebrow">YOU ARE NOT JUST WATCHING</p><h2 class="title" id="home-v2-participate-title">Take part in the experiment.</h2></div>
      <a class="card" href="account.html"><span class="v2-index">01</span><div><h3>Create an account</h3><p class="muted">Build your public identity and track your participation.</p></div><span class="v2-arrow">↗</span></a>
      <a class="card" href="community.html"><span class="v2-index">02</span><div><h3>Start a thread</h3><p class="muted">Pitch ideas, debate the next move and influence what happens.</p></div><span class="v2-arrow">↗</span></a>
      <a class="card" href="community.html"><span class="v2-index">03</span><div><h3>Make a prediction</h3><p class="muted">Put your call on the record and see whether you were right.</p></div><span class="v2-arrow">↗</span></a>`;
    experiment.parentNode.insertBefore(section, experiment.nextSibling);
  }

  function updateStory(total) {
    const nodes = [...document.querySelectorAll(".home-v2-node")];
    if (!nodes.length || !Number.isFinite(total)) return;
    const goal = 1e9;
    const ratio = Math.min(Math.max(total / goal, 0), 1);
    const fill = document.querySelector(".home-v2-track-fill");
    if (fill) fill.style.width = `${Math.max(ratio * 100, total > 0 ? .5 : 0)}%`;
    nodes.forEach((node) => {
      const target = Number(node.dataset.v2Target);
      node.classList.toggle("passed", total >= target);
      node.classList.toggle("active", total < target && (nodes.indexOf(node) === 0 || total >= Number(nodes[nodes.indexOf(node) - 1].dataset.v2Target)));
    });
  }

  function watchWealth() {
    const wealth = document.getElementById("missionWealthValue");
    if (!wealth) return;
    let last = wealth.textContent;
    const observer = new MutationObserver(() => {
      if (wealth.textContent === last) return;
      last = wealth.textContent;
      const numeric = Number((last || "").replace(/[^0-9.,-]/g, "").replace(/,/g, ""));
      if (Number.isFinite(numeric)) updateStory(numeric);
      if (!reduceMotion) {
        wealth.classList.remove("home-v2-wealth-bump");
        void wealth.offsetWidth;
        wealth.classList.add("home-v2-wealth-bump");
      }
    });
    observer.observe(wealth, { childList:true, characterData:true, subtree:true });
    const numeric = Number((last || "").replace(/[^0-9.,-]/g, "").replace(/,/g, ""));
    if (Number.isFinite(numeric)) updateStory(numeric);
  }

  function init() {
    if (!document.querySelector(".hero")) return;
    injectStyle();
    addAmbient();
    addScrollCue();
    addGoalTilt();
    addProgressStory();
    addParticipation();
    watchWealth();
    requestAnimationFrame(() => document.querySelectorAll(".home-v2-story,.home-v2-participate").forEach((el) => el.classList.add("on")));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})();
