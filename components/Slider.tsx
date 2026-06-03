"use client";

import { useCallback, useRef } from "react";

type Props = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  accent?: string;
  ariaLabel?: string;
};

/** Slider kustom (pointer + keyboard) — kontrol penuh atas tampilan. */
export function Slider({
  value,
  min = 0,
  max = 40,
  step = 1,
  onChange,
  accent = "var(--laja-red)",
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let p = (clientX - rect.left) / rect.width;
      p = Math.max(0, Math.min(1, p));
      let v = min + p * (max - min);
      v = Math.round(v / step) * step;
      onChange(Math.max(min, Math.min(max, v)));
    },
    [min, max, step, onChange],
  );

  return (
    <div
      ref={ref}
      className="relative h-9 cursor-pointer touch-none select-none"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        setFromClientX(e.clientX);
      }}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onChange(Math.max(min, value - step));
        }
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(Math.min(max, value + step));
        }
      }}
    >
      <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-line" />
      <div
        className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
        style={{ width: `${pct}%`, background: accent }}
      />
      <div
        className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-white"
        style={{
          left: `${pct}%`,
          borderColor: accent,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}
