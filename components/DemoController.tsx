"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw, RotateCcw, Wallet, Wand2, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { DEFAULT_INCOME } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import { useToast } from "./Toast";

const JUMPS = [
  { label: "Beranda", href: "/beranda" },
  { label: "Bayar", href: "/bayar" },
  { label: "Transit", href: "/transit" },
  { label: "Atur", href: "/atur" },
  { label: "Top Up", href: "/topup" },
  { label: "Transfer", href: "/transfer" },
  { label: "Riwayat", href: "/riwayat" },
  { label: "Siklus", href: "/siklus" },
  { label: "Akun", href: "/akun" },
  { label: "Promo", href: "/promo" },
  { label: "Login", href: "/login" },
  { label: "Splash", href: "/splash" },
];

export function DemoController() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const receiveIncome = useAppStore((s) => s.receiveIncome);
  const resetDemo = useAppStore((s) => s.resetDemo);
  const lastBerkah = useAppStore((s) => s.lastBerkah);

  const go = (href: string) => {
    setOpen(false);
    if (href === "/splash" && typeof window !== "undefined") {
      sessionStorage.removeItem("laja-splash");
    }
    router.push(href);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 340 }}
            className="absolute bottom-[150px] right-3 z-[70] w-[262px] rounded-2xl bg-white p-3.5 shadow-float surface-line lg:bottom-[90px] lg:right-6"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[13px] font-extrabold text-ink">Demo Controller</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="press grid h-6 w-6 place-items-center rounded-full bg-bg text-ink-2"
              >
                <X size={14} />
              </button>
            </div>

            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted">
              Loncat ke layar
            </p>
            <div className="mb-3 grid grid-cols-3 gap-1.5">
              {JUMPS.map((j) => (
                <button
                  key={j.href}
                  type="button"
                  onClick={() => go(j.href)}
                  className="press rounded-lg bg-bg px-2 py-1.5 text-[11px] font-semibold text-ink-2"
                >
                  {j.label}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  receiveIncome(DEFAULT_INCOME);
                  toast.show({
                    message: `Penghasilan ${formatRupiah(DEFAULT_INCOME)} masuk & terbagi`,
                    variant: "success",
                  });
                }}
                className="press flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12.5px] font-bold text-white"
                style={{ background: "var(--laja-gradient)" }}
              >
                <Wallet size={15} /> Terima penghasilan
              </button>
              <button
                type="button"
                onClick={() => {
                  if (lastBerkah) {
                    go("/siklus");
                  } else {
                    toast.show({
                      message: "Belum ada Siklus. Lakukan transaksi dulu.",
                      variant: "info",
                    });
                  }
                }}
                className="press flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12.5px] font-bold"
                style={{ background: "rgba(194,24,91,0.10)", color: "var(--laja-magenta)" }}
              >
                <RefreshCw size={15} /> Replay Siklus
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemo();
                  setOpen(false);
                  toast.show({
                    message: "Demo direset ke kondisi awal",
                    variant: "success",
                  });
                }}
                className="press flex w-full items-center gap-2 rounded-xl bg-bg px-3 py-2 text-left text-[12.5px] font-bold text-ink-2"
              >
                <RotateCcw size={15} /> Reset Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Demo controller"
        className="absolute bottom-24 right-3 z-[65] grid h-12 w-12 place-items-center rounded-full text-white shadow-float lg:bottom-6 lg:right-6"
        style={{ background: "var(--laja-gradient)" }}
      >
        <Wand2 size={20} />
      </motion.button>
    </>
  );
}
