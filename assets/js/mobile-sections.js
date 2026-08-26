(() => {
  "use strict";

  const COLLAPSIBLE_IDS = ["why", "numbers", "plan", "rules", "log", "internet", "milestones"];
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/bJe5kDfSI9Zf5HEfgpaAw00";

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

  function setupDonationCheckout() {
    const modal = document.getElementById("donationModal");
    const continueButton = document.getElementById("continueDonation");
    const error = document.getElementById("donationError");
    const amountNote = document.getElementById("amountNote");
    if (!modal || !continueButton || continueButton.dataset.secureCheckoutReady === "true") return;

    const form = document.createElement("div");
    form.className = "donation-fields";
    form.innerHTML = `
      <label class="donation-field">
        <span>Nickname <em>optional</em></span>
        <input id="donationNickname" name="nickname" type="text" maxlength="40" placeholder="How should we list you?" autocomplete="nickname">
      </label>
      <p class="donation-field-note">Choose your contribution amount on the secure Stripe page. Your nickname appears publicly in Contributors. Leave it empty to stay anonymous.</p>
    `;
    amountNote?.replaceWith(form);

    const nicknameInput = document.getElementById("donationNickname");
    const style = document.createElement("style");
    style.textContent = `
      .donation-fields{display:grid;gap:12px;margin:18px 0}
      .donation-field{display:grid;gap:7px;text-align:left}
      .donation-field>span{font-size:.78rem;color:#a5a8b2;text-transform:uppercase;letter-spacing:.08em}
      .donation-field>span em{font-style:normal;text-transform:none;letter-spacing:0;color:#777e8a}
      .donation-field input{width:100%;border:1px solid #2a2a34;border-radius:10px;background:#111116;color:#f7f7f7;padding:13px 14px;outline:none}
      .donation-field input:focus{border-color:#a970ff;box-shadow:0 0 0 3px rgba(169,112,255,.12)}
      .donation-field-note{margin:-2px 0 0;color:#777e8a;font-size:.8rem;text-align:left;line-height:1.5}
      .continue-button[aria-busy="true"]{opacity:.7;pointer-events:none}
    `;
    document.head.appendChild(style);

    continueButton.dataset.secureCheckoutReady = "true";
    continueButton.textContent = "Continue to secure Stripe checkout →";
    if (amountNote) amountNote.textContent = "";

    document.addEventListener("click", (event) => {
      if (event.target !== continueButton && !continueButton.contains(event.target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (continueButton.getAttribute("aria-busy") === "true") return;
      if (error) error.textContent = "";

      const nickname = (nicknameInput?.value || "").trim();
      if (nickname.length > 40) {
        if (error) error.textContent = "Nickname must be 40 characters or fewer.";
        nicknameInput?.focus();
        return;
      }

      const reference = nickname
        ? nickname.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 200)
        : "";

      if (nickname && !reference) {
        if (error) error.textContent = "Please choose a nickname using letters or numbers.";
        nicknameInput?.focus();
        return;
      }

      continueButton.setAttribute("aria-busy", "true");
      continueButton.textContent = "Opening secure checkout…";
      window.IWBRAnalytics?.trackEvent("stripe_checkout", { has_nickname: Boolean(nickname) });

      const checkoutUrl = reference
        ? `${STRIPE_PAYMENT_LINK}?client_reference_id=${encodeURIComponent(reference)}`
        : STRIPE_PAYMENT_LINK;

      window.location.href = checkoutUrl;
    }, true);
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
    section.className = "wrap reveal suggestion-cta";
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
    setupDonationCheckout();
    setupSuggestionCTA();
    window.addEventListener("hashchange", openSectionFromHash);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
