"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { PocketId } from "@/lib/types";
import { LOOP_ORDER } from "@/lib/constants";
import { POCKET_META } from "./meta";

const C = 160;

type Pt = { x: number; y: number };

const NODE_POS: Record<PocketId, Pt> = {
  bensin: { x: 160, y: 48 },
  transit: { x: 272, y: 160 },
  tagihan: { x: 160, y: 272 },
  dapur: { x: 48, y: 160 },
  utama: { x: 160, y: 160 },
};

const NODE_LABEL: Record<PocketId, string> = {
  bensin: "Bensin",
  transit: "Transit",
  tagihan: "Tagihan",
  dapur: "Dapur",
  utama: "Utama",
};

/** Kurva Bézier yang membusur keluar dari pusat agar membentuk loop yang mulus. */
function curvePath(a: Pt, b: Pt, bow = 30): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  let dx = mx - C;
  let dy = my - C;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const cx = mx + dx * bow;
  const cy = my + dy * bow;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

type Props = {
  from: PocketId;
  to: PocketId;
  /** ubah untuk memutar ulang animasi */
  replayKey?: number;
};

export function BerkahLoop({ from, to, replayKey = 0 }: Props) {
  const reduce = useReducedMotion();
  const activeRef = useRef<SVGPathElement>(null);
  const [dot, setDot] = useState<Pt>(NODE_POS[from]);

  const activeD = curvePath(NODE_POS[from], NODE_POS[to]);

  useEffect(() => {
    const path = activeRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    if (reduce) {
      const p = path.getPointAtLength(total);
      setDot({ x: p.x, y: p.y });
      return;
    }
    const controls = animate(0, 1, {
      duration: 1.8,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5,
      onUpdate: (t) => {
        const p = path.getPointAtLength(t * total);
        setDot({ x: p.x, y: p.y });
      },
    });
    return () => controls.stop();
  }, [from, to, reduce, replayKey, activeD]);

  return (
    <div className="relative mx-auto aspect-square w-[290px]">
      <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="laja-loop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E11B22" />
            <stop offset="100%" stopColor="#C2185B" />
          </linearGradient>
        </defs>

        {/* loop dasar (faint) */}
        {LOOP_ORDER.map((id, i) => {
          const a = NODE_POS[id];
          const b = NODE_POS[LOOP_ORDER[(i + 1) % LOOP_ORDER.length]];
          return (
            <path
              key={id}
              d={curvePath(a, b)}
              fill="none"
              stroke="#ECECEF"
              strokeWidth={7}
              strokeLinecap="round"
            />
          );
        })}

        {/* arc aktif (gradient, digambar) */}
        <motion.path
          ref={activeRef}
          d={activeD}
          fill="none"
          stroke="url(#laja-loop)"
          strokeWidth={7}
          strokeLinecap="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          key={`active-${from}-${to}-${replayKey}`}
        />

        {/* dot bercahaya */}
        <circle cx={dot.x} cy={dot.y} r={13} fill="#C2185B" opacity={0.18} />
        <circle cx={dot.x} cy={dot.y} r={6.5} fill="url(#laja-loop)" />
        <circle cx={dot.x} cy={dot.y} r={2.4} fill="#fff" opacity={0.9} />
      </svg>

      {/* pusat */}
      <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
        <div
          className="grid h-14 w-14 place-items-center rounded-full text-white shadow-float"
          style={{ background: "var(--laja-gradient)" }}
        >
          <motion.span
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw size={22} />
          </motion.span>
        </div>
      </div>

      {/* node kantong */}
      {LOOP_ORDER.map((id) => {
        const pos = NODE_POS[id];
        const meta = POCKET_META[id];
        const Icon = meta.icon;
        const isTarget = id === to;
        const isSource = id === from;
        return (
          <motion.div
            key={id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: `${(pos.x / 320) * 100}%`, top: `${(pos.y / 320) * 100}%` }}
            animate={
              isTarget && !reduce
                ? { scale: [1, 1.14, 1] }
                : { scale: 1 }
            }
            transition={
              isTarget && !reduce
                ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white"
              style={{
                boxShadow: isTarget
                  ? "0 6px 18px rgba(194,24,91,0.35)"
                  : "var(--shadow-card)",
                outline: isSource ? `2px solid ${meta.fg}` : "none",
              }}
            >
              <Icon size={22} style={{ color: meta.fg }} />
            </span>
            <span className="text-[11px] font-bold text-ink">{NODE_LABEL[id]}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
