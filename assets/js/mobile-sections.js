(() => {
  "use strict";

  const COLLAPSIBLE_IDS = ["why", "numbers", "plan", "rules", "log", "internet", "milestones"];

  function setupMobileSections() {
    if (window.matchMedia("(min-width: 621px)").matches) return;
    COLLAPSIBLE_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (!section || section.dataset.mobileAccordionReady === "true") return;
      const title = section.querySelector(".title");
      if (!title) return;
      const eyebrow = section.querySelector(":scope > .eyebrow");
      const body = document.createElement("div");
      body.className = "mobile-section-body";
      let node = title.nextElementSibling;
      while (node) { const next = node.nextElementSibling; body.appendChild(node); node = next; }
      const header = document.createElement("button");
      header.type = "button";
      header.className = "mobile-section-toggle";
      header.setAttribute("aria-expanded", "false");
      header.setAttribute("aria-controls", `${id}-mobile-body`);
      header.id = `${id}-mobile-toggle`;
      const label = document.createElement("span");
      label.className = "mobile-section-toggle-label";
      if (eyebrow) { const eyebrowClone = eyebrow.cloneNode(true); eyebrowClone.classList.add("mobile-section-eyebrow"); label.appendChild(eyebrowClone); }
      const titleClone = document.createElement("span");
      titleClone.className = "mobile-section-title";
      titleClone.innerHTML = title.innerHTML;
      titleClone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      label.appendChild(titleClone);
      const icon = document.createElement("span");
      icon.className = "mobile-section-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "+";
      header.append(label, icon);
      body.id = `${id}-mobile-body`;
      body.setAttribute("aria-labelledby", header.id);
      body.hidden = true;
      if (eyebrow) eyebrow.hidden = true;
      title.hidden = true;
      section.insertBefore(header, body);
      header.addEventListener("click", () => {
        const isOpen = header.getAttribute("aria-expanded") === "true";
        header.setAttribute("aria-expanded", String(!isOpen));
        body.hidden = isOpen;
        icon.textContent = isOpen ? "+" : "−";
        section.classList.toggle("mobile-section-open", !isOpen);
      });
      section.dataset.mobileAccordionReady = "true";
    });
  }

  function openSectionFromHash() {
    if (!window.matchMedia("(max-width: 620px)").matches) return;
    const id = window.location.hash.slice(1);
    if (!COLLAPSIBLE_IDS.includes(id)) return;
    const section = document.getElementById(id);
    const button = document.getElementById(`${id}-mobile-toggle`);
    const body = document.getElementById(`${id}-mobile-body`);
    const icon = button?.querySelector(".mobile-section-icon");
    if (!section || !button || !body) return;
    button.setAttribute("aria-expanded", "true");
    body.hidden = false;
    if (icon) icon.textContent = "−";
    section.classList.add("mobile-section-open");
    setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function setupSuggestionCTA() {
    const mission = document.getElementById("mission");
    const loop = document.querySelector(".mission-loop");
    const experiment = document.getElementById("current-experiment");
    const journal = document.getElementById("journal");
    if (!mission || !journal || mission.dataset.suggestionCtaReady === "true") return;

    loop?.remove();
    experiment?.remove();

    const section = document.createElement("section");
    section.className = "wrap suggestion-cta";
    section.setAttribute("aria-label", "Suggestions and proposals");
    section.innerHTML = `
      <div class="suggestion-cta-copy">
        <p class="eyebrow">COMMUNITY</p>
        <p class="suggestion-cta-text">Have a suggestion or a proposal? <a href="https://t.me/+gHnqpWw74CQyOTU0" target="_blank" rel="noopener">Send it to me on Telegram →</a></p>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .suggestion-cta{padding:64px 0 44px;border-top:1px solid rgba(255,255,255,.08)}
      .suggestion-cta-copy{display:flex;align-items:baseline;justify-content:space-between;gap:32px}
      .suggestion-cta .eyebrow{margin:0;flex:0 0 auto}
      .suggestion-cta-text{margin:0;color:#a8abb5;font-size:1rem;line-height:1.6}
      .suggestion-cta-text a{color:#f4f4f6;text-decoration:none;border-bottom:1px solid rgba(169,112,255,.55);padding-bottom:2px}
      .suggestion-cta-text a:hover{color:#b89aff;border-color:#b89aff}
      @media (max-width:620px){
        .suggestion-cta{padding:42px 0 30px}
        .suggestion-cta-copy{display:block}
        .suggestion-cta-text{margin-top:12px;font-size:.95rem}
      }
    `;
    document.head.appendChild(style);
    journal.parentNode.insertBefore(section, journal);
    mission.dataset.suggestionCtaReady = "true";
  }

  function init() {
    setupMobileSections();
    openSectionFromHash();
    setupSuggestionCTA();
    window.addEventListener("hashchange", openSectionFromHash);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
