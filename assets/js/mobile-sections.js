(() => {
  "use strict";

  const COLLAPSIBLE_IDS = [
    "why",
    "numbers",
    "plan",
    "rules",
    "log",
    "internet",
    "milestones"
  ];

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
      while (node) {
        const next = node.nextElementSibling;
        body.appendChild(node);
        node = next;
      }

      const header = document.createElement("button");
      header.type = "button";
      header.className = "mobile-section-toggle";
      header.setAttribute("aria-expanded", "false");
      header.setAttribute("aria-controls", `${id}-mobile-body`);
      header.id = `${id}-mobile-toggle`;

      const label = document.createElement("span");
      label.className = "mobile-section-toggle-label";

      if (eyebrow) {
        const eyebrowClone = eyebrow.cloneNode(true);
        eyebrowClone.classList.add("mobile-section-eyebrow");
        label.appendChild(eyebrowClone);
      }

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

  function init() {
    setupMobileSections();
    openSectionFromHash();
    window.addEventListener("hashchange", openSectionFromHash);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
