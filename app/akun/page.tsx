"use client";

import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  LogOut,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { AppHeader } from "@/components/AppHeader";
import { Switch } from "@/components/Switch";
import { useToast } from "@/components/Toast";

export default function Akun() {
  const router = useRouter();
  const toast = useToast();
  const user = useAppStore((s) => s.user);
  const autoSplit = useAppStore((s) => s.autoSplit);
  const toggleAutoSplit = useAppStore((s) => s.toggleAutoSplit);
  const accrueGrowth = useAppStore((s) => s.accrueGrowth);
  const resetDemo = useAppStore((s) => s.resetDemo);
  const logout = useAppStore((s) => s.logout);
  const totalBerkah = useAppStore((s) => s.totalBerkah);
  const total = useAppStore((s) => s.totalBalance());
  const monthlyGrowth = useAppStore((s) => s.monthlyGrowth);

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Akun" onBack={() => router.push("/beranda")} />

      <div className="mx-auto w-full max-w-2xl space-y-4 px-5 pb-8 pt-1">
        <div className="card flex items-center gap-3 p-4">
          <div
            className="grid h-14 w-14 place-items-center rounded-full text-lg font-extrabold text-white"
            style={{ background: "var(--laja-gradient)" }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-extrabold text-ink">{user.name || "—"}</p>
            <p className="text-[12.5px] text-ink-2">{user.phone || "—"}</p>
          </div>
          <span className="rounded-full bg-halal-soft px-2.5 py-1 text-[11px] font-bold text-halal">
            Akun aktif
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <p className="text-[11.5px] text-ink-2">Total saldo</p>
            <p className="text-[18px] font-extrabold tabular-nums text-ink">
              {formatRupiah(total)}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-[11.5px] text-ink-2">Total berkah</p>
            <p className="text-[18px] font-extrabold tabular-nums text-laja-magenta">
              {formatRupiah(totalBerkah)}
            </p>
          </div>
        </div>

        <div className="card flex items-center justify-between p-4">
          <div className="pr-3">
            <p className="text-[14px] font-bold text-ink">Bagi otomatis</p>
            <p className="text-[12px] leading-snug text-ink-2">
              Bagi penghasilan ke kantong saat dana masuk.
            </p>
          </div>
          <Switch checked={autoSplit} onChange={toggleAutoSplit} label="Bagi otomatis" />
        </div>

        <button
          type="button"
          onClick={() => {
            accrueGrowth();
            toast.show({
              message: "Imbal hasil otomatis ditambahkan ke Kantong Utama 📈",
              variant: "success",
            });
          }}
          className="press card flex w-full items-center gap-3 p-4 text-left"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-halal-soft">
            <TrendingUp size={19} className="text-halal" />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-ink">
              Simulasikan pertumbuhan 1 bulan
            </p>
            <p className="text-[12px] text-ink-2">
              Tumbuh otomatis 5,5%/th · sudah +{formatRupiah(monthlyGrowth)} bln ini
            </p>
          </div>
          <ChevronRight size={18} className="text-muted" />
        </button>

        <div className="card p-4">
          <div className="mb-1 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-ink">
            <BadgeCheck size={16} className="text-laja-red" /> Tentang
          </div>
          <p className="text-[12.5px] leading-relaxed text-ink-2">
            LinkAja SIAP (Saldo Inti untuk Aktivitas Pokok) membantu kamu mengelola
            kebutuhan pokok lewat kantong otomatis, Siklus Manfaat, dan saldo yang
            tumbuh otomatis lewat reksa dana pasar uang. BCC StudentsxCEOs 15 — GGMU.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetDemo();
            toast.show({
              message: "Data demo direset ke kondisi awal ✓",
              variant: "success",
            });
          }}
          className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[14px] font-bold text-laja-red surface-line"
        >
          <RotateCcw size={16} /> Reset Data Demo
        </button>

        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[14px] font-bold text-ink-2 surface-line"
        >
          <LogOut size={16} /> Keluar dari akun
        </button>
      </div>
    </div>
  );
}
