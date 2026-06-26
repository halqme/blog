# Task 3 Report: トップページをブログ一覧に書き換え

## 実施内容

- `src/pages/index.astro` を Hero/About/RecentPosts から全記事一覧表示に書き換え
- `getCollection("blog")` で全記事を取得し、日付降順でソート
- グリッドレイアウトで BlogCard を表示（`md:grid-cols-2`）
- タイトルは `HALQME's Blog` に変更
- Tags ページへのリンクも追加

## ビルド結果

- `bun run build` 成功（63ページ生成）
- `/index.html` が正しく生成されていることを確認

## その他

- `src/pages/blog/index.astro` は既存のまま保持（削除しない）
- `/tags` ルートは既に存在することを確認済み
