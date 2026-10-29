/* Shared copy for the 2026 design system pages. Loaded after translations.js on every redesigned page. */
(function () {
  var w = window; w.BM_I18N = w.BM_I18N || {}; w.BM_I18N.en = w.BM_I18N.en || {}; w.BM_I18N.ar = w.BM_I18N.ar || {};
  var en = {
    "hmFaqSub": "Have a question that isn't here? Ask us directly — a person replies, usually the same day.",
    "hmFaqCta": "Ask on WhatsApp",
    "pmMore": "Completion and what we need from you"
  };
  var ar = {
    "hmFaqSub": "لديك سؤال غير موجود هنا؟ اسألنا مباشرة — يرد عليك شخص من الفريق، غالباً في نفس اليوم.",
    "hmFaqCta": "اسألنا على واتساب",
    "pmMore": "متى تكتمل المرحلة وما نحتاجه منك"
  };
  Object.keys(en).forEach(function (k) { w.BM_I18N.en[k] = en[k]; });
  Object.keys(ar).forEach(function (k) { w.BM_I18N.ar[k] = ar[k]; });
})();
