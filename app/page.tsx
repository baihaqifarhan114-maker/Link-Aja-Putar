"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useHydrated } from "@/lib/store";
import { hasShownSplash } from "@/lib/splashState";

/**
 * Gerbang masuk.
 * - Belum login → /login
 * - Sudah login + splash belum tampil sesi ini → /splash  ← selalu saat refresh
 * - Sudah login + splash sudah tampil (SPA nav) → /beranda
 */
export default function Index() {
  const router = useRouter();
  const hydrated = useHydrated();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
    // hasShownSplash() hanya true kalau user sudah navigasi ke splash dalam
    // sesi SPA yang sama — setelah refresh penuh selalu false → /splash tampil.
    router.replace(hasShownSplash() ? "/beranda" : "/splash");
  }, [hydrated, isLoggedIn, router]);

  return (
    <div className="h-full w-full" style={{ background: "var(--laja-gradient)" }} />
  );
}
