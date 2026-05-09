# AGENTS.md - Developer Guidelines

This file provides guidelines for agentic coding agents working in this repository.

---

## Project Overview

- **Type**: Portfolio website with blog (static site)
- **Framework**: Astro 5.x with MDX support
- **Styling**: UnoCSS with custom brutalist design tokens
- **Package Manager**: Bun
- **Deployment**: Cloudflare Pages
- **Language**: Japanese (primary), English (code/docs)

---

## Design Context

### Users

- **Primary audience**: Potential employers, fellow developers, and peers
- **Context**: Visitors evaluate the portfolio for hiring decisions or read technical blog posts
- **Job to be done**: Assess technical skills, view projects, read articles, download CV

### Brand Personality

- **Keywords**: Minimal, Technical, Brutalist
- **Voice**: Clean, no-nonsense, developer-focused
- **Tone**: Professional yet distinctive, avoiding generic AI aesthetics

### Aesthetic Direction

- **Visual style**: Brutalist-inspired with offset hard shadows (4px/2px), dot pattern background
- **Colors**: Monochromatic black/white with neutral grays
  - Light mode: white (#ffffff) bg, black (#000000) text
  - Dark mode: #111827 bg, white text
- **Typography**: Geist font family (sans + mono) - technical, clean, distinctive
- **Components**: Hard-edged cards with signature offset shadows, subtle hover animations
- **Theme**: Supports both light and dark modes with system preference detection
- **Background**: Dot/radial pattern (signature design element)

### Design Principles

1. **Minimal & Functional**: Strip to essentials, every element must justify its existence
2. **Technical Precision**: Clean typography, consistent spacing, intentional animations
3. **Distinctive Brutalism**: Embrace hard edges and offset shadows rather than soft rounded aesthetics
4. **Accessibility First**: Maintain skip links, reduced motion support, proper focus states
5. **Content-Focused**: Design serves the content, not the other way around

---

## Build Commands

```bash
# Development
bun run dev          # Start Astro dev server
bun run preview      # Preview production build locally

# Production
bun run build        # Build for production (includes CV PDF via Typst)
bun run build:cv     # Build CV PDF only

# Linting & Formatting
bun run lint         # Run oxlint (linter)
bun run format       # Run prettier + oxfmt (formatter)

# Utilities
bun run astro       # Run Astro CLI directly
bun run wrangler    # Run Cloudflare Wrangler CLI
```

**Note**: This project does NOT have a test framework configured. Do not add tests.

---

## Code Style Guidelines

### General Principles

1. **Minimal & Functional**: Strip to essentials, every element must justify its existence
2. **Technical Precision**: Clean typography, consistent spacing, intentional animations
3. **Distinctive Brutalism**: Embrace hard edges and offset shadows rather than soft rounded aesthetics
4. **Accessibility First**: Maintain skip links, reduced motion support, proper focus states

### TypeScript

- **Strict mode**: Project uses `astro/tsconfigs/strict`
- Use explicit types for function parameters and return types when not obvious
- Use `interface` for component Props, named `Props`:
  ```typescript
  interface Props {
    title: string
    description?: string
  }
  ```
- Use Astro's content collections with Zod schemas for type-safe content

### Imports

- Use named imports (not default):
  ```typescript
  import { getCollection } from 'astro:content'
  import type { CollectionEntry } from 'astro:content'
  ```
- Import order: external → internal → relative (enforced by oxlint)

### File Naming

- **Astro components**: `PascalCase` (e.g., `BlogCard.astro`, `Header.astro`)
- **TypeScript utilities/pages**: `kebab-case` (e.g., `rss.xml.ts`, `default.png.ts`)

### Astro Components

- Props interface in frontmatter with explicit types:
  ```astro
  ---
  import type { CollectionEntry } from "astro:content";
  interface Props {
    post: CollectionEntry<"blog">;
  }
  const { post } = Astro.props;
  ---
  ```
- Use `<slot />` for content projection, `transition:name` for View Transitions
- Prefer UnoCSS shortcuts over inline styles

### UnoCSS Styling

- Use predefined shortcuts from `uno.config.ts`:
  - Layout: `container-main`, `container-narrow`, `stack`, `row`
  - Typography: `text-headline`, `text-body`, `text-label`, `text-display`
  - Components: `btn`, `btn-primary`, `card`, `card-interactive`, `tag`, `input`, `link`
  - Shadows: `shadow-card`, `shadow-card-sm`
  - Patterns: `pattern-dots`
- Use semantic tokens: `text-primary`, `text-subtle`, `text-muted`, `bg-base`
- Border radius: prefer `rounded-xs` (2px) or sharp edges

### Error Handling

- Use try/catch for async operations (file I/O, external fetches)
- Provide meaningful error messages
- Handle null/undefined with optional chaining and nullish coalescing

### Accessibility

- Always include skip links for main content
- Use semantic HTML (`<main>`, `<article>`, `<nav>`, `<header>`, `<footer>`)
- Include `aria-label` on icon-only buttons
- Support `prefers-reduced-motion` (already in global styles)
- Use proper focus states with `focus:` variants

---

## Linting & Formatting

**oxlint** (not ESLint): Plugins - typescript, unicorn, oxc, import. Key rules: `no-unused-vars` (error, warn in pages), `no-debugger` (warn), `import/order` (warn), `jsx-a11y/no-static-element-interactions` (error).

**prettier + oxfmt**: Prettier plugins - `prettier-plugin-astro`, `prettier-plugin-tailwindcss`. Astro files use the `astro` parser.

Run: `bun run lint` / `bun run format`

---

## Design Context

### Users

- **Primary audience**: Potential employers, fellow developers, and peers
- **Context**: Visitors evaluate the portfolio for hiring decisions or read technical blog posts
- **Job to be done**: Assess technical skills, view projects, read articles, download CV

### Brand Personality

- **Keywords**: Minimal, Technical, Brutalist
- **Voice**: Clean, no-nonsense, developer-focused
- **Tone**: Professional yet distinctive, avoiding generic AI aesthetics

### Aesthetic Direction

- **Visual style**: Brutalist-inspired with offset hard shadows (4px/2px), dot pattern background
- **Colors**: Monochromatic black/white with neutral grays
  - Light mode: white (#ffffff) bg, black (#000000) text
  - Dark mode: #111827 bg, white text
- **Typography**: Geist font family (sans + mono) - technical, clean, distinctive
- **Components**: Hard-edged cards with signature offset shadows, subtle hover animations
- **Theme**: Supports both light and dark modes with system preference detection
- **Background**: Dot/radial pattern (signature design element)

### Design Principles

1. **Minimal & Functional**: Strip to essentials, every element must justify its existence
2. **Technical Precision**: Clean typography, consistent spacing, intentional animations
3. **Distinctive Brutalism**: Embrace hard edges and offset shadows rather than soft rounded aesthetics
4. **Accessibility First**: Maintain skip links, reduced motion support, proper focus states
5. **Content-Focused**: Design serves the content, not the other way around

---

## Technical Stack

- Astro (static site generation)
- UnoCSS (styling with custom design tokens)
- MDX (content authoring)
- Bun (package manager)
- Typst (CV PDF generation)
- Cloudflare Pages (deployment)

## Key Design Tokens

- Border radius: 2px-12px scale (mostly sharp/minimal)
- Spacing: 4px base unit (4, 8, 16, 24, 32, 48, 64, 80px)
- Shadows: Signature offset shadows (`4px 4px 0px 0px rgba(0,0,0,1)`)
- Transitions: 150ms (fast), 300ms (base), 500ms (slow)

---

## Content Collections

Blog posts in `src/content/blog/` as MDX files.

Schema (`src/content.config.ts`): `title`, `description`, `pubDate` (required); `tags`: string[] (optional, auto-lowercased); `heroImage`, `updatedDate` (optional).

---

## Environment Variables

- Site URL: `https://0w0.foo` (in `astro.config.mjs`)
- No `.env` tracked in git

---

## Common Tasks

### Adding a blog post

1. Create MDX file in `src/content/blog/`
2. Add frontmatter with title, description, pubDate, tags
3. Run `bun run build` to verify

### Adding a component

1. Create `.astro` file in `src/components/`
2. Use UnoCSS shortcuts
3. Define Props interface with explicit types

### Modifying styles

1. Check `uno.config.ts` for existing shortcuts
2. Add new shortcuts or use utility classes inline
3. Follow brutalist aesthetic (hard edges, offset shadows)

---

## CI/CD

Deployment via Cloudflare Pages on push to main branch.
