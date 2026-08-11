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

  function updateMilestones(total) {
    document.querySelectorAll("[data-milestone]").forEach((milestone) => {
      const target = Number(milestone.dataset.milestone);
      const status = milestone.querySelector("em");
      if (!status) return;

      const unlocked = total >= target;
      const wasUnlocked = milestone.classList.contains("is-unlocked");
      milestone.classList.toggle("is-unlocked", unlocked);
      status.textContent = unlocked ? "UNLOCKED" : "LOCKED";

      if (unlocked && !wasUnlocked) {
        milestone.classList.add("is-new");
        window.setTimeout(() => milestone.classList.remove("is-new"), 850);
      }
    });
  }

  function updateNextMilestone(total) {
    const element = $("nextMilestone");
    if (!element) return;

    const milestones = [...document.querySelectorAll("[data-milestone]")]
      .map((item) => Number(item.dataset.milestone))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

    const next = milestones.find((target) => total < target);

    if (!next) {
      element.textContent = "Next milestone: €1 billion — somehow.";
      return;
    }

    const remaining = Math.max(next - total, 0);
    element.innerHTML = `Next milestone: <strong>${formatEuro(next)}</strong> — <strong>${formatEuro(remaining)} to go.</strong>`;
  }

  function updateFinancialStatus(total) {
    const element = $("financialStatusMetric");
    if (!element) return;

    let text = "Aggressively optimistic";
    if (total >= 1_000_000_000) text = "Billionaire";
    else if (total >= 1_000_000) text = "Millionaire-ish";
    else if (total >= 100_000) text = "Suspiciously solvent";
    else if (total >= 10_000) text = "Getting interesting";
    else if (total >= 1_000) text = "No longer theoretical";
    else if (total >= 100) text = "Mildly funded";
    else if (total > 0) text = "Technically funded";

    element.textContent = text;
  }

  function updateRiskProfile(total) {
    const element = $("riskProfileMetric");
    if (!element) return;

    let text = "Your call";
    if (total >= 1_000_000_000) text = "Apparently manageable";
    else if (total >= 1_000_000) text = "Historically questionable";
    else if (total >= 10_000) text = "Still unreasonable";
    else if (total >= 100) text = "Mostly emotional";
    else if (total > 0) text = "€" + total.toFixed(2) + " at stake";

    element.textContent = text;
  }

  function updateConfidence(total) {
    const element = $("confidenceMetric");
    if (!element) return;

    let text = "Unreasonable";
    if (total >= 1_000_000_000) text = "Fine.";
    else if (total >= 1_000_000) text = "Okay, this is happening";
    else if (total >= 1_000) text = "Concerningly plausible";
    else if (total >= 100) text = "Slightly less unreasonable";

    element.textContent = text;
  }

  let previousWealth = null;

  function renderWealth(total) {
    const value = $("wealthValue");
    const note = $("wealthNote");
    if (value) {
      value.textContent = formatEuro(total);
      if (previousWealth !== null && total !== previousWealth) {
        value.classList.remove("is-updating");
        void value.offsetWidth;
        value.classList.add("is-updating");
      }
    }
    if (note) note.textContent = total ? "Updated from publicly recorded support." : "Be the first supporter. The progress bar is emotionally prepared.";
    updateProgress(total);
    updateMilestones(total);
    updateNextMilestone(total);
    updateConfidence(total);
    updateFinancialStatus(total);
    updateRiskProfile(total);
    previousWealth = total;
  }

async function loadDonations() {
  if (!window.supabase) return;

  try {
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await client.rpc("get_current_wealth");

if (error) throw error;

renderWealth(Number(data) || 0);

  } catch (error) {
    console.warn("Could not load current support:", error);
    renderWealth(0);
  }
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
