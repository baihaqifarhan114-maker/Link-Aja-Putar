"use client";

import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { relativeDayLabel } from "@/lib/format";
import type { Txn } from "@/lib/types";
import { AppHeader } from "@/components/AppHeader";
import { TxnRow } from "@/components/TxnRow";
import { PrimaryButton } from "@/components/PrimaryButton";

function WalletIllustration() {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-28 w-28"
      aria-hidden
    >
      {/* Wallet body */}
      <rect x="10" y="28" width="100" height="62" rx="12" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2.5" />
      {/* Wallet flap */}
      <rect x="10" y="20" width="100" height="28" rx="12" fill="#ECECEF" stroke="#E5E7EB" strokeWidth="2.5" />
      {/* Coin slot detail */}
      <rect x="70" y="38" width="28" height="16" rx="6" fill="#E11B22" opacity="0.15" />
      <rect x="70" y="38" width="28" height="16" rx="6" stroke="#E11B22" strokeWidth="1.5" opacity="0.4" />
      {/* Plus circle */}
      <circle cx="48" cy="66" r="18" fill="#FEF2F2" stroke="#E11B22" strokeWidth="2" strokeDasharray="4 3" />
      {/* Plus icon */}
      <path d="M48 58 V74 M40 66 H56" stroke="#E11B22" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Riwayat() {
  const router = useRouter();
  const txns = useAppStore((s) => s.transactions);

  const groups: { label: string; items: Txn[] }[] = [];
  for (const t of txns) {
    const label = relativeDayLabel(t.ts);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(t);
    else groups.push({ label, items: [t] });
  }

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Riwayat" onBack={() => router.push("/beranda")} />

      <div className="mx-auto w-full max-w-2xl px-5 pb-6 pt-1">
        {txns.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <WalletIllustration />
            <div>
              <p className="text-[16px] font-extrabold text-ink">
                Belum ada transaksi
              </p>
              <p className="mt-1 max-w-[220px] text-[13px] leading-relaxed text-ink-2">
                Mulai bayar dari Kantong untuk melihat riwayatmu di sini.
              </p>
            </div>
            <div className="w-full max-w-[200px]">
              <PrimaryButton
                onClick={() => router.push("/bayar")}
                leftIcon={<QrCode size={16} />}
              >
                Scan QRIS
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((g) => (
              <div key={g.label}>
                <p className="mb-1 text-[11.5px] font-bold uppercase tracking-wide text-muted">
                  {g.label}
                </p>
                <div className="card divide-y divide-line px-3.5">
                  {g.items.map((t) => (
                    <TxnRow key={t.id} txn={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
