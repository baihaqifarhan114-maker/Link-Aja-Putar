"use client";

import { useEffect, useState } from "react";
import { BatteryMedium, Signal, Wifi } from "lucide-react";
import { formatTime } from "@/lib/format";
import { cx } from "@/lib/cx";

/** Status bar ala perangkat (jam langsung + ikon sinyal). */
export function StatusBar({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(t);
  }, []);

  const tone = variant === "light" ? "text-white" : "text-ink";

  return (
    <div
      className={cx(
        "flex h-9 shrink-0 items-center justify-between px-6 pt-1 text-[13px] font-semibold tnum",
        tone,
      )}
    >
      <span suppressHydrationWarning>{now ? formatTime(now) : "07.41"}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={15} strokeWidth={2.5} />
        <Wifi size={15} strokeWidth={2.5} />
        <BatteryMedium size={18} strokeWidth={2.5} />
      </div>
    </div>
  );
}
