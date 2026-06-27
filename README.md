# LinkAja PUTAR

**P**enghasilan masuk · **U**ntung otomatis · **T**ransaksi **A**nchor **R**utin.

Aplikasi fungsional fitur fintech **LinkAja PUTAR** untuk Business Case Competition
**StudentsxCEOs Grand Summit 15 — Tim GGMU**. Satu siklus aliran dana: uang
**masuk → tumbuh → berputar** lintas transportasi, merchant, dan pembayaran digital.

Semua tombol bekerja sungguhan: saldo berubah, transaksi tercatat, alokasi kantong
berubah, reward **Siklus Manfaat** mengalir ke kantong berikutnya, dan **Asisten
Alokasi (AI)** memberi saran personal — semuanya **persisten** lewat `localStorage`
(Zustand persist).

## ✨ Fitur inti

- **Tunjangan masuk (rail money-in)** — tunjangan transport/BBM (mis. ekosistem
  Telkom Group) masuk otomatis ke aplikasi, langsung terbagi ke kantong kebutuhan.
- **Kantong Otomatis** — penghasilan masuk langsung terbagi ke Bensin / Transit /
  Tagihan / Dapur sesuai alokasi, sisanya ke Kantong Utama.
- **Siklus Manfaat** — tiap transaksi memberi bagi hasil (1%, Rp500–Rp5.000) ke
  kantong berikutnya dalam loop `bensin → transit → tagihan → dapur → bensin`,
  divisualisasikan dengan animasi loop yang berputar mulus.
- **Saldo Tumbuh** — sisa saldo Kantong Utama berkembang otomatis (~5,5%/tahun)
  lewat **reksa dana pasar uang** (RDPU generik, legal & netral).
- **Asisten Alokasi (AI)** — chat asisten keuangan yang membaca kantong & transaksimu
  untuk memberi saran alokasi dan langkah berikutnya. Pakai AI sungguhan (OpenRouter)
  bila key di-set; jika tidak, otomatis pakai mode lokal (heuristik) sehingga selalu menjawab.
- **Transit Tap-In / Tap-Out**, **QRIS, Top Up, Transfer, Riwayat** — semua mutasi nyata + validasi saldo.

## 🤖 Mengaktifkan AI (opsional)

Asisten Alokasi memakai **Google Gemini** (`gemini-2.5-flash`). Tanpa key sekalipun,
fitur tetap jalan dengan mode lokal.

1. Buat key gratis di [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Set environment variable:
   - **Lokal:** buat file `.env.local` (lihat `.env.example`):
     ```
     GEMINI_API_KEY=xxxxxxxx
     GEMINI_MODEL=gemini-2.5-flash
     ```
   - **Vercel:** Project → Settings → Environment Variables, tambahkan `GEMINI_API_KEY`
     (dan opsional `GEMINI_MODEL`), lalu redeploy.
3. Key disimpan **di server** (route `app/api/ai`), tidak pernah ke-expose ke browser.

> `gemini-2.5-flash` dipilih karena cepat dan mudah diakses; "thinking" dimatikan
> agar respons kilat. Ganti `GEMINI_MODEL` untuk model lain bila perlu.

## 🧱 Tech stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** (design token sebagai CSS variables di `app/globals.css`)
- **Zustand** + `persist` — backbone seluruh state
- **Framer Motion** + SVG `animateMotion` (animasi loop) — hormati `prefers-reduced-motion`
- **lucide-react** (ikon), **canvas-confetti** (perayaan)
- Route Handler `app/api/ai` (serverless) untuk integrasi AI.

## 🚀 Menjalankan lokal

```bash
npm install
npm run dev
# buka http://localhost:3000
```

Build produksi:

```bash
npm run build
npm run start
```

## 🗺️ Struktur

```
app/
  layout.tsx            # font + RootShell
  globals.css           # design tokens
  page.tsx              # gate → /splash atau /beranda
  splash/  beranda/  atur/  bayar/  transit/  asisten/
  topup/  transfer/  riwayat/  siklus/  akun/  promo/
  api/ai/route.ts       # endpoint Asisten Alokasi (Gemini + fallback lokal)
components/             # BerkahLoop, BalanceCard, PocketCard, BottomSheet, dst.
lib/
  store.ts              # Zustand + persist — semua aksi & aturan
  constants.ts          # seed, loop order, parameter ekonomi
  ai.ts                 # prompt, konteks, & heuristik Asisten Alokasi
  format.ts  types.ts
```

## 🎮 Panel Peraga

Tombol melayang di kanan bawah: loncat ke layar mana pun, **Terima penghasilan**,
**Replay Siklus**, dan **Atur Ulang** data. Berguna saat presentasi.

## 🖼️ Logo resmi

Simpan logo LinkAja (PNG kotak/transparan) ke `public/linkaja-logo.png` — otomatis
dipakai di splash & favicon. Jika belum ada, tampil fallback wordmark on-brand.
