alert("SCRIPT LOADED");

/**
 * IWANNABERICH — Premium Landing Page
 * Vanilla JS — no dependencies
 */

(function () {
  'use strict';

console.log("script.js loaded");
console.log(window.supabase);
const supabaseUrl = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
const supabaseKey = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

  /* ---- State ---- */
  const GOAL = 100_000_000;
  let raised = 2847;
  let selectedTier = 25;
  let logoClicks = 0;
  const konamiCode = [];

  /** @type {Record<string, string>} Configure your real payment links here */

const PAYMENT_LINKS = {
    paypal: 'https://paypal.me/RaulTupan',
    revolut: 'https://revolut.me/raulu8m39',
};
  const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  const whispers = [
    'Okay fine, it\'s mostly a joke. But the website is real.',
    "You're still here. That means something. Probably curiosity.",
    'Every scroll brings you closer to understanding. And me closer to $100M.',
    'This is what happens when a designer wants money and has too much free time.',
  ];

const heroTitles = [
  { line1: "Help me become", line2: "Ridiculously Rich." },
  { line1: "Operation:", line2: "Become Rich." },
  { line1: "Poverty,", line2: "Cancelled." },
  { line1: "Future", line2: "Billionaire." },
  { line1: "Currently", line2: "Financially Embarrassed." },
  { line1: "Funding my", line2: "Financial Delusion." },
  { line1: "One donation", line2: "Closer to a Yacht." },
  { line1: "Building", line2: "My Fortune." },
  { line1: "The World's", line2: "Most Honest Startup." },
  { line1: "Manifesting", line2: "Extreme Wealth." },
  { line1: "Broke Today.", line2: "Legend Tomorrow." },
  { line1: "Invest in", line2: "My Bad Decisions." }
];

  /* ---- DOM Refs ---- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const navbar = $('.nav');
  const navToggle = null;
  const navMenu = $('.links');
  const logo = $('#logo');
  const planModal = $('#planModal');
  const toast = $('#toast');
  const progressFill = $('#progressFill');
  const progressPercent = $('#progressPercent');
  const heroWhisper = $('#heroWhisper');
  const heroTitle = $('#hero-title');
  const easterEgg = $('#easterEgg');

  /* ---- Utilities ---- */

  function formatNumber(n) {
    return n.toLocaleString('en-US');
  }

  function formatCurrency(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function animateCount(el, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function animateProgress() {
    const pct = (raised / GOAL) * 100;
    const displayPct = pct < 0.01 ? pct.toFixed(6) : pct.toFixed(4);

    progressFill.style.width = `${Math.max(pct, 0.05)}%`;
    progressPercent.textContent = `${displayPct}%`;

    const bar = progressFill.closest('[role="progressbar"]');
    if (bar) {
      bar.setAttribute('aria-valuenow', displayPct);
    }
  }

  /* ---- Navbar ---- */

  function initNavbar() {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    navToggle?.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    initScrollSpy();
  }

  function initScrollSpy() {
    const sections = ['dashboard', 'milestones', 'forbes', 'faq'];
    const links = navMenu?.querySelectorAll('.nav-links a') ?? [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ---- Smooth Scroll ---- */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        e.preventDefault();
        const target = document.querySelector(id);
        if (target) {
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ticker-height'))
            + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'))
            + 16;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---- Scroll Reveal ---- */

  function initScrollReveal() {
    const reveals = $$('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ---- Hero Animations ---- */

function randomHeroTitle() {

    if (!heroTitle) return;

    const random =
        heroTitles[Math.floor(Math.random() * heroTitles.length)];

    heroTitle.innerHTML = `
        ${random.line1}<br>
        <span class="accent">${random.line2}</span>
    `;
}

  function initHero() {
  randomHeroTitle();


 $$('[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      if (!isNaN(target)) animateCount(el, target);
    });

   // Hero whisper reveals on scroll
   if (!heroWhisper) return;

   let whisperIndex = 0;
   heroWhisper.textContent = whispers[0];

    window.addEventListener('scroll', () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct > 0.15 && !heroWhisper.classList.contains('visible')) {
        heroWhisper.classList.add('visible');
      }
      const newIndex = Math.min(Math.floor(scrollPct * whispers.length * 2), whispers.length - 1);
      if (newIndex !== whisperIndex) {
        whisperIndex = newIndex;
        heroWhisper.style.opacity = '0';
        setTimeout(() => {
          heroWhisper.textContent = whispers[whisperIndex];
          heroWhisper.style.opacity = '1';
        }, 300);
      }
    }, { passive: true });
  }

  /* ---- Dashboard Live Updates ---- */

  function initDashboard() {
    animateProgress();

    // Subtle live ticker on net worth
    const netWorthEl = $('#netWorth');
    if (netWorthEl) {
      setInterval(() => {
        const fluctuation = (Math.random() - 0.48) * 0.5;
        raised = Math.max(0, raised + fluctuation);
        const display = 4291.47 + (raised - 2847);
        netWorthEl.textContent = `$${formatCurrency(display)}`;
        $('#raisedAmount').textContent = formatNumber(Math.floor(raised));
        $('#forbesWorth').textContent = `$${formatNumber(Math.floor(display))}`;
        animateProgress();
      }, 4000);
    }

    // Forbes rank countdown
    const forbesRank = $('#forbesRank');
    if (forbesRank) {
      let rank = 4291847293;
      setInterval(() => {
        if (rank > 1 && Math.random() > 0.6) {
          rank -= Math.floor(Math.random() * 100) + 1;
          forbesRank.textContent = formatNumber(rank);
        }
      }, 5000);
    }
  }

  /* ---- Modal ---- */

  function openModal() {
    if (planModal?.showModal) {
      planModal.showModal();
    } else {
      planModal?.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (planModal?.close) {
      planModal.close();
    } else {
      planModal?.removeAttribute('open');
    }
    document.body.style.overflow = navMenu?.classList.contains('open') ? 'hidden' : '';
  }

  function initModal() {
    ['#openPlanBtn', '#heroPlanBtn', '#footerPlanLink'].forEach((sel) => {
      $(sel)?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    $('#closeModal')?.addEventListener('click', closeModal);

    planModal?.addEventListener('click', (e) => {
      if (e.target === planModal) closeModal();
    });

    $('#modalInvestBtn')?.addEventListener('click', () => {
      closeModal();
      document.querySelector('#invest')?.scrollIntoView({ behavior: 'smooth' });
      showToast('Redirecting to payment... just kidding. Pick a tier below.');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && planModal?.open) closeModal();
    });
  }

  /* ---- Payment Links ---- */

  function initPaymentLinks() {

const map = {
    payPayPal: PAYMENT_LINKS.paypal,
    payRevolut: PAYMENT_LINKS.revolut,

};

    Object.entries(map).forEach(([id, href]) => {
      const el = document.getElementById(id);
      if (el) {
        el.href = href;
        el.addEventListener('click', (e) => {
          if (href.endsWith('/')) {
            e.preventDefault();
            showToast('Add your payment username in script.js → PAYMENT_LINKS');
          }
        });
      }
    });
  }

  /* ---- Invest Tiers ---- */

  function initInvest() {
    $$('.tier-card').forEach((card) => {
      card.addEventListener('click', () => {
        $$('.tier-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedTier = parseInt(card.dataset.amount, 10);
      });
    });

    // Pre-select featured tier
    $('.tier-featured')?.classList.add('selected');

    $('#investBtn')?.addEventListener('click', () => {
      showToast(`$${selectedTier} contribution noted. Payment integration coming never.`);
      raised += selectedTier;
      animateProgress();
      $('#raisedAmount').textContent = formatNumber(Math.floor(raised));
    });
  }

  /* ---- Share ---- */

  function initShare() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('I found a $100M startup. Plot twist: they just want to be rich. IWANNABERICH');

    $('#shareTwitter')?.addEventListener('click', () => {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    });

    $('#shareLinkedIn')?.addEventListener('click', () => {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
    });

    $('#shareCopy')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied. Spread the wealth (to me).');
      } catch {
        showToast('Could not copy. Select the URL manually.');
      }
    });
  }

  /* ---- Easter Eggs ---- */

  function initEasterEggs() {
    // Logo click counter
    logo?.addEventListener('click', (e) => {
      logoClicks++;
      logo.classList.add('shake');
      setTimeout(() => logo.classList.remove('shake'), 600);

      if (logoClicks === 5) {
        e.preventDefault();
        showToast('Achievement unlocked: Persistent Believer');
      }
      if (logoClicks === 10) {
        e.preventDefault();
        revealEasterEgg();
      }
    });

    // Konami code
    document.addEventListener('keydown', (e) => {
      konamiCode.push(e.key);
      if (konamiCode.length > KONAMI_SEQUENCE.length) konamiCode.shift();

      if (konamiCode.join(',') === KONAMI_SEQUENCE.join(',')) {
        revealEasterEgg();
        showToast('Konami code accepted. Rich mode: enabled (not really).');
      }
    });

    // Console message
    console.log(
      '%cIWANNABERICH',
      'font-size: 24px; font-weight: bold; color: #6366f1;'
    );
    console.log(
      '%cYou found the console. A true investor inspects the source. Want to contribute? Scroll up.',
      'font-size: 12px; color: #a1a1aa;'
    );

    // Triple-click on Forbes rank
    let forbesClicks = 0;
    $('#forbesRank')?.addEventListener('click', () => {
      forbesClicks++;
      if (forbesClicks >= 3) {
        showToast('Fun fact: this ranking is completely fabricated.');
        forbesClicks = 0;
      }
    });

    // Click easter egg to dismiss
    easterEgg?.addEventListener('click', (e) => {
      if (e.target === easterEgg) easterEgg.hidden = true;
    });

    $('#easterClose')?.addEventListener('click', () => {
      if (easterEgg) easterEgg.hidden = true;
    });
  }

  function revealEasterEgg() {
    if (easterEgg) easterEgg.hidden = false;
  }

  /* ---- Ticker Duplicate for Seamless Loop ---- */

  function initTicker() {
    const content = $('.ticker-content');
    if (content) {
      content.innerHTML += content.innerHTML;
    }
  }

  /* ---- FAQ Accordion Enhancement ---- */

  function initFAQ() {
    $$('.faq-item').forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          $$('.faq-item').forEach((other) => {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  }

  /* ---- Init ---- */

async function testSupabase() {
    const { data, error } = await supabase
        .from("donations")
        .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);
}

  function init() {
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initHero();
    initDashboard();
    initModal();
    initInvest();
    initShare();
    initPaymentLinks();
    initEasterEggs();
    initTicker();
    initFAQ();

    testSupabase();

    // Trigger hero reveals immediately
    setTimeout(() => {
      $$('.hero .reveal').forEach((el) => el.classList.add('visible'));
    }, 100);
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
