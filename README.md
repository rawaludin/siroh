# Sirah Nabawiyah

Aplikasi web (PWA) untuk menelusuri **sejarah Nabi Muhammad ﷺ (sirah
nabawiyah)** melalui **garis waktu interaktif**, dirancang untuk **anak-anak
usia 8–12 tahun**, berbahasa **Indonesia**, dengan **gamifikasi** dan konten
**sedetail ensiklopedia**.

Dibangun dengan [Astro](https://astro.build) — konten berupa file statis,
tanpa backend.

## Menjalankan

```bash
npm install
npm run dev        # server pengembangan (dijalankan di 0.0.0.0)
npm test           # jalankan seluruh pengujian (Vitest)
npm run build      # build produksi ke dist/
npm run preview    # pratinjau build produksi
```

## Struktur Konten

Setiap peristiwa adalah satu file MDX di `src/content/events/`, dengan
frontmatter YAML dan isi artikel. Skema frontmatter didefinisikan di
`src/content/config.ts` menggunakan Zod.

Contoh frontmatter:

```yaml
---
order: 7
year: "610 M (Ramadan)"
era: "mecca"            # jahiliyyah | mecca | medina | post-fath
title: "Wahyu Pertama di Gua Hira"
titleAr: "أول الوحي في غار حراء"
summary: "Malaikat Jibril menyampaikan lima ayat pertama surah Al-'Alaq."
location: "Gua Hira, Makkah"
themes: ["wahyu", "dakwah"]
sources:
  - title: "Sahih al-Bukhari"
    author: "Imam Al-Bukhari"
    reference: "Hadis no. 3"
    link: "https://sunnah.com/bukhari:3"
related: ["pernikahan-khadijah", "dakwah-sembunyi"]
lessons:
  - "Wahyu pertama dimulai dengan perintah Iqra' (membaca)."
  - "Khadijah adalah orang pertama yang menenangkan beliau."
---
```

### Field `lessons`

- Wajib (`z.array(z.string()).min(1)`) — setiap peristiwa **harus** memiliki
  minimal satu pelajaran/hikmah.
- Berisi daftar kalimat "Apa yang bisa kita pelajari" yang ditampilkan di
  halaman detail peristiwa.
- Nilai ditulis sebagai larik YAML `lessons: ["...", "..."]`.

### Field lain yang wajib

`order`, `year`, `era`, `title`, `titleAr`, `summary`, `themes` (min 1),
`sources` (min 1, masing-masing dengan `title`/`author`/`reference`, `link`
opsional). `location` dan `related` bersifat opsional.

## Komponen MDX

Di dalam body MDX, gunakan komponen berikut (didefinisikan di
`src/components/` dan diimpor di tiap file MDX):

### `<Verse>`

Menampilkan ayat Al-Qur'an dengan teks Arab, terjemahan, dan sumber.

```mdx
<Verse
  arabic="اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"
  translation="Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan."
  source="QS. Al-'Alaq: 1"
  surah={96}
  ayah={1}
  ayahEnd={1}
/>
```

- `arabic`, `translation`, `source` — wajib.
- `surah`, `ayah` — opsional; jika keduanya diisi, komponen menampilkan tombol
  **"Dengarkan"** yang memutar audio ayat dari
  [everyayah.com](https://everyayah.com) (lihat `src/lib/audio.ts`).
- `ayahEnd` — opsional; batas akhir rentang ayat (untuk memutar lebih dari satu
  ayat).

### `<Hadith>`

Menampilkan hadis dengan teks Arab, terjemahan, dan sumber.

```mdx
<Hadith
  arabic="فَجَاءَهُ الْمَلَكُ فَقَالَ: اقْرَأْ"
  translation={'Maka datanglah malaikat kepadanya lalu berkata, "Bacalah!"'}
  source="HR. Al-Bukhari no. 3"
  link="https://sunnah.com/bukhari:3"
/>
```

- `arabic`, `translation`, `source` — wajib.
- `link` — opsional; jika diisi, sumber ditampilkan sebagai tautan.

### `<Dialogue>`

Menampilkan percakapan/dialog dengan teks Arab, terjemahan, dan sumber.

```mdx
<Dialogue
  arabic="اقْرَأْ، فَقَالَ: مَا أَنَا بِقَارِئٍ"
  translation={'Jibril berkata, "Bacalah!" Nabi ﷺ menjawab, "Aku tidak bisa membaca."'}
  source="HR. Al-Bukhari no. 3"
  link="https://sunnah.com/bukhari:3"
/>
```

- `translation`, `source` — wajib.
- `arabic` — opsional; jika diisi, teks Arab ditampilkan di atas terjemahan.
  Setiap percakapan **sebaiknya** menyertakan teks Arab-nya (lihat brief #15).
- `link` — opsional.

## Gamifikasi

Gamifikasi diimplementasikan di `src/lib/gamification.ts` dan ditampilkan
melalui komponen `PlayerHeader` serta logika klien di halaman detail.

- **Poin** — +10 poin untuk setiap peristiwa yang pertama kali dibaca
  (`POINTS_PER_READ`).
- **Level** — 6 tingkatan, dari "Musafir Kecil" hingga "Bintang Madinah",
  ditentukan dari akumulasi poin (`computeLevel`).
- **Streak** — jumlah hari berturut-turut membaca (`updateStreak`), dihitung
  dari `lastVisit`.
- **Badge/lencana** — diberikan otomatis (`computeBadges`) untuk membaca
  pertama, menyelesaikan tiap era, streak 3/7 hari, dan membaca seluruh
  peristiwa.
- **Penyimpanan** — seluruh progres disimpan di **`localStorage`** dengan kunci
  `siroh-player`; tidak ada backend, sehingga progres bersifat per-perangkat.

## Sumber Audio

URL audio ayat dibangun di `src/lib/audio.ts` dari nomor surah dan ayat,
menggunakan arsip publik [everyayah.com](https://everyayah.com).

## Feedback

Tautan feedback WhatsApp (dengan template pesan yang menyertakan Nama, Nomor
HP/WA, Email, dan Masukan) tersedia di footer aplikasi.

## Sumber Konten

Konten diteliti dan dikurasi dari sumber terpercaya (Al-Qur'an, hadis-hadis
sahih, dan kitab sirah seperti *Ar-Raheeq Al-Makhtum*). Setiap peristiwa
mencantumkan daftar sumber di frontmatter-nya.
