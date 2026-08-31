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
