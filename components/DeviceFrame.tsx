"use client";

import type { ReactNode } from "react";

/**
 * Wrapper terluar — full-screen di semua ukuran layar.
 * Di desktop bukan "frame HP"; aplikasi langsung mengisi viewport.
 * Sidebar & content diatur oleh RootShell.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-bg">
      {children}
    </div>
  );
}
