import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives,
} from "unocss";

// ========================================
// Design Tokens
// ========================================
const tokens = {
  // Colors
  color: {
    bg: {
      base: "#ffffff",
      hover: "#f3f4f6", // Neutral-100
      subtle: "#f9fafb", // Neutral-50
    },
    border: {
      base: "#e5e7eb", // Neutral-200
      dark: "#000000",
      light: "#d1d5db", // Neutral-300
      lighter: "#f3f4f6", // Neutral-100
    },
    primary: "#000000",
    secondary: "#ffffff",
    shadow: {
      base: "rgba(0,0,0,1)",
      subtle: "rgba(0,0,0,0.3)",
    },
    text: {
      base: "#111827", // Neutral-900
      dark: "#1f2937", // Neutral-800
      darker: "#111827", // Neutral-900
      light: "#9ca3af", // Neutral-400
      lighter: "#d1d5db", // Neutral-300
      muted: "#6b7280", // Neutral-500
      subtle: "#4b5563", // Neutral-600
    },
  },
  // Dark mode colors
  dark: {
    bg: {
      base: "#111827",
      hover: "#374151",
      subtle: "#1f2937",
    },
    border: {
      base: "#374151",
      dark: "#ffffff",
      light: "#4b5563",
      lighter: "#1f2937",
    },
    primary: "#ffffff",
    secondary: "#000000",
    shadow: {
      base: "rgba(255,255,255,0.1)",
      subtle: "rgba(255,255,255,0.05)",
    },
    text: {
      base: "#f9fafb",
      dark: "#e5e7eb",
      darker: "#f3f4f6",
      light: "#6b7280",
      lighter: "#4b5563",
      muted: "#9ca3af",
      subtle: "#d1d5db",
    },
  },
  // Typography
  font: {
    mono: "var(--font-ia-writer-mono), ui-monospace, monospace",
    sans: "var(--font-shippori-antique), ui-sans-serif, system-ui, sans-serif",
    size: {
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      sm: "0.875rem", // 14px
      xl: "1.25rem", // 20px
      xs: "0.75rem", // 12px
    },
    weight: {
      black: "900",
      bold: "700",
      medium: "500",
      normal: "400",
      semibold: "600",
    },
  },
  // Border Radius
  radius: {
    base: "0.375rem", // 6px
    full: "9999px",
    lg: "0.75rem", // 12px
    md: "0.5rem", // 8px
    none: "0",
    sm: "0.25rem", // 4px
    xs: "0.125rem", // 2px
  },
  // Shadows
  shadow: {
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    none: "none",
    // Custom offset shadow for cards
    offset: "4px 4px 0px 0px rgba(0,0,0,1)",
    offsetSm: "2px 2px 0px 0px rgba(0,0,0,1)",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  },
  // Spacing Scale (4px base)
  space: {
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "5rem", // 80px
    lg: "1.5rem", // 24px
    md: "1rem", // 16px
    sm: "0.5rem", // 8px
    xl: "2rem", // 32px
    xs: "0.25rem", // 4px
  },
  // Animation
  transition: {
    base: "300ms ease-out",
    fast: "150ms ease-out",
    slow: "500ms ease-out",
  },
};

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
      scale: 1.2,
    }),
    presetAttributify({
      prefix: "uno-",
    }),
    presetTypography({
      cssExtend: {
        p: {
          "line-height": "1.5",
        },
      },
    }),
  ],
  rules: [[/^clip-\[(.+)\]$/, ([, value]) => ({ clip: value })]],
  safelist: [
    "absolute",
    "top-2",
    "right-2",
    "flex",
    "items-center",
    "gap-1",
    "px-2",
    "py-1",
    "text-xs",
    "font-medium",
    "text-white",
    "bg-black/80",
    "dark:bg-white/20",
    "backdrop-blur-sm",
    "rounded",
    "opacity-0",
    "group-hover:opacity-100",
    "transition-opacity",
    "duration-200",
    "hover:bg-black",
    "dark:hover:bg-white/30",
    "z-10",
    "i-lucide:copy",
    "w-3.5",
    "h-3.5",
    "i-lucide:check",
    "text-green-400",
    "bg-green-900/80",
    "relative",
    "group",
    "block",
    "w-full",
    "code-copy-button",
    "code-block-wrapper",
  ],
  shortcuts: [
    // ===========================================
    // Colors
    // ===========================================
    {
      "bg-base": "bg-white dark:bg-neutral-900",
      "bg-hover": "bg-neutral-100 dark:bg-neutral-700",
      "bg-primary": "bg-black dark:bg-white",
      "bg-subtle": "bg-neutral-50 dark:bg-neutral-800",
    },
    {
      "border-base": "border-neutral-200 dark:border-neutral-700",
      "border-dark": "border-black dark:border-white",
      "border-light": "border-neutral-300 dark:border-neutral-600",
      "border-lighter": "border-neutral-100 dark:border-neutral-800",
      "section-border": "py-6 border-t border-neutral-200 first:border-t-0",
    },
    // ===========================================
    // Typography
    // ===========================================
    {
      "text-base": "text-neutral-900 dark:text-neutral-50",
      "text-body": "text-base leading-relaxed text-subtle",
      "text-body-sm": "text-sm leading-relaxed text-subtle",
      "text-caption": "text-xs text-muted",
    },
    {
      // Headings - Geist has distinctive character
      "text-display":
        "text-5xl md:text-7xl font-bold tracking-tighter text-primary font-sans",
      "text-headline":
        "text-2xl font-semibold tracking-tight text-primary font-sans",
      "text-subhead":
        "text-lg font-medium tracking-tight text-primary font-sans",
      "text-title":
        "text-3xl md:text-4xl font-bold tracking-tight text-primary font-sans",
    },
    {
      // Labels/Meta
      "text-label": "text-xs uppercase tracking-wider font-semibold text-muted",
    },
    {
      // Colors
      "text-light": "text-neutral-400 dark:text-neutral-600",
      "text-lighter": "text-neutral-300 dark:text-neutral-700",
      "text-muted": "text-neutral-500 dark:text-neutral-400",
      "text-primary": "text-black dark:text-white",
      "text-secondary": "text-white dark:text-black",
      "text-subtle": "text-neutral-600 dark:text-neutral-300",
    },
    {
      // Icon + Text combinations
      "icon-text": "inline-flex items-center gap-1",
      "icon-text-before": "inline-flex items-center gap-1 before:content-empty",
    },

    // ===========================================
    // Layout
    // ===========================================
    {
      "container-article": "max-w-6xl mx-auto px-6 md:px-12",
      "container-main": "max-w-5xl mx-auto px-6 md:px-12",
      "container-narrow": "max-w-3xl mx-auto px-6 md:px-12",
      "container-wide": "max-w-7xl mx-auto px-6 md:px-12",
    },
    {
      "grid-responsive": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    },
    {
      row: "flex flex-row",
      "row-center": "row items-center",
    },
    {
      stack: "flex flex-col",
      "stack-center": "stack items-center",
    },
    {
      section: "py-6 border-t border-base first:border-t-0",
    },
    // ===========================================
    // Components
    // ===========================================
    {
      btn: "inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium transition-all duration-300 ease-out cursor-pointer border rounded-xs relative overflow-hidden z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
      "btn-ghost": "btn bg-transparent text-primary border-transparent",
      "btn-primary":
        "btn bg-primary text-secondary border-dark hover:bg-neutral-800 dark:hover:bg-neutral-200",
      "btn-secondary":
        "btn bg-base text-primary border-light hover:border-dark hover:bg-hover",
    },
    {
      card: "bg-base border border-base rounded-xs transition-colors duration-300",
      "card-content": "transition-transform duration-300 ease-out",
      "card-hover":
        "hover:border-dark hover:shadow-card hover:-translate-y-0.5",
      "card-interactive": "card card-hover cursor-pointer",
    },
    {
      tag: "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-base text-primary border border-base rounded-xs transition-all duration-200",
      "tag-hover": "hover:border-dark hover:shadow-card-sm",
    },
    {
      input:
        "w-full px-4 py-2.5 bg-base border border-light rounded-xs text-base transition-all duration-200 focused",
    },
    {
      link: "text-primary underline underline-offset-4 hover:text-subtle transition-colors",
      "link-nav":
        "text-sm font-medium text-subtle hover:text-primary transition-colors",
      "link-subtle": "text-subtle hover:text-primary transition-colors",
    },
    {
      "social-btn": "btn-ghost flex flex-col items-center p-2",
      "social-link-icon": "before:content-empty before:text-xl",
    },

    // ===========================================
    // Effects / Shadows / Patterns
    // ===========================================
    {
      // Accessibility utilities
      "sr-only":
        "absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0_0_0_0)] whitespace-nowrap border-0",
    },
    {
      "shadow-card":
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]",
      "shadow-card-sm":
        "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.8)]",
      "shadow-card-subtle":
        "shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]",
    },
    {
      // Tooltip patterns
      tooltip:
        "absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-xs bg-neutral-800 px-2 py-1 text-xs whitespace-nowrap text-white  transition-opacity dark:bg-neutral-200 dark:text-black",
      "tooltip-container": "relative",
      "tooltip-success": "bg-green-600 text-white",
    },
    {
      "pattern-dots":
        "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2f48_1px,transparent_1px)] [background-size:16px_16px]",
    },
    {
      "gradient-fill":
        "bg-gradient-to-r from-base to-base bg-no-repeat bg-[length:0%_100%] hover:bg-[length:100%_100%] bg-left-bottom transition-all duration-500",
    },
    {
      focused:
        "focus:outline-none focus:border-dark focus:ring-2 focus:ring-primary focus:ring-offset-2",
    },
  ],
  theme: {
    borderRadius: tokens.radius,
    colors: {
      primary: tokens.color.primary,
    },
    font: {
      mono: tokens.font.mono,
      sans: tokens.font.sans,
    },
    fontSize: tokens.font.size,
    fontWeight: tokens.font.weight,
    spacing: tokens.space,
    transitionDuration: {
      base: "300ms",
      fast: "150ms",
      slow: "500ms",
    },
  },
  transformers: [transformerDirectives()],
});
