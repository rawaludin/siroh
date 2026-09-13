# Encyclopedia Collections (Tokoh / Tempat / Glosarium) Implementation Plan

**Goal:** Add three cross-linked reference collections to the kids' Sirah Nabawiyah app: Tokoh (people), Tempat (places), and Glosarium (terms), each with an index page and a detail page, cross-linked to events and to each other.

**Approach:** Three new Astro content collections. Tokoh is `type: "content"` (MDX bio body); Tempat and Glosarium are `type: "data"` (frontmatter only). Cross-linking is one-directional: each entry lists `relatedEvents` (event slugs). Event detail pages do a reverse lookup to show linked people/places/terms.

## Schemas

`src/content/config.ts` additions (zod):

```ts
const tokoh = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    nameAr: z.string(),
    role: z.string(),          // one-line role
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

export const collections = { events, tokoh, tempat, glosarium };
```

## Pages

- `/tokoh/` index (grouped grid of cards) + `/tokoh/[slug]/` detail (bio + related events + reverse-linked nothing else).
- `/tempat/` index + `/tempat/[slug]/` detail (description + related events).
- `/glosarium/` index (searchable list) + `/glosarium/[slug]/` detail (definition + related events).
- Event detail page (`/events/[slug]/`): add "Tokoh", "Tempat", "Glosarium" related-entry links via reverse lookup (entries whose `relatedEvents` includes the event slug).
- Add nav links to the three indexes (in PlayerHeader or a simple nav strip on index page).

## Content (comprehensive)

- **Tokoh (~50):** Abu Bakar, Umar, Utsman, Ali, Khadijah, Aisyah, Fatimah, Hamzah, Al-Abbas, Abu Thalib, Abdul Muthalib, Abdullah bin Abdul Muthalib, Aminah, Halimah As-Sa'diyah, Bilal, Zaid bin Haritsah, Abu Ubaidah, Abdurrahman bin Auf, Sa'd bin Abi Waqqas, Zubair bin Awwam, Thalhah, Mush'ab bin Umair, Salman Al-Farisi, Abu Dzar, Ammar bin Yasir, Sumayyah, Yasir, Abdullah bin Mas'ud, Ubay bin Ka'b, Muadz bin Jabal, Abu Hurairah, Abdullah bin Abbas, Abdullah bin Umar, Anas bin Malik, Ja'far bin Abi Thalib, Khalid bin Walid, Amr bin Al-Ash, Abu Sufyan, Ikrimah, Abu Jahal, Abu Lahab, Waraqah, An-Najasyi, Abu Ayyub Al-Anshari, Sa'd bin Muadz, Abdullah bin Ubay, Suhail bin Amr, Heraklius, Kisra, Muqawqis, Ummu Salamah, Hafsah.
- **Tempat (~20):** Makkah, Madinah (Yatsrib), Gua Hira, Gua Tsur, Ka'bah, Masjid Nabawi, Masjid Quba, Bukit Shafa, Padang Arafah, Mina, Gunung Uhud, Badar, Khandaq, Hudaibiyah, Khaibar, Thaif, Tabuk, Mu'tah, Habasyah, Syam.
- **Glosarium (~50):** Hijrah, Baiat, Wahyu, Tauhid, Syirik, Jahiliyyah, Quraisy, Muhajirin, Anshar, Sahabat, Khalifah, Sunnah, Hadis, Surah, Ayat, Masjid, Ka'bah, Umrah, Haji, Ramadan, Zakat, Syahadat, Adzan, Khutbah, Syuhada, Munafik, Musyrik, Nabi, Rasul, Malaikat, Jibril, Isra Mi'raj, Dakwah, Tafakur, Iman, Islam, Ihsan, Ummat, Kabilah, Sirah, Maghazi, Fathu Makkah, Ghazwah, Tahun Gajah, Kalender Hijriah, Hajar Aswad, Maqam Ibrahim, Zamzam, Tawaf, Sa'i.

Each entry: accurate name/term (Indonesian + Arabic) and a kid-friendly, historically-correct description/bio. Tokoh bios may include Arabic names and short factual narrative (MDX body).

## Tasks

1. **Task 27** — Add the 3 collections + schemas to `src/content/config.ts`; add `.gitkeep` files; `astro sync` (exit 0).
2. **Task 28** — Create `src/lib/related.ts` (reverse-lookup helper) + test: `relatedEntries(collection, eventSlug)` filters entries by `relatedEvents`. Add tokoh/tempat/glosarium index + detail page shells (routing via `getStaticPaths`).
3. **Task 29** — Author Tokoh entries (batch A: ~25) + verify.
4. **Task 30** — Author Tokoh entries (batch B: ~25) + verify.
5. **Task 31** — Author Tempat entries (~20) + verify.
6. **Task 32** — Author Glosarium entries (~50) + verify.
7. **Task 33** — Integration: render related-entry links on event detail pages; add nav links to the three indexes; final validation (test + build + cross-link spot check).

See spec: `docs/superpowers/specs/2026-09-13-sirah-timeline-design.md` (Gamification/Game-like UI/Arabic sections still apply).
