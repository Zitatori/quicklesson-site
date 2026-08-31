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

// SEO topic cluster: "practice speaking Japanese online" for non-Japanese
// speakers, published in EN and ES. These are hreflang alternates of each
// other; the language switch on either page hops to the sibling.
const JP_PRACTICE = {
  hreflang: [
    `  <link rel="alternate" hreflang="en" href="${BASE}/en/japanese-speaking-practice/" />`,
    `  <link rel="alternate" hreflang="es" href="${BASE}/es/japanese-speaking-practice/" />`,
    `  <link rel="alternate" hreflang="x-default" href="${BASE}/en/japanese-speaking-practice/" />`,
  ].join("\n"),
  langUrls: {
    ...LP_LANG_URLS,
    en: "/en/japanese-speaking-practice/",
    es: "/es/japanese-speaking-practice/",
  },
};

// SEO landing pages linked from the footer, per language. Keep the labels short.
const GUIDES = {
  ja: [
    { href: "/ja/english-speaking-practice/", label: "英語を話す機会がない人へ" },
    { href: "/ja/spanish-speaking-practice/", label: "趣味で始めるスペイン語" },
    { href: "/ja/french-speaking-practice/", label: "海外生活とフランス語" },
  ],
  en: [
    { href: "/en/japanese-speaking-practice/", label: "Japanese speaking practice" },
    { href: "/en/spanish-speaking-practice/", label: "Spanish speaking practice" },
  ],
  fr: [],
  es: [{ href: "/es/japanese-speaking-practice/", label: "Practicar japonés online" }],
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
    lang: "ja",
    out: "ja/french-speaking-practice/index.html",
    body: "pages/seo/ja-french-speaking-practice.html",
    strings: translations.ja, // header / footer chrome only
    title:
      "フランス語圏に住んでいるのにフランス語が話せない｜海外生活で会話力を身につけるには",
    metaDesc:
      "フランス語圏に住んでいるのに会話に入れないと感じていませんか。海外生活で使えるフランス語の会話力を、予約なしの5分から身につける方法を紹介します。",
    ogDesc: "フランス語圏に住んでいても話せない。海外生活で使える会話力を5分から。",
    ogType: "article",
    ogLocale: "ja_JP",
    canonical: `${BASE}/ja/french-speaking-practice/`,
    hreflang: `  <link rel="alternate" hreflang="ja" href="${BASE}/ja/french-speaking-practice/" />`,
    langUrls: LP_LANG_URLS,
    navPrefix: "/ja/",
    home: "/ja/",
  },

  {
    lang: "ja",
    out: "ja/spanish-speaking-practice/index.html",
    body: "pages/seo/ja-spanish-speaking-practice.html",
    strings: translations.ja, // header / footer chrome only
    title:
      "スペイン語を話せるようになりたい人へ｜趣味・サッカー・フラメンコから始めるスペイン語会話",
    metaDesc:
      "スペイン語を趣味で始めたい方へ。サッカーやフラメンコなど好きなことをきっかけに、予約なしで5分だけスペイン語を話す練習方法を紹介します。",
    ogDesc: "サッカー・フラメンコ・旅行から。予約なしで5分だけスペイン語を話す練習。",
    ogType: "article",
    ogLocale: "ja_JP",
    canonical: `${BASE}/ja/spanish-speaking-practice/`,
    hreflang: `  <link rel="alternate" hreflang="ja" href="${BASE}/ja/spanish-speaking-practice/" />`,
    langUrls: LP_LANG_URLS,
    navPrefix: "/ja/",
    home: "/ja/",
  },

  {
    lang: "ja",
    out: "ja/english-speaking-practice/index.html",
    body: "pages/seo/ja-english-speaking-practice.html",
    strings: translations.ja, // header / footer chrome only
    title: "英語を話す機会がない人へ｜1日5分からできる英会話の練習方法",
    metaDesc:
      "英語を勉強していても話す機会がないと感じていませんか。予約なしで、すきま時間に5分だけ英語を話す練習方法を紹介します。ワーキングホリデー前の準備にも。",
    ogDesc: "予約なしで、すきま時間に5分だけ。英語を話す機会を増やす練習方法。",
    ogType: "article",
    ogLocale: "ja_JP",
    canonical: `${BASE}/ja/english-speaking-practice/`,
    hreflang: `  <link rel="alternate" hreflang="ja" href="${BASE}/ja/english-speaking-practice/" />`,
    langUrls: LP_LANG_URLS,
    navPrefix: "/ja/",
    home: "/ja/",
  },

  {
    lang: "en",
    out: "en/spanish-speaking-practice/index.html",
    body: "pages/seo/en-spanish-speaking-practice.html",
    strings: translations.en, // header / footer chrome only
    title: "How to Start Speaking Spanish When You're Still a Beginner",
    metaDesc:
      "Studied Spanish but can't speak it, or starting from zero? Here's how to begin practicing Spanish conversation — even with just five minutes and a few sentences.",
    ogDesc:
      "How to begin practicing spoken Spanish as a beginner, five minutes at a time.",
    ogType: "article",
    ogLocale: "en_US",
    canonical: `${BASE}/en/spanish-speaking-practice/`,
    hreflang: `  <link rel="alternate" hreflang="en" href="${BASE}/en/spanish-speaking-practice/" />`,
    langUrls: LP_LANG_URLS,
    navPrefix: "/en/",
    home: "/en/",
  },

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
    hreflang: JP_PRACTICE.hreflang,
    langUrls: JP_PRACTICE.langUrls,
    navPrefix: "/en/",
    home: "/en/",
  },

  {
    lang: "es",
    out: "es/japanese-speaking-practice/index.html",
    body: "pages/seo/es-japanese-speaking-practice.html",
    strings: translations.es, // header / footer chrome only
    title:
      "¿Estudias japonés pero no tienes con quién practicar? Cómo practicar japonés online",
    metaDesc:
      "¿Estudias japonés pero no tienes con quién hablar? Descubre formas prácticas de practicar conversación en japonés online, aunque solo tengas cinco minutos.",
    ogDesc:
      "Formas prácticas de practicar japonés hablado online, aunque solo tengas cinco minutos al día.",
    ogType: "article",
    ogLocale: "es_ES",
    canonical: `${BASE}/es/japanese-speaking-practice/`,
    hreflang: JP_PRACTICE.hreflang,
    langUrls: JP_PRACTICE.langUrls,
    navPrefix: "/es/",
    home: "/es/",
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
