"use client";

import { Bell, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

type Props =
  | { mode: "home"; name: string; onBell?: () => void }
  | { mode: "page"; title: string; onBack: () => void; right?: ReactNode };

/** Header aplikasi: mode "home" (sapaan) atau "page" (judul + tombol kembali). */
export function AppHeader(props: Props) {
  if (props.mode === "home") {
    const initials = props.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <header className="flex items-center justify-between px-5 pb-2 pt-1">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 place-items-center rounded-full text-sm font-extrabold text-white"
            style={{ background: "var(--laja-gradient)" }}
          >
            {initials}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Selamat datang
            </p>
            <h1 className="text-[17px] font-extrabold leading-tight text-ink">
              Halo, {props.name} <span aria-hidden>👋</span>
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={props.onBell}
          aria-label="Notifikasi"
          className="press relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-card"
        >
          <Bell size={20} className="text-ink" />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-laja-red ring-2 ring-white" />
        </button>
      </header>
    );
  }

  return (
    <header className="flex items-center gap-3 px-4 pb-2 pt-1">
      <button
        type="button"
        onClick={props.onBack}
        aria-label="Kembali"
        className="press grid h-10 w-10 place-items-center rounded-full bg-white shadow-card"
      >
        <ChevronLeft size={22} className="text-ink" />
      </button>
      <h1 className="flex-1 text-[17px] font-extrabold text-ink">{props.title}</h1>
      {props.right}
    </header>
  );
}
