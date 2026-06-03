"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Store } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { QRIS_MERCHANTS } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import type { PocketId } from "@/lib/types";
import { AppHeader } from "@/components/AppHeader";
import { AmountInput } from "@/components/AmountInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SuccessCheck } from "@/components/SuccessCheck";
import { POCKET_META } from "@/components/meta";
import { useToast } from "@/components/Toast";
import { cx } from "@/lib/cx";

const SELECTABLE: PocketId[] = ["dapur", "bensin", "transit", "tagihan", "utama"];
const POCKET_NAME: Record<PocketId, string> = {
  utama: "Utama",
  bensin: "Bensin",
  transit: "Transit",
  tagihan: "Tagihan",
  dapur: "Dapur",
};

function pocketForType(type: string): PocketId {
  if (type === "spbu") return "bensin";
  return "dapur";
}

function Scanner() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8">
      <div className="relative aspect-square w-64 overflow-hidden rounded-3xl bg-[#0b0b0f]">
        <span className="absolute left-5 top-5 h-7 w-7 rounded-tl-xl border-l-[3px] border-t-[3px] border-laja-red" />
        <span className="absolute right-5 top-5 h-7 w-7 rounded-tr-xl border-r-[3px] border-t-[3px] border-laja-red" />
        <span className="absolute bottom-5 left-5 h-7 w-7 rounded-bl-xl border-b-[3px] border-l-[3px] border-laja-red" />
        <span className="absolute bottom-5 right-5 h-7 w-7 rounded-br-xl border-b-[3px] border-r-[3px] border-laja-red" />
        <div className="absolute inset-0 grid place-items-center">
          <QrCode size={92} className="text-white/15" />
        </div>
        <motion.div
          className="absolute inset-x-6 h-0.5 bg-laja-red"
          style={{ boxShadow: "0 0 12px 2px rgba(225,27,34,0.8)" }}
          initial={{ top: "14%" }}
          animate={{ top: ["14%", "84%", "14%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p className="mt-5 text-[13px] font-semibold text-ink-2">
        Mengarahkan ke kode QRIS…
      </p>
    </div>
  );
}

export default function Bayar() {
  const router = useRouter();
  const toast = useToast();
  const payQRIS = useAppStore((s) => s.payQRIS);

  const [phase, setPhase] = useState<"scanning" | "form" | "success">("scanning");
  const [merchant, setMerchant] = useState(QRIS_MERCHANTS[0]);
  const [amount, setAmount] = useState(0);
  const [pocketId, setPocketId] = useState<PocketId>("dapur");

  useEffect(() => {
    const m = QRIS_MERCHANTS[Math.floor(Math.random() * QRIS_MERCHANTS.length)];
    const t = window.setTimeout(() => {
      setMerchant(m);
      setPocketId(pocketForType(m.type));
      setPhase("form");
    }, 1200);
    return () => window.clearTimeout(t);
  }, []);

  const onPay = () => {
    if (amount <= 0) {
      toast.show({ message: "Masukkan nominal dulu", variant: "info" });
      return;
    }
    const res = payQRIS(amount, merchant.name, pocketId);
    if (!res.ok) {
      toast.show({
        message: "Saldo kantong tidak cukup",
        variant: "error",
        action: { label: "Top Up", onClick: () => router.push("/topup") },
      });
      return;
    }
    setPhase("success");
    window.setTimeout(() => {
      if (res.reward && res.reward > 0) {
        router.push("/siklus");
      } else {
        toast.show({
          message: `Bayar ${formatRupiah(amount)} berhasil`,
          variant: "success",
        });
        router.push("/beranda");
      }
    }, 850);
  };

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Scan QRIS" onBack={() => router.back()} />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-8 pt-1">
        {phase === "scanning" && <Scanner />}

        {phase === "form" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: "rgba(225,27,34,0.1)" }}
              >
                <Store size={22} className="text-laja-red" />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-muted">Merchant terdeteksi</p>
                <p className="text-[15px] font-extrabold text-ink">{merchant.name}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[13px] font-bold text-ink">Nominal</p>
              <AmountInput
                value={amount}
                onChange={setAmount}
                presets={[18_000, 50_000, 100_000]}
              />
            </div>

            <div>
              <p className="mb-2 text-[13px] font-bold text-ink">Bayar dari kantong</p>
              <div className="flex flex-wrap gap-2">
                {SELECTABLE.map((id) => {
                  const meta = POCKET_META[id];
                  const Icon = meta.icon;
                  const active = id === pocketId;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPocketId(id)}
                      className={cx(
                        "press inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold",
                        active
                          ? "border-transparent text-white"
                          : "border-line bg-white text-ink-2",
                      )}
                      style={active ? { background: meta.fg } : undefined}
                    >
                      <Icon size={14} style={active ? undefined : { color: meta.fg }} />
                      {POCKET_NAME[id]}
                    </button>
                  );
                })}
              </div>
            </div>

            <PrimaryButton onClick={onPay} disabled={amount <= 0}>
              Bayar Sekarang
            </PrimaryButton>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <SuccessCheck />
            <p className="text-[15px] font-extrabold text-ink">Pembayaran berhasil</p>
            <p className="text-[13px] text-ink-2">
              {merchant.name} · {formatRupiah(amount)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
