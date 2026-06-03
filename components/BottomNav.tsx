"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, History, Home, QrCode, User, type LucideIcon } from "lucide-react";
import { cx } from "@/lib/cx";

type Item = { label: string; icon: LucideIcon; href: string };

const LEFT: Item[] = [
  { label: "Beranda", icon: Home, href: "/beranda" },
  { label: "Riwayat", icon: History, href: "/riwayat" },
];
const RIGHT: Item[] = [
  { label: "Promo", icon: Gift, href: "/promo" },
  { label: "Akun", icon: User, href: "/akun" },
];

function NavButton({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="press flex flex-1 flex-col items-center gap-0.5 py-1"
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        size={22}
        strokeWidth={active ? 2.6 : 2}
        className={active ? "text-laja-red" : "text-muted"}
      />
      <span
        className={cx(
          "text-[10.5px] font-semibold",
          active ? "text-laja-red" : "text-muted",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="relative z-30 flex shrink-0 items-stretch border-t border-line bg-white px-2 pb-2 pt-2">
      {LEFT.map((it) => (
        <NavButton key={it.href} item={it} active={isActive(it.href)} />
      ))}

      <div className="flex w-[68px] shrink-0 justify-center">
        <Link
          href="/bayar"
          aria-label="Scan QRIS"
          className="press -mt-7 grid h-[58px] w-[58px] place-items-center rounded-2xl text-white shadow-float"
          style={{ background: "var(--laja-gradient)" }}
        >
          <QrCode size={26} strokeWidth={2.4} />
        </Link>
      </div>

      {RIGHT.map((it) => (
        <NavButton key={it.href} item={it} active={isActive(it.href)} />
      ))}
    </nav>
  );
}
