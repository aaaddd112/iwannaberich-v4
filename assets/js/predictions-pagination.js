(() => {
  "use strict";

  const PAGE_SIZE = 8;
  let currentPage = 1;
  let observer = null;
  let raf = 0;

  const $ = (id) => document.getElementById(id);

  function getItems() {
    const list = $("predictionComments");
    if (!list) return [];
    return Array.from(list.children).filter((el) => el.classList.contains("predict-comment"));
  }

  function ensureControls() {
    const list = $("predictionComments");
    if (!list) return null;
    let controls = $("predictionPagination");
    if (!controls) {
      controls = document.createElement("nav");
      controls.id = "predictionPagination";
      controls.className = "prediction-pagination";
      controls.setAttribute("aria-label", "Prediction pages");
      list.insertAdjacentElement("afterend", controls);
    }
    return controls;
  }

  function button(label, page, disabled, current) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "prediction-page-btn" + (current ? " is-current" : "");
    el.textContent = label;
    el.disabled = disabled;
    if (current) el.setAttribute("aria-current", "page");
    el.addEventListener("click", () => {
      currentPage = page;
      render();
      const list = $("predictionComments");
      list?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return el;
  }

  function render() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const items = getItems();
      const controls = ensureControls();
      if (!controls) return;

      const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
      currentPage = Math.min(Math.max(currentPage, 1), totalPages);
      const start = (currentPage - 1) * PAGE_SIZE;

      items.forEach((item, index) => {
        item.hidden = index < start || index >= start + PAGE_SIZE;
      });

      controls.innerHTML = "";
      if (items.length <= PAGE_SIZE) {
        controls.hidden = true;
        return;
      }
      controls.hidden = false;

      const summary = document.createElement("span");
      summary.className = "prediction-page-summary";
      const from = start + 1;
      const to = Math.min(start + PAGE_SIZE, items.length);
      summary.textContent = `${from}–${to} of ${items.length} predictions`;
      controls.appendChild(summary);

      const pager = document.createElement("div");
      pager.className = "prediction-page-buttons";
      pager.appendChild(button("‹", Math.max(1, currentPage - 1), currentPage === 1, false));

      const pages = [];
      for (let p = 1; p <= totalPages; p += 1) {
        if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) pages.push(p);
        else if (pages[pages.length - 1] !== "…") pages.push("…");
      }
      pages.forEach((p) => {
        if (p === "…") {
          const dots = document.createElement("span");
          dots.className = "prediction-page-dots";
          dots.textContent = "…";
          pager.appendChild(dots);
        } else {
          pager.appendChild(button(String(p), p, false, p === currentPage));
        }
      });

      pager.appendChild(button("›", Math.min(totalPages, currentPage + 1), currentPage === totalPages, false));
      controls.appendChild(pager);
    });
  }

  function init() {
    const list = $("predictionComments");
    if (!list) return;
    observer = new MutationObserver(render);
    observer.observe(list, { childList: true });
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
