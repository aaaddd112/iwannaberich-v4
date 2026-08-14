(() => {
  "use strict";

  const GOAL = 1_000_000_000;
  
const PAYMENT_LINKS = {
  stripe: "https://buy.stripe.com/bJe5kDfSI9Zf5HEfgpaAw00",
};
  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const $ = (id) => document.getElementById(id);

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initDropdownNav();
    initDonationModal();
    initScrollReveal();
    initFinancialCommentary();
    initShare();
    initMicroInteractions();
    initPersonalityLayer();
    loadDonations();
  });

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".links");
    if (!toggle || !nav) return;

    const closeNav = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }


  function initDropdownNav() {
    const dropdowns = [...document.querySelectorAll(".nav-dropdown")];
    if (!dropdowns.length) return;

    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector(".nav-drop-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = !dropdown.classList.contains("is-open");

        dropdowns.forEach((item) => {
          item.classList.remove("is-open");
          item.querySelector(".nav-drop-trigger")?.setAttribute("aria-expanded", "false");
        });

        dropdown.classList.toggle("is-open", willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
      });
    });

    document.addEventListener("click", () => {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".nav-drop-trigger")?.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".nav-drop-trigger")?.setAttribute("aria-expanded", "false");
      });
    });

    document.querySelectorAll(".card, .hero-card, .join-card, .split-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left - 80}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top - 80}px`);
      });
    });
  }

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
    let lastFocus = null;

    const open = () => {
      lastFocus = document.activeElement;
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      continueButton?.focus();
    };

    const closeModal = () => {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      lastFocus?.focus();
    };

    document.querySelectorAll("#openDonationModal, [data-open-donation]")
      .forEach((button) => button.addEventListener("click", open));

    close?.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("show")) closeModal();
    });

    continueButton?.addEventListener("click", () => {
      const link = PAYMENT_LINKS.stripe;

      if (!link) {
        if (error) error.textContent = "Stripe checkout is not available yet.";
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

  function initShare() {
    // Social share buttons use direct platform URLs from index.html.
  }

  function initFinancialCommentary() {
    const notice = $("financialCommentary");
    const text = $("commentaryText");
    const amount = $("commentaryAmount");
    if (!notice || !text) return;

    const notifications = [
      { title: "🔔 €1.00 has entered the building.", amount: "This changes everything. Probably." },
      { title: "🔔 Your net worth was checked.", amount: "Still suspiciously low." },
      { title: "🔔 The billionaire department called.", amount: "Wrong number." },
      { title: "🔔 Someone opened the business plan.", amount: "There is one page." },
      { title: "🔔 A financial advisor has concerns.", amount: "You don't have a financial advisor." },
      { title: "🔔 The internet has been notified.", amount: "Nobody knows what to do with this information." },
      { title: "🔔 Forbes has not called.", amount: "Everything is proceeding normally." },
      { title: "🔔 Your accountant is typing…", amount: "You don't have an accountant." },
      { title: "🔔 Someone suggested getting a real job.", amount: "Counterpoint: website." },
      { title: "🔔 Billionaire status detected.", amount: "False alarm. Very false alarm." },
      { title: "🔔 Someone on Reddit called this stupid.", amount: "Engagement is engagement." },
      { title: "🔔 Someone actually likes the idea.", amount: "Suspicious." },
      { title: "🔔 The plan has been reviewed.", amount: "The plan would like to appeal." },
      { title: "🔔 Your wealth increased by €1.00.", amount: "Please remain calm." },
      { title: "🔔 New financial strategy discovered.", amount: "Step 1: make money." },
      { title: "🔔 Private jet budget created.", amount: "Balance: €0.00." },
      { title: "🔔 This website is still online.", amount: "Against all odds." },
      { title: "🔔 Your billionaire application is pending.", amount: "Estimated wait: unreasonable." }
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
  function initPersonalityLayer() {
    const logo = document.querySelector("#logo");
    const wealthCard = document.querySelector(".wealth-card");
    const terminal = $("secretTerminal");
    const terminalBody = $("secretTerminalBody");
    const closeSecret = $("closeSecret");
    let logoClicks = 0;
    let wealthClicks = 0;
    let clickTimer = null;
    let typed = "";

    const openSecret = (mode) => {
      if (!terminal || !terminalBody) return;
      const messages = {
        logo: [
          "> connecting to billionaire_mainframe…",
          "> checking wealth…",
          "> checking ambition…",
          "> checking common sense…",
          "> ERROR: common sense not found.",
          ">",
          "> <span class=\"secret-purple\">CONGRATULATIONS.</span>",
          "> You found something that does absolutely nothing.",
          "> This is probably a metaphor."
        ],
        wealth: [
          "> opening restricted wealth controls…",
          "> current wealth: real",
          "> billionaire wealth: unavailable",
          "> solution: acquire more money",
          ">",
          "> <span class=\"secret-purple\">excellent strategy.</span>"
        ],
        rich: [
          "> command received: RICH",
          "> searching…",
          "> searching…",
          "> searching…",
          ">",
          "> result: <span class=\"secret-purple\">not yet</span>",
          "> keep trying."
        ],
        konami: [
          "> CHEAT CODE ACCEPTED",
          "> unlocking billionaire mode…",
          "> ███████████████ 100%",
          ">",
          "> billionaire mode status: <span class=\"secret-purple\">still locked</span>",
          "> nice try though."
        ]
      };
      terminalBody.innerHTML = messages[mode].join("\n");
      terminal.classList.add("show");
      terminal.setAttribute("aria-hidden","false");
      document.body.classList.add("secret-glitch");
      setTimeout(()=>document.body.classList.remove("secret-glitch"),900);
    };

    const close = () => { terminal?.classList.remove("show"); terminal?.setAttribute("aria-hidden","true"); };
    closeSecret?.addEventListener("click", close);
    terminal?.addEventListener("click", e=>{ if(e.target===terminal) close(); });

    logo?.addEventListener("click", e=>{
      logoClicks++;
      clearTimeout(clickTimer);
      clickTimer=setTimeout(()=>logoClicks=0,1200);
      if(logoClicks>=5){ e.preventDefault(); logoClicks=0; openSecret("logo"); }
    });

    wealthCard?.addEventListener("click",()=>{
      wealthClicks++;
      clearTimeout(clickTimer);
      clickTimer=setTimeout(()=>wealthClicks=0,1400);
      if(wealthClicks>=7){ wealthClicks=0; openSecret("wealth"); }
    });

    document.addEventListener("keydown", e=>{
      if(e.key.length===1) typed=(typed+e.key.toLowerCase()).slice(-12);
      if(typed.endsWith("rich")){ typed=""; openSecret("rich"); }
    });

    const konami=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let kp=0;
    document.addEventListener("keydown",e=>{
      const key=e.key;
      if(key===konami[kp] || key.toLowerCase()===konami[kp]) kp++; else kp=0;
      if(kp===konami.length){ kp=0; openSecret("konami"); }
    });

    // Very rare visual glitch: intentionally harmless and never changes financial data.
    const maybeGlitch=()=>{
      if(Math.random()>.72){
        document.body.classList.add("rare-glitch");
        setTimeout(()=>document.body.classList.remove("rare-glitch"),650);
      }
      setTimeout(maybeGlitch, 28000+Math.random()*22000);
    };
    setTimeout(maybeGlitch, 18000);
  }

})();
