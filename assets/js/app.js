(function () {
  const WA = "966502786513";
  // v3: English is the site default; prior lang prefs reset once.
  const STORAGE_KEY = "bm-lang-v3";
  const DEFAULT_LANG = "en";

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
    return DEFAULT_LANG;
  }

  function protectBrandMarks(str) {
    return String(str)
      .replace(/PropMotion™/g, "\u2066PropMotion™\u2069")
      .replace(/MedMotion™/g, "\u2066MedMotion™\u2069")
      .replace(/SpaceLaunch™/g, "\u2066SpaceLaunch™\u2069")
      .replace(/PropMotion\u2122/g, "\u2066PropMotion\u2122\u2069")
      .replace(/MedMotion\u2122/g, "\u2066MedMotion\u2122\u2069")
      .replace(/SpaceLaunch\u2122/g, "\u2066SpaceLaunch\u2122\u2069");
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
        el.placeholder = protectBrandMarks(val);
      } else if (el.tagName === "OPTION") {
        el.textContent = protectBrandMarks(val);
      } else {
        el.textContent = protectBrandMarks(val);
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = dict[key];
      if (val != null) el.innerHTML = protectBrandMarks(val);
    });

    const metaKey = document.body.getAttribute("data-i18n-meta");
    const title = metaKey && dict[`${metaKey}MetaTitle`] ? dict[`${metaKey}MetaTitle`] : dict.metaTitle;
    const desc = metaKey && dict[`${metaKey}MetaDesc`] ? dict[`${metaKey}MetaDesc`] : dict.metaDesc;
    if (title) document.title = protectBrandMarks(title);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && desc) metaDesc.setAttribute("content", protectBrandMarks(desc));

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    document.querySelectorAll(".bm-sound-toggle").forEach((btn) => {
      const muted = btn.getAttribute("data-sound-muted") !== "0";
      const labels = soundToggleLabels();
      btn.setAttribute("aria-label", muted ? labels.unmute : labels.mute);
      btn.title = muted ? labels.unmute : labels.mute;
    });

    localStorage.setItem(STORAGE_KEY, lang);
    syncLangUrl(lang);
  }

  function initLang() {
    const fromUrl = readLangFromUrl();
    applyLang(fromUrl || getLang());
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
    const mainEl = document.getElementById("main") || document.querySelector("main");
    let trapHandler = null;

    const getFocusable = (root) =>
      Array.from(
        root.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

    if (menuBtn && mobileNav) {
      const setOpen = (open) => {
        const wasOpen = mobileNav.classList.contains("open");
        mobileNav.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("nav-open", open);
        if (mainEl) {
          if (open) mainEl.setAttribute("inert", "");
          else mainEl.removeAttribute("inert");
        }
        if (trapHandler) {
          document.removeEventListener("keydown", trapHandler, true);
          trapHandler = null;
        }
        if (open) {
          trapHandler = (e) => {
            if (e.key !== "Tab" || !mobileNav.classList.contains("open")) return;
            const nodes = getFocusable(mobileNav);
            if (!nodes.length) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          };
          document.addEventListener("keydown", trapHandler, true);
          const first = getFocusable(mobileNav)[0] || mobileNav.querySelector("a, button");
          if (first) first.focus({ preventScroll: true });
        } else if (wasOpen) {
          menuBtn.focus({ preventScroll: true });
        }
      };
      menuBtn.addEventListener("click", () => {
        setOpen(!mobileNav.classList.contains("open"));
      });
      mobileNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => setOpen(false));
      });
    }

    document.querySelectorAll(".nav-dd").forEach((dd) => {
      const toggle = dd.querySelector(".nav-dd-toggle");
      const panel = dd.querySelector(".nav-dd-panel");
      if (!toggle || !panel) return;
      const setOpen = (open) => {
        dd.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        panel.hidden = !open;
      };
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = panel.hidden;
        document.querySelectorAll(".nav-dd.is-open").forEach((other) => {
          if (other !== dd) {
            other.classList.remove("is-open");
            const t = other.querySelector(".nav-dd-toggle");
            const p = other.querySelector(".nav-dd-panel");
            if (t) t.setAttribute("aria-expanded", "false");
            if (p) p.hidden = true;
          }
        });
        setOpen(willOpen);
      });
      panel.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => setOpen(false));
      });
    });

    document.querySelectorAll(".mobile-nav-dd").forEach((dd) => {
      const toggle = dd.querySelector(".mobile-nav-dd-toggle");
      const panel = dd.querySelector(".mobile-nav-dd-panel");
      if (!toggle || !panel) return;
      toggle.addEventListener("click", () => {
        const open = panel.hidden;
        dd.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        panel.hidden = !open;
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest(".nav-dd")) return;
      document.querySelectorAll(".nav-dd.is-open").forEach((dd) => {
        dd.classList.remove("is-open");
        const t = dd.querySelector(".nav-dd-toggle");
        const p = dd.querySelector(".nav-dd-panel");
        if (t) t.setAttribute("aria-expanded", "false");
        if (p) p.hidden = true;
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      let closed = false;
      document.querySelectorAll(".nav-dd.is-open").forEach((dd) => {
        dd.classList.remove("is-open");
        const t = dd.querySelector(".nav-dd-toggle");
        const p = dd.querySelector(".nav-dd-panel");
        if (t) t.setAttribute("aria-expanded", "false");
        if (p) p.hidden = true;
        closed = true;
        if (t) t.focus({ preventScroll: true });
      });
      if (menuBtn && mobileNav && mobileNav.classList.contains("open")) {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.classList.toggle("nav-open", false);
        if (mainEl) mainEl.removeAttribute("inert");
        if (trapHandler) {
          document.removeEventListener("keydown", trapHandler, true);
          trapHandler = null;
        }
        menuBtn.focus({ preventScroll: true });
        closed = true;
      }
      if (closed) e.preventDefault();
    });
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

  function track(event, props) {
    try {
      const payload = Object.assign({ event: event }, props || {});
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push(payload);
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", event, props || {});
      }
    } catch (_) {}
  }

  function initAnalytics() {
    const id =
      (window.BM_SITE && window.BM_SITE.ga4MeasurementId) ||
      document.querySelector('meta[name="bm-ga4"]')?.content ||
      "";
    if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    window.gtag("js", new Date());
    window.gtag("config", id, {
      anonymize_ip: true,
      send_page_view: true,
    });
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  function initTracking() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-track], a[href*='wa.me'], a.wa-float, a.floating-wa");
      if (!el) return;
      const named = el.getAttribute("data-track");
      const href = el.getAttribute("href") || "";
      if (named) {
        track(named, { href: href, lang: getLang() });
      } else if (/wa\.me|whatsapp/i.test(href) || el.classList.contains("wa-float") || el.classList.contains("floating-wa")) {
        track("click_whatsapp", {
          href: href,
          lang: getLang(),
          placement: el.classList.contains("wa-float") || el.classList.contains("floating-wa") ? "float" : "link",
        });
      }
    });
  }

  function syncLangUrl(lang) {
    try {
      const url = new URL(window.location.href);
      if (lang === "en") {
        if (!url.searchParams.has("lang")) return;
        url.searchParams.delete("lang");
      } else {
        if (url.searchParams.get("lang") === lang) return;
        url.searchParams.set("lang", lang);
      }
      const q = url.searchParams.toString();
      window.history.replaceState({}, "", url.pathname + (q ? "?" + q : "") + url.hash);
    } catch (_) {}
  }

  function readLangFromUrl() {
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (q === "ar" || q === "en") {
        localStorage.setItem(STORAGE_KEY, q);
        return q;
      }
    } catch (_) {}
    return null;
  }

  function initForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const lang = getLang();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const email = form.email ? form.email.value.trim() : "";
      const company = form.company.value.trim();
      const industryEl = form.industry;
      const needEl = form.need;
      const objectiveEl = form.objective;
      const industry = industryEl ? industryEl.value : "";
      const need = needEl ? needEl.value : "";
      const objective = objectiveEl ? objectiveEl.value : "";
      const industryLabel = industryEl && industryEl.selectedOptions[0]
        ? industryEl.selectedOptions[0].textContent.trim()
        : industry;
      const needLabel = needEl && needEl.selectedOptions[0]
        ? needEl.selectedOptions[0].textContent.trim()
        : need;
      const objectiveLabel = objectiveEl && objectiveEl.selectedOptions[0]
        ? objectiveEl.selectedOptions[0].textContent.trim()
        : objective;
      const message = form.message.value.trim();
      track("generate_lead", {
        industry: industry,
        need: need,
        lang: lang,
        method: "whatsapp_form",
      });
      track("cta_form_whatsapp", { industry: industry, need: need, lang: lang });
      const lines =
        lang === "ar"
          ? [
              "مرحباً بيز موشن،",
              `الاسم: ${name}`,
              `الجوال: ${phone}`,
              email ? `البريد: ${email}` : null,
              `الشركة: ${company}`,
              `القطاع: ${industryLabel}`,
              `الاحتياج: ${needLabel}`,
              `الهدف: ${objectiveLabel || ""}`,
              `الطلب: ${message}`,
            ].filter(Boolean)
          : [
              "Hello Bees Motion,",
              `Name: ${name}`,
              `Phone: ${phone}`,
              email ? `Email: ${email}` : null,
              `Company: ${company}`,
              `Industry: ${industryLabel}`,
              `Need: ${needLabel}`,
              `Objective: ${objectiveLabel || "-"}`,
              `Request: ${message}`,
            ].filter(Boolean);
      const plain = lines.join("\n");
      try {
        localStorage.setItem(
          "bm-lead-last",
          JSON.stringify({ at: Date.now(), lang: lang, lines: lines })
        );
      } catch (_) {}
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(plain);
        }
      } catch (_) {}
      const text = encodeURIComponent(plain);
      const waUrl = `https://wa.me/${WA}?text=${text}`;
      try {
        sessionStorage.setItem("bm-wa-pending", waUrl);
      } catch (_) {}
      const popup = window.open(waUrl, "_blank", "noopener");
      if (!popup) {
        /* popup blocked. thank-you page will offer WhatsApp again */
      }
      window.location.href = "thank-you.html";
    });
  }

  function initThanksPage() {
    if (!document.body.classList.contains("page-thanks")) return;
    const waBtn = document.getElementById("thanksWa");
    let pending = "";
    try {
      pending = sessionStorage.getItem("bm-wa-pending") || "";
      if (pending) sessionStorage.removeItem("bm-wa-pending");
    } catch (_) {}
    if (waBtn && pending) {
      waBtn.setAttribute("href", pending);
    }
  }

  function ytPlayerCommand(iframe, func, args) {
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: func,
          args: args || [],
        }),
        "https://www.youtube.com"
      );
    } catch (_) {
      /* ignore */
    }
  }

  function ensureYtEmbedParams(params, { muteDefault }) {
    let p = String(params || "").replace(/^\?/, "");
    if (!/(^|&)enablejsapi=1(&|$)/.test(p)) p += (p ? "&" : "") + "enablejsapi=1";
    if (muteDefault !== false) {
      if (/(^|&)mute=0(&|$)/.test(p)) p = p.replace(/(^|&)mute=0(&|$)/, "$1mute=1$2");
      else if (!/(^|&)mute=1(&|$)/.test(p)) p += (p ? "&" : "") + "mute=1";
    }
    if (typeof location !== "undefined" && location.origin && !/(^|&)origin=/.test(p)) {
      p += "&origin=" + encodeURIComponent(location.origin);
    }
    return p;
  }

  function soundToggleLabels() {
    const ar =
      document.documentElement.getAttribute("lang") === "ar" ||
      document.documentElement.getAttribute("dir") === "rtl" ||
      document.body.classList.contains("lang-ar");
    return ar
      ? { unmute: "تشغيل الصوت", mute: "كتم الصوت" }
      : { unmute: "Unmute video", mute: "Mute video" };
  }

  function attachSoundToggle(host) {
    if (!host || host.getAttribute("data-sound-toggle") === "off") return null;

    let btn = host.querySelector(":scope > .bm-sound-toggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bm-sound-toggle is-muted";
      btn.setAttribute("data-sound-muted", "1");
      btn.innerHTML =
        '<svg class="bm-sound-icon bm-sound-icon--off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l4 3V7l-4 3H4zm11.5 2a2.5 2.5 0 0 0-1.4-2.2v4.4A2.5 2.5 0 0 0 15.5 12zm0-6.2v1.7a5.1 5.1 0 0 1 0 9v1.7a6.8 6.8 0 0 0 0-12.4z"/><path d="m19.1 7.1-1.4 1.4 1.9 1.9-1.9 1.9 1.4 1.4 1.9-1.9 1.9 1.9 1.4-1.4-1.9-1.9 1.9-1.9-1.4-1.4-1.9 1.9-1.9-1.9z"/></svg>' +
        '<svg class="bm-sound-icon bm-sound-icon--on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l4 3V7l-4 3H4zm11.5 2a2.5 2.5 0 0 0-1.4-2.2v4.4A2.5 2.5 0 0 0 15.5 12zm0-6.2v1.7a5.1 5.1 0 0 1 0 9v1.7a6.8 6.8 0 0 0 0-12.4z"/></svg>';
      host.appendChild(btn);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const muted = btn.getAttribute("data-sound-muted") !== "0";
        const nextMuted = !muted;
        const iframe = host.querySelector("iframe");
        const video = host.querySelector("video");
        if (iframe) {
          ytPlayerCommand(iframe, nextMuted ? "mute" : "unMute");
          if (!nextMuted) ytPlayerCommand(iframe, "setVolume", [100]);
        }
        if (video) {
          video.muted = nextMuted;
          if (!nextMuted) {
            try {
              video.volume = 1;
            } catch (_) {}
          }
        }
        btn.setAttribute("data-sound-muted", nextMuted ? "1" : "0");
        btn.classList.toggle("is-muted", nextMuted);
        const labels = soundToggleLabels();
        btn.setAttribute("aria-label", nextMuted ? labels.unmute : labels.mute);
        btn.setAttribute("aria-pressed", nextMuted ? "false" : "true");
        btn.title = nextMuted ? labels.unmute : labels.mute;
      });
    }

    const labels = soundToggleLabels();
    btn.setAttribute("data-sound-muted", "1");
    btn.classList.add("is-muted");
    btn.setAttribute("aria-label", labels.unmute);
    btn.setAttribute("aria-pressed", "false");
    btn.title = labels.unmute;
    return btn;
  }

  function buildHeroIframe(id, title) {
    const iframe = document.createElement("iframe");
    const origin =
      typeof location !== "undefined" && location.origin
        ? "&origin=" + encodeURIComponent(location.origin)
        : "";
    iframe.src =
      `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
      "&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&vq=hd1080&hd=1&enablejsapi=1" +
      origin;
    iframe.title = title || "Showreel";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "eager";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("frameborder", "0");
    iframe.className = "hero-autoplay-iframe";
    iframe.style.cssText =
      "position:absolute;top:50%;left:50%;width:178%;height:178%;max-width:none;transform:translate(-50%,-50%);border:0;pointer-events:none;";
    return iframe;
  }

  function sizeCoverFillIframe(crop, iframe) {
    const w = crop.clientWidth || crop.offsetWidth;
    if (!w) return;
    /* 9:16 frame at full crop width → fills width, crops top/bottom */
    const h = Math.round((w * 16) / 9);
    iframe.style.cssText = "";
    iframe.style.setProperty("position", "absolute", "important");
    iframe.style.setProperty("left", "0", "important");
    iframe.style.setProperty("right", "auto", "important");
    iframe.style.setProperty("top", "50%", "important");
    iframe.style.setProperty("bottom", "auto", "important");
    iframe.style.setProperty("width", w + "px", "important");
    iframe.style.setProperty("height", h + "px", "important");
    iframe.style.setProperty("max-width", "none", "important");
    iframe.style.setProperty("transform", "translateY(-50%)", "important");
    iframe.style.setProperty("border", "0", "important");
    iframe.style.setProperty("pointer-events", "none", "important");
  }

  /** Fit full 16:9 frame inside crop, no top/bottom crop (Graphics House–style clarity). */
  function sizeContainIframe(crop, iframe) {
    const w = crop.clientWidth || crop.offsetWidth;
    const h = crop.clientHeight || crop.offsetHeight;
    if (!w || !h) return;
    const ratio = 16 / 9;
    let iw;
    let ih;
    if (w / h > ratio) {
      ih = h;
      iw = Math.round(h * ratio);
    } else {
      iw = w;
      ih = Math.round(w / ratio);
    }
    iframe.style.cssText = "";
    iframe.style.setProperty("position", "absolute", "important");
    iframe.style.setProperty("left", "50%", "important");
    iframe.style.setProperty("top", "50%", "important");
    iframe.style.setProperty("right", "auto", "important");
    iframe.style.setProperty("bottom", "auto", "important");
    iframe.style.setProperty("width", iw + "px", "important");
    iframe.style.setProperty("height", ih + "px", "important");
    iframe.style.setProperty("max-width", "none", "important");
    iframe.style.setProperty("transform", "translate(-50%, -50%)", "important");
    iframe.style.setProperty("border", "0", "important");
    iframe.style.setProperty("pointer-events", "none", "important");
  }

  /** Cover crop with full-bleed 16:9, fills hero, keeps focal center (e.g. film frame). */
  function sizeCoverIframe(crop, iframe) {
    const w = crop.clientWidth || crop.offsetWidth;
    const h = crop.clientHeight || crop.offsetHeight;
    if (!w || !h) {
      /* Parent may not have laid out yet, retry once */
      requestAnimationFrame(() => {
        const w2 = crop.clientWidth || crop.offsetWidth;
        const h2 = crop.clientHeight || crop.offsetHeight;
        if (!w2 || !h2) {
          iframe.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none;";
          return;
        }
        sizeCoverIframe(crop, iframe);
      });
      return;
    }
    const ratio = 16 / 9;
    /* Zoom past cover so more top/bottom is cropped and the center scene fills the hero */
    const zoomAttr = parseFloat(crop.getAttribute("data-hero-zoom") || "1.32", 10);
    /* Respect explicit zoom=1 (true cover). Only fall back when attribute missing/invalid. */
    const zoom =
      Number.isFinite(zoomAttr) && zoomAttr >= 1
        ? zoomAttr
        : 1.32;
    let iw;
    let ih;
    if (w / h > ratio) {
      iw = w;
      ih = Math.round(w / ratio);
    } else {
      ih = h;
      iw = Math.round(h * ratio);
    }
    iw = Math.round(iw * zoom);
    ih = Math.round(ih * zoom);
    iframe.style.cssText = "";
    iframe.style.setProperty("position", "absolute", "important");
    iframe.style.setProperty("left", "50%", "important");
    iframe.style.setProperty("top", "50%", "important");
    iframe.style.setProperty("right", "auto", "important");
    iframe.style.setProperty("bottom", "auto", "important");
    iframe.style.setProperty("width", iw + "px", "important");
    iframe.style.setProperty("height", ih + "px", "important");
    iframe.style.setProperty("max-width", "none", "important");
    iframe.style.setProperty("transform", "translate(-50%, -50%)", "important");
    iframe.style.setProperty("border", "0", "important");
    iframe.style.setProperty("pointer-events", "none", "important");
  }

  function initHeroReelAutoplay() {
    const crops = document.querySelectorAll("[data-hero-autoplay]");
    if (!crops.length) return;

    const revealPoster = (crop) => {
      if (!crop || crop.classList.contains("is-hero-playing")) return;
      crop.classList.add("is-hero-playing");
    };

    const mount = (crop) => {
      const id = crop.getAttribute("data-hero-autoplay");
      if (!id || crop.querySelector("iframe.hero-autoplay-iframe, iframe[src*='youtube.com/embed']")) return;
      const title = crop.getAttribute("data-hero-title") || "Showreel";
      const poster =
        crop.querySelector(":scope > .yt-facade, :scope > .hero-tri-poster, :scope > img") ||
        crop.querySelector(".yt-facade, .hero-tri-poster, img");
      const coverFill = crop.classList.contains("bm-video-crop--cover-fill");
      const fit = crop.getAttribute("data-hero-fit");
      const containFit = fit === "contain" || crop.classList.contains("bm-video-crop--contain");
      const coverFit = fit === "cover" || crop.classList.contains("bm-video-crop--cover");
      const next = buildHeroIframe(id, title);

      /* Keep the poster visible until the embed is actually playing. */
      if (poster) {
        poster.classList.add("hero-autoplay-poster");
        poster.setAttribute("aria-hidden", "true");
        if (poster.tagName === "BUTTON" || poster.classList.contains("yt-facade")) {
          poster.setAttribute("tabindex", "-1");
          poster.style.pointerEvents = "none";
          if ("disabled" in poster) poster.disabled = true;
        }
        crop.insertBefore(next, poster);
      } else {
        crop.appendChild(next);
      }

      if (crop.classList.contains("hero-tri-crop") || crop.closest(".hero-tri-panel")) {
        next.style.cssText =
          "position:absolute;top:50%;left:50%;width:100%;height:100%;min-width:100%;min-height:177.78%;max-width:none;transform:translate(-50%,-50%);border:0;pointer-events:none;";
      } else if (containFit) {
        sizeContainIframe(crop, next);
      } else if (coverFit) {
        sizeCoverIframe(crop, next);
      } else if (coverFill) {
        sizeCoverFillIframe(crop, next);
      }

      if (containFit || coverFit || coverFill) {
        const resize = () => {
          if (!next.isConnected) return;
          if (containFit) sizeContainIframe(crop, next);
          else if (coverFit) sizeCoverIframe(crop, next);
          else sizeCoverFillIframe(crop, next);
        };
        resize();
        window.addEventListener("resize", resize, { passive: true });
      }

      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        revealPoster(crop);
        window.removeEventListener("message", onYtMessage);
      };

      const onYtMessage = (event) => {
        if (event.source !== next.contentWindow) return;
        let data = event.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch (err) {
            return;
          }
        }
        if (!data || typeof data !== "object") return;
        if (data.event === "onReady") {
          /* Player ready — give the first frame a beat, then lift the poster. */
          window.setTimeout(reveal, 280);
          return;
        }
        const state =
          data.event === "onStateChange"
            ? data.info
            : data.info && typeof data.info.playerState === "number"
              ? data.info.playerState
              : null;
        /* 1 = playing */
        if (state === 1) reveal();
      };
      window.addEventListener("message", onYtMessage);

      next.addEventListener("load", () => {
        try {
          next.contentWindow.postMessage(
            JSON.stringify({ event: "listening", id: id }),
            "https://www.youtube.com"
          );
        } catch (err) {
          /* ignore cross-origin probe failures */
        }
        /* Fallback if the API message never arrives */
        window.setTimeout(reveal, 1600);
      });
      /* Absolute fallback so the hero never stays locked on the poster */
      window.setTimeout(reveal, 4500);
      attachSoundToggle(crop);
    };

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  mount(entry.target);
                  io.unobserve(entry.target);
                }
              });
            },
            { rootMargin: "120px 0px", threshold: 0.05 }
          )
        : null;

    crops.forEach((crop) => {
      if (io) io.observe(crop);
      else mount(crop);
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

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      videos.forEach((v) => {
        v.removeAttribute("autoplay");
        v.pause();
      });
      return;
    }

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
        const host = v.closest(".bm-video-crop, .bm-hero-video, .bm-hero-v2-media") || v.parentElement;
        if (host) attachSoundToggle(host);
      });
    } else {
      tryPlayAll();
      videos.forEach((v) => {
        const host = v.closest(".bm-video-crop, .bm-hero-video, .bm-hero-v2-media") || v.parentElement;
        if (host) attachSoundToggle(host);
      });
    }

    document.addEventListener("touchstart", tryPlayAll, { once: true, passive: true });
    document.addEventListener("click", tryPlayAll, { once: true });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tryPlayAll();
    });
  }

  function initSeriesAlbum() {
    const HD = ensureYtEmbedParams(
      "autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080&hd=1",
      { muteDefault: true }
    );

    document.querySelectorAll("[data-series-album]").forEach((album) => {
      const stage = album.querySelector("[data-album-stage]");
      const tabs = album.querySelectorAll("[data-series-tab]");
      const thumbs = album.querySelectorAll("[data-album-id][data-series]");
      const titleEl = album.querySelector("[data-series-title]");
      const metaEl = album.querySelector("[data-series-meta]");
      if (!stage || !tabs.length || !thumbs.length) return;

      function dictVal(key, fallback) {
        const dict = window.BM_I18N && window.BM_I18N[getLang()];
        return (dict && key && dict[key]) || fallback || "";
      }

      function bindFacade(btn) {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-yt-id");
          if (!id) return;
          playInStage(id, btn.getAttribute("data-yt-title") || "Video");
        });
      }

      function playInStage(id, title) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${id}?${HD}`;
        iframe.title = title || "Video";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.loading = "eager";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("playsinline", "1");
        iframe.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;";

        stage.querySelectorAll("iframe, .yt-facade, .bm-sound-toggle").forEach((el) => el.remove());
        const corners = stage.querySelectorAll(".bm-video-corner");
        if (corners.length) corners[corners.length - 1].after(iframe);
        else stage.prepend(iframe);
        attachSoundToggle(stage);
      }

      function setStageFacade(id, title) {
        stage.querySelectorAll("iframe, .yt-facade, .bm-sound-toggle").forEach((el) => el.remove());
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "yt-facade yt-facade--cover";
        btn.setAttribute("data-yt-id", id);
        btn.setAttribute("data-yt-title", title || "Video");
        btn.setAttribute("data-yt-params", HD);
        btn.setAttribute("aria-label", title || "Play episode");
        btn.innerHTML =
          `<img src="/assets/img/thumbs/${id}.jpg" alt="" loading="eager" width="1280" height="720" />` +
          '<span class="yt-facade-play" aria-hidden="true"></span>';
        const corners = stage.querySelectorAll(".bm-video-corner");
        if (corners.length) corners[corners.length - 1].after(btn);
        else stage.prepend(btn);
        bindFacade(btn);
      }

      function selectThumb(thumb, { autoplay }) {
        thumbs.forEach((tEl) => {
          const on = tEl === thumb;
          tEl.classList.toggle("is-active", on);
          tEl.setAttribute("aria-pressed", on ? "true" : "false");
        });
        const id = thumb.getAttribute("data-album-id");
        const title = thumb.getAttribute("data-album-title") || "Video";
        if (!id) return;
        if (autoplay) playInStage(id, title);
        else setStageFacade(id, title);
      }

      function selectSeries(key, { autoplayFirst }) {
        const showAll = key === "all";
        tabs.forEach((tab) => {
          const on = tab.getAttribute("data-series-tab") === key;
          tab.classList.toggle("is-active", on);
          tab.setAttribute("aria-selected", on ? "true" : "false");
          if (on) {
            const titleKey = tab.getAttribute("data-series-title-key");
            const metaKey = tab.getAttribute("data-series-meta-key");
            if (titleEl) {
              if (titleKey) titleEl.setAttribute("data-i18n", titleKey);
              titleEl.textContent = dictVal(titleKey, tab.textContent.trim());
            }
            if (metaEl) {
              if (metaKey) metaEl.setAttribute("data-i18n", metaKey);
              metaEl.textContent = dictVal(metaKey, "");
            }
          }
        });

        const visible = [];
        thumbs.forEach((thumb) => {
          const match = showAll || thumb.getAttribute("data-series") === key;
          thumb.classList.toggle("is-hidden", !match);
          thumb.hidden = !match;
          if (match) visible.push(thumb);
        });

        album.classList.toggle("is-showing-all", showAll);

        const strip = album.querySelector("[data-album-strip]");
        if (strip) strip.scrollTo({ left: 0, behavior: "smooth" });

        if (visible[0]) selectThumb(visible[0], { autoplay: !!autoplayFirst });
      }

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const key = tab.getAttribute("data-series-tab");
          if (!key) return;
          selectSeries(key, { autoplayFirst: false });
        });
      });

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          if (thumb.hidden) return;
          selectThumb(thumb, { autoplay: true });
        });
      });

      const initial =
        album.getAttribute("data-series-default") ||
        (tabs[0] && tabs[0].getAttribute("data-series-tab")) ||
        "family";
      selectSeries(initial, { autoplayFirst: false });

      const existingFacade = stage.querySelector(".yt-facade");
      if (existingFacade) bindFacade(existingFacade);
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

  function initSolSticky() {
    const bar = document.getElementById("solSticky");
    const hero = document.querySelector(".bm-hero--case, .bm-hero");
    if (!bar || !hero) return;
    const sync = () => {
      const past = window.scrollY > hero.offsetHeight * 0.35;
      bar.hidden = !past;
      document.body.classList.toggle("has-sol-sticky", past);
    };
    window.addEventListener("scroll", sync, { passive: true });
    sync();
  }

  function initReadyQuiz() {
    const quiz = document.getElementById("readyQuiz");
    if (!quiz) return;
    const items = [...quiz.querySelectorAll(".sol-quiz-item")];
    const result = document.getElementById("readyResult");
    const scoreEl = document.getElementById("readyScore");
    const progressBar = document.getElementById("readyProgress");
    const progressLabel = document.getElementById("readyProgressLabel");
    const answers = new Map();

    function updateProgress() {
      const done = answers.size;
      const total = items.length;
      if (progressBar) progressBar.style.width = `${(done / total) * 100}%`;
      if (progressLabel) progressLabel.textContent = `${done}/${total}`;
    }

    function render() {
      updateProgress();
      if (answers.size < items.length) return;
      let noCount = 0;
      answers.forEach((v) => {
        if (v === "no") noCount += 1;
      });
      const yesCount = items.length - noCount;
      if (result) result.hidden = false;
      if (scoreEl) {
        const dict = window.BM_I18N[getLang()] || {};
        const label = dict.csQuizScore || "Readiness score";
        scoreEl.textContent = `${label}: ${yesCount}/${items.length}`;
      }
      result?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    items.forEach((item, idx) => {
      item.querySelectorAll(".quiz-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const ans = btn.getAttribute("data-ans");
          answers.set(idx, ans);
          item.querySelectorAll(".quiz-btn").forEach((b) => {
            b.classList.toggle("is-active", b === btn);
            b.classList.toggle("is-no", b === btn && ans === "no");
            b.classList.toggle("is-yes", b === btn && ans === "yes");
          });
          item.classList.add("is-answered");
          render();
        });
      });
    });

    updateProgress();
  }

  function cleanLegacyHashes() {
    const hash = (location.hash || "").replace(/^#/, "");
    if (!hash) return;
    // Old bookmarks: #hero is unnecessary; #clients → #work
    if (hash === "hero") {
      history.replaceState(null, "", location.pathname + location.search);
      return;
    }
    if (hash === "clients") {
      history.replaceState(null, "", location.pathname + location.search + "#work");
      const el = document.getElementById("work");
      if (el) requestAnimationFrame(() => el.scrollIntoView());
    }
  }


  function initHeroParallax() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const frames = document.querySelectorAll("[data-parallax]");
    if (!frames.length) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        frames.forEach((el) => {
          const speed = parseFloat(el.getAttribute("data-parallax") || "0.05");
          const offset = Math.max(-18, Math.min(18, y * speed));
          const base = el.classList.contains("hero-frame--a") ? "rotate(3deg)" : el.classList.contains("hero-frame--b") ? "rotate(-4deg)" : "";
          el.style.transform = base ? base + " translate3d(0," + offset + "px,0)" : "translate3d(0," + offset + "px,0)";
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initCreativeAlbum() {
    const HD = ensureYtEmbedParams(
      "autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080&hd=1",
      { muteDefault: true }
    );

    document.querySelectorAll("[data-creative-album]").forEach((album) => {
      const stage = album.querySelector("[data-album-stage]");
      if (!stage) return;
      const thumbs = album.querySelectorAll("[data-album-id]");
      const coverFit = stage.getAttribute("data-album-fit") === "cover";
      let resizeBound = null;

      function applyStageRatio(ratioAttr) {
        const raw = (ratioAttr || "16/9").trim();
        const parts = raw.split(/[/:]/).map((n) => Number(n));
        const w = parts[0] > 0 ? parts[0] : 16;
        const h = parts[1] > 0 ? parts[1] : 9;
        const rh = w / h;
        const portrait = rh < 0.85;
        const square = !portrait && rh <= 1.15;
        stage.style.setProperty("--album-ratio", `${w} / ${h}`);
        /* Inline aspect-ratio beats page-case-study 16:9 locks */
        stage.style.aspectRatio = `${w} / ${h}`;
        stage.classList.toggle("is-portrait", portrait);
        stage.classList.toggle("is-square", square);
        stage.classList.toggle("is-landscape", !square && !portrait);
        if (coverFit) {
          if (portrait) {
            stage.style.width = "min(100%, 420px)";
            stage.style.maxHeight = "min(78vh, 740px)";
          } else if (square) {
            stage.style.width = "min(100%, 560px)";
            stage.style.maxHeight = "min(70vh, 560px)";
          } else {
            stage.style.width = "min(100%, 920px)";
            stage.style.maxHeight = "min(70vh, 520px)";
          }
          stage.style.marginInline = "auto";
          stage.style.height = "auto";
        }
        stage.setAttribute("data-hero-zoom", "1");
      }

      function mountCoverIframe(iframe) {
        const fit = () => sizeCoverIframe(stage, iframe);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            fit();
            iframe.style.setProperty("pointer-events", "auto", "important");
          });
        });
        resizeBound = fit;
        window.addEventListener("resize", resizeBound, { passive: true });
      }

      function playInStage(id, title, ratioAttr) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${id}?${HD}`;
        iframe.title = title || "Video";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.loading = "eager";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("playsinline", "1");

        if (resizeBound) {
          window.removeEventListener("resize", resizeBound);
          resizeBound = null;
        }

        applyStageRatio(ratioAttr);

        if (coverFit) {
          mountCoverIframe(iframe);
        } else {
          iframe.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;";
        }

        stage.querySelectorAll("iframe, .yt-facade, .bm-sound-toggle").forEach((el) => el.remove());
        const corners = stage.querySelectorAll(".bm-video-corner");
        if (corners.length) {
          corners[corners.length - 1].after(iframe);
        } else {
          stage.prepend(iframe);
        }
        attachSoundToggle(stage);
      }

      const active = album.querySelector(
        ".creative-album-thumb.is-active[data-album-ratio], [data-album-id].is-active[data-album-ratio], [data-album-id].is-active"
      );
      if (active) applyStageRatio(active.getAttribute("data-album-ratio") || "16/9");

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          const id = thumb.getAttribute("data-album-id");
          if (!id) return;
          const title = thumb.getAttribute("data-album-title") || "Video";
          const ratio = thumb.getAttribute("data-album-ratio") || "16/9";

          thumbs.forEach((tEl) => {
            tEl.classList.remove("is-active");
            tEl.setAttribute("aria-pressed", "false");
          });
          thumb.classList.add("is-active");
          thumb.setAttribute("aria-pressed", "true");

          playInStage(id, title, ratio);
        });
      });
    });
  }

  function initYtFacades() {
    document.querySelectorAll(".yt-facade").forEach((btn) => {
      /* Album stages manage their own play/switch flow */
      if (btn.closest("[data-album-stage], [data-creative-album], [data-series-album]")) return;
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-yt-id");
        if (!id) return;
        const title = btn.getAttribute("data-yt-title") || "Video";
        let params = btn.getAttribute("data-yt-params") || "autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080&hd=1";
        if (!/[?&]vq=/.test(params)) params += "&vq=hd1080&hd=1";
        /* Default muted; visitor can unmute via the sound toggle */
        params = ensureYtEmbedParams(params, { muteDefault: true });
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${id}?${params}`;
        iframe.title = title;
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.loading = "eager";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("playsinline", "1");
        const parent = btn.parentElement;
        const heroReel = parent && parent.classList.contains("bm-video-crop--hero-reel");
        const shortCrop = parent && parent.classList.contains("short-crop-media");
        const albumCover =
          parent &&
          parent.hasAttribute("data-album-stage") &&
          parent.getAttribute("data-album-fit") === "cover";
        if (heroReel) {
          iframe.style.cssText =
            "position:absolute;top:50%;left:50%;width:178%;height:178%;max-width:none;transform:translate(-50%,-50%);border:0;pointer-events:auto;";
        } else if (shortCrop) {
          const isShort = btn.closest(".short-crop-media--short");
          const zoom = isShort ? "min-width:100%;min-height:125%;width:100%;height:100%;" : "min-width:100%;min-height:177.78%;width:100%;height:100%;";
          iframe.style.cssText =
            "position:absolute;top:50%;left:50%;max-width:none;transform:translate(-50%,-50%);border:0;pointer-events:auto;" + zoom;
        } else if (albumCover) {
          sizeCoverIframe(parent, iframe);
          iframe.style.setProperty("pointer-events", "auto", "important");
          window.addEventListener(
            "resize",
            () => {
              if (iframe.isConnected) sizeCoverIframe(parent, iframe);
            },
            { passive: true }
          );
        } else {
          iframe.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;";
        }
        if (parent && getComputedStyle(parent).position === "static") {
          parent.style.position = "relative";
        }
        btn.replaceWith(iframe);
        if (parent) attachSoundToggle(parent);
      });
    });
  }

  function initMedPillars() {
    const collapseCoreOnMobile = () => {
      if (!window.matchMedia("(max-width: 720px)").matches) return;
      document.querySelectorAll(".page-hub--med .med-pillars-grid--core .med-pillar.is-open").forEach((card) => {
        if (card.classList.contains("med-pillar--lead")) return;
        const btn = card.querySelector("[data-pillar-toggle]");
        const panel = card.querySelector("[data-pillar-panel]");
        card.classList.remove("is-open");
        if (btn) btn.setAttribute("aria-expanded", "false");
        if (panel) panel.hidden = true;
      });
    };

    document.querySelectorAll(".med-pillars-grid").forEach((root) => {
      root.querySelectorAll("[data-pillar-toggle]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = btn.closest(".med-pillar");
          const panel = card && card.querySelector("[data-pillar-panel]");
          if (!card || !panel) return;

          const willOpen = !card.classList.contains("is-open");
          card.classList.toggle("is-open", willOpen);
          btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
          panel.hidden = !willOpen;
        });
      });
    });

    collapseCoreOnMobile();
  }

  function initSectorBridgeFace() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll("[data-face-look]").forEach((stage) => {
      const face = stage.querySelector(".sector-bridge-face");
      if (!face) return;

      const reset = () => {
        face.style.setProperty("--look-x", "0");
        face.style.setProperty("--look-y", "0");
        face.classList.remove("is-look-med", "is-look-prop");
      };

      const onMove = (e) => {
        const rect = face.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rtl = document.documentElement.getAttribute("dir") === "rtl";
        let dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 56));
        const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 56));
        if (rtl) dx = -dx;
        face.style.setProperty("--look-x", dx.toFixed(3));
        face.style.setProperty("--look-y", dy.toFixed(3));
      };

      const lookToSide = (side) => {
        const rtl = document.documentElement.getAttribute("dir") === "rtl";
        /* In LTR: med is left (−1), prop is right (+1). RTL flips visual halves via SVG scale. */
        let x = side === "med" ? -0.85 : 0.85;
        if (rtl) x = -x;
        face.style.setProperty("--look-x", String(x));
        face.style.setProperty("--look-y", "0");
        face.classList.toggle("is-look-med", side === "med");
        face.classList.toggle("is-look-prop", side === "prop");
      };

      stage.addEventListener("mousemove", onMove, { passive: true });
      stage.addEventListener("mouseleave", reset);

      stage.querySelectorAll("[data-face-side]").forEach((card) => {
        const side = card.getAttribute("data-face-side");
        card.addEventListener("mouseenter", () => lookToSide(side));
        card.addEventListener("mouseleave", reset);
      });
    });
  }

  function initTrustTickets() {
    const track = document.querySelector("[data-trust-track]");
    if (!track || track.dataset.looped === "1") return;
    const tickets = Array.from(track.children);
    if (tickets.length < 2) return;
    tickets.forEach((ticket) => {
      const clone = ticket.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("[data-i18n]").forEach((el) => el.removeAttribute("data-i18n"));
      track.appendChild(clone);
    });
    track.dataset.looped = "1";
  }

  document.addEventListener("DOMContentLoaded", () => {
    cleanLegacyHashes();
    initLang();
    initAnalytics();
    initHeader();
    initReveal();
    initTracking();
    initForm();
    initThanksPage();
    initHeroVideo();
    initHeroReelAutoplay();
    initHeroParallax();
    initYtFacades();
    initCreativeAlbum();
    initSeriesAlbum();
    initCaseFilters();
    initSolSticky();
    initReadyQuiz();
    initMedPillars();
    initSectorBridgeFace();
    initTrustTickets();
  });
})();
