"use client";

import { motion, useReducedMotion } from "framer-motion";
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

/** Titik kontrol Bézier yang membusur keluar dari pusat → loop mulus. */
function ctrl(a: Pt, b: Pt, bow = 30): Pt {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  let dx = mx - C;
  let dy = my - C;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  return { x: mx + dx * bow, y: my + dy * bow };
}

function segPath(a: Pt, b: Pt): string {
  const c = ctrl(a, b);
  return `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
}

/** Satu path tertutup melewati seluruh kantong → lintasan komet "berputar". */
function closedLoopPath(): string {
  const ids = LOOP_ORDER;
  let d = `M ${NODE_POS[ids[0]].x} ${NODE_POS[ids[0]].y}`;
  for (let i = 0; i < ids.length; i++) {
    const a = NODE_POS[ids[i]];
    const b = NODE_POS[ids[(i + 1) % ids.length]];
    const c = ctrl(a, b);
    d += ` Q ${c.x} ${c.y} ${b.x} ${b.y}`;
  }
  return `${d} Z`;
}

type Props = {
  from: PocketId;
  to: PocketId;
  /** ubah untuk memutar ulang highlight segmen aktif */
  replayKey?: number;
};

const LOOP_D = closedLoopPath();

export function BerkahLoop({ from, to, replayKey = 0 }: Props) {
  const reduce = useReducedMotion();
  const activeD = segPath(NODE_POS[from], NODE_POS[to]);
  const target = NODE_POS[to];

  return (
    <div className="relative mx-auto aspect-square w-[290px]">
      <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="laja-loop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E11B22" />
            <stop offset="100%" stopColor="#C2185B" />
          </linearGradient>
          {/* path lintasan komet (tak terlihat, hanya acuan gerak) */}
          <path id="putar-loop" d={LOOP_D} fill="none" />
        </defs>

        {/* loop dasar (faint) */}
        <path d={LOOP_D} fill="none" stroke="#ECECEF" strokeWidth={7} strokeLinecap="round" />

        {/* segmen aktif (gradient, digambar masuk) */}
        <motion.path
          key={`active-${from}-${to}-${replayKey}`}
          d={activeD}
          fill="none"
          stroke="url(#laja-loop)"
          strokeWidth={7}
          strokeLinecap="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        {/* komet yang berputar mulus mengelilingi loop (SMIL native, anti-jank) */}
        <g>
          <circle r={13} fill="#C2185B" opacity={0.16} />
          <circle r={6.5} fill="url(#laja-loop)" />
          <circle r={2.4} fill="#fff" opacity={0.9} />
          {reduce ? (
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`${target.x} ${target.y}`}
              dur="0.001s"
              fill="freeze"
            />
          ) : (
            <animateMotion dur="6s" repeatCount="indefinite" rotate="0" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#putar-loop" />
            </animateMotion>
          )}
        </g>
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
            animate={isTarget && !reduce ? { scale: [1, 1.14, 1] } : { scale: 1 }}
            transition={
              isTarget && !reduce
                ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white"
              style={{
                boxShadow: isTarget ? "0 6px 18px rgba(194,24,91,0.35)" : "var(--shadow-card)",
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
