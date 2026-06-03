import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BerkahEvent, Pocket, PocketId, Txn, TxnCategory } from "./types";
import {
  GROWTH_MONTHLY,
  TRANSIT_FARE,
  berkahReward,
  makeDemoFinancials,
  makeInitialState,
  nextPocket,
  uid,
} from "./constants";
import { safeInt } from "./format";
import type { SeedState } from "./constants";

export interface AppState extends SeedState {
  /** true setelah state direhidrasi dari localStorage (untuk skeleton). */
  _hasHydrated: boolean;

  // ---- derived ----
  totalBalance(): number;

  // ---- actions ----
  receiveIncome(amount: number): void;
  payFromPocket(
    pocketId: PocketId,
    amount: number,
    merchant: string,
  ): { ok: boolean; reward?: number };
  payQRIS(
    amount: number,
    merchant: string,
    pocketId?: PocketId,
  ): { ok: boolean; reward?: number };
  topUp(amount: number, source: string): void;
  transfer(amount: number, recipient: string): { ok: boolean };
  transitTapIn(station: string): void;
  transitTapOut(): { ok: boolean; fare: number; reward?: number };
  setAllocation(pocketId: PocketId, pct: number): void;
  toggleAutoSplit(): void;
  accrueGrowth(): void;
  resetDemo(): void;
  login(name: string, phone: string): void;
  logout(): void;
  setHydrated(v: boolean): void;
}

type PayInput = {
  pocketId: PocketId;
  amount: number;
  merchant?: string;
  title: string;
  category: TxnCategory;
};

type PayResult =
  | { ok: false }
  | {
      ok: true;
      reward: number;
      pockets: Pocket[];
      transactions: Txn[];
      berkahEvents: BerkahEvent[];
      totalBerkah: number;
      lastBerkah: BerkahEvent;
    };

/**
 * Inti pembayaran + Berkah Berputar. Pure: menerima snapshot state,
 * mengembalikan slice baru atau {ok:false} bila saldo tak mencukupi.
 * Aturan: bila kantong sumber kurang, tutupi kekurangan dari Kantong Utama;
 * bila masih kurang → gagal (tidak ada mutasi).
 */
function computePayment(state: SeedState, input: PayInput): PayResult {
  const amount = safeInt(input.amount);
  if (amount <= 0) return { ok: false };

  const pockets = state.pockets.map((p) => ({ ...p }));
  const get = (id: PocketId): Pocket => {
    const found = pockets.find((p) => p.id === id);
    if (!found) throw new Error(`pocket ${id} tidak ditemukan`);
    return found;
  };

  const src = get(input.pocketId);
  const utama = get("utama");

  let fromSrc = 0;
  let fromUtama = 0;
  if (src.balance >= amount) {
    fromSrc = amount;
  } else {
    fromSrc = src.balance;
    const shortfall = amount - src.balance;
    if (input.pocketId !== "utama" && utama.balance >= shortfall) {
      fromUtama = shortfall;
    } else {
      return { ok: false };
    }
  }

  src.balance = safeInt(src.balance - fromSrc);
  utama.balance = safeInt(utama.balance - fromUtama);

  const now = Date.now();
  const reward = berkahReward(amount);
  const targetId = nextPocket(input.pocketId);
  const target = get(targetId);
  target.balance = safeInt(target.balance + reward);

  const payTxn: Txn = {
    id: uid("tx"),
    ts: now,
    title: input.title,
    category: input.category,
    amount: -amount,
    pocketId: input.pocketId,
    merchant: input.merchant,
  };
  const berkahTxn: Txn = {
    id: uid("tx"),
    ts: now + 1,
    title: "Reward Siklus Manfaat",
    category: "berkah",
    amount: reward,
    pocketId: targetId,
  };
  const event: BerkahEvent = {
    id: uid("bk"),
    ts: now + 1,
    amount: reward,
    fromPocket: input.pocketId,
    toPocket: targetId,
  };

  return {
    ok: true,
    reward,
    pockets,
    transactions: [berkahTxn, payTxn, ...state.transactions],
    berkahEvents: [event, ...state.berkahEvents],
    totalBerkah: safeInt(state.totalBerkah + reward),
    lastBerkah: event,
  };
}

function categoryForPocket(id: PocketId): TxnCategory {
  switch (id) {
    case "bensin":
      return "bensin";
    case "tagihan":
      return "tagihan";
    case "dapur":
      return "dapur";
    case "transit":
      return "transit";
    default:
      return "belanja";
  }
}

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...makeInitialState(),
      _hasHydrated: false,

      totalBalance() {
        return get().pockets.reduce((sum, p) => sum + p.balance, 0);
      },

      receiveIncome(amount) {
        const amt = safeInt(amount);
        if (amt <= 0) return;
        set((state) => {
          const pockets = state.pockets.map((p) => ({ ...p }));
          const byId = (id: PocketId) => pockets.find((p) => p.id === id)!;
          if (state.autoSplit) {
            let allocated = 0;
            for (const id of ["bensin", "transit", "tagihan", "dapur"] as PocketId[]) {
              const p = byId(id);
              const share = Math.floor((amt * p.allocationPct) / 100);
              p.balance = safeInt(p.balance + share);
              allocated += share;
            }
            const remainder = amt - allocated;
            const u = byId("utama");
            u.balance = safeInt(u.balance + remainder);
          } else {
            const u = byId("utama");
            u.balance = safeInt(u.balance + amt);
          }
          const txn: Txn = {
            id: uid("tx"),
            ts: Date.now(),
            title: "Penghasilan masuk",
            category: "income",
            amount: amt,
            pocketId: "utama",
          };
          return { pockets, transactions: [txn, ...state.transactions] };
        });
      },

      payFromPocket(pocketId, amount, merchant) {
        const r = computePayment(get(), {
          pocketId,
          amount,
          merchant,
          title: merchant || "Pembayaran",
          category: categoryForPocket(pocketId),
        });
        if (!r.ok) return { ok: false };
        set({
          pockets: r.pockets,
          transactions: r.transactions,
          berkahEvents: r.berkahEvents,
          totalBerkah: r.totalBerkah,
          lastBerkah: r.lastBerkah,
        });
        return { ok: true, reward: r.reward };
      },

      payQRIS(amount, merchant, pocketId = "dapur") {
        const r = computePayment(get(), {
          pocketId,
          amount,
          merchant,
          title: merchant,
          category: "qris",
        });
        if (!r.ok) return { ok: false };
        set({
          pockets: r.pockets,
          transactions: r.transactions,
          berkahEvents: r.berkahEvents,
          totalBerkah: r.totalBerkah,
          lastBerkah: r.lastBerkah,
        });
        return { ok: true, reward: r.reward };
      },

      topUp(amount, source) {
        const amt = safeInt(amount);
        if (amt <= 0) return;
        set((state) => {
          const pockets = state.pockets.map((p) =>
            p.id === "utama" ? { ...p, balance: safeInt(p.balance + amt) } : p,
          );
          const txn: Txn = {
            id: uid("tx"),
            ts: Date.now(),
            title: `Top Up dari ${source}`,
            category: "topup",
            amount: amt,
            pocketId: "utama",
            merchant: source,
          };
          return { pockets, transactions: [txn, ...state.transactions] };
        });
      },

      transfer(amount, recipient) {
        const amt = safeInt(amount);
        if (amt <= 0) return { ok: false };
        const utama = get().pockets.find((p) => p.id === "utama");
        if (!utama || utama.balance < amt) return { ok: false };
        set((state) => {
          const pockets = state.pockets.map((p) =>
            p.id === "utama" ? { ...p, balance: safeInt(p.balance - amt) } : p,
          );
          const txn: Txn = {
            id: uid("tx"),
            ts: Date.now(),
            title: `Transfer ke ${recipient}`,
            category: "transfer",
            amount: -amt,
            pocketId: "utama",
            merchant: recipient,
          };
          return { pockets, transactions: [txn, ...state.transactions] };
        });
        return { ok: true };
      },

      transitTapIn(station) {
        set({ transit: { tappedIn: true, station, tapInAt: Date.now() } });
      },

      transitTapOut() {
        const state = get();
        if (!state.transit.tappedIn) return { ok: false, fare: TRANSIT_FARE };
        const station = state.transit.station ?? "Stasiun";
        const r = computePayment(state, {
          pocketId: "transit",
          amount: TRANSIT_FARE,
          merchant: "KAI Commuter",
          title: `KRL ${station}`,
          category: "transit",
        });
        if (!r.ok) return { ok: false, fare: TRANSIT_FARE };
        set({
          pockets: r.pockets,
          transactions: r.transactions,
          berkahEvents: r.berkahEvents,
          totalBerkah: r.totalBerkah,
          lastBerkah: r.lastBerkah,
          transit: { tappedIn: false },
        });
        return { ok: true, fare: TRANSIT_FARE, reward: r.reward };
      },

      setAllocation(pocketId, pct) {
        if (pocketId === "utama") return;
        set((state) => {
          let next = Math.max(0, Math.min(40, Math.round(pct)));
          const others = state.pockets
            .filter((p) => p.id !== "utama" && p.id !== pocketId)
            .reduce((s, p) => s + p.allocationPct, 0);
          if (next + others > 100) next = Math.max(0, 100 - others);
          let pockets = state.pockets.map((p) =>
            p.id === pocketId ? { ...p, allocationPct: next } : p,
          );
          const sum = pockets
            .filter((p) => p.id !== "utama")
            .reduce((s, p) => s + p.allocationPct, 0);
          pockets = pockets.map((p) =>
            p.id === "utama" ? { ...p, allocationPct: Math.max(0, 100 - sum) } : p,
          );
          return { pockets };
        });
      },

      toggleAutoSplit() {
        set((state) => ({ autoSplit: !state.autoSplit }));
      },

      accrueGrowth() {
        set((state) => {
          const utama = state.pockets.find((p) => p.id === "utama");
          if (!utama) return {};
          const growth = safeInt(utama.balance * GROWTH_MONTHLY);
          if (growth <= 0) return {};
          const pockets = state.pockets.map((p) =>
            p.id === "utama" ? { ...p, balance: safeInt(p.balance + growth) } : p,
          );
          const txn: Txn = {
            id: uid("tx"),
            ts: Date.now(),
            title: "Imbal hasil otomatis",
            category: "growth",
            amount: growth,
            pocketId: "utama",
          };
          return {
            pockets,
            transactions: [txn, ...state.transactions],
            monthlyGrowth: safeInt(state.monthlyGrowth + growth),
          };
        });
      },

      resetDemo() {
        const cur = get();
        set({
          ...makeDemoFinancials(),
          user: cur.user,
          isLoggedIn: cur.isLoggedIn,
          _hasHydrated: true,
        });
      },

      login(name, phone) {
        set({
          isLoggedIn: true,
          user: { name: name.trim(), phone: phone.trim() },
          // Akun baru: riwayat kosong — balance kantong tetap dari seed
          transactions: [],
          berkahEvents: [],
          totalBerkah: 0,
          lastBerkah: undefined,
        });
      },

      logout() {
        set({ isLoggedIn: false, user: { name: "", phone: "" } });
      },

      setHydrated(v) {
        set({ _hasHydrated: v });
      },
    }),
    {
      name: "linkaja-siap",
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
      skipHydration: true,
      partialize: (s) => ({
        user: s.user,
        isLoggedIn: s.isLoggedIn,
        pockets: s.pockets,
        transactions: s.transactions,
        berkahEvents: s.berkahEvents,
        totalBerkah: s.totalBerkah,
        monthlyGrowth: s.monthlyGrowth,
        autoSplit: s.autoSplit,
        transit: s.transit,
        lastBerkah: s.lastBerkah,
      }),
    },
  ),
);

let _hydrateStarted = false;
/** Dipanggil sekali di RootShell (client) untuk merehidrasi dari localStorage. */
export function hydrateStore(): void {
  if (typeof window === "undefined" || _hydrateStarted) return;
  _hydrateStarted = true;
  Promise.resolve(useAppStore.persist.rehydrate()).then(() => {
    useAppStore.getState().setHydrated(true);
  });
}

/** Hook ringkas untuk menunda render saldo sampai rehidrasi selesai. */
export function useHydrated(): boolean {
  return useAppStore((s) => s._hasHydrated);
}
