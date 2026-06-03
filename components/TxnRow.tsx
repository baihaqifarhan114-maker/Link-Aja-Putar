"use client";

import type { Txn } from "@/lib/types";
import { formatRupiah, formatTime } from "@/lib/format";
import { cx } from "@/lib/cx";
import { CATEGORY_META } from "./meta";

export function TxnRow({ txn }: { txn: Txn }) {
  const meta = CATEGORY_META[txn.category];
  const Icon = meta.icon;
  const positive = txn.amount >= 0;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ background: meta.tint }}
      >
        <Icon size={18} style={{ color: meta.fg }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-ink">{txn.title}</p>
        <p className="truncate text-[11.5px] text-muted">
          {txn.merchant ? `${txn.merchant} · ` : ""}
          {formatTime(txn.ts)}
        </p>
      </div>
      <p
        className={cx(
          "shrink-0 text-[13.5px] font-extrabold tabular-nums",
          positive ? "text-halal" : "text-ink",
        )}
      >
        {positive ? "+" : "−"}
        {formatRupiah(Math.abs(txn.amount))}
      </p>
    </div>
  );
}
