/**
 * IWANNABERICH v2
 * Modern modular architecture
 * Module 1A - Core
 */

(() => {
    "use strict";

    /* ==========================================
       CONFIG
    ========================================== */

    const GOAL = 100000000;

    const CONFIG = {
        goal: GOAL,

        payments: {
            paypal: "https://paypal.me/RaulTupan",
            revolut: "https://revolut.me/raulu8m39"
        },

        supabase: {
            url: "https://ofcdtwrgyxjrpoxuikxg.supabase.co",
            key: "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA"
        }
    };

    /* ==========================================
       HELPERS
    ========================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const formatNumber = (value) =>
        new Intl.NumberFormat("en-US").format(value);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    const random = (min, max) =>
        Math.random() * (max - min) + min;

    /* ==========================================
       STATE
    ========================================== */

    const state = {
        raised: 2847,
        selectedTier: 25,
        logoClicks: 0,
        loading: false,
        donations: []
    };

    /* ==========================================
       DOM
    ========================================== */

    const dom = {

        body: document.body,

        navbar: $(".nav"),
        navLinks: $(".links"),

        logo: $("#logo"),

        toast: $("#toast"),

        progressFill: $("#progressFill"),
        progressPercent: $("#progressPercent"),

        raisedAmount: $("#raisedAmount"),
        netWorth: $("#netWorth"),
        forbesWorth: $("#forbesWorth"),
        forbesRank: $("#forbesRank"),

        heroTitle: $("#hero-title"),

        modal: $("#planModal"),

        investButton: $("#investBtn")
    };

    /* ==========================================
       TOAST
    ========================================== */

    function showToast(message) {

        if (!dom.toast) return;

        dom.toast.textContent = message;
        dom.toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            dom.toast.classList.remove("show");
        }, 3000);
    }

    /* ==========================================
       LOADING
    ========================================== */

    function hideLoadingScreen() {

    /* ==========================================
       NAVBAR
    ========================================== */

    function initNavbar() {

        if (!dom.navbar) return;

        const onScroll = () => {
            dom.navbar.classList.toggle(
                "scrolled",
                window.scrollY > 20
            );
        };

        window.addEventListener("scroll", onScroll, {
            passive: true
        });

        onScroll();
    }

    /* ==========================================
       SMOOTH SCROLL
    ========================================== */

    function initSmoothScroll() {

        $$('a[href^="#"]').forEach(link => {

            link.addEventListener("click", e => {

                const target = $(link.getAttribute("href"));

                if (!target) return;

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });

    }

    /* ==========================================
       SCROLL REVEAL
    ========================================== */

    function initReveal() {

        const elements = $$(".reveal");

        if (!elements.length) return;

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("on");

                observer.unobserve(entry.target);

            });

        }, {
            threshold: 0.15
        });

        elements.forEach(el => observer.observe(el));

    }

    /* ==========================================
       INIT
    ========================================== */

    function init() {

        console.log("IWANNABERICH v2 loaded");

        hideLoadingScreen();

        initNavbar();

        initSmoothScroll();

        initReveal();

    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();

        const loading = $("#loadingScreen");

        if (!loading) return;

        loading.classList.add("hidden");

        setTimeout(() => {
            loading.remove();
        }, 500);
    }