# Migrate to Pure Blog (Remove CV / Flatten Routes)

**Date**: 2026-06-25
**Status**: Design approved, pending spec review

## Motivation

トップページをポートフォリオ/CV要素のない純粋なブログ一覧に変更する。あわせて `/blog` サブディレクトリを解体し、ブログ関連ページをルートレベルにフラット化する。

## Route Changes

| Before                        | After            | Notes                                    |
| ----------------------------- | ---------------- | ---------------------------------------- |
| `/` (Hero + About + Recent 3) | `/` (全記事一覧) | 完全書き換え                             |
| `/blog`                       | —                | 削除                                     |
| `/blog/[...slug]`             | `/[...slug]`     | 個別記事をルートに移動                   |
| `/blog/tags/`                 | `/tags/`         | タグ一覧をルートに移動                   |
| `/blog/tags/[tag]`            | `/tags/[tag]`    | タグフィルターをルートに移動             |
| —                             | `/about`         | 新設（About コンポーネントの内容を移行） |

## Files to Edit

| File                          | Change                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `src/pages/index.astro`       | Hero/About/RecentPosts → 全記事一覧（現在の `/blog/index.astro` の内容をベース） |
| `src/components/Header.astro` | CV リンク削除、About リンク追加、Blog リンクの href を `/` に変更                |
| `package.json`                | `build` スクリプトから `bun run build:cv` 及び `build:cv` スクリプトを削除       |

## Files to Create

| File                         | Source                                                                |
| ---------------------------- | --------------------------------------------------------------------- |
| `src/pages/[...slug].astro`  | `src/pages/blog/[...slug].astro` から移動 (import パス調整)           |
| `src/pages/tags/index.astro` | `src/pages/blog/tags/index.astro` から移動 (import/link 調整)         |
| `src/pages/tags/[tag].astro` | `src/pages/blog/tags/[tag].astro` から移動 (import/link 調整)         |
| `src/pages/about.astro`      | `src/components/About.astro` の内容をベースに新規作成 (CV リンク除去) |

## Files to Delete

- `src/pages/blog/index.astro`
- `src/pages/blog/[...slug].astro`
- `src/pages/blog/tags/index.astro`
- `src/pages/blog/tags/[tag].astro`
- `src/components/Hero.astro`
- `src/components/About.astro`
- `src/components/RecentPosts.astro`
- `scripts/generate-cv-meta.ts`
- `public/cv.typ`

## Link Updates

All internal links referencing the old `/blog/...` paths must be updated:

### ファイル別変更箇所

| File                | Before                                                            | After                                   |
| ------------------- | ----------------------------------------------------------------- | --------------------------------------- |
| `BlogCard.astro:22` | ``href={`/blog/${post.id}/`}``                                    | ``href={`/${post.id}/`}``               |
| `BlogCard.astro:47` | ``href={`/blog/tags/${...}`}``                                    | ``href={`/tags/${...}`}``               |
| `BlogPost.astro:83` | ``href={`/blog/tags/${tag.toLowerCase()}`}``                      | ``href={`/tags/${tag.toLowerCase()}`}`` |
| `Header.astro:11`   | `Astro.url.pathname === "/blog" \|\| ...startsWith("/blog/tags")` | 条件そのものを削除（Blog リンク廃止）   |
| `rss.xml.ts:13`     | ``link: `/blog/${post.id}/` ``                                    | ``link: `/${post.id}/` ``               |

### 移動後ファイルのパス調整

- `src/pages/tags/index.astro`: import パス更新 `../../../` → `../../`、リンク `/blog/tags` → `/tags`
- `src/pages/tags/[tag].astro`: 同様
- `src/pages/[...slug].astro`: import パス更新 `../../` → `../`

### 変更不要なもの

- `ogp/[slug].png.ts` — `slug` は post.id のままでパス変更の影響なし
- `ogp/default.png.ts` — 同様

## No-Go

- 個別記事の内容・レイアウトは変更しない
- タグ機能そのものは維持する（パスが変わるだけ）
- テーマ・スタイル・UnoCSS デザイントークンは変更しない
- RSS や OGP、sitemap などの生成はそのまま維持（必要に応じてパス調整のみ）
