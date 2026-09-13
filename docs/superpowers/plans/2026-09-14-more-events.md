# More Events (Jahiliyyah context + secondary events) Plan

**Goal:** Expand the timeline from 34 to 49 events: add 5 Jahiliyyah-context events (direction 2) and 10 secondary events across Mecca/Medina (direction 1).

**Approach:** Renumber existing events' `order` to make room, then author new events (full content: frontmatter + 3-section body + verses/hadith/dialogue + lessons), consistent with existing style. `related` fields use slugs (unaffected by renumber).

## New events (order, slug, era)

Jahiliyyah (orders 1–5): 1 keadaan-arab-sebelum-islam, 2 kepercayaan-bangsa-arab, 3 peradaban-quraisy, 4 silsilah-nabi, 5 abrahah-dan-pasukan-gajah
Mecca: 15 syiqqul-qamar, 21 dakwah-ke-thaif
Medina: 29 perang-bani-qainuqa, 31 perang-bani-nadhir, 33 perang-bani-quraizhah, 34 perang-dzatur-riqa, 35 perang-bani-musthaliq, 36 peristiwa-al-ifki, 42 perang-dumatul-jandal
Post-fath: 47 wafatnya-ibrahim

## Renumber mapping (existing slug → new order)

kelahiran-nabi 6, yatim-di-pengasuhan 7, perjalanan-ke-syam 8, perang-fijar-hilf-al-fudul 9, pernikahan-khadijah 10, peletakan-hajar-aswad 11, wahyu-pertama 12, dakwah-sembunyi 13, dakwah-terang-terangan 14, penindasan-quraisy 16, hijrah-ke-habasyah 17, islamnya-hamzah-dan-umar 18, pemboikotan-bani-hasyim 19, tahun-kesedihan 20, isra-miraj 22, baiat-aqabah-pertama 23, baiat-aqabah-kedua 24, hijrah-ke-madinah 25, masjid-nabawi-dan-persaudaraan 26, piagam-madinah 27, perang-badar 28, perang-uhud 30, perang-khandaq 32, perjanjian-hudaibiyah 37, surat-kepada-para-raja 38, perang-khaibar 39, umrah-qadha 40, perang-mutah 41, fathu-makkah 43, perang-hunain-dan-thaif 44, perang-tabuk 45, tahun-delegasi 46, haji-wada 48, wafatnya-nabi 49.

## Tasks

1. **Task 34** — Renumber existing events' `order` per the mapping (mechanical, no content change).
2. **Task 35** — Author 7 new Jahiliyyah + Mecca events (orders 1–5, 15, 21).
3. **Task 36** — Author 8 new Medina + Post-fath events (orders 29,31,33,34,35,36,42,47).
4. **Task 37** — Final validation (test + build + order-uniqueness check).

New events follow the existing content standard (3-section body, Verse/Hadith/Dialogue with Arabic+references, lessons). `era`/`themes` values must be from the schema enums.
