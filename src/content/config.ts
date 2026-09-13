import { defineCollection, z } from "astro:content";

const eraIds = ["jahiliyyah", "mecca", "medina", "post-fath"] as const;

const themeIds = [
  "kelahiran",
  "keluarga",
  "wahyu",
  "dakwah",
  "hijrah",
  "perang",
  "perjanjian",
  "diplomasi",
  "penaklukan",
  "haji",
  "kepemimpinan",
  "pemboikotan",
  "isra-miraj",
  "persaudaraan",
  "masa-kecil",
  "masa-muda",
] as const;

export const collections = {
  events: defineCollection({
    type: "content",
    schema: z.object({
      order: z.number(),
      year: z.string(),
      era: z.enum(eraIds),
      title: z.string(),
      titleAr: z.string(),
      summary: z.string(),
      location: z.string().optional(),
      themes: z.array(z.enum(themeIds)).min(1),
      sources: z
        .array(
          z.object({
            title: z.string(),
            author: z.string(),
            reference: z.string(),
            link: z.string().url().optional(),
          }),
        )
        .min(1),
      related: z.array(z.string()).optional(),
      lessons: z.array(z.string()).min(1),
    }),
  }),
};
