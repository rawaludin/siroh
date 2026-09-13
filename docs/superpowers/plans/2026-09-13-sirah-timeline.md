# Sirah Nabawiyah Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Astro web app where Indonesian users explore the life of Prophet Muhammad (ﷺ) through an interactive, era-grouped timeline with event detail pages, client-side search/filter, Arabic script support, and per-event sources.

**Architecture:** Astro content-first static site. Seerah events live as MDX files in a typed Content Collection. The timeline page pre-renders all events grouped by era; a small client-side script handles search/filter by toggling DOM visibility. Pure filter/group/sort logic lives in `src/lib/` and is unit-tested with Vitest.

**Tech Stack:** Astro 5, @astrojs/mdx, @fontsource/amiri (Arabic font), TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-13-sirah-timeline-design.md`

## Global Constraints

- Interface copy (nav, era labels, filter chips, search placeholder, "Sumber / Referensi", "Kembali ke garis waktu", etc.) MUST be Indonesian.
- Arabic text MUST be wrapped in `lang="ar" dir="rtl"` (or rendered via a component that does so).
- Era ids are exactly: `jahiliyyah`, `mecca`, `medina`, `post-fath`.
- Theme ids are exactly (lowercase, hyphenated): `kelahiran`, `keluarga`, `wahyu`, `dakwah`, `hijrah`, `perang`, `perjanjian`, `diplomasi`, `penaklukan`, `haji`, `kepemimpinan`, `pemboikotan`, `isra-miraj`, `persaudaraan`, `masa-kecil`, `masa-muda`.
- Every event file MUST have `order` (number), `year`, `era`, `title`, `titleAr`, `summary`, `themes` (non-empty), and `sources` (at least one entry).
- All `order` values MUST be unique across the collection.
- No backend, no auth, no database. Content is files; the build is fully static.

---

## File Structure

```
astro.config.mjs            # Astro config, registers @astrojs/mdx
package.json                # deps + scripts (dev/build/test)
tsconfig.json               # extends astro/tsconfigs/strict
vitest.config.ts            # vitest node environment
src/
  content/
    config.ts               # content collection schema (zod)
    events/                 # one .mdx file per event (frontmatter + prose)
  lib/
    eras.ts                 # Era type + ERAS list + getEra()
    events.ts               # pure filter/group/sort functions
    events.test.ts          # unit tests for events.ts
  layouts/
    Base.astro              # <html>, head, font, global.css, footer
  components/
    JumpNav.astro           # sticky "jump to era" nav
    EraSection.astro        # era header + event cards
    EventCard.astro         # single event card (with data-* for filtering)
    SearchFilter.astro      # search box + era/theme chips + client script
    SourceList.astro        # renders event sources
    ThemeChips.astro        # renders theme tag chips
    Arabic.astro            # <span lang="ar" dir="rtl"> wrapper
  pages/
    index.astro             # timeline page
    events/
      [slug].astro          # event detail page
  styles/
    global.css              # reset, typography, CSS variables
```

---

## Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`
- Create: `.gitignore`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `preview`, `test`; `Base` layout usable by pages.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "siroh",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^5.1.0",
    "@astrojs/mdx": "^4.0.0",
    "@fontsource/amiri": "^5.1.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Write `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  integrations: [mdx()],
});
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node" },
});
```

- [ ] **Step 5: Write `.gitignore`**

```
node_modules/
dist/
.astro/
```

- [ ] **Step 6: Write `src/styles/global.css`**

```css
:root {
  --bg: #faf8f4;
  --text: #2b2722;
  --muted: #6b645a;
  --card: #ffffff;
  --border: #e8e2d8;
  --accent: #1f6f8b;
  --radius: 10px;
  --font-body: "Amiri", "Georgia", serif;
  --font-ui: system-ui, -apple-system, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-ui);
  line-height: 1.6;
}

h1, h2, h3 { line-height: 1.25; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
```

- [ ] **Step 7: Write `src/layouts/Base.astro`**

```astro
---
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`
Expected: installs astro, @astrojs/mdx, @fontsource/amiri, typescript, vitest without errors.

- [ ] **Step 9: Run tests (sanity — expect "no test files")**

Run: `npm test`
Expected: `No test files found` (or exit 0 with 0 tests).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold astro project"
```

---

## Task 2: Era definitions

**Files:**
- Create: `src/lib/eras.ts`
- Test: `src/lib/eras.test.ts`

**Interfaces:**
- Produces: `EraId`, `Era`, `ERAS`, `ERA_IDS`, `getEra(id: EraId): Era`. These are consumed by `events.ts`, `Timeline`/`EraSection`/`JumpNav`/`SearchFilter` components, and content schema.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { ERAS, ERA_IDS, getEra } from "./eras";

describe("eras", () => {
  it("lists four eras in chronological order", () => {
    expect(ERA_IDS).toEqual(["jahiliyyah", "mecca", "medina", "post-fath"]);
  });

  it("exposes a getEra lookup", () => {
    const era = getEra("mecca");
    expect(era.id).toBe("mecca");
    expect(era.label).toBeTruthy();
    expect(era.color).toMatch(/^#/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/eras.test.ts`
Expected: FAIL (cannot resolve `./eras`).

- [ ] **Step 3: Write `src/lib/eras.ts`**

```ts
export type EraId = "jahiliyyah" | "mecca" | "medina" | "post-fath";

export interface Era {
  id: EraId;
  label: string;
  labelAr: string;
  description: string;
  color: string;
}

export const ERAS: Era[] = [
  {
    id: "jahiliyyah",
    label: "Masa Jahiliyyah",
    labelAr: "الجاهلية",
    description: "Keadaan bangsa Arab sebelum Islam hingga menjelang diutusnya Nabi.",
    color: "#8a6d3b",
  },
  {
    id: "mecca",
    label: "Periode Makkah",
    labelAr: "العهد المكي",
    description: "Dari wahyu pertama hingga hijrah ke Madinah.",
    color: "#1f6f8b",
  },
  {
    id: "medina",
    label: "Periode Madinah",
    labelAr: "العهد المدني",
    description: "Dari hijrah hingga pembebasan Makkah.",
    color: "#2d8a4e",
  },
  {
    id: "post-fath",
    label: "Pasca Fathu Makkah",
    labelAr: "بعد فتح مكة",
    description: "Dari pembebasan Makkah hingga wafatnya Nabi.",
    color: "#8b1f2d",
  },
];

export const ERA_IDS = ERAS.map((e) => e.id);

const byId = new Map(ERAS.map((e) => [e.id, e]));

export function getEra(id: EraId): Era {
  const era = byId.get(id);
  if (!era) throw new Error(`Unknown era: ${id}`);
  return era;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/eras.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/eras.ts src/lib/eras.test.ts
git commit -m "feat: add era definitions"
```

---

## Task 3: Pure filter/group/sort logic

**Files:**
- Create: `src/lib/events.ts`
- Test: `src/lib/events.test.ts`

**Interfaces:**
- Produces:
  - `Filters` = `{ query: string; eras: EraId[]; themes: string[] }` (empty array = no restriction)
  - `Filterable` = `{ era: EraId; themes: string[]; searchText: string }`
  - `EventData` = a plain object with top-level fields `id, order, year, era, title, titleAr, summary, location?, themes, sources, related?, searchText`
  - `toEventData(entry: CollectionEntry<"events">): EventData` — maps an Astro content entry to the plain shape (flattens `entry.data.*` and computes `searchText` from title + titleAr + summary + raw body)
  - `matchesFilter(item: Filterable, f: Filters): boolean`
  - `filterEvents<T extends Filterable>(items: T[], f: Filters): T[]`
  - `sortChronological<T extends { order: number }>(items: T[]): T[]`
  - `groupByEra<T extends Filterable & { order: number }>(items: T[]): { era: Era; items: T[] }[]`
- Consumes: `Era`, `getEra` from `src/lib/eras.ts`. All `sort`/`group` functions operate on the plain `EventData` shape (top-level `order`), never directly on `CollectionEntry` (which nests fields under `.data`).

Semantics (must be reflected in tests):
- **Within a dimension** (era, theme), multiple selections are OR.
- **Across dimensions** (era vs theme vs query), conditions are AND.
- `query` is a case-insensitive substring match on `searchText`; empty query always matches.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { matchesFilter, filterEvents, sortChronological, groupByEra } from "./events";

const a = { era: "mecca" as const, themes: ["wahyu"], searchText: "wahyu pertama gua hira", order: 2 };
const b = { era: "medina" as const, themes: ["perang"], searchText: "perang badar", order: 3 };
const c = { era: "mecca" as const, themes: ["hijrah", "perang"], searchText: "hijrah ke habasyah", order: 1 };

describe("matchesFilter", () => {
  it("matches everything with no filters", () => {
    expect(matchesFilter(a, { query: "", eras: [], themes: [] })).toBe(true);
  });

  it("matches era by OR within era dimension", () => {
    expect(matchesFilter(a, { query: "", eras: ["mecca", "medina"], themes: [] })).toBe(true);
    expect(matchesFilter(a, { query: "", eras: ["medina"], themes: [] })).toBe(false);
  });

  it("matches themes by OR within theme dimension", () => {
    expect(matchesFilter(c, { query: "", eras: [], themes: ["perang", "keluarga"] })).toBe(true);
    expect(matchesFilter(a, { query: "", eras: [], themes: ["perang"] })).toBe(false);
  });

  it("ANDs across era and theme dimensions", () => {
    expect(matchesFilter(b, { query: "", eras: ["medina"], themes: ["perang"] })).toBe(true);
    expect(matchesFilter(b, { query: "", eras: ["mecca"], themes: ["perang"] })).toBe(false);
  });

  it("matches query as case-insensitive substring", () => {
    expect(matchesFilter(a, { query: "HIRA", eras: [], themes: [] })).toBe(true);
    expect(matchesFilter(a, { query: "badar", eras: [], themes: [] })).toBe(false);
  });
});

describe("sortChronological", () => {
  it("sorts ascending by order", () => {
    expect(sortChronological([a, b, c]).map((e) => e.order)).toEqual([1, 2, 3]);
  });
});

describe("groupByEra", () => {
  it("groups sorted events by era in ERA_IDS order", () => {
    const groups = groupByEra([a, b, c]);
    expect(groups.map((g) => g.era.id)).toEqual(["mecca", "medina"]);
    expect(groups[0].items.map((e) => e.order)).toEqual([1, 2]);
  });
});

describe("filterEvents", () => {
  it("returns only matching items", () => {
    const out = filterEvents([a, b, c], { query: "", eras: [], themes: ["perang"] });
    expect(out.map((e) => e.searchText)).toEqual(["perang badar", "hijrah ke habasyah"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/events.test.ts`
Expected: FAIL (cannot resolve `./events`).

- [ ] **Step 3: Write `src/lib/events.ts`**

```ts
import { getEra, type Era, type EraId } from "./eras";
import type { CollectionEntry } from "astro:content";

export interface Filters {
  query: string;
  eras: EraId[];
  themes: string[];
}

export interface Filterable {
  era: EraId;
  themes: string[];
  searchText: string;
}

export interface Source {
  title: string;
  author: string;
  reference: string;
  link?: string;
}

export interface EventData {
  id: string;
  order: number;
  year: string;
  era: EraId;
  title: string;
  titleAr: string;
  summary: string;
  location?: string;
  themes: string[];
  sources: Source[];
  related?: string[];
  searchText: string;
}

type EventEntry = CollectionEntry<"events">;

export function toEventData(entry: EventEntry): EventData {
  return {
    id: entry.id,
    order: entry.data.order,
    year: entry.data.year,
    era: entry.data.era,
    title: entry.data.title,
    titleAr: entry.data.titleAr,
    summary: entry.data.summary,
    location: entry.data.location,
    themes: entry.data.themes,
    sources: entry.data.sources,
    related: entry.data.related,
    searchText: [entry.data.title, entry.data.titleAr, entry.data.summary, entry.body ?? ""]
      .join(" ")
      .toLowerCase(),
  };
}

export function matchesFilter(item: Filterable, f: Filters): boolean {
  if (f.eras.length > 0 && !f.eras.includes(item.era)) return false;
  if (f.themes.length > 0 && !f.themes.some((t) => item.themes.includes(t))) return false;
  const q = f.query.trim().toLowerCase();
  if (q && !item.searchText.toLowerCase().includes(q)) return false;
  return true;
}

export function filterEvents<T extends Filterable>(items: T[], f: Filters): T[] {
  return items.filter((item) => matchesFilter(item, f));
}

export function sortChronological<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((x, y) => x.order - y.order);
}

export function groupByEra<T extends Filterable & { order: number }>(
  items: T[],
): { era: Era; items: T[] }[] {
  const sorted = sortChronological(items);
  const result: { era: Era; items: T[] }[] = [];
  for (const item of sorted) {
    const era = getEra(item.era);
    let group = result.find((g) => g.era.id === era.id);
    if (!group) {
      group = { era, items: [] };
      result.push(group);
    }
    group.items.push(item);
  }
  return result;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/events.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/events.ts src/lib/events.test.ts
git commit -m "feat: add filter/group/sort logic"
```

---

## Task 4: Content collection schema

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/events/.gitkeep`

**Interfaces:**
- Produces: an `events` collection with the zod schema below. Consumed by pages via `getCollection("events")`. Enforces the content-integrity constraints from Global Constraints.

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
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
    }),
  }),
};
```

- [ ] **Step 2: Create `.gitkeep` so the empty dir is tracked**

Create an empty file at `src/content/events/.gitkeep` (zero bytes).

- [ ] **Step 3: Generate types and verify no errors**

Run: `npx astro sync`
Expected: exit 0; generates `.astro/types.d.ts`. (No events yet, so nothing validates deeply.)

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts src/content/events/.gitkeep
git commit -m "feat: add content collection schema"
```

---

## Task 5: Author content — Jahiliyyah & Mecca eras

**Files:**
- Create: `src/content/events/kelahiran-nabi.mdx`
- Create: `src/content/events/yatim-di-pengasuhan.mdx`
- Create: `src/content/events/perjalanan-ke-syam.mdx`
- Create: `src/content/events/perang-fijar-hilf-al-fudul.mdx`
- Create: `src/content/events/pernikahan-khadijah.mdx`
- Create: `src/content/events/peletakan-hajar-aswad.mdx`
- Create: `src/content/events/wahyu-pertama.mdx`
- Create: `src/content/events/dakwah-sembunyi.mdx`
- Create: `src/content/events/dakwah-terang-terangan.mdx`
- Create: `src/content/events/penindasan-quraisy.mdx`
- Create: `src/content/events/hijrah-ke-habasyah.mdx`
- Create: `src/content/events/islamnya-hamzah-dan-umar.mdx`
- Create: `src/content/events/pemboikotan-bani-hasyim.mdx`
- Create: `src/content/events/tahun-kesedihan.mdx`
- Create: `src/content/events/isra-miraj.mdx`
- Create: `src/content/events/baiat-aqabah-pertama.mdx`
- Create: `src/content/events/baiat-aqabah-kedua.mdx`

**Interfaces:**
- Produces: MDX content files matching the schema from Task 4. Each `related` id must be a slug of an event that will exist by Task 7.

Each file follows this template (frontmatter then body prose). Write every file with the exact frontmatter below and the prose given. Arabic text in the body is written inline and rendered through the `Arabic` component at display time (no component needed inside the MDX itself).

- [ ] **Step 1: `kelahiran-nabi.mdx`**

```mdx
---
order: 1
year: "c. 570 M (Tahun Gajah)"
era: "jahiliyyah"
title: "Kelahiran Nabi Muhammad"
titleAr: "مولد النبي محمد ﷺ"
summary: "Lahir di Makkah pada Tahun Gajah, bertepatan dengan peristiwa penyerangan Ka'bah oleh pasukan gajah Abrahah."
location: "Makkah"
themes: ["kelahiran", "keluarga"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Bangsa Arab' dan 'Kelahiran Nabi'"
  - title: "Sirah Nabawiyah Ibnu Hisyam"
    author: "Ibnu Hisyam"
    reference: "Jilid 1, Bab Kelahiran Rasulullah"
related: ["yatim-di-pengasuhan"]
---

Nabi Muhammad ﷺ lahir di Makkah pada hari Senin, 12 Rabiul Awal, bertepatan dengan **Tahun Gajah** (sekitar 570 M). Beliau berasal dari kabilah Quraisy, keturunan Bani Hasyim.

Pada tahun yang sama, Abrahah memimpin pasukan bergajah untuk menghancurkan Ka'bah, namun Allah menggagalkannya sebagaimana dikisahkan dalam surah **Al-Fil**. Ayah beliau, Abdullah bin Abdul Muthalib, telah wafat sebelum kelahiran beliau.
```

- [ ] **Step 2: `yatim-di-pengasuhan.mdx`**

```mdx
---
order: 2
year: "576–578 M"
era: "jahiliyyah"
title: "Yatim dalam Pengasuhan"
titleAr: "يتم النبي ﷺ"
summary: "Wafatnya ibu beliau, Aminah, lalu kakeknya Abdul Muthalib; beliau diasuh berturut-turut oleh kakek dan pamannya, Abu Thalib."
location: "Makkah"
themes: ["keluarga", "masa-kecil"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Masa Kecil Nabi'"
related: ["kelahiran-nabi", "perjalanan-ke-syam"]
---

Nabi ﷺ disusui oleh **Halimah As-Sa'diyah** di perkampungan Bani Sa'd. Ketika beliau berusia enam tahun, ibunda beliau **Aminah** wafat di Al-Abwa' dalam perjalanan pulang dari Madinah.

Beliau kemudian diasuh oleh kakeknya, **Abdul Muthalib**. Dua tahun kemudian sang kakek wafat, dan pengasuhan berpindah kepada pamannya, **Abu Thalib**, yang menyayangi dan melindungi beliau sepanjang hidupnya.
```

- [ ] **Step 3: `perjalanan-ke-syam.mdx`**

```mdx
---
order: 3
year: "c. 582 M"
era: "jahiliyyah"
title: "Perjalanan ke Syam dan Pertemuan dengan Buhaira"
titleAr: "الرحلة إلى الشام"
summary: "Saat berusia 12 tahun, beliau ikut kafilah dagang pamannya ke Syam dan dikenali seorang rahib sebagai calon nabi."
location: "Bushra, Syam"
themes: ["masa-muda", "keluarga"]
sources:
  - title: "Sirah Nabawiyah Ibnu Hisyam"
    author: "Ibnu Hisyam"
    reference: "Jilid 1, Bab Perjalanan ke Syam"
related: ["yatim-di-pengasuhan"]
---

Pada usia sekitar dua belas tahun, beliau ikut kafilah dagang pamannya **Abu Thalib** menuju Syam. Di **Bushra**, seorang rahib bernama **Buhaira** memperhatikan tanda-tanda kenabian pada diri beliau.

Buhaira berpesan agar Abu Thalib segera membawa pulang beliau dan menjaganya dari orang-orang Yahudi yang dikhawatirkan akan berbuat jahat.
```

- [ ] **Step 4: `perang-fijar-hilf-al-fudul.mdx`**

```mdx
---
order: 4
year: "c. 585 M"
era: "jahiliyyah"
title: "Perang Fijar dan Hilf al-Fudul"
titleAr: "حرب الفجار وحلف الفضول"
summary: "Beliau menyaksikan Perang Fijar dan ikut serta dalam Hilf al-Fudul, perjanjian untuk membela orang yang terzalimi."
location: "Makkah"
themes: ["masa-muda", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Masa Muda Nabi'"
related: ["peletakan-hajar-aswad"]
---

Pada masa mudanya, Nabi ﷺ menyaksikan **Perang Fijar** antara Quraisy dan kabilah lain. Beliau tidak ikut berperang, namun membantu menyiapkan anak panah bagi para pamannya.

Beliau juga menghadiri **Hilf al-Fudul**, sebuah perjanjian mulia di rumah Abdullah bin Jud'an untuk menolong siapa pun yang dizalimi di Makkah. Beliau kemudian berkata, "Seandainya aku diundang pada perjanjian serupa di masa Islam, niscaya aku memenuhinya."
```

- [ ] **Step 5: `pernikahan-khadijah.mdx`**

```mdx
---
order: 5
year: "c. 595 M (usia 25 tahun)"
era: "jahiliyyah"
title: "Pernikahan dengan Khadijah"
titleAr: "زواج النبي ﷺ بخديجة"
summary: "Beliau menikah dengan Khadijah binti Khuwailid, seorang saudagar terhormat, setelah sebelumnya dipercaya membawa dagangannya."
location: "Makkah"
themes: ["keluarga", "masa-muda"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Pernikahan Nabi dengan Khadijah'"
related: ["peletakan-hajar-aswad", "wahyu-pertama"]
---

Karena kejujurannya, beliau dipercaya **Khadijah binti Khuwailid** untuk membawa barang dagangannya ke Syam. Kesuksesan dan akhlak beliau membuat Khadijah meminang beliau.

Keduanya menikah ketika beliau berusia 25 tahun dan Khadijah 40 tahun. Khadijah menjadi istri pertama dan orang pertama yang beriman kepada beliau, serta tempat beliau kembali dalam suka dan duka.
```

- [ ] **Step 6: `peletakan-hajar-aswad.mdx`**

```mdx
---
order: 6
year: "c. 605 M (usia 35 tahun)"
era: "jahiliyyah"
title: "Peletakan Hajar Aswad"
titleAr: "وضع الحجر الأسود"
summary: "Quraisy berselisih siapa yang berhak meletakkan Hajar Aswad; Nabi ﷺ menyelesaikannya dengan bijak."
location: "Makkah"
themes: ["kepemimpinan"]
sources:
  - title: "Sirah Nabawiyah Ibnu Hisyam"
    author: "Ibnu Hisyam"
    reference: "Jilid 1, Bab Pembangunan Ka'bah"
related: ["pernikahan-khadijah", "wahyu-pertama"]
---

Ketika Ka'bah direnovasi, kabilah-kabilah Quraisy berselisih tentang siapa yang berhak meletakkan **Hajar Aswad** ke tempatnya. Hampir saja terjadi pertumpahan darah.

Nabi ﷺ yang dikenal sebagai **Al-Amin** (yang terpercaya) diminta menjadi penengah. Beliau membentangkan kain, meletakkan Hajar Aswad di atasnya, dan meminta setiap pemimpin kabilah memegang ujung kain untuk mengangkatnya bersama, lalu beliau meletakkannya sendiri. Semua pihak puas.
```

- [ ] **Step 7: `wahyu-pertama.mdx`**

```mdx
---
order: 7
year: "610 M (Ramadan)"
era: "mecca"
title: "Wahyu Pertama di Gua Hira"
titleAr: "أول الوحي في غار حراء"
summary: "Malaikat Jibril menyampaikan lima ayat pertama surah Al-'Alaq kepada beliau di Gua Hira."
location: "Gua Hira, Makkah"
themes: ["wahyu", "dakwah"]
sources:
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Hadis no. 3 (Bab Permulaan Wahyu)"
    link: "https://sunnah.com/bukhari:3"
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Di Gua Hira'"
related: ["pernikahan-khadijah", "dakwah-sembunyi"]
---

Menjelang usia empat puluh tahun, beliau sering menyendiri di **Gua Hira** untuk bertafakur. Pada Ramadan tahun 610 M, **Malaikat Jibril** datang dan memerintahkan beliau membaca: *"Iqra' bismi rabbikal-ladzi khalaq..."* — lima ayat pertama surah **Al-'Alaq**.

Beliau pulang dalam keadaan gemetar dan menceritakannya kepada **Khadijah**, yang menenangkan dan meyakinkan beliau. Khadijah kemudian membawa beliau kepada **Waraqah bin Naufal**, yang membenarkan bahwa itu adalah wahyu kenabian.
```

- [ ] **Step 8: `dakwah-sembunyi.mdx`**

```mdx
---
order: 8
year: "610–613 M"
era: "mecca"
title: "Dakwah Sembunyi-sembunyi"
titleAr: "الدعوة السرية"
summary: "Selama tiga tahun pertama, beliau berdakwah secara rahasia kepada orang-orang terdekat."
location: "Makkah"
themes: ["dakwah", "wahyu"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Tahap Dakwah Sembunyi-sembunyi'"
related: ["wahyu-pertama", "dakwah-terang-terangan"]
---

Selama kurang lebih tiga tahun, beliau berdakwah secara sembunyi-sembunyi. Orang-orang pertama yang beriman adalah **Khadijah** (istrinya), **Ali bin Abi Thalib**, **Zaid bin Haritsah**, dan sahabat karibnya **Abu Bakar Ash-Shiddiq**.

Dari rumah **Al-Arqam bin Abi Al-Arqam**, beliau mengajarkan Islam kepada mereka yang tertarik, jauh dari pengawasan kaum Quraisy.
```

- [ ] **Step 9: `dakwah-terang-terangan.mdx`**

```mdx
---
order: 9
year: "613 M"
era: "mecca"
title: "Dakwah Terang-terangan di Bukit Shafa"
titleAr: "الدعوة الجهرية"
summary: "Setelah turunnya perintah Allah, beliau menyeru kaum Quraisy secara terbuka di Bukit Shafa."
location: "Bukit Shafa, Makkah"
themes: ["dakwah", "wahyu"]
sources:
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Hadis tentang seruan di Bukit Shafa"
    link: "https://sunnah.com/bukhari:4770"
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Dakwah Terang-terangan'"
related: ["dakwah-sembunyi", "penindasan-quraisy"]
---

Setelah turun ayat *"Dan berilah peringatan kepada kerabat-kerabatmu yang terdekat"* (Asy-Syu'ara: 214), beliau naik ke **Bukit Shafa** dan menyeru kaum Quraisy.

Ketika mereka berkumpul, beliau bersabda: *"Bagaimana pendapat kalian jika aku memberitahukan ada pasukan di balik bukit ini? Adakah kalian membenarkanku?"* Mereka menjawab, "Tentu, engkau tidak pernah berbohong." Beliau lalu mengajak mereka kepada tauhid. Sejak saat itu dakwah dilakukan secara terbuka dan mulai mendapat penolakan keras.
```

- [ ] **Step 10: `penindasan-quraisy.mdx`**

```mdx
---
order: 10
year: "613–615 M"
era: "mecca"
title: "Penindasan Kaum Quraisy"
titleAr: "اضطهاد قريش للمسلمين"
summary: "Kaum muslimin yang lemah disiksa dan dianiaya; keluarga Yasir termasuk yang gugur sebagai syuhada pertama."
location: "Makkah"
themes: ["dakwah", "pemboikotan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Penindasan Kaum Quraisy'"
related: ["dakwah-terang-terangan", "hijrah-ke-habasyah"]
---

Kaum Quraisy menindas para pengikut Nabi yang lemah, terutama para budak dan orang-orang tanpa pelindung. **Bilal bin Rabah** disiksa oleh majikannya, dan **keluarga Yasir** (Sumayyah dan Yasir) gugur sebagai syuhada pertama dalam Islam.

Melihat beratnya penderitaan mereka, beliau bersabda: *"Bersabarlah wahai keluarga Yasir, sesungguhnya tempat yang dijanjikan bagi kalian adalah surga."*
```

- [ ] **Step 11: `hijrah-ke-habasyah.mdx`**

```mdx
---
order: 11
year: "615 M (5 H)"
era: "mecca"
title: "Hijrah ke Habasyah"
titleAr: "الهجرة إلى الحبشة"
summary: "Sekelompok sahabat hijrah ke Habasyah dan dilindungi oleh Raja An-Najasyi yang adil."
location: "Habasyah (Ethiopia)"
themes: ["hijrah", "dakwah"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Hijrah Pertama ke Habasyah'"
related: ["penindasan-quraisy", "islamnya-hamzah-dan-umar"]
---

Untuk menyelamatkan para sahabat dari penyiksaan, beliau mengizinkan mereka hijrah ke **Habasyah** (Ethiopia), negeri yang dipimpin raja yang adil, **An-Najasyi**. Sebanyak belasan sahabat berangkat pada gelombang pertama, disusul gelombang kedua.

Quraisy mengutus Amr bin Ash untuk meminta mereka dikembalikan, namun **Ja'far bin Abi Thalib** membacakan surah **Maryam** di hadapan raja. An-Najasyi terharu dan menolak menyerahkan kaum muslimin.
```

- [ ] **Step 12: `islamnya-hamzah-dan-umar.mdx`**

```mdx
---
order: 12
year: "616 M (6 H)"
era: "mecca"
title: "Masuk Islamnya Hamzah dan Umar"
titleAr: "إسلام حمزة وعمر"
summary: "Islam menjadi kuat dengan masuk Islamnya Hamzah bin Abdul Muthalib dan Umar bin Khattab."
location: "Makkah"
themes: ["dakwah", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Masuk Islamnya Hamzah dan Umar'"
related: ["hijrah-ke-habasyah", "pemboikotan-bani-hasyim"]
---

Pada tahun keenam kenabian, **Hamzah bin Abdul Muthalib**, paman Nabi, masuk Islam setelah marah melihat Abu Jahal menghina keponakannya. Tak lama kemudian, **Umar bin Khattab** — yang semula sangat memusuhi Islam — masuk Islam setelah membaca ayat-ayat surah **Thaha** di rumah saudarinya.

Dengan masuk Islamnya dua tokoh yang disegani ini, kaum muslimin menjadi lebih kuat dan mulai beribadah di depan Ka'bah secara terbuka.
```

- [ ] **Step 13: `pemboikotan-bani-hasyim.mdx`**

```mdx
---
order: 13
year: "617–619 M (7–10 H)"
era: "mecca"
title: "Pemboikotan Bani Hasyim"
titleAr: "مقاطعة بني هاشم"
summary: "Quraisy memboikot Bani Hasyim dan Bani Muthalib di Syi'ib Abu Thalib selama tiga tahun."
location: "Syi'ib Abu Thalib, Makkah"
themes: ["pemboikotan", "dakwah"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Pemboikotan'"
related: ["islamnya-hamzah-dan-umar", "tahun-kesedihan"]
---

Quraisy menulis piagam untuk memboikot **Bani Hasyim** dan **Bani Muthalib**: tidak menikahi, tidak berdagang, dan tidak bergaul dengan mereka, kecuali jika mereka menyerahkan Nabi ﷺ. Kaum muslimin dan keluarga beliau terkepung di **Syi'ib Abu Thalib** selama tiga tahun dalam kelaparan.

Akhirnya beberapa pemuka Quraisy yang berhati mulia membatalkan pemboikotan itu, dan piagam yang mereka tulis ternyata telah dimakan rayap kecuali lafaz Allah.
```

- [ ] **Step 14: `tahun-kesedihan.mdx`**

```mdx
---
order: 14
year: "619 M (10 H)"
era: "mecca"
title: "Tahun Kesedihan (Amul Huzn)"
titleAr: "عام الحزن"
summary: "Wafatnya Abu Thalib dan Khadijah, dua pelindung terbesar Nabi ﷺ, pada tahun yang sama."
location: "Makkah"
themes: ["keluarga", "dakwah"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Tahun Kesedihan'"
related: ["pemboikotan-bani-hasyim", "isra-miraj"]
---

Tak lama setelah pemboikotan berakhir, dua pelindung utama beliau wafat berturut-turut: pamannya **Abu Thalib**, lalu istri tercinta **Khadijah**. Tahun itu dikenal sebagai **Amul Huzn** (Tahun Kesedihan).

Sepeninggal Abu Thalib, gangguan Quraisy semakin menjadi. Karena itu beliau mencoba berdakwah ke **Thaif**, namun justru dilempari batu hingga terluka, hingga Allah menghibur beliau melalui peristiwa Isra' Mi'raj.
```

- [ ] **Step 15: `isra-miraj.mdx`**

```mdx
---
order: 15
year: "621 M (10/11 H)"
era: "mecca"
title: "Isra' Mi'raj"
titleAr: "الإسراء والمعراج"
summary: "Perjalanan malam beliau dari Masjidil Haram ke Masjidil Aqsha lalu naik ke Sidratul Muntaha; kewajiban shalat lima waktu diterima."
location: "Makkah ke Yerusalem dan Sidratul Muntaha"
themes: ["isra-miraj", "wahyu"]
sources:
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Hadis tentang Isra' Mi'raj (Kitab al-Manaqib)"
    link: "https://sunnah.com/bukhari:3887"
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Isra' dan Mi'raj'"
related: ["tahun-kesedihan", "baiat-aqabah-pertama"]
---

Pada malam yang penuh berkah, beliau diperjalankan dari **Masjidil Haram** ke **Masjidil Aqsha** (Isra'), kemudian dinaikkan ke langit hingga **Sidratul Muntaha** (Mi'raj). Di sana beliau menerima perintah **shalat lima waktu**.

Peristiwa ini menjadi penghibur sekaligus ujian keimanan. **Abu Bakar** langsung membenarkannya sehingga digelari **Ash-Shiddiq**.
```

- [ ] **Step 16: `baiat-aqabah-pertama.mdx`**

```mdx
---
order: 16
year: "621 M (12 H)"
era: "mecca"
title: "Baiat Aqabah Pertama"
titleAr: "بيعة العقبة الأولى"
summary: "Dua belas orang dari Yatsrib berjanji setia kepada Nabi ﷺ, awal mula cahaya Islam di Madinah."
location: "Aqabah, Mina"
themes: ["hijrah", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Baiat Aqabah Pertama'"
related: ["isra-miraj", "baiat-aqabah-kedua"]
---

Pada musim haji, beliau bertemu dengan sekelompok orang dari **Yatsrib** (Madinah) yang tertarik kepada Islam. Dua belas orang di antara mereka melakukan **Baiat Aqabah Pertama**: berjanji untuk tidak menyekutukan Allah, tidak mencuri, tidak berzina, dan tidak berdusta.

Beliau mengutus **Mush'ab bin Umair** ke Madinah untuk mengajarkan Islam. Dakwah Islam pun tersebar luas di sana, sehingga hampir tak ada rumah penduduk Madinah yang tidak mengenal Islam.
```

- [ ] **Step 17: `baiat-aqabah-kedua.mdx`**

```mdx
---
order: 17
year: "622 M (13 H)"
era: "mecca"
title: "Baiat Aqabah Kedua"
titleAr: "بيعة العقبة الثانية"
summary: "Tujuh puluh tiga orang Madinah berjanji melindungi dan membela Nabi ﷺ seperti membela keluarga sendiri."
location: "Aqabah, Mina"
themes: ["hijrah", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Baiat Aqabah Kedua'"
related: ["baiat-aqabah-pertama", "hijrah-ke-madinah"]
---

Pada musim haji berikutnya, **73 orang** laki-laki dan dua perempuan dari Madinah melakukan **Baiat Aqabah Kedua** (Baiatul Harb). Mereka berjanji untuk melindungi dan membela Nabi ﷺ sebagaimana membela keluarga dan diri mereka sendiri.

Peristiwa ini membuka jalan bagi kaum muslimin untuk berhijrah ke Madinah, negeri yang akan menjadi pusat peradaban Islam.
```

- [ ] **Step 18: Verify the collection parses**

Run: `npx astro sync && npx astro build`
Expected: exit 0. Content validates against the schema (era/themes enums, ≥1 source). A build output `dist/` is produced (no pages reference the events yet, which is fine).

- [ ] **Step 19: Commit**

```bash
git add src/content/events/
git commit -m "feat: author jahiliyyah and mecca events"
```

---

## Task 6: Author content — Medina era

**Files:**
- Create: `src/content/events/hijrah-ke-madinah.mdx`
- Create: `src/content/events/masjid-nabawi-dan-persaudaraan.mdx`
- Create: `src/content/events/piagam-madinah.mdx`
- Create: `src/content/events/perang-badar.mdx`
- Create: `src/content/events/perang-uhud.mdx`
- Create: `src/content/events/perang-khandaq.mdx`
- Create: `src/content/events/perjanjian-hudaibiyah.mdx`
- Create: `src/content/events/surat-kepada-para-raja.mdx`
- Create: `src/content/events/perang-khaibar.mdx`
- Create: `src/content/events/umrah-qadha.mdx`
- Create: `src/content/events/perang-mutah.mdx`

**Interfaces:** Produces MDX files matching Task 4 schema. `related` ids must resolve to event slugs that exist after Task 7.

- [ ] **Step 1: `hijrah-ke-madinah.mdx`**

```mdx
---
order: 18
year: "622 M (1 H)"
era: "medina"
title: "Hijrah ke Madinah"
titleAr: "الهجرة إلى المدينة"
summary: "Nabi ﷺ bersama Abu Bakar berhijrah ke Madinah dan bersembunyi di Gua Tsur; menjadi awal kalender Hijriah."
location: "Makkah ke Madinah"
themes: ["hijrah", "kepemimpinan"]
sources:
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Hadis tentang hijrah dan Gua Tsur"
    link: "https://sunnah.com/bukhari:3905"
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Hijrah ke Madinah'"
related: ["baiat-aqabah-kedua", "masjid-nabawi-dan-persaudaraan"]
---

Setelah mendapat izin Allah, kaum muslimin berhijrah ke Madinah. Nabi ﷺ berangkat bersama **Abu Bakar Ash-Shiddiq**, menempuh jalan yang tidak biasa, dan bersembunyi selama tiga hari di **Gua Tsur** dari kejaran Quraisy.

Sesampainya di **Quba**, beliau membangun masjid pertama dalam Islam, **Masjid Quba**, lalu melanjutkan perjalanan hingga disambut meriah penduduk Madinah. Peristiwa ini menjadi titik awal **kalender Hijriah**.
```

- [ ] **Step 2: `masjid-nabawi-dan-persaudaraan.mdx`**

```mdx
---
order: 19
year: "622 M (1 H)"
era: "medina"
title: "Pembangunan Masjid Nabawi dan Persaudaraan Muhajirin-Anshar"
titleAr: "بناء المسجد النبوي والمؤاخاة"
summary: "Beliau membangun Masjid Nabawi dan mempersaudarakan kaum Muhajirin dengan kaum Anshar."
location: "Madinah"
themes: ["persaudaraan", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Pembangunan Masjid dan Persaudaraan'"
related: ["hijrah-ke-madinah", "piagam-madinah"]
---

Langkah pertama beliau di Madinah adalah membangun **Masjid Nabawi**, pusat ibadah, pendidikan, dan pemerintahan. Beliau turut serta memikul batu bata bersama para sahabat.

Beliau juga mempersaudarakan kaum **Muhajirin** (pendatang dari Makkah) dengan kaum **Anshar** (penolong dari Madinah). Ikatan ini demikian kuat sehingga seorang Anshar rela berbagi harta dengan saudara Muhajirinnya.
```

- [ ] **Step 3: `piagam-madinah.mdx`**

```mdx
---
order: 20
year: "622 M (1 H)"
era: "medina"
title: "Piagam Madinah"
titleAr: "صحيفة المدينة"
summary: "Kesepakatan tertulis yang mengikat seluruh penduduk Madinah dalam satu masyarakat yang damai dan saling melindungi."
location: "Madinah"
themes: ["diplomasi", "kepemimpinan"]
sources:
  - title: "Sirah Nabawiyah Ibnu Hisyam"
    author: "Ibnu Hisyam"
    reference: "Jilid 2, Bab Piagam Madinah"
related: ["masjid-nabawi-dan-persaudaraan", "perang-badar"]
---

Beliau menyusun **Piagam Madinah**, dokumen yang mengatur hubungan antara kaum muslimin, kaum Yahudi, dan penduduk Madinah lainnya. Isinya menetapkan hak dan kewajiban, kebebasan beragama, serta kesepakatan untuk saling membela kota dari serangan luar.

Piagam ini menunjukkan kepemimpinan beliau dalam membangun masyarakat madani yang majemuk dan berkeadilan.
```

- [ ] **Step 4: `perang-badar.mdx`**

```mdx
---
order: 21
year: "624 M (2 H, 17 Ramadan)"
era: "medina"
title: "Perang Badar"
titleAr: "غزوة بدر الكبرى"
summary: "Kemenangan besar kaum muslimin atas Quraisy meski kalah jumlah, sebagai pembeda antara yang benar dan yang batil."
location: "Badar"
themes: ["perang", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Perang Badar Kubra'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Perang Badar"
    link: "https://sunnah.com/bukhari:3951"
related: ["piagam-madinah", "perang-uhud"]
---

Perang Badar terjadi pada tahun kedua Hijriah antara sekitar 313 kaum muslimin melawan sekitar 1000 pasukan Quraisy. Dengan pertolongan Allah, kaum muslimin meraih kemenangan besar.

Dalam perang ini gugur beberapa tokoh Quraisy, dan banyak yang menjadi tawanan. Allah menyebutnya sebagai *Yaumul Furqan* (hari pembeda) dalam surah **Al-Anfal**.
```

- [ ] **Step 5: `perang-uhud.mdx`**

```mdx
---
order: 22
year: "625 M (3 H)"
era: "medina"
title: "Perang Uhud"
titleAr: "غزوة أحد"
summary: "Pelajaran tentang ketaatan; kaum muslimin sempat unggul lalu lengah karena pasukan pemanah meninggalkan posnya."
location: "Gunung Uhud, Madinah"
themes: ["perang", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Perang Uhud'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Perang Uhud"
    link: "https://sunnah.com/bukhari:4043"
related: ["perang-badar", "perang-khandaq"]
---

Pada tahun ketiga Hijriah, Quraisy menyerang untuk membalas kekalahan di Badar. Kaum muslimin bertahan di kaki **Gunung Uhud**. Awalnya mereka unggul, namun pasukan pemanah meninggalkan posisinya untuk mengambil harta rampasan, sehingga musuh menyerang dari belakang.

Dalam perang ini gugur **Hamzah bin Abdul Muthalib**, paman Nabi, dan beliau sendiri terluka. Peristiwa ini menjadi pelajaran besar tentang pentingnya ketaatan kepada pemimpin.
```

- [ ] **Step 6: `perang-khandaq.mdx`**

```mdx
---
order: 23
year: "627 M (5 H)"
era: "medina"
title: "Perang Khandaq (Ahzab)"
titleAr: "غزوة الخندق"
summary: "Kaum muslimin menggali parit atas usul Salman Al-Farisi untuk menghadapi pasukan gabungan musuh."
location: "Madinah"
themes: ["perang", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Perang Khandaq'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Perang Khandaq"
    link: "https://sunnah.com/bukhari:4101"
related: ["perang-uhud", "perjanjian-hudaibiyah"]
---

Pasukan gabungan (Ahzab) dari Quraisy dan sekutunya mengepung Madinah. Atas usul **Salman Al-Farisi**, kaum muslimin menggali **parit (khandaq)** di sisi kota yang terbuka, taktik yang belum dikenal bangsa Arab.

Pengepungan berlangsung berhari-hari. Akhirnya Allah mengirim angin topan dan pasukan yang tidak terlihat, sehingga musuh bercerai-berai. Allah mengabadikan peristiwa ini dalam surah **Al-Ahzab**.
```

- [ ] **Step 7: `perjanjian-hudaibiyah.mdx`**

```mdx
---
order: 24
year: "628 M (6 H, Dzulqa'dah)"
era: "medina"
title: "Perjanjian Hudaibiyah"
titleAr: "صلح الحديبية"
summary: "Perjanjian damai dengan Quraisy yang dianggap merugikan namun ternyata merupakan kemenangan yang nyata."
location: "Hudaibiyah"
themes: ["perjanjian", "diplomasi"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Perjanjian Hudaibiyah'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab asy-Syurut, Bab Perjanjian Hudaibiyah"
    link: "https://sunnah.com/bukhari:2731"
related: ["perang-khandaq", "surat-kepada-para-raja"]
---

Nabi ﷺ bersama sekitar 1400 sahabat berangkat ke Makkah untuk menunaikan umrah, namun dihalangi Quraisy. Setelah perundingan, tercapailah **Perjanjian Hudaibiyah** yang berisi gencatan senjata sepuluh tahun.

Banyak sahabat kecewa karena ketentuan yang tampak merugikan, namun Allah menyebutnya sebagai *fathan mubina* (kemenangan yang nyata) dalam surah **Al-Fath**. Setelahnya, dakwah Islam berkembang pesat.
```

- [ ] **Step 8: `surat-kepada-para-raja.mdx`**

```mdx
---
order: 25
year: "628 M (6–7 H)"
era: "medina"
title: "Surat Dakwah kepada Para Raja"
titleAr: "رسائل إلى الملوك"
summary: "Beliau mengirim surat dakwah kepada Heraklius, Kisra, dan para penguasa lain untuk memeluk Islam."
location: "Madinah"
themes: ["diplomasi", "dakwah"]
sources:
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab Bad' al-Wahyi, Bab Surat kepada Heraklius"
    link: "https://sunnah.com/bukhari:7"
related: ["perjanjian-hudaibiyah", "perang-khaibar"]
---

Setelah Perjanjian Hudaibiyah, beliau mengirim surat dakwah kepada para penguasa, antara lain **Heraklius** (Romawi), **Kisra** (Persia), **Muqawqis** (Mesir), dan **An-Najasyi** (Habasyah).

Sebagian menerima dengan baik, sebagian menolak. Peristiwa ini menandai masuknya dakwah Islam ke panggung dunia internasional.
```

- [ ] **Step 9: `perang-khaibar.mdx`**

```mdx
---
order: 26
year: "628 M (7 H)"
era: "medina"
title: "Perang Khaibar"
titleAr: "غزوة خيبر"
summary: "Benteng Khaibar ditaklukkan; bendera diserahkan kepada Ali bin Abi Thalib."
location: "Khaibar"
themes: ["perang", "penaklukan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Perang Khaibar'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Perang Khaibar"
    link: "https://sunnah.com/bukhari:4210"
related: ["surat-kepada-para-raja", "umrah-qadha"]
---

Kaum muslimin menaklukkan benteng-benteng **Khaibar** yang menjadi sumber kekuatan musuh. Beliau bersabda akan memberikan bendera kepada orang yang mencintai Allah dan Rasul-Nya, lalu bendera itu diserahkan kepada **Ali bin Abi Thalib**.

Khaibar pun ditaklukkan. Setelah perang, beliau menikahi **Shafiyyah binti Huyay**.
```

- [ ] **Step 10: `umrah-qadha.mdx`**

```mdx
---
order: 27
year: "629 M (7 H)"
era: "medina"
title: "Umrah Qadha"
titleAr: "عمرة القضاء"
summary: "Kaum muslimin menunaikan umrah yang tertunda sesuai kesepakatan Hudaibiyah."
location: "Makkah"
themes: ["haji", "perjanjian"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Umrah Qadha'"
related: ["perang-khaibar", "perang-mutah"]
---

Sesuai kesepakatan Hudaibiyah, pada tahun berikutnya kaum muslimin menunaikan **Umrah Qadha** untuk mengganti umrah yang sempat tertunda.

Melihat akhlak dan ketertiban kaum muslimin, banyak penduduk Makkah yang tersentuh dan kemudian memeluk Islam.
```

- [ ] **Step 11: `perang-mutah.mdx`**

```mdx
---
order: 28
year: "629 M (8 H)"
era: "medina"
title: "Perang Mu'tah"
titleAr: "غزوة مؤتة"
summary: "Pertempuran melawan pasukan Romawi; tiga panglima gugur sebelum Khalid bin Walid mengambil alih komando."
location: "Mu'tah, Syam"
themes: ["perang", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Perang Mu'tah'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Perang Mu'tah"
    link: "https://sunnah.com/bukhari:4261"
related: ["umrah-qadha", "fathu-makkah"]
---

Pasukan kaum muslimin bertemu dengan pasukan besar **Romawi** di Mu'tah. Ketiga panglima yang ditunjuk — **Zaid bin Haritsah**, **Ja'far bin Abi Thalib**, dan **Abdullah bin Rawahah** — gugur secara bergantian.

**Khalid bin Walid** kemudian mengambil alih komando dan dengan taktiknya berhasil menarik pasukan kaum muslimin tanpa kerugian besar. Karena itu beliau dijuluki *Saifullah* (Pedang Allah).
```

- [ ] **Step 12: Verify the collection parses**

Run: `npx astro sync && npx astro build`
Expected: exit 0.

- [ ] **Step 13: Commit**

```bash
git add src/content/events/
git commit -m "feat: author medina events"
```

---

## Task 7: Author content — Post-Fath era

**Files:**
- Create: `src/content/events/fathu-makkah.mdx`
- Create: `src/content/events/perang-hunain-dan-thaif.mdx`
- Create: `src/content/events/perang-tabuk.mdx`
- Create: `src/content/events/tahun-delegasi.mdx`
- Create: `src/content/events/haji-wada.mdx`
- Create: `src/content/events/wafatnya-nabi.mdx`

**Interfaces:** Produces MDX files matching Task 4 schema. `related` ids resolve to existing slugs (all prior tasks). This task completes the full event set referenced by earlier `related` fields.

- [ ] **Step 1: `fathu-makkah.mdx`**

```mdx
---
order: 29
year: "630 M (8 H, Ramadan)"
era: "post-fath"
title: "Fathu Makkah"
titleAr: "فتح مكة"
summary: "Pembebasan Makkah tanpa pertumpahan darah; Ka'bah dibersihkan dari berhala."
location: "Makkah"
themes: ["penaklukan", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Fathu Makkah'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Fathu Makkah"
    link: "https://sunnah.com/bukhari:4280"
related: ["perang-mutah", "perang-hunain-dan-thaif"]
---

Setelah Quraisy melanggar Perjanjian Hudaibiyah, beliau berangkat ke Makkah dengan sekitar sepuluh ribu pasukan. Makkah pun dibebaskan hampir tanpa perlawanan.

Beliau membersihkan **Ka'bah** dari berhala, lalu bersabda kepada penduduk Makkah, *"Pergilah, kalian semua bebas."* — pengampunan besar bagi mereka yang dahulu memusuhi beliau.
```

- [ ] **Step 2: `perang-hunain-dan-thaif.mdx`**

```mdx
---
order: 30
year: "630 M (8 H, Syawal)"
era: "post-fath"
title: "Perang Hunain dan Thaif"
titleAr: "غزوة حنين والطائف"
summary: "Kaum muslimin menghadapi kabilah Hawazin dan Tsaqif; sempat terdesak lalu meraih kemenangan."
location: "Hunain dan Thaif"
themes: ["perang", "penaklukan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Perang Hunain'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Perang Hunain"
    link: "https://sunnah.com/bukhari:4321"
related: ["fathu-makkah", "perang-tabuk"]
---

Setelah Fathu Makkah, kabilah **Hawazin** dan **Tsaqif** mengumpulkan pasukan untuk menyerang. Kaum muslimin sempat terdesak dalam perangkap di lembah Hunain, namun beliau menyeru dan menyemangati para sahabat hingga kemenangan diraih.

Pasukan musuh yang tersisa berlindung di benteng **Thaif**, yang kemudian dikepung beberapa waktu sebelum kaum muslimin kembali.
```

- [ ] **Step 3: `perang-tabuk.mdx`**

```mdx
---
order: 31
year: "630 M (9 H)"
era: "post-fath"
title: "Perang Tabuk"
titleAr: "غزوة تبوك"
summary: "Ekspedisi terakhir beliau ke utara untuk menghadapi ancaman Romawi; ujian keimanan di masa sulit."
location: "Tabuk"
themes: ["perang", "kepemimpinan"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Perang Tabuk'"
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Perang Tabuk"
    link: "https://sunnah.com/bukhari:4415"
related: ["perang-hunain-dan-thaif", "tahun-delegasi"]
---

Mendengar persiapan pasukan Romawi, beliau memerintahkan ekspedisi ke **Tabuk** — ekspedisi terakhir beliau — di tengah musim panas yang terik dan masa paceklik. Ini menjadi ujian besar bagi keimanan kaum muslimin.

Tiba di Tabuk, tidak terjadi pertempuran. Namun ekspedisi ini memperkuat wibawa Islam di jazirah Arab utara.
```

- [ ] **Step 4: `tahun-delegasi.mdx`**

```mdx
---
order: 32
year: "630–631 M (9–10 H)"
era: "post-fath"
title: "Tahun Delegasi (Amul Wufud)"
titleAr: "عام الوفود"
summary: "Berbagai kabilah dari seluruh jazirah Arab berdatangan menyatakan masuk Islam."
location: "Madinah"
themes: ["diplomasi", "dakwah"]
sources:
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Tahun Delegasi'"
related: ["perang-tabuk", "haji-wada"]
---

Setelah Fathu Makkah dan Perang Tabuk, delegasi dari berbagai kabilah di jazirah Arab berdatangan ke Madinah untuk menyatakan keislaman. Tahun ini dikenal sebagai **Amul Wufud** (Tahun Delegasi).

Mereka mempelajari Islam langsung dari Nabi ﷺ, dan diutus para sahabat sebagai guru ke daerah-daerah. Islam pun tersebar ke seluruh jazirah Arab.
```

- [ ] **Step 5: `haji-wada.mdx`**

```mdx
---
order: 33
year: "632 M (10 H, Dzulhijjah)"
era: "post-fath"
title: "Haji Wada' (Haji Perpisahan)"
titleAr: "حجة الوداع"
summary: "Haji satu-satunya yang beliau tunaikan; turun ayat penyempurnaan agama dan khutbah yang agung di Arafah."
location: "Makkah dan Arafah"
themes: ["haji", "kepemimpinan"]
sources:
  - title: "Sahih Muslim"
    author: "Imam Muslim"
    reference: "Kitab al-Hajj, Hadis tentang Haji Wada'"
    link: "https://sunnah.com/muslim:1218"
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Haji Wada''"
related: ["tahun-delegasi", "wafatnya-nabi"]
---

Pada tahun kesepuluh Hijriah, beliau menunaikan haji yang kemudian dikenal sebagai **Haji Wada'**. Di padang Arafah, beliau menyampaikan khutbah agung tentang hak-hak asasi, persaudaraan, dan ketakwaan.

Dalam haji ini turun ayat, *"Pada hari ini telah Kusempurnakan untukmu agamamu..."* (Al-Ma'idah: 3), pertanda tugas kenabian telah sempurna.
```

- [ ] **Step 6: `wafatnya-nabi.mdx`**

```mdx
---
order: 34
year: "632 M (11 H, 12 Rabiul Awal)"
era: "post-fath"
title: "Wafatnya Nabi Muhammad ﷺ"
titleAr: "وفاة النبي ﷺ"
summary: "Beliau wafat di Madinah pada usia 63 tahun, meninggalkan Al-Qur'an dan Sunnah sebagai pedoman."
location: "Madinah"
themes: ["keluarga", "kepemimpinan"]
sources:
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Kitab al-Maghazi, Bab Maradh an-Nabi ﷺ dan Wafatnya"
    link: "https://sunnah.com/bukhari:4448"
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Wafatnya Nabi'"
related: ["haji-wada"]
---

Setelah Haji Wada', kesehatan beliau menurun. Beliau wafat pada hari Senin, **12 Rabiul Awal tahun 11 H**, di kamar **Aisyah**, pada usia 63 tahun, dan dimakamkan di tempat beliau wafat di Madinah.

Wafatnya beliau meninggalkan duka mendalam bagi para sahabat. **Abu Bakar** meneguhkan mereka: *"Barangsiapa menyembah Muhammad, maka Muhammad telah wafat. Barangsiapa menyembah Allah, maka Allah Maha Hidup dan tidak akan mati."*
```

- [ ] **Step 7: Verify the full collection parses**

Run: `npx astro sync && npx astro build`
Expected: exit 0. All 34 events validate; every `related` id resolves to an existing slug (a dangling id would surface as broken link only at render, so also confirm all `related` values match created filenames).

- [ ] **Step 8: Commit**

```bash
git add src/content/events/
git commit -m "feat: author post-fath events"
```

---

## Task 8: Timeline page

**Files:**
- Create: `src/components/Arabic.astro`
- Create: `src/components/EventCard.astro`
- Create: `src/components/EraSection.astro`
- Create: `src/components/JumpNav.astro`
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection("events")`, `sortChronological`/`groupByEra` from `src/lib/events.ts`, `getEra`/`ERAS` from `src/lib/eras.ts`.
- Produces: `/` page rendering the era-grouped timeline; `EventCard` exposes `data-event`, `data-era`, `data-themes`, `data-search` attributes for Task 10.

- [ ] **Step 1: Write `src/components/Arabic.astro`**

```astro
---
const { text } = Astro.props as { text: string };
---
<span lang="ar" dir="rtl" class="arabic">{text}</span>
```

- [ ] **Step 2: Write `src/components/EventCard.astro`**

```astro
---
import Arabic from "./Arabic.astro";
import ThemeChips from "./ThemeChips.astro";

interface Props {
  id: string;
  year: string;
  title: string;
  titleAr: string;
  summary: string;
  themes: string[];
  era: string;
  searchText: string;
}

const { id, year, title, titleAr, summary, themes, era, searchText } = Astro.props;
---

<article
  class="event-card"
  data-event
  data-era={era}
  data-themes={JSON.stringify(themes)}
  data-search={searchText}
>
  <a href={`/events/${id}/`} class="event-card__link">
    <span class="event-card__year">{year}</span>
    <h3 class="event-card__title">{title}</h3>
    <span class="event-card__title-ar"><Arabic text={titleAr} /></span>
    <p class="event-card__summary">{summary}</p>
    <ThemeChips themes={themes} />
  </a>
</article>

<style>
  .event-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    transition: box-shadow 0.15s ease;
  }
  .event-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  .event-card__link { color: inherit; display: block; }
  .event-card__link:hover { text-decoration: none; }
  .event-card__year {
    display: inline-block;
    font-size: 0.8rem;
    color: #fff;
    background: var(--era-color, var(--accent));
    border-radius: 999px;
    padding: 0.1rem 0.6rem;
    margin-bottom: 0.5rem;
  }
  .event-card__title { margin: 0; font-size: 1.1rem; }
  .event-card__title-ar { display: block; color: var(--muted); margin: 0.1rem 0 0.4rem; }
  .event-card__summary { margin: 0 0 0.75rem; color: var(--muted); font-size: 0.95rem; }
  .event-card[hidden] { display: none; }
</style>
```

- [ ] **Step 3: Write `src/components/ThemeChips.astro`**

```astro
---
interface Props {
  themes: string[];
}

const { themes } = Astro.props;
const labels: Record<string, string> = {
  kelahiran: "Kelahiran",
  keluarga: "Keluarga",
  wahyu: "Wahyu",
  dakwah: "Dakwah",
  hijrah: "Hijrah",
  perang: "Perang",
  perjanjian: "Perjanjian",
  diplomasi: "Diplomasi",
  penaklukan: "Penaklukan",
  haji: "Haji",
  kepemimpinan: "Kepemimpinan",
  pemboikotan: "Pemboikotan",
  "isra-miraj": "Isra' Mi'raj",
  persaudaraan: "Persaudaraan",
  "masa-kecil": "Masa Kecil",
  "masa-muda": "Masa Muda",
};
---

<div class="theme-chips">
  {themes.map((t) => <span class="chip">{labels[t] ?? t}</span>)}
</div>

<style>
  .theme-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .chip {
    font-size: 0.75rem;
    background: #f0ebe1;
    color: var(--muted);
    border-radius: 999px;
    padding: 0.1rem 0.55rem;
  }
</style>
```

- [ ] **Step 4: Write `src/components/EraSection.astro`**

```astro
---
import type { Era } from "../lib/eras";
import type { EventData } from "../lib/events";
import EventCard from "./EventCard.astro";
import Arabic from "./Arabic.astro";

interface Props {
  era: Era;
  events: EventData[];
}

const { era, events } = Astro.props;
---

<section class="era" id={`era-${era.id}`} data-era-section={`era-${era.id}`} style={`--era-color: ${era.color}`}>
  <header class="era__header">
    <span class="era__ar"><Arabic text={era.labelAr} /></span>
    <h2 class="era__label">{era.label}</h2>
    <p class="era__desc">{era.description}</p>
  </header>
  <div class="era__timeline">
    {events.map((e) => <EventCard {...e} />)}
  </div>
</section>

<style>
  .era { margin: 2.5rem 0; }
  .era__header {
    border-left: 4px solid var(--era-color);
    padding-left: 1rem;
    margin-bottom: 1.25rem;
  }
  .era__ar { display: block; color: var(--era-color); font-size: 1.4rem; }
  .era__label { margin: 0.2rem 0; }
  .era__desc { margin: 0; color: var(--muted); font-size: 0.95rem; }
  .era__timeline {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    border-left: 2px solid var(--border);
    padding-left: 1.5rem;
    margin-left: 0.4rem;
  }
  @media (min-width: 720px) {
    .era__timeline { grid-template-columns: 1fr 1fr; }
  }
  .era__timeline:empty::after {
    content: "Tidak ada peristiwa yang cocok dengan filter.";
    color: var(--muted);
    font-style: italic;
  }
</style>
```

- [ ] **Step 5: Write `src/components/JumpNav.astro`**

```astro
---
import { ERAS } from "../lib/eras";
---

<nav class="jump-nav">
  <span class="jump-nav__label">Lompat ke:</span>
  {ERAS.map((era) => (
    <a href={`#era-${era.id}`} class="jump-nav__link" style={`--era-color: ${era.color}`}>
      {era.label}
    </a>
  ))}
</nav>

<style>
  .jump-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    background: var(--bg);
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border);
  }
  .jump-nav__label { color: var(--muted); align-self: center; font-size: 0.85rem; }
  .jump-nav__link {
    font-size: 0.85rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.15rem 0.7rem;
    color: var(--text);
  }
  .jump-nav__link:hover { background: var(--era-color); color: #fff; text-decoration: none; }
</style>
```

- [ ] **Step 6: Write `src/pages/index.astro`**

```astro
---
import Base from "../layouts/Base.astro";
import JumpNav from "../components/JumpNav.astro";
import EraSection from "../components/EraSection.astro";
import { getCollection } from "astro:content";
import { sortChronological, groupByEra, toEventData } from "../lib/events";

const events = await getCollection("events");
const sorted = sortChronological(events.map(toEventData));
const groups = groupByEra(sorted);
---

<Base title="Sirah Nabawiyah — Garis Waktu Kehidupan Nabi ﷺ" description="Garis waktu interaktif perjalanan hidup Nabi Muhammad ﷺ.">
  <main class="page">
    <h1 class="page__title">Sirah Nabawiyah</h1>
    <p class="page__subtitle">Garis waktu kehidupan Nabi Muhammad ﷺ</p>
    <JumpNav />
    <div class="timeline">
      {groups.map((g) => (
        <EraSection era={g.era} events={g.items} />
      ))}
    </div>
  </main>
</Base>

<style>
  .page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1.25rem 4rem; }
  .page__title { margin: 1rem 0 0; }
  .page__subtitle { margin: 0 0 1rem; color: var(--muted); }
</style>
```

- [ ] **Step 7: Build and verify**

Run: `npx astro build`
Expected: exit 0. Inspect `dist/index.html` — it contains the era section headers ("Masa Jahiliyyah", "Periode Makkah", "Periode Madinah", "Pasca Fathu Makkah") and event titles.

- [ ] **Step 8: Commit**

```bash
git add src/components src/pages/index.astro
git commit -m "feat: add timeline page"
```

---

## Task 9: Event detail page

**Files:**
- Create: `src/components/SourceList.astro`
- Create: `src/pages/events/[slug].astro`

**Interfaces:**
- Consumes: `getCollection("events")`, `render` from `astro:content`, `sortChronological` from `src/lib/events.ts`.
- Produces: `/events/[slug]/` page rendering full body, sources, related events, prev/next navigation.

- [ ] **Step 1: Write `src/components/SourceList.astro`**

```astro
---
interface Source {
  title: string;
  author: string;
  reference: string;
  link?: string;
}

interface Props {
  sources: Source[];
}

const { sources } = Astro.props;
---

<section class="sources">
  <h2>Sumber / Referensi</h2>
  <ul>
    {sources.map((s) => (
      <li>
        {s.link ? (
          <a href={s.link} target="_blank" rel="noopener noreferrer">{s.title}</a>
        ) : (
          <span>{s.title}</span>
        )}{" "}
        — {s.author}, <em>{s.reference}</em>
      </li>
    ))}
  </ul>
</section>

<style>
  .sources { margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1rem; }
  .sources h2 { font-size: 1.1rem; }
  .sources ul { padding-left: 1.2rem; color: var(--muted); }
  .sources li { margin-bottom: 0.5rem; }
</style>
```

- [ ] **Step 2: Write `src/pages/events/[slug].astro`**

```astro
---
import Base from "../../layouts/Base.astro";
import Arabic from "../../components/Arabic.astro";
import SourceList from "../../components/SourceList.astro";
import ThemeChips from "../../components/ThemeChips.astro";
import { getCollection, render } from "astro:content";
import { sortChronological, toEventData } from "../../lib/events";
import { getEra } from "../../lib/eras";

export async function getStaticPaths() {
  const events = await getCollection("events");
  return events.map((e) => ({ params: { slug: e.id }, props: { entry: e } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);

const all = sortChronological((await getCollection("events")).map(toEventData));
const index = all.findIndex((e) => e.id === entry.id);
const prev = index > 0 ? all[index - 1] : undefined;
const next = index < all.length - 1 ? all[index + 1] : undefined;
const era = getEra(entry.data.era);
const related = (entry.data.related ?? [])
  .map((id) => all.find((e) => e.id === id))
  .filter((e): e is NonNullable<typeof e> => Boolean(e));
---

<Base title={`${entry.data.title} — Sirah Nabawiyah`} description={entry.data.summary}>
  <main class="detail">
    <a href="/" class="detail__back">← Kembali ke garis waktu</a>
    <article class="detail__article">
      <header class="detail__header" style={`--era-color: ${era.color}`}>
        <span class="detail__era">{era.label}</span>
        <span class="detail__year">{entry.data.year}</span>
        <h1 class="detail__title">{entry.data.title}</h1>
        <span class="detail__title-ar"><Arabic text={entry.data.titleAr} /></span>
        {entry.data.location && <p class="detail__location">Lokasi: {entry.data.location}</p>}
        <ThemeChips themes={entry.data.themes} />
      </header>

      <div class="detail__body">
        <Content />
      </div>

      <SourceList sources={entry.data.sources} />
    </article>

    {related.length > 0 && (
      <nav class="related">
        <h2>Peristiwa terkait</h2>
        <ul>
          {related.map((r) => (
            <li><a href={`/events/${r.id}/`}>{r.title}</a></li>
          ))}
        </ul>
      </nav>
    )}

    <nav class="pager">
      {prev ? <a href={`/events/${prev.id}/`}>← {prev.title}</a> : <span />}
      {next ? <a href={`/events/${next.id}/`}>{next.title} →</a> : <span />}
    </nav>
  </main>
</Base>

<style>
  .detail { max-width: 760px; margin: 0 auto; padding: 1.5rem 1.25rem 4rem; }
  .detail__back { font-size: 0.9rem; }
  .detail__header { border-left: 4px solid var(--era-color); padding-left: 1rem; margin: 1.25rem 0; }
  .detail__era { color: var(--era-color); font-size: 0.85rem; font-weight: 600; }
  .detail__year { display: block; color: var(--muted); font-size: 0.9rem; margin-top: 0.2rem; }
  .detail__title { margin: 0.3rem 0; }
  .detail__title-ar { display: block; color: var(--muted); font-size: 1.5rem; margin-bottom: 0.5rem; }
  .detail__location { color: var(--muted); font-size: 0.9rem; margin: 0.25rem 0 0.75rem; }
  .detail__body { font-size: 1.05rem; }
  .detail__body :global(.arabic) { font-size: 1.2em; }
  .related, .pager { margin-top: 2rem; }
  .pager { display: flex; justify-content: space-between; gap: 1rem; }
</style>
```

- [ ] **Step 3: Build and verify**

Run: `npx astro build`
Expected: exit 0. Inspect `dist/events/kelahiran-nabi/index.html` — contains the full body prose, the "Sumber / Referensi" list, and prev/next links.

- [ ] **Step 4: Commit**

```bash
git add src/components/SourceList.astro src/pages/events
git commit -m "feat: add event detail page"
```

---

## Task 10: Client-side search & filter

**Files:**
- Create: `src/components/SearchFilter.astro`
- Modify: `src/pages/index.astro` (render `<SearchFilter />` between the subtitle and `<JumpNav />`)

**Interfaces:**
- Consumes: `matchesFilter` from `src/lib/events.ts`, `ERAS` from `src/lib/eras.ts`.
- Produces: client-side search box + era/theme chips that toggle `hidden` on `.event-card[data-event]` elements and dim empty era sections, plus a live results counter.

- [ ] **Step 1: Write `src/components/SearchFilter.astro`**

```astro
---
import { ERAS } from "../lib/eras";

const themes: Array<{ id: string; label: string }> = [
  { id: "kelahiran", label: "Kelahiran" },
  { id: "keluarga", label: "Keluarga" },
  { id: "wahyu", label: "Wahyu" },
  { id: "dakwah", label: "Dakwah" },
  { id: "hijrah", label: "Hijrah" },
  { id: "perang", label: "Perang" },
  { id: "perjanjian", label: "Perjanjian" },
  { id: "diplomasi", label: "Diplomasi" },
  { id: "penaklukan", label: "Penaklukan" },
  { id: "haji", label: "Haji" },
  { id: "kepemimpinan", label: "Kepemimpinan" },
  { id: "pemboikotan", label: "Pemboikotan" },
  { id: "isra-miraj", label: "Isra' Mi'raj" },
  { id: "persaudaraan", label: "Persaudaraan" },
  { id: "masa-kecil", label: "Masa Kecil" },
  { id: "masa-muda", label: "Masa Muda" },
];
---

<div class="filter">
  <input
    type="search"
    id="search-input"
    class="filter__search"
    placeholder="Cari peristiwa…"
    aria-label="Cari peristiwa"
  />

  <fieldset class="filter__group">
    <legend>Periode</legend>
    {ERAS.map((era) => (
      <label class="filter__chip">
        <input type="checkbox" value={era.id} data-era-filter /> {era.label}
      </label>
    ))}
  </fieldset>

  <fieldset class="filter__group">
    <legend>Tema</legend>
    {themes.map((t) => (
      <label class="filter__chip">
        <input type="checkbox" value={t.id} data-theme-filter /> {t.label}
      </label>
    ))}
  </fieldset>

  <p class="filter__count" id="result-count" aria-live="polite"></p>
</div>

<style>
  .filter { margin: 1rem 0 1.5rem; }
  .filter__search {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 1rem;
  }
  .filter__group { border: none; padding: 0; margin: 0.75rem 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .filter__group legend { color: var(--muted); font-size: 0.8rem; margin-bottom: 0.35rem; width: 100%; }
  .filter__chip {
    font-size: 0.8rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.15rem 0.6rem;
    cursor: pointer;
  }
  .filter__chip input { display: none; }
  .filter__chip:has(input:checked) { background: var(--accent); color: #fff; border-color: var(--accent); }
  .filter__count { color: var(--muted); font-size: 0.85rem; margin: 0.5rem 0 0; }
</style>

<script>
  import { matchesFilter } from "../lib/events";
  import type { EraId } from "../lib/eras";

  const input = document.getElementById("search-input") as HTMLInputElement;
  const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-event]"));
  const count = document.getElementById("result-count")!;

  function readFilters() {
    const eras = Array.from(
      document.querySelectorAll<HTMLInputElement>("[data-era-filter]:checked"),
    ).map((el) => el.value as EraId);
    const themes = Array.from(
      document.querySelectorAll<HTMLInputElement>("[data-theme-filter]:checked"),
    ).map((el) => el.value);
    return { query: input.value, eras, themes };
  }

  function apply() {
    const filters = readFilters();
    let visible = 0;
    for (const card of cards) {
      const item = {
        era: card.dataset.era as EraId,
        themes: JSON.parse(card.dataset.themes ?? "[]") as string[],
        searchText: card.dataset.search ?? "",
      };
      const show = matchesFilter(item, filters);
      card.hidden = !show;
      if (show) visible++;
    }

    for (const section of document.querySelectorAll<HTMLElement>("[data-era-section]")) {
      const anyVisible = section.querySelectorAll("[data-event]:not([hidden])").length > 0;
      section.style.opacity = anyVisible ? "1" : "0.35";
    }

    count.textContent = `${visible} dari ${cards.length} peristiwa`;
  }

  input.addEventListener("input", apply);
  document.querySelectorAll<HTMLInputElement>("[data-era-filter], [data-theme-filter]").forEach((el) => {
    el.addEventListener("change", apply);
  });
  apply();
</script>
```

- [ ] **Step 2: Modify `src/pages/index.astro`**

Add the import and render the component. Replace the subtitle block:

```astro
import SearchFilter from "../components/SearchFilter.astro";
```

and after the subtitle line `<p class="page__subtitle">…</p>` add:

```astro
<SearchFilter />
```

- [ ] **Step 3: Build and verify**

Run: `npx astro build`
Expected: exit 0.

- [ ] **Step 4: Manual check (dev server)**

Run: `npm run dev`, open the printed localhost URL. Verify:
- Typing in search filters the cards live and updates the count.
- Selecting era/theme chips hides non-matching cards; empty sections dim.
- Arabic titles render right-to-left correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/SearchFilter.astro src/pages/index.astro
git commit -m "feat: add client-side search and filter"
```

---

## Task 11: Final validation & README

**Files:**
- Create: `README.md`

**Interfaces:** None. Closes out the plan.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all Vitest tests pass (eras + events, 11 tests).

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: exit 0, `dist/` generated with `index.html` and all 34 event pages.

- [ ] **Step 3: Write `README.md`**

```markdown
# Sirah Nabawiyah — Garis Waktu Kehidupan Nabi ﷺ

Situs web statis untuk menelusuri kehidupan Nabi Muhammad ﷺ melalui
garis waktu interaktif, dalam Bahasa Indonesia.

## Menjalankan

```bash
npm install
npm run dev      # server pengembangan
npm test         # unit test (Vitest)
npm run build    # produksi (hasil di dist/)
```

## Struktur Konten

Setiap peristiwa adalah satu file MDX di `src/content/events/`.
Frontmatter berisi metadata (era, tema, tahun, sumber), sedangkan isi
cerita ditulis dalam format Markdown (mendukung teks Arab).

Era: `jahiliyyah`, `mecca`, `medina`, `post-fath`.
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```

---

# Phase 2 — Content Enrichment (added 2026-09-13)

The spec now requires full-depth content (dialogues, Quranic verses, hadith,
with citations) plus a `lessons` ("what we can learn from it") list per event.
Tasks 12–16 implement this. They supersede the old Task 11 (final validation +
README), which is now Task 16.

## Content Enrichment Standard (applies to Tasks 13–15)

Each event MDX file is REWRITTEN to include:

1. **Detailed narrative** in Indonesian (3–6 substantial paragraphs, not a
   summary) that tells the story fully, including **dialogues/conversations**
   written as quoted speech (e.g. “Iqra'!” — “Aku tidak bisa membaca.”).
2. **Quranic verses** where relevant, using the `<Verse>` component, always
   with `surah`/`ayah` (and `ayahEnd` for ranges) so the audio plays:
   `<Verse arabic="…" translation="…" source="QS. Asy-Syu'ara: 214" surah={26} ayah={214} />`.
3. **Hadith** where relevant, using the `<Hadith>` component:
   `<Hadith arabic="…" translation="…" source="HR. Al-Bukhari no. 3" link="https://sunnah.com/bukhari:3" />`.
4. **`lessons`** in frontmatter: 3–5 strings, each a self-contained
   "what we can learn from it" statement, grounded in the cited sources
   (no free-form opinion).
5. **`sources`** retained/expanded (1–3 entries), with precise references.

**Accuracy rules (mandatory):**
- Verses must be authentic with correct `QS. <surah>:<ayat>` references.
- Hadith must be authentic (Sahih al-Bukhari / Sahih Muslim preferred) with
  correct perawi + number and a `sunnah.com` link where possible.
- Do NOT invent or approximate citations. If unsure of an exact hadith
  number, cite the kitab/chapter instead (e.g. "HR. Al-Bukhari, Kitab
  Bad' al-Wahyi").
- Source base: Ar-Raheeq Al-Makhtum (Syaikh Shafiyyurrahman Al-Mubarakfuri),
  Sirah Nabawiyah Ibnu Hisyam, Sahih al-Bukhari/Muslim via sunnah.com.
- Tone: Indonesian, respectful; write "ﷺ" after the Prophet's name;
  capitalize "Beliau".

**MDX layout per file:**
```mdx
---
order: 7
year: "610 M (Ramadan)"
era: "mecca"
title: "Wahyu Pertama di Gua Hira"
titleAr: "أول الوحي في غار حراء"
summary: "…"
location: "Gua Hira, Makkah"
themes: ["wahyu", "dakwah"]
sources:
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Hadis no. 3 (Bab Permulaan Wahyu)"
    link: "https://sunnah.com/bukhari:3"
  - title: "Ar-Raheeq Al-Makhtum (Sirah Nabawiyah)"
    author: "Syaikh Shafiyyurrahman Al-Mubarakfuri"
    reference: "Bab 'Di Gua Hira'"
lessons:
  - "…"
  - "…"
  - "…"
related: ["…"]
---
import Verse from "../../components/Verse.astro";
import Hadith from "../../components/Hadith.astro";

<narrative paragraphs…>

<Verse arabic="…" translation="…" source="QS. …" surah={…} ayah={…} />

<Hadith arabic="…" translation="…" source="HR. …" link="…" />
```

## Task 12: Lessons field, Verse/Hadith components, detail-page lessons

**Files:**
- Modify: `src/content/config.ts` (add `lessons`)
- Create: `src/lib/audio.ts`
- Test: `src/lib/audio.test.ts`
- Create: `src/components/Verse.astro`
- Create: `src/components/Hadith.astro`
- Modify: `src/layouts/Base.astro` (global audio player script)
- Modify: `src/pages/events/[slug].astro` (render lessons section)

**Interfaces:**
- Produces: `Verse` and `Hadith` MDX components; `lessons` schema field;
  `ayahsAudioUrls(surah, ayah, ayahEnd?, reciter?)` in `src/lib/audio.ts`.
  Consumed by content tasks 13–15 and the detail page.

**Audio source:** Quranic verse audio is served from the public, free
`everyayah.com` per-ayah MP3 files. URL pattern:
`https://everyayah.com/data/{reciter}/{surah:03d}{ayah:03d}.mp3` (e.g.
`https://everyayah.com/data/Alafasy_128kbps/001001.mp3`). Default reciter
`Alafasy_128kbps` (Mishary Rashid Alafasy).

- [ ] **Step 1: Add `lessons` to the schema (temporarily optional)**

In `src/content/config.ts`, add after the `related` line:
```ts
      lessons: z.array(z.string()).optional(),
```
(Optional here so the existing 34 files still validate; Task 16 flips it to
`.min(1)` to enforce completeness once all content is enriched.)

- [ ] **Step 2: Write `src/lib/audio.ts` + test (TDD)**

Test first (`src/lib/audio.test.ts`):
```ts
import { describe, it, expect } from "vitest";
import { ayahsAudioUrls } from "./audio";

describe("ayahsAudioUrls", () => {
  it("builds a single-ayah URL with zero padding", () => {
    expect(ayahsAudioUrls(1, 1)).toEqual(["https://everyayah.com/data/Alafasy_128kbps/001001.mp3"]);
  });
  it("builds a range of ayah URLs", () => {
    expect(ayahsAudioUrls(96, 1, 5)).toEqual([
      "https://everyayah.com/data/Alafasy_128kbps/096001.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/096002.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/096003.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/096004.mp3",
      "https://everyayah.com/data/Alafasy_128kbps/096005.mp3",
    ]);
  });
  it("honors a custom reciter", () => {
    expect(ayahsAudioUrls(1, 1, 1, "Husary_128kbps")[0]).toContain("Husary_128kbps");
  });
});
```

Implementation (`src/lib/audio.ts`):
```ts
export const DEFAULT_RECITER = "Alafasy_128kbps";

const pad = (n: number) => String(n).padStart(3, "0");

export function ayahsAudioUrls(
  surah: number,
  ayah: number,
  ayahEnd?: number,
  reciter: string = DEFAULT_RECITER,
): string[] {
  const end = ayahEnd ?? ayah;
  const urls: string[] = [];
  for (let a = ayah; a <= end; a++) {
    urls.push(`https://everyayah.com/data/${reciter}/${pad(surah)}${pad(a)}.mp3`);
  }
  return urls;
}
```

Run `npx vitest run src/lib/audio.test.ts` (expect fail then pass).

- [ ] **Step 3: Write `src/components/Verse.astro` (with audio)**

```astro
---
import { ayahsAudioUrls } from "../lib/audio";

interface Props {
  arabic: string;
  translation: string;
  source: string;
  surah?: number;
  ayah?: number;
  ayahEnd?: number;
}
const { arabic, translation, source, surah, ayah, ayahEnd } = Astro.props;
const hasAudio = typeof surah === "number" && typeof ayah === "number";
const urls = hasAudio ? ayahsAudioUrls(surah!, ayah!, ayahEnd) : [];
---
<figure class="verse">
  <blockquote lang="ar" dir="rtl" class="verse__arabic">{arabic}</blockquote>
  <figcaption class="verse__translation">“{translation}”</figcaption>
  <cite class="verse__source">{source}</cite>
  {hasAudio && (
    <button class="verse__play" type="button" data-play-audio={JSON.stringify(urls)} aria-label="Dengarkan ayat">
      ▶️ Dengarkan
    </button>
  )}
</figure>

<style>
  .verse {
    margin: 1.5rem 0;
    padding: 1rem 1.25rem;
    background: #f4efe6;
    border-left: 3px solid var(--accent);
    border-radius: var(--radius);
  }
  .verse__arabic { margin: 0; font-size: 1.5rem; line-height: 1.9; color: #3a3328; }
  .verse__translation { margin: 0.5rem 0 0; font-style: italic; color: var(--muted); }
  .verse__source { display: block; margin-top: 0.4rem; font-size: 0.85rem; color: var(--muted); font-style: normal; }
  .verse__play {
    margin-top: 0.6rem;
    font-family: var(--font-display);
    font-size: 0.9rem;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    cursor: pointer;
  }
  .verse__play.is-playing { background: var(--secondary); }
</style>
```

- [ ] **Step 4: Write `src/components/Hadith.astro`**

```astro
---
interface Props {
  arabic: string;
  translation: string;
  source: string;
  link?: string;
}
const { arabic, translation, source, link } = Astro.props;
---
<figure class="hadith">
  <blockquote lang="ar" dir="rtl" class="hadith__arabic">{arabic}</blockquote>
  <figcaption class="hadith__translation">“{translation}”</figcaption>
  <cite class="hadith__source">
    {link ? <a href={link} target="_blank" rel="noopener noreferrer">{source}</a> : source}
  </cite>
</figure>

<style>
  .hadith {
    margin: 1.5rem 0;
    padding: 1rem 1.25rem;
    background: #eef4f0;
    border-left: 3px solid #2d8a4e;
    border-radius: var(--radius);
  }
  .hadith__arabic { margin: 0; font-size: 1.4rem; line-height: 1.9; color: #2b2722; }
  .hadith__translation { margin: 0.5rem 0 0; font-style: italic; color: var(--muted); }
  .hadith__source { display: block; margin-top: 0.4rem; font-size: 0.85rem; color: var(--muted); font-style: normal; }
</style>
```

- [ ] **Step 5: Add the global audio player script to `src/layouts/Base.astro`**

Add before `</body>` (alongside the reveal script):
```astro
<script>
  let current: HTMLAudioElement | null = null;
  let currentBtn: HTMLButtonElement | null = null;
  document.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-play-audio]");
    if (!btn) return;
    e.preventDefault();
    if (current && currentBtn === btn) {
      current.pause();
      current = null;
      currentBtn?.classList.remove("is-playing");
      currentBtn = null;
      return;
    }
    current?.pause();
    currentBtn?.classList.remove("is-playing");
    const urls: string[] = JSON.parse(btn.dataset.playAudio ?? "[]");
    if (urls.length === 0) return;
    const play = (i: number) => {
      if (i >= urls.length) { currentBtn?.classList.remove("is-playing"); current = null; currentBtn = null; return; }
      current = new Audio(urls[i]);
      current.onended = () => play(i + 1);
      current.play();
    };
    currentBtn = btn;
    btn.classList.add("is-playing");
    play(0);
  });
</script>
```

- [ ] **Step 6: Render lessons on the detail page**

In `src/pages/events/[slug].astro`, insert after the `<div class="detail__body">…</div>` block and before `<SourceList … />`:

```astro
      {entry.data.lessons && entry.data.lessons.length > 0 && (
        <section class="lessons">
          <h2>Pelajaran / Hikmah</h2>
          <ol>
            {entry.data.lessons.map((l) => <li>{l}</li>)}
          </ol>
        </section>
      )}
```

And add scoped style:
```css
  .lessons { margin-top: 2rem; }
  .lessons h2 { font-size: 1.1rem; }
  .lessons ol { padding-left: 1.2rem; color: var(--muted); }
  .lessons li { margin-bottom: 0.5rem; }
```

- [ ] **Step 7: Verify build**

Run: `npx astro build`
Expected: exit 0 (existing 34 files still validate with optional `lessons`).

- [ ] **Step 8: Commit**

```bash
git add src/content/config.ts src/lib/audio.ts src/lib/audio.test.ts src/components/Verse.astro src/components/Hadith.astro src/layouts/Base.astro src/pages/events/[slug].astro
git commit -m "feat: add lessons field, verse/hadith components, and verse audio"
```

## Task 13: Enrich Jahiliyyah & Mecca events

**Files:** Modify all 17 files in `src/content/events/` with era `jahiliyyah`
or `mecca` (orders 1–17): `kelahiran-nabi`, `yatim-di-pengasuhan`,
`perjalanan-ke-syam`, `perang-fijar-hilf-al-fudul`, `pernikahan-khadijah`,
`peletakan-hajar-aswad`, `wahyu-pertama`, `dakwah-sembunyi`,
`dakwah-terang-terangan`, `penindasan-quraisy`, `hijrah-ke-habasyah`,
`islamnya-hamzah-dan-umar`, `pemboikotan-bani-hasyim`, `tahun-kesedihan`,
`isra-miraj`, `baiat-aqabah-pertama`, `baiat-aqabah-kedua`.

**Interfaces:** Follows the Content Enrichment Standard above. Uses `Verse`
and `Hadith` components. Adds `lessons` to frontmatter.

- [ ] **Step 1: Rewrite all 17 files** per the standard (detailed narrative
  + dialogues + verses + hadith + lessons + sources).
- [ ] **Step 2: Verify** — `npx astro sync && npx astro build` (exit 0).
- [ ] **Step 3: Commit** — `git add src/content/events/ && git commit -m "feat: enrich jahiliyyah and mecca events"`

## Task 14: Enrich Medina events

**Files:** Modify all 11 files with era `medina` (orders 18–28):
`hijrah-ke-madinah`, `masjid-nabawi-dan-persaudaraan`, `piagam-madinah`,
`perang-badar`, `perang-uhud`, `perang-khandaq`, `perjanjian-hudaibiyah`,
`surat-kepada-para-raja`, `perang-khaibar`, `umrah-qadha`, `perang-mutah`.

- [ ] **Step 1: Rewrite all 11 files** per the standard.
- [ ] **Step 2: Verify** — `npx astro sync && npx astro build` (exit 0).
- [ ] **Step 3: Commit** — `git add src/content/events/ && git commit -m "feat: enrich medina events"`

## Task 15: Enrich Post-Fath events

**Files:** Modify all 6 files with era `post-fath` (orders 29–34):
`fathu-makkah`, `perang-hunain-dan-thaif`, `perang-tabuk`, `tahun-delegasi`,
`haji-wada`, `wafatnya-nabi`.

- [ ] **Step 1: Rewrite all 6 files** per the standard.
- [ ] **Step 2: Verify** — `npx astro sync && npx astro build` (exit 0).
- [ ] **Step 3: Commit** — `git add src/content/events/ && git commit -m "feat: enrich post-fath events"`

## Task 16: Enforce lessons, final validation & README

**Files:**
- Modify: `src/content/config.ts` (flip `lessons` to required)
- Modify: `README.md` (document lessons + verse/hadith components)

- [ ] **Step 1: Make `lessons` required**

In `src/content/config.ts`, change:
```ts
      lessons: z.array(z.string()).optional(),
```
to:
```ts
      lessons: z.array(z.string()).min(1),
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all Vitest tests pass.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: exit 0; if any event is missing `lessons`, the build fails — add
the missing `lessons` and re-run.

- [ ] **Step 4: Update `README.md`** to mention the `lessons` frontmatter
  field and the `Verse`/`Hadith` MDX components.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: enforce lessons and finalize docs"
```

---

# Phase 3 — Game-like UI, Gamification, PWA (added 2026-09-13)

Execution order: Task 17 (design) → Task 12 (content structure) → Task 18–19
(gamification) → Task 20 (PWA) → Tasks 13–15 (content enrichment) → Task 16
(final). The design tokens below are the source of truth; existing components
already reference `--card/--border/--radius/--muted/--accent/--bg`, so
redefining them re-themes the app without touching every component.

## Task 17: Game-like design system

**Files:**
- Modify: `package.json` (add fonts)
- Modify: `src/styles/global.css` (tokens, fonts, animations, reduced-motion)
- Modify: `src/layouts/Base.astro` (fonts, reveal-on-scroll script)
- Modify: `src/lib/eras.ts` (bright era colors)
- Modify: `src/components/EventCard.astro` (reveal + hover bounce)
- Modify: `src/components/EraSection.astro`, `JumpNav.astro`, `SearchFilter.astro`, `ThemeChips.astro` (rounded/pill styling to match)

- [ ] **Step 1: Add font deps to `package.json`**

Add to `dependencies`: `"@fontsource/baloo-2": "^5.1.0"`, `"@fontsource/nunito": "^5.1.0"`.

- [ ] **Step 2: Rewrite `src/styles/global.css`**

```css
:root {
  --primary: #ff6b35;
  --secondary: #00b4d8;
  --accent: #ffd166;
  --success: #06d6a0;
  --purple: #9b5de5;
  --pink: #f15bb5;
  --bg: #fff9e6;
  --card: #ffffff;
  --ink: #2b2b3a;
  --muted: #6b6b7b;
  --border: #f0e6d2;
  --radius: 18px;
  --radius-sm: 12px;
  --font-display: "Baloo 2", "Amiri", sans-serif;
  --font-body: "Nunito", sans-serif;
  --shadow: 0 6px 0 rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 10px 0 rgba(0, 0, 0, 0.1);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.6;
}

h1, h2, h3 { font-family: var(--font-display); line-height: 1.2; }

a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }

/* reveal-on-scroll */
[data-reveal] { opacity: 0; transform: translateY(14px); transition: opacity 0.45s ease, transform 0.45s ease; }
[data-reveal].is-visible { opacity: 1; transform: none; }

/* playful bounce on hover */
.bouncy { transition: transform 0.15s ease; }
.bouncy:hover { transform: translateY(-4px) scale(1.01); }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
  [data-reveal] { opacity: 1; transform: none; }
}
```

- [ ] **Step 3: Update `src/layouts/Base.astro`**

Import fonts and add a reveal-on-scroll observer script. Replace the font imports block with:

```astro
import "@fontsource/baloo-2/600.css";
import "@fontsource/baloo-2/700.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/700.css";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
```

Add before `</body>`:

```astro
<script>
  const reveal = () => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
  };
  reveal();
</script>
```

- [ ] **Step 4: Update era colors in `src/lib/eras.ts`**

Replace the `color` values: jahiliyyah `#c98a2b`, mecca `#e76f51`, medina `#2a9d8f`, post-fath `#457b9d`.

- [ ] **Step 5: Add reveal + bounce to `EventCard.astro`**

Add `data-reveal` and `bouncy` to the `<article>`: `<article class="event-card bouncy" data-event data-reveal ...>`.

- [ ] **Step 6: Restyle chips/nav to rounded pill look**

In `ThemeChips.astro`, `JumpNav.astro`, `SearchFilter.astro`: use `border-radius: 999px`, add `font-family: var(--font-display)`, and use the bright tokens (`--secondary`/`--purple`/`--pink`) for chip accents. Keep the structure; only adjust colors/radius.

- [ ] **Step 7: Install and build**

Run: `npm install && npx astro build`
Expected: exit 0, no console errors.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: game-like design system"
```

## Task 18: Gamification logic + tests

**Files:**
- Create: `src/lib/gamification.ts`
- Test: `src/lib/gamification.test.ts`

**Interfaces:** pure functions below (no DOM, no localStorage). Consumed by Task 19 UI.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { computeLevel, awardRead, computeProgress, computeBadges, updateStreak, initialState, POINTS_PER_READ } from "./gamification";

const events = [
  { id: "a", era: "jahiliyyah" }, { id: "b", era: "jahiliyyah" },
  { id: "c", era: "mecca" }, { id: "d", era: "medina" }, { id: "e", era: "post-fath" },
];

describe("computeLevel", () => {
  it("returns level 1 at 0 points", () => {
    const l = computeLevel(0);
    expect(l.level).toBe(1);
    expect(l.name).toBe("Musafir Kecil");
  });
  it("returns a higher level past a threshold", () => {
    expect(computeLevel(60).level).toBe(2);
  });
  it("caps at max level with progress 1", () => {
    const l = computeLevel(500);
    expect(l.nextMin).toBeNull();
    expect(l.progress).toBe(1);
  });
});

describe("awardRead", () => {
  it("awards points once per event", () => {
    const s0 = initialState();
    const s1 = awardRead(s0, "a");
    expect(s1.points).toBe(POINTS_PER_READ);
    expect(s1.readIds).toEqual(["a"]);
    expect(awardRead(s1, "a")).toBe(s1);
  });
});

describe("computeProgress", () => {
  it("computes percent", () => {
    const s = { ...initialState(), readIds: ["a", "b"] };
    expect(computeProgress(s, 4)).toEqual({ read: 2, total: 4, percent: 50 });
  });
});

describe("computeBadges", () => {
  it("earns first-read and era badges", () => {
    const s = { ...initialState(), readIds: ["a", "b"] };
    const ids = computeBadges(s, events).map((b) => b.id);
    expect(ids).toContain("first-read");
    expect(ids).toContain("era-jahiliyyah");
    expect(ids).not.toContain("all-read");
  });
  it("earns all-read when every event is read", () => {
    const s = { ...initialState(), readIds: events.map((e) => e.id) };
    expect(computeBadges(s, events).map((b) => b.id)).toContain("all-read");
  });
});

describe("updateStreak", () => {
  it("starts streak at 1 on first visit", () => {
    expect(updateStreak(initialState(), "2026-09-13").streak).toBe(1);
  });
  it("increments on consecutive days", () => {
    const s1 = updateStreak(initialState(), "2026-09-12");
    expect(updateStreak(s1, "2026-09-13").streak).toBe(2);
  });
  it("resets after a gap", () => {
    const s1 = updateStreak(initialState(), "2026-09-10");
    expect(updateStreak(s1, "2026-09-13").streak).toBe(1);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/gamification.test.ts` — expect FAIL (cannot resolve `./gamification`).

- [ ] **Step 3: Write `src/lib/gamification.ts`** (implement all functions + constants/types per the tests, with `POINTS_PER_READ = 10`, `LEVELS`, `BADGES`, `initialState`, `PlayerState`, `Badge`, `EventMeta`).

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/gamification.test.ts` — expect all pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gamification.ts src/lib/gamification.test.ts && git commit -m "feat: gamification logic"
```

## Task 19: Gamification UI & reading rewards

**Files:**
- Create: `src/components/PlayerHeader.astro`
- Modify: `src/layouts/Base.astro` (render `<PlayerHeader />`)
- Modify: `src/pages/events/[slug].astro` (mark read + award + confetti)
- Modify: `src/components/EventCard.astro` (read checkmark via `data-read`)

**Interfaces:** consumes `computeLevel/awardRead/computeProgress/computeBadges/updateStreak` and `initialState` from `src/lib/gamification.ts`. Persists `PlayerState` to `localStorage` key `"siroh-player"`. Uses a global `window` event `"siroh:updated"` to sync the header.

- [ ] **Step 1: Write `src/components/PlayerHeader.astro`**

A sticky top bar showing, left-to-right: level icon + name, points ("X poin"), streak ("🔥 N hari"), and a progress bar with "N%" label. Includes a client script that loads state from `localStorage`, renders via `computeLevel`/`computeProgress` (with total = 34), and listens for the `"siroh:updated"` event to re-render.

```astro
---
// PlayerHeader.astro — sticky gamification bar
---
<header class="player" id="player-header">
  <div class="player__level"><span id="level-icon">🐪</span> <strong id="level-name">Musafir Kecil</strong></div>
  <div class="player__stats">
    <span id="points">0 poin</span>
    <span id="streak">🔥 0 hari</span>
  </div>
  <div class="player__progress">
    <div class="player__bar"><div id="progress-fill"></div></div>
    <span id="progress-label">0%</span>
  </div>
</header>

<style>
  .player {
    position: sticky; top: 0; z-index: 20;
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    background: linear-gradient(90deg, var(--primary), var(--pink));
    color: #fff; padding: 0.6rem 1rem; border-radius: 0 0 var(--radius) var(--radius);
    font-family: var(--font-display);
  }
  .player__level { display: flex; align-items: center; gap: 0.4rem; }
  .player__stats { display: flex; gap: 1rem; }
  .player__progress { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 120px; }
  .player__bar { flex: 1; height: 12px; background: rgba(255,255,255,0.35); border-radius: 999px; overflow: hidden; }
  #progress-fill { height: 100%; width: 0; background: var(--accent); border-radius: 999px; transition: width 0.4s ease; }
</style>

<script>
  import { computeLevel, computeProgress, initialState } from "../lib/gamification";

  const TOTAL = 34;
  const KEY = "siroh-player";
  const load = () => { try { return { ...initialState(), ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { return initialState(); } };

  function render() {
    const s = load();
    const lvl = computeLevel(s.points);
    const prog = computeProgress(s, TOTAL);
    document.getElementById("level-icon")!.textContent = lvl.icon;
    document.getElementById("level-name")!.textContent = lvl.name;
    document.getElementById("points")!.textContent = `${s.points} poin`;
    document.getElementById("streak")!.textContent = `🔥 ${s.streak} hari`;
    (document.getElementById("progress-fill") as HTMLElement).style.width = `${prog.percent}%`;
    document.getElementById("progress-label")!.textContent = `${prog.percent}%`;
  }

  render();
  window.addEventListener("siroh:updated", render);
</script>
```

- [ ] **Step 2: Render `<PlayerHeader />` in `Base.astro`**

Add `import PlayerHeader from "../components/PlayerHeader.astro";` and render `<PlayerHeader />` immediately after `<body>`'s opening `<slot />`? No — render it as the first child of `<body>`, before `<slot />`:

```astro
<body>
  <PlayerHeader />
  <slot />
</body>
```

- [ ] **Step 3: Mark read + award on the detail page**

In `[slug].astro`, add a `<script>` that on load: loads state, `updateStreak(state, today)` + `awardRead(state, slug)` (using the current event slug), saves, dispatches `window.dispatchEvent(new Event("siroh:updated"))`, and shows a "+10 poin!" toast plus a small confetti burst. Confetti is a tiny inline function (no dependency) that appends ~30 absolutely-positioned colored divs that animate and remove themselves. Get the slug in the script from a `data-slug` attribute on `<main>`.

- [ ] **Step 4: Read checkmark on cards**

In `EventCard.astro`, add a client script that reads state and adds a `data-read` class (a ✓ badge) to cards whose id is in `readIds`, re-rendering on `"siroh:updated"`. Cards carry `data-event-id` (the event id).

- [ ] **Step 5: Build and verify**

Run: `npx astro build`
Expected: exit 0. Manual check: reading an event increments points and the header progress bar.

- [ ] **Step 6: Commit**

```bash
git add src/components/PlayerHeader.astro src/layouts/Base.astro src/pages/events/[slug].astro src/components/EventCard.astro
git commit -m "feat: gamification UI and reading rewards"
```

## Task 20: PWA

**Files:**
- Modify: `package.json` (add `@vite-pwa/astro`)
- Modify: `astro.config.mjs`
- Create: `public/icons/icon.svg`
- Modify: `src/layouts/Base.astro` (theme-color + apple-touch meta)

- [ ] **Step 1: Add dependency** — `"@vite-pwa/astro": "^1.0.0"` to `dependencies`.

- [ ] **Step 2: Write `public/icons/icon.svg`** — a simple crescent-and-star motif on the primary color (a 512×512 SVG).

- [ ] **Step 3: Configure `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { VitePWA } from "@vite-pwa/astro";

export default defineConfig({
  integrations: [
    mdx(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "Sirah Nabawiyah",
        short_name: "Sirah",
        description: "Garis waktu interaktif kehidupan Nabi Muhammad ﷺ untuk anak-anak.",
        theme_color: "#ff6b35",
        background_color: "#fff9e6",
        display: "standalone",
        start_url: "/",
      },
      pwaAssets: { image: "public/icons/icon.svg" },
    }),
  ],
});
```

- [ ] **Step 4: Add meta to `Base.astro`**

```astro
<meta name="theme-color" content="#ff6b35" />
<link rel="apple-touch-icon" href="/icons/icon.svg" />
```

- [ ] **Step 5: Install and build**

Run: `npm install && npx astro build`
Expected: exit 0; `dist/` contains `manifest.webmanifest`, `sw.js` (or similar), and generated icon files.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: pwa support"
```
