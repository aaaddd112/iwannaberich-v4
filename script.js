(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initLoadingScreen();
    initNotifications();
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
      "Loading investment opportunity...",
      "Done."
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
      }, 180);

      currentIndex++;

      if (currentIndex === messages.length) {
        window.setTimeout(() => {
          loadingScreen.classList.add("hidden");
        }, 650);
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
      {
        title: "🔔 Elon Musk has not responded yet.",
        amount: "Still waiting..."
      },
      {
        title: "🔔 Warren Buffett viewed your business plan.",
        amount: "No comment."
      },
      {
        title: "🔔 Jeff Bezos accidentally closed the tab.",
        amount: "Unfortunate."
      },
      {
        title: "🔔 Forbes is pretending not to notice.",
        amount: "For now."
      },
      {
        title: "🔔 Someone thought this was a real startup.",
        amount: "Mission accomplished."
      },
      {
        title: "🔔 Someone from Romania believed.",
        amount: "+€2"
      },
      {
        title: "🔔 Someone from Germany believed.",
        amount: "+€5"
      },
      {
        title: "🔔 Someone from France found the plan convincing.",
        amount: "+€10"
      },
      {
        title: "🔔 Someone from Italy is financially concerned.",
        amount: "+€5"
      },
      {
        title: "🔔 Someone from Spain joined the wealth initiative.",
        amount: "+€20"
      },
      {
        title: "🔔 Someone from the Netherlands asked no questions.",
        amount: "+€50"
      },
      {
        title: "🔔 Someone from Switzerland noticed the potential.",
        amount: "+€100"
      },
      {
        title: "🔔 Someone almost donated.",
        amount: "😂"
      },
      {
        title: "🔔 Someone opened the business plan twice.",
        amount: "Suspicious activity."
      },
      {
        title: "🔔 Someone shared this website with a friend.",
        amount: "Potential investor detected."
      },
      {
        title: "🔔 Someone is comparing this to a real startup.",
        amount: "Please don't."
      },
      {
        title: "🔔 Someone read the disclaimer.",
        amount: "They cannot be stopped."
      },
      {
        title: "🔔 Someone asked what they get in return.",
        amount: "A beautiful experience."
      },
      {
        title: "🔔 A mysterious benefactor appeared.",
        amount: "+€42"
      },
      {
        title: "🔔 An anonymous believer has arrived.",
        amount: "+€1"
      },
      {
        title: "🔔 Someone donated before reading the business plan.",
        amount: "Bold."
      },
      {
        title: "🔔 Someone believes this is a legitimate investment.",
        amount: "We should probably clarify."
      },
      {
        title: "🔔 Someone is emotionally invested now.",
        amount: "+€0.34"
      },
      {
        title: "🔔 Someone came back after laughing.",
        amount: "+€5"
      }
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

      const delay = Math.floor(Math.random() * 14000) + 8000;

      notificationTimer = window.setTimeout(showNotification, delay);
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !notification.classList.contains("show")) {
        scheduleNotification();
      }
    });

    notification.addEventListener("click", hideNotification);

    if (prefersReducedMotion) {
      return;
    }

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

    /*
      Testarea conexiunii se face doar când adaugi ?debug=1 la URL.
      Exemplu:
      https://domeniul-tau.ro/?debug=1
    */

    const debugMode =
      new URLSearchParams(window.location.search).get("debug") === "1";

    if (!debugMode) {
      return;
    }

    testSupabaseConnection(supabaseClient);
    loadDonations(supabaseClient);
  }

async function testSupabaseConnection(supabaseClient) {
  try {
    const { error } = await supabaseClient
      .from("onations")
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
    console.error("Load Donations error:", error);
    return;
  }

  console.log("Donations:", data);

  const total = data.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  console.log("Total donated:", total);

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

  const wealthValue = document.getElementById("wealthValue");

initWealthValue(total);

}

}

})();