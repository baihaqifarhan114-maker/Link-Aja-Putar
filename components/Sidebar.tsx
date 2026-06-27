"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Gift,
  History,
  Home,
  LogOut,
  QrCode,
  TrainFront,
  User,
  type LucideIcon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cx } from "@/lib/cx";
import { BrandLogo } from "./BrandLogo";
import { formatRupiah } from "@/lib/format";

type NavItem = { label: string; icon: LucideIcon; href: string };

const NAV: NavItem[] = [
  { label: "Beranda", icon: Home, href: "/beranda" },
  { label: "Riwayat", icon: History, href: "/riwayat" },
  { label: "Transit", icon: TrainFront, href: "/transit" },
  { label: "Promo", icon: Gift, href: "/promo" },
  { label: "Akun", icon: User, href: "/akun" },
];

function SideNavItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors",
        active
          ? "text-white"
          : "text-ink-2 hover:bg-line hover:text-ink",
      )}
      style={active ? { background: "var(--laja-gradient)" } : undefined}
    >
      <Icon size={19} strokeWidth={active ? 2.6 : 2} />
      {item.label}
    </Link>
  );
}

/** Sidebar desktop (lg+). Hidden di mobile — digantikan BottomNav. */
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const total = useAppStore((s) => s.totalBalance());

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-line bg-white lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <BrandLogo size={36} rounded={10} />
        <div>
          <p className="text-[15px] font-extrabold leading-tight text-ink">LinkAja</p>
          <p className="text-[11px] font-bold text-laja-red">PUTAR</p>
        </div>
      </div>

      {/* User mini-card */}
      <div className="mx-3 mb-4 rounded-2xl bg-bg p-3">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white"
            style={{ background: "var(--laja-gradient)" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-ink">{user.name}</p>
            <p className="text-[11px] tabular-nums text-ink-2">{formatRupiah(total)}</p>
          </div>
        </div>
      </div>

      {/* QRIS CTA */}
      <div className="mx-3 mb-4">
        <Link
          href="/bayar"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold text-white shadow-float"
          style={{ background: "var(--laja-gradient)" }}
        >
          <QrCode size={17} />
          Scan QRIS
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((item) => (
          <SideNavItem key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-line px-3 py-4">
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-ink-2 transition-colors hover:bg-line hover:text-ink"
        >
          <LogOut size={17} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
