"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
};

/** Animasi angka berjalan (count-up) dengan dukungan prefers-reduced-motion. */
export function CountUp({ value, format, duration = 0.8, className }: Props) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration, reduce]);

  return (
    <span className={className} suppressHydrationWarning>
      {format(display)}
    </span>
  );
}
