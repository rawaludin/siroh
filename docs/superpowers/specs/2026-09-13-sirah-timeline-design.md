# Sirah Nabawiyah Timeline — Design Spec

**Date:** 2026-09-13
**Status:** Approved for planning

## Overview

A web app where Indonesian-speaking users explore the life of the Prophet Muhammad (ﷺ) through an **interactive timeline**. The core experience is a vertical, chronological timeline grouped by era, with click-through to event detail pages. Interface language is Indonesian; content is Indonesian with Arabic script support.

## Goals

- Let a user browse the Prophet's (ﷺ) history chronologically.
- Provide rich, curated, verifiable content (Indonesian) with sources per event.
- Keep the app lightweight, fast, and cheap to host — fully static, no backend.

## Non-Goals (v1)

- No authentication or user accounts.
- No content editing UI (content is edited as files).
- No mobile native app; responsive web only.
- No E2E test harness.

## Architecture

**Stack:** Astro (content-first static site generator).

- Content lives in MDX files under `src/content/events/`, using Astro Content Collections for type-safe loading.
- Structured fields in frontmatter; prose (including inline Arabic) in the MDX body.
- Fully pre-rendered static HTML. Filter/search runs client-side over the already-loaded event list.
- Self-hosted Arabic font via `@fontsource`.

### Pages

- `/` — the interactive timeline.
- `/events/[slug]` — event detail page.
- Era filtering via query param on `/` (no separate era pages for v1).

## Content Model

Each event is one content file with this shape:

```ts
interface Event {
  id: string;            // slug
  year: string;          // Hijri + Gregorian, may be a range or approximate
  era: "jahiliyyah" | "mecca" | "medina" | "post-fath";
  title: string;         // Indonesian
  titleAr: string;       // Arabic
  summary: string;       // short, for timeline card
  // body: full Indonesian story (MDX body)
  location?: string;
  themes: string[];      // e.g. "battles", "family", "revelation", "migration"
  sources: Source[];     // at least one required
  relatedEvents?: string[]; // event ids
}

interface Source {
  title: string;
  author: string;
  reference: string;     // e.g. "Ar-Raheeq Al-Makhtum, Bab ..." or hadith no.
  link?: string;         // e.g. sunnah.com URL
}
```

**Eras** (in order): Jahiliyyah, Mecca period, Medina period, Post-Fath (to wafat).

## Timeline & Era Structure

- Vertical scrollable timeline grouped into 4 eras; each era is a labeled section header with a colored accent and a short intro.
- Events render as alternating cards on a center spine (desktop) / single column (mobile).
- Each card: year badge, title, Arabic title, 1–2 line summary, theme tag chips.
- Dates store both Hijri (H) and Gregorian (M); ranges and approximate dates ("~") display cleanly.
- Sticky "jump to era" nav for skipping between sections.
- CSS/flex layout; no heavy timeline library.

## Event Detail Pages

- `/events/[slug]`: full curated story (markdown), Arabic title, ayat/dua in Arabic, source list, theme tags, related-events links.
- Breadcrumb / "Kembali ke garis waktu" link.
- Prev/next chronological navigation at bottom.

## Filter & Search (client-side)

- Search box matching title, Arabic title, summary, and body (Indonesian + Arabic), debounced.
- Filter chips for **era** and **theme**, combinable (AND).
- Non-matching events hidden; era sections with no matches are dimmed/emptied with a "clear filters" affordance.
- Results count ("42 dari 63 peristiwa").

## Arabic Script

- Self-hosted Arabic font (Amiri or Scheherazade New) via `@fontsource`.
- `lang="ar" dir="rtl"` on Arabic runs.
- Arabic in frontmatter fields and inline in MDX bodies.

## Sources & References

- Each event carries a `sources` list in frontmatter (title, author, precise reference, optional link).
- Rendered on the detail page as "Sumber / Referensi", external links in new tabs.
- Sources are curated and verifiable during content authoring.

## Testing

- **Content integrity** — build-time validation: required fields present, `era`/`theme` from allowed set, `year` well-formed, ≥1 source per event, unique slugs.
- **Unit tests** (Vitest) — filter/search logic and era grouping (pure functions).
- **Manual check** — dev server walkthrough: timeline renders, search/filter works, Arabic RTL correct, no broken links.

## Content Scope (v1)

- ~30–40 curated key events spanning all four eras: birth (c. 570 M), early life, first revelation, Meccan trials, Hijrah, major battles (Badr, Uhud, Khandaq), Hudaybiyyah, Fath Makkah, Farewell Pilgrimage, wafat (11 H / 632 M).
- Indonesian prose, Arabic titles, theme tags, 1–3 verifiable sources each.
- Research against reliable, freely-accessible references: Ar-Raheeq Al-Makhtum (English/Indonesian translations), Sahih hadith via sunnah.com, standard seerah chronologies.

## Out of Scope / Future

- Admin/content editing UI.
- More eras/events beyond the starter set.
- Mobile native app.
- E2E tests.
