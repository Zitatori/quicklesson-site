# QuickLesson 公式サイト（初稿）

## 公開URL
- 本番: https://quicklesson5min.com/ （`/` は言語別ページへリダイレクト）
  - 日本語 https://quicklesson5min.com/ja/
  - English https://quicklesson5min.com/en/
  - Français https://quicklesson5min.com/fr/
  - Español https://quicklesson5min.com/es/
- ホスティングは GitHub Pages（`main` ブランチ / ルート）。`main` に push すると自動デプロイ。
- リポジトリ: https://github.com/Zitatori/quicklesson-site

## 言語別ページ（ビルドが必要）
文章は言語ごとに独立したページ（`/ja/` `/en/` `/fr/` `/es/`）として事前生成しています。
各ページには hreflang（`ja` / `en` / `fr` / `es` / `x-default=ja`）と canonical を出力済み。

- **ソース**（ここを編集する）
  - `_build/i18n.js` … 全言語の文章・タイトル・meta description
  - `_build/template.html` … 共通のHTML構造（`{{key}}` プレースホルダ）
- **生成物**（直接編集しない）
  - `ja/index.html` `en/index.html` `fr/index.html` `es/index.html`
  - `index.html` … 訪問者の言語へ振り分けるリダイレクトページ
- **ビルド**: リポジトリ直下で
  ```
  node _build/build.js
  ```
  文章やHTMLを変えたら再実行し、生成された `*/index.html` と `index.html` も一緒にコミットする。

言語切り替え（ヘッダーの `<select>`）は `script.js` が `/<lang>/` へ遷移させます。
GA4（`G-7W7G2KZV7L`）は `_build/template.html` の `<head>` に1回だけ入れてあり、4ページすべてに出力されます。

## ファイル
- `_build/` : ページ生成のソース（`i18n.js` / `template.html` / `build.js`）
- `ja|en|fr|es/index.html` : 生成された各言語ページ
- `index.html` : 言語リダイレクト（生成物）
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
   - 現在は `zitatori@gmail.com`。専用アドレスやGoogleフォームに切り替える場合は `_build/template.html` の `#teach` と `_build/i18n.js` の `mailNote` を変更して再ビルド。
2. 必要に応じてQuickLesson本体URL
   - 現在は `https://django-5min-languageapp.onrender.com/`
3. Google Analytics … GA4（`G-7W7G2KZV7L`）導入済み。
4. Google Search Console
   - 所有権確認用metaタグを `_build/template.html` の `<head>` に追加して再ビルド
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
