"use client";

import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAppStore, useHydrated } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { CountUp } from "./CountUp";
import { GrowthBadge } from "./GrowthBadge";

/** Kartu saldo utama (gradient brand) dengan count-up, eye-toggle, dan info Berkah. */
export function BalanceCard() {
  const hydrated = useHydrated();
  const total = useAppStore((s) => s.totalBalance());
  const monthlyGrowth = useAppStore((s) => s.monthlyGrowth);
  const totalBerkah = useAppStore((s) => s.totalBerkah);
  const [hidden, setHidden] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-[24px] p-5 text-white shadow-float"
      style={{ background: "var(--laja-gradient)" }}
    >
      <div className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -right-2 top-12 h-24 w-24 rounded-full bg-white/10" />

      <div className="relative flex items-center justify-between">
        <span className="text-[13px] font-semibold text-white/85">Total Saldo</span>
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          aria-label={hidden ? "Tampilkan saldo" : "Sembunyikan saldo"}
          className="press grid h-8 w-8 place-items-center rounded-full bg-white/15"
        >
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="relative mt-2 flex h-[42px] items-center">
        {!hydrated ? (
          <div className="skeleton-on-dark h-9 w-52" />
        ) : hidden ? (
          <span className="text-[34px] font-extrabold tracking-tight">Rp ••••••</span>
        ) : (
          <CountUp
            value={total}
            format={formatRupiah}
            className="text-[34px] font-extrabold tracking-tight tnum"
          />
        )}
      </div>

      <div className="relative mt-3">
        <GrowthBadge amount={monthlyGrowth} variant="onDark" />
      </div>

      <div className="relative mt-3 flex items-center gap-2.5 rounded-2xl bg-white/12 px-3 py-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/20">
          <RefreshCw size={15} />
        </span>
        <div className="flex-1">
          <p className="text-[12.5px] font-bold leading-tight">Siklus Manfaat aktif</p>
          <p className="text-[11px] leading-tight text-white/80">
            Tiap transaksi mengisi kantong kebutuhan berikutnya
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9.5px] uppercase leading-none text-white/70">Total reward</p>
          <p className="text-[14px] font-extrabold tnum">
            {hydrated ? formatRupiah(totalBerkah) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
