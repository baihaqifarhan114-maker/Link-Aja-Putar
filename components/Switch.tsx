"use client";

import { motion } from "framer-motion";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
};

/** Toggle dengan knob beranimasi (spring). */
export function Switch({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-[50px] shrink-0 rounded-full transition-colors duration-300"
      style={{ background: checked ? "var(--laja-gradient)" : "#D7D9DE" }}
    >
      <motion.span
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        animate={{ x: checked ? 25 : 4 }}
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
      />
    </button>
  );
}
