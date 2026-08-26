(() => {
  "use strict";

  const navKeys = {
    "numbers.html":"nav.numbers",
    "milestones.html":"nav.milestones",
    "story.html":"nav.why",
    "experiment.html":"nav.experiment",
    "updates.html":"nav.updates",
    "about.html":"nav.about",
    "support.html":"nav.predictions"
  };

  const en = {
    eyebrow: "A public experiment in unreasonable ambition",
    titleLead: "I'm trying to become",
    titleAccent: "ridiculously rich.",
    copy: "No startup. No crypto. No AI. Just a very public attempt to reach €1 billion. The strategy is mostly consistency, curiosity, and seeing what the internet does with a terrible idea.",
    punchline: "Will it work? Probably not. Is that a reason not to document it? Also probably not.",
    prediction: "Make your prediction",
    questionable: "MAKE A QUESTIONABLE DECISION",
    goal: "The goal",
    goalNote: "One billion euros. Still the plan.",
    share: "Share the delusion",
    disclaimer: "No equity. No returns. No pitch deck hidden behind a PDF."
  };

  const fr = {
    eyebrow: "UNE EXPÉRIENCE PUBLIQUE D’AMBITION DÉRAISONNABLE",
    titleLead: "J’essaie de devenir",
    titleAccent: "ridiculement riche.",
    copy: "Pas de startup. Pas de crypto. Pas d’IA. Juste une tentative très publique d’atteindre 1 milliard d’euros. La stratégie repose surtout sur la constance, la curiosité et l’observation de ce qu’Internet fait d’une idée terrible.",
    punchline: "Est-ce que ça marchera ? Probablement pas. Est-ce une raison pour ne pas le documenter ? Probablement pas non plus.",
    prediction: "Faites votre prédiction",
    questionable: "PRENEZ UNE DÉCISION DOUTEUSE",
    goal: "L’objectif",
    goalNote: "Un milliard d’euros. Toujours le plan.",
    share: "Partagez la folie",
    disclaimer: "Pas de participation. Aucun rendement. Aucun pitch deck caché derrière un PDF."
  };

  function setButtonLabel(button, text) {
    if (!button) return;
    const span = button.querySelector("span:first-child");
    if (span) span.textContent = text;
    else button.textContent = text + " ↗";
  }

  function setLanguagePatch() {
    const select = document.querySelector(".language-select");
    const lang = select ? select.value : "en";
    const t = lang === "fr" ? fr : en;

    const introEyebrow = document.querySelector(".hero-intro .eyebrow");
    const hero = document.querySelector(".hero-intro h1");
    const accent = hero && hero.querySelector(".accent");
    const copy = document.querySelector(".hero-copy");
    const punchline = document.querySelector(".hero-punchline");
    const prediction = document.querySelector(".buttons .primary");
    const questionable = document.querySelector(".buttons .questionable-cta");
    const goal = document.querySelector(".hero-goal-label");
    const goalNote = document.querySelector(".hero-goal-note");
    const share = document.querySelector(".share-label");
    const disclaimer = document.querySelector(".hero-disclaimer");

    if (introEyebrow) introEyebrow.textContent = t.eyebrow;
    if (copy) copy.textContent = t.copy;
    if (punchline) punchline.textContent = t.punchline;
    setButtonLabel(prediction, t.prediction);
    setButtonLabel(questionable, t.questionable);
    if (goal) goal.textContent = t.goal;
    if (goalNote) goalNote.textContent = t.goalNote;
    if (share) share.textContent = t.share;
    if (disclaimer) disclaimer.textContent = t.disclaimer;
    if (accent) accent.textContent = t.titleAccent;

    if (hero) {
      const lead = Array.from(hero.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (lead) lead.textContent = t.titleLead + "\n";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".links a").forEach((el) => {
      const href = (el.getAttribute("href") || "").split("#")[0];
      const key = navKeys[href];
      if (key && !el.dataset.i18n) el.dataset.i18n = key;
    });

    const langLabel = document.querySelector(".language-switcher .sr-only");
    if (langLabel && !langLabel.dataset.i18n) langLabel.dataset.i18n = "nav.language";

    const skip = document.querySelector(".skip-link");
    if (skip && !skip.dataset.i18nPhrase) skip.dataset.i18nPhrase = "Skip to content";

    const select = document.querySelector(".language-select");
    if (select) select.addEventListener("change", () => setTimeout(setLanguagePatch, 0));

    setTimeout(setLanguagePatch, 0);
  });
})();
