(function () {
  const WA = "966502786513";
  const STORAGE_KEY = "bm-lang";

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
    return document.documentElement.lang === "en" ? "en" : "ar";
  }

  function applyLang(lang) {
    const dict = window.BM_I18N[lang];
    if (!dict) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-en", lang === "en");
    document.body.classList.toggle("lang-ar", lang === "ar");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key];
      if (val == null) return;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = dict[key];
      if (val != null) el.innerHTML = val;
    });

    const metaKey = document.body.getAttribute("data-i18n-meta");
    const title = metaKey && dict[`${metaKey}MetaTitle`] ? dict[`${metaKey}MetaTitle`] : dict.metaTitle;
    const desc = metaKey && dict[`${metaKey}MetaDesc`] ? dict[`${metaKey}MetaDesc`] : dict.metaDesc;
    if (title) document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && desc) metaDesc.setAttribute("content", desc);

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function initLang() {
    applyLang(getLang());
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.dataset.lang));
    });
  }

  function initHeader() {
    const header = document.querySelector(".site-header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const menuBtn = document.getElementById("menuBtn");
    const mobileNav = document.getElementById("mobileNav");
    if (menuBtn && mobileNav) {
      const setOpen = (open) => {
        mobileNav.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("nav-open", open);
      };
      menuBtn.addEventListener("click", () => {
        setOpen(!mobileNav.classList.contains("open"));
      });
      mobileNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => setOpen(false));
      });
    }
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    const show = (el) => el.classList.add("visible");

    const inViewport = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92 && r.bottom > 0;
    };

    if (!("IntersectionObserver" in window)) {
      els.forEach(show);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );
    els.forEach((el) => {
      io.observe(el);
      if (inViewport(el)) show(el);
    });
    requestAnimationFrame(() => {
      els.forEach((el) => {
        if (inViewport(el)) show(el);
      });
    });
  }

  function initForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const lang = getLang();
      const d = window.BM_I18N[lang];
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const company = form.company.value.trim();
      const message = form.message.value.trim();
      const lines =
        lang === "ar"
          ? [
              "مرحباً بيز موشن،",
              `الاسم: ${name}`,
              `الجوال: ${phone}`,
              `النشاط: ${company}`,
              `الطلب: ${message}`,
            ]
          : [
              "Hello Bees Motion,",
              `Name: ${name}`,
              `Phone: ${phone}`,
              `Company: ${company}`,
              `Request: ${message}`,
            ];
      const text = encodeURIComponent(lines.join("\n"));
      window.open(`https://wa.me/${WA}?text=${text}`, "_blank", "noopener");
    });
  }

  function prepVideo(v) {
    if (!v || v.nodeName !== "VIDEO") return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.loop = true;
  }

  function tryPlay(v) {
    prepVideo(v);
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  function initHeroVideo() {
    const videos = document.querySelectorAll(".bm-hero-reel");
    if (!videos.length) return;

    const tryPlayAll = () => videos.forEach(tryPlay);

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const v = e.target;
            if (e.isIntersecting) tryPlay(v);
            else if (!v.paused) v.pause();
          });
        },
        { threshold: 0.25 }
      );
      videos.forEach((v) => {
        prepVideo(v);
        io.observe(v);
      });
    } else {
      tryPlayAll();
    }

    document.addEventListener("touchstart", tryPlayAll, { once: true, passive: true });
    document.addEventListener("click", tryPlayAll, { once: true });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tryPlayAll();
    });
  }

  function initCaseFilters() {
    const cards = document.querySelectorAll(".pf-card[data-filter]");
    const chips = document.querySelectorAll(".cs-filter");
    const tiles = document.querySelectorAll(".cs-tile");
    const videos = document.getElementById("pfVideos");
    const titleEl = document.getElementById("pfVideosTitle");
    if (!tiles.length) return;

    function applyFilter(key, title) {
      const showAll = !key || key === "all";
      tiles.forEach((tile) => {
        const series = tile.getAttribute("data-series");
        const show = showAll || series === key;
        tile.classList.toggle("is-hidden", !show);
      });
      cards.forEach((card) => {
        const active = !showAll && card.getAttribute("data-filter") === key;
        card.classList.toggle("is-active", active);
        card.setAttribute("aria-pressed", active ? "true" : "false");
      });
      chips.forEach((chip) => {
        const chipKey = chip.getAttribute("data-filter") || "all";
        chip.classList.toggle("is-active", showAll ? chipKey === "all" : chipKey === key);
      });
      if (videos) {
        if (showAll) {
          videos.hidden = true;
        } else {
          videos.hidden = false;
          if (titleEl && title) titleEl.textContent = title;
          videos.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const key = card.getAttribute("data-filter") || "all";
        const titleNode = card.querySelector(".pf-card-title");
        applyFilter(key, titleNode ? titleNode.textContent.trim() : "");
      });
    });

    chips.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-filter") || "all";
        applyFilter(key, "");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initHeader();
    initReveal();
    initForm();
    initHeroVideo();
    initCaseFilters();
  });
})();
