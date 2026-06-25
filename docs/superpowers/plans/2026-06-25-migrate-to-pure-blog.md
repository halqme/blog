# Migrate to Pure Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove CV/portfolio elements and flatten `/blog` routes to root level, making the site a pure blog.

**Architecture:** Move individual post routes and tag routes from `/blog/*` to `/*` root level, rewrite index page as full blog listing, create `/about` page, and purge all CV-related files.

**Tech Stack:** Astro (file-based routing), UnoCSS, Bun

## Global Constraints

- All existing blog post slugs remain the same (just path changes)
- No changes to layout, styling, or content of blog posts
- Do NOT add any test framework
- Each task must end with `bun run build` verifying clean compilation
- Commit after each task with descriptive message

---

### Task 1: Create root-level individual blog post route

**Files:**

- Create: `src/pages/[...slug].astro`

**This is a copy of `src/pages/blog/[...slug].astro` with one import path adjusted.**

- [ ] **Step 1: Create `src/pages/[...slug].astro`**

Create the file by copying the content from `src/pages/blog/[...slug].astro`. The only change is the import path for `BlogPost` layout:

```astro
---
import { getCollection } from "astro:content";
import BlogPost from "../layouts/BlogPost.astro";
import { render } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

const post = Astro.props;
const { Content, headings } = await render(post);

// 読了時間計算の定数
const CHARS_PER_MINUTE = 400;
const MIN_READING_TIME = 1;

// 読了時間を計算（HTMLタグを除去して文字数カウント）
const html = post.rendered?.html || "";
const textContent = html
  .replace(/<[^>]*>/g, "") // HTMLタグを除去
  .replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;/g, " "); // HTMLエンティティを空白に
const charCount = textContent.replace(/\s/g, "").length;
const readingTimeMinutes = Math.ceil(charCount / CHARS_PER_MINUTE);
const readingTimeText =
  readingTimeMinutes < MIN_READING_TIME
    ? "1分未満"
    : `約${readingTimeMinutes}分`;
---

<BlogPost
  {...post.data}
  slug={post.id}
  readingTime={readingTimeText}
  headings={headings}
>
  <Content />
</BlogPost>
```

The import changed from `../../layouts/BlogPost.astro` to `../layouts/BlogPost.astro`.

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: Build succeeds (Astro generates pages at root level)

- [ ] **Step 3: Commit**

```bash
git add src/pages/\[...slug\].astro
git commit -m "feat: add root-level blog post route"
```

---

### Task 2: Create root-level tag routes

**Files:**

- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`

**These are copies of `src/pages/blog/tags/index.astro` and `src/pages/blog/tags/[tag].astro` with adjusted import paths and links.**

- [ ] **Step 1: Create `src/pages/tags/index.astro`**

Copy content from `src/pages/blog/tags/index.astro` with these changes:

- Import paths: `../../../layouts/Layout.astro` → `../../layouts/Layout.astro`, `../../../components/BlogCard.astro` → `../../components/BlogCard.astro`
- Link href: `/blog/tags` → `/tags`
- Link href template: `` `/blog/tags/${tag.toLowerCase()}` `` → `` `/tags/${tag.toLowerCase()}` ``

Full file:

```astro
---
import { getCollection } from "astro:content";
import Layout from "../../layouts/Layout.astro";
import BlogCard from "../../components/BlogCard.astro";

// タグ集計の定数
const INITIAL_TAG_COUNT = 0;
const INCREMENT_COUNT = 1;
const TAG_COUNT_INDEX = 1;
const TAG_NAME_INDEX = 0;

const posts = (await getCollection("blog")).toSorted(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);

const tagCounts = posts.reduce(
  (acc, post) => {
    post.data.tags.forEach((tag: string) => {
      const normalizedTag = tag.toLowerCase();
      acc[normalizedTag] =
        (acc[normalizedTag] || INITIAL_TAG_COUNT) + INCREMENT_COUNT;
    });
    return acc;
  },
  {} as Record<string, number>,
);

const sortedTags = Object.entries(tagCounts).toSorted((a, b) => {
  if (b[TAG_COUNT_INDEX] !== a[TAG_COUNT_INDEX]) {
    return b[TAG_COUNT_INDEX] - a[TAG_COUNT_INDEX];
  }
  return a[TAG_NAME_INDEX].localeCompare(b[TAG_NAME_INDEX]);
});
---

<Layout title="Blog | All Tags | HALQME">
  <section aria-labelledby="blog-title">
    <div class="mb-4 flex items-center justify-between">
      <h1
        id="blog-title"
        class="text-headline before:content-empty before:i-lucide:pen-tool flex items-center gap-3"
      >
        Blog
      </h1>
      <a
        href="/tags"
        class="btn-primary before:content-empty before:i-lucide:tags text-sm"
      >
        Tags
      </a>
    </div>
  </section>

  {
    sortedTags.length === 0 ? (
      <p class="text-body">タグがありません。</p>
    ) : (
      <div class="flex flex-wrap gap-3">
        {sortedTags.map(([tag, count]) => (
          <a
            href={`/tags/${tag.toLowerCase()}`}
            class="tag tag-hover group before:content-empty before:i-lucide:tag before:text-light hover:before:text-muted before:transition-colors"
          >
            <span class="text-subtle">{tag}</span>
            <span class="border-base text-muted ml-1 border-l pl-1.5 text-xs">
              {count}
            </span>
          </a>
        ))}
      </div>
    )
  }

  <hr class="border-light my-8" />

  <div class="grid gap-8 md:grid-cols-2">
    {posts.map((post) => <BlogCard post={post} />)}
  </div>
</Layout>
```

- [ ] **Step 2: Create `src/pages/tags/[tag].astro`**

Copy content from `src/pages/blog/tags/[tag].astro` with these changes:

- Import paths: `../../../layouts/Layout.astro` → `../../layouts/Layout.astro`, `../../../components/BlogCard.astro` → `../../components/BlogCard.astro`
- Link href: `/blog/tags` → `/tags`

Full file:

```astro
---
import { getCollection } from "astro:content";
import Layout from "../../layouts/Layout.astro";
import BlogCard from "../../components/BlogCard.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  const uniqueTags = [
    ...new Set(
      posts.flatMap((post) =>
        post.data.tags.map((t: string) => t.toLowerCase()),
      ),
    ),
  ];

  return uniqueTags.map((tag) => {
    const filteredPosts = posts
      .filter((post) =>
        post.data.tags.some(
          (t: string) => t.toLowerCase() === tag.toLowerCase(),
        ),
      )
      .toSorted((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    return {
      params: { tag },
      props: { posts: filteredPosts, tag },
    };
  });
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<Layout title={`Blog | #${tag} | HALQME`}>
  <section aria-labelledby="tag-title">
    <div class="flex items-center justify-between">
      <h1
        id="tag-title"
        class="text-headline bg-base before:content-empty before:i-lucide:tag mb-0 flex items-center gap-3 select-none"
        transition:animate="slide"
      >
        {tag}
      </h1>
      <a
        href="/tags"
        class="btn-ghost before:content-empty before:i-lucide:tags text-sm"
      >
        Tags
      </a>
    </div>
  </section>
  <p class="text-body mt-2 mb-4 font-mono">
    {posts.length} 件の記事
  </p>

  <div class="grid gap-8 md:grid-cols-2">
    {posts.map((post) => <BlogCard post={post} activeTag={tag} />)}
  </div>
</Layout>
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/pages/tags/
git commit -m "feat: add root-level tag routes"
```

---

### Task 3: Rewrite index page as full blog listing

**Files:**

- Modify: `src/pages/index.astro` (full rewrite)

Replace the current index page (Hero + About + RecentPosts) with a full blog listing (content from `src/pages/blog/index.astro` adapted for root).

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import Layout from "../layouts/Layout.astro";
import BlogCard from "../components/BlogCard.astro";

const posts = (await getCollection("blog")).toSorted(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
---

<Layout title="HALQME's Blog">
  <section aria-labelledby="blog-title">
    <div class="mb-4 flex items-center justify-between">
      <h1
        id="blog-title"
        class="text-headline before:content-empty before:i-lucide:pen-tool flex items-center gap-3"
      >
        Blog
      </h1>
      <a
        href="/tags"
        class="btn-ghost before:content-empty before:i-lucide:tags text-sm"
      >
        Tags
      </a>
    </div>
  </section>
  <div class="grid gap-8 md:grid-cols-2">
    {posts.map((post) => <BlogCard post={post} />)}
  </div>
</Layout>
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: rewrite index as full blog listing"
```

---

### Task 4: Create about page

**Files:**

- Create: `src/pages/about.astro`

Content based on `src/components/About.astro` but without CV PDF link. Use `Layout` instead of inline section.

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import { getCollection } from "astro:content";
import Layout from "../layouts/Layout.astro";

const tags = [
  "Osaka, Japan",
  "TypeScript",
  "Bun",
  "Vue.js",
  "Hono",
  "Swift",
  "Astro",
] as const;

const blogPosts = await getCollection("blog");
const blogTags = new Set(
  blogPosts.flatMap((post) =>
    post.data.tags.map((t: string) => t.toLowerCase()),
  ),
);
---

<Layout title="About | HALQME">
  <section class="section-border" aria-labelledby="about-title">
    <h2
      id="about-title"
      class="text-headline mb-6 flex items-center justify-between gap-3"
    >
      About Me
    </h2>
    <div class="text-body">
      <p>
        Hi, I'm HAL. I am a university student based in Osaka, Japan, majoring in
        Psychology. I have a passion for web development and creating useful
        tools.
      </p>

      <ul class="mt-4 flex list-none flex-wrap gap-3 pl-0 select-none">
        {
          tags.map((label) =>
            blogTags.has(label.toLowerCase()) ? (
              <li class="m-0 p-0">
                <a
                  href={`/tags/${label.toLowerCase()}`}
                  class="tag decoration-none"
                >
                  {label}
                </a>
              </li>
            ) : (
              <li class="m-0 p-0">
                <span class="tag">{label}</span>
              </li>
            ),
          )
        }
      </ul>
    </div>
  </section>
</Layout>
```

Note: Tag links point to `/tags/${label}` (root level), not `/blog/tags/`.

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page"
```

---

### Task 5: Update Header navigation

**Files:**

- Modify: `src/components/Header.astro`

- Remove CV link
- Add About link (`href="/about"`)
- Blog link changes to `href="/"` (or remove it since we're on the blog)
- Remove `isBlogPage` logic since `/blog` no longer exists

- [ ] **Step 1: Edit `src/components/Header.astro`**

Replace the existing content with:

```astro
---
import ThemeToggle from "./ThemeToggle.astro";

const links = [
  { href: "/", icon: "i-lucide:pen-tool", label: "Blog" },
  { href: "/about", icon: "i-lucide:user", label: "About" },
  { href: "https://apps.0w0.foo", icon: "i-lucide:file", label: "Gallery" },
];

const isNotHomePage = Astro.url.pathname !== "/";
---

<header
  class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 select-none md:px-12"
>
  {
    isNotHomePage ? (
      <a
        href="/"
        class="text-primary hover:text-subtle text-xl font-black tracking-tighter transition-colors"
        aria-current={Astro.url.pathname === "/" ? "page" : undefined}
        transition:name="title"
      >
        HALQME
      </a>
    ) : (
      <div aria-hidden="true" />
    )
  }
  <div class="flex items-center gap-2">
    <nav aria-label="メインナビゲーション">
      <ul class="flex gap-4">
        {
          links.map((link) => (
            <li>
              <a
                href={link.href}
                class={`link-nav flex-inline before:content-empty items-center gap-1 py-1.5 before:${link.icon}`}
                aria-current={
                  Astro.url.pathname.startsWith(link.href) && link.href !== "/"
                    ? "page"
                    : undefined
                }
              >
                {link.label}
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
    <ThemeToggle />
  </div>
</header>
```

Key changes:

- Removed CV link entirely
- Added About link with `i-lucide:user`
- Removed `isBlogPage` check and its conditional
- Blog link now goes to `/`
- `aria-current` logic adjusted so `/` doesn't match everything

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: update header navigation (remove CV, add About)"
```

---

### Task 6: Update internal links in components and RSS

**Files:**

- Modify: `src/components/BlogCard.astro`
- Modify: `src/layouts/BlogPost.astro`
- Modify: `src/pages/rss.xml.ts`

Update all `/blog/` prefixed links to root-level paths.

- [ ] **Step 1: Update `src/components/BlogCard.astro`**

Change two href patterns:

Line 22: ``href={`/blog/${post.id}/`}`` → ``href={`/${post.id}/`}``
Line 47: ``href={`/blog/tags/${isActiveTag(tag) ? "" : tag.toLowerCase()}`}`` → ``href={`/tags/${isActiveTag(tag) ? "" : tag.toLowerCase()}`}``

Also update the tag href in the tag link block — the one after `line-clamp-3` condition block.

- [ ] **Step 2: Update `src/layouts/BlogPost.astro`**

Line 83: ``href={`/blog/tags/${tag.toLowerCase()}`}`` → ``href={`/tags/${tag.toLowerCase()}`}``

- [ ] **Step 3: Update `src/pages/rss.xml.ts`**

Line 13: ``link: `/blog/${post.id}/`,`` → ``link: `/${post.id}/`,``

- [ ] **Step 4: Verify build**

Run: `bun run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/BlogCard.astro src/layouts/BlogPost.astro src/pages/rss.xml.ts
git commit -m "fix: update blog path references to root-level paths"
```

---

### Task 7: Delete old blog routes and unused components

**Files to delete:**

- `src/pages/blog/index.astro`
- `src/pages/blog/[...slug].astro`
- `src/pages/blog/tags/index.astro`
- `src/pages/blog/tags/[tag].astro`
- `src/components/Hero.astro`
- `src/components/About.astro`
- `src/components/RecentPosts.astro`

- [ ] **Step 1: Delete old blog route files**

```bash
git rm src/pages/blog/index.astro src/pages/blog/[...slug].astro src/pages/blog/tags/index.astro src/pages/blog/tags/[tag].astro
```

- [ ] **Step 2: Delete unused components**

```bash
git rm src/components/Hero.astro src/components/About.astro src/components/RecentPosts.astro
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove old blog routes and unused components"
```

---

### Task 8: Remove CV files and update build config

**Files to delete:**

- `scripts/generate-cv-meta.ts`
- `public/cv.typ`

**Files to modify:**

- `package.json` — remove CV build scripts
- `README.md` — update docs

- [ ] **Step 1: Remove CV script and source**

```bash
git rm scripts/generate-cv-meta.ts public/cv.typ
```

- [ ] **Step 2: Update `package.json`**

Change the `build` script from:

```
"build": "astro build && bun run build:cv",
"build:cv": "bun run scripts/generate-cv-meta.ts && typst compile public/cv.typ dist/cv.pdf",
```

To:

```
"build": "astro build",
```

Remove the `build:cv` line entirely.

- [ ] **Step 3: Update `README.md`**

Remove CV-related lines (the Typst line under tech stack, the `build:cv` from commands table, the entire CV section).

- [ ] **Step 4: Verify build**

Run: `bun run build`
Expected: Build succeeds without CV-related errors

- [ ] **Step 5: Commit**

```bash
git add package.json README.md
git commit -m "chore: remove CV build and source files"
```

---

### Task 9: Final verification

- [ ] **Step 1: Full build**

```bash
bun run build
```

Expected: Clean exit. Verify no reference to `cv.pdf` or `/blog/` in output.

- [ ] **Step 2: Verify route structure**

Check that the dist output has the expected files:

```bash
ls dist/*.html   # Should have index.html, about.html, post pages
ls dist/tags/    # Should have tag pages
```

- [ ] **Step 3: Check no stray CV references**

```bash
rg -n 'cv|CV|\/blog/' src/ --type-add 'astro:*.astro' --type-add 'ts:*.ts' -g '*.{astro,ts,mjs}' 2>/dev/null || echo "No CV/blog references found (expected)"
```

Expected: No references to `/blog/` in source. CV references should only remain in git history.
