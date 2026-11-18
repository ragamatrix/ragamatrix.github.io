/* Ajoute les 25 photos Street verticales à la galerie avant son initialisation. */
(function () {
  "use strict";

  var grid = document.getElementById("grid");
  if (!grid) return;

  for (var n = 1; n <= 25; n += 1) {
    var number = String(n);
    var src = "photo/street_" + number + ".jpeg";
    var figure = document.createElement("figure");
    figure.className = "item";
    figure.setAttribute("data-collection", "street");
    figure.setAttribute("data-collection-label", "Street");
    figure.setAttribute("data-title", "Street vertical " + number);
    figure.setAttribute("data-large", src);
    figure.setAttribute("data-exif", "");
    figure.setAttribute("tabindex", "0");
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", "View Street vertical " + number + " full size");

    var img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = "Street vertical " + number;

    var caption = document.createElement("figcaption");
    var title = document.createElement("span");
    title.className = "t";
    title.textContent = "Street vertical " + number;
    var label = document.createElement("span");
    label.className = "c";
    label.textContent = "Street";
    caption.appendChild(title);
    caption.appendChild(label);
    figure.appendChild(img);
    figure.appendChild(caption);
    grid.appendChild(figure);
  }
})();
