"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Fuel,
  QrCode,
  ReceiptText,
  Send,
  SlidersHorizontal,
  Sprout,
  TrainFront,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

const SERVICES: { label: string; icon: LucideIcon; href: string; tint: string; fg: string }[] = [
  { label: "Scan QRIS", icon: QrCode, href: "/bayar", tint: "rgba(225,27,34,0.1)", fg: "#E11B22" },
  { label: "Transit KRL", icon: TrainFront, href: "/transit", tint: "rgba(2,132,199,0.12)", fg: "#0284C7" },
  { label: "Atur Kantong", icon: SlidersHorizontal, href: "/atur", tint: "rgba(79,70,229,0.12)", fg: "#4F46E5" },
  { label: "Top Up", icon: Wallet, href: "/topup", tint: "rgba(14,143,82,0.12)", fg: "#0E8F52" },
  { label: "Transfer", icon: Send, href: "/transfer", tint: "rgba(245,158,11,0.14)", fg: "#D97706" },
  { label: "Tagihan", icon: ReceiptText, href: "/atur", tint: "rgba(194,24,91,0.12)", fg: "#C2185B" },
];

export default function Promo() {
  const router = useRouter();
  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Promo & Layanan" onBack={() => router.push("/beranda")} />

      <div className="mx-auto w-full max-w-3xl space-y-5 px-5 pb-8 pt-1">
        <Link
          href="/siklus"
          className="press relative block overflow-hidden rounded-[22px] p-5 text-white shadow-float"
          style={{ background: "var(--laja-gradient)" }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold">
            <Sprout size={13} /> Eksklusif SIAP
          </span>
          <h2 className="mt-3 text-[20px] font-extrabold leading-tight">
            Siklus Manfaat
          </h2>
          <p className="mt-1 max-w-[250px] text-[12.5px] text-white/85">
            Tiap transaksi mengisi kantong kebutuhan berikutnya secara otomatis —
            reward langsung terasa.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold">
            Lihat cara kerjanya <ArrowRight size={15} />
          </span>
        </Link>

        <div>
          <h3 className="mb-2.5 text-[15px] font-extrabold text-ink">Layanan SIAP</h3>
          <div className="grid grid-cols-3 gap-3">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="press flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-card"
                >
                  <span
                    className="grid h-11 w-11 place-items-center rounded-2xl"
                    style={{ background: s.tint }}
                  >
                    <Icon size={20} style={{ color: s.fg }} />
                  </span>
                  <span className="text-[11.5px] font-semibold text-ink-2">
                    {s.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="card flex items-start gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-halal-soft">
            <Sprout size={19} className="text-halal" />
          </span>
          <div>
            <p className="text-[13.5px] font-bold text-ink">Saldo yang tumbuh otomatis</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-ink-2">
              Sisa di Kantong Utama berkembang lewat reksa dana pasar uang
              ~5,5%/th. Atur alokasinya kapan saja.
            </p>
            <button
              type="button"
              onClick={() => router.push("/atur")}
              className="press mt-2 inline-flex items-center gap-1 text-[12.5px] font-bold text-laja-red"
            >
              Atur kantong <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="card flex items-center gap-3 p-4">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ background: "rgba(245,158,11,0.14)" }}
          >
            <Fuel size={19} style={{ color: "#D97706" }} />
          </span>
          <p className="text-[12.5px] leading-relaxed text-ink-2">
            <span className="font-bold text-ink">Cashback bensin 1%</span> tiap bayar
            di SPBU lewat Kantong Bensin — otomatis masuk ke Siklus Manfaat.
          </p>
        </div>
      </div>
    </div>
  );
}
