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

const tokoh = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    nameAr: z.string(),
    role: z.string(),
    order: z.number(),
    themes: z.array(z.enum(themeIds)).optional(),
    relatedEvents: z.array(z.string()).optional(),
  }),
});

const tempat = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    nameAr: z.string(),
    description: z.string(),
    location: z.string().optional(),
    order: z.number(),
    relatedEvents: z.array(z.string()).optional(),
  }),
});

const glosarium = defineCollection({
  type: "data",
  schema: z.object({
    term: z.string(),
    termAr: z.string(),
    definition: z.string(),
    order: z.number(),
    relatedEvents: z.array(z.string()).optional(),
  }),
});

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
  tokoh,
  tempat,
  glosarium,
};
