# QuickLesson 公式サイト（初稿）

## 公開URL
- 本番（GitHub Pages）: https://zitatori.github.io/quicklesson-site/
- `main` に push すると自動で再ビルド（数十秒〜1分）
- リポジトリ: https://github.com/Zitatori/quicklesson-site

## ファイル
- `index.html` : 1ページ構成の公式サイト
- `styles.css` : デザイン
- `script.js` : 日本語 / 英語 / フランス語 / スペイン語の切替
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
   - 現在は `zitatori@gmail.com`。専用アドレスやGoogleフォームに切り替える場合は `index.html` の `#teach` セクションと `script.js` の `mailNote` を変更。
2. 必要に応じてQuickLesson本体URL
   - 現在は `https://django-5min-languageapp.onrender.com/`
3. Google Analytics
   - GA4のタグを `<head>` に追加
4. Google Search Console
   - 所有権確認用metaタグを `<head>` に追加
5. 独自ドメイン取得後、OGP / canonical / sitemap等を追加
6. 利用規約・プライバシーポリシーの公開ページがあればフッターからリンク

## ホスティング
- 現在は GitHub Pages（`main` ブランチ / ルート、HTTPS 強制）。
- Render に移す場合は Static Site として接続。Build command 不要、Publish directory は `.`。
- 独自ドメインを取得したら Pages / Render どちらでも後から接続可能（`quicklesson.com` は取得済みのため別候補が必要）。

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
