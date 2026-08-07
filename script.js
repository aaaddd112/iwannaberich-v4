(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

/* =========================
   DONATION MODAL
========================= */

function initDonationModal() {

  const modal = document.getElementById("donationModal");
  const closeBtn = document.getElementById("closeDonationModal");

  // Butonul Donate existent pe site

const donateButton =
document.getElementById("openDonationModal");

donateButton.addEventListener("click", () => {

    modal.classList.add("show");

});

  });

  closeBtn.addEventListener("click", () => {

    modal.classList.remove("show");

  });

  modal.addEventListener("click", e => {

    if (e.target === modal) {

      modal.classList.remove("show");

    }



}


  function init() {
    initLoadingScreen();
    initNotifications();
    initDonationModal();
    initCalculator();
    initCursorGlow();
    initScrollReveal();
    initAchievement();
    initSupabase();
  }

  /* =========================
     HELPERS
  ========================= */

  const $ = (id) => document.getElementById(id);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  /* =========================
     LOADING SCREEN
  ========================= */

  function initLoadingScreen() {
    const loadingScreen = $("loadingScreen");
    const loadingStatus = $("loadingStatus");

    if (!loadingScreen || !loadingStatus) {
      return;
    }

    const messages = [
    "Analyzing your wealth...",
    "Checking generosity...",
    "Contacting billionaires...",
    "Calculating impossible odds...",
    "Loading investment opportunity...",
    "Preparing dashboard..."
    ];

    if (prefersReducedMotion) {
      loadingScreen.classList.add("hidden");
      return;
    }

    let currentIndex = 0;

    const updateMessage = () => {
      if (currentIndex >= messages.length) {
        loadingScreen.classList.add("hidden");
        return;
      }

      loadingStatus.style.opacity = "0";

      window.setTimeout(() => {
        setText(loadingStatus, messages[currentIndex]);
        loadingStatus.style.opacity = "1";
      }, 250);

      currentIndex++;

      if (currentIndex === messages.length) {
        window.setTimeout(() => {
          loadingScreen.classList.add("hidden");
        }, 900);
      } else {
        window.setTimeout(updateMessage, 850);
      }
    };

    updateMessage();
  }

 /* =========================
   LIVE WEALTH VALUE
========================= */

function initWealthValue(total = 0) {
  const wealthValue = $("wealthValue");
  const wealthNote = $("wealthNote");

  if (!wealthValue || !wealthNote) {
    return;
  }

  setText(
    wealthValue,
    "€" + total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  );

  if (total === 0) {
    setText(
      wealthNote,
      "Be the first supporter."
    );
  } else {
    setText(
      wealthNote,
      `${total.toFixed(2)}€ raised from supporters.`
    );
  }
}

/* =========================
   PROGRESS BAR
========================= */

function updateProgress(total) {

    const GOAL = 1000000000; // 1 miliard €

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    if (!progressFill || !progressText) return;

    const percent = (total / GOAL) * 100;

    progressFill.style.width = percent + "%";

    progressText.textContent =
        "Progress: " +
        percent.toFixed(8) +
        "%";
}

/* =========================
   LEADERBOARD
========================= */

function updateLeaderboard(donations) {

    const leaderboard = document.getElementById("leaderboard");

    if (!leaderboard) return;

    leaderboard.innerHTML = "";

    const totals = {};

    donations.forEach(donation => {

        const name = donation.nickname || "Anonymous";

        totals[name] = (totals[name] || 0) + Number(donation.amount);

    });

    const ranking = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    ranking.forEach(([name, amount], index) => {

        const row = document.createElement("div");

        row.className = "leaderboard-row";

        let medal = "";

        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";
        else medal = "#" + (index + 1);

        row.innerHTML = `
            <span>${medal} ${name}</span>
            <strong>€${amount.toFixed(2)}</strong>
        `;

        leaderboard.appendChild(row);

    });

}
  /* =========================
     RANDOM NOTIFICATIONS
  ========================= */

  function initNotifications() {
    const notification = $("notification");
    const notificationTitle = $("notificationTitle");
    const notificationAmount = $("notificationAmount");

    if (!notification || !notificationTitle || !notificationAmount) {
      return;
    }
   const notifications = [


  // ===== Visitors =====
  { title: "👀 A visitor from Germany is exploring the challenge.", amount: "Just now" },
  { title: "🌍 Someone joined from Canada.", amount: "18 sec ago" },
  { title: "🇬🇧 A visitor from London opened the roadmap.", amount: "35 sec ago" },
  { title: "🇯🇵 Someone from Tokyo is checking the numbers.", amount: "1 min ago" },
  { title: "🇸🇪 Sweden just appeared on the map.", amount: "1 min ago" },
  { title: "🇫🇷 Paris stopped by for a moment.", amount: "2 min ago" },
  { title: "🇳🇱 A visitor from Amsterdam is browsing.", amount: "2 min ago" },
  { title: "🇵🇱 Someone from Warsaw is reading the plan.", amount: "3 min ago" },
  { title: "🇪🇸 Barcelona joined the challenge.", amount: "4 min ago" },
  { title: "🇮🇹 Milan is now represented.", amount: "5 min ago" },
  { title: "🇺🇸 A visitor from New York arrived.", amount: "6 min ago" },
  { title: "🇦🇺 Sydney checked the leaderboard.", amount: "7 min ago" },
  { title: "🌎 Another international visitor appeared.", amount: "8 min ago" },
  { title: "🧭 Someone is reading the strategy.", amount: "Live" },
  { title: "📖 A visitor opened The Plan section.", amount: "Live" },
  { title: "📊 Someone is comparing the numbers.", amount: "Live" },
  { title: "🔍 A curious visitor is doing research.", amount: "Live" },
  { title: "💡 Someone stayed longer than average.", amount: "Interesting" },
  { title: "👋 A returning visitor came back.", amount: "Today" },
  { title: "🌐 Another browser connected.", amount: "Online" },

  // ===== Progress =====
  { title: "📈 Progress has been recalculated.", amount: "Live" },
  { title: "🎯 Every euro moves the goal closer.", amount: "Current mission" },
  { title: "⚡ Live activity detected.", amount: "Now" },
  { title: "💰 Net worth simulation updated.", amount: "Automatic" },
  { title: "📊 Dashboard statistics refreshed.", amount: "Live" },
  { title: "🚀 The journey continues.", amount: "Always" },
  { title: "📉 Distance to €1B is shrinking.", amount: "Very slowly" },
  { title: "🌱 Small progress is still progress.", amount: "Reminder" },
  { title: "🏁 Goal remains unchanged: €1,000,000,000.", amount: "Locked in" },
  { title: "📡 Live feed synchronized.", amount: "Connected" },
  { title: "💚 Support keeps the challenge alive.", amount: "Thank you" },
  { title: "🔥 Momentum is building.", amount: "Steady" },
  { title: "📌 Mission status updated.", amount: "Active" },
  { title: "⏳ Billionaire ETA: Unknown.", amount: "Calculating" },
  { title: "🪙 Every contribution counts.", amount: "Always" },

  // ===== Billionaire jokes =====
  { title: "💼 Warren Buffett is still thinking about it.", amount: "Probably" },
  { title: "🚀 Elon Musk left the tab open.", amount: "Unconfirmed" },
  { title: "🏦 Jeff Bezos remains financially unavailable.", amount: "Busy" },
  { title: "📞 Bill Gates hasn't called back yet.", amount: "Still waiting" },
  { title: "🦈 Shark Tank has not responded.", amount: "No update" },
  { title: "🛥️ A yacht owner looked... then left.", amount: "Understandable" },
  { title: "💳 Credit card confidence increased by 0.01%.", amount: "Science" },
  { title: "📉 Billionaire probability adjusted.", amount: "Optimistic" },
  { title: "🏆 Forbes is not updating the rankings yet.", amount: "Soon™" },
  { title: "💸 Still cheaper than buying Twitter.", amount: "Fact" },
  { title: "🥲 Lamborghini dealer remains patient.", amount: "For now" },
  { title: "🏝️ Private island postponed.", amount: "Again" },
  { title: "💎 Unicorn investor not found.", amount: "Searching..." },
  { title: "🐋 Whale detected... false alarm.", amount: "Oops" },
  { title: "🛩️ Private jet traffic increased by 0%.", amount: "Accurate" },

  // ===== Fun =====
  { title: "☕ Someone came for the memes and stayed for the mission.", amount: "Respect" },
  { title: "😄 Another dreamer joined the challenge.", amount: "Welcome" },
  { title: "🎉 The impossible is still on the roadmap.", amount: "Good" },
  { title: "🌟 Motivation level: High.", amount: "Today" },
  { title: "🤝 Community support is growing.", amount: "Slowly" }

];
    let lastIndex = -1;
    let notificationTimer = null;
    let hideTimer = null;

    function getNextNotification() {
      if (notifications.length === 1) {
        return notifications[0];
      }

      let index;

      do {
        index = Math.floor(Math.random() * notifications.length);
      } while (index === lastIndex);

      lastIndex = index;
      return notifications[index];
    }

    function hideNotification() {
      notification.classList.remove("show");
    }

    function showNotification() {
      if (document.hidden) {
        scheduleNotification();
        return;
      }

      const item = getNextNotification();

      setText(notificationTitle, item.title);
      setText(notificationAmount, item.amount);

      notification.classList.remove("show");

      requestAnimationFrame(() => {
        notification.classList.add("show");
      });

      window.clearTimeout(hideTimer);

      hideTimer = window.setTimeout(() => {
        hideNotification();
      }, 4500);

      scheduleNotification();
    }

    function scheduleNotification() {
      window.clearTimeout(notificationTimer);

      const delay = Math.floor(Math.random() * 14000) + 6000;

      notificationTimer = window.setTimeout(showNotification, delay);
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !notification.classList.contains("show")) {
        scheduleNotification();
      }
    });

    notification.addEventListener("click", hideNotification);

    notificationTimer = window.setTimeout(showNotification, 7000);
  }

  /* =========================
     CALCULATOR
  ========================= */

  function initCalculator() {
    const peopleSlider = $("peopleSlider");
    const donationSlider = $("donationSlider");
    const peopleValue = $("peopleValue");
    const donationValue = $("donationValue");
    const calculatorResult = $("calculatorResult");
    const calculatorMessage = $("calculatorMessage");

    if (
      !peopleSlider ||
      !donationSlider ||
      !peopleValue ||
      !donationValue ||
      !calculatorResult ||
      !calculatorMessage
    ) {
      return;
    }

    function updateCalculator() {
      const people = Number(peopleSlider.value) || 0;
      const donation = Number(donationSlider.value) || 0;
      const total = people * donation;

      setText(peopleValue, formatNumber(people));
      setText(donationValue, `€${formatNumber(donation)}`);
      setText(calculatorResult, `€${formatNumber(total)}`);

      if (total >= 1000000000) {
        setText(
          calculatorMessage,
          "Financial history has officially been made."
        );
      } else if (total >= 100000000) {
        setText(
          calculatorMessage,
          "We're getting dangerously optimistic."
        );
      } else if (total >= 1000000) {
        setText(
          calculatorMessage,
          "That's enough to start pretending this is a company."
        );
      } else {
        setText(
          calculatorMessage,
          "That's not the goal yet. But it's a start."
        );
      }
    }

    peopleSlider.addEventListener("input", updateCalculator);
    donationSlider.addEventListener("input", updateCalculator);

    updateCalculator();
  }

  /* =========================
     CURSOR GLOW
  ========================= */

  function initCursorGlow() {
    if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let animationFrame = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function updateGlow() {
      document.documentElement.style.setProperty(
        "--mouse-x",
        `${mouseX}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${mouseY}px`
      );

      animationFrame = null;
    }

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!animationFrame) {
        animationFrame = requestAnimationFrame(updateGlow);
      }
    });
  }

  /* =========================
     SCROLL REVEAL
  ========================= */

  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) {
      return;
    }

    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("on");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("on");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach((element) => observer.observe(element));
  }

  /* =========================
     ACHIEVEMENT EASTER EGG
  ========================= */

  function initAchievement() {
    const logo = $("logo");
    const toast = $("toast");

    if (!logo || !toast) {
      return;
    }

    let clickCount = 0;
    let resetTimer = null;
    let toastTimer = null;
    let audioContext = null;

    function playAchievementSound() {
      if (prefersReducedMotion) {
        return;
      }

      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      try {
        if (!audioContext) {
          audioContext = new AudioContext();
        }

        if (audioContext.state === "suspended") {
          audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(660, now);
        oscillator.frequency.exponentialRampToValueAtTime(
          990,
          now + 0.16
        );

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + 0.35);
      } catch (error) {
        console.warn("Achievement sound unavailable:", error);
      }
    }

    function showAchievement() {
      toast.classList.add("show");
      playAchievementSound();

      window.clearTimeout(toastTimer);

      toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
      }, 4500);
    }

    logo.addEventListener("click", () => {
      clickCount++;

      window.clearTimeout(resetTimer);

      if (clickCount >= 10) {
        clickCount = 0;
        showAchievement();
        return;
      }

      resetTimer = window.setTimeout(() => {
        clickCount = 0;
      }, 1800);
    });
  }

  /* =========================
     SUPABASE
  ========================= */

  function initSupabase() {
    const supabaseUrl =
      "https://ofcdtwrgyxjrpoxuikxg.supabase.co";

    const supabaseKey =
      "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";

    if (!window.supabase || !supabaseUrl || !supabaseKey) {
      console.warn("Supabase is not available.");
      return;
    }

    let supabaseClient;

    try {
      supabaseClient = window.supabase.createClient(
        supabaseUrl,
        supabaseKey
      );
    } catch (error) {
      console.error("Supabase initialization failed:", error);
      return;
    }

 const debugMode =
  new URLSearchParams(window.location.search).get("debug") === "1";

loadDonations(supabaseClient);

if (debugMode) {
  testSupabaseConnection(supabaseClient);
}

}

async function testSupabaseConnection(supabaseClient) {
  try {
    const { error } = await supabaseClient
      .from("Donations")
      .select("*", {
        count: "exact",
        head: true
      });

    if (error) {
      console.error("Supabase connection error:", error);
      return;
    }

    console.info("Supabase connection successful.");
  } catch (error) {
    console.error("Supabase request failed:", error);
  }
}

async function loadDonations(supabaseClient) {

  const { data, error } = await supabaseClient
    .from("Donations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Load donations error:", error);
    return;
  }

  console.log("Donations:", data);

  const total = data.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  console.log("Total donated:", total);

  console.log("Calling initWealthValue with:", total);

  initWealthValue(total);
  updateProgress(total);
  updateLeaderboard(data);

}

})();