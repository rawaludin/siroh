# Multi-Section Articles Implementation Plan

**Goal:** Restructure every event's body into a multi-section encyclopedia-style article for kids (8–12), adding "Latar Belakang" and "Tokoh Kunci" sections and organizing the existing narrative under "Kronologi".

**Approach:** Content-only change to the 34 event MDX files (no code beyond minor heading styling). Each event body becomes:

```mdx
## Latar Belakang
<2–3 paragraphs of context>

## Kronologi
<existing detailed narrative + dialogues + Verse/Hadith/Dialogue, kept intact>

## Tokoh Kunci
<3–6 key figures, each: **Nama** (Arabic) — peran dalam peristiwa ini>
```

Verses/hadith stay woven into Kronologi (they are already visually distinct via components); "Pelajaran" and "Sumber" remain frontmatter-driven sections on the detail page — no separate "Ayat & Hadits" section to avoid duplication.

## Tasks

### Task 22: Heading styling for detail-page body
- Modify `src/pages/events/[slug].astro`: add scoped styles for `.detail__body h2` and `.detail__body h3` (game-like theme, e.g. colored accent border-left + Baloo 2).
- Verify `npx astro build`.

### Task 23: Restructure Jahiliyyah + Mecca (17 events, orders 1–17)
### Task 24: Restructure Medina (11 events, orders 18–28)
### Task 25: Restructure Post-Fath (6 events, orders 29–34)

Each: rewrite body into the 3 sections; keep frontmatter + lessons + sources + related UNCHANGED; keep all existing Verse/Hadith/Dialogue (with their Arabic + references) intact under Kronologi; write accurate Latar Belakang + Tokoh Kunci (Tokoh Kunci roles must be historically accurate). Verify `npx astro sync && npx astro build`.

### Task 26: Final validation
- `npm test` + `npm run build`; confirm all 34 files have the 3 headings.
