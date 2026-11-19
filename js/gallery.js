/* ragamatrix — galerie : filtres, chargement différé, visionneuse */
(function () {
  "use strict";

  var grid = document.getElementById("grid");
  if (grid) {
    for (var n = 1; n <= 42; n += 1) {
      var number = String(n);
      var src = "photo/street_H_" + number + ".jpeg";
      var figure = document.createElement("figure");
      figure.className = "item";
      figure.setAttribute("data-collection", "street");
      figure.setAttribute("data-collection-label", "Street");
      figure.setAttribute("data-title", "Street horizontal " + number);
      figure.setAttribute("data-large", src);
      figure.setAttribute("data-exif", "");
      figure.setAttribute("tabindex", "0");
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", "View Street horizontal " + number + " full size");

      var img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.src = src;
      img.alt = "Street horizontal " + number;

      var caption = document.createElement("figcaption");
      var title = document.createElement("span");
      title.className = "t";
      title.textContent = "Street horizontal " + number;
      var label = document.createElement("span");
      label.className = "c";
      label.textContent = "Street";
      caption.appendChild(title);
      caption.appendChild(label);
      figure.appendChild(img);
      figure.appendChild(caption);
      grid.appendChild(figure);
    }

    var pngSrc = "photo/street_H_1.png";
    var pngFigure = document.createElement("figure");
    pngFigure.className = "item";
    pngFigure.setAttribute("data-collection", "street");
    pngFigure.setAttribute("data-collection-label", "Street");
    pngFigure.setAttribute("data-title", "Street horizontal 1 PNG");
    pngFigure.setAttribute("data-large", pngSrc);
    pngFigure.setAttribute("data-exif", "");
    pngFigure.setAttribute("tabindex", "0");
    pngFigure.setAttribute("role", "button");
    pngFigure.setAttribute("aria-label", "View Street horizontal 1 PNG full size");

    var pngImg = document.createElement("img");
    pngImg.loading = "lazy";
    pngImg.decoding = "async";
    pngImg.src = pngSrc;
    pngImg.alt = "Street horizontal 1 PNG";

    var pngCaption = document.createElement("figcaption");
    var pngTitle = document.createElement("span");
    pngTitle.className = "t";
    pngTitle.textContent = "Street horizontal 1 PNG";
    var pngLabel = document.createElement("span");
    pngLabel.className = "c";
    pngLabel.textContent = "Street";
    pngCaption.appendChild(pngTitle);
    pngCaption.appendChild(pngLabel);
    pngFigure.appendChild(pngImg);
    pngFigure.appendChild(pngCaption);
    grid.appendChild(pngFigure);

    var nightNames = [
      "0001","0002","0003","002","004","02","10","100","11","12","13","14","15","16","17","18","19","2","20","21","22","23","24","25","26","29","3","30","31","32","34","35","36","37","38","39","4","42","43","44","45","46","47","48","5","50","51","52","53","54","55","56","59","6","60","601","61","62","63","64","65","66","69","70","71","72","73","74","75","76","77","78","79","8","81","82","83","85","86","88","89","91","92","93","94","95","96","97","98","99"
    ];

    nightNames.forEach(function (name) {
      var src = "photo/night_V" + name + ".jpeg";
      var figure = document.createElement("figure");
      figure.className = "item";
      figure.setAttribute("data-collection", "night");
      figure.setAttribute("data-collection-label", "Night");
      figure.setAttribute("data-title", "Night " + name);
      figure.setAttribute("data-large", src);
      figure.setAttribute("data-exif", "");
      figure.setAttribute("tabindex", "0");
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", "View night photo " + name + " full size");

      var img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.src = src;
      img.alt = "Night " + name;

      var caption = document.createElement("figcaption");
      var title = document.createElement("span");
      title.className = "t";
      title.textContent = "Night " + name;
      var label = document.createElement("span");
      label.className = "c";
      label.textContent = "Night";
      caption.appendChild(title);
      caption.appendChild(label);
      figure.appendChild(img);
      figure.appendChild(caption);
      grid.appendChild(figure);
    });
  }

  /* Reserve mobile lightbox space for the controls and account for phone browser chrome. */
  var mobileLightboxStyles = document.createElement("style");
  mobileLightboxStyles.textContent = "@media (max-width: 560px) { .lightbox { height: 100vh; height: 100dvh; padding-bottom: env(safe-area-inset-bottom); } .lightbox-stage { padding-left: 54px; padding-right: 54px; } }";
  document.head.appendChild(mobileLightboxStyles);

  var items = Array.prototype.slice.call(document.querySelectorAll(".item"));
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  var photoCount = document.querySelector(".hero .meta span b");
  if (photoCount) photoCount.textContent = items.length;

  document.addEventListener("contextmenu", function (e) {
    if (e.target.tagName === "IMG" || e.target.closest(".item, .lb-figure")) e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

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

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        item.classList.toggle("hidden", f !== "all" && item.getAttribute("data-collection") !== f);
      });
    });
  });

  var lightbox = document.getElementById("lightbox");
  if (!lightbox || !grid) return;
  var lbImg = lightbox.querySelector(".lightbox-stage img");
  var lbTitle = lightbox.querySelector(".lightbox-caption .t");
  var lbCollection = lightbox.querySelector(".lightbox-caption .collection");
  var lbExif = lightbox.querySelector(".lightbox-caption .exif");
  var lbCounter = lightbox.querySelector(".lightbox-counter");
  var current = -1;

  lbImg.addEventListener("load", function () { lbImg.classList.add("loaded"); });
  lbImg.addEventListener("error", function () { lbImg.classList.add("loaded"); });

  function visibleItems() {
    return items.filter(function (item) { return !item.classList.contains("hidden"); });
  }

  function show(index) {
    var list = visibleItems();
    if (!list.length) return;
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
    if (!item || item.classList.contains("hidden")) return;
    show(visibleItems().indexOf(item));
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  grid.addEventListener("click", function (e) {
    var item = e.target.closest(".item");
    if (!item || !grid.contains(item)) return;
    e.preventDefault();
    open(item);
  });
  grid.addEventListener("keydown", function (e) {
    var item = e.target.closest(".item");
    if (item && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      open(item);
    }
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

  var startTouch = null;
  lightbox.addEventListener("touchstart", function (e) {
    var stage = e.target.closest(".lightbox-stage");
    startTouch = stage ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
  }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    if (!startTouch) return;
    var dx = e.changedTouches[0].clientX - startTouch.x;
    var dy = e.changedTouches[0].clientY - startTouch.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      show(dx < 0 ? current + 1 : current - 1);
    }
    startTouch = null;
  }, { passive: true });
})();
