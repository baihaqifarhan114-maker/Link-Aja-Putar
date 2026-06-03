"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  size?: number;
  color?: string;
};

/** Centang sukses yang "digambar" (SVG path draw). */
export function SuccessCheck({ size = 88, color = "var(--halal)" }: Props) {
  const reduce = useReducedMotion();
  const drawn = reduce ? { pathLength: 1 } : { pathLength: 0 };
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none" aria-hidden>
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        initial={drawn}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M15 27 L23 35 L38 18"
        stroke={color}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={drawn}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.32, duration: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}
