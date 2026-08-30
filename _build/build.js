#!/usr/bin/env node
/*
 * Renders the QuickLesson landing page into one static page per language:
 *   /ja/index.html  /en/index.html  /fr/index.html  /es/index.html
 * plus a root /index.html that redirects to the visitor's language.
 *
 * Inputs:  _build/template.html  +  _build/i18n.js
 * Run:     node _build/build.js   (from the repo root)
 *
 * The generated files are committed to the repo — do not hand-edit them.
 * Edit the template or the copy in _build/, then re-run this script.
 */
const fs = require("fs");
const path = require("path");
const { titles, descriptions, ogDescriptions, ogLocales, translations } = require("./i18n");

const ROOT = path.join(__dirname, "..");
const LANGS = ["ja", "en", "fr", "es"];
const DEFAULT_LANG = "ja";

const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");

function render(lang) {
  const t = translations[lang];
  if (!t) throw new Error(`No translations for "${lang}"`);

  let html = template
    .split("{{LANG}}").join(lang)
    .split("{{TITLE}}").join(titles[lang])
    .split("{{META_DESC}}").join(descriptions[lang])
    .split("{{OG_DESC}}").join(ogDescriptions[lang])
    .split("{{OG_LOCALE}}").join(ogLocales[lang]);

  for (const [key, value] of Object.entries(t)) {
    html = html.split(`{{${key}}}`).join(value);
  }

  const leftover = html.match(/\{\{[A-Za-z0-9_]+\}\}/g);
  if (leftover) {
    throw new Error(`Unresolved placeholders for "${lang}": ${[...new Set(leftover)].join(", ")}`);
  }
  return html;
}

function rootRedirect() {
  const alternates = LANGS
    .map((l) => `  <link rel="alternate" hreflang="${l}" href="https://quicklesson5min.com/${l}/" />`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>QuickLesson</title>
  <link rel="canonical" href="https://quicklesson5min.com/${DEFAULT_LANG}/" />
${alternates}
  <link rel="alternate" hreflang="x-default" href="https://quicklesson5min.com/${DEFAULT_LANG}/" />
  <meta http-equiv="refresh" content="0; url=${DEFAULT_LANG}/" />
  <script>
    (function () {
      var supported = { ${LANGS.map((l) => `${l}: 1`).join(", ")} };
      var lang = (navigator.language || navigator.userLanguage || "${DEFAULT_LANG}").slice(0, 2).toLowerCase();
      window.location.replace((supported[lang] ? lang : "${DEFAULT_LANG}") + "/");
    })();
  </script>
</head>
<body>
  <p><a href="${DEFAULT_LANG}/">QuickLesson</a></p>
</body>
</html>
`;
}

for (const lang of LANGS) {
  const dir = path.join(ROOT, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(lang));
  console.log(`built /${lang}/index.html`);
}
fs.writeFileSync(path.join(ROOT, "index.html"), rootRedirect());
console.log("built /index.html (redirect)");
