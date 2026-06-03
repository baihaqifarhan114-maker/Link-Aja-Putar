"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Wallet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { PocketId } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { POCKET_META } from "./meta";
import { BottomSheet } from "./BottomSheet";
import { AmountInput } from "./AmountInput";
import { PrimaryButton } from "./PrimaryButton";
import { TxnRow } from "./TxnRow";
import { useToast } from "./Toast";

type Props = {
  pocketId: PocketId | null;
  onClose: () => void;
};

const PAY_PRESETS = [20_000, 50_000, 100_000];

export function PocketDetailSheet({ pocketId, onClose }: Props) {
  const router = useRouter();
  const toast = useToast();
  const pocket = useAppStore((s) => s.pockets.find((p) => p.id === pocketId));
  const pocketTxns = useAppStore((s) =>
    s.transactions.filter((t) => t.pocketId === pocketId).slice(0, 5),
  );
  const payFromPocket = useAppStore((s) => s.payFromPocket);

  const [mode, setMode] = useState<"detail" | "pay">("detail");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (pocketId) {
      setMode("detail");
      setAmount(0);
    }
  }, [pocketId]);

  const open = pocketId !== null && !!pocket;
  const meta = pocket ? POCKET_META[pocket.id] : POCKET_META.utama;
  const Icon = meta.icon;

  const onPay = () => {
    if (!pocket) return;
    if (amount <= 0) {
      toast.show({ message: "Masukkan nominal dulu", variant: "info" });
      return;
    }
    const res = payFromPocket(pocket.id, amount, `Bayar dari ${pocket.name}`);
    if (!res.ok) {
      toast.show({
        message: "Saldo kantong tidak cukup",
        variant: "error",
        action: {
          label: "Top Up",
          onClick: () => {
            onClose();
            router.push("/topup");
          },
        },
      });
      return;
    }
    onClose();
    if (res.reward && res.reward > 0) {
      router.push("/siklus");
    } else {
      toast.show({
        message: `Pembayaran ${formatRupiah(amount)} berhasil`,
        variant: "success",
      });
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={pocket ? `Kantong ${pocket.name}` : ""}>
      {pocket && (
        <>
          <div
            className="flex items-center gap-3 rounded-2xl p-4"
            style={{ background: meta.tint }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70">
              <Icon size={24} style={{ color: meta.fg }} />
            </span>
            <div>
              <p className="text-[12px] font-semibold text-ink-2">Saldo kantong</p>
              <p className="text-[24px] font-extrabold tabular-nums text-ink">
                {formatRupiah(pocket.balance)}
              </p>
            </div>
          </div>

          {pocket.isGrowing && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-halal-soft px-3 py-2 text-[12px] font-semibold text-halal">
              <Wallet size={15} />
              Tumbuh otomatis 5,5%/th lewat reksa dana pasar uang
            </div>
          )}

          {mode === "detail" ? (
            <>
              <p className="mb-1 mt-4 text-[13px] font-bold text-ink">
                Transaksi terakhir
              </p>
              {pocketTxns.length === 0 ? (
                <p className="py-4 text-center text-[12.5px] text-muted">
                  Belum ada transaksi di kantong ini.
                </p>
              ) : (
                <div className="divide-y divide-line">
                  {pocketTxns.map((t) => (
                    <TxnRow key={t.id} txn={t} />
                  ))}
                </div>
              )}
              <div className="mt-4">
                <PrimaryButton onClick={() => setMode("pay")}>
                  Bayar dari kantong ini
                </PrimaryButton>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMode("detail")}
                className="press mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-2"
              >
                <ChevronLeft size={16} /> Kembali
              </button>
              <p className="mb-2 mt-2 text-[13px] font-bold text-ink">
                Bayar dari {pocket.name}
              </p>
              <AmountInput value={amount} onChange={setAmount} presets={PAY_PRESETS} />
              <div className="mt-4">
                <PrimaryButton onClick={onPay} disabled={amount <= 0}>
                  Bayar Sekarang
                </PrimaryButton>
              </div>
            </>
          )}
        </>
      )}
    </BottomSheet>
  );
}
