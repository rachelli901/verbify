import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    applicableCountries: z.array(z.string()),
    careerStage: z.array(z.string()),
    lastReviewed: z.string(),
    author: z.string(),
    reviewer: z.string(),
    isExampleFictional: z.boolean(),
    evidenceGrade: z.enum(['verified', 'editorial', 'draft']),
    disclaimer: z.string(),
  }),
});

const examples = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/examples' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    industry: z.string(),
    isFictional: z.literal(true),
  }),
});

export const collections = { guides, examples };
