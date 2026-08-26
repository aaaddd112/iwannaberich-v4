(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const navKeys = {"numbers.html":"nav.numbers","milestones.html":"nav.milestones","story.html":"nav.why","experiment.html":"nav.experiment","updates.html":"nav.updates","about.html":"nav.about","support.html":"nav.predictions"};
    document.querySelectorAll(".links a").forEach((el) => {
      const href = (el.getAttribute("href") || "").split("#")[0];
      const key = navKeys[href];
      if (key && !el.dataset.i18n) el.dataset.i18n = key;
    });
    const langLabel = document.querySelector(".language-switcher .sr-only");
    if (langLabel && !langLabel.dataset.i18n) langLabel.dataset.i18n = "nav.language";
    const skip = document.querySelector(".skip-link");
    if (skip && !skip.dataset.i18nPhrase) skip.dataset.i18nPhrase = "Skip to content";
    const candidates = document.querySelectorAll("main p, main h1, main h2, main h3, main strong, main b, main small, main label, footer p, footer a, .modal-kicker, .donation-header p, .donation-intent span, .donation-intent strong, .continue-button, .donation-footnote, .cta-note");
    candidates.forEach((el) => {
      if (el.dataset.i18n || el.dataset.i18nPhrase) return;
      if (el.children.length === 0) {
        const phrase = el.textContent.trim();
        if (phrase) el.dataset.i18nPhrase = phrase;
      }
    });
  });
})();
