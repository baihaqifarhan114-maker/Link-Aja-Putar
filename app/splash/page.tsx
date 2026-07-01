"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { markSplashShown } from "@/lib/splashState";

export default function Splash() {
  const router = useRouter();
  const reduce = useReducedMotion();

  useEffect(() => {
    const delay = reduce ? 500 : 1900;
    const t = window.setTimeout(() => {
      markSplashShown(); // tandai sudah tampil di sesi SPA ini
      router.replace("/beranda");
    }, delay);
    return () => window.clearTimeout(t);
  }, [router, reduce]);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--laja-gradient)" }}
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -right-20 bottom-24 h-64 w-64 rounded-full bg-white/10" />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 13, stiffness: 200 }}
        className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-[30px] bg-white p-3 shadow-2xl"
      >
        <BrandLogo size={88} rounded={20} />
        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-white/50 blur-md animate-sweep" />
      </motion.div>

      <motion.h1
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.32, duration: 0.5 }}
        className="mt-7 text-[32px] font-extrabold tracking-tight text-white"
      >
        LinkAja{" "}
        <span
          className="rounded-lg bg-white px-2 py-0.5 font-extrabold"
          style={{ color: "#e11b22" }}
        >
          PUTAR
        </span>
      </motion.h1>

      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.55, duration: 0.5 }}
        className="mt-3 text-[14px] font-semibold text-white/90"
      >
        Penghasilan masuk, untung otomatis, transaksi rutin
      </motion.p>

      <div className="absolute bottom-16 h-1 w-44 overflow-hidden rounded-full bg-white/25">
        <motion.div
          className="h-full rounded-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: reduce ? 0.4 : 1.7, ease: "easeInOut" }}
        />
      </div>

      <p className="absolute bottom-7 text-[11px] font-semibold text-white/70">
        BCC StudentsxCEOs 15 — GGMU
      </p>
    </div>
  );
}
