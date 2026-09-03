(function () {
  const WA = "966502786513";
  // v2: English is the site default; old "bm-lang" prefs are ignored once.
  const STORAGE_KEY = "bm-lang-v2";
  const DEFAULT_LANG = "en";

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
    return DEFAULT_LANG;
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
      } else if (el.tagName === "OPTION") {
        el.textContent = val;
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

  function initTracking() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-track]");
      if (!el) return;
      track(el.getAttribute("data-track"), {
        href: el.getAttribute("href") || "",
        lang: getLang(),
      });
    });
  }

  function initForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const lang = getLang();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const company = form.company.value.trim();
      const industryEl = form.industry;
      const needEl = form.need;
      const industry = industryEl ? industryEl.value : "";
      const need = needEl ? needEl.value : "";
      const industryLabel = industryEl && industryEl.selectedOptions[0]
        ? industryEl.selectedOptions[0].textContent.trim()
        : industry;
      const needLabel = needEl && needEl.selectedOptions[0]
        ? needEl.selectedOptions[0].textContent.trim()
        : need;
      const message = form.message.value.trim();
      track("cta_form_whatsapp", { industry: industry, need: need, lang: lang });
      const lines =
        lang === "ar"
          ? [
              "مرحباً بيز موشن،",
              `الاسم: ${name}`,
              `الجوال: ${phone}`,
              `الشركة: ${company}`,
              `القطاع: ${industryLabel}`,
              `الاحتياج: ${needLabel}`,
              `الطلب: ${message}`,
            ]
          : [
              "Hello Bees Motion,",
              `Name: ${name}`,
              `Phone: ${phone}`,
              `Company: ${company}`,
              `Industry: ${industryLabel}`,
              `Need: ${needLabel}`,
              `Request: ${message}`,
            ];
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
        /* popup blocked — thank-you page will offer WhatsApp again */
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

  function buildHeroIframe(id, title) {
    const iframe = document.createElement("iframe");
    iframe.src =
      `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
      "&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&vq=hd1080&hd=1";
    iframe.title = title || "Showreel";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "eager";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("frameborder", "0");
    iframe.style.cssText =
      "position:absolute;top:50%;left:50%;width:178%;height:178%;max-width:none;transform:translate(-50%,-50%);border:0;pointer-events:none;";
    return iframe;
  }

  function initHeroReelAutoplay() {
    const mq = window.matchMedia("(min-width: 901px)");
    const crops = document.querySelectorAll("[data-hero-autoplay]");
    if (!crops.length) return;

    function sync() {
      crops.forEach((crop) => {
        const id = crop.getAttribute("data-hero-autoplay");
        if (!id) return;
        const title = crop.getAttribute("data-hero-title") || "Showreel";
        const facade = crop.querySelector(".yt-facade");
        const iframe = crop.querySelector("iframe");
        if (mq.matches) {
          if (!iframe) {
            const next = buildHeroIframe(id, title);
            if (facade) facade.replaceWith(next);
            else crop.appendChild(next);
          }
        } else if (iframe && !facade) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "yt-facade yt-facade--cover";
          btn.setAttribute("data-yt-id", id);
          btn.setAttribute("data-yt-title", title);
          btn.setAttribute(
            "data-yt-params",
            `autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&playsinline=1&rel=0&vq=hd1080&hd=1`
          );
          btn.setAttribute("aria-label", "Play showreel");
          btn.innerHTML =
            `<img src="assets/img/thumbs/${id}.jpg" alt="${title}" loading="eager" width="1280" height="720" />` +
            '<span class="yt-facade-play" aria-hidden="true"></span>';
          iframe.replaceWith(btn);
          btn.addEventListener("click", () => {
            const play = buildHeroIframe(id, title);
            play.style.pointerEvents = "auto";
            play.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080&hd=1`;
            btn.replaceWith(play);
          });
        }
      });
    }

    sync();
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", sync);
    else if (typeof mq.addListener === "function") mq.addListener(sync);
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

  function initSeriesAlbum() {
    const HD =
      "autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080&hd=1";

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

        stage.querySelectorAll("iframe, .yt-facade").forEach((el) => el.remove());
        const corners = stage.querySelectorAll(".bm-video-corner");
        if (corners.length) corners[corners.length - 1].after(iframe);
        else stage.prepend(iframe);
      }

      function setStageFacade(id, title) {
        stage.querySelectorAll("iframe, .yt-facade").forEach((el) => el.remove());
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "yt-facade yt-facade--cover";
        btn.setAttribute("data-yt-id", id);
        btn.setAttribute("data-yt-title", title || "Video");
        btn.setAttribute("data-yt-params", HD);
        btn.setAttribute("aria-label", title || "Play episode");
        btn.innerHTML =
          `<img src="assets/img/thumbs/${id}.jpg" alt="" loading="eager" width="1280" height="720" />` +
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
      const past = window.scrollY > hero.offsetHeight * 0.65;
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
    const HD =
      "autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080&hd=1";

    document.querySelectorAll("[data-creative-album]").forEach((album) => {
      const stage = album.querySelector("[data-album-stage]");
      if (!stage) return;
      const thumbs = album.querySelectorAll("[data-album-id]");

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

        stage.querySelectorAll("iframe, .yt-facade").forEach((el) => el.remove());
        const corners = stage.querySelectorAll(".bm-video-corner");
        if (corners.length) {
          corners[corners.length - 1].after(iframe);
        } else {
          stage.prepend(iframe);
        }
      }

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          const id = thumb.getAttribute("data-album-id");
          if (!id) return;
          const title = thumb.getAttribute("data-album-title") || "Video";

          thumbs.forEach((tEl) => {
            tEl.classList.remove("is-active");
            tEl.setAttribute("aria-pressed", "false");
          });
          thumb.classList.add("is-active");
          thumb.setAttribute("aria-pressed", "true");

          playInStage(id, title);
        });
      });
    });
  }

  function initYtFacades() {
    document.querySelectorAll(".yt-facade").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-yt-id");
        if (!id) return;
        const title = btn.getAttribute("data-yt-title") || "Video";
        let params = btn.getAttribute("data-yt-params") || "autoplay=1&rel=0&modestbranding=1&playsinline=1&vq=hd1080&hd=1";
        if (!/[?&]vq=/.test(params)) params += "&vq=hd1080&hd=1";
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
        if (heroReel) {
          iframe.style.cssText =
            "position:absolute;top:50%;left:50%;width:178%;height:178%;max-width:none;transform:translate(-50%,-50%);border:0;pointer-events:auto;";
        } else if (shortCrop) {
          const isShort = facade.closest(".short-crop-media--short");
          const zoom = isShort ? "min-width:100%;min-height:125%;width:100%;height:100%;" : "min-width:100%;min-height:177.78%;width:100%;height:100%;";
          iframe.style.cssText =
            "position:absolute;top:50%;left:50%;max-width:none;transform:translate(-50%,-50%);border:0;pointer-events:auto;" + zoom;
        } else {
          iframe.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;";
        }
        if (parent && getComputedStyle(parent).position === "static") {
          parent.style.position = "relative";
        }
        btn.replaceWith(iframe);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    cleanLegacyHashes();
    initLang();
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
  });
})();
