"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import type { PocketId } from "@/lib/types";
import { AppHeader } from "@/components/AppHeader";
import { Switch } from "@/components/Switch";
import { Slider } from "@/components/Slider";
import { PrimaryButton } from "@/components/PrimaryButton";
import { POCKET_META } from "@/components/meta";
import { useToast } from "@/components/Toast";

const EDITABLE: PocketId[] = ["bensin", "transit", "tagihan", "dapur"];

export default function Atur() {
  const router = useRouter();
  const toast = useToast();
  const pockets = useAppStore((s) => s.pockets);
  const autoSplit = useAppStore((s) => s.autoSplit);
  const setAllocation = useAppStore((s) => s.setAllocation);
  const toggleAutoSplit = useAppStore((s) => s.toggleAutoSplit);

  const get = (id: PocketId) => pockets.find((p) => p.id === id);
  const sum = EDITABLE.reduce((s, id) => s + (get(id)?.allocationPct ?? 0), 0);
  const utamaPct = Math.max(0, 100 - sum);

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Atur Kantong" onBack={() => router.back()} />

      <div className="mx-auto w-full max-w-2xl space-y-4 px-5 pb-8 pt-1">
        <p className="text-[13px] text-ink-2">Kamu yang atur, bisa diubah kapan saja.</p>

        <div className="card flex items-center justify-between p-4">
          <div className="pr-3">
            <p className="text-[14px] font-bold text-ink">Bagi otomatis saat dana masuk</p>
            <p className="text-[12px] leading-snug text-ink-2">
              Penghasilan langsung dibagi ke kantong sesuai alokasi.
            </p>
          </div>
          <Switch
            checked={autoSplit}
            onChange={toggleAutoSplit}
            label="Bagi otomatis saat dana masuk"
          />
        </div>

        <div className="card space-y-5 p-4">
          {EDITABLE.map((id) => {
            const p = get(id);
            if (!p) return null;
            const meta = POCKET_META[id];
            const Icon = meta.icon;
            return (
              <div key={id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-[13.5px] font-bold text-ink">
                    <span
                      className="grid h-7 w-7 place-items-center rounded-lg"
                      style={{ background: meta.tint }}
                    >
                      <Icon size={15} style={{ color: meta.fg }} />
                    </span>
                    {p.name}
                  </span>
                  <span
                    className="text-[14px] font-extrabold tabular-nums"
                    style={{ color: meta.fg }}
                  >
                    {p.allocationPct}%
                  </span>
                </div>
                <Slider
                  value={p.allocationPct}
                  onChange={(v) => setAllocation(id, v)}
                  accent={meta.fg}
                  ariaLabel={`Alokasi ${p.name}`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-halal-soft px-4 py-3">
          <div>
            <p className="text-[13.5px] font-bold text-halal">
              Sisanya ke Kantong Utama
            </p>
            <p className="text-[11.5px]" style={{ color: "rgba(14,143,82,0.85)" }}>
              Tumbuh otomatis (reksa dana pasar uang)
            </p>
          </div>
          <span className="text-[22px] font-extrabold tabular-nums text-halal">
            {utamaPct}%
          </span>
        </div>

        <p className="text-[11.5px] leading-relaxed text-muted">
          Sisa saldo di Kantong Utama tumbuh otomatis lewat reksa dana pasar uang.
          Maksimum 40% per kantong kebutuhan.
        </p>

        <PrimaryButton
          onClick={() => {
            toast.show({ message: "Pengaturan tersimpan ✓", variant: "success" });
            router.push("/beranda");
          }}
        >
          Simpan
        </PrimaryButton>
      </div>
    </div>
  );
}
