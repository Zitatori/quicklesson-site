/*
 * QuickLesson landing page.
 * Each language is its own pre-rendered page: /ja/ /en/ /fr/ /es/
 * (built from _build/template.html + _build/i18n.js via `node _build/build.js`).
 *
 * This script only:
 *   - stamps the current year in the footer
 *   - makes the language <select> navigate to the matching /<lang>/ page
 */
(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var select = document.getElementById("languageSelect");
  if (!select) return;

  var current = (document.documentElement.lang || "ja").slice(0, 2);
  select.value = current;

  select.addEventListener("change", function (e) {
    var lang = e.target.value;
    // Pages live at /<lang>/ , so hop to the sibling directory.
    window.location.href = "../" + lang + "/";
  });
})();
