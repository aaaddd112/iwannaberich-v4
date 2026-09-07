(() => {
  "use strict";

  const PUBLIC_LINKS = [
    { href: "index.html", label: "Home", key: "index.html" },
    { href: "experiment.html", label: "The experiment", key: "experiment.html" },
    { href: "community.html", label: "Community", key: "community.html" },
    { href: "updates.html", label: "Updates", key: "updates.html" },
    { href: "numbers.html", label: "Numbers", key: "numbers.html" },
    { href: "milestones.html", label: "Milestones", key: "milestones.html" },
    { href: "contributors.html", label: "Contributors", key: "contributors.html" },
    { href: "about.html", label: "About", key: "about.html" },
    { href: "account.html", label: "Account", key: "account.html", cta: true }
  ];

  const normalizeLegacyLinks = (root) => {
    root.querySelectorAll('a[href="support.html"], a[href="./support.html"]').forEach((link) => {
      link.href = "community.html";
      if (/prediction/i.test(link.textContent || "")) link.textContent = "Community";
    });
  };

  const makeToggle = (header, targetId) => {
    let toggle = header.querySelector(".nav-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "nav-toggle nav-toggle-overhaul";
      toggle.type = "button";
      toggle.setAttribute("aria-controls", targetId);
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.innerHTML = "<span></span><span></span><span></span>";
      const logo = header.querySelector(".logo");
      logo?.after(toggle);
    }
    return toggle;
  };

  const closeMenu = (toggle, menu) => {
    menu.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-menu-open");
  };

  const openMenu = (toggle, menu) => {
    menu.classList.add("is-open");
    toggle?.setAttribute("aria-expanded", "true");
    toggle?.setAttribute("aria-label", "Close navigation");
    document.body.classList.add("nav-menu-open");
  };

  const enhanceDropdowns = (menu, close) => {
    const dropdowns = [...menu.querySelectorAll(".nav-dropdown")];
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector(".nav-drop-trigger");
      if (!trigger || trigger.dataset.navEnhanced) return;
      trigger.dataset.navEnhanced = "true";
      trigger.setAttribute("aria-haspopup", "true");
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const next = !dropdown.classList.contains("is-open");
        dropdowns.forEach((item) => {
          item.classList.remove("is-open");
          item.querySelector(".nav-drop-trigger")?.setAttribute("aria-expanded", "false");
        });
        dropdown.classList.toggle("is-open", next);
        trigger.setAttribute("aria-expanded", String(next));
      }, true);
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          dropdown.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
          trigger.focus();
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          dropdown.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
          dropdown.querySelector("a")?.focus();
        }
      });
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => close());
    });
  };

  const enhance = () => {
    const headers = [...document.querySelectorAll("header.nav")];
    if (!headers.length) return;

    headers.forEach((header, headerIndex) => {
      normalizeLegacyLinks(header);

      let menu = header.querySelector(".links");
      const specialMenu = header.querySelector(".profile-nav");

      if (!menu && specialMenu) {
        menu = specialMenu;
        menu.classList.add("links", "nav-overhaul-menu");
      }

      if (!menu) {
        menu = document.createElement("nav");
        menu.className = "links nav-overhaul-menu";
        menu.setAttribute("aria-label", "Main navigation");
        PUBLIC_LINKS.forEach((item) => {
          const a = document.createElement("a");
          a.href = item.href;
          a.textContent = item.label;
          if (item.cta) a.classList.add("nav-account-cta");
          menu.appendChild(a);
        });
        header.appendChild(menu);
      }

      const menuId = menu.id || `main-nav-${headerIndex}`;
      menu.id = menuId;
      const toggle = makeToggle(header, menuId);

      const accountExists = [...menu.querySelectorAll("a")].some((a) => /account\.html$/i.test(a.getAttribute("href") || ""));
      const communityExists = [...menu.querySelectorAll("a")].some((a) => /community\.html$/i.test(a.getAttribute("href") || ""));

      if (!communityExists && !/profile-nav/.test(menu.className)) {
        const a = document.createElement("a");
        a.href = "community.html";
        a.textContent = "Community";
        menu.prepend(a);
      }
      if (!accountExists && !/profile-nav/.test(menu.className)) {
        const a = document.createElement("a");
        a.href = "account.html";
        a.textContent = "Account";
        a.className = "nav-account-cta";
        menu.appendChild(a);
      }

      normalizeLegacyLinks(menu);

      const current = location.pathname.split("/").pop() || "index.html";
      menu.querySelectorAll("a[href]").forEach((link) => {
        const href = (link.getAttribute("href") || "").split("#")[0];
        if (href && href === current) {
          link.setAttribute("aria-current", "page");
          link.classList.add("is-current");
        }
      });

      let open = false;
      const close = () => { open = false; closeMenu(toggle, menu); };
      const setOpen = (value) => {
        open = value;
        if (open) openMenu(toggle, menu); else closeMenu(toggle, menu);
      };

      if (!toggle.dataset.navEnhanced) {
        toggle.dataset.navEnhanced = "true";
        toggle.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          setOpen(!open);
        }, true);
      }

      menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) close();
      }, true);

      enhanceDropdowns(menu, close);

      document.addEventListener("click", (event) => {
        if (!header.contains(event.target)) close();
      }, true);

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 1099) close();
      }, { passive: true });
    });

    document.querySelectorAll('a[href="support.html"], a[href="./support.html"]').forEach((link) => {
      link.href = "community.html";
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance, { once: true });
  } else {
    enhance();
  }
})();
