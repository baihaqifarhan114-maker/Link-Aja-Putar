# LinkAja SIAP — Saldo Inti untuk Aktivitas Pokok

Prototipe **fungsional** (bukan mockup statis) untuk fitur fintech **LinkAja SIAP**.
Dibuat untuk Business Case Competition **StudentsxCEOs 15 — Tim GGMU**.

Semua tombol bekerja sungguhan: saldo berubah, transaksi tercatat, alokasi kantong
berubah, dan reward **Berkah Berputar** mengalir ke kantong berikutnya — semuanya
**persisten** lewat `localStorage` (Zustand persist) sehingga bertahan saat navigasi
maupun reload.

## ✨ Fitur inti

- **Kantong Otomatis** — penghasilan masuk langsung terbagi ke Bensin / Transit /
  Tagihan / Dapur sesuai alokasi, sisanya ke Kantong Utama.
- **Berkah Berputar** — tiap transaksi memberi bagi hasil (1%, Rp500–Rp5.000) ke
  kantong berikutnya dalam loop `bensin → transit → tagihan → dapur → bensin`,
  divisualisasikan dengan animasi loop bergerak.
- **Tumbuh Halal** — sisa saldo Kantong Utama berkembang lewat akad mudharabah
  (RDPU syariah, ±5,5%/tahun). Bisa disimulasikan per bulan.
- **Transit Tap-In / Tap-Out** — simulasi gerbang KRL/MRT dengan tarif Rp4.000.
- **QRIS, Top Up, Transfer, Riwayat** — semua mutasi nyata + validasi saldo.

## 🧱 Tech stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** (design token sebagai CSS variables di `app/globals.css`)
- **Zustand** + `persist` (kunci `linkaja-siap`) — backbone seluruh state
- **Framer Motion** — transisi & animasi (hormati `prefers-reduced-motion`)
- **lucide-react** (ikon), **canvas-confetti** (perayaan)
- 100% client-side, tanpa backend/DB/auth — deploy statis di Vercel tanpa konfigurasi.

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

## ☁️ Deploy ke Vercel

**Cara 1 — lewat GitHub (disarankan):**

1. Buat repo dan push:
   ```bash
   git init
   git add .
   git commit -m "LinkAja SIAP — prototipe fungsional"
   git branch -M main
   git remote add origin https://github.com/<username>/linkaja-siap.git
   git push -u origin main
   ```
2. Buka [vercel.com/new](https://vercel.com/new), **Import** repo tersebut.
3. Vercel mendeteksi Next.js otomatis → klik **Deploy**. Tanpa env var.

**Cara 2 — Vercel CLI:**

```bash
npm i -g vercel
vercel        # ikuti prompt
vercel --prod # deploy produksi
```

## 🗺️ Struktur

```
app/
  layout.tsx            # font Plus Jakarta Sans + RootShell
  globals.css           # design tokens (single source of truth)
  page.tsx              # gate → /splash atau /beranda
  splash/  beranda/  atur/  bayar/  transit/
  topup/  transfer/  riwayat/  berkah/  akun/  promo/
components/              # DeviceFrame, RootShell, BalanceCard, PocketCard,
                         # BerkahLoop, BottomSheet, Toast, DemoController, dst.
lib/
  store.ts              # Zustand + persist — SEMUA aksi & aturan logika
  constants.ts          # seed, loop order, tarif, parameter ekonomi
  format.ts             # formatRupiah, tanggal, parsing
  types.ts              # tipe domain
```

## 🎮 Demo Controller

Tombol melayang (ikon tongkat) di kanan bawah: loncat ke layar mana pun,
**Terima penghasilan**, **Replay Berkah**, dan **Reset Demo** (seed ulang state).
Splash bisa diputar ulang lewat tombol **Splash** di Demo Controller.

## 🔁 Reset

Buka **Akun → Reset Demo** (atau Demo Controller → Reset Demo) untuk
mengembalikan state ke kondisi awal.

## 🖼️ Logo resmi

Aplikasi memakai logo resmi LinkAja bila tersedia di
`public/linkaja-logo.png`. **Simpan file logo (PNG, sebaiknya kotak/transparan)
ke `public/linkaja-logo.png`** — otomatis dipakai di splash & favicon. Jika file
belum ada, ditampilkan fallback wordmark yang tetap on-brand (tidak error).

## 📱 Tampilan

Mobile-first dan **responsif penuh** — aplikasi nyata, bukan mockup HP.

- **HP:** layar penuh.
- **Laptop/desktop:** kolom aplikasi full-height di tengah layar (lebar nyaman,
  tanpa bezel HP, tanpa background marketing) — perilaku standar aplikasi
  mobile-first di layar lebar.

---

> Catatan brand: warna mengikuti `--laja-red` / `--laja-magenta` di `globals.css`.
> Bila ada kode hex resmi LinkAja, cukup ubah dua variabel itu.
