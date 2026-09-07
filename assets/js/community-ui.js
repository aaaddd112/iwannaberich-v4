(() => {
  "use strict";

  const initScrollReveal = () => {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("on"));
      return;
    }

    const observer = new IntersectionObserver((entries, current) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("on");
        current.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    items.forEach((item) => observer.observe(item));
  };

  const loadCommunityIdentityLinks = () => {
    if (document.querySelector('script[data-community-identity-links]')) return;
    const script = document.createElement("script");
    script.src = "assets/js/community-identity-links.js?v=1.0.1";
    script.dataset.communityIdentityLinks = "true";
    document.head.appendChild(script);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initScrollReveal();
      loadCommunityIdentityLinks();
    }, { once: true });
  } else {
    initScrollReveal();
    loadCommunityIdentityLinks();
  }
})();
