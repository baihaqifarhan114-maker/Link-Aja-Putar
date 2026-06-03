import type { BerkahEvent, Pocket, PocketId, Txn } from "./types";

/** Urutan loop Berkah Berputar: bensin → transit → tagihan → dapur → (bensin). */
export const LOOP_ORDER: PocketId[] = ["bensin", "transit", "tagihan", "dapur"];

/** Kantong berikutnya dalam loop. Utama tidak ada di loop → mulai dari bensin. */
export function nextPocket(id: PocketId): PocketId {
  const idx = LOOP_ORDER.indexOf(id);
  if (idx === -1) return "bensin";
  return LOOP_ORDER[(idx + 1) % LOOP_ORDER.length];
}

/** Parameter ekonomi prototipe. */
export const TRANSIT_FARE = 4000; // Rp4.000 per perjalanan KRL/MRT
export const DEFAULT_INCOME = 2_450_000; // demo gaji/insentif
export const GROWTH_ANNUAL = 0.055; // 5,5% / tahun (≈ RDPU syariah, akad mudharabah)
export const GROWTH_MONTHLY = GROWTH_ANNUAL / 12;

export const BERKAH_RATE = 0.01; // 1% dari nilai transaksi
export const BERKAH_MIN = 500;
export const BERKAH_MAX = 5000;
export const ALLOC_MAX = 40; // alokasi maksimum per kantong (%)

/** Hitung bagi hasil Berkah Berputar untuk sebuah transaksi. */
export function berkahReward(amount: number): number {
  const raw = Math.round(Math.abs(amount) * BERKAH_RATE);
  return Math.min(BERKAH_MAX, Math.max(BERKAH_MIN, raw));
}

/** ID unik ringan (cukup untuk demo client-side). */
let _seq = 0;
export function uid(prefix = "id"): string {
  _seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${_seq.toString(36)}`;
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** Pocket awal (seed). */
function seedPockets(): Pocket[] {
  return [
    { id: "utama", name: "Kantong Utama", icon: "utama", balance: 1_150_000, allocationPct: 20, isGrowing: true },
    { id: "bensin", name: "Bensin", icon: "bensin", balance: 150_000, allocationPct: 20, isGrowing: false },
    { id: "transit", name: "Transit", icon: "transit", balance: 90_000, allocationPct: 15, isGrowing: false },
    { id: "tagihan", name: "Tagihan", icon: "tagihan", balance: 420_000, allocationPct: 25, isGrowing: false },
    { id: "dapur", name: "Dapur", icon: "dapur", balance: 640_000, allocationPct: 20, isGrowing: false },
  ];
}

/** Riwayat awal — kaya & realistis seperti akun yang sudah dipakai. */
function seedTransactions(now: number): Txn[] {
  const list: Txn[] = [
    { id: uid("tx"), ts: now - 90 * MIN, title: "Kopi Janji Jiwa", category: "qris", amount: -22_000, pocketId: "dapur", merchant: "Janji Jiwa" },
    { id: uid("tx"), ts: now - 3 * HOUR + 1000, title: "Reward Siklus Manfaat", category: "berkah", amount: 500, pocketId: "bensin" },
    { id: uid("tx"), ts: now - 3 * HOUR, title: "Indomaret Tebet", category: "qris", amount: -35_000, pocketId: "dapur", merchant: "Indomaret" },
    { id: uid("tx"), ts: now - 6 * HOUR, title: "Top Up dari Bank BCA", category: "topup", amount: 200_000, pocketId: "utama", merchant: "Bank BCA" },
    { id: uid("tx"), ts: now - 1 * DAY - 3 * HOUR + 1000, title: "Reward Siklus Manfaat", category: "berkah", amount: 500, pocketId: "tagihan" },
    { id: uid("tx"), ts: now - 1 * DAY - 3 * HOUR, title: "KRL Stasiun Sudirman", category: "transit", amount: -4_000, pocketId: "transit", merchant: "KAI Commuter" },
    { id: uid("tx"), ts: now - 1 * DAY - 6 * HOUR, title: "Bensin SPBU Pertamina", category: "bensin", amount: -50_000, pocketId: "bensin", merchant: "SPBU Pertamina" },
    { id: uid("tx"), ts: now - 1 * DAY - 9 * HOUR, title: "Transfer ke Andi Saputra", category: "transfer", amount: -75_000, pocketId: "utama", merchant: "Andi Saputra" },
    { id: uid("tx"), ts: now - 2 * DAY, title: "Penghasilan masuk", category: "income", amount: 2_450_000, pocketId: "utama" },
    { id: uid("tx"), ts: now - 3 * DAY - 2 * HOUR, title: "Listrik PLN", category: "tagihan", amount: -150_000, pocketId: "tagihan", merchant: "PLN Mobile" },
    { id: uid("tx"), ts: now - 3 * DAY - 5 * HOUR, title: "Imbal hasil otomatis", category: "growth", amount: 6_200, pocketId: "utama" },
    { id: uid("tx"), ts: now - 4 * DAY, title: "Warung Bu Tini", category: "qris", amount: -18_000, pocketId: "dapur", merchant: "Warung Bu Tini" },
    { id: uid("tx"), ts: now - 5 * DAY, title: "Pulsa Telkomsel", category: "tagihan", amount: -25_000, pocketId: "tagihan", merchant: "Telkomsel" },
  ];
  return list.sort((a, b) => b.ts - a.ts);
}

/** Riwayat Berkah Berputar awal (selaras dengan dua transaksi berkah di atas). */
function seedBerkah(now: number): { events: BerkahEvent[]; last: BerkahEvent; total: number } {
  const events: BerkahEvent[] = [
    { id: uid("bk"), ts: now - 3 * HOUR + 1000, amount: 500, fromPocket: "dapur", toPocket: "bensin" },
    { id: uid("bk"), ts: now - 1 * DAY - 3 * HOUR + 1000, amount: 500, fromPocket: "transit", toPocket: "tagihan" },
  ];
  return { events, last: events[0], total: 1_000 };
}

export interface SeedState {
  user: { name: string; phone: string; avatar?: string };
  isLoggedIn: boolean;
  pockets: Pocket[];
  transactions: Txn[];
  berkahEvents: BerkahEvent[];
  totalBerkah: number;
  monthlyGrowth: number;
  autoSplit: boolean;
  transit: { tappedIn: boolean; station?: string; tapInAt?: number };
  lastBerkah?: BerkahEvent;
}

/** State finansial awal (seed demo). User tetap dari sesi login. */
export function makeInitialState(): SeedState {
  const now = Date.now();
  const berkah = seedBerkah(now);
  return {
    user: { name: "", phone: "" },
    isLoggedIn: false,
    pockets: seedPockets(),
    transactions: seedTransactions(now),
    berkahEvents: berkah.events,
    totalBerkah: berkah.total,
    monthlyGrowth: 12_400,
    autoSplit: true,
    transit: { tappedIn: false },
    lastBerkah: berkah.last,
  };
}

/** State finansial demo (dipakai resetDemo — user tetap dari login). */
export function makeDemoFinancials() {
  const now = Date.now();
  const berkah = seedBerkah(now);
  return {
    pockets: seedPockets(),
    transactions: seedTransactions(now),
    berkahEvents: berkah.events,
    totalBerkah: berkah.total,
    monthlyGrowth: 12_400,
    autoSplit: true,
    transit: { tappedIn: false as const },
    lastBerkah: berkah.last,
  };
}

export const STATIONS = [
  "Stasiun Sudirman",
  "Stasiun Tanah Abang",
  "Stasiun Manggarai",
  "Stasiun Juanda",
  "MRT Bundaran HI",
];

export const QRIS_MERCHANTS = [
  { name: "Warung Bu Tini", type: "warung" as const },
  { name: "SPBU Pertamina", type: "spbu" as const },
  { name: "Indomaret", type: "retail" as const },
];
