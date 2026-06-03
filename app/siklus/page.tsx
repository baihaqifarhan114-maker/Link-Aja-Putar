"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw, TrendingUp } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import type { PocketId } from "@/lib/types";
import { AppHeader } from "@/components/AppHeader";
import { BerkahLoop } from "@/components/BerkahLoop";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CountUp } from "@/components/CountUp";

const NAME: Record<PocketId, string> = {
  utama: "Utama",
  bensin: "Bensin",
  transit: "Transit",
  tagihan: "Tagihan",
  dapur: "Dapur",
};

export default function Siklus() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const lastBerkah = useAppStore((s) => s.lastBerkah);
  const totalBerkah = useAppStore((s) => s.totalBerkah);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (!lastBerkah || reduce) return;
    const t = window.setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 72,
        origin: { y: 0.35 },
        colors: ["#E11B22", "#C2185B", "#0284C7", "#FFFFFF"],
        disableForReducedMotion: true,
      });
    }, 350);
    return () => window.clearTimeout(t);
  }, [lastBerkah, reduce, replayKey]);

  if (!lastBerkah) {
    return (
      <div className="flex min-h-full flex-col">
        <AppHeader
          mode="page"
          title="Siklus Manfaat"
          onBack={() => router.push("/beranda")}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <span
            className="grid h-16 w-16 place-items-center rounded-full"
            style={{ background: "rgba(194,24,91,0.1)" }}
          >
            <RefreshCw size={28} className="text-laja-magenta" />
          </span>
          <p className="text-[15px] font-extrabold text-ink">
            Belum ada Siklus Manfaat
          </p>
          <p className="text-[13px] leading-relaxed text-ink-2">
            Lakukan transaksi (bayar QRIS atau naik KRL) untuk melihat reward
            mengalir ke kantong berikutnya.
          </p>
          <div className="mt-2 w-full max-w-[240px]">
            <PrimaryButton onClick={() => router.push("/bayar")}>
              Coba Bayar QRIS
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader
        mode="page"
        title="Siklus Manfaat"
        onBack={() => router.push("/beranda")}
      />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-8 pt-1">
        <h2 className="text-center text-[16px] font-extrabold leading-snug text-ink">
          Transaksimu mengisi kantong
          <br />
          kebutuhan berikutnya
        </h2>

        <div className="mt-3">
          <BerkahLoop
            from={lastBerkah.fromPocket}
            to={lastBerkah.toPocket}
            replayKey={replayKey}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-1 rounded-[20px] p-4 text-center text-white shadow-float"
          style={{ background: "var(--laja-gradient)" }}
        >
          <p className="text-[12.5px] text-white/85">Reward Siklus Manfaat</p>
          <CountUp
            value={lastBerkah.amount}
            format={formatRupiah}
            className="text-[30px] font-extrabold tabular-nums"
          />
          <p className="mt-1 text-[12.5px] text-white/90">
            dari Kantong {NAME[lastBerkah.fromPocket]} masuk ke Kantong{" "}
            {NAME[lastBerkah.toPocket]}
          </p>
        </motion.div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-card">
          <div className="flex items-center gap-2 text-[12.5px] text-ink-2">
            <TrendingUp size={16} className="text-laja-magenta" />
            Total reward terkumpul
          </div>
          <span className="text-[14px] font-extrabold tabular-nums text-ink">
            {formatRupiah(totalBerkah)}
          </span>
        </div>

        <div className="mt-auto space-y-2 pt-5">
          <PrimaryButton onClick={() => router.push("/beranda")}>
            Kembali ke Kantongku
          </PrimaryButton>
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[14px] font-bold text-laja-magenta surface-line"
          >
            <RefreshCw size={16} /> Putar ulang animasi
          </button>
        </div>
      </div>
    </div>
  );
}
