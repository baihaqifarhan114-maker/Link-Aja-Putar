"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { AppHeader } from "@/components/AppHeader";
import { AmountInput } from "@/components/AmountInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useToast } from "@/components/Toast";

export default function Transfer() {
  const router = useRouter();
  const toast = useToast();
  const transfer = useAppStore((s) => s.transfer);
  const utama = useAppStore((s) => s.pockets.find((p) => p.id === "utama"));
  const available = utama?.balance ?? 0;

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  const overBalance = amount > available;
  const canSend = recipient.trim().length > 0 && amount > 0 && !overBalance;

  const onSend = () => {
    if (!recipient.trim()) {
      toast.show({ message: "Isi nama / nomor penerima", variant: "info" });
      return;
    }
    if (amount <= 0) {
      toast.show({ message: "Masukkan nominal dulu", variant: "info" });
      return;
    }
    const res = transfer(amount, recipient.trim());
    if (!res.ok) {
      toast.show({
        message: "Saldo Kantong Utama tidak cukup",
        variant: "error",
        action: { label: "Top Up", onClick: () => router.push("/topup") },
      });
      return;
    }
    toast.show({
      message: `Transfer ${formatRupiah(amount)} ke ${recipient.trim()} berhasil`,
      variant: "success",
    });
    router.push("/beranda");
  };

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Transfer" onBack={() => router.back()} />

      <div className="mx-auto w-full max-w-2xl space-y-4 px-5 pb-8 pt-1">
        <div className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-card">
          <span className="text-[12.5px] text-ink-2">Saldo Kantong Utama</span>
          <span className="text-[14px] font-extrabold tabular-nums text-ink">
            {formatRupiah(available)}
          </span>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-ink">
            Penerima
          </label>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Nama atau nomor HP"
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted focus:border-laja-red"
            aria-label="Penerima"
          />
        </div>

        <div>
          <p className="mb-2 text-[13px] font-bold text-ink">Nominal</p>
          <AmountInput
            value={amount}
            onChange={setAmount}
            presets={[20_000, 50_000, 100_000]}
          />
          {overBalance && (
            <p className="mt-2 text-[12px] font-semibold text-laja-red">
              Nominal melebihi saldo Kantong Utama.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-ink">
            Catatan <span className="font-normal text-muted">(opsional)</span>
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Mis. bayar patungan"
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-[14px] text-ink outline-none placeholder:text-muted focus:border-laja-red"
            aria-label="Catatan"
          />
        </div>

        <PrimaryButton onClick={onSend} disabled={!canSend}>
          Kirim {amount > 0 ? formatRupiah(amount) : ""}
        </PrimaryButton>
      </div>
    </div>
  );
}
