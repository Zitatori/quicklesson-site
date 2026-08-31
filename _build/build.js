#!/usr/bin/env node
/*
 * Renders every page of the QuickLesson site from shared parts:
 *   _build/layout.html            outer shell (<head> + slots)
 *   _build/partials/header.html   promo bar + <header> (reused everywhere)
 *   _build/partials/footer.html   <footer> (reused everywhere)
 *   _build/pages/lp.html          the landing-page body
 *   _build/pages/seo/*.html       one file per SEO landing page (written by hand)
 *   _build/i18n.js                shared copy for the 4 language LPs
 *
 * Output (committed to the repo — do not hand-edit):
 *   /ja/ /en/ /fr/ /es/ index.html        language landing pages
 *   /en/japanese-speaking-practice/…      SEO landing pages
 *   /index.html /404.html                 language redirects
 *
 * Run from the repo root:  node _build/build.js
 * To add an SEO page: write _build/pages/seo/<lang>-<slug>.html, add an entry
 * to the PAGES array below, re-run the build, commit the generated folder.
 */
const fs = require("fs");
const path = require("path");
const { titles, descriptions, ogDescriptions, ogLocales, translations } = require("./i18n");

const ROOT = path.join(__dirname, "..");
const BASE = "https://quicklesson5min.com";
const LANGS = ["ja", "en", "fr", "es"];
const DEFAULT_LANG = "ja";

const read = (p) => fs.readFileSync(path.join(__dirname, p), "utf8");
const layout = read("layout.html");
const headerPartial = read("partials/header.html");
const footerPartial = read("partials/footer.html");

// hreflang cluster shared by the 4 language landing pages
const LP_HREFLANG = [
  ...LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${BASE}/${l}/" />`),
  `  <link rel="alternate" hreflang="x-default" href="${BASE}/${DEFAULT_LANG}/" />`,
].join("\n");
const LP_LANG_URLS = Object.fromEntries(LANGS.map((l) => [l, `/${l}/`]));

// SEO landing pages linked from the footer, per language. Keep the labels short.
const GUIDES = {
  ja: [],
  en: [{ href: "/en/japanese-speaking-practice/", label: "Japanese speaking practice" }],
  fr: [],
  es: [],
};
const GUIDE_LABELS = { ja: "ガイド", en: "Guides", fr: "Guides", es: "Guías" };

function guidesBlock(lang) {
  const items = GUIDES[lang] || [];
  if (!items.length) return "";
  const links = items
    .map((g) => `<a href="${g.href}">${g.label}</a>`)
    .join("\n      ");
  return `    <div class="container footer-guides">
      <span>${GUIDE_LABELS[lang]}</span>
      ${links}
    </div>\n`;
}

/* --------------------------------------------------------------------------
 * Page manifest. Landing pages are generated from i18n.js; SEO pages carry
 * their own metadata and point at a hand-written body file.
 * ------------------------------------------------------------------------ */
const PAGES = [
  ...LANGS.map((lang) => ({
    lang,
    out: `${lang}/index.html`,
    body: "pages/lp.html",
    strings: translations[lang],
    title: titles[lang],
    metaDesc: descriptions[lang],
    ogDesc: ogDescriptions[lang],
    ogType: "website",
    ogLocale: ogLocales[lang],
    canonical: `${BASE}/${lang}/`,
    hreflang: LP_HREFLANG,
    langUrls: LP_LANG_URLS,
    navPrefix: "",
    home: "#top",
  })),

  {
    lang: "en",
    out: "en/japanese-speaking-practice/index.html",
    body: "pages/seo/en-japanese-speaking-practice.html",
    strings: translations.en, // header / footer chrome only
    title: "Japanese Speaking Practice: How to Practice Speaking Japanese Online",
    metaDesc:
      "Looking for more opportunities to speak Japanese? Discover practical ways to practice Japanese conversation online, even if you only have a few minutes a day.",
    ogDesc:
      "Practical ways to practice speaking Japanese online, even with only a few minutes a day.",
    ogType: "article",
    ogLocale: "en_US",
    canonical: `${BASE}/en/japanese-speaking-practice/`,
    // Only the EN version exists today. When the FR / ES articles are written,
    // add their <link rel="alternate" hreflang="…"> lines here.
    hreflang: `  <link rel="alternate" hreflang="en" href="${BASE}/en/japanese-speaking-practice/" />`,
    langUrls: LP_LANG_URLS, // no translated article yet → language switch falls back to the LP
    navPrefix: "/en/",
    home: "/en/",
  },
];

/* ---- render -------------------------------------------------------------- */
function fill(str, map) {
  for (const [k, v] of Object.entries(map)) str = str.split(`{{${k}}}`).join(v);
  return str;
}

function build(page) {
  const chrome = {
    ...page.strings,
    HOME: page.home,
    NAV_PREFIX: page.navPrefix,
    GUIDES_BLOCK: guidesBlock(page.lang),
  };
  const html = fill(layout, {
    LANG: page.lang,
    TITLE: page.title,
    META_DESC: page.metaDesc,
    OG_DESC: page.ogDesc,
    OG_TYPE: page.ogType,
    OG_LOCALE: page.ogLocale,
    CANONICAL_URL: page.canonical,
    HEAD_LINKS: `  <link rel="canonical" href="${page.canonical}" />\n${page.hreflang}`,
    LANG_URLS_JSON: JSON.stringify(page.langUrls),
    HEADER: fill(headerPartial, chrome),
    BODY: fill(read(page.body), page.strings),
    FOOTER: fill(footerPartial, chrome),
  });

  const leftover = html.match(/\{\{[A-Za-z0-9_]+\}\}/g);
  if (leftover) {
    throw new Error(`${page.out}: unresolved placeholder(s) ${[...new Set(leftover)].join(", ")}`);
  }

  const outPath = path.join(ROOT, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log(`built /${page.out}`);
}

PAGES.forEach(build);

/* ---- redirect pages (root + 404) --------------------------------------- */
const LANG_PICKER = `(function () {
      var supported = { ${LANGS.map((l) => `${l}: 1`).join(", ")} };
      var aliases = { jp: "ja", jpn: "ja", nihongo: "ja", eng: "en", english: "en", us: "en", gb: "en", uk: "en", fra: "fr", french: "fr", spa: "es", spanish: "es" };
      var seg = (location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase();
      var target = supported[seg] ? seg : aliases[seg];
      if (!target) {
        var nav = (navigator.language || navigator.userLanguage || "${DEFAULT_LANG}").slice(0, 2).toLowerCase();
        target = supported[nav] ? nav : "${DEFAULT_LANG}";
      }
      location.replace("/" + target + "/");
    })();`;

function redirectPage({ robots }) {
  const alternates = LANGS
    .map((l) => `  <link rel="alternate" hreflang="${l}" href="${BASE}/${l}/" />`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="${robots}" />
  <title>QuickLesson</title>
  <link rel="canonical" href="${BASE}/${DEFAULT_LANG}/" />
${alternates}
  <link rel="alternate" hreflang="x-default" href="${BASE}/${DEFAULT_LANG}/" />
  <meta http-equiv="refresh" content="0; url=/${DEFAULT_LANG}/" />
  <script>
    ${LANG_PICKER}
  </script>
</head>
<body>
  <p><a href="/${DEFAULT_LANG}/">QuickLesson</a></p>
</body>
</html>
`;
}

fs.writeFileSync(path.join(ROOT, "index.html"), redirectPage({ robots: "noindex" }));
console.log("built /index.html (redirect)");
fs.writeFileSync(path.join(ROOT, "404.html"), redirectPage({ robots: "noindex, follow" }));
console.log("built /404.html (redirect)");
