import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig, fontProviders } from 'astro/config'
import remarkLinkCard from 'remark-link-card'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  fonts: [
    {
      cssVariable: '--font-shippori-antique',
      name: 'Shippori Antique',
      provider: fontProviders.fontsource(),
      weights: [400],
    },
    {
      cssVariable: '--font-ia-writer-mono',
      name: 'iA Writer Mono',
      provider: fontProviders.fontsource(),
      weights: [400, 500],
    },
  ],
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap(),
    mdx({
      remarkPlugins: [
        [
          remarkLinkCard,
          {
            cache: true,
            shortenUrl: true,
            thumbnailPosition: 'right',
          },
        ],
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [
      [
        remarkLinkCard,
        {
          cache: true,
          shortenUrl: true,
          thumbnailPosition: 'right',
        },
      ],
    ],
  },
  site: 'https://0w0.foo',
})
