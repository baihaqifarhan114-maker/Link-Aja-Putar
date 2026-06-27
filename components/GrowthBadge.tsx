"use client";

import { Sprout } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { cx } from "@/lib/cx";

type Props = {
  amount: number;
  variant?: "onDark" | "onLight";
};

/** Pil "Tumbuh otomatis +RpX bulan ini". */
export function GrowthBadge({ amount, variant = "onDark" }: Props) {
  const onDark = variant === "onDark";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold",
        onDark ? "bg-white/20 text-white" : "bg-halal-soft text-halal",
      )}
    >
      <Sprout size={13} />
      Tumbuh otomatis +{formatRupiah(amount)} bln ini
    </span>
  );
}
