"use client";

import { formatNumber, parseAmount } from "@/lib/format";
import { cx } from "@/lib/cx";

type Props = {
  value: number;
  onChange: (v: number) => void;
  presets?: number[];
  placeholder?: string;
  autoFocus?: boolean;
};

/** Input nominal terformat (Rp1.234.567) + chip preset. */
export function AmountInput({
  value,
  onChange,
  presets,
  placeholder = "0",
  autoFocus,
}: Props) {
  return (
    <div>
      <div className="flex items-end gap-1.5 rounded-2xl border border-line bg-white px-4 py-3 focus-within:border-laja-red">
        <span className="pb-1 text-xl font-bold text-ink-2">Rp</span>
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full bg-transparent text-3xl font-extrabold tabular-nums text-ink outline-none placeholder:text-muted"
          value={value ? formatNumber(value) : ""}
          placeholder={placeholder}
          onChange={(e) => onChange(parseAmount(e.target.value))}
          aria-label="Nominal"
        />
      </div>
      {presets && presets.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={cx(
                "press rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                value === p
                  ? "border-transparent bg-laja-red text-white"
                  : "border-line bg-white text-ink-2",
              )}
            >
              {formatNumber(p)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
