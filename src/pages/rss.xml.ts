import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

export async function GET(context: { site?: URL | undefined }) {
  const posts: CollectionEntry<'blog'>[] = await getCollection('blog')

  return rss({
    customData: `<language>ja-JP</language>`,
    description: 'HALQMEのブログ',
    items: posts.map((post) => ({
      description: post.data.description,
      link: `/blog/${post.id}/`,
      pubDate: post.data.pubDate,
      title: post.data.title,
    })),
    site: context.site ?? 'https://0w0.foo',
    title: 'HALQME Blog',
  })
}
