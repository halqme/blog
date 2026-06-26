# Blog

Astroベースの個人ブログ。

## 技術スタック

- **Astro** - 静的サイト生成
- **UnoCSS** - CSSフレームワーク
- **MDX** - マークダウン + JSX
- **Bun** - パッケージマネージャー
- **Cloudflare Pages** - デプロイ先

## セットアップ

```bash
# 開発シェル起動（必須）
nix develop

# 依存関係インストール
bun install
```

## コマンド

```bash
bun run dev      # 開発サーバー起動
bun run build    # 本番ビルド
bun run preview  # プレビュー表示
bun run format   # フォーマット
bun run lint     # リント
```

## 構成

```
src/
├── components/  # UIコンポーネント
├── content/     # ブログ記事
├── layouts/     # レイアウト
└── pages/       # ページ
```
