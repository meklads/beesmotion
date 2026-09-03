(function () {
  function playMedXpVideo(videoId, startTime) {
    var modal = document.getElementById("medVideoModal");
    var container = document.getElementById("medVideoModalPlayer");
    if (!modal || !container) return;
    var src =
      "https://www.youtube.com/embed/" +
      videoId +
      "?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1";
    if (startTime !== undefined && startTime !== null) src += "&start=" + startTime;
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", src);
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.style.cssText = "width:100%;height:100%;border:0;";
    container.innerHTML = "";
    container.appendChild(iframe);
    modal.style.display = "flex";
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeMedXpVideo() {
    var modal = document.getElementById("medVideoModal");
    var container = document.getElementById("medVideoModalPlayer");
    if (!modal) return;
    modal.style.display = "none";
    modal.classList.remove("is-open");
    if (container) container.innerHTML = "";
    document.body.style.overflow = "";
  }

  function openMedXpImage(src) {
    var modal = document.getElementById("medImageLightbox");
    var modalImg = document.getElementById("medImageLightboxImg");
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.style.display = "flex";
    requestAnimationFrame(function () {
      modal.style.opacity = "1";
    });
    document.body.style.overflow = "hidden";
  }

  function closeMedXpLightbox(e) {
    var modal = document.getElementById("medImageLightbox");
    if (!modal) return;
    if (e && e.target !== modal && !e.target.closest(".image-lightbox-close")) return;
    modal.style.opacity = "0";
    setTimeout(function () {
      modal.style.display = "none";
      var img = document.getElementById("medImageLightboxImg");
      if (img) img.removeAttribute("src");
    }, 300);
    document.body.style.overflow = "";
  }

  window.playMedXpVideo = playMedXpVideo;
  window.closeMedXpVideo = closeMedXpVideo;
  window.openMedXpImage = openMedXpImage;
  window.closeMedXpLightbox = closeMedXpLightbox;

  document.addEventListener("DOMContentLoaded", function () {
    var videoModal = document.getElementById("medVideoModal");
    if (videoModal) {
      videoModal.addEventListener("click", function (e) {
        if (e.target === videoModal) closeMedXpVideo();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var lightbox = document.getElementById("medImageLightbox");
      if (lightbox && lightbox.style.display === "flex") {
        closeMedXpLightbox();
        return;
      }
      if (videoModal && videoModal.style.display === "flex") closeMedXpVideo();
    });
  });
})();
