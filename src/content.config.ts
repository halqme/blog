import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
  schema: z.object({
    description: z.string(),
    heroImage: z.string().optional(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string().transform((t) => t.toLowerCase())).default([]),
    title: z.string(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
