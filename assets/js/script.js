(() => {
  "use strict";

  const GOAL = 1_000_000_000;
  
const PAYMENT_LINKS = {
  kofi: "https://ko-fi.com/iwannaberich2026",
};
  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const $ = (id) => document.getElementById(id);

  document.addEventListener("DOMContentLoaded", () => {
    initDonationModal();
    initScrollReveal();
    initFinancialCommentary();
    initMicroInteractions();
    loadDonations();
  });

  function formatEuro(value) {
    return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(value);
  }

  function updateProgress(total) {
    const progress = Math.min((total / GOAL) * 100, 100);
    const fill = $("progressFill");
    const text = $("progressText");
    if (fill) fill.style.width = `${Math.max(progress, 0.25)}%`;
    if (text) text.textContent = total ? `${progress.toFixed(7)}% of the way there. Technically.` : "The bar is ready. The money is taking its time.";
  }

  async function loadDonations() {
    const wealthValue = $("wealthValue");
    const wealthNote = $("wealthNote");
    const nextMilestone = $("nextMilestone");

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_current_wealth`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },
        body: "{}"
      });

      if (!response.ok) throw new Error(`Supabase returned ${response.status}`);

      const payload = await response.json();
      const rawTotal = typeof payload === "number"
        ? payload
        : Array.isArray(payload)
          ? payload[0]
          : payload?.total ?? payload?.current_wealth ?? payload?.wealth ?? payload?.amount;
      const total = Number(rawTotal);

      if (!Number.isFinite(total)) throw new Error("Unexpected wealth response");

      if (wealthValue) wealthValue.textContent = formatEuro(total);
      if (wealthNote) wealthNote.textContent = "Updated from publicly recorded support.";
      updateProgress(total);
      updateMilestones(total);

      const targets = [...document.querySelectorAll("[data-milestone]")]
        .map((item) => Number(item.dataset.milestone))
        .filter(Number.isFinite)
        .sort((a, b) => a - b);
      const next = targets.find((target) => total < target);
      if (nextMilestone) {
        nextMilestone.textContent = next
          ? `Next milestone: ${formatEuro(next)} — ${formatEuro(Math.max(next - total, 0))} to go.`
          : "All listed milestones cleared. The billion remains.";
      }
    } catch (error) {
      console.error("Could not load verified wealth:", error);
      if (wealthNote) wealthNote.textContent = "Verified support is temporarily unavailable.";
      updateProgress(0);
      updateMilestones(0);
    }
  }

  function updateMilestones(total) {
  const milestones = [...document.querySelectorAll("[data-milestone]")];

  milestones.forEach((milestone, index) => {
    const target = Number(milestone.dataset.milestone);
    const status = milestone.querySelector("em");
    if (!status) return;

    const unlocked = total >= target;
    const isCurrent = !unlocked && (
      index === 0 || total >= Number(milestones[index - 1].dataset.milestone)
    );
    const wasUnlocked = milestone.classList.contains("is-unlocked");

    milestone.classList.toggle("is-unlocked", unlocked);
    milestone.classList.toggle("is-current", isCurrent);

    if (unlocked) {
      status.textContent = "UNLOCKED";
    } else if (isCurrent) {
      status.textContent = "STARTING";
    } else if (index === milestones.length - 1) {
      status.textContent = "???";
    } else {
      status.textContent = "LOCKED";
    }

    if (unlocked && !wasUnlocked) {
      milestone.classList.add("is-new");
      window.setTimeout(() => milestone.classList.remove("is-new"), 850);
    }
  });
}

  function initDonationModal() {
    const modal = $("donationModal");
    if (!modal) return;
    const close = $("closeDonationModal");
    const continueButton = $("continueDonation");
    const error = $("donationError");
    const methods = [...modal.querySelectorAll(".payment-card")];
    const amountButtons = [...modal.querySelectorAll(".amount-button")];
    const amountNote = $("amountNote");
    let method = "kofi";
    let suggestedAmount = Number(amountButtons[0]?.dataset.amount) || 5;
    let lastFocus = null;

    const open = () => {
      lastFocus = document.activeElement;
      modal.classList.add("show"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open");
      methods[0]?.focus();
    };
    const closeModal = () => {
      modal.classList.remove("show"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("modal-open");
      lastFocus?.focus();
    };
    document.querySelectorAll("#openDonationModal, [data-open-donation]").forEach((button) => button.addEventListener("click", open));
    close?.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.classList.contains("show")) closeModal(); });
    methods.forEach((button) => button.addEventListener("click", () => { method = button.dataset.method; methods.forEach((item) => item.classList.toggle("selected", item === button)); }));
    amountButtons.forEach((button) => button.addEventListener("click", () => {
      suggestedAmount = Number(button.dataset.amount) || 5;
      amountButtons.forEach((item) => item.classList.toggle("active", item === button));
      if (amountNote) amountNote.textContent = `Suggested: €${suggestedAmount}. Ko-fi will handle the actual payment.`;
      if (continueButton) continueButton.textContent = `Open Ko-fi & fund €${suggestedAmount} of the delusion`;
    }));

    continueButton?.addEventListener("click", () => {
      const link = PAYMENT_LINKS[method];

      if (!link) {
        error.textContent = "That payment method is not available yet.";
        return;
      }

      window.open(link, "_blank", "noopener,noreferrer");
      closeModal();
    });
  }

  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) { items.forEach((item) => item.classList.add("on")); return; }
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("on"); current.unobserve(entry.target); } }), { threshold: 0.1 });
    items.forEach((item) => observer.observe(item));
  }

  function initMicroInteractions() {
    const root = document.documentElement;
    let ticking = false;

    const updatePointerGlow = (event) => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        root.style.setProperty("--mouse-x", `${event.clientX}px`);
        root.style.setProperty("--mouse-y", `${event.clientY}px`);
        ticking = false;
      });
    };

    if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.addEventListener("pointermove", updatePointerGlow, { passive: true });
    }

    document.querySelectorAll(".btn, .payment-card, .continue-button").forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.remove("micro-pulse");
        void element.offsetWidth;
        element.classList.add("micro-pulse");
      });
    });
  }

  function initFinancialCommentary() {
    const notice = $("financialCommentary");
    const text = $("commentaryText");
    const amount = $("commentaryAmount");
    if (!notice || !text) return;

    const notifications = [
      { title: "🔔 Elon Musk has not responded yet.", amount: "Still waiting..." },
      { title: "🔔 Warren Buffett viewed your business plan.", amount: "No comment." },
      { title: "🔔 Jeff Bezos accidentally closed the tab.", amount: "Unfortunate." },
      { title: "🔔 Forbes is pretending not to notice.", amount: "For now." },
      { title: "🔔 Mark Cuban said 'interesting'.", amount: "That's basically an investment." },
      { title: "🔔 Your accountant has questions.", amount: "You don't have an accountant." },
      { title: "🔔 A billionaire was spotted nearby.", amount: "Probably unrelated." },
      { title: "🔔 The Forbes 30 Under 30 committee has concerns.", amount: "You were not nominated." },
      { title: "🔔 Someone searched 'how to become a billionaire'.", amount: "Excellent research." },
      { title: "🔔 Your net worth has been checked.", amount: "Still €1." },
      { title: "🔔 Financial Times has entered the chat.", amount: "They left immediately." },
      { title: "🔔 A venture capitalist asked for your pitch deck.", amount: "You don't have one." },
      { title: "🔔 Your mother asked what this website is.", amount: "You have no answer." },
      { title: "🔔 Someone on Reddit called this stupid.", amount: "Engagement is engagement." },
      { title: "🔔 Someone on Reddit actually liked the idea.", amount: "Suspicious." },
      { title: "🔔 The internet has been notified.", amount: "Nobody knows why." },
      { title: "🔔 Billionaire status detected.", amount: "False alarm." },
      { title: "🔔 Private jet department contacted you.", amount: "You don't have a private jet department." },
      { title: "🔔 Your financial advisor is typing...", amount: "You don't have one." },
      { title: "🔔 Forbes has refreshed the page.", amount: "Nothing changed." }
    ];

    let previous = -1;
    const show = () => {
      if (document.hidden) { window.setTimeout(show, 10000); return; }

      const isSmallScreen = window.matchMedia("(max-width: 560px)").matches;
      if (isSmallScreen && window.scrollY < 220) {
        window.setTimeout(show, 5000);
        return;
      }

      let next;
      do { next = Math.floor(Math.random() * notifications.length); } while (next === previous);
      previous = next;

      const item = notifications[next];
      text.textContent = item.title;
      if (amount) amount.textContent = item.amount;

      notice.classList.add("show");
      window.setTimeout(() => notice.classList.remove("show"), 4800);
      window.setTimeout(show, 18000 + Math.floor(Math.random() * 10000));
    };

    window.setTimeout(show, 1500);
  }
})();
