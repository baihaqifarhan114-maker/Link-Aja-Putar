"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, CreditCard, type LucideIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { AppHeader } from "@/components/AppHeader";
import { AmountInput } from "@/components/AmountInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useToast } from "@/components/Toast";
import { cx } from "@/lib/cx";

const SOURCES: { key: string; icon: LucideIcon; desc: string }[] = [
  { key: "Bank Transfer", icon: Building2, desc: "BCA, BRI, Mandiri, BNI" },
  { key: "Virtual Account", icon: CreditCard, desc: "Bayar via kode VA" },
];

export default function TopUp() {
  const router = useRouter();
  const toast = useToast();
  const topUp = useAppStore((s) => s.topUp);

  const [amount, setAmount] = useState(100_000);
  const [source, setSource] = useState("Bank Transfer");

  const onConfirm = () => {
    if (amount <= 0) {
      toast.show({ message: "Masukkan nominal dulu", variant: "info" });
      return;
    }
    topUp(amount, source);
    toast.show({
      message: `Top Up ${formatRupiah(amount)} berhasil`,
      variant: "success",
    });
    router.push("/beranda");
  };

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Top Up" onBack={() => router.back()} />

      <div className="mx-auto w-full max-w-2xl space-y-5 px-5 pb-8 pt-1">
        <div>
          <p className="mb-2 text-[13px] font-bold text-ink">Nominal top up</p>
          <AmountInput
            value={amount}
            onChange={setAmount}
            presets={[50_000, 100_000, 200_000, 500_000]}
          />
          <p className="mt-2 text-[11.5px] text-muted">
            Dana masuk ke Kantong Utama.
          </p>
        </div>

        <div>
          <p className="mb-2 text-[13px] font-bold text-ink">Sumber dana</p>
          <div className="space-y-2">
            {SOURCES.map((s) => {
              const Icon = s.icon;
              const active = s.key === source;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSource(s.key)}
                  className={cx(
                    "press flex w-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-left",
                    active ? "border-laja-red" : "border-line",
                  )}
                >
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: "rgba(225,27,34,0.08)" }}
                  >
                    <Icon size={19} className="text-laja-red" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[13.5px] font-bold text-ink">{s.key}</p>
                    <p className="text-[11.5px] text-ink-2">{s.desc}</p>
                  </div>
                  <span
                    className={cx(
                      "grid h-5 w-5 place-items-center rounded-full border-2",
                      active ? "border-laja-red" : "border-line",
                    )}
                  >
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-laja-red" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <PrimaryButton onClick={onConfirm} disabled={amount <= 0}>
          Konfirmasi {formatRupiah(amount)}
        </PrimaryButton>
      </div>
    </div>
  );
}
