"use client";

import { ChevronRight } from "lucide-react";
import type { Pocket } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { POCKET_META } from "./meta";

type Props = {
  pocket: Pocket;
  onClick: () => void;
  wide?: boolean;
};

const growRing = "0 0 0 2px rgba(19,160,92,0.45)";

export function PocketCard({ pocket, onClick, wide = false }: Props) {
  const meta = POCKET_META[pocket.id];
  const Icon = meta.icon;

  if (wide) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="press w-full overflow-hidden rounded-[20px] bg-white p-4 text-left shadow-card"
      >
        <div className="flex items-center gap-3">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
            style={{
              background: meta.tint,
              boxShadow: pocket.isGrowing ? growRing : undefined,
            }}
          >
            <Icon size={22} style={{ color: meta.fg }} />
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-bold text-ink">{pocket.name}</p>
              {pocket.isGrowing && (
                <span className="rounded-full bg-halal-soft px-2 py-0.5 text-[10px] font-bold text-halal">
                  5,5%/th
                </span>
              )}
            </div>
            <p className="text-[19px] font-extrabold tabular-nums text-ink">
              {formatRupiah(pocket.balance)}
            </p>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </div>
        {pocket.isGrowing && (
          <p className="mt-2 text-[11.5px] font-semibold text-halal">
            🌱 Tumbuh otomatis lewat reksa dana pasar uang
          </p>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="press flex w-full flex-col items-start gap-2 rounded-[18px] bg-white p-3.5 text-left shadow-card"
    >
      <span
        className="grid h-10 w-10 place-items-center rounded-xl"
        style={{ background: meta.tint }}
      >
        <Icon size={19} style={{ color: meta.fg }} />
      </span>
      <div>
        <p className="text-[12.5px] font-semibold text-ink-2">{pocket.name}</p>
        <p className="text-[15px] font-extrabold tabular-nums text-ink">
          {formatRupiah(pocket.balance)}
        </p>
      </div>
    </button>
  );
}
