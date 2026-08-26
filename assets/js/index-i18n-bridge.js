(() => {
  "use strict";

  const original = new Map();
  const saveText = (el) => {
    if (!el || original.has(el)) return;
    original.set(el, el.textContent);
  };

  const navKeys = {
    "numbers.html":"nav.numbers",
    "milestones.html":"nav.milestones",
    "story.html":"nav.why",
    "experiment.html":"nav.experiment",
    "updates.html":"nav.updates",
    "about.html":"nav.about",
    "support.html":"nav.predictions"
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

  function restore(el) {
    if (original.has(el)) el.textContent = original.get(el);
  }

  function applyLanguage() {
    const select = document.querySelector(".language-select");
    const lang = select ? select.value : "en";

    const introEyebrow = document.querySelector(".hero-intro .eyebrow");
    const hero = document.querySelector(".hero-intro h1");
    const accent = hero && hero.querySelector(".accent");
    const copy = document.querySelector(".hero-copy");
    const punchline = document.querySelector(".hero-punchline");
    const prediction = document.querySelector(".buttons .primary");
    const questionable = document.querySelector(".buttons .questionable-cta span:first-child");
    const goal = document.querySelector(".hero-goal-label");
    const goalNote = document.querySelector(".hero-goal-note");
    const share = document.querySelector(".share-label");
    const disclaimer = document.querySelector(".hero-disclaimer");

    [introEyebrow, hero, accent, copy, punchline, prediction, questionable, goal, goalNote, share, disclaimer].forEach(saveText);

    if (lang !== "fr") {
      if (introEyebrow) restore(introEyebrow);
      if (copy) restore(copy);
      if (punchline) restore(punchline);
      if (prediction) restore(prediction);
      if (questionable) restore(questionable);
      if (goal) restore(goal);
      if (goalNote) restore(goalNote);
      if (share) restore(share);
      if (disclaimer) restore(disclaimer);
      if (hero) {
        const lead = Array.from(hero.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (lead && original.has(hero)) {
          const originalText = original.get(hero);
          const originalLead = originalText.split("ridiculously rich.")[0].trim();
          lead.textContent = originalLead + "\n";
        }
      }
      if (accent) restore(accent);
      return;
    }

    if (introEyebrow) introEyebrow.textContent = fr.eyebrow;
    if (copy) copy.textContent = fr.copy;
    if (punchline) punchline.textContent = fr.punchline;
    if (prediction) {
      const span = prediction.querySelector("span");
      if (span) {
        saveText(span);
        span.textContent = fr.prediction;
      } else {
        prediction.textContent = fr.prediction + " ↗";
      }
    }
    if (questionable) questionable.textContent = fr.questionable;
    if (goal) goal.textContent = fr.goal;
    if (goalNote) goalNote.textContent = fr.goalNote;
    if (share) share.textContent = fr.share;
    if (disclaimer) disclaimer.textContent = fr.disclaimer;

    if (accent) accent.textContent = fr.titleAccent;
    if (hero) {
      const lead = Array.from(hero.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (lead) lead.textContent = fr.titleLead + "\n";
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
    if (select) select.addEventListener("change", () => setTimeout(applyLanguage, 0));

    setTimeout(applyLanguage, 0);
  });
})();
