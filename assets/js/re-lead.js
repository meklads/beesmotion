/* Real-estate project assessment form: posts to /api/lead.
   If the endpoint is unavailable or not configured, offers WhatsApp instead.
   It only shows the success message when the server confirmed delivery. */
(function () {
  var form = document.getElementById("reForm");
  if (!form) return;

  var STORAGE_KEY = "bm-lang-v3";
  var statusEl = document.getElementById("reStatus");
  var submitBtn = form.querySelector('button[type="submit"]');

  function lang() {
    try { return localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "en"; } catch (_) { return "en"; }
  }
  function t(key) {
    var d = (window.BM_I18N || {})[lang()] || {};
    return d[key] || "";
  }
  function track(name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (_) {}
  }
  function setStatus(message, kind) {
    statusEl.className = "re-status" + (kind ? " " + kind : "");
    statusEl.textContent = message || "";
  }
  function optionText(select) {
    var o = select && select.selectedOptions && select.selectedOptions[0];
    return o && select.value ? o.textContent.trim() : "";
  }
  function waNumber() {
    return (window.BM_SITE && window.BM_SITE.whatsapp) || "966502786513";
  }

  function whatsappUrl() {
    var f = form.elements;
    var rows = [
      [t("rjFName"), f.name.value.trim()],
      [t("rjFCompany"), f.company.value.trim()],
      [t("rjFPhone"), f.phone.value.trim()],
      [t("rjFEmail"), f.email.value.trim()],
      [t("rjFProject"), f.project.value.trim()],
      [t("rjFType"), optionText(f.projectType)],
      [t("rjFLoc"), f.location.value.trim()],
      [t("rjFStage"), optionText(f.stage)],
      [t("rjFMat"), optionText(f.materials)],
      [t("rjFTime"), optionText(f.timeframe)],
      [t("rjFSupport"), optionText(f.support)],
      [t("rjFNotes"), f.notes.value.trim()],
    ].filter(function (r) { return r[1]; });
    var head = lang() === "ar" ? "مرحباً Bees Motion — طلب تقييم مشروع عقاري" : "Hello Bees Motion — real estate project assessment request";
    var text = [head].concat(rows.map(function (r) { return r[0] + ": " + r[1]; })).join("\n");
    return "https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(text);
  }

  function showFallback() {
    var url = whatsappUrl();
    statusEl.className = "re-status warn";
    statusEl.textContent = t("rjFallback");
    var a = document.createElement("a");
    a.className = "btn btn-pill btn-gold";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = t("rjFallbackBtn");
    a.setAttribute("data-track", "click_whatsapp");
    statusEl.appendChild(document.createElement("br"));
    statusEl.appendChild(a);
    track("generate_lead", { method: "whatsapp_fallback", source: "re_assessment", lang: lang() });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(t("rjErr"), "err");
      return;
    }
    var f = form.elements;
    var payload = {
      name: f.name.value, company: f.company.value, phone: f.phone.value, email: f.email.value,
      project: f.project.value, projectType: f.projectType.value, location: f.location.value,
      stage: f.stage.value, materials: f.materials.value, timeframe: f.timeframe.value,
      support: f.support.value, notes: f.notes.value, website: f.website.value,
      consent: f.consent.checked === true, lang: lang(), source: "propmotion-assessment",
    };

    submitBtn.disabled = true;
    setStatus(t("rjSending"), "");

    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
      })
      .then(function (r) {
        if (r.res.ok && r.data && r.data.ok) {
          track("generate_lead", { method: "api", source: "re_assessment", lang: lang() });
          setStatus(t("rjOk"), "ok");
          form.reset();
        } else if (r.res.status === 400) {
          setStatus(t("rjErr"), "err");
        } else {
          showFallback();
        }
      })
      .catch(function () { showFallback(); })
      .then(function () { submitBtn.disabled = false; });
  });
})();
