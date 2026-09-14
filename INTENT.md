# INTENT — Sirah Nabawiyah

Kumpulan seluruh brief/arahan pengguna untuk proyek ini, disusun kronologis.
Dokumen ini adalah sumber referensi intent — bukan spec teknis (lihat
`docs/superpowers/specs/` untuk spec dan `docs/superpowers/plans/` untuk plan).

## Ringkasan Produk

Aplikasi web (PWA) untuk menelusuri **sejarah Nabi Muhammad ﷺ (sirah
nabawiyah)** melalui **garis waktu interaktif**, dirancang khusus untuk
**anak-anak usia 8–12 tahun**, berbahasa **Indonesia**, dengan **gamifikasi
penuh** dan konten **sedetail ensiklopedia**.

## Kumpulan Brief

1. **Tujuan awal** — buat web app agar pengguna bisa melihat sejarah Nabi ﷺ.
2. **Sumber konten** — gunakan sumber publik/gratis; konten harus
   **diteliti lalu dikurasi** dari sumber terpercaya (bukan sekadar scrape).
3. **Pengalaman inti** — garis waktu interaktif sebagai pengalaman utama.
4. **Bahasa** — antarmuka dan konten dalam **Bahasa Indonesia** (pengguna
   utama orang Indonesia).
5. **Teknologi** — konten sebagai **file statis** (Astro), tanpa backend.
6. **Fitur v1** — garis waktu, halaman detail peristiwa, filter & pencarian,
   sumber/referensi, dan dukungan teks Arab.
7. **Konten harus detail** — bukan hanya sejarah: sertakan
   **percakapan/dialog**, **ayat Al-Qur'an**, **hadis**, lengkap dengan
   **referensi yang dikutip**.
8. **Pelajaran** — setiap konten punya bagian **"apa yang bisa kita pelajari"**
   (pelajaran/hikmah) beserta sumbernya.
9. **Desain untuk anak 8–12** — halaman harus **interaktif**, **kaya animasi**,
   bergaya **game-like UI** (ikon playful, badge, progress bar, skor).
10. **Gamifikasi penuh** — poin, level, streak, reward yang terkait dengan
    progres membaca.
11. **PWA** — aplikasi bisa di-install dan bekerja offline.
12. **Audio ayat** — setiap ayat Al-Qur'an harus bisa **diputar audionya**,
    dari situs publik penyedia audio Qur'an (everyayah.com).
13. **Server di 0.0.0.0** — agar bisa diverifikasi di HP lewat Tailscale.
14. **Ensiklopedia** — konten diperdalam jadi **artikel multi-bagian**
    (Latar Belakang, Kronologi, Tokoh Kunci, Ayat & Hadits, Pelajaran), PLUS
    koleksi referensi silang **Tokoh / Tempat / Glosarium** (indeks + halaman
    detail, saling tertaut dengan peristiwa).
15. **Teks Arab untuk percakapan** — setiap teks percakapan harus menyertakan
    **teks Arab-nya**, dengan **referensi yang jelas**.
16. **Feedback WhatsApp** — tautan feedback ke **wa.me/628112071744**, dengan
    **template pesan** yang menyertakan kolom untuk **kontak dan identitas**
    pengirim (Nama, Nomor HP/WA, Email, Masukan).
17. **Perbanyak peristiwa** — arah 1 (peristiwa sekunder di era yang ada) +
    arah 2 (konteks pra-Islam/Jahiliyyah).
18. **Deploy publik** — unggah ke host publik (GitHub Pages via domain
    `rahmatawaludin.com`), agar bisa diakses orang lain.

## Detail Kontak Feedback

- Nomor WhatsApp: `+628112071744` → `wa.me/628112071744`
- Template pesan WA (pre-filled):
  - Nama, Nomor HP/WA, Email (opsional), Masukan.

## Status Implementasi

- **Live:** https://rahmatawaludin.com/siroh/ (GitHub Pages via domain
  `rahmatawaludin.com`; auto-deploy dari branch `main` repo `rawaludin/siroh`).
- **Selesai:** scaffold, garis waktu, halaman detail, filter/pencarian, teks
  Arab, desain game-like, gamifikasi (logika + UI), PWA, audio ayat, komponen
  Verse/Hadith/Dialogue, lessons, link feedback WA, artikel multi-bagian,
  koleksi referensi silang, perbanyak peristiwa, deploy publik.
- **Konten:** 49 peristiwa, 52 tokoh, 20 tempat, 50 glosarium.
- **Catatan teknis:** base path `/siroh/` di-hardcode di 9 file + `astro.config.mjs`
  (bukan `import.meta.env.BASE_URL` yang bermasalah di Astro 5.18). Jika pindah
  ke root domain, perlu diganti jadi satu sumber.
