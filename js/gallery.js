/* ragamatrix — galerie : filtres, chargement différé, visionneuse */
(function () {
  "use strict";

  var items = Array.prototype.slice.call(document.querySelectorAll(".item"));
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));

  /* ---------- protection des images ---------- */
  document.addEventListener("contextmenu", function (e) {
    if (e.target.tagName === "IMG" || e.target.closest(".item, .lb-figure")) e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  /* ---------- fondu d'apparition des images ---------- */
  items.forEach(function (item) {
    var img = item.querySelector("img");
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", function () { img.classList.add("loaded"); });
      img.addEventListener("error", function () { img.classList.add("loaded"); });
    }
  });

  /* ---------- filtres ---------- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var show = f === "all" || item.getAttribute("data-collection") === f;
        item.classList.toggle("hidden", !show);
      });
    });
  });

  /* ---------- visionneuse ---------- */
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var lbImg = lightbox.querySelector(".lightbox-stage img");
  var lbTitle = lightbox.querySelector(".lightbox-caption .t");
  var lbCollection = lightbox.querySelector(".lightbox-caption .collection");
  var lbExif = lightbox.querySelector(".lightbox-caption .exif");
  var lbCounter = lightbox.querySelector(".lightbox-counter");
  var current = -1;

  lbImg.addEventListener("load", function () { lbImg.classList.add("loaded"); });
  lbImg.addEventListener("error", function () { lbImg.classList.add("loaded"); });

  function visibleItems() {
    return items.filter(function (i) { return !i.classList.contains("hidden"); });
  }

  function show(index) {
    var list = visibleItems();
    if (index < 0) index = list.length - 1;
    if (index >= list.length) index = 0;
    current = index;
    var item = list[index];
    var img = item.querySelector("img");

    lbImg.classList.remove("loaded");
    var src = item.getAttribute("data-large") || img.src;
    if (lbImg.dataset.cur === src && lbImg.complete) {
      lbImg.classList.add("loaded");
    } else {
      lbImg.dataset.cur = src;
      lbImg.src = src;
    }
    lbImg.alt = img.alt;

    lbTitle.textContent = item.getAttribute("data-title") || "";
    lbCollection.textContent = item.getAttribute("data-collection-label") || "";
    var exif = item.getAttribute("data-exif") || "";
    lbExif.textContent = exif;
    lbExif.style.display = exif ? "" : "none";

    lbCounter.textContent = (index + 1) + " / " + list.length;
  }

  function open(item) {
    var list = visibleItems();
    show(list.indexOf(item));
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  items.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      open(item);
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-nav.prev").addEventListener("click", function () { show(current - 1); });
  lightbox.querySelector(".lightbox-nav.next").addEventListener("click", function () { show(current + 1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* navigation par glissement tactile */
  var startX = null;
  lightbox.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
    startX = null;
  }, { passive: true });
})();
