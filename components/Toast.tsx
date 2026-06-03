"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, RefreshCw, XCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Variant = "success" | "error" | "info" | "siklus";

type ToastInput = {
  message: string;
  variant?: Variant;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastItem = {
  id: string;
  message: string;
  variant: Variant;
  action?: { label: string; onClick: () => void };
};

const ToastCtx = createContext<{ show: (t: ToastInput) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}

const ICON: Record<Variant, ReactNode> = {
  success: <CheckCircle2 size={17} className="shrink-0 text-halal" />,
  error:   <XCircle     size={17} className="shrink-0 text-laja-red" />,
  info:    <Info        size={17} className="shrink-0 text-[#0284C7]" />,
  siklus:  <RefreshCw   size={17} className="shrink-0 text-laja-magenta" />,
};

const BORDER: Record<Variant, string> = {
  success: "border-l-[3.5px] border-halal",
  error:   "border-l-[3.5px] border-laja-red",
  info:    "border-l-[3.5px] border-[#0284C7]",
  siklus:  "border-l-[3.5px] border-laja-magenta",
};

function ToastList({ items, onRemove }: {
  items: ToastItem[];
  onRemove: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    /* Posisi: di atas bottom nav mobile (68px), bottom-6 di desktop.
       Offset kiri 240px di desktop untuk menghindari sidebar.
       fixed → relative ke viewport, bukan ancestor mana pun. */
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[72px] z-[200] flex flex-col-reverse items-center gap-2 px-4 lg:bottom-6 lg:left-[240px]"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 12,  scale: 0.95 }}
            transition={{ type: "spring", damping: 26, stiffness: 380 }}
            className={`pointer-events-auto flex w-full max-w-[360px] items-center gap-3 overflow-hidden rounded-2xl bg-white/96 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur surface-line ${BORDER[t.variant]}`}
          >
            {ICON[t.variant]}
            <p className="flex-1 text-[13px] font-semibold leading-snug text-ink">
              {t.message}
            </p>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  onRemove(t.id);
                }}
                className="press shrink-0 rounded-full bg-laja-red px-3 py-1.5 text-xs font-bold text-white"
              >
                {t.action.label}
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const remove = useCallback((id: string) => {
    setItems((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (t: ToastInput) => {
      seq.current += 1;
      const id = `toast_${seq.current}`;
      const item: ToastItem = {
        id,
        message: t.message,
        variant: t.variant ?? "info",
        action: t.action,
      };
      setItems((cur) => [...cur, item]);
      const duration = t.duration ?? (t.action ? 4800 : 2800);
      window.setTimeout(() => remove(id), duration);
    },
    [remove],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <ToastList items={items} onRemove={remove} />
    </ToastCtx.Provider>
  );
}
