"use client";

import Link from "next/link";
import { History, Plus, QrCode, Send, type LucideIcon } from "lucide-react";

const ACTIONS: { label: string; icon: LucideIcon; href: string }[] = [
  { label: "Scan QRIS", icon: QrCode, href: "/bayar" },
  { label: "Transfer", icon: Send, href: "/transfer" },
  { label: "Top Up", icon: Plus, href: "/topup" },
  { label: "Riwayat", icon: History, href: "/riwayat" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <Link
            key={a.href}
            href={a.href}
            className="press flex flex-col items-center gap-1.5"
          >
            <span className="grid h-[52px] w-full place-items-center rounded-2xl bg-white shadow-card">
              <Icon size={22} className="text-laja-red" />
            </span>
            <span className="text-[11px] font-semibold text-ink-2">{a.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
