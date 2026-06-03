"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "ghost" | "halal";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  leftIcon?: ReactNode;
  "aria-label"?: string;
};

const VARIANT: Record<Variant, string> = {
  primary: "text-white shadow-float",
  secondary: "bg-white text-ink surface-line",
  ghost: "bg-transparent text-laja-red",
  halal: "text-white",
};

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = true,
  className,
  leftIcon,
  ...rest
}: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      aria-label={rest["aria-label"]}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-bold tracking-tight transition-opacity",
        fullWidth && "w-full",
        VARIANT[variant],
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      style={
        variant === "primary"
          ? { background: "var(--laja-gradient)" }
          : variant === "halal"
            ? { background: "var(--halal)" }
            : undefined
      }
    >
      {leftIcon}
      {children}
    </motion.button>
  );
}
