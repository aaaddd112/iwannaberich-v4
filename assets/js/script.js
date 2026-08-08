(() => {
  "use strict";

  const GOAL = 1_000_000_000;
  const PAYMENT_LINKS = {
    patreon: "https://patreon.com/IwannaBeRich",
    revolut: "https://revolut.me/raulu8m39"
  };
  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const $ = (id) => document.getElementById(id);

  document.addEventListener("DOMContentLoaded", () => {
    initDonationModal();
    initScrollReveal();
    initFinancialCommentary();
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

  function renderWealth(total) {
    const value = $("wealthValue");
    const note = $("wealthNote");
    if (value) value.textContent = formatEuro(total);
    if (note) note.textContent = total ? "Updated from publicly recorded support." : "Be the first supporter. The progress bar is emotionally prepared.";
    updateProgress(total);
  }

  async function loadDonations() {
    if (!window.supabase) return;
    try {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await client.from("Donations").select("amount");
      if (error) throw error;
      const total = (data || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      renderWealth(total);
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
    const customAmount = $("customAmount");
    const error = $("donationError");
    const presetButtons = [...modal.querySelectorAll(".amount-button")];
    const methods = [...modal.querySelectorAll(".payment-card")];
    let amount = 0;
    let method = "patreon";
    let lastFocus = null;

    const open = () => {
      lastFocus = document.activeElement;
      modal.classList.add("show"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open");
      presetButtons[0]?.focus();
    };
    const closeModal = () => {
      modal.classList.remove("show"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("modal-open");
      lastFocus?.focus();
    };
    document.querySelectorAll("#openDonationModal, [data-open-donation]").forEach((button) => button.addEventListener("click", open));
    close?.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.classList.contains("show")) closeModal(); });
    presetButtons.forEach((button) => button.addEventListener("click", () => { amount = Number(button.dataset.value); customAmount.value = ""; presetButtons.forEach((item) => item.classList.toggle("active", item === button)); error.textContent = ""; }));
    customAmount?.addEventListener("input", () => { amount = Number(customAmount.value) || 0; presetButtons.forEach((item) => item.classList.remove("active")); error.textContent = ""; });
    methods.forEach((button) => button.addEventListener("click", () => { method = button.dataset.method; methods.forEach((item) => item.classList.toggle("selected", item === button)); }));
    continueButton?.addEventListener("click", () => {
      if (!(amount > 0)) { error.textContent = "Choose an amount first — even €1 counts."; return; }
      const link = PAYMENT_LINKS[method];
      if (!link) { error.textContent = "That payment method is not available yet."; return; }
      window.open(method === "revolut" ? `${link}?amount=${amount.toFixed(2)}&currency=EUR` : link, "_blank", "noopener,noreferrer");
      closeModal();
    });
  }

  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) { items.forEach((item) => item.classList.add("on")); return; }
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("on"); current.unobserve(entry.target); } }), { threshold: 0.1 });
    items.forEach((item) => observer.observe(item));
  }

  function initFinancialCommentary() {
    const notice = $("financialCommentary");
    const text = $("commentaryText");
    if (!notice || !text) return;

    const messages = [
      "Forbes has not returned our calls.",
      "Private jet budget: still theoretical.",
      "Confidence increased by an unverified amount.",
      "The spreadsheet remains cautiously optimistic.",
      "A yacht owner has not objected. Yet.",
      "Billionaire ETA: refresh the page emotionally, not literally.",
      "Business update: ambition remains fully funded.",
      "The plan has survived another day of scrutiny.",
      "Current valuation: vibes, plus a progress bar.",
      "No investors were harmed in this calculation."
    ];
    let previous = -1;
    const show = () => {
      if (document.hidden) { window.setTimeout(show, 10000); return; }
      let next;
      do { next = Math.floor(Math.random() * messages.length); } while (next === previous);
      previous = next;
      text.textContent = messages[next];
      notice.classList.add("show");
      window.setTimeout(() => notice.classList.remove("show"), 4800);
      window.setTimeout(show, 18000 + Math.floor(Math.random() * 10000));
    };
    window.setTimeout(show, 1500);
  }
})();
