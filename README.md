# QuickLesson 公式サイト（初稿）

## 公開URL
- 本番: https://quicklesson5min.com/ （`/` は言語別ページへリダイレクト）
  - 日本語 https://quicklesson5min.com/ja/
  - English https://quicklesson5min.com/en/
  - Français https://quicklesson5min.com/fr/
  - Español https://quicklesson5min.com/es/
- ホスティングは GitHub Pages（`main` ブランチ / ルート）。`main` に push すると自動デプロイ。
- リポジトリ: https://github.com/Zitatori/quicklesson-site

## ページ生成（ビルドが必要）
全ページを共通パーツから `node _build/build.js` で生成しています。生成物は直接編集しない。

**共通パーツ（ここを編集する）**
- `_build/layout.html` … 外枠（`<head>` ＋ スロット）
- `_build/partials/header.html` … プロモバー＋ヘッダー（全ページ共通）
- `_build/partials/footer.html` … フッター（全ページ共通）
- `_build/pages/lp.html` … 言語別LPの本文
- `_build/pages/seo/<lang>-<slug>.html` … SEO固定ページの本文（1ページ1ファイル）
- `_build/i18n.js` … 言語別LPの全文言・タイトル・meta description
- `_build/build.js` … `PAGES` 配列＝生成対象の一覧

**生成物**
- `ja|en|fr|es/index.html` … 言語別LP（hreflang: `ja`/`en`/`fr`/`es`/`x-default=ja`、canonical＝自URL）
- `en/japanese-speaking-practice/index.html` … SEO固定ページ（canonical＝自URL）
- `index.html` / `404.html` … 訪問者の言語へ振り分けるリダイレクト

**ビルド**
```
node _build/build.js
```
編集後に再実行し、生成された `*/index.html` を一緒にコミットする。

- 言語切り替え（ヘッダーの `<select>`）は各ページが埋め込む `window.QL_LANG_URLS` を使って遷移。SEOページに翻訳版が無ければ `/<lang>/`（LP）にフォールバック。
- 資産参照は絶対パス（`/styles.css` `/script.js`）。ページの階層に依存しない。
- GA4（`G-7W7G2KZV7L`）は `_build/layout.html` の `<head>` に1回 → 全ページに出力。

## SEO固定ページを追加する手順
1. `_build/pages/seo/<lang>-<slug>.html` に本文を書く（既存クラス `.article` `.section` `.container` `.btn` `.cta-box` 等を利用）
2. `_build/build.js` の `PAGES` にエントリを1つ追加（`out` / `title` / `metaDesc` / `canonical` / `hreflang` / `body` など）
3. `node _build/build.js` → 生成された `<lang>/<slug>/index.html` をコミット
4. 同じ記事を他言語でも作ったら、両ページの `hreflang` にお互いの `<link rel="alternate">` を追記して再ビルド

現状の例: `/en/japanese-speaking-practice/`（英語のみ。FR/ESは未作成）

## ファイル
- `_build/` : ページ生成のソース（`layout.html` / `partials/` / `pages/` / `i18n.js` / `build.js`）
- `ja|en|fr|es/index.html` : 生成された各言語LP
- `en/japanese-speaking-practice/index.html` : 生成されたSEO固定ページ
- `index.html` / `404.html` : 言語リダイレクト（生成物）
- `styles.css` : デザイン（全ページ共通）
- `script.js` : 年号表示 ＋ 言語 `<select>` の遷移
- `.nojekyll` : GitHub Pages の Jekyll 処理を無効化（静的ファイルをそのまま配信）
- `CNAME` : `quicklesson5min.com`
- `README.md` : この説明

## いま入れてあるもの
- 4言語切替
- 5分会話を中心にした説明
- 対応言語
- 使い方
- 利用シーン
- 安全面
- 講師応募は一般利用と分離
- QuickLesson本体へのCTA
- スマホ対応

## 公開前に必ず変えるところ
1. 講師応募メール
   - 現在は `zitatori@gmail.com`。専用アドレスやGoogleフォームに切り替える場合は `_build/pages/lp.html` の `#teach` と `_build/i18n.js` の `mailNote` を変更して再ビルド。
2. QuickLesson 本体（アプリ）URL
   - 現在は `https://app.quicklesson5min.com/`（`_build/build.js` の `APP_URL` 定数。全ページの「start」系リンクはここを参照）
3. Google Analytics … GA4（`G-7W7G2KZV7L`）導入済み。
4. Google Search Console
   - 所有権確認用metaタグを `_build/layout.html` の `<head>` に追加して再ビルド
5. `sitemap.xml`（4言語URL＋hreflang）と `robots.txt` を追加すると尚良い
6. 利用規約・プライバシーポリシーの公開ページがあればフッターからリンク

## レイアウトのルール
セクションは2種類に分けています。
- **主要セクション**（`#why` / `#how` / `#safety` / `#teach` / 最終CTA）
  英字キッカー（`.kicker`）＋大見出し（`clamp(34–58px)`）、左揃え。
  中身の形（カード／リスト／2列）は内容に合わせて変えてよいが、見出しの見せ方は統一。
- **補足セクション**（`#for-you`「こんな時に」）
  `.section.supplementary` を付与。小さめの和文ラベル（`.eyebrow-label`）＋中見出し、
  上に細い区切り線を入れて「本編の補足」だと分かるようにする。
  ヘッダーメニューには載せない。

ヘッダーメニューの並び順は、ページ本体のセクション順（特徴→使い方→安心→講師）に合わせる。

## 方針
これは「SEO記事サイト」ではなく、まずはQuickLessonの公式説明ページとして作っています。
検索流入が育つかどうかは、Analytics / Search Consoleのデータを見てから判断する前提です。
