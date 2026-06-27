"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Settings2, Sparkles, TrainFront, Wallet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { DEFAULT_INCOME } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import type { PocketId } from "@/lib/types";
import { AppHeader } from "@/components/AppHeader";
import { BalanceCard } from "@/components/BalanceCard";
import { QuickActions } from "@/components/QuickActions";
import { PocketCard } from "@/components/PocketCard";
import { PocketDetailSheet } from "@/components/PocketDetailSheet";
import { BottomSheet } from "@/components/BottomSheet";
import { AmountInput } from "@/components/AmountInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useToast } from "@/components/Toast";

const INCOME_PRESETS = [1_000_000, 2_450_000, 5_000_000];

export default function Beranda() {
  const router = useRouter();
  const toast = useToast();
  const pockets = useAppStore((s) => s.pockets);
  const autoSplit = useAppStore((s) => s.autoSplit);
  const receiveIncome = useAppStore((s) => s.receiveIncome);
  const user = useAppStore((s) => s.user);

  const [selected, setSelected] = useState<PocketId | null>(null);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [incomeAmt, setIncomeAmt] = useState(DEFAULT_INCOME);

  const utama = pockets.find((p) => p.id === "utama");
  const others = pockets.filter((p) => p.id !== "utama");

  const previewSplit = autoSplit
    ? others.map((p) => ({
        id: p.id,
        name: p.name,
        amount: Math.floor((incomeAmt * p.allocationPct) / 100),
      }))
    : [];
  const allocated = previewSplit.reduce((s, x) => s + x.amount, 0);
  const toUtama = Math.max(0, incomeAmt - allocated);

  const confirmIncome = () => {
    if (incomeAmt <= 0) {
      toast.show({ message: "Masukkan nominal dulu", variant: "info" });
      return;
    }
    receiveIncome(incomeAmt);
    setIncomeOpen(false);
    toast.show({
      message: autoSplit
        ? `Penghasilan ${formatRupiah(incomeAmt)} masuk & terbagi otomatis`
        : `Penghasilan ${formatRupiah(incomeAmt)} masuk ke Kantong Utama`,
      variant: "success",
    });
  };

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader
        mode="home"
        name={user.name || "Kamu"}
        onBell={() =>
          toast.show({ message: "Tidak ada notifikasi baru", variant: "info" })
        }
      />

      {/* ── content ── */}
      <div className="mx-auto w-full max-w-3xl space-y-5 px-5 pb-6 pt-1">
        {/* Desktop: 2-col (balance | quick actions stacked) */}
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-5">
          <BalanceCard />

          {/* quick actions */}
          <div className="mt-5 lg:mt-0">
            <QuickActions />

            {/* Terima Penghasilan — di desktop masuk di kolom kanan */}
            <button
              type="button"
              onClick={() => {
                setIncomeAmt(DEFAULT_INCOME);
                setIncomeOpen(true);
              }}
              className="press mt-3 hidden w-full items-center gap-3 rounded-[20px] p-4 text-left text-white shadow-float lg:flex"
              style={{ background: "var(--laja-gradient-soft)" }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20">
                <Wallet size={20} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-extrabold">💼 Tunjangan & Penghasilan</p>
                <p className="text-[11px] text-white/85">
                  {autoSplit ? "Masuk & terbagi otomatis" : "Ke Kantong Utama"}
                </p>
              </div>
              <ChevronRight size={18} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Terima Penghasilan — mobile */}
        <button
          type="button"
          onClick={() => {
            setIncomeAmt(DEFAULT_INCOME);
            setIncomeOpen(true);
          }}
          className="press flex w-full items-center gap-3 rounded-[20px] p-4 text-left text-white shadow-float lg:hidden"
          style={{ background: "var(--laja-gradient-soft)" }}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20">
            <Wallet size={22} />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-extrabold">💼 Tunjangan & Penghasilan Masuk</p>
            <p className="text-[12px] text-white/85">
              {autoSplit
                ? "Tunjangan transport/BBM masuk & terbagi otomatis"
                : "Masuk ke Kantong Utama"}
            </p>
          </div>
          <ChevronRight size={20} className="text-white/80" />
        </button>

        {/* Cara kerja PUTAR */}
        <div className="rounded-[20px] bg-white p-4 shadow-card">
          <p className="mb-3 text-[12.5px] font-bold text-ink">Cara kerja LinkAja PUTAR</p>
          <div className="flex items-stretch justify-between gap-1.5 text-center">
            <div className="flex-1">
              <div
                className="mx-auto mb-1.5 grid h-10 w-10 place-items-center rounded-xl text-[18px]"
                style={{ background: "rgba(225,27,34,0.10)" }}
              >
                💰
              </div>
              <p className="text-[11.5px] font-extrabold text-ink">Masuk</p>
              <p className="text-[10px] leading-tight text-ink-2">Tunjangan transport & BBM</p>
            </div>
            <div className="flex items-center pt-3 text-muted">→</div>
            <div className="flex-1">
              <div
                className="mx-auto mb-1.5 grid h-10 w-10 place-items-center rounded-xl text-[18px]"
                style={{ background: "rgba(14,143,82,0.12)" }}
              >
                🌱
              </div>
              <p className="text-[11.5px] font-extrabold text-ink">Tumbuh</p>
              <p className="text-[10px] leading-tight text-ink-2">Kantong + reksa dana</p>
            </div>
            <div className="flex items-center pt-3 text-muted">→</div>
            <div className="flex-1">
              <div
                className="mx-auto mb-1.5 grid h-10 w-10 place-items-center rounded-xl text-[18px]"
                style={{ background: "rgba(2,132,199,0.12)" }}
              >
                🔄
              </div>
              <p className="text-[11.5px] font-extrabold text-ink">Berputar</p>
              <p className="text-[10px] leading-tight text-ink-2">Transit · SPBU · Tagihan</p>
            </div>
          </div>
        </div>

        {/* Kantong grid */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-ink">Kantong Kebutuhan</h2>
            <button
              type="button"
              onClick={() => router.push("/atur")}
              className="press inline-flex items-center gap-1 text-[12.5px] font-bold text-laja-red"
            >
              <Settings2 size={14} /> Atur Kantong
            </button>
          </div>
          {utama && (
            <PocketCard pocket={utama} wide onClick={() => setSelected("utama")} />
          )}
          {/* desktop: 4 col, mobile: 2 col */}
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {others.map((p) => (
              <PocketCard key={p.id} pocket={p} onClick={() => setSelected(p.id)} />
            ))}
          </div>
        </div>

        {/* Transit shortcut */}
        <button
          type="button"
          onClick={() => router.push("/transit")}
          className="press flex w-full items-center gap-3 rounded-[20px] bg-white p-4 text-left shadow-card"
        >
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
            style={{ background: "rgba(2,132,199,0.12)" }}
          >
            <TrainFront size={22} style={{ color: "#0284C7" }} />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-ink">Naik KRL / MRT</p>
            <p className="text-[12px] text-ink-2">Tap-in & tap-out dari Kantong Transit</p>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </button>

        {/* Asisten Alokasi (AI) */}
        <button
          type="button"
          onClick={() => router.push("/asisten")}
          className="press flex w-full items-center gap-3 rounded-[20px] p-4 text-left text-white shadow-float"
          style={{ background: "var(--laja-gradient)" }}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20">
            <Sparkles size={22} />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-extrabold">Asisten Alokasi (AI)</p>
            <p className="text-[12px] text-white/85">
              Tanya cara atur uang & langkah berikutnya
            </p>
          </div>
          <ChevronRight size={20} className="text-white/80" />
        </button>
      </div>

      <PocketDetailSheet pocketId={selected} onClose={() => setSelected(null)} />

      <BottomSheet
        open={incomeOpen}
        onClose={() => setIncomeOpen(false)}
        title="Tunjangan & Penghasilan Masuk"
      >
        <p className="mb-3 text-[13px] leading-relaxed text-ink-2">
          Masukkan nominal tunjangan / penghasilan yang diterima.
          {autoSplit
            ? " Dana otomatis terbagi sesuai alokasi kantongmu."
            : " Bagi otomatis sedang nonaktif — dana masuk ke Kantong Utama."}
        </p>
        <AmountInput
          value={incomeAmt}
          onChange={setIncomeAmt}
          presets={INCOME_PRESETS}
        />

        {autoSplit && incomeAmt > 0 && (
          <div className="mt-4 rounded-2xl bg-bg p-3">
            <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wide text-muted">
              Pratinjau pembagian
            </p>
            <div className="space-y-1.5">
              {previewSplit.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-2">{s.name}</span>
                  <span className="font-bold tabular-nums text-ink">
                    {formatRupiah(s.amount)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-line pt-1.5 text-[12.5px]">
                <span className="font-semibold text-halal">
                  Kantong Utama (tumbuh otomatis)
                </span>
                <span className="font-extrabold tabular-nums text-halal">
                  {formatRupiah(toUtama)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <PrimaryButton onClick={confirmIncome} disabled={incomeAmt <= 0}>
            Konfirmasi Terima {formatRupiah(incomeAmt)}
          </PrimaryButton>
        </div>
      </BottomSheet>
    </div>
  );
}
