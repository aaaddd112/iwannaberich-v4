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
        <span>Amount (EUR)</span>
        <input id="donationAmount" name="amount" type="number" min="0.50" max="10000" step="0.01" inputmode="decimal" placeholder="1.00" autocomplete="off">
      </label>
      <label class="donation-field">
        <span>Nickname <em>optional</em></span>
        <input id="donationNickname" name="nickname" type="text" maxlength="40" placeholder="How should we list you?" autocomplete="nickname">
      </label>
      <p class="donation-field-note">Your nickname appears publicly in Contributors. Leave it empty to stay anonymous.</p>
    `;

    amountNote?.replaceWith(form);

    const amountInput = document.getElementById("donationAmount");
    const nicknameInput = document.getElementById("donationNickname");

    const style = document.createElement("style");
    style.textContent = `
      .donation-fields{display:grid;gap:12px;margin:18px 0}
      .donation-field{display:grid;gap:7px;text-align:left}
      .donation-field>span{font-size:.78rem;color:#a5a8b2;text-transform:uppercase;letter-spacing:.08em}
      .donation-field>span em{font-style:normal;text-transform:none;letter-spacing:0;color:#777e8a}
      .donation-field input{width:100%;border:1px solid #2a2a34;border-radius:10px;background:#111116;color:#f7f7f7;padding:13px 14px;outline:none}
      .donation-field input:focus{border-color:#a970ff;box-shadow:0 0 0 3px rgba(169,112,255,.12)}
      .donation-field-note{margin:-2px 0 0;color:#777e8a;font-size:.8rem;text-align:left}
      .continue-button[aria-busy="true"]{opacity:.7;pointer-events:none}
    `;
    document.head.appendChild(style);

    continueButton.dataset.secureCheckoutReady = "true";
    continueButton.textContent = "Continue to secure Stripe checkout →";
    if (amountNote) amountNote.textContent = "";

    // Capture the click before the legacy Payment Link handler can run.
    document.addEventListener("click", async (event) => {
      if (event.target !== continueButton && !continueButton.contains(event.target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();

      if (continueButton.getAttribute("aria-busy") === "true") return;
      if (error) error.textContent = "";

      const amount = Number(amountInput?.value);
      const nickname = (nicknameInput?.value || "").trim();

      if (!Number.isFinite(amount) || amount < 0.5 || amount > 10000) {
        if (error) error.textContent = "Choose an amount between €0.50 and €10,000.";
        amountInput?.focus();
        return;
      }

      if (nickname.length > 40) {
        if (error) error.textContent = "Nickname must be 40 characters or fewer.";
        nicknameInput?.focus();
        return;
      }

      const checkoutWindow = window.open("about:blank", "_blank");
      continueButton.setAttribute("aria-busy", "true");
      continueButton.textContent = "Opening secure checkout…";

      try {
        const response = await fetch("https://ofcdtwrgyxjrpoxuikxg.supabase.co/functions/v1/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, nickname: nickname || null }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.url) throw new Error(payload.error || "Could not create the Stripe checkout.");

        window.IWBRAnalytics?.trackEvent("stripe_checkout", { amount, has_nickname: Boolean(nickname) });
        if (checkoutWindow) {
          checkoutWindow.location.href = payload.url;
        } else {
          window.location.href = payload.url;
        }

        document.getElementById("closeDonationModal")?.click();
      } catch (checkoutError) {
        checkoutWindow?.close();
        if (error) error.textContent = checkoutError instanceof Error ? checkoutError.message : "Could not open Stripe checkout.";
        continueButton.removeAttribute("aria-busy");
        continueButton.textContent = "Continue to secure Stripe checkout →";
      }
    }, true);
  }

  function init() {
    setupMobileSections();
    openSectionFromHash();
    setupDonationCheckout();
    window.addEventListener("hashchange", openSectionFromHash);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
