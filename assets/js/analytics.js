(() => {
  "use strict";

  const ENDPOINT =
    "https://ofcdtwrgyxjrpoxuikxg.supabase.co/functions/v1/analytics-events";

  const ALLOWED_EVENTS = new Set([
    "page_view",
    "cta_click",
    "contribution_open",
    "stripe_checkout",
    "prediction_submit",
    "telegram_click",
    "scroll_50",
    "scroll_90",
  ]);

  function cleanMetadata(metadata) {
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
      return {};
    }

    const safe = {};

    Object.entries(metadata).slice(0, 8).forEach(([key, value]) => {
      const cleanKey = String(key).slice(0, 40);

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        safe[cleanKey] =
          typeof value === "string" ? value.slice(0, 200) : value;
      }
    });

    return safe;
  }

  function trackEvent(eventName, metadata = {}) {
    if (!ALLOWED_EVENTS.has(eventName)) return;

    const payload = {
      event_name: eventName,
      page: window.location.pathname || "/",
      metadata: cleanMetadata(metadata),
    };

    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Analytics must never interfere with the site.
    });
  }

  window.IWBRAnalytics = {
    trackEvent,
  };

  function initAnalytics() {
    trackEvent("page_view", {
      title: document.title.slice(0, 120),
      referrer_host: document.referrer
        ? (() => {
            try {
              return new URL(document.referrer).hostname.slice(0, 120);
            } catch {
              return "";
            }
          })()
        : "",
    });

    document
      .querySelectorAll("#openDonationModal, [data-open-donation]")
      .forEach((element) => {
        element.addEventListener("click", () => {
          trackEvent("cta_click", {
            id: element.id || "",
            text: (element.textContent || "").trim().slice(0, 120),
          });
        });
      });

    document
      .querySelectorAll('a[href*="t.me/"], #shareTelegram')
      .forEach((element) => {
        element.addEventListener("click", () => {
          trackEvent("telegram_click", {
            id: element.id || "",
          });
        });
      });

    let scroll50Tracked = false;
    let scroll90Tracked = false;

    const checkScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollable <= 0) return;

      const percentage = window.scrollY / scrollable;

      if (percentage >= 0.5 && !scroll50Tracked) {
        scroll50Tracked = true;
        trackEvent("scroll_50");
      }

      if (percentage >= 0.9 && !scroll90Tracked) {
        scroll90Tracked = true;
        trackEvent("scroll_90");
        window.removeEventListener("scroll", checkScroll);
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnalytics, { once: true });
  } else {
    initAnalytics();
  }
})();
