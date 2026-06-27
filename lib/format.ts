/**
 * Pemformatan mata uang & waktu untuk LinkAja PUTAR.
 * Selalu aman: tidak pernah mengembalikan NaN / Infinity / nilai negatif yang aneh.
 */

/** Membersihkan angka agar selalu bilangan bulat terhingga & non-NaN. */
export function safeInt(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n);
}

/** Rp1.234.567 (format Indonesia, tanpa desimal, tabular-friendly). */
export function formatRupiah(n: number): string {
  const v = safeInt(n);
  const abs = Math.abs(v);
  const grouped = abs.toLocaleString("id-ID");
  return `${v < 0 ? "-" : ""}Rp${grouped}`;
}

/** Tanpa prefix "Rp" — untuk input/penyusunan UI. */
export function formatNumber(n: number): string {
  return safeInt(n).toLocaleString("id-ID");
}

/** Membaca string angka dari input (hanya digit). */
export function parseAmount(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

/** "07.41" gaya jam Indonesia. */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}.${mm}`;
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/** Label tanggal panjang: "Senin, 3 Jun 2026". */
export function formatDateLong(ts: number): string {
  const d = new Date(ts);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** Kunci hari (tanpa jam) untuk pengelompokan riwayat. */
export function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** "Hari ini" / "Kemarin" / tanggal panjang. */
export function relativeDayLabel(ts: number, now: number = Date.now()): string {
  const today = dayKey(now);
  const yesterday = dayKey(now - 24 * 60 * 60 * 1000);
  const key = dayKey(ts);
  if (key === today) return "Hari ini";
  if (key === yesterday) return "Kemarin";
  return formatDateLong(ts);
}
