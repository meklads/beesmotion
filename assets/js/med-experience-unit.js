(function () {
  function playMedXpVideo(videoId, startTime) {
    var modal = document.getElementById("medVideoModal");
    var container = document.getElementById("medVideoModalPlayer");
    if (!modal || !container || !videoId) return;
    var src =
      "https://www.youtube.com/embed/" +
      encodeURIComponent(videoId) +
      "?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1";
    if (startTime !== undefined && startTime !== null && startTime !== "") {
      src += "&start=" + encodeURIComponent(String(startTime));
    }
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "Video";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.style.cssText = "width:100%;height:100%;border:0;";
    container.innerHTML = "";
    container.appendChild(iframe);
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("med-xp-modal-open");
  }

  function closeMedXpVideo() {
    var modal = document.getElementById("medVideoModal");
    var container = document.getElementById("medVideoModalPlayer");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    if (container) container.innerHTML = "";
    document.body.classList.remove("med-xp-modal-open");
  }

  function openMedXpImage(src) {
    var modal = document.getElementById("medImageLightbox");
    var modalImg = document.getElementById("medImageLightboxImg");
    if (!modal || !modalImg || !src) return;
    modalImg.src = src;
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () {
      modal.classList.add("is-visible");
    });
    document.body.classList.add("med-xp-modal-open");
  }

  function closeMedXpLightbox() {
    var modal = document.getElementById("medImageLightbox");
    if (!modal) return;
    modal.classList.remove("is-visible");
    modal.classList.remove("is-open");
    setTimeout(function () {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      var img = document.getElementById("medImageLightboxImg");
      if (img) img.removeAttribute("src");
    }, 200);
    document.body.classList.remove("med-xp-modal-open");
  }

  window.playMedXpVideo = playMedXpVideo;
  window.closeMedXpVideo = closeMedXpVideo;
  window.openMedXpImage = openMedXpImage;
  window.closeMedXpLightbox = closeMedXpLightbox;

  document.addEventListener("click", function (e) {
    var videoBtn = e.target.closest("[data-med-xp-video]");
    if (videoBtn) {
      e.preventDefault();
      playMedXpVideo(videoBtn.getAttribute("data-med-xp-video"), videoBtn.getAttribute("data-med-xp-start") || 0);
      return;
    }

    var imageBtn = e.target.closest("[data-med-xp-image]");
    if (imageBtn) {
      e.preventDefault();
      openMedXpImage(imageBtn.getAttribute("data-med-xp-image"));
      return;
    }

    if (e.target.closest("[data-med-xp-close-video]")) {
      e.preventDefault();
      closeMedXpVideo();
      return;
    }

    if (e.target.closest("[data-med-xp-close-image]")) {
      e.preventDefault();
      closeMedXpLightbox();
      return;
    }

    var videoModal = document.getElementById("medVideoModal");
    if (videoModal && e.target === videoModal) {
      closeMedXpVideo();
      return;
    }

    var imageModal = document.getElementById("medImageLightbox");
    if (imageModal && e.target === imageModal) {
      closeMedXpLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var imageModal = document.getElementById("medImageLightbox");
    if (imageModal && imageModal.classList.contains("is-open")) {
      closeMedXpLightbox();
      return;
    }
    var videoModal = document.getElementById("medVideoModal");
    if (videoModal && videoModal.classList.contains("is-open")) closeMedXpVideo();
  });
})();
