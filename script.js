/*
 * QuickLesson site.
 * Pages are pre-rendered per language (/ja/ /en/ /fr/ /es/) and per SEO page
 * (/en/<slug>/…) by `node _build/build.js`.
 *
 * This script only:
 *   - stamps the current year in the footer
 *   - makes the language <select> navigate to the matching URL
 *     (each page ships a window.QL_LANG_URLS map; falls back to /<lang>/)
 */
(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var select = document.getElementById("languageSelect");
  if (!select) return;

  var map = window.QL_LANG_URLS || {};
  var current = (document.documentElement.lang || "ja").slice(0, 2);
  select.value = current;

  select.addEventListener("change", function (e) {
    var lang = e.target.value;
    window.location.href = map[lang] || "/" + lang + "/";
  });
})();

// Only the app origin is installable; these are instructions, not an LP install prompt.
(function () {
  var ua = navigator.userAgent || "";
  var ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var platform = ios ? "ios" : /Android/.test(ua) ? "android" : null;
  if (!platform) return; // Desktop and unknown devices retain both instructions.
  document.querySelectorAll("[data-install-platform]").forEach(function (item) {
    item.hidden = item.getAttribute("data-install-platform") !== platform;
  });
})();

// ECB reference snapshot, 2026-11-10: EUR 1 = CHF 0.9203 = JPY 177.38.
// Display only: official CHF prices always remain visible.
(function () {
  var select = document.getElementById('referenceCurrency');
  if (!select) return;
  var rates = { CHF: 1, EUR: 1 / 0.9203, JPY: 177.38 / 0.9203 };
  function update() {
    document.querySelectorAll('[data-chf]').forEach(function (item) {
      item.textContent = select.value === 'CHF' ? '' : '≈ ' + new Intl.NumberFormat(document.documentElement.lang, {
        style: 'currency', currency: select.value
      }).format(Number(item.getAttribute('data-chf')) * rates[select.value]);
    });
  }
  select.addEventListener('change', update);
  update();
})();
