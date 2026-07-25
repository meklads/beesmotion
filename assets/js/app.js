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

    const title = dict.metaTitle;
    const desc = dict.metaDesc;
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
      menuBtn.addEventListener("click", () => {
        const open = mobileNav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      mobileNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => mobileNav.classList.remove("open"));
      });
    }
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
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

  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initHeader();
    initReveal();
    initForm();
  });
})();
