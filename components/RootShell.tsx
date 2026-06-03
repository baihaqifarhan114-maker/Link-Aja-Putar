"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";
// eslint-disable-next-line import/no-internal-modules
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { hydrateStore, useAppStore, useHydrated } from "@/lib/store";
import { DeviceFrame } from "./DeviceFrame";
import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { DemoController } from "./DemoController";
import { ToastProvider } from "./Toast";

/** Rute yang tampilkan chrome (nav, sidebar, demo ctrl). */
const APP_ROUTES = [
  "/beranda", "/riwayat", "/promo", "/akun", "/atur",
  "/bayar", "/transit", "/topup", "/transfer", "/siklus", "/berkah",
];
/** Rute publik tanpa auth. */
const PUBLIC_ROUTES = ["/", "/splash", "/login"];

/** "Kedalaman" tiap route untuk menentukan arah animasi. */
const DEPTH: Record<string, number> = {
  "/": 0, "/login": 0, "/splash": 1,
  "/beranda": 2, "/riwayat": 2, "/promo": 2, "/akun": 2,
  "/atur": 3, "/bayar": 3, "/transit": 3,
  "/topup": 3, "/transfer": 3, "/siklus": 3, "/berkah": 3,
};
function routeDepth(p: string) {
  return DEPTH[p] ?? 3;
}

/** Variants slide: custom = direction (+1 forward, -1 back). */
const pageVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 32 }),
  animate: {
    opacity: 1, x: 0,
    transition: { duration: 0.26, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (dir: number) => ({
    opacity: 0, x: dir * -24,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
  }),
};

function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;
  if (!frozen) return <>{children}</>;
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (!hydrated) return;
    const isPublic = PUBLIC_ROUTES.some(
      (r) => pathname === r || pathname.startsWith(`${r}/`),
    );
    if (!isLoggedIn && !isPublic) {
      router.replace("/login");
    }
  }, [hydrated, isLoggedIn, pathname, router]);

  return <>{children}</>;
}

export function RootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // ── direction detector ──
  const prevPathRef = useRef(pathname);
  const [dir, setDir] = useState(1);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      const newDir =
        routeDepth(pathname) >= routeDepth(prevPathRef.current) ? 1 : -1;
      setDir(newDir);
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    hydrateStore();
  }, []);

  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
  const isApp = APP_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
  const showSidebar  = isApp;
  const showBottomNav = isApp;
  const showMobileStatus = isApp;
  const showDemo = !isPublic;

  return (
    <MotionConfig reducedMotion="user">
      <DeviceFrame>
        <ToastProvider>
          <AuthGuard>
            {showSidebar && <Sidebar />}

            <div className="relative flex flex-1 flex-col overflow-hidden">
              {showMobileStatus && (
                <div className="lg:hidden">
                  <StatusBar variant="dark" />
                </div>
              )}

              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence initial={false} custom={dir}>
                  <motion.div
                    key={pathname}
                    custom={dir}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar"
                  >
                    <FrozenRouter>{children}</FrozenRouter>
                  </motion.div>
                </AnimatePresence>
              </div>

              {showBottomNav && (
                <div className="lg:hidden">
                  <BottomNav />
                </div>
              )}
            </div>

            {showDemo && <DemoController />}
          </AuthGuard>
        </ToastProvider>
      </DeviceFrame>
    </MotionConfig>
  );
}
